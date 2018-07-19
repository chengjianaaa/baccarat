var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var DIYLoadingUI = (function (_super) {
    __extends(DIYLoadingUI, _super);
    function DIYLoadingUI() {
        var _this = _super.call(this) || this;
        /**加载皮肤 */
        _this.skinName = "resource/eui_skins/custom/Loading.exml";
        return _this;
    }
    DIYLoadingUI.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.operation();
    };
    DIYLoadingUI.prototype.operation = function () {
        this.visible = false;
        this.playAnimation(this.loop, true);
    };
    /**
     * 实现无限循环
     * @param {egret.tween.TweenGroup} target
     * @param {boolean} isLoop
     */
    DIYLoadingUI.prototype.playAnimation = function (target, isLoop) {
        if (isLoop) {
            for (var key in target.items) {
                target.items[key].props = { loop: true };
            }
        }
        target.play();
    };
    return DIYLoadingUI;
}(eui.Component));
__reflect(DIYLoadingUI.prototype, "DIYLoadingUI");
