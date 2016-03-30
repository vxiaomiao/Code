/**
 * Created by HAO on 2016/3/29.
 */

/*
*
*   对糖果进行封装
*   颜色
*   列
*   行
*
* */

var Candy = cc.Sprite.extend({

    _type  : 0,
    _column: 0,
    _row   : 0,

    ctor : function(type, column, row){
        var name = "res." + "png_" + (type+1).toString();
        this._super(eval(name));

        this.init(type, column, row);
    },

    init : function(type, column, row){
        this._type   = type;
        this._column = column;
        this._row    = row;
    }
});

//静态方法
Candy.createRandomType = function(column, row){

    var candyTemp = new  Candy(parseInt(Math.random() * GC.USERDATA.CANDY_TYPE_COUNT), column, row);
    return candyTemp;
}















