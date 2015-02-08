# Marionette.js Tutorial Step.1 #

注意：2015/02現在執筆中です。

## Step Goal ##

**router** **controller** **view** を使って、画面に「hellow world」を表示させましょう。

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
                '' : 'hellow'
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
            Apps.route = new Route.Router({
               controller: new Apps.Controller.set()
            });
          });

    });



先ほど定義したRoute.Routerをインスタンス化してApps.routeに格納します。
引数に controller を渡していますがこのcontrollerは次項で作成します。

## controller.js ##
注意：2015/02現在執筆中です。