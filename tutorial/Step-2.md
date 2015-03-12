# Marionette.js Tutorial Step.2 #

[Step1へ](https://github.com/nyappa/marionette-js-tutorial-app/blob/master/tutorial/Step-2.md)

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

    <script type="text/template" id="add-template">
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

    <script type="text/template" id="add-template">
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
           url : '/text_data.json'
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
                 model: new Apps.Model.Apps //ここを追加
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

無事にデータの登録が完了しました。次に登録したデータを確認できるようにしましょう。


## viewの用意 ##

データを表示するためのviewとテンプレートを用意します。 /views/index.erb に以下のテンプレートを追加しましょう。

    <script type="text/template" id="data-detail-template">
      <h1>
         <a href="#" class="icon-undo">Go back to text List</a>
      </h1>
      <span class="menu icon-menu js-menu"></span>
      <div class="main-box detail">
        <h2 class="icon-{{status}} nico-status">{{title}}</h2>
        <span class="main-text js-main-text">{{text}}</span>
      </div>
      <a href="#" class="js-add-word word add icon-plus"></a>
    </script>

{{}}　で囲まれた部分がmodelから渡されたデータを表示させる部分です。レスポンスに帰ってきたキー名を設定します。

今回のViewはデータを表示するだけなのでテンプレートを指定するだけです。view.jsに下記を追加しましょう。

    Views.Detail = Marionette.ItemView.extend({
        template : "#data-detail-template"
    });

## router,controllerの設定 ##

controllerとrouterを記述していきましょう。 router.jsでappRoutesに新しく deail/:id を追加します。

    Route.Router = Marionette.AppRouter.extend({
        appRoutes: {
            ''           : 'hello',
            'add'        : 'add',
            'detail/:id' : 'detail'
        }
    });

/:id という形で指定するとその部分に入ってきたデータをコントローラー側のメソッドで引数として受け取ることができます。 今回追加した例だと、 detail/123 というアクセスだった場合は　detailメソッドの第一引数に 123 という値が渡されます。 次にcontrollerにメソッドを追加しましょう。

    detail : function(id) {
       var layout = new Apps.Views.AppLayout,
           model  = new Apps.Model.Apps;
       layout.pageContents.show(new Apps.Views.Detail({
           model: model
       }));
    }

通常ならこれで追加完了ですが、今回はサーバーから指定したデータを取得後にViewを表示しないといけないので、fetchを使ってデータを取得した後にViewの処理を書きます。

    detail : function(id) {
       var layout = new Apps.Views.AppLayout,
           model  = new Apps.Model.Apps;
       model.fetch({
           data : {
               "id" : id,
           },
           method   : "GET",
           dataType : "json",
           success  : function () {
               layout.pageContents.show(new Apps.Views.Detail({
                   model: model
               }));
           }
       });
    }

fetchの際にサーバーに渡すデータは先ほどのrouterに設定した /:id によって引数に渡されてきているのでそれを使用します。　処理が成功した場合にViewを表示させるのでsuccessオプションの中にViewの処理を入れましょう。

## 登録完了後に表示させる ##

最後に、データ登録完了後にデータを確認できるように少し手を加えてみます。addDataのsuccessでレスポンスを受け取りそれを使って detail/:id に遷移させましょう。 編集後の全体像は以下の様になります。

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
                 success  : function (res) { //引数を受け取るように
                     //受け取った引数を使ってパスを作成
                     Apps.router.navigate("/detail/"+ res.id , {trigger:true});
                 }
             });
         }
     });

これで情報登録後にデータが表示されるようになったはずです。実際に動作を確認してみましょう。

![](https://raw.githubusercontent.com/nyappa/marionette-js-tutorial-app/master/tutorial/image/add_data.png)

↓

![](https://raw.githubusercontent.com/nyappa/marionette-js-tutorial-app/master/tutorial/image/added.png)

以上で単純なデータの表示まで終了です。Step3では一覧表示部分とデータの編集について説明していきます。
