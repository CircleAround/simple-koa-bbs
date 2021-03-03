const ejs = require('ejs')
const mail = require('./mail')
const path = require('path')

const mailerConfig = require('../config/mailer')() // TODO: コンフィグの位置は固定したくない

const render = (file, data) => {
  return new Promise((resolve, reject)=>{
    ejs.renderFile(file, data, {async: true}, (err, rendered) => {
      if(err) { reject(err) }
      else { resolve(rendered) }
    })
  })
}

/*
 * optionsの仕様（あとでちゃんと書く）
 * from
 * to: 複数ある時はカンマ区切りの文字列
 * subject
 * text: undefinedでkeyがあれば自動検索。いらない場合null
 * html: undefinedでkeyがあれば自動検索。いらない場合null
 * key: テンプレートファイルを探す名前
 * rootDir: keyがある場合にファイルを検索するルートになるディレクトリ
 * data: テンプレートファイルに与えられる自由な引数
 */

function createMailer(options = {}) {
  // メール送信のオプションは 
  // 1. mailerConfigのシステムグローバル
  // 2. 各メーラー作成時のoptions引数
  // 3. 送信時の引数
  // の順に上書きする想定。
  // key パラメータが入っている場合、それはメールテンプレートのファイル名扱い。
  options = { ...mailerConfig, ...options }

  const send = async({key, data, ...params}) => {
    // console.debug({ key, ...params })

    params = { ...options, ...params }

    if(!params.to) {
      throw new Error('`params.to` is required')
    }
    if(!params.subject) {
      throw new Error('`params.subject` is required')
    }

    if(key) {
      if(!params.rootDir) {
        throw new Error('if `params.key` specify, `params.rootDir` is required')
      }

      const templateData = {key, data, ...params}
      if(params.text === undefined) {
        params.text = await render(path.join(params.rootDir, `${key}.text.ejs`), templateData)
      }
      if(params.html === undefined) {
        params.html = await render(path.join(params.rootDir, `${key}.html.ejs`), templateData)
      }
    }

    if(!params.html) {
      console.debug('[INFO]without html mailbody')
    }
    if(!params.text) {
      console.error('[WARN]without text mailbody')
    }

    const info = await mail.mailer().sendMail(params)
    console.info(`sent mail ${info.messageId}`)
    return info
  }
  
  return {
    send
  }
}

module.exports = { createMailer }