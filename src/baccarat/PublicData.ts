let Web3;
let ethers;
let $PublicData = {
    /** 游戏数据 */
    getTimerTimeUrl: "http://39.104.81.103:8089", // 服务器定时器的地址
    uploadKeyStoreUrl: 'http://39.104.81.103:8551', // 上传keystore
    uploadTxUrl: "http://39.104.81.103/api/addTx.php", // 上传交易记录
    getContract: "http://39.104.81.103/api/requestContract.php", // 查询合约地址
    // ContractAddress: "0x7468f623C060c3396E8Baa23F5512bDD2Bfd6B5f",   //合约地址
    ContractAddress: "0x32D6032D285eFBBE9B4c16536b8f0c494bb266d4",   //合约地址
    // ContractAddress: location.href.split('?')[1],  //合约地址

    HOST: "ws://39.104.81.103:8561",
    Web3: null,  //web3对象
    Wallet: null, // 钱包对象
    ContractInstance: null,//合约实例
    alert: null, //alert弹窗对象
    panel: null, //panel弹窗对象
    loading: null, //loading弹窗对象
    BetRecord: [], // 下注记录
    password: null
};

/**
 * 账户相关
 */
function getActiveAccount() {
    let wallet = $PublicData.Web3.eth.accounts.wallet
    let index = localStorage.getItem('active_account')
    let activeAccount = wallet[index] || new Error('Wallet Is Locked')
    return activeAccount
}

function ifWalletExist() {
    let walletJSON = localStorage.getItem('web3js_wallet')
    if (walletJSON) {
        return walletJSON
    } else {
        return false
    }
}