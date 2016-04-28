/**
 * Created by HAO on 2016/3/31.
 */

var GameSceneUI = cc.Layer.extend({

    _lifeText       :   null,
    _scoreText      :   null,
    _distanceText   :   null,

    ctor : function(){
        this._super();

        Wsize = cc.director.getWinSize();

        var lifeLabel = new cc.LabelBMFont("L I V E S", res.font_fnt);
        lifeLabel.attr({
            x   :   360,
            y   :   Wsize.height - 25
        });
        this.addChild(lifeLabel);

        this._lifeText = new cc.LabelBMFont("0", res.font_fnt);
        this._lifeText.attr({
            x   :   360,
            y   :   Wsize.height - 60
        });
        this.addChild(this._lifeText);


        var distanceLabel = new cc.LabelBMFont("D I S T A N C E", res.font_fnt);
        distanceLabel.attr({
            x   :   680,
            y   :   Wsize.height - 25
        });
        this.addChild(distanceLabel);

        this._distanceText = new cc.LabelBMFont("0", res.font_fnt);
        this._distanceText.attr({
            x   :   680,
            y   :   Wsize.height - 60
        });
        this.addChild(this._distanceText);

        var scoreLabel = new cc.LabelBMFont("S C O R E", res.font_fnt);
        scoreLabel.attr({
            x   :   915,
            y   :   Wsize.height - 25
        });
        this.addChild(scoreLabel);

        this._scoreText = new cc.LabelBMFont("100", res.font_fnt);
        this._scoreText.attr({
            x   :   915,
            y   :   Wsize.height - 60
        });
        this.addChild(this._scoreText);

        var pauseBut = new cc.MenuItemImage("#pauseButton.png", "#pauseButton.png", this.clickPauseFunc);
        var soundBut = new SoundButton();
        var menu = new cc.Menu(pauseBut, soundBut);
        menu.alignItemsHorizontally(30);
        menu.attr({
            x   :   80,
            y   :   Wsize.height - 45
        });
        this.addChild(menu);

        return true;
    },

    clickPauseFunc : function(){
        if (cc.director.isPaused()){
            cc.director.resume();
        }
        else {
            cc.director.pause();
        }

        if(cc.audioEngine.isMusicPlaying()){
            cc.audioEngine.pauseMusic();
            cc.audioEngine.pauseAllEffects();
        }
        else {
            cc.audioEngine.resumeMusic();
            cc.audioEngine.resumeAllEffects();
        }
    },

    update : function(){
        this._lifeText.setString(Game.user.lives.toString());
        this._scoreText.setString(Game.user.score.toString());
        this._distanceText.setString(parseInt(Game.user.distance).toString());
    }
});











