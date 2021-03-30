[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

# これはなんですか？
Node.js + Koa + Sequelize で作成した簡単な掲示板サンプルです。

# 起動方法

## ローカル（node-foreman）
Redis、Postgresqlをインストールしておいてください。
.envが読み込まれるので、.env.sampleをコピーして必要な場合には編集してください。

```
npm install
npm run reset
npm run dev
```
http://localhost:5000 へアクセスしてください。
送ったメールの開発用確認は http://localhost:1080

## Heroku
Herokuボタンからインストールした場合メールのpluginはmailtrapなので、実際に送信はされません。Heorkuの管理画面からmailtrapの管理画面を開いて送信結果を確認できます。実運用を行いたい場合にはメール送信のアドオンはご自身で用意してください。

## Docker
.envが読み込まれるので、.env.sampleをコピーして必要な場合には編集してください。

```
docker-compose build
docker-compose run app bin/bash
$ npm install
$ bin/reset
$ exit
docker-compose up
```

http://localhost:3000 へアクセスしてください。
送ったメールの開発用確認は http://localhost:1080

全て跡形もなく消去したければ下記

```
docker-compose down --rmi all --volumes --remove-orphans
```

# テスト
.env.testが読み込まれるので、.env.test.sampleをコピーして必要な場合には編集してください。

全てのテストを一回動かす。
```
npm test
```

ウォッチモードで起動。
```
npm test -- --watch
```
ウォッチモードを起動する際に
`fatal: ambiguous argument 'tests': both revision and filename`
と言われた時にはgitのブランチ名がディレクトリ名と被っているので、ブランチ名を変更するなどして対応してください（ @see https://github.com/facebook/jest/issues/10149 ）

