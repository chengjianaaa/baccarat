class MenuTs extends eui.Component {

    public constructor() {
        super();

        /**加载皮肤 */
        this.skinName = "resource/eui_skins/custom/MenuUI.exml";
    }

    public goHome: eui.Image;
    public tips: eui.Image;
    public gameInfo: eui.Image;
    public sourceCode: eui.Image;

    protected childrenCreated(): void {
        super.childrenCreated();
        this.tips.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showTips, this);
        this.sourceCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showSourceCode, this);
        this.gameInfo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showGameInfo, this);
    }

    /**
     * 显示玩法说明
     */
    private showTips(): void {
        $PublicData.panel.settle.visible = false;
        $PublicData.panel.history.visible = false;
        $PublicData.panel.localHistory.visible = false;
        $PublicData.panel.sourceCodeG.visible = false;
        $PublicData.panel.gameInfo.visible = false;
        $PublicData.panel.visible = true;
        $PublicData.panel.tips.visible = true;
    }

    /**
     * 显示源码
     */
    private showSourceCode(): void {
        $PublicData.panel.settle.visible = false;
        $PublicData.panel.history.visible = false;
        $PublicData.panel.localHistory.visible = false;
        $PublicData.panel.gameInfo.visible = false;
        $PublicData.panel.tips.visible = false;
        $PublicData.panel.visible = true;
        $PublicData.panel.sourceCodeG.visible = true;

        let request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open('contract/Baccarat.sol', egret.HttpMethod.GET);
        request.setRequestHeader("Content-Type", "application/json");
        request.send();
        request.addEventListener(egret.Event.COMPLETE, (event) => {
            let request = <egret.HttpRequest>event.currentTarget;
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
    }

    /**
     * 显示游戏信息
     */
    private showGameInfo() {
        $PublicData.panel.settle.visible = false;
        $PublicData.panel.history.visible = false;
        $PublicData.panel.localHistory.visible = false;
        $PublicData.panel.tips.visible = false;
        $PublicData.panel.sourceCodeG.visible = false;
        $PublicData.panel.visible = true;
        $PublicData.panel.gameInfo.visible = true;

        $PublicData.panel.contractAddr.text = $PublicData.ContractAddress;
        $PublicData.ContractInstance.methods.getCurrentBalance().call().then((data) => {
            $PublicData.panel.balance.text = $PublicData.Web3.utils.fromWei(data, 'ether');
        });
        $PublicData.ContractInstance.methods.getPublicData().call().then((data) => {
            $PublicData.panel.gameName.text = data[0];
            $PublicData.panel.creator.text = data[2];
            $PublicData.panel.createTime.text = this.timestampToTime(data[3] * 1000);
            $PublicData.panel.historyCoin.text = $PublicData.Web3.utils.fromWei(data[4], 'ether');
        });
    }

    /*
转换时间
*/
    private timestampToTime(timestamp) {
        let date = new Date(timestamp * 1); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '.';
        let M = this.fillZero(date.getMonth() + 1) + '.';
        let D = this.fillZero(date.getDate()) + ' ';
        let h = this.fillZero(date.getHours()) + ':';
        let m = this.fillZero(date.getMinutes()) + ':';
        let s = this.fillZero(date.getSeconds());
        return Y + M + D + h + m + s
    }

    private fillZero(time) {
        time = time < 10 ? "0" + time : time;
        return time;
    }
}
