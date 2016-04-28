/**
 * Created by HAO on 2016/4/1.
 */
    /*
    *
    * 使用缓存池
    *
    * 需要把食物设置为新的随机类型
    *
    * */
var Item = cc.Sprite.extend({

    _type   :   0,

    ctor : function(type){
        this._super("#item" + type + ".png");
        this._type = type;

        return true;
    },

    reuse : function(type){

        this.setSpriteFrame("item" + type + ".png");
        this._type = type;
    },

    unuse : function(){

    }

});

Item.create = function(type){

    if (cc.pool.hasObject(Item)){
        return cc.pool.getFromPool(Item, type);
    }
    else {
        return new Item(type);
    }
}











