/**
 * Created by Bansomin on 05/10/2016.
 */


var TouchType = {
    FOLLOW  :   "FOLLOW",
    DEFAULT :   "DEFAULT"
};

var DirectionType = {
    ALL     :   "ALL",
    FOUR    :   "FOUR",
    EIGHT   :   "EIGHT"
};

var Joystick = cc.Node.extend({

    _stick      :   null,   //摇杆
    _stickBG    :   null,   //摇杆背景

    _listener   :   null,   //监听器

    _target     :   null,   //操控的目标

    _radius     :   0,      //半径
    _angle      :   0,      //角度
    _radian     :   0,      //弧度

    _speed      :   0,      //实际速度
    _speedOne   :   1,      //速度1
    _speedTwo   :   2,
    _opacity        :   0,  //透明度

    _touchType      :   null,   //触摸类型
    _directionType  :   null,   //方向类型

    _callback       :   null,   //回调函数

    ctor : function(stickBG, stick, radius, touchType, directionType, target){

        this._super();

        this._target        =   target;
        this._touchType     =   touchType;
        this._directionType =   directionType;

        //创建摇杆精灵
        this.createStickSpriteFunc(stickBG, stick, radius);

        //初始化触摸
        this.initTouchEventFunc();
    },

    createStickSpriteFunc : function(stickBG, stick, radius){

        this._radius = radius;

        //FOLLOW模式
        if (this._touchType == TouchType.FOLLOW){
            this.setVisible(false);
        }

        //摇杆背景精灵
        this._stickBG = new cc.Sprite(stickBG);
        this._stickBG.setPosition(cc.p(radius, radius));
        this.addChild(this._stickBG);

        //摇杆精灵
        this._stick = new cc.Sprite(stick);
        this._stick.setPosition(cc.p(radius, radius));
        this.addChild(this._stick);

        //根据半径设置缩放比例
        var scale = radius / (this._stickBG.getContentSize().width / 2);
        this._stickBG.setScale(scale);
        this._stick.setScale(scale);

        //设置大小
        this.setContentSize(this._stickBG.getBoundingBox());

        //设置锚点
        this.setAnchorPoint(cc.p(0.5, 0.5));
    },

    initTouchEventFunc : function(){

        this._listener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : false,

            onTouchBegan   : this.onTouchBegan,
            onTouchMoved   : this.onTouchMoved,
            onTouchEnded   : this.onTouchEnded
        });

        //如果存在相同的对象，将被移除
        this.setUserObject(this._listener);

        //添加监听事件
        cc.eventManager.addListener(this._listener, this._stickBG);
    },

    onTouchBegan : function(touch, event){
        printf("onTouchBegan.");

        /*
        * this    joystick
        *
        * target  _stickBG
        *
        * */

        //触摸监听目标
        var target = event.getCurrentTarget();

        var pointLocation   = touch.getLocation();
        //把触摸点坐标转换为相对于目标的模型坐标
        var pointNodeSpace = target.convertToNodeSpace(pointLocation);

        printf("pointLocation = ", pointLocation.x, pointLocation.y);
        printf("pointNodeSpace = ", pointNodeSpace.x, pointNodeSpace.y);

        //如果触摸类型为FOLLOW, 则摇杆的位置为触摸位置, 触摸开始时候显现
        if (target.getParent()._touchType == TouchType.FOLLOW){
            printf("TouchType.FOLLOW.");

            target.getParent().setPosition(pointLocation);
            target.getParent().setVisible(true);
            target.getParent().scheduleUpdate();

            return true;
        }
        else {
            //点与圆心得距离
            var distance = target.getParent().getDistanceFunc(pointNodeSpace, target.getPosition());
            //圆的半径
            var radius   = target.getBoundingBox().width / 2;

            //如果点与圆心距离小于圆的半径, 返回true
            if (radius >= distance){
                target.getParent()._stick.setPosition(pointNodeSpace);
                target.getParent().scheduleUpdate();

                return true;
            }
        }
        return false;
    },

    onTouchMoved : function(touch, event){
        printf("onTouchMoved.");

        //触摸监听目标
        var target = event.getCurrentTarget();

        var pointLocation   = touch.getLocation();
        //把触摸点坐标转换为相对于目标的模型坐标
        var pointNodeSpace = target.convertToNodeSpace(pointLocation);
        printf("pointNodeSpace = ", pointNodeSpace.x, pointNodeSpace.y);
        //点与圆心得距离
        var distance = target.getParent().getDistanceFunc(pointNodeSpace, target.getPosition());
        //圆的半径
        var radius   = target.getBoundingBox().width / 2;

        //如果点与圆心距离小于圆的半径, 控杆跟随触摸点移动
        if (distance <= radius){
            target.getParent()._stick.setPosition(pointNodeSpace);
        }
        else {
            var xx = target.getPositionX() + Math.cos(target.getParent().getRadianFunc(pointNodeSpace)) * target.getParent()._radius;
            var yy = target.getPositionY() + Math.sin(target.getParent().getRadianFunc(pointNodeSpace)) * target.getParent()._radius;

            target.getParent()._stick.setPosition(cc.p(xx, yy));
        }

        //更新角度
        target.getParent().getAngleFunc(pointNodeSpace);

        //设置实际速度
        target.getParent().setSpeedFunc(pointNodeSpace);

        //更新回调
        target.getParent().updateCallbackFunc();
    },

    onTouchEnded : function(touch, event){
        printf("onTouchEnded.");

        //触摸监听目标
        var target = event.getCurrentTarget();

        //如果触摸类型为FOLLOW, 离开触摸后隐藏
        if (target.getPosition()._touchType == TouchType.FOLLOW) {
            target.getParent().setVisible(false);
        }

        //摇杆恢复位置
        target.getParent()._stick.setPosition(target.getPosition());
        target.getParent().unscheduleUpdate();
    },

    //计算触摸的到圆心的距离
    getDistanceFunc : function(point1, point2){

        /*
        * Math.pow()---返回底数的指定次幂
        */
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) +
                         Math.pow(point1.y - point2.y, 2));
    },

    //计算弧度
    getRadianFunc : function(point){

        this._radian = cc.PI / 180 * this.getAngleFunc(point);
        return this._radian;
    },

    //计算角度
    getAngleFunc : function(point){

        var pos = this._stickBG.getPosition();
        this._angle = Math.atan2(point.y - pos.y, point.x - pos.x) * (180 / cc.PI);

        return this._angle;
    },

    //获取角度
    getThisAngleFunc : function(){

        return this._angle;
    },

    //设置实际速度
    setSpeedFunc : function(point){

        //触摸的和遥控杆的距离
        var distance = this.getDistanceFunc(point, this._stickBG.getPosition());

        if (distance < this._radius){
            this._speed = this._speedOne;
        }
        else {
            this._speed = this._speedTwo;
        }
    },

    //一段速
    setSpeedWithOneFunc : function(speed){
        this._speedOne = speed;
    },

    //二段速
    setSpeedWithTwoFunc : function(speed){

        if (this._speedOne < speed){
            this._speedTwo = speed;
        }
        else {
            this._speedTwo = this._speedTwo;
        }
    },

    //透明度
    setOpacityFunc : function(opacity){

        this._opacity = opacity;
        this._stick.setOpacity(opacity);
        this._stickBG.setOpacity(opacity);
    },

    //设置摇杆开关
    setJoystickEnabledFunc : function(isBool){

        if (this._listener != null){
            if (isBool){
                cc.eventManager.addListener(this._listener, this._stickBG);
            }
            else {
                cc.eventManager.removeListener(this._listener);
            }
        }
    },

    allDirectionFunc : function(){

        this._target.x += Math.cos(this._angle * (Math.PI / 180)) * this._speed;
        this._target.y += Math.sin(this._angle * (Math.PI / 180)) * this._speed;
    },

    fourDirectionFunc : function(){
        //上
        if (this._angle > 45 && this._angle < 135) {
            this._target.y += this._speed;
        }
        //下
        else if (this._angle > -135 && this._angle < -45) {
            this._target.y -= this._speed;
        }
        //左
        else if (this._angle <= -135 && this._angle >= -180 || this._angle >= 135 && this._angle < 180) {
            this._target.x -= this._speed;
        }
        else if(this._angle<=45 && this._angle >=0 || this._angle<0 && this._angle>=45){
            this._target.x += this._speed;
        }
    },

    eightDirectionFunc : function() {

        //上
        if (this._angle>67.5 && this._angle<=112.5){
            printf("上");
            this._target.y += this._speed;
        }
        //下
        else if (this._angle>=-112.5 && this._angle<-67.5){
            printf("下");
            this._target.y -= this._speed;
        }
        //左
        else if (this._angle>=-180 && this._angle<-157.7 || this._angle>=157.5 && this._angle<180){
            printf("左");
            this._target.x -= this._speed;
        }
        //右
        else if (this._angle>=0 && this._angle<22.5 || this._angle>=22.5 && this._angle<0){
            printf("右");
            this._target.x += this._speed;
        }
        //左上
        else if (this._angle>=112.5 && this._angle<157.5){
            printf("左上");

            this._target.x -= this._speed / 1.414;
            this._target.y += this._speed / 1.414;
        }
        //右上
        else if (this._angle>=22.5 && this._angle<67.5){
            printf("右上");

            this._target.x += this._speed / 1.414;
            this._target.y += this._speed / 1.414;
        }
        //左下
        else if (this._angle>=-157.5 && this._angle<-112.5){
            printf("左下");

            this._target.x -= this._speed / 1.414;
            this._target.y -= this._speed / 1.414;
        }
        //右下
        else if (this._angle>=-67.5 && this._angle<-22.5){
            printf("右下");

            this._target.x += this._speed / 1.414;
            this._target.y -= this._speed / 1.414;
        }
    },

    updateCallbackFunc : function(){

        if (this._callback && typeof (this._callback) === "function"){
            this._callback();
        }
    },

    //更新移动目标
    update : function(dt){

        switch (this._directionType){

            case DirectionType.ALL :
                this.allDirectionFunc();
                break;
            case DirectionType.FOUR :
                this.fourDirectionFunc();
                break;
            case DirectionType.EIGHT :
                this.eightDirectionFunc();
                break;
            default :
                break;
        }
    },

    onExit : function(){
        this._super();

        //移除监听器
        if (this._listener != null){
            cc.eventManager.removeListener(this._listener);
        }
    }

});


















