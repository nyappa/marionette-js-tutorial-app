# Marionette.js Tutorial Step.2 #

注意：2015/02現在執筆中です。

## Step Goal ##

**model** を使って、データの登録と登録したデータの表示を行ってみましょう。

## 準備 ##

grunt watch など忘れずにやっておきましょう。  

## 登録用フォームの準備 ##

modelをいじり始める前に、データを登録するためのフォームを用意しましょう。  
まずview.jsの Views.Hello の下に下記のようなViewを用意します。

    Views.Add = Marionette.ItemView.extend({
      template : "#add-template"
    });

次にテンプレートを用意しましょう。  
index.erb の help-template の下に下記のテンプレートを追加します。

    <script type="text/tmplate" id="add-template">
      <h2 class="icon-plus">Data Adds</h2>
      <input type="text" name="title" placeholder="Title">
      <textarea name="text" placeholder="Text"></textarea>
      <input type="button" value="Add" class="js-add-data"> // js-add-dataクラスはイベントを付与するのに使うので必須
    </script>

次にrouterとコントローラーの設定をしましょう。  
router.jsを開き hello の設定の下に add を追加します。今回は /#add にアクセスすると表示するように設定しましょう。

    Route.Router = Marionette.AppRouter.extend({
        appRoutes: {
            ''    : 'hello',
            'add' : 'add'
        }
    });

controller.jsにもaddを追加しましょう。Controller.setのhelloの下に追加します。

    add : function() {
        var layout = new Apps.Views.AppLayout;
        layout.pageContents.show(new Apps.Views.Add());
    }

ここできちんと表示がされるか確認しましょう。ドメインの後ろに　/#add を追加すれば表示されるはずです。

    http://sample.com/#add

add画面への行来がしやすいように、画面移動のイベントとリンクを設置しましょう。
index.erbへ行きhello-templateに add-template　それぞれ以下の様に追加します。

    <script type="text/template" id="hello-template">
      Hello World.
      <a href="#" class="js-add-data">データ追加</a> //ここを追加
    </script>

    <script type="text/tmplate" id="add-template">
      <h2 class="icon-plus">Data Adds</h2>
      <input type="text" name="title" placeholder="Title">
      <textarea name="text" placeholder="Text"></textarea>
      <input type="button" value="Add">
      <a href="#">戻る</a> //ここを追加 hrefは必ず#にしておくこと
    </script>

テンプレートが追加できたら次に、viewにイベントを追加しましょう。
Viewにイベントを追加する場合はeventsを使用します。

    Views.Hello = Marionette.ItemView.extend({
        template : "#hello-template",
        events : {
            "click .js-add-data": "transitionAddPage"
        },
        transitionAddPage : function() {
            Apps.router.navigate("add", {trigger:true});
            return false;
        }
    });
  
今回は click イベントを .js-add-data に追加しています。実際の動作はvalueに指定した「transitionAddPage」というメソッドで行います。 transitionAddPageメソッドで行っているのはaddページへの遷移するためのハッシュの変更だけです。Apps.router.navigateを使うことでpushState設定が有効でも無効でもそれに対応した遷移を行わせることができます。

最後にきちんと画面の表示が切り替わるか見てみましょう。データ追加画面と最初の「Hello World. 」の画面をリンクで交互に切り替えれるようになっていれば成功です。

## modelの作成 ##

登録フォームが無事に表示されたところで、modelを作成していきます。
modelファイルを追加すると以下の様になっているかと思います。
    
    sample@server:~/repos/marionetteTutorialApp/grunt/contents/js/app$ ls
    common.js  controller.js  model.js  router.js  view.js

実際にmodelを定義していきましょう。 他の定義同様moduleを使って記述していきます。

    Apps.module('Model', function (Model, App, Backbone) {
  
       Model.Apps = Backbone.Model.extend({
           url : '/generate_data.json'
       });
  
    });

Backbone.Modelを継承したModel.Appsを作成しましょう。 今回はデータのやり取りをするためのurlのみ登録します。 

> /generate_data.json はこのリポジトリにすでに用意されています。  
> このチュートリアルではMarionette.jsの実装に集中するためにサーバーサイドの実装は予め準備されています。

次にcontroller.jsでViewにmodelをセットしましょう。 addのメソッドにある Apps.Views.Addの引数に先ほど定義したモデルをセットします。

     Apps.module('Controller', function (Controller, App, Backbone, Marionette, $, _) {
       Controller.set = Marionette.Controller.extend({
           hello : function() {
               var layout = new Apps.Views.AppLayout;
               layout.pageContents.show(new Apps.Views.Hello());
           },
           add : function() {
              var layout = new Apps.Views.AppLayout;
              layout.pageContents.show(new Apps.Views.Add({
                 model: new Apps.Model.App //ここを追加
              }));
           }
       });
     });

これでmodelのセットも完了ですが、実際にmodelが設定できているか確認してみましょう。
まず、view.jsのViews.Addに initialize 処理を追加します。　そこでthis.modelを呼び出し中身を確認してみます。

     Views.Add = Marionette.ItemView.extend({
         template : "#add-template",
         initialize : function () {
             console.log(this.model);
         }
     });

> initializeはViewがインスタンス化した時に呼び出されます。
> テンプレートに描写される前に処理が呼び出されるのでテンプレートが表示された後に処理をさせる場合はonShowを使用します。

では、実際に使用しているブラウザのデバックツールを開き /#add にアクセスしてみましょう。  
![](https://raw.githubusercontent.com/nyappa/marionette-js-tutorial-app/master/tutorial/image/object.png)

何かしらオブジェクトが格納されているのが確認できれば成功です。　試しにcontroller.jsのmodelをコメントしてみましょう。 modelがセットされていないので、undefined　と表示されるはずです。

## eventの登録 ##

次にフォームにイベントを追加して登録処理が行えるようにしましょう。
Views.Addにeventsを追加します。 イベントの登録とメソッドの定義までは一気に書いてしまいましょう。

     Views.Add = Marionette.ItemView.extend({
        template : "#add-template",
        events: {
            "click .js-add-data" : "addData"
        },
        addData: function () {
             var that = this;
             this.model.fetch({
                 data : {
                     "title"  : that.$el.find("input[name=title]").val(),
                     "text"   : that.$el.find("textarea[name=text]").val(),
                     "status" : "confused"
                 },
                 method   : "POST",
                 dataType : "json",
                 success  : function () {
                    Apps.router.navigate("/", {trigger:true});
                }
            });
        }
    });

次にデータを登録する処理を書きましょう。 this.modelにある fetchメソッドを使うことでmodelに設定したurlに対して通信を行うことができます。主なオプションはjQueryの$.ajaxと同じです。

    addData: function () {
         var title = that.$el.find("input[name=title]").val(),
             text  = that.$el.find("textarea[name=text]").val();
         this.model.fetch({
             data : {
                 "title"  : title,
                 "text"   : text,
                 "status" : "confused"
             },
             method   : "POST",
             dataType : "json",
             success  : function () {
                console.log("成功");
            }
        });
    }

this.$elにはView.Addが管理しているViewのオブジェクトが格納されています。つまり、View.Addが呼び出しているテンプレート内の要素はthis.$elを通して呼び出すことになります。 今回は入力されたタイトルとテキストを取得したいので次の様に書きました。

    var title = that.$el.find("input[name=title]").val(),
        text  = that.$el.find("textarea[name=text]").val();

最後に、処理が成功するか確認しましょう。実際にデータを入力しAddボタンを押します。

![](https://raw.githubusercontent.com/nyappa/marionette-js-tutorial-app/master/tutorial/image/send_add.png)

余裕があればパラメーターが適切に送られているかも見ておきましょう。

![](https://raw.githubusercontent.com/nyappa/marionette-js-tutorial-app/master/tutorial/image/send_params.png)

## 登録データの表示 ##

無事にデータの登録が完了しました。次に登録したデータを一覧で観覧できるようにしてみます。

## viewの用意 ##

データを表示するためのviewとテンプレートを用意します。

## collectionの作成 ##

データの一覧を表示するためにcollectionを作成します。

## データ一覧を表示 ##

最後にviewにcollectionを設定してデータの表示を確認しましょう。