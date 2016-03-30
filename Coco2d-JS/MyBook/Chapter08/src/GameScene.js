/**
 * Created by HAO on 2016/3/29.
 */

    /*
    * 糖果布局与消除逻辑    *
    * */

var GameLayer = cc.Layer.extend({

    _isTouch    :   true,
    _pointBefore:   null,

    _ui         :   null,
    _mapPanel   :   null,
    _map        :   null,

    _level      :   0,
    _score      :   0,
    _limitStep  :   0,
    _steps      :   0,
    _targetScore:   0,

    _restartBut :   null,


    _moving     :   false,  //糖果正在移动，不接受再次点击事件

    ctor : function(){

        this._super();

        var Wsize = cc.director.getWinSize();
        var bg = new cc.Sprite(res.png_bg);
        bg.attr({
            x  :  Wsize.width/2,
            y  :  Wsize.height/2
        });
        this.addChild(bg, -1);

        var restart_item = new cc.MenuItemImage(res.png_restart, res.png_restart, res.png_restart, this.clickRestartButFunc, this);
        restart_item.attr({
            x   :   Wsize.width/2,
            y   :   200
        });
        restart_item.setScale(2.0);
        this._restartBut = restart_item;

        var mainMenu = new cc.Menu(restart_item);
        mainMenu.attr({
            anchorX : 0,
            anchorY : 0,
            x       : 0,
            y       : 0
        });
        this.addChild(mainMenu, 20);


        var clippingPanel = new cc.ClippingNode();
        this.addChild(clippingPanel, 2);

        this._mapPanel = new cc.Layer();
        this._mapPanel.x = (Wsize.width - GC.USERDATA.CANDY_WIDTH*GC.USERDATA.MAP_SIZE)/2;
        this._mapPanel.y = (Wsize.height- GC.USERDATA.CANDY_WIDTH*GC.USERDATA.MAP_SIZE)/2;
        clippingPanel.addChild(this._mapPanel, 1);

        var stencil = new cc.DrawNode();
        stencil.drawRect(cc.p(this._mapPanel.x, this._mapPanel.y), cc.p(this._mapPanel.x + GC.USERDATA.CANDY_WIDTH*GC.USERDATA.MAP_SIZE, this._mapPanel.y + GC.USERDATA.CANDY_WIDTH*GC.USERDATA.MAP_SIZE), cc.color(0, 0, 0), 1, cc.p(0, 0, 0));
        clippingPanel.stencil = stencil;

        /*
        //判断当前运行环境是否有鼠标事件
        if("touches" in cc.sys.capabilities){
            cc.eventManager.addListener({
                event         : cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan  : this.onTouchBegan.bind(this)
            }, this._mapPanel);
        }
        else {
            cc.eventManager.addListener({
                event         : cc.EventListener.MOUSE,
                onMouseDown   : this.onMouseDown.bind(this)
            }, this._mapPanel);
        }
*/

        cc.eventManager.addListener({
            event         : cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan  : this.onTouchBegan.bind(this),
            onTouchEnded  : this.onTouchEnded.bind(this),
        }, this._mapPanel);

        this.init();

        this._ui = new GameUI(this);
        this.addChild(this._ui, 3);

        /*******测试代码区********/
        //this._ui.showFail();
        //this._ui.showSuccess();

        return true;
    },

    clickRestartButFunc : function(){
      cc.log("clickRestartButFunc.");
        this.scheduleOnce(function(){

            this._steps = 0;
            this._level = Storage.getCurrentLevel();
            this._score = Storage.getCurrentScore();
            this._limitStep   = GC.LEVELSDATA[this._level].limitStep;
            this._targetScore = GC.LEVELSDATA[this._level].targetScore;

            this.scheduleOnce(function(){
                cc.director.runScene(new GameScene());
            }, 0.3);
        }, 0.1);
    },

    init : function () {

        this._steps = 0;
        this._level = Storage.getCurrentLevel();
        this._score = Storage.getCurrentScore();
        this._limitStep   = GC.LEVELSDATA[this._level].limitStep;
        this._targetScore = GC.LEVELSDATA[this._level].targetScore;

        this._map = [];
        for (var i = 0; i<GC.USERDATA.MAP_SIZE; i++){
            var column = [];
            for (var j = 0; j<GC.USERDATA.MAP_SIZE; j++){
                var candyTemp = Candy.createRandomType(i, j);
                this._mapPanel.addChild(candyTemp);

                candyTemp.x = i * GC.USERDATA.CANDY_WIDTH + GC.USERDATA.CANDY_WIDTH/2;
                candyTemp.y = j * GC.USERDATA.CANDY_WIDTH + GC.USERDATA.CANDY_WIDTH/2;

                column.push(candyTemp);
            }
            this._map.push(column);  //二维数组
        }
    },

    onTouchBegan : function (touch, event){
        cc.log("onTouchBegan");
        this._pointBefore  = touch.getLocation();

        return this._isTouch;
    },

    onTouchEnded :function(touch, event){
        cc.log("onTouchEnded.");
        var point  = touch.getLocation();

        //判断点击开始点和结束点是否为同一个点。
        if(this._pointBefore.x==point.x && this._pointBefore.y==point.y) {
            cc.log("The same point.");

            var column = Math.floor((point.x - this._mapPanel.x) / GC.USERDATA.CANDY_WIDTH);
            var row = Math.floor((point.y - this._mapPanel.y) / GC.USERDATA.CANDY_WIDTH);
            cc.log("(" + column + "," + row + ")");

            if (column >= 0 && column <= 9 && row >= 0 && row <= 9) {
                this.popCandy(column, row);
            }
            else {
                cc.log("Other.");
            }
        }
        else {
            cc.log("Not same point.");
        }
    },

    onMouseDown : function (event){
        cc.log("onMouseDown");

        var pointX  = event.getLocationX();
        var pointY  = event.getLocationY();

        var column = Math.floor((pointX - this._mapPanel.x)/GC.USERDATA.CANDY_WIDTH);
        var row    = Math.floor((pointY - this._mapPanel.y)/GC.USERDATA.CANDY_WIDTH);
        cc.log("(" + column + "," + row + ")");

        if(column>=0 && column<=9 && row>=0 && row<=9) {
            this.popCandy(column, row);
        }
        else {
            cc.log("Other.");
        }
    },

    /*
    * 建立集合,存储全部相连的糖果。初始时只有被点击的糖果
    * 遍历集合中的糖果，判断上，下，左，右4个方向的糖果是否跟该糖果是同一个颜色，如果是，则把旁边的糖果加入到数组中。把新糖果加入之前检查是否已经存在。
    * 遍历完集合的时候，相连的糖果就被找出来了
    *
    * 得到相连糖果：=1  不执行消除
    *             >=2 执行消除，增加已用步数，并计算当前得到的分数。
    *             删除后再执行生成新的糖果，同时检查进度。
    *
    * */
    popCandy :function(column, row){
        cc.log("popCandy_column_row = ", column, row);
        if (this._moving){
            return;
        }

        //找出跟点击糖果相连的全部糖果，初始只有点击的糖果
        var joinCandys = [this._map[column][row]];
        cc.log("joinCandy = ", joinCandys.length);
        var index = 0;

        //添加到相连糖果数组中
        var pushIntoCandys = function(element){
            if(joinCandys.indexOf(element) < 0){
                joinCandys.push(element);
                cc.log("pushIntoCandys_joinCandys.length = ", joinCandys.length);
            }
        };

        while (index < joinCandys.length){
            var candy = joinCandys[index];
            //左（存在，并且颜色一样）
            if (this.checkCandyExist(candy._column-1, candy._row) && this._map[candy._column-1][candy._row]._type == candy._type){
               pushIntoCandys(this._map[candy._column-1][candy._row]);
            }

            //右
            if (this.checkCandyExist(candy._column+1, candy._row) && this._map[candy._column+1][candy._row]._type == candy._type){
                pushIntoCandys(this._map[candy._column+1][candy._row]);
            }

            //上
            if (this.checkCandyExist(candy._column, candy._row-1) && this._map[candy._column][candy._row-1]._type == candy._type){
                pushIntoCandys(this._map[candy._column][candy._row-1]);
            }

            //下
            if (this.checkCandyExist(candy._column, candy._row+1) && this._map[candy._column][candy._row+1]._type == candy._type){
                pushIntoCandys(this._map[candy._column][candy._row+1]);
            }
            index++;
        }

        //如果点击的星星周围没有相同颜色的星星，则返回
        cc.log("joinCandys.length = ", joinCandys.length);
        if (joinCandys.length <=1) {
            cc.log("joinCandys.length <=1");
            return;
        }

        this._steps++;
        this.moving = true;

        for (var i = 0; i<joinCandys.length; i++){
            var candy = joinCandys[i];
            this._mapPanel.removeChild(candy);
            this._map[candy._column][candy._row] = null;
        }

        this._score += joinCandys.length * joinCandys.length;
        this.generateNewCandy();
        this.checkSucceedOrFail();
    },

    checkCandyExist : function(i, j){
        if(i>=0 && i<GC.USERDATA.MAP_SIZE && j>=0 &&j<GC.USERDATA.MAP_SIZE){
            cc.log("in.");
            return true;
        }
        cc.log("out.");
        return false;
    },
/*
*
* 补充糖果
* 该列消除了多少个糖果，并在上方生成多少个糖果
*
* */
    generateNewCandy : function(){
        cc.log("generateNewCandy.");
        var maxTime = 0;
        for (var i = 0; i<GC.USERDATA.MAP_SIZE; i++){
            var missCount = 0;
            for (var j = 0; j<this._map[i].length; j++){
                var candy = this._map[i][j];
                if(!candy){
                    var candy = Candy.createRandomType(i, GC.USERDATA.MAP_SIZE + missCount);
                    candy.x   = candy._column * GC.USERDATA.CANDY_WIDTH + GC.USERDATA.CANDY_WIDTH/2;
                    candy.y   = candy._row    * GC.USERDATA.CANDY_WIDTH + GC.USERDATA.CANDY_WIDTH/2;
                    this._mapPanel.addChild(candy);

                    this._map[i][candy._row] = candy;
                    missCount++;
                }
                else {
                    var fallLength = missCount;
                    if(fallLength > 0){
                        var duration = Math.sqrt(2*fallLength/GC.USERDATA.FALL_ACCELERATION);
                        if (duration>maxTime){
                            maxTime = duration;
                        }
                            var action = new cc.MoveTo(duration, candy.x, candy.y - GC.USERDATA.CANDY_WIDTH*fallLength).easing(cc.easeIn(2));
                            candy.runAction(action);
                            candy._row -= fallLength;

                            this._map[i][j] = null;
                            this._map[i][candy._row] = candy;
                    }
                }
            }
            //移除超出地图的临时元素位置
            for(var j = this._map[i].length; j>=GC.USERDATA.MAP_SIZE; j--){
                this._map[i].splice(j, 1);
            }
        }
        this.scheduleOnce(this.finishCandyFalls.bind(this), maxTime);
    },

    checkSucceedOrFail : function(){
        cc.log("this._score = ", this._score);
        cc.log("this._targetScore = ", this._targetScore);
        cc.log("this._steps = ", this._steps);
        cc.log("this._limitStep = ", this._limitStep);

        if(this._score >= this._targetScore){
            this._ui.showSuccess();
            this._isTouch = false;
            this._score += (this._limitStep - this._steps) * 30;
            Storage.setCurrentLevel(this._level+1);
            Storage.setCurrentScore(this._score);
            this.scheduleOnce(function(){
                this._isTouch = true;
                cc.director.runScene(new GameScene());
            }, 3);
        }
        else if(this._steps >= this._limitStep){
            this._ui.showFail();
            this._isTouch = false;
            Storage.setCurrentLevel(0);
            Storage.setCurrentScore(0);
            this.scheduleOnce(function(){
                this._isTouch = true;
                cc.director.runScene(new GameScene());
            }, 3);
        }
    },

    finishCandyFalls : function(){
        this.moving = false;
    }

});

var GameScene = cc.Scene.extend({
    onEnter : function () {
        this._super();

        var layer = new GameLayer();
        this.addChild(layer);
    }
});






























