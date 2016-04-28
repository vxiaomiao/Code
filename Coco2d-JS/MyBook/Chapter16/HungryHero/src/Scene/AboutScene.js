/**
 * Created by HAO on 2016/3/31.
 */

var AboutScene = cc.Scene.extend({

    _backBtn    :   null,

    ctor : function(){
        this._super();

        var Wsize = cc.director.getWinSize();

        var layer = new cc.Layer();
        this.addChild(layer, -1);

        //背景
        var bg = new cc.Sprite(res.bgWelcome_jpg);
        bg.attr({
            x   :   Wsize.width/2,
            y   :   Wsize.height/2
        });
        layer.addChild(bg, 1);

        //文字
        var aboutText = "**Hungry Hero is a free and open source game built on Adobe Flash using Starling Framework.\n\nhttp://www.hungryherogame.com\n\n" +
            " **And this is a cocos2d-js version modified by Kenko.\n\n" +
            " **The concept is very simple. The hero is pretty much always hungry and you need to feed him with food.\n\n" +
            " **You score when your Hero eats food.There are different obstacles that fly in with a \"Look out!\"\n\n" +
            " caution before they appear. Avoid them at all costs. You only have 5 lives. \n\n"+
            " **Try to score as much as possible and also try to travel the longest distance.";
        var helloLabel = new cc.LabelTTF(aboutText, "Arial", 20);
        helloLabel.attr({
            x   :   Wsize.width/2 + 40,
            y   :   Wsize.height/2 + 80
        });
        layer.addChild(helloLabel, 1);

        this._backBtn = new cc.MenuItemImage("#about_backButton.png", "#about_backButton.png", this.backFunc);
        this._backBtn.attr({
            x   :   150,
            y   :   -70
        });
        var menu = new cc.Menu(this._backBtn);
        menu.attr({
            x   :   0,
            y   :   0
        });
        layer.addChild(menu, 1);

        if("keyboard" in cc.sys.capabilities){
            cc.eventManager.addListener({
                event           : cc.EventListener.KEYBOARD,
                onKeyReleased   : this.onKeyReleased
            }, this);
        }

        this.scheduleUpdate();

        return true;
    },

    backFunc : function(){
        Sound.playMushroom();
        cc.director.popScene();
    },

    onKeyReleased : function(keyCode, event){
        cc.log("onKeyReleased");
        if (keyCode == cc.KEY.escape){
            cc.director.popScene();
        }
    },

    //实现动画的上下移动
    update : function(){
        var currentDate = new Date();
        this._backBtn.y = 70 + (Math.cos(currentDate.getTime() * 0.003)) * 10;
    }
});






