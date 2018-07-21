import tr = egret.sys.tr;

class Table extends eui.Component {

    public constructor() {
        super();

        /**加载皮肤 */
        this.skinName = "resource/eui_skins/custom/TableUI.exml";
    }

    public pokerAnimalGroup: eui.Group;
    public playerPokerA1: eui.Image;
    public playerPokerA2: eui.Image;
    public playerPokerA3: eui.Image;
    public bankerPokerA1: eui.Image;
    public bankerPokerA2: eui.Image;
    public bankerPokerA3: eui.Image;
    public playPoint: eui.Label;
    public bankerPoint: eui.Label;
    public historyBtn: eui.Image;
    public localHistoryBtn: eui.Image;
    public pool: eui.Label;
    public myBalance: eui.Label;
    public tipsLabel: eui.Label;
    public timeNum: eui.Label;
    public chip1: eui.Image;
    public chip2: eui.Image;
    public chip3: eui.Image;
    public chip4: eui.Image;
    public chip1Active: eui.Image;
    public chip2Active: eui.Image;
    public chip3Active: eui.Image;
    public chip4Active: eui.Image;
    public chip1Label: eui.Label;
    public chip2Label: eui.Label;
    public chip3Label: eui.Label;
    public chip4Label: eui.Label;
    public playerDBet: eui.Rect;
    public bankerDBet: eui.Rect;
    public playerBet: eui.Rect;
    public bankerBet: eui.Rect;
    public drawBet: eui.Rect;
    public pointDrawBet: eui.Rect;
    public playerBBet: eui.Rect;
    public bankerBBet: eui.Rect;
    public addPokerTxt: eui.Label;
    public tip_bg:eui.Image;

    private choosedBetCoin: String = "1"; // 选中下注的金额
    private choosedBetArea: String; // 选中下注的区域
    private choosedBetObj: String; // 选中下注的区域
    private BetCoinIcon: String; // 选中下注的按钮序号
    private timer: number; // 定时器
    private serverTime: any; // 服务器时间
    private settleTime: any; // 结算时间
    private pokerAnimal: egret.tween.TweenGroup;
    private fanalTurnP3: egret.tween.TweenGroup;
    private fanalTurnB3: egret.tween.TweenGroup;
    private pokerAData = {
        playerPokersArr: null,
        bankerPokersArr: null,
        figure1: null,
        figure2: null,
        contractRes: null,
        betPokerNum: null
    };

    protected childrenCreated(): void {
        super.childrenCreated();
        this.getBalance();
        this.watchBet();
        this.settleTime = 10;
        // 选择顶部两个弹窗按钮
        this.localHistoryBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showLocalHistory, this);
        this.historyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showHistory, this);
        // 选择下注币
        this.chip1Label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseCoin.bind(this, this.chip1Label), this);
        this.chip2Label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseCoin.bind(this, this.chip2Label), this);
        this.chip3Label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseCoin.bind(this, this.chip3Label), this);
        this.chip4Label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseCoin.bind(this, this.chip4Label), this);
        // 选择下注区域
        this.playerDBet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseAreaBet.bind(this, this.playerDBet), this);
        this.bankerDBet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseAreaBet.bind(this, this.bankerDBet), this);
        this.playerBet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseAreaBet.bind(this, this.playerBet), this);
        this.bankerBet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseAreaBet.bind(this, this.bankerBet), this);
        this.drawBet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseAreaBet.bind(this, this.drawBet), this);
        this.pointDrawBet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseAreaBet.bind(this, this.pointDrawBet), this);
        this.playerBBet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseAreaBet.bind(this, this.playerBBet), this);
        this.bankerBBet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseAreaBet.bind(this, this.bankerBBet), this);
        //第一轮发牌动画监听
        this.pokerAnimal.addEventListener('complete', () => {
            this.pokerAnimalComplete(this.pokerAData.playerPokersArr, this.pokerAData.bankerPokersArr,
                this.pokerAData.figure1, this.pokerAData.figure2,
                this.pokerAData.contractRes, this.pokerAData.betPokerNum);
        }, this);
        //闲家第二轮增牌动画监听
        this.fanalTurnP3.addEventListener('complete', () => {
            this.playerAnimalComplete(this.pokerAData.playerPokersArr, this.pokerAData.betPokerNum,
                this.pokerAData.contractRes, this.pokerAData.figure1);
        }, this);
        //庄家第二轮增牌动画监听
        this.fanalTurnB3.addEventListener('complete', () => {
            this.bankerAnimalComplete(this.pokerAData.bankerPokersArr, this.pokerAData.contractRes, this.pokerAData.figure2);
        }, this);

        this.getTime();
        this.watchSettle();
        this.timer = setInterval(this.timerBegin.bind(this), 1000);
        this.getPriceArr();
    }

    /**
     * 第一轮发牌动画监听完成
     */
    private pokerAnimalComplete(playerPokersArr, bankerPokersArr, figure1, figure2, contractRes, betPokerNum) {
        egret.Tween.get(this.playerPokerA1)
            .to({scaleX: -1}, 0)
            .to({scaleX: 0}, 500).call(() => {
            this.playerPokerA1.source = "resource/assets/baccarat/poker/" + playerPokersArr[0] + '_' + figure1[0] + '.png';
        }).to({scaleX: 1}, 500);
        egret.Tween.get(this.playerPokerA2)
            .to({scaleX: -1}, 0)
            .to({scaleX: 0}, 500).call(() => {
            this.playerPokerA2.source = "resource/assets/baccarat/poker/" + playerPokersArr[1] + '_' + figure1[1] + '.png';
        }).to({scaleX: 1}, 500);
        egret.Tween.get(this.bankerPokerA1)
            .to({scaleX: -1}, 0)
            .to({scaleX: 0}, 500).call(() => {
            this.bankerPokerA1.source = "resource/assets/baccarat/poker/" + bankerPokersArr[0] + '_' + figure2[0] + '.png';
        }).to({scaleX: 1}, 500);
        egret.Tween.get(this.bankerPokerA2)
            .to({scaleX: -1}, 0)
            .to({scaleX: 0}, 500).call(() => {
            this.bankerPokerA2.source = "resource/assets/baccarat/poker/" + bankerPokersArr[1] + '_' + figure2[1] + '.png';
        }).to({scaleX: 1}, 500).call(() => {
            // 第一轮比牌结果
            let firstTurnPlayer = ((playerPokersArr[0] >= 10 ? 0 : playerPokersArr[0]) + (playerPokersArr[1] >= 10 ? 0 : playerPokersArr[1])) % 10;
            let firstTurnBanker = ((bankerPokersArr[0] >= 10 ? 0 : bankerPokersArr[0]) + (bankerPokersArr[1] >= 10 ? 0 : bankerPokersArr[1])) % 10;

            this.playPoint.text = firstTurnPlayer + '点';
            this.bankerPoint.text = firstTurnBanker + '点';

            let fanal = contractRes[0] > contractRes[1] ? "闲家赢" : contractRes[0] < contractRes[1] ? "庄家赢" : "打平";
            // 增牌逻辑
            if (betPokerNum[0] > 2) {// “闲家”必须增牌
                this.addPokerTxt.text = `闲${firstTurnPlayer}点，庄${firstTurnBanker}点，闲家继续拿牌`;
                this.addPokerTxt.visible = true;
                this.tip_bg.visible=true;
                setTimeout(() => {
                    this.fanalTurnP3.stop();
                    this.fanalTurnP3.play();
                    this.playerPokerA3.visible = true;
                    /******************/
                }, 1000)
            } else {
                // 闲不增庄增
                if (betPokerNum[1] > 2) {
                    this.addPokerTxt.text = `闲${firstTurnPlayer}点，庄${firstTurnBanker}点，庄家继续拿牌`;
                    this.addPokerTxt.visible = true;
                    this.tip_bg.visible=true;
                    this.fanalTurnB3.stop();
                    this.fanalTurnB3.play();
                    this.bankerPokerA3.visible = true;
                    /******************/
                } else {   // 闲不增庄不增
                    this.addPokerTxt.text = `闲${contractRes[0]}点，庄${contractRes[1]}点，${fanal}`;
                    this.addPokerTxt.visible = true;
                    this.tip_bg.visible=true;
                    this.bankerAddPoker();
                }
            }
        });
    }

    /**
     * 闲家第二轮增牌动画监听完成
     */
    private playerAnimalComplete(playerPokersArr, betPokerNum, contractRes, figure1) {
        let fanal = contractRes[0] > contractRes[1] ? "闲家赢" : contractRes[0] < contractRes[1] ? "庄家赢" : "打平";
        egret.Tween.get(this.playerPokerA3)
            .to({scaleX: -1}, 0)
            .to({scaleX: 0}, 500).call(() => {
            this.playerPokerA3.source = "resource/assets/baccarat/poker/" + playerPokersArr[2] + '_' + figure1[2] + '.png';
        }).to({scaleX: 1}, 500).call(() => {
            this.playPoint.text = contractRes[0] + '点';
            if (betPokerNum[1] > 2) { // “庄家”必须增牌
                this.addPokerTxt.text = `闲增牌${playerPokersArr[2]}点，共计${contractRes[0]}点，庄家继续拿牌`;
                setTimeout(() => {
                    this.fanalTurnB3.stop();
                    this.fanalTurnB3.play();
                    this.bankerPokerA3.visible = true;
                    /******************/
                }, 1000);
            } else { // 闲增庄不增
                this.addPokerTxt.text = `闲增牌${playerPokersArr[2]}点，共${contractRes[0]}点，庄不增牌，${fanal}。`;
                this.playPoint.text = contractRes[0] + '点';
                this.bankerAddPoker();
            }
        });
    }

    /**
     * 庄家第二轮增牌动画监听完成
     */
    private bankerAnimalComplete(bankerPokersArr, contractRes, figure2) {
        let fanal = contractRes[0] > contractRes[1] ? "闲家赢" : contractRes[0] < contractRes[1] ? "庄家赢" : "打平";
        egret.Tween.get(this.bankerPokerA3)
            .to({scaleX: -1}, 0)
            .to({scaleX: 0}, 500).call(() => {
            this.bankerPokerA3.source = "resource/assets/baccarat/poker/" + bankerPokersArr[2] + '_' + figure2[2] + '.png';
        }).to({scaleX: 1}, 500).call(() => {
            this.bankerPoint.text = contractRes[1] + '点';
            this.addPokerTxt.text = `闲家${contractRes[0]}点，庄家${contractRes[1]}点，${fanal}。`;
            this.bankerAddPoker();
        });
    };


    /**
     * 定时器函数
     */
    private timerBegin(): void {
        if (this.serverTime > 0) {
            this.serverTime--;
            if (this.tipsLabel.text == "下注时间") {
                this.timeNum.text = this.serverTime + "S";
            }
            if (this.serverTime % 2 == 1) {
                this.getTime();
            }
        }
        if (this.serverTime == 0) {
            this.timeNum.text = this.serverTime + "S";
            $PublicData.loading.visible = true;
            $PublicData.panel.visible = false;
            $PublicData.alert.visible = false;
        }
        // if (this.settleTime > 0) {
        //     this.settleTime--;
        //     this.timeNum.text = this.settleTime + "S";
        // }
    }

    /**
     * 监听结算结果
     */
    private watchSettle() {
        $PublicData.ContractInstance.events
            .returnSettleRes()
            .on('data', (event) => {
                /**
                 * 结算完获取服务时间和更新余额
                 */
                if (event.returnValues) {
                    this.tipsLabel.text = "结算时间";
                    this.timeNum.text = "--";
                    this.serverTime = 60;
                    this.settlement(event.returnValues);
                    this.getTime();
                    this.getBalance();
                }
            })
            .on('error', (err) => {
                console.log(err);
                $PublicData.loading.visible = false;
                $PublicData.alert.visible = true;
                $PublicData.alert.label.text = err.message;
            })
    }

    /**
     * 结算函数，显示牌
     */
    private settlement(poker) {
        this.removeSmallCoin();
        // console.log(poker);
        let playerPokers = poker[0]; // 闲家出的牌
        let bankerPokers = poker[1]; // 庄家出的牌
        let contractRes = poker[2]; // 合约中比牌结果
        let betPokerNum = poker[3]; // 闲庄出牌个数

        let figure1 = [];
        for (let i = 0; i < playerPokers.length; i++) {
            if (playerPokers[i] < 13) {
                figure1.push("fangkuai")
            } else if (playerPokers[i] < 26) {
                figure1.push("heitao")
            } else if (playerPokers[i] < 39) {
                figure1.push("hongtao")
            } else {
                figure1.push("meihua")
            }
        }
        let figure2 = [];
        for (let i = 0; i < bankerPokers.length; i++) {
            if (bankerPokers[i] < 13) {
                figure2.push("fangkuai")
            } else if (bankerPokers[i] < 26) {
                figure2.push("heitao")
            } else if (bankerPokers[i] < 39) {
                figure2.push("hongtao")
            } else {
                figure2.push("meihua")
            }
        }

        // 闲庄3张牌
        let playerPokersArr = [((playerPokers[0] % 13) + 1), ((playerPokers[1] % 13) + 1), ((playerPokers[2] % 13) + 1)];
        let bankerPokersArr = [((bankerPokers[0] % 13) + 1), ((bankerPokers[1] % 13) + 1), ((bankerPokers[2] % 13) + 1)];

        $PublicData.panel.playerR1.source = "resource/assets/baccarat/poker/poker_back.png";
        $PublicData.panel.playerR2.source = "resource/assets/baccarat/poker/poker_back.png";
        $PublicData.panel.playerR3.source = "resource/assets/baccarat/poker/poker_back.png";

        $PublicData.panel.bankerR1.source = "resource/assets/baccarat/poker/poker_back.png";
        $PublicData.panel.bankerR2.source = "resource/assets/baccarat/poker/poker_back.png";
        $PublicData.panel.bankerR3.source = "resource/assets/baccarat/poker/poker_back.png";

        $PublicData.panel.playerR1.source = "resource/assets/baccarat/poker/" + playerPokersArr[0] + '_' + figure1[0] + '.png';
        $PublicData.panel.playerR2.source = "resource/assets/baccarat/poker/" + playerPokersArr[1] + '_' + figure1[1] + '.png';
        $PublicData.panel.playerR3.source = "resource/assets/baccarat/poker/" + playerPokersArr[2] + '_' + figure1[2] + '.png';

        $PublicData.panel.bankerR1.source = "resource/assets/baccarat/poker/" + bankerPokersArr[0] + '_' + figure2[0] + '.png';
        $PublicData.panel.bankerR2.source = "resource/assets/baccarat/poker/" + bankerPokersArr[1] + '_' + figure2[1] + '.png';
        $PublicData.panel.bankerR3.source = "resource/assets/baccarat/poker/" + bankerPokersArr[2] + '_' + figure2[2] + '.png';

        $PublicData.panel.playerR3.visible = betPokerNum[0] > 2;
        $PublicData.panel.bankerR3.visible = betPokerNum[1] > 2;

        // 先闲后庄
        // 修改下注记录
        let allWin = 0;
        let resultArr = [0, 0, 0, 0, 0, 0, 0, 0];
        $PublicData.BetRecord.forEach((item) => {
            if (!item.isSettle) {
                item.isSettle = true;
                let win = 0;
                //庄对
                if (bankerPokers[0] % 13 == bankerPokers[1] % 13) {
                    item.result.push("11");
                    if (item.betObj == "11") {
                        win += Number(item.betFof) * 11;
                        resultArr[0] += Number(item.betFof) * 11;
                    }
                }
                //闲对
                if (playerPokers[0] % 13 == playerPokers[1] % 13) {
                    item.result.push("22");
                    if (item.betObj == "22") {
                        win += Number(item.betFof) * 11;
                        resultArr[1] += Number(item.betFof) * 11;
                    }
                }
                //庄大
                if (contractRes[0] < contractRes[1]) {
                    item.result.push("10");
                    if (item.betObj == "10") {
                        win += Number(item.betFof) * 2;
                        resultArr[2] += Number(item.betFof) * 2;
                    }
                }
                //闲大
                if (contractRes[0] > contractRes[1]) {
                    item.result.push("20");
                    if (item.betObj == "20") {
                        win += Number(item.betFof) * 2;
                        resultArr[3] += Number(item.betFof) * 2;
                    }
                }
                //庄天王
                if (contractRes[1] == "8" || contractRes[1] == "9") {
                    item.result.push("12");
                    if (item.betObj == "12") {
                        win += Number(item.betFof) * 3;
                        resultArr[4] += Number(item.betFof) * 3;
                    }
                }
                //闲天王
                if (contractRes[0] == "8" || contractRes[0] == "9") {
                    item.result.push("21");
                    if (item.betObj == "21") {
                        win += Number(item.betFof) * 3;
                        resultArr[5] += Number(item.betFof) * 3;
                    }
                }
                //和
                if (contractRes[0] == contractRes[1]) {
                    item.result.push("33");
                    if (item.betObj == "33") {
                        win += Number(item.betFof) * 9;
                        resultArr[6] += Number(item.betFof) * 9;
                    }
                }
                //点和
                if (betPokerNum[0] == betPokerNum[1]) {
                    if (betPokerNum[0] == "2") {
                        if ((bankerPokers[0] % 13 == playerPokers[0] % 13
                                || bankerPokers[0] % 13 == playerPokers[1] % 13)
                            && (bankerPokers[1] % 13 == playerPokers[0] % 13
                                || bankerPokers[1] % 13 == playerPokers[1] % 13)) {
                            item.result.push("30");
                            if (item.betObj == "30") {
                                win += Number(item.betFof) * 33;
                                resultArr[7] += Number(item.betFof) * 33;
                            }
                        }
                    }
                    if (betPokerNum[0] == "3") {
                        let arr1 = [bankerPokers[0] % 13, bankerPokers[1] % 13, bankerPokers[2] % 13];
                        let arr2 = [playerPokers[0] % 13, playerPokers[1] % 13, playerPokers[2] % 13];
                        arr1 = arr1.sort((a, b) => {
                            return a - b;
                        });
                        arr2 = arr2.sort((a, b) => {
                            return a - b;
                        });
                        if (arr1[0] == arr2[0]
                            || arr1[1] == arr2[1]
                            || arr1[2] == arr2[2]) {
                            item.result.push("30");
                            if (item.betObj == "30") {
                                win += Number(item.betFof) * 33;
                                resultArr[7] += Number(item.betFof) * 33;
                            }
                        }
                    }
                }
                item.winFof = (win == 0 ? ("-" + item.betFof) : ("+" + win)) + "" + "FOF";
                allWin += win == 0 ? (item.betFof * -1) : win;
            }
        });

        $PublicData.panel.totalWin.text = allWin + "FOF";
        $PublicData.panel.bankerDWin.text = resultArr[0] + "";
        $PublicData.panel.playerDWin.text = resultArr[1] + "";
        $PublicData.panel.bankerWin.text = resultArr[2] + "";
        $PublicData.panel.playerWin.text = resultArr[3] + "";
        $PublicData.panel.bankerBWin.text = resultArr[4] + "";
        $PublicData.panel.playBWin.text = resultArr[5] + "";
        $PublicData.panel.drawWin.text = resultArr[6] + "";
        $PublicData.panel.pointDrawWin.text = resultArr[7] + "";

        $PublicData.loading.visible = false;
        $PublicData.alert.visible = false;

        $PublicData.panel.visible = false;
        $PublicData.panel.settle.visible = false;
        $PublicData.panel.sourceCodeG.visible = false;
        $PublicData.panel.gameInfo.visible = false;

        $PublicData.panel.tips.visible = false;
        $PublicData.panel.history.visible = false;
        $PublicData.panel.localHistory.visible = false;

        this.pokerAnimalGroup.visible = true;
        this.pokerAnimal.stop();
        this.pokerAnimal.play();

        this.pokerAData.playerPokersArr = playerPokersArr;
        this.pokerAData.bankerPokersArr = bankerPokersArr;
        this.pokerAData.figure1 = figure1;
        this.pokerAData.figure2 = figure2;
        this.pokerAData.contractRes = contractRes;
        this.pokerAData.betPokerNum = betPokerNum;
    }

    /**
     * 显示结果弹窗
     */
    private bankerAddPoker() {
        setTimeout(() => {
            this.playerPokerA1.source = "resource/assets/baccarat/poker/poker_back.png";
            this.playerPokerA2.source = "resource/assets/baccarat/poker/poker_back.png";
            this.playerPokerA3.source = "resource/assets/baccarat/poker/poker_back.png";
            this.bankerPokerA1.source = "resource/assets/baccarat/poker/poker_back.png";
            this.bankerPokerA2.source = "resource/assets/baccarat/poker/poker_back.png";
            this.bankerPokerA3.source = "resource/assets/baccarat/poker/poker_back.png";
            this.pokerAnimalGroup.visible = false;
            this.playPoint.text = null;
            this.bankerPoint.text = null;
            this.fanalTurnP3.stop();
            this.fanalTurnB3.stop();
            this.playerPokerA3.visible = false;
            this.bankerPokerA3.visible = false;
            this.addPokerTxt.visible = false;
            this.tip_bg.visible=false;
            setTimeout(() => {
                $PublicData.loading.visible = false;
                $PublicData.alert.visible = false;

                $PublicData.panel.settle.visible = false;
                $PublicData.panel.sourceCodeG.visible = false;
                $PublicData.panel.gameInfo.visible = false;

                $PublicData.panel.tips.visible = false;
                $PublicData.panel.history.visible = false;
                $PublicData.panel.localHistory.visible = false;

                $PublicData.panel.visible = true;
                $PublicData.panel.settle.visible = true;
                setTimeout(() => {
                    $PublicData.panel.visible = false;
                    this.tipsLabel.text = "下注时间";
                    this.timeNum.text = this.serverTime + "S";
                }, 5000)
            }, 200)
        }, 3000)
    }

    /**
     * 选中下注币的函数
     */
    private chooseCoin(obj, e: egret.TouchEvent): void {
        // 790.5  778.5
        obj.y = 778.5;
        this.choosedBetCoin = obj.text;
        switch (obj.name) {
            case "chip1Label":
                this.BetCoinIcon = "1";
                this.chip1Active.visible = true;
                this.chip2Active.visible = false;
                this.chip3Active.visible = false;
                this.chip4Active.visible = false;
                this.chip2Label.y = 790.5;
                this.chip3Label.y = 790.5;
                this.chip4Label.y = 790.5;
                break;
            case "chip2Label":
                this.BetCoinIcon = "2";
                this.chip1Active.visible = false;
                this.chip2Active.visible = true;
                this.chip3Active.visible = false;
                this.chip4Active.visible = false;
                this.chip1Label.y = 790.5;
                this.chip3Label.y = 790.5;
                this.chip4Label.y = 790.5;
                break;
            case "chip3Label":
                this.BetCoinIcon = "3";
                this.chip1Active.visible = false;
                this.chip2Active.visible = false;
                this.chip3Active.visible = true;
                this.chip4Active.visible = false;
                this.chip1Label.y = 790.5;
                this.chip2Label.y = 790.5;
                this.chip4Label.y = 790.5;
                break;
            case "chip4Label":
                this.BetCoinIcon = "4";
                this.chip1Active.visible = false;
                this.chip2Active.visible = false;
                this.chip3Active.visible = false;
                this.chip4Active.visible = true;
                this.chip1Label.y = 790.5;
                this.chip2Label.y = 790.5;
                this.chip3Label.y = 790.5;
                break;
            default:
                break;
        }
    }

    /**
     * 选择区域下注
     * @param obj
     * @param {egret.TouchEvent} e
     * 庄对 11
     * 闲对 22
     * 庄大 10
     * 闲大 20
     * 庄天王 12
     * 闲天王 21
     * 和 33
     * 点和 30
     */
    private chooseAreaBet(obj, e: egret.TouchEvent): void {

        if (!ifWalletExist()) {     //判断是否有账户
            $PublicData.alert.visible = true;
            $PublicData.alert.label.text = '请创建钱包并登录';
            $PublicData.alert.url = 'location.origin';
            return;
        } else {
            $PublicData.alert.url = ''
        }

        let account = getActiveAccount()   //判断是否解锁钱包        
        if (account.message) {
            $PublicData.password.visible = true;
            return;
        }
        let address = account.address

        if (this.serverTime < 5) {
            $PublicData.alert.visible = true;
            $PublicData.alert.label.text = '下注失败！剩余时间小于5秒不能下注！';
            return;
        }
        this.choosedBetArea = obj.name;
        switch (this.choosedBetArea) {
            case "playerDBet":
                this.choosedBetObj = "22";
                break;
            case "bankerDBet":
                this.choosedBetObj = '11';
                break;
            case "playerBet":
                this.choosedBetObj = '20';
                break;
            case "bankerBet":
                this.choosedBetObj = '10';
                break;
            case "drawBet":
                this.choosedBetObj = '33';
                break;
            case "pointDrawBet":
                this.choosedBetObj = '30';
                break;
            case "playerBBet":
                this.choosedBetObj = '21';
                break;
            case "bankerBBet":
                this.choosedBetObj = '12';
                break;
            default:
                break;
        }
        let coin = $PublicData.Web3.utils.toWei(this.choosedBetCoin, 'ether');
        let ran = parseInt(String(Math.random() * (10 ** 18)));
        $PublicData.loading.visible = true;
        $PublicData.ContractInstance.methods.sendBetInfo(address, Number(this.choosedBetObj), ran, coin)
            .send({
                from: address,
                value: coin,
                gas: 4500000,
                txType: 0
            })
            .on('error', (err) => {
                console.log(err.message);
                $PublicData.loading.visible = false;
                $PublicData.alert.visible = true;
                $PublicData.alert.label.text = err.message;
            })
            .on('receipt', (receipt) => {
                console.log(receipt)
            })
        // }
        // }).catch(function (reason) {
        //     $PublicData.loading.visible = false;
        //     $PublicData.alert.visible = true;
        //     $PublicData.alert.label.text = reason;
        // });
    }

    /**
     * 获取服务器定时器时间
     */
    private getTime(): void {
        try {
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open($PublicData.getTimerTimeUrl, egret.HttpMethod.GET);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send();
            request.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, () => {
                $PublicData.loading.visible = false;
                setTimeout(() => {
                    $PublicData.alert.visible = true;
                    $PublicData.alert.label.text = "网络连接错误，请检查网络！";
                    clearInterval(this.timer);
                }, 300)
            }, this);
        } catch (e) {
            $PublicData.loading.visible = false;
            setTimeout(() => {
                $PublicData.alert.visible = true;
                $PublicData.alert.label.text = "节点异常，请联系管理员！";
                clearInterval(this.timer);
            }, 300)
        }
    }

    /**
     * 成功
     */
    private onGetComplete(event: egret.Event): void {
        let request = <egret.HttpRequest>event.currentTarget;
        let time = Number(request.response);
        this.serverTime = time < 0 ? 0 : time;
    }

    /**
     * 监听是否下注失败
     */
    private watchBet(): void {
        $PublicData.ContractInstance.events
            .returnBetResult()
            .on('data', (event) => {
                if (event.returnValues) {
                    if (event.returnValues._addr == getActiveAccount().address) {
                        $PublicData.loading.visible = false;
                        if (event.returnValues._bool) {
                            this.betAnimation();
                            $PublicData.BetRecord.push({
                                betObj: this.choosedBetObj + "",
                                betFof: this.choosedBetCoin + "",
                                winFof: "",
                                result: [],
                                isSettle: false
                            });
                            if ($PublicData.BetRecord.length >= 15) {
                                $PublicData.BetRecord.splice(0, 1)
                            }
                            this.getBalance();
                        } else {
                            $PublicData.alert.visible = true;
                            $PublicData.alert.label.text = '下注失败！本局已封盘（奖池金额不够）';
                        }
                    }
                }
            })
            .on('error', (err) => {
                if (err) {
                    clearInterval(this.timer);
                    $PublicData.loading.visible = false;
                    $PublicData.alert.visible = true;
                    $PublicData.alert.label.text = err.message;
                }
            })
    }

    /**
     * 下注动画
     */
    private betAnimation() {
        this.getLittleCoins(Number(this.choosedBetCoin), (arr) => {
            arr.forEach((item, value) => {
                for (let i = 0; i < item; i++) {
                    switch (value) {
                        case 0:
                            this.makeCoins("10000");
                            break;
                        case 1:
                            this.makeCoins("1000");
                            break;
                        case 2:
                            this.makeCoins("500");
                            break;
                        case 3:
                            this.makeCoins("100");
                            break;
                        case 4:
                            this.makeCoins("50");
                            break;
                        case 5:
                            this.makeCoins("10");
                            break;
                        case 6:
                            this.makeCoins("5");
                            break;
                        case 7:
                            this.makeCoins("1");
                            break;
                    }
                }
            })
        });
    }

    /**
     * 生成币
     * @param text
     * 起点：353.5,846   660   972    1287
     */
    private makeCoins(text) {
        let initialPlaceX = 353.5;
        let initialPlaceY = 846;
        let endPlaceX = 0;
        let endPlaceY = 0;
        switch (this.BetCoinIcon) {
            case "1":
                initialPlaceX = 353.5;
                break;
            case "2":
                initialPlaceX = 660;
                break;
            case "3":
                initialPlaceX = 972;
                break;
            case "4":
                initialPlaceX = 1287;
                break;
        }
        switch (this.choosedBetArea) {
            case "playerDBet":
                endPlaceX = 362;
                endPlaceY = 295;
                break;
            case "bankerDBet":
                endPlaceX = 928;
                endPlaceY = 295;
                break;
            case "playerBet":
                endPlaceX = 162;
                endPlaceY = 440;
                break;
            case "bankerBet":
                endPlaceX = 1170;
                endPlaceY = 456;
                break;
            case "drawBet":
                endPlaceX = 640;
                endPlaceY = 410;
                break;
            case "pointDrawBet":
                endPlaceX = 652;
                endPlaceY = 512;
                break;
            case "playerBBet":
                endPlaceX = 368;
                endPlaceY = 635;
                break;
            case "bankerBBet":
                endPlaceX = 939;
                endPlaceY = 635;
                break;
            default:
                break;
        }
        let coin = new eui.Image();
        coin.width = 88;
        coin.height = 88;
        coin.x = initialPlaceX;
        coin.y = initialPlaceY;
        coin.name = "smallCoin";
        switch (text) {
            case "1":
                coin.source = 'resource/assets/baccarat/home/chip_s1.png';
                break;
            case "5":
                coin.source = 'resource/assets/baccarat/home/chip_s2.png';
                break;
            case "10":
                coin.source = 'resource/assets/baccarat/home/chip_s3.png';
                break;
            case "50":
                coin.source = 'resource/assets/baccarat/home/chip_s4.png';
                break;
            case "100":
                coin.source = 'resource/assets/baccarat/home/chip_s5.png';
                break;
            case "500":
                coin.source = 'resource/assets/baccarat/home/chip_s6.png';
                break;
            case "1000":
                coin.source = 'resource/assets/baccarat/home/chip_s7.png';
                break;
            case "10000":
                coin.source = 'resource/assets/baccarat/home/chip_s8.png';
                break;
        }
        this.addChild(coin);
        let xRan = Math.floor(Math.random() * 350);
        let yRan = Math.floor(Math.random() * 20);
        egret.Tween.get(coin)
            .to({x: initialPlaceX, y: initialPlaceY}, 0)
            .to({x: endPlaceX + xRan, y: endPlaceY + yRan}, 500).call(() => {
        });
    }

    /**
     * 将下注金额分拆成基础币
     * @param coin
     * @param callback
     */
    private getLittleCoins(coin, callback): void {
        let wan = Math.floor(coin / 10000);
        let qian = Math.floor((coin % 10000) / 1000);
        let wuBai = Math.floor((coin % 1000) / 500);
        let bai = Math.floor((coin % 500) / 100);
        let wuShi = Math.floor((coin % 100) / 50);
        let shi = Math.floor((coin % 50) / 10);
        let wu = Math.floor((coin % 10) / 5);
        let one = coin % 5;
        let arr = [wan, qian, wuBai, bai, wuShi, shi, wu, one];
        callback(arr);
    }

    /**
     * 移除元素
     */
    private removeSmallCoin() {
        this.$children.forEach((item) => {
            if (item.name == "smallCoin") {
                this.removeChild(item)
            }
        });
    }


    /**
     * 获取下注按钮额度列表
     */
    private getPriceArr(): void {
        $PublicData.ContractInstance.methods.getSetting().call().then((data) => {
            if (data.length == 0) {
                $PublicData.alert.visible = true;
                $PublicData.alert.label.text = "合约地址有误";
                clearInterval(this.timer);
            }
            this.chip1Label.text = data[0];
            this.chip2Label.text = data[1];
            this.chip3Label.text = data[2];
            this.chip4Label.text = data[3];
            this.chip1Active.visible = true;
            this.chip1Label.y = 778.5;
        });
    }

    /**
     * 获取余额
     */
    private getBalance(): void {
        $PublicData.ContractInstance.methods.getCurrentBalance().call().then((data) => {
            this.pool.text = Number($PublicData.Web3.utils.fromWei(data, 'ether')).toFixed(2);
        });
        let wallet = getActiveAccount() //勿删 
        if (wallet.address) {
            $PublicData.Web3.eth.getBalance(wallet.address).then((balance) => {
                this.myBalance.text = Number($PublicData.Web3.utils.fromWei(balance, 'ether')).toFixed(2);
            });
        }
    }

    /**
     * 显示历史盈亏
     * @param obj
     * @param {egret.TouchEvent} e
     */
    private showLocalHistory(obj, e: egret.TouchEvent): void {
        let x = 0;
        let y = 12;
        let lineH = 90;
        for (let i = 0; i < $PublicData.BetRecord.length; i++) {
            let one = $PublicData.BetRecord[i];
            let betObjImg = "resource/assets/baccarat/level1modal/";
            switch (one.betObj) {
                case "11":
                    betObjImg += "xz_zd.png";
                    break;
                case "22":
                    betObjImg += "xz_xd.png";
                    break;
                case "10":
                    betObjImg += "xz_z.png";
                    break;
                case "20":
                    betObjImg += "xz_x.png";
                    break;
                case "12":
                    betObjImg += "xz_ztw.png";
                    break;
                case "21":
                    betObjImg += "xz_xtw.png";
                    break;
                case "33":
                    betObjImg += "xz_h.png";
                    break;
                case "30":
                    betObjImg += "xz_dh.png";
                    break;
                default:
                    betObjImg += "yxjg_win.png";
                    break;
            }
            let icon = new eui.Image();
            icon.x = x + 20;
            icon.y = y + i * lineH;
            icon.source = betObjImg;
            $PublicData.panel.localHistoryG.addChild(icon);

            let betFof = new eui.Label();
            betFof.text = one.betFof + "FOF";
            betFof.textColor = 0x302a75;
            betFof.width = 120;
            betFof.textAlign = "center";
            betFof.x = x + 230;
            betFof.y = y + i * lineH + 10;
            $PublicData.panel.localHistoryG.addChild(betFof);

            let winFof = new eui.Label();
            winFof.text = one.winFof;
            winFof.textColor = 0x01550f;
            winFof.width = 120;
            winFof.textAlign = "center";
            winFof.x = x + 450;
            winFof.y = y + i * lineH + 10;
            $PublicData.panel.localHistoryG.addChild(winFof);

            let groupArr = [];
            for (let k = 0; k < 6; k++) {
                let group = new eui.Group();
                let bg = new eui.Image();
                bg.source = "resource/assets/baccarat/level1modal/yxjg_win_hui.png";
                bg.width = 83;
                bg.height = 49;
                bg.name = "bg";
                group.x = x + 670 + 85 * k;
                group.y = y + i * 90;
                group.addChild(bg);
                groupArr.push(group);
                $PublicData.panel.localHistoryG.addChild(group);
            }
            for (let j = 0; j < one.result.length; j++) {
                let txt = new eui.Label();
                txt.width = 83;
                txt.size = 20;
                txt.textAlign = "center";
                txt.x = 0;
                txt.y = 10;
                switch (one.result[j]) {
                    case "11":
                        txt.text = "庄对";
                        break;
                    case "22":
                        txt.text = "闲对";
                        break;
                    case "10":
                        txt.text = "庄大";
                        break;
                    case "20":
                        txt.text = "闲大";
                        break;
                    case "12":
                        txt.text = "庄天王";
                        break;
                    case "21":
                        txt.text = "闲天王";
                        break;
                    case "33":
                        txt.text = "和";
                        break;
                    case "30":
                        txt.text = "点和";
                        break;
                    default:
                        txt.text = "无";
                        break;
                }
                groupArr[j].addChild(txt);
                groupArr[j].$children.forEach((item) => {
                    if (item.name = "bg") {
                        item.source = "resource/assets/baccarat/level1modal/yxjg_win.png";
                    }
                })
            }
        }
        $PublicData.panel.visible = true;
        $PublicData.panel.history.visible = false;
        $PublicData.panel.settle.visible = false;
        $PublicData.panel.tips.visible = false;
        $PublicData.panel.sourceCodeG.visible = false;
        $PublicData.panel.gameInfo.visible = false;
        $PublicData.panel.localHistory.visible = true;
    }

    /**
     * 显示电子路单
     * @param obj
     * @param {egret.TouchEvent} e
     */
    private showHistory(obj, e: egret.TouchEvent): void {
        $PublicData.ContractInstance.methods.getHistoryRes().call().then((data) => {
            let banker = 0;
            let player = 0;
            let draw = 0;
            let x = 0, y = 0;
            for (let i: number = 1; i <= data.length; i++) {
                let src = "resource/assets/baccarat/level1modal/";
                switch (data[i - 1]) {
                    case "10":
                        src += "bj_.png";
                        banker++;
                        break;
                    case "20":
                        src += "bj_dh.png";
                        player++;
                        break;
                    case "33":
                        src += "bj_x.png";
                        draw++;
                        break;
                    default:
                        src += "bj_.png";
                        break;
                }
                let image = new eui.Image();
                image.source = src;
                image.x = x + 38;
                image.y = y + 37;
                image.anchorOffsetX = 20;
                image.anchorOffsetY = 20;
                $PublicData.panel.drawArea.addChild(image);
                y += 73;
                if (i % 8 == 0) {
                    x += 77;
                    y = 0;
                }
            }
            if (data.length < 1) {
                $PublicData.panel.bankerRate.text = "0%";
                $PublicData.panel.drawRate.text = "0%";
                $PublicData.panel.playerRate.text = "0%";
            } else {
                $PublicData.panel.bankerRate.text = (banker / data.length * 100).toFixed(1) + "%";
                $PublicData.panel.drawRate.text = (draw / data.length * 100).toFixed(1) + "%";
                $PublicData.panel.playerRate.text = (player / data.length * 100).toFixed(1) + "%";
            }
            $PublicData.panel.banker.text = banker.toString();
            $PublicData.panel.player.text = player.toString();
            $PublicData.panel.draw.text = draw.toString();
        });
        $PublicData.panel.visible = true;

        $PublicData.panel.localHistory.visible = false;
        $PublicData.panel.settle.visible = false;
        $PublicData.panel.tips.visible = false;
        $PublicData.panel.sourceCodeG.visible = false;
        $PublicData.panel.gameInfo.visible = false;
        $PublicData.panel.history.visible = true;
    }

}
