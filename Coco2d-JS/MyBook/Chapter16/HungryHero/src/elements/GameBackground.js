/**
 * Created by HAO on 2016/3/31.
 */

var GameBackground = cc.Layer.extend({

    _bg1    :   null,
    _bg2    :   null,
    _bg3    :   null,
    _bg4    :   null,

    _speed  :   5,

    ctor : function(){

        this._super();
        this.scheduleUpdate();

        var buildParallaxBackground = function(texture){

            var layer = new cc.Layer();

            var bg1 = new cc.Sprite(texture);
            bg1.attr({
                x   :   bg1.width/2,
                y   :   bg1.height/2
            });
            layer.addChild(bg1);

            var bg2 = new cc.Sprite(texture);
            bg2.attr({
                x   :   bg2.width/2 + bg2.width,
                y   :   bg2.height/2
            });
            layer.addChild(bg2);

            return layer;
        };

        //sky
        this._bg1 = buildParallaxBackground(res.bgLayer_jpg);
        this.addChild(this._bg1, 1);

        //hill
        this._bg2 = buildParallaxBackground("#bgLayer2.png");
        this.addChild(this._bg2, 2);

        //buildings
        this._bg3 = buildParallaxBackground("#bgLayer3.png");
        this.addChild(this._bg3, 3);

        //trees
        this._bg4 = buildParallaxBackground("#bgLayer4.png");
        this.addChild(this._bg4, 4);

        return true;
    },

    update : function(dt){
        var Wsize = cc.director.getWinSize();

        this._bg1.x -= Math.ceil(this._speed * 0.02);
        if (this._bg1.x < -parseInt(Wsize.width)){
            this._bg1.x = 0;
        }

        this._bg2.x -= Math.ceil(this._speed * 0.2);
        if (this._bg2.x < -parseInt(Wsize.width)){
            this._bg2.x = 0;
        }

        this._bg3.x -= Math.ceil(this._speed * 0.5);
        if (this._bg3.x < -parseInt(Wsize.width)){
            this._bg3.x = 0;
        }

        this._bg4.x -= Math.ceil(this._speed * 1);
        if (this._bg4.x < -parseInt(Wsize.width)){
            this._bg4.x = 0;
        }
    }
});







