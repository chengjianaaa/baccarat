class DIYLoadingUI extends eui.Component {

    public constructor() {
        super();

        /**加载皮肤 */
        this.skinName = "resource/eui_skins/custom/Loading.exml";
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.operation();
    }

    public btn:eui.Image;
    public label:eui.Label;
    private loop: egret.tween.TweenGroup;

    private operation() {
        this.visible = false;
        this.playAnimation(this.loop, true);
    }

    /**
     * 实现无限循环
     * @param {egret.tween.TweenGroup} target
     * @param {boolean} isLoop
     */
    private playAnimation(target: egret.tween.TweenGroup, isLoop: boolean): void {
        if (isLoop) {
            for (let key in target.items) {
                target.items[key].props = {loop: true};
            }
        }
        target.play();
    }
}
