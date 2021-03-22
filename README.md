[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

# これはなんですか？
Node.js + Koa + Sequelize で作成した簡単な掲示板サンプルです。

# 起動方法
Redisをインストールしておいてください

```
npm install
npm run reset
npm run dev
```

and access http://localhost:3000

# Heroku
Herokuボタンからインストールした場合メールのpluginはmailtrapなので、実際に送信はされません。Heorkuの管理画面からmailtrapの管理画面を開いて送信結果を確認できます。実運用を行いたい場合にはメール送信のアドオンはご自身で用意してください。

