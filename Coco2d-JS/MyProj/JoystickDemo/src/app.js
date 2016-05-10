
var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {

        this._super();

        var size = cc.winSize;

        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        var helloLabel = new cc.LabelTTF("JoystickDemo", "Arial", 30);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        this.addChild(helloLabel, 5);

        //加载精灵
        var iconSpr = new cc.Sprite(res.png_Icon);
        iconSpr.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(iconSpr);

        var joystick = new Joystick(res.png_JoystickBG, res.png_Joystick, 50, TouchType.DEFAULT, DirectionType.ALL, iconSpr);
        joystick.setPosition(cc.p(100, 100));
        joystick._callback = this.onCallbackFunc.bind(this);

        /**************************************/
        //joystick.setSpeedWithOneFunc(4);
        joystick.setSpeedWithTwoFunc(3);
        joystick.setOpacityFunc(128);
        //joystick.setJoystickEnabledFunc(false);
        /*************************************/

        joystick.setTag(101);
        this.addChild(joystick);

        return true;
    },

    onCallbackFunc : function () {
        var angle = this.getChildByTag(101).getThisAngleFunc();
        cc.log("callback : ", angle);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

