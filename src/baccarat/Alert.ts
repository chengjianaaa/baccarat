class Alert extends eui.Component {

    public constructor() {
        super();

        /**加载皮肤 */
        this.skinName = "resource/eui_skins/custom/AlertUI.exml";
    }

    public btn: eui.Image;
    public label: eui.Label;
    public url:string;

    protected childrenCreated(): void {
        super.childrenCreated();
        this.visible = false;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeAlert, this);
    }

    private closeAlert(): void {
        if(this.url) {
            window.open(this.url);
        }
        this.visible = false;
    }
}
