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
var InfoPanelTs = (function (_super) {
    __extends(InfoPanelTs, _super);
    function InfoPanelTs() {
        var _this = _super.call(this) || this;
        /**加载皮肤 */
        _this.skinName = "resource/eui_skins/custom/InfoPanel.exml";
        return _this;
    }
    InfoPanelTs.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.visible = false;
        this.opration();
        this.tipsContent.text = "规则\n" +
            "1.\t纸牌点数不区分花色由A到K，每张牌只算个位数（即10只算个位为0），J、Q、K代表的3张人形牌点数计算为0，其余牌按照各自点数计算。\n" +
            "2.\t游戏开始时，从“闲”家起以交替形式一次一张地发，每家发两张牌，闲家先开牌。 \n" +
            "3.\t玩家可选择投注项目进行投注。\n" +
            "赔率\n" +
            "1.\t下注庄家或闲家时，当庄或闲赢时，赔率为1赔1。\n" +
            "2.\t下注和局（即最终点数一样者）赔率为1赔8。\n" +
            "3.\t下注点和，赔率为1赔32。\n" +
            "4.\t下注“庄对”（闲对）时，1赔11。\n" +
            "5.\t下注“庄天王”（闲天王）时，1赔2。\n" +
            "牌面点数产生规则\n" +
            "1.\t由每一位玩家账户自动产生一个随机数发送到智能合约中。\n" +
            "2.\t在合约里把所有玩家账户自动产生的随机数异或合并成一个最终随机数。\n" +
            "3.\t再抽取最终随机数中的一部分作为生死百家乐的牌面。\n" +
            "4.\t合约最后把生死百家乐的牌面点数返回玩家界面作为出牌结果。\n" +
            "5.\t整个过程无法进行人工干预。\n" +
            "钱包规则\n" +
            "1.\t下注成功后会直接把下注的金额转到合约内。此时如果合约的创建者进行提现，则需要满足提现后合约的余额大于所有玩家已下注金额的8倍。\n" +
            "2.\t玩家下注总额不能超过奖池金额的1/32。" +
            "\n";
    };
    InfoPanelTs.prototype.opration = function () {
        this.close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
    };
    InfoPanelTs.prototype.closePanel = function () {
        this.visible = false;
    };
    return InfoPanelTs;
}(eui.Component));
__reflect(InfoPanelTs.prototype, "InfoPanelTs");
