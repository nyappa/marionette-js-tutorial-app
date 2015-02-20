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
      <input type="button" value="Add">
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
      <a href="#">戻る</a> //ここを追加
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
  
## modelの作成 ##

登録フォームが無事に表示されたところで、modelを作成していきます。

## eventの登録 ##

次にフォームにイベントを追加して登録処理が行われるようにしましょう。

## 登録データの表示 ##

無事にデータの登録が完了しました。次に登録したデータを一覧で観覧できるようにしてみます。

## viewの用意 ##

データを表示するためのviewとテンプレートを用意します。

## collectionの作成 ##

データの一覧を表示するためにcollectionを作成します。

## データ一覧を表示 ##

最後にviewにcollectionを設定してデータの表示を確認しましょう。