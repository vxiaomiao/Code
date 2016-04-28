/**
 * Created by Bansomin on 4/27/2016.
 */


var GameLayer = cc.Layer.extend({

    _background     :   null,

    _hero           :   null,

    _itemBatchLayer :   null,

    _ui             :   null,

    _touchY         :   0,

    _foodManager    :   null,
    _obstacleManager:   null,

    _mushroomEffect :   null,
    _coffeeEffect   :   null,

    _windEffect     :   false,

    _gameOverUI     :   null,

    ctor : function(){
        this._super();

        Wsize = cc.director.getWinSize();

        //加载移动的背景
        this._background = new GameBackground();
        this.addChild(this._background, -1);

        //添加英雄
        this._hero = new Hero();
        this.addChild(this._hero);

        //
        this._itemBatchLayer = new cc.SpriteBatchNode("res/graphics/texture.png");
        this.addChild(this._itemBatchLayer);

        //信息标签
        this._ui = new GameSceneUI();
        this.addChild(this._ui);
        this._ui.update();

        //触摸
        if('touches' in cc.sys.capabilities){
            cc.eventManager.addListener({
                event          : cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches : true,
                onTouchBegan   : this.onTouchBegan.bind(this),
                onTouchMoved   : this.onTouchMoved.bind(this)
            }, this);
        }
        if("mouse" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event           : cc.EventListener.MOUSE,
                onMouseMove     : this.onMouseMove.bind(this)
            }, this);
        }
        if("keyboard" in cc.sys.capabilities){
            cc.eventManager.addListener({
                event           : cc.EventListener.KEYBOARD,
                onKeyReleased   : this.onKeyReleased
            }, this);
        }

        //加载食物和障碍物
        this._foodManager = new FoodManager(this);
        this._obstacleManager = new ObstacleManager(this);

        this.init();

        return true;
    },

    init : function(){
        Sound.stop();
        Sound.playGameBgMusic();

        if (this._gameOverUI){
            this._gameOverUI.setVisible(false);
        }

        this._ui.setVisible(true);

        //init_Info
        Game.user.lives     =   GameConstants.HERO_LIVES;   //5
        Game.user.score     =   Game.user.distance  =  0;
        Game.gameState      =   GameConstants.GAME_STATE_IDLE;

        this._touchY        =   Wsize.height/2;

        this._hero.x    =   -Wsize.width/2;
        this._hero.y    =   Wsize.height/2;

        this._foodManager.init();
        this._obstacleManager.init();

        this.scheduleUpdate();

        this.stopWindEffect();
        this.stopCoffeeEffect();
        this.stopMushroomEffect();

        //代码测试区
        //this.gameOverFunc();
    },

    onTouchBegan : function(touch, event){
        return true;
    },

    onTouchMoved : function(touch, event){

        if (Game.gameState != GameConstants.GAME_STATE_OVER){
            this._touchY = touch.getLocationY();
        }
        //printf("onTouchMoved_y = ", this._touchY);
    },

    onMouseMove  : function(event){
        printf("onMouseMove");
        if (Game.gameState != GameConstants.GAME_STATE_OVER){
            this._touchY = event.getLocationY();
        }
        //printf("onMouseMove_y = ", this._touchY);
    },

    onKeyReleased: function(keyCode, event){
        printf("onKeyReleased");
        if (keyCode == cc.KEY.escape){
            printf("escape");
            cc.director.popScene();

            //代码测试区
            //Game.gameState = GameConstants.GAME_STATE_OVER;
        }
    },

    //调整英雄的位置
    handleHeroPosition : function(){

        //Rotate _hero based on mouse position
        if (Math.abs(-(this._hero.y - this._touchY) * 0.2) < 30){
            this._hero.setRotation((this._hero.y - this._touchY) * 0.2);
        }

        //Confine the _hero to stage area limit
        if (this._hero.y < this._hero.height * 0.5){
            this._hero.y = this._hero.height * 0.5;
            this._hero.setRotation(0);
        }

        if (this._hero.y > Wsize.height - this._hero.height * 0.5){
            this._hero.y = Wsize.height - this._hero.height * 0.5;
            this._hero.setRotation(0);
        }
    },


    showWindEffect : function(){

        if(this._windEffect) {
            return;
        }
        this._windEffect = new cc.ParticleSystem(res.wind_plist);
        this._windEffect.x = cc.director.getWinSize().width;
        this._windEffect.y = cc.director.getWinSize().height/2;
        this._windEffect.setScaleX(100);
        this.addChild(this._windEffect);
    },

    stopWindEffect   : function(){

        if (this._windEffect){
            this._windEffect.stopSystem();
            this.removeChild(this._windEffect);
            this._windEffect = null;
        }
    },

    showEatEffect : function(itemX, itemY){
        var eat = new cc.ParticleSystem(res.eat_plist);
        eat.setAutoRemoveOnFinish(true);
        eat.attr({
            x   :   itemX,
            y   :   itemY
        });
        this.addChild(eat);
    },

    showCoffeeEffect : function(){

        if (this._coffeeEffect){
            return;
        }
        this._coffeeEffect = new cc.ParticleSystem(res.coffee_plist);
        this.addChild(this._coffeeEffect);
        this._coffeeEffect.x = this._hero.x + this._hero.width/4;
        this._coffeeEffect.y = this._hero.y;
    },

    stopCoffeeEffect : function(){
        if (this._coffeeEffect){
            this._coffeeEffect.stopSystem();
            this.removeChild(this._coffeeEffect);
            this._coffeeEffect = null;
        }
    },

    showMushroomEffect : function(){

        if (this._mushroomEffect){
            return;
        }
        this._mushroomEffect = new cc.ParticleSystem(res.mushroom_plist);
        this.addChild(this._mushroomEffect);
        this._mushroomEffect.x = this._hero.x + this._hero.width/4;
        this._mushroomEffect.y = this._hero.y;
    },

    stopMushroomEffect : function(){

        if (this._mushroomEffect){
            this._mushroomEffect.stopSystem();
            this.removeChild(this._mushroomEffect);
            this._mushroomEffect = null;
        }
    },

    shakeAnimation : function(){
        printf("shakeAnimation.");

        //上下振动
        if (Game.user.hitObstacle > 0){
            this.x = parseInt(Math.random() * Game.user.hitObstacle - Game.user.hitObstacle * 0.5);
            this.y = parseInt(Math.random() * Game.user.hitObstacle - Game.user.hitObstacle * 0.5);
        }
        else if (this.x != 0){
            //If the shake value is 0, reset the stage back to normal.
            // Reset to initial position.
            this.x = 0;
            this.y = 0;
        }
    },

    endGameFunc : function(){
        this.x = 0;
        this.y = 0;
        Game.gameState = GameConstants.GAME_STATE_OVER;

        this.stopMushroomEffect();
        this.stopCoffeeEffect();
        this.stopWindEffect();
    },

    gameOverFunc : function(){

        if(!this._gameOverUI){
            this._gameOverUI = new GameOverUI(this);
            this.addChild(this._gameOverUI);
        }

        this._gameOverUI.setVisible(true);
        this._gameOverUI.init();
        Sound.playLose();
    },

    update : function( dt ){

        printf("speed = ", Game.user.heroSpeed);

        switch (Game.gameState){
            //STATE_idle
            case GameConstants.GAME_STATE_IDLE :

                if (this._hero.x < Wsize.width * 0.5 * 0.5){//TakeOff
                    this._hero.x += ((Wsize.width * 0.5 * 0.5 + 10) - this._hero.x) * 0.05;
                    this._hero.y -= (this._hero.y - this._touchY) * 0.1;

                    Game.user.heroSpeed += (GameConstants.HERO_MIN_SPEED - Game.user.heroSpeed) * 0.05;
                    this._background._speed = Game.user.heroSpeed * dt;
                }
                else {  //flying_changeState
                    Game.gameState      =   GameConstants.GAME_STATE_FLYING;
                    this._hero._state   =   GameConstants.HERO_STATE_FLYING;
                }
                //调整
                this.handleHeroPosition();
                this._ui.update();
                break;

            //STATE_flying
            case GameConstants.GAME_STATE_FLYING :

                /*
                * *代码测试区
                */
                //Game.user.coffee = 1;

                /****************************/

                //If drank coffee___fly faster for a while
                if (Game.user.coffee > 0){
                    Game.user.heroSpeed += (GameConstants.HERO_MAX_SPEED - Game.user.heroSpeed) * 0.2;
                }
                else {
                    this.stopCoffeeEffect();
                }

                /*******************华丽分割********************/

                //If not hit by obstacle, fly normally
                if (Game.user.hitObstacle <= 0){
                    this._hero._state =  GameConstants.HERO_STATE_FLYING;
                    this._hero.y      -= (this._hero.y - this._touchY) * 0.1;

                    //If _hero is flying extremely fast, create a wind effect and show force field around _hero
                    if (Game.user.heroSpeed > GameConstants.HERO_MIN_SPEED + 100){
                        this.showWindEffect();

                        //Animate this._hero faster
                        this._hero.toggleSpeed(true);
                    }
                    else {
                        //Animate _hero normally.
                        this._hero.toggleSpeed(false);
                        this.stopWindEffect();
                    }
                    this.handleHeroPosition();
                }
                else { //Hit by obstacle

                    if (Game.user.coffee <=0){

                        //play _hero animation for obstacle hit
                        if (this._hero._state != GameConstants.HERO_STATE_HIT){
                            this._hero._state  = GameConstants.HERO_STATE_HIT;
                        }

                        //Move _hero to center of the screen
                        this._hero.y    -= (this._hero.y - Wsize.height/2) * 0.1;

                        //spin _hero
                        if (this._hero.y > Wsize.height * 0.5){
                            this._hero.rotation -= Game.user.hitObstacle * 2;
                        }
                        else {
                            this._hero.rotation += Game.user.hitObstacle * 2;
                        }
                    }
                    //If hit by an obstacle
                    Game.user.hitObstacle --;

                    //Camera shake
                    this.shakeAnimation();
                }

                /*******************华丽分割********************/

                //have a mushroom, reduce the value of the power
                if (Game.user.mushroom > 0){
                    Game.user.mushroom -= dt;
                }
                else {
                    this.stopMushroomEffect();
                }

                /*******************华丽分割********************/

                //have a coffee, reduce the value of the power
                if (Game.user.coffee > 0){
                    Game.user.coffee -= dt;
                }

                Game.user.heroSpeed -= (Game.user.heroSpeed - GameConstants.HERO_MIN_SPEED) * 0.01;

                /*******************华丽分割********************/

                //create food items
                this._foodManager.update(this._hero, dt);

                //create obstacles
                this._obstacleManager.update(this._hero, dt);

                //set the background's speed based on hero's speed
                this._background._speed = Game.user.heroSpeed * dt;

                //calculate max distance travelled
                Game.user.distance += (Game.user.heroSpeed * dt) * 0.1;
                this._ui.update();

                break;

            //STATE_GameOver
            case GameConstants.GAME_STATE_OVER :

                this._foodManager.removeAllFunc();
                this._obstacleManager.removeAllFunc();

                //spin _hero
                this._hero.setRotation(30);

                //_hero fall
                //If _hero is still on screen, push him down and outside the screen. Also decrease his speed
                //Checked for +width below because width is > height.Just a safe value.

                if (this._hero.y > -this._hero.height){
                    Game.user.heroSpeed -= Game.user.heroSpeed * dt;
                    this._hero.y -= Wsize.height * dt * 0.8;
                }
                else {
                    //Once _hero moves out, reset speed to 0
                    Game.user.heroSpeed = 0;

                    //stop game tick
                    this.unscheduleUpdate();

                    //GameOver
                    this.gameOverFunc();
                }

                //set the background's speed based on hero's speed
                this._background._speed = Game.user.heroSpeed * dt;
                break;
        }

        if (this._mushroomEffect){
            this._mushroomEffect.x  =   this._hero.x + this._hero.width/4;
            this._mushroomEffect.y  =   this._hero.y;
        }
        if (this._coffeeEffect){
            this._coffeeEffect.x    =   this._hero.x + this._hero.width/4;
            this._coffeeEffect.y    =   this._hero.y;
        }
    }
});

var GameScene = cc.Scene.extend({
    onEnter : function(){
        this._super();

        var layer = new GameLayer();
        this.addChild(layer);
    }
});

















