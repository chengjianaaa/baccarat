pragma solidity ^0.4.0;

contract Baccarat {
    string public contractName;
    uint public gameType = 3;// 类型：应该为3 (龙虎斗1，竞猜2，百家乐3)
    address public creator = msg.sender; // 创建者的地址
    uint public creationTime;
    uint public historyTotalCoins = 0; // 历史下注总额

    uint [] private priceArr; // 下注额度1,5,10,20

    uint totalCoins = 0; // 当前一局下注总额
    uint [] randomNum; // 保存传入的随机数
    uint xorNum = 0; // 保存异或的值
    uint [] private resultHistory; // 保存历史结果 60 局
    uint [] private currentResult1 = [0, 0, 0]; // 保存当前局结算后庄家的三张牌
    uint [] private currentResult2 = [0, 0, 0]; // 保存当前局结算后闲家的三张牌
    uint [] private finalPoint = [0, 0]; // 最后结果点数，调试用
    uint [2] pokerNum = [2, 2];  // 闲庄最后牌数
    uint nSize = 88;  // 保存最近15局结果
    /**
    * 庄 1 闲 2 和 3
    *
    * 庄对 11
    * 闲对 22
    * 庄大 10
    * 闲大 20
    * 庄天王 12
    * 闲天王 21
    * 和 33
    * 点和 30
    */
    address [] bankerD;  // 保存选 庄对 的地址double  11
    mapping(address => uint) bankerDMap; // 选 庄对 用户的下注金额 需要清空
    uint bankerDCoins = 0; // 下注总币

    address [] playerD;  // 保存选 闲对 的地址  22
    mapping(address => uint) playerDMap; // 选 闲对 用户的下注金额 需要清空
    uint playerDCoins = 0; // 下注总币

    address [] bankerM;  // 保存选 庄大 的地址more  10
    mapping(address => uint) bankerMMap; // 选 庄大 用户的下注金额 需要清空
    uint bankerMCoins = 0; // 下注总币

    address [] playerM;  // 保存选 闲大 的地址  20
    mapping(address => uint) playerMMap; // 选 闲大 用户的下注金额 需要清空
    uint playerMCoins = 0; // 下注总币

    address [] bankerB;  // 保存选 庄天王 的地址biggest  12
    mapping(address => uint) bankerBMap; // 选 庄天王 用户的下注金额 需要清空
    uint bankerBCoins = 0; // 下注总币

    address [] playerB;  // 保存选 闲天王 的地址  21
    mapping(address => uint) playerBMap; // 选 闲天王 用户的下注金额 需要清空
    uint playerBCoins = 0; // 下注总币

    address [] draw;     // 保存选 和 的地址 33
    mapping(address => uint) drawMap; // 选 和 用户的下注金额 需要清空
    uint drawCoins = 0; // 下注总币

    address [] pointDraw;// 保存选 点和 的地址  30
    mapping(address => uint) pointDrawMap; // 选 点和 用户的下注金额 需要清空
    uint pointDrawCoins = 0; // 下注总币

    event returnBetResult(bool _bool, address _addr, string _msg); // 返回是否下注成功
    event returnSettleRes(uint[], uint[], uint[], uint[2]); // 返回最后的出牌结果

    function deposit() public payable {}

    // 获取公共数据
    function getPublicData() public constant returns (string, uint, address, uint, uint){
        return (contractName, gameType, creator, creationTime, historyTotalCoins);
    }

    constructor(uint _price1, uint _price2, uint _price3, uint _price4, string _name) public{
        creationTime = block.timestamp;
        priceArr = [_price1, _price2, _price3, _price4];
        contractName = _name;
    }

    /*
    * 下注函数
    * @_addr 下注账户地址
    * @_cho 下注对象 庄对
    * @_ran 随机数
    * @_coin 下注金额
    */
    function sendBetInfo(address _addr, uint _cho, uint _ran, uint _coin) public payable {
        totalCoins += _coin;
        deposit();
        if (getCurrentBalance() / 66 < totalCoins) {
            totalCoins -= _coin;
            transferCoin(_addr, _coin);
            emit returnBetResult(false, _addr, "下注失败");
        } else {
            historyTotalCoins += _coin;
            randomNum.push(_ran);
            if (_cho == 11) {
                bankerD.push(_addr);
                bankerDMap[_addr] = bankerDMap[_addr] + _coin;
                bankerDCoins += _coin;
            }
            if (_cho == 22) {
                playerD.push(_addr);
                playerDMap[_addr] = playerDMap[_addr] + _coin;
                playerDCoins += _coin;
            }
            if (_cho == 10) {
                bankerM.push(_addr);
                bankerMMap[_addr] = bankerMMap[_addr] + _coin;
                bankerMCoins += _coin;
            }
            if (_cho == 20) {
                playerM.push(_addr);
                playerMMap[_addr] = playerMMap[_addr] + _coin;
                playerMCoins += _coin;
            }
            if (_cho == 12) {
                bankerB.push(_addr);
                bankerBMap[_addr] = bankerBMap[_addr] + _coin;
                bankerBCoins += _coin;
            }
            if (_cho == 21) {
                playerB.push(_addr);
                playerBMap[_addr] = playerBMap[_addr] + _coin;
                playerBCoins += _coin;
            }
            if (_cho == 33) {
                draw.push(_addr);
                drawMap[_addr] = drawMap[_addr] + _coin;
                drawCoins += _coin;
            }
            if (_cho == 30) {
                pointDraw.push(_addr);
                pointDrawMap[_addr] = pointDrawMap[_addr] + _coin;
                pointDrawCoins += _coin;
            }
            emit returnBetResult(true, _addr, "下注成功");
        }
    }

    /**
    * 结算函数
    */
    function getResult() public {
        xorFun();
        settleFun();
        reset();
    }

    // 结算赔钱  先闲后庄
    function settleFun() public payable {
        pokerNum = [2, 2];
        currentResult1 = [getXorPerson(xorNum, 1, 3) % 52, getXorPerson(xorNum, 4, 3) % 52, getXorPerson(xorNum, 7, 3) % 52];
        currentResult2 = [getXorPerson(xorNum, 10, 3) % 52, getXorPerson(xorNum, 13, 3) % 52, getXorPerson(xorNum, 16, 3) % 52];

        // A ~ K  1 ~ 13
        uint poker1 = (currentResult1[0] % 13 + 1) >= 10 ? 0 : (currentResult1[0] % 13 + 1);
        uint poker2 = (currentResult1[1] % 13 + 1) >= 10 ? 0 : (currentResult1[1] % 13 + 1);
        uint poker3 = (currentResult1[2] % 13 + 1) >= 10 ? 0 : (currentResult1[2] % 13 + 1);

        uint poker4 = (currentResult2[0] % 13 + 1) >= 10 ? 0 : (currentResult2[0] % 13 + 1);
        uint poker5 = (currentResult2[1] % 13 + 1) >= 10 ? 0 : (currentResult2[1] % 13 + 1);
        uint poker6 = (currentResult2[2] % 13 + 1) >= 10 ? 0 : (currentResult2[2] % 13 + 1);

        uint firstTurnPlayer = (poker1 + poker2) % 10;
        uint firstTurnBanker = (poker4 + poker5) % 10;

        uint endTurnPlayer = 0;
        uint endTurnBanker = 0;

        // 增牌逻辑
        if (firstTurnPlayer < 6 && firstTurnBanker < 8) {// “闲家”必须增牌
            endTurnPlayer = (poker1 + poker2 + poker3) % 10;
            pokerNum[0] = 3;
        } else {
            endTurnPlayer = firstTurnPlayer;
            pokerNum[0] = 2;
        }

        if (firstTurnBanker < 7 && firstTurnPlayer < 8) {// “庄家”增牌
            if (firstTurnBanker < 3) {
                endTurnBanker = (poker4 + poker5 + poker6) % 10;
                pokerNum[1] = 3;
            } else {
                if (firstTurnPlayer < 6) {// “闲家”增牌了
                    if (firstTurnBanker == 3 && poker3 != 8) {
                        endTurnBanker = (poker4 + poker5 + poker6) % 10;
                        pokerNum[1] = 3;
                    } else if (firstTurnBanker == 4 && poker3 > 1 && poker3 < 8) {
                        endTurnBanker = (poker4 + poker5 + poker6) % 10;
                        pokerNum[1] = 3;
                    } else if (firstTurnBanker == 5 && poker3 > 3 && poker3 < 8) {
                        endTurnBanker = (poker4 + poker5 + poker6) % 10;
                        pokerNum[1] = 3;
                    } else if (firstTurnBanker == 6 && poker3 > 5 && poker3 < 8) {
                        endTurnBanker = (poker4 + poker5 + poker6) % 10;
                        pokerNum[1] = 3;
                    } else {
                        endTurnBanker = firstTurnBanker;
                        pokerNum[1] = 2;
                    }
                } else {// “闲家”没增牌
                    if (firstTurnBanker < 6) {
                        endTurnBanker = (poker4 + poker5 + poker6) % 10;
                        pokerNum[1] = 3;
                    } else {
                        endTurnBanker = firstTurnBanker;
                        pokerNum[1] = 2;
                    }
                }
            }
        } else {
            endTurnBanker = firstTurnBanker;
            pokerNum[1] = 2;
        }

        finalPoint = [endTurnPlayer, endTurnBanker];

        emit returnSettleRes(currentResult1, currentResult2, finalPoint, pokerNum);

        uint _res;
        if (endTurnPlayer > endTurnBanker) {
            _res = 20;
        } else if (endTurnPlayer == endTurnBanker) {
            _res = 33;
        } else {
            _res = 10;
        }
        if (resultHistory.length < nSize) {
            resultHistory.push(_res);
        } else {
            for (uint ii = 0; ii < resultHistory.length - 1; ii++) {
                resultHistory[ii] = resultHistory[ii + 1];
            }
            resultHistory[resultHistory.length - 1] = _res;
        }

        //庄对
        if (currentResult2[0] % 13 == currentResult2[1] % 13) {
            transferFun(11);
        }
        //闲对
        if (currentResult1[0] % 13 == currentResult1[1] % 13) {
            transferFun(22);
        }
        //庄大
        if (endTurnPlayer < endTurnBanker) {
            transferFun(10);
        }
        //闲大
        if (endTurnPlayer > endTurnBanker) {
            transferFun(20);
        }
        //庄天王
        if (endTurnBanker == 8 || endTurnBanker == 9) {
            transferFun(12);
        }
        //闲天王
        if (endTurnPlayer == 8 || endTurnPlayer == 9) {
            transferFun(21);
        }
        //和
        if (endTurnPlayer == endTurnBanker) {
            transferFun(33);
        }
        //点和
        if (pokerNum[0] == pokerNum[1]) {
            if (pokerNum[0] == 2) {
                if (((currentResult1[0] % 13 == currentResult2[0] % 13)
                || (currentResult1[0] % 13 == currentResult2[1] % 13))
                    && ((currentResult1[1] % 13 == currentResult2[0] % 13)
                    || (currentResult1[1] % 13 == currentResult2[1] % 13))) {
                    transferFun(30);
                }
            }
            if (pokerNum[0] == 3) {
                if((currentResult1[0] % 13 == currentResult2[0] % 13 || currentResult1[0] % 13 == currentResult2[1] % 13 || currentResult1[0] % 13 == currentResult2[2] % 13)
                && (currentResult1[1] % 13 == currentResult2[0] % 13 || currentResult1[1] % 13 == currentResult2[1] % 13 || currentResult1[1] % 13 == currentResult2[2] % 13)
                    && (currentResult1[2] % 13 == currentResult2[0] % 13 || currentResult1[2] % 13 == currentResult2[1] % 13 || currentResult1[2] % 13 == currentResult2[2] % 13)){
                    transferFun(30);
                }
            }
        }
    }

    /*
      * 根据不同结果进行赔付
      * @_res 最后结果
      */
    function transferFun(uint _res) public payable {
        if (_res == 11) {//庄对
            for (uint i = 0; i < bankerD.length; i++) {
                transferCoin(bankerD[i], bankerDMap[bankerD[i]] * 12);
                bankerDMap[bankerD[i]] = 0;
            }
        }
        if (_res == 22) {//闲对
            for (uint j = 0; j < playerD.length; j++) {
                transferCoin(playerD[j], playerDMap[playerD[j]] * 12);
                playerDMap[playerD[j]] = 0;
            }
        }
        if (_res == 10) {//庄大
            for (uint k = 0; k < bankerM.length; k++) {
                transferCoin(bankerM[k], bankerMMap[bankerM[k]] * 2);
                bankerMMap[bankerM[k]] = 0;
            }
        }
        if (_res == 20) {//闲大
            for (uint l = 0; l < playerM.length; l++) {
                transferCoin(playerM[l], playerMMap[playerM[l]] * 2);
                playerMMap[playerM[l]] = 0;
            }
        }
        if (_res == 12) {//庄天王
            for (uint m = 0; m < bankerB.length; m++) {
                transferCoin(bankerB[m], bankerBMap[bankerB[m]] * 3);
                bankerBMap[bankerB[m]] = 0;
            }
        }
        if (_res == 21) {//闲天王
            for (uint n = 0; n < playerB.length; n++) {
                transferCoin(playerB[n], playerBMap[playerB[n]] * 3);
                playerBMap[playerB[n]] = 0;
            }
        }
        if (_res == 33) {//和
            for (uint o = 0; o < draw.length; o++) {
                transferCoin(draw[o], drawMap[draw[o]] * 9);
                drawMap[draw[o]] = 0;
            }
        }
        if (_res == 30) {//点和
            for (uint p = 0; p < pointDraw.length; p++) {
                transferCoin(pointDraw[p], pointDrawMap[pointDraw[p]] * 33);
                pointDrawMap[pointDraw[p]] = 0;
            }
        }
    }

    // 异或函数,得到结果随机数
    function xorFun() public {
        for (uint i = 0; i < randomNum.length; i++) {
            xorNum = xorNum ^ randomNum[i];
        }
        xorNum = xorNum ^ (uint256(keccak256(block.difficulty, now)) % 1000000000000000000);
    }

    // 处理这个随机数,得到3个值
    function getXorPerson(uint number, uint start, uint long) public returns (uint) {
        return (number % (10 ** (19 - start))) / (10 ** (19 - start - long));
    }

    // 返回当前合约账户的余额
    function getCurrentBalance() public constant returns (uint256) {
        return address(this).balance;
    }

    // 返回配置信息
    function getSetting() public constant returns (uint[]) {
        return priceArr;
    }
    // 返回最后88场结果
    function getHistoryRes() public constant returns (uint[]) {
        return resultHistory;
    }

    // 提现函数,只有创建者账户可以提现 todo 合约的余额大于所有玩家已下注金额的32倍
    function drawings() public payable {
        if (msg.sender == creator) {
            uint _balance = getCurrentBalance();
            transferCoin(creator, _balance);
        }
    }

    /*
    * 转账函数
    * @_to 目标地址
    * @_coins 金额
    */
    function transferCoin(address _to, uint _coins) private {
        _to.transfer(_coins);
    }

    // 重置函数
    function reset() private {
        xorNum = 0;
        totalCoins = 0;
        randomNum.length = 0;
        currentResult1 = [0, 0, 0];
        currentResult2 = [0, 0, 0];
        finalPoint = [0, 0];
        bankerD.length = 0;
        bankerDCoins = 0;
        playerD.length = 0;
        playerDCoins = 0;
        bankerM.length = 0;
        bankerMCoins = 0;
        playerM.length = 0;
        playerMCoins = 0;
        bankerB.length = 0;
        bankerBCoins = 0;
        playerB.length = 0;
        playerBCoins = 0;
        draw.length = 0;
        drawCoins = 0;
        pointDraw.length = 0;
        pointDrawCoins = 0;
    }
}
