/**
 * Created by HAO on 2016/3/31.
 */

    /*
    * Sound--全局的对象
    * 实现背景音乐、音效的播放
    *       静音
    * */


var Sound = {
    _silence    :   false,
    _eatEffect  :   0,

    playMenuBgMusic : function(){
        if (!Sound._silence){
            cc.audioEngine.playMusic(res.bgWelcome_mp3, true);
        }
    },

    playGameBgMusic : function(){
        if (!Sound._silence){
            cc.audioEngine.playMusic(res.bgGame_mp3, true);
        }
    },

    playEatEffect   : function(){
        if(!Sound._silence){
            //先停止之前播放的吃音效，否则会因为连续播放过多而报错
            if(Sound._eatEffect){
                cc.audioEngine.stopEffect(Sound._eatEffect);
            }
            Sound._eatEffect = cc.audioEngine.playEffect(res.eat_mp3, false);
        }
    },

    playCoffee : function(){
        if(!Sound._silence){
            cc.audioEngine.playEffect(res.coffee_mp3, false);
        }
    },

    playMushroom : function(){
        if (!Sound._silence){
            cc.audioEngine.playEffect(res.mushroom_mp3, false);
        }
    },

    playHit : function(){
        if (!Sound._silence){
            cc.audioEngine.playEffect(res.hit_mp3, false);
        }
    },

    playHurt : function(){
        if (!Sound._silence){
            cc.audioEngine.playEffect(res.hurt_mp3, false);
        }
    },

    playLose : function(){
        if (!Sound._silence){
            cc.audioEngine.playEffect(res.lose_mp3, false);
        }
    },

    stop : function(){
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
    },

    toggleOnOff : function(){
        if (Sound._silence){
            Sound._silence = false;
            cc.audioEngine.setEffectsVolume(1);
            cc.audioEngine.setMusicVolume(1);
        }
        else {
            Sound._silence = true;
            cc.audioEngine.setEffectsVolume(0);
            cc.audioEngine.setMusicVolume(0);
        }
    }
};






