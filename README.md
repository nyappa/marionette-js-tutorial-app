# Marionette.js Tutorial App #


## About ##

**注意：2015/02現在執筆中です。**

Marionette.js とSinatraを使って簡単なアプリケーションを作るための非公式チュートリアルです。  
慣れるより慣れろという勉強方法をしたい方にお勧めです。
アプリケーションを作るという部分にのみフォーカスしているので、より詳しいMarionette.jsの情報が知りたい方は[公式wiki](http://marionettejs.com/docs/current/)をご覧ください。

**執筆:2015/02**  
**Marionette.js: v2.2.0**

## 前準備 ##

まずbundle install で必要なGemパッケージをインストールしておきましょう。

    bundle install

下記コマンドでSinatraが起動します。

    rackup -p 3000

> このリポジトリにはチュートリアルで作成するアプリがすでに用意されています。  
> チュートリアルに行き詰った場合は実際のコードを読んでみましょう。

### Gruntを使用する場合 ###

Gruntにはnode.jsが必要なので予めインストールしておいてください。  
node.jsがすでに入っている場合はgruntフォルダに入り必要なモジュールをインストールしましょう。

    cd ./grunt
    npm install

gruntフォルダ内で **grunt** と打つことでwatchモードになります。  

    sample@server:~/repos/marionetteTutorialApp/grunt (master)$ grunt
    Running "watch" task
    Waiting...

コンパイルのみしたい場合は **grunt compile** でコンパイルできます。

    sample@server:~/repos/marionetteTutorialApp/grunt (master)$ grunt compile
    Running "concat:main" (concat) task
    File "../public/js/contents_all.js" created.
    
    Running "compass:dist" (compass) task
    unchanged contents/sass/style.scss
    Compilation took 0.209s

各種コンパイル先は下記となります。
    
    marionetteTutorialApp/public/js/contents_all.js
    marionetteTutorialApp/public/css/style.css

grunt使用時は下記のフォルダで開発を行います。

    grunt/content/js
    grunt/content/scss

### Gruntを使用しない場合 ###

以下執筆中

### Tutorial ###

Step-1
Step-2
Step-3
Step-4
Step-5