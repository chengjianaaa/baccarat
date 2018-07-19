class PasswordTs extends eui.Component {

    public constructor() {
        super();

        /**加载皮肤 */
        this.skinName = "resource/eui_skins/custom/Password.exml";
    }

    public btn:eui.Image;
    public label:eui.EditableText;
    public close:eui.Image;


    protected childrenCreated(): void {
        super.childrenCreated();
        this.visible = false;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.verifyPwd, this);
        this.close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeModel, this);
    }

    private verifyPwd(): void {
        let promise = this.verifyWalletPwd(this.label.text)

        promise.then(() => {
                this.visible = false;
            }, (err) => {
                $PublicData.alert.visible = true;
                $PublicData.alert.label.text = "密码错误，请重新输入";
            })

    }
    
    private  loadWallet(pwd) {
        return $PublicData.Web3.eth.accounts.wallet.load(pwd)
    }
    private  verifyWalletPwd(pwd) {
        return new Promise((resolve, reject) => {
            try {
                let wallet = this.loadWallet(pwd);
                resolve(wallet);
            }
            catch (e) {
                reject(e);
            }
        })
    }
    private closeModel(): void {
        this.visible = false;
    }
}
