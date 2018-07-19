var Web3;
var ethers;
var $PublicData = {
    /** 游戏数据 */
    getTimerTimeUrl: "http://39.104.81.103:8089",
    uploadKeyStoreUrl: 'http://39.104.81.103:8551',
    uploadTxUrl: "http://39.104.81.103/api/addTx.php",
    getContract: "http://39.104.81.103/api/requestContract.php",
    // ContractAddress: "0x7468f623C060c3396E8Baa23F5512bDD2Bfd6B5f",   //合约地址
    ContractAddress: location.href.split('?')[1],
    HOST: "ws://39.104.81.103:8561",
    Web3: null,
    Wallet: null,
    ContractInstance: null,
    alert: null,
    panel: null,
    loading: null,
    BetRecord: [],
    password: null
};
/**
 * 账户相关
 */
function getActiveAccount() {
    var wallet = $PublicData.Web3.eth.accounts.wallet;
    var index = localStorage.getItem('active_account');
    var activeAccount = wallet[index] || new Error('Wallet Is Locked');
    return activeAccount;
}
function ifWalletExist() {
    var walletJSON = localStorage.getItem('web3js_wallet');
    if (walletJSON) {
        return walletJSON;
    }
    else {
        return false;
    }
}
