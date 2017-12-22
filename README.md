# FRONT TEMPLATE
フロント開発をする際に必用な物をまとめたテンプレートです。

このリポジトリをforkしてそのまま開発を進めることが出来ます。

**[yarn](https://yarnpkg.com/ja/)を使うこと前提でpackage.jsonを記述しています。**

## 用意されているもの
* 開発用ローカルサーバ
* HTMLのテンプレート
* CSSのminify
* CSSのsourcemap対応
* JSのminify & bundle
* JSのsourcemap対応
* JSの過去バージョン対応(Babel)
* lintチェック(CSS, SCSS, JS)
* フォーマット(HTML, CSS, SCSS, JS)

## コマンド
package.jsonのscriptsに定義されているコマンド群です。

| command    | Description                                                                                        |
| ---        | ---                                                                                                |
| dev-server | 開発用ローカルサーバを起動します。ローカルサーバはファイルの更新を検知して自動でビルドを行います。 |
| build      | HTML, CSS, SCSS, JSをビルドして、結果をdestディレクトリに出力します。                              |
| lint       | CSS, SCSS, JSのlintチェックを行います。主にCircleCI等でのチェックに使用します。                    |
| fmt        | HTML, CSS, SCSS, JSを自動整形します。整形の設定は[使用しているツール](#使用しているツール)を参照。 |

## ディレクトリ構造
```
front-template
├── .babelrc                <-- babelの設定ファイル
├── .eslintrc.json          <-- eslintの設定ファイル
├── .jsbeautifyrc           <-- js-beautifyの設定ファイル
├── .stylelintrc            <-- stylelintの設定ファイル
├── README.md
├── app                     <-- アプリケーションを開発するディレクトリ
│   ├── css                <-- CSSを配置するディレクトリ
│   │   └── style.css
│   ├── index.html         <-- このHTMLと同じ階層にHTMLは設置する
│   ├── js                 <-- JSを配置するディレクトリ
│   │   ├── main.js
│   │   └── person.js
│   └── scss               <-- SCSSを配置するディレクトリ
│       └── style.scss
├── dest                    <-- build時に自動で生成されるディレクトリ
│   ├── css                <-- minifyされたCSSが配置される
│   │   └── style.min.css
│   ├── index.html
│   └── js                 <-- minify&bundleされたjsが配置されるディレクトリ
│       └── bundle.js
├── gulpfile.js             <-- gulpの設定ファイル
├── package.json
├── webpack.config.js       <-- webpackの設定ファイル
└── yarn.lock               <-- yarnのバージョン指定ファイル

```


## 開発方法

### 準備
`yarn install`で必用なツールをinstallします。

### 開発用ローカルサーバ
`yarn dev-server`コマンドでローカルサーバが起動します。起動すると自動でブラウザのタブが開きます。

サーバが起動している限り、appディレクトリ以下でファイルの追加、変更、削除が発生した時に自動でビルドが走り、
ブラウザがリロードされます。


### HTML
HTMLは`app/`以下に配置してください。
ディレクトリの構造は自由ですが、`app/`以下の構造がそのまま`dest/`に反映されます。

ビルドの設定はgulpで管理しています。

CSSとJSのタグの自動挿入と任意文字列の埋め込みがビルド時に行われるようになっています。

以下のようにHTMLにコメントを挿入すると、コメントで指定したファイルタイプに応じたタグが自動挿入されます。

```html
<!-- inject:css -->
<!-- endinject -->

<!-- inject:js -->
<!-- endinject -->
```

詳細については[gulp-inject](https://www.npmjs.com/package/gulp-inject)を確認してください。

また、以下のようにHTMLに埋め込み用のタグを記述すると、gulpの設定ファイルで指定したした文字列が自動で埋め込まれます。

```html
<span><%= message %></span>
```

```javascript
gulp.task('html', () =>
  gulp
    .src('./app/**/*.html')
    .pipe(template({ message: 'Build success!' })) // <- この部分で設定した文字列が埋め込まれる
    .pipe(gulp.dest('dest')));
```

詳細については[gulp-template](https://www.npmjs.com/package/gulp-template)を確認してください。

### CSS/SCSS
CSS/SCSSは`app/css/`、`app/scss/`以下に配置してください。ディレクトリの構造は自由です。

ビルドの設定はgulpで管理しています。

SCSSはビルド時に自動でCSSに変換されます。
また、ビルド後のファイルは`dest/css/`に出力されます。

### JavaScript
JavaScrptは`app/js/`以下に配置してください。ディレクトリの構造は自由です。

ビルドの設定はwebpackで管理しています。

babelでトランスパイルしているため、`app/js/`以下ではES6に準拠して記述して問題ありません。

ビルド後のファイルは`dest/js`に出力されます。


## 使用しているツール

### gulp
front-templateでは各種タスクはgulpで管理管理しています。

以下が管理対象です。

* htmlのビルド
* css/scssのビルド
* dev-serverの起動

JSに関してはWebpackで管理しています。
また、今後gulpが陳腐化する可能性を考慮して、lintやフォーマットのコマンドはpackage.jsonのscriptsに記述しています。

### webpack
JSのビルドを管理しています。

### eslint
JSのスタイルチェックを行っています。

デフォルトでは`airbnb`の設定をそのまま使用しています。

設定を追加する場合は`.eslintrc.json`に追記します。

### stylelint
CSS/SCSSのスタイルチェックを行っています。

デフォルトでは`stylelint-config-standard`の設定をそのまま使用しています。

設定を追加する場合は`.stylelintrc`に追記します。

### prettier-eslint
eslintに則った自動整形ツールです。

### stylefmt
stylelintに則った自動整形ツールです。

### js-beautify
HTMLの自動整形に使用しています。

js-beautifyにもCSSとJSの整形機能はありますが、今回はHTMLでしか使用していません。

設定を追加する場合は`.jsbeautifyrc`に追記します。

### babel
ES6以上で記述されたJSのコードをそれ以前のバージョンでも使用できるようにトランスパイルするためのツールです。

デフォルトでは2バージョン前のブラウザ及び7以上のSafariに対応するような設定になっています。

プロダクト毎に要件が大きく異なると思われるため、[babel-preset-env](https://babeljs.io/docs/plugins/preset-env/)を
参考にして適切な設定を`.babelrc`に追記してください。

