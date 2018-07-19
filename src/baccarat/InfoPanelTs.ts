class InfoPanelTs extends eui.Component {

    public constructor() {
        super();

        /**加载皮肤 */
        this.skinName = "resource/eui_skins/custom/InfoPanel.exml";
    }

    public history:eui.Group;
    public bankerRate:eui.Label;
    public drawRate:eui.Label;
    public playerRate:eui.Label;
    public banker:eui.Label;
    public player:eui.Label;
    public bankerD:eui.Label;
    public draw:eui.Label;
    public pointDraw:eui.Label;
    public bankerB:eui.Label;
    public playerB:eui.Label;
    public playD:eui.Label;
    public drawArea:eui.Group;
    public localHistory:eui.Group;
    public localHistoryG:eui.Group;
    public settle:eui.Group;
    public playerR1:eui.Image;
    public playerR2:eui.Image;
    public playerR3:eui.Image;
    public bankerR1:eui.Image;
    public bankerR2:eui.Image;
    public bankerR3:eui.Image;
    public totalWin:eui.Label;
    public bankerWin:eui.Label;
    public bankerDWin:eui.Label;
    public bankerBWin:eui.Label;
    public drawWin:eui.Label;
    public playerWin:eui.Label;
    public playerDWin:eui.Label;
    public playBWin:eui.Label;
    public pointDrawWin:eui.Label;
    public tips:eui.Group;
    public tipsContent:eui.Label;
    public sourceCodeG:eui.Group;
    public sourceCodeLabel:eui.Label;
    public gameInfo:eui.Group;
    public gameName:eui.Label;
    public creator:eui.Label;
    public contractAddr:eui.Label;
    public createTime:eui.Label;
    public balance:eui.Label;
    public historyCoin:eui.Label;
    public close:eui.Image;

    protected childrenCreated(): void {
        super.childrenCreated();
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
    }

    private opration(): void {
        this.close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
    }

    private closePanel(): void {
        this.visible = false;
    }
}
