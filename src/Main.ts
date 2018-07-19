//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource();
        let promise = this.getInfo();
        promise.then(() => {
            this.createGameScene()
            document.getElementById('bgmMusic').play();
        });
        await platform.login();
        // const userInfo = await platform.getUserInfo();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private getInfo() {
        return new Promise((resolve, reject) => {
            try {
                RES.getResByUrl("contract/baccarat.json", function (code) {
                    $PublicData.Web3 = new Web3($PublicData.HOST);
                    $PublicData.Wallet = ethers.Wallet;
                    if($PublicData.ContractAddress == undefined||$PublicData.ContractAddress == ""){
                        setTimeout(function () {
                            alert("合约地址有误！");
                        },200);
                    }
                    $PublicData.ContractInstance = new $PublicData.Web3.eth.Contract(code.abi, $PublicData.ContractAddress);
                    resolve();
                }, this, RES.ResourceItem.TYPE_JSON)
            }
            catch (e) {
                console.error(e);
            }
        })
    }

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        /**
         * 加载桌面
         * @type {egret.Bitmap}
         */
        let table = new Table();
        this.addChild(table);
        let tableW = table.width;
        let tableH = table.height;
        table.y = 0;
        table.x = 0;

        /**
         * 加载左上角菜单
         * @type {egret.Bitmap}
         */
        let menu = new MenuTs();
        this.addChild(menu);

        /**
         * 加载panel弹窗组件
         * @type {egret.Bitmap}
         */
        $PublicData.panel = new InfoPanelTs();
        this.addChild($PublicData.panel);

        /**
         * 加载loading组件
         * @type {egret.Bitmap}
         */
        $PublicData.loading = new DIYLoadingUI();
        this.addChild($PublicData.loading);

        /**
         * 加载password组件
         *
         */
        $PublicData.password = new PasswordTs();
        this.addChild($PublicData.password);
        /**
         * 加载alert弹窗组件
         * @type {egret.Bitmap}
         */
        $PublicData.alert = new Alert();
        this.addChild($PublicData.alert);
    }
}
