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
var PasswordTs = (function (_super) {
    __extends(PasswordTs, _super);
    function PasswordTs() {
        var _this = _super.call(this) || this;
        /**加载皮肤 */
        _this.skinName = "resource/eui_skins/custom/Password.exml";
        return _this;
    }
    PasswordTs.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.visible = false;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.verifyPwd, this);
        this.close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeModel, this);
    };
    PasswordTs.prototype.verifyPwd = function () {
        var _this = this;
        var promise = this.verifyWalletPwd(this.label.text);
        promise.then(function () {
            _this.visible = false;
        }, function (err) {
            $PublicData.alert.visible = true;
            $PublicData.alert.label.text = "密码错误，请重新输入";
        });
    };
    PasswordTs.prototype.loadWallet = function (pwd) {
        return $PublicData.Web3.eth.accounts.wallet.load(pwd);
    };
    PasswordTs.prototype.verifyWalletPwd = function (pwd) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var wallet = _this.loadWallet(pwd);
                resolve(wallet);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    PasswordTs.prototype.closeModel = function () {
        this.visible = false;
    };
    return PasswordTs;
}(eui.Component));
__reflect(PasswordTs.prototype, "PasswordTs");
