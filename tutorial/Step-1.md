# Marionette.js Tutorial Step.1 #

## Step Goal ##

**router** **controller** **view** を使って、画面に「Hello World.」を表示させましょう。

## 準備 ##

まずGruntを起動しておきましょう。  

    sample@server:~/repos/marionetteTutorialApp/grunt (master)$ grunt
    Running "watch" task
    Waiting...

次にサンプルに用意してあるjsファイルをリネームします。

    cd ./grunt/contents/js
    mv app app_back

この時、リネーム先の名前は必ず**app\_back**にしてください。　gruntのコンパイル対象から**app\_back**を外す設定がされているので、これでサンプルアプリが動かなくなります。

Sinatraを再起動してサンプルアプリが表示されない事を確認しましょう。

> サンプルアプリが表示される場合は、Gruntのコンパイルをし損ねている可能性があるので、
> gruntのログを見るかgrunt compileを再度行ってください。

最後に、これから作るアプリケーション用にフォルダを作成します。

    cd ./grunt/contents/js
    mkdir app

以上でアプリをつくり始める準備は完了です。

## common.js ##

Marionette.jsでアプリを作り始めるのに必要な最初の定義を書きます。appフォルダに入り
common.jsを作成してください。

    cd app
    vim common.js

まず最初にMarionetteアプリケーションのインスタンスを作成しましょう。

    var Apps = new Backbone.Marionette.Application();

このAppsの中にこれから作るアプリの定義を追加していくことになります。  
次にAppsが実行された時に呼び出される処理を記述します。

    Apps.on("start", function(options){
    });

ここで、ルーティング機能を有効にするための**Backbone.history.start**を記述します。

    Apps.on("start", function(options){
       if (Backbone.history){
       　　Backbone.history.start({pushState: false, root:"/"});
       }
    });

## router.js ##

次にルーティング機能を使用するためのrouter.jsを作成しましょう。  
まずcommon.jsと同じフォルダにrouter.jsを作成します。

    sample@server:~/repos/marionetteTutorialApp/grunt/contents/js/app$ ls
    common.js  router.js

ここからは、Marionette.jsのmodule機能を使って記述していきます。

> Marionette.jsのmodule機能を使うことで、いわゆるモジュールパターンを独自に定義する必要がなくなるため、Marionette.jsでアプリを作成する場合には積極的に使用することをおススメします。

先ほど定義したAppsにはすでにmoduleメソッドが用意されているので、それを使って下記のように記述しましょう。

    Apps.module('Route', function (Route, App, Backbone, Marionette, $, _) {
    });


> 第一引数には、外部からこのmoduleを呼び出すための名前を、第二引数の無名関数の第一引数にはこのモジュール自体にメソッドを追加していくために使用する名前を指定してください。　その他の引数はjqueryやunserscore.jsを使うための定義なので変更の必要はありません。  

次に、実際のルーティング処理を記述していきます。  
Marionette.AppRouterを継承してRoute.Routerに格納します。

    Apps.module('Route', function (Route, App, Backbone, Marionette, $, _){  
   
          Route.Router = Marionette.AppRouter.extend({
          });

    });

ルーティング設定はMarionette.AppRouter.extend(); の引数に下記のように渡します。

    Apps.module('Route', function (Route, App, Backbone, Marionette, $, _){  
   
          Route.Router = Marionette.AppRouter.extend({
            appRoutes: {
                '' : 'hello'
            }
          });

    });

appRoutesの中に記述してある連想配列がルーティングの設定になります。 keyにルーティングのパス、valueにルーティング時に呼び出すControllerのメソッドを記述します。 

今回はブラウザでアプリを表示した瞬間にhellowメソッドを呼びたいのでkeyを空にします。

最後に、moduleのaddInitializerメソッドを使ってこのmoduleが呼び出された時にルーティング処理が設定されるようにしましょう。

> 全てのmoduleはAppsのstartメソッドを実行した時に呼び出されます。

    Apps.module('Route', function (Route, App, Backbone, Marionette, $, _){  
   
          Route.Router = Marionette.AppRouter.extend({
            appRoutes: {
                '' : 'hello'
            }
          });

          Route.addInitializer(function () {
            Apps.router = new Route.Router({
               controller: new Apps.Controller.set()
            });
          });

    });



先ほど定義したRoute.Routerをインスタンス化してApps.routerに格納します。
引数に controller を渡していますがこのcontrollerは次項で作成します。

## controller.js ##

controllerにはrouterからルーティングされた時に実行される処理を記述します。  
router.jsなどと同じようにファイルを作成しましょう。

    sample@server:~/repos/marionetteTutorialApp/grunt/contents/js/app$ ls
    common.js  controller.js  router.js

Controllerもmoduleを使って書いていきましょう。  
moduleを作成したら、Marionette.Controllerを継承してController.setに格納します。

    Apps.module('Controller', function (Controller, App, Backbone, Marionette, $, _) {
     Controller.set = Marionette.Controller.extend();
    });

extendの引数にrouterで呼び出すように定義したメソッドを追加していきましょう。
今回は[hello]を呼び出すようにrouterで設定したのでhelloメソッドを追加します。

    Apps.module('Controller', function (Controller, App, Backbone, Marionette, $, _) {
     Controller.set = Marionette.Controller.extend({
         hello : function() {}
     });
    });

次に、表示させるViewの設定を記述します。  
実際のViewについてはまた事項に作成するので、今回は呼び出す処理のみ書いていきます。  
まずMarionette.LayoutView機能を使用するのでlayoutをインスタンス化します。
layoutのshowメソッドを使ってHello World.を表示させるApps.Views.Helloを呼び出しましょう。


    Apps.module('Controller', function (Controller, App, Backbone, Marionette, $, _) {
     Controller.set = Marionette.Controller.extend({
         hello : function() {
             var layout = new Apps.Views.AppLayout;
             layout.pageContents.show(new Apps.Views.Hello());
         }
     });
    });

以上でControllerの設定は終了です。
> routerで設定したメソッドと同名メソッドをControllerに記述すると良しなにルーティングしてくれると覚えておきましょう。

## view.js ##

最後にviewを書きましょう。viewはテンプレートと深く結びついているのでテンプレートの作成も同時に行います。

では必要ファイルを用意しましょう。

    sample@server:~/repos/marionetteTutorialApp/grunt/contents/js/app$ ls
    common.js  controller.js  router.js  view.js

まずは基本となるLayoutViewを定義します。

> LayoutViewを使うことでアプリケーション毎にheader,contents,footerなどの構造を簡単に実現することができます。
> 細かい使い方はチュートリアルを進めつつ覚えていきましょう。

Marionette.LayoutViewを継承してControllerで呼び出すViews.AppLayoutを作成しましょう。例によってextendの引数に処理を追加していきます。

    Apps.module('Views', function (Views, App, Backbone, Marionette, $) {
       Views.AppLayout = Backbone.Marionette.LayoutView.extend({
           el: ".js-page-layout"
       });
    });

elはViewが管理する要素やテンプレートの指定に使用します。  
今回のlayoutは予め存在する要素を管理するので直接クラス名を指定します。

ここで marionetteTutorialApp/views/index.erb を見てみましょう。
サンプル用にすでに記述されている内容の中に下記のような部分があると思います。

    <div class="js-page-layout">
      <span class="js-main"></span>
    </div>

この**js-page-layoutクラス**に囲まれた部分が先ほど定義したViews.AppLayoutが管理する要素となります。
次に実際にViewを描写する部分を指定するregionsを指定しましょう。

    Apps.module('Views', function (Views, App, Backbone, Marionette, $) {
       Views.AppLayout = Backbone.Marionette.LayoutView.extend({
           el: ".js-page-layout",
           regions: {
               pageContents: ".js-main"
           }
       });
    });

keyにそのregionをViews.AppLayoutで扱う時の名前、valueには実際の要素のクラスやIDを指定しましょう。
この設定の意味はControllerに書いた下記の処理を確認するとよく分かります。

    layout.pageContents.show(new Apps.Views.Hello());

layoutに設定したpageContentsというregionにApps.Views.Hello()を描写するよ！ということですね。
では次にHello World.を表示させるViewを定義していきましょう。

今回はHello World.と書かれたテンプレートを表示するだけなので、ItemViewを継承して下記の様にテンプレートを指定するだけでＯＫです。

    Views.Hello = Marionette.ItemView.extend({
        template : "#hello-template"
    });

次に実際に表示するテンプレートを記述しましょう。
marionetteTutorialApp/views/index.erbを開き、他のscriptタグがある辺りに下記を追加します。

    <script type="text/template" id="hello-template">
    Hello World.
    </script>

Views.Helloに設定したテンプレートのIDと同じhello-templateをIDに設定します。
テンプレートの中身はHello World.だけで大丈夫です。

最後に表示を確認してみましょう。　味気ないですが下記の様に表示されていれば成功です。

![](https://raw.githubusercontent.com/nyappa/marionette-js-tutorial-app/master/tutorial/image/hello.png)

> 表示されない場合gruntのコンパイル忘れや、Sinatraの再起動忘れがないかなど
> 確認してみてください。

[Step2](https://github.com/nyappa/marionette-js-tutorial-app/blob/master/tutorial/Step-2.md) ではデータの登録と登録したデータの表示を説明していきます。
