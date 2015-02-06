# Marionette.js Tutorial App #


## About ##

**注意：2015/02現在執筆中です。**

Marionette.js とSinatoraを使って簡単なアプリケーションを作るための非公式チュートリアルです。  
慣れるより慣れろという勉強方法をしたい方にお勧めです。
アプリケーションを作るという部分にのみフォーカスしているので、より詳しいMarionette.jsの情報が知りたい方は公式wikiをご覧ください。

**執筆:2015/02**  
**Marionette.js: v2.2.0**

## Tutorial ##

このリポジトリのファイルはSinatoraアプリなので  
Sinatoraを起動することでサンプルが確認できるようになっています。  
Tutorialで分からないことがあれば実際のコードを読んでみましょう。

    bundle install
    rackup -p 3000


### Gruntを使用する場合 ###

node.jsは予めインストールしておいてください。node.jsがすでに入っている場合はgruntフォルダに入り  
**npm install**すると必要なパッケージがインストールされます。

    cd ./grunt
    npm install

gruntフォルダ内で **grunt** と打つことでwatchモードになります。  
コンパイルのみしたい場合は **grunt compile** でコンパイルできます。コンパイル先などの詳しい内容は**grunt/config**フォルダ内の各種設定を読んでください。  gruntからコンパイルを行えばテンプレートの修正を行わなくてもすべてのファイルがconcatされて読み込まれます。

grunt使用時は下記のフォルダで開発を行います。

    grunt/content/js
    grunt/content/scss

### Gruntを使用しない場合 ###

以下執筆中

