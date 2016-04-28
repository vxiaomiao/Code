/**
 * Created by HAO on 2016/3/31.
 */



var SoundButton = cc.MenuItemToggle.extend({

    ctor : function(){
        var sprite    = new cc.Sprite("#soundOn0000.png");
        var animation = new cc.Animation();

        animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("soundOn0000.png"));
        animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("soundOn0001.png"));
        animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("soundOn0002.png"));
        animation.setDelayPerUnit(1/3);

        if(!Sound._silence) {
            var action = cc.animate(animation).repeatForever();
            sprite.runAction(action);
        }
                    //正常状况音乐图标                                  //暂停状况音乐图标
        this._super(new cc.MenuItemSprite(sprite, null, null), new cc.MenuItemImage("#soundOff.png"));
        this.setCallback(this.soundOnOffFunc, this);
    },

    soundOnOffFunc : function(){
        Sound.toggleOnOff();
    }

});







