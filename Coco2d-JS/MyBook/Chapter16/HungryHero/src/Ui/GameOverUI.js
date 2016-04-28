/**
 * Created by Bansomin on 4/27/2016.
 */

var GameOverUI = cc.Layer.extend({

    _scoreText      :   null,
    _gameScene      :   null,
    _distanceText   :   null,

    ctor : function(gameScene){

        this._super();

        this._gameScene =   gameScene;

        Wsize  = cc.director.getWinSize();

        var bg = new cc.LayerColor(cc.color(0, 0, 0, 200), Wsize.width, Wsize.height);
        this.addChild(bg);


        var title = new cc.LabelBMFont("HERO WAS KILLED!!", res.font_fnt);
        title.setColor(cc.color(243, 231, 95));
        title.attr({
            x   :   Wsize.width/2,
            y   :   Wsize.height - 120
        });
        this.addChild(title);

        this._distanceText = new cc.LabelBMFont("DISTANCE TRAVELLED : 0000000", res.font_fnt);
        this._distanceText.attr({
            x   :   Wsize.width/2,
            y   :   title.getPositionY() - 100
        });
        this.addChild(this._distanceText);

        this._scoreText = new cc.LabelBMFont("SCORE : 0000000", res.font_fnt);
        this._scoreText.attr({
            x   :   Wsize.width/2,
            y   :   this._distanceText.getPositionY() - 50
        });
        this.addChild(this._scoreText);

        var replay_item   =   new cc.MenuItemImage("#gameOver_playAgainButton.png", "#gameOver_playAgainButton.png", this.replayFunc.bind(this));
        var about_item    =   new cc.MenuItemImage("#gameOver_aboutButton.png", "#gameOver_aboutButton.png", this.aboutFunc.bind(this));
        var main_item     =   new cc.MenuItemImage("#gameOver_mainButton.png", "#gameOver_mainButton.png", this.backFunc.bind(this));

        var menu        =   new cc.Menu(replay_item, main_item, about_item);
        menu.y =   Wsize.height/2 - 100;
        menu.alignItemsVertically();

        this.addChild(menu);
    },

    init : function(){

        this._distanceText.setString("DISTANCE TRAVELLED :" + Math.floor(Game.user.distance));
        this._scoreText.setString("SCORE :" + Game.user.score);
    },

    replayFunc : function(){
        this._gameScene.init();
    },

    aboutFunc  : function(){
        cc.director.runScene(new AboutScene());
    },

    backFunc   : function(){
        cc.director.runScene(new MenuScene());
    }

});



