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
var MenuTs = (function (_super) {
    __extends(MenuTs, _super);
    function MenuTs() {
        var _this = _super.call(this) || this;
        /**加载皮肤 */
        _this.skinName = "resource/eui_skins/custom/MenuUI.exml";
        return _this;
    }
    MenuTs.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.tips.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showTips, this);
        this.sourceCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showSourceCode, this);
        this.gameInfo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showGameInfo, this);
    };
    /**
     * 显示玩法说明
     */
    MenuTs.prototype.showTips = function () {
        $PublicData.panel.settle.visible = false;
        $PublicData.panel.history.visible = false;
        $PublicData.panel.localHistory.visible = false;
        $PublicData.panel.sourceCodeG.visible = false;
        $PublicData.panel.gameInfo.visible = false;
        $PublicData.panel.visible = true;
        $PublicData.panel.tips.visible = true;
    };
    /**
     * 显示源码
     */
    MenuTs.prototype.showSourceCode = function () {
        $PublicData.panel.settle.visible = false;
        $PublicData.panel.history.visible = false;
        $PublicData.panel.localHistory.visible = false;
        $PublicData.panel.gameInfo.visible = false;
        $PublicData.panel.tips.visible = false;
        $PublicData.panel.visible = true;
        $PublicData.panel.sourceCodeG.visible = true;
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open('contract/Baccarat.sol', egret.HttpMethod.GET);
        request.setRequestHeader("Content-Type", "application/json");
        request.send();
        request.addEventListener(egret.Event.COMPLETE, function (event) {
            var request = event.currentTarget;
            $PublicData.panel.sourceCodeLabel.text = request.response;
        }, this);
        // let request = new egret.HttpRequest();
        // request.responseType = egret.HttpResponseType.TEXT;
        // request.open($PublicData.getContract, egret.HttpMethod.POST);
        // request.setRequestHeader("Content-Type", "application/json");
        // request.send(JSON.stringify({
        //     "addr": $PublicData.ContractAddress,
        //     "pageSize": 200,
        //     "pageNum": 1,
        // }));
        // request.addEventListener(egret.Event.COMPLETE, (event) => {
        //     let request = <egret.HttpRequest>event.currentTarget;
        //     let data = JSON.parse(request.response);
        //     if (data.result) {
        //         console.log(data.result);
        //         if (data.result.length > 0 && data.result[0].txHash) {
        //             $PublicData.Web3.eth.getTransaction(data.result[0].txHash).then((data) => {
        //                 $PublicData.panel.sourceCodeLabel.text = $PublicData.Web3.utils.hexToUtf8(data.datasourcecode)
        //             })
        //         } else {
        //             $PublicData.panel.sourceCodeLabel.text = "未查询到相关信息";
        //         }
        //     }
        // }, this);
        // request.addEventListener(egret.IOErrorEvent.IO_ERROR, (err) => {
        //     console.log("error:" + String(err));
        // }, this);
    };
    /**
     * 显示游戏信息
     */
    MenuTs.prototype.showGameInfo = function () {
        var _this = this;
        $PublicData.panel.settle.visible = false;
        $PublicData.panel.history.visible = false;
        $PublicData.panel.localHistory.visible = false;
        $PublicData.panel.tips.visible = false;
        $PublicData.panel.sourceCodeG.visible = false;
        $PublicData.panel.visible = true;
        $PublicData.panel.gameInfo.visible = true;
        $PublicData.panel.contractAddr.text = $PublicData.ContractAddress;
        $PublicData.ContractInstance.methods.getCurrentBalance().call().then(function (data) {
            $PublicData.panel.balance.text = $PublicData.Web3.utils.fromWei(data, 'ether');
        });
        $PublicData.ContractInstance.methods.getPublicData().call().then(function (data) {
            $PublicData.panel.gameName.text = data[0];
            $PublicData.panel.creator.text = data[2];
            $PublicData.panel.createTime.text = _this.timestampToTime(data[3] * 1000);
            $PublicData.panel.historyCoin.text = $PublicData.Web3.utils.fromWei(data[4], 'ether');
        });
    };
    /*
转换时间
*/
    MenuTs.prototype.timestampToTime = function (timestamp) {
        var date = new Date(timestamp * 1); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '.';
        var M = this.fillZero(date.getMonth() + 1) + '.';
        var D = this.fillZero(date.getDate()) + ' ';
        var h = this.fillZero(date.getHours()) + ':';
        var m = this.fillZero(date.getMinutes()) + ':';
        var s = this.fillZero(date.getSeconds());
        return Y + M + D + h + m + s;
    };
    MenuTs.prototype.fillZero = function (time) {
        time = time < 10 ? "0" + time : time;
        return time;
    };
    return MenuTs;
}(eui.Component));
__reflect(MenuTs.prototype, "MenuTs");
