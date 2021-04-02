const ex = module.exports = {}

const nodemailer = require("nodemailer")
const ejs = require('ejs')
const path = require('path')

class NodeMailerSender {
  static async create(options) {
    const transporter = nodemailer.createTransport(options)
    await transporter.verify()
    return new NodeMailerSender(transporter)
  }

  #transporter
  constructor(transporter) {
    this.#transporter = transporter
  }

  sendMail(params) {
    return this.#transporter.sendMail(params)
  }

  dispose() {
    return this.#transporter.close()
  }

  getSentLogs() {
    throw new Error('Unimplemented')
  }
}

class MockSender {
  static async create(options) {
    return new MockSender()
  }

  #sentLog = []
  sendMail(params) {
    console.log(`MockSender#sendMail: ${JSON.stringify(params)}`)
    const log = {
      params,
      messageId: `MAIL_ID-${Math.random().toString(36).substr(2, 9)}`
    }
    this.#sentLog.push(log)
    return log
  }

  dispose() { }

  getSentLogs() {
    return this.#sentLog
  }
}

let mailerConfig
let sender

async function initialize(options, configDir) {
  mailerConfig = await require(path.join(configDir, 'mailer'))()

  if(options.mock) {
    sender = await MockSender.create(options)
  } else {
    sender = await NodeMailerSender.create(options)
  }
  return sender
}

const render = (file, data) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(file, data, { async: true }, (err, rendered) => {
      if (err) { reject(err) }
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
  if(sender === undefined) {
    throw new Error('initialize is not completed')
  }

  if(mailerConfig === undefined) {
    throw new Error('initialize is not completed')
  }

  // メール送信のオプションは 
  // 1. mailerConfigのシステムグローバル
  // 2. 各メーラー作成時のoptions引数
  // 3. 送信時の引数
  // の順に上書きする想定。
  // key パラメータが入っている場合、それはメールテンプレートのファイル名扱い。
  options = { ...mailerConfig, ...options }

  const send = async ({ key, data, ...params }) => {
    // console.debug({ key, ...params })

    params = { ...options, ...params }

    if (!params.to) {
      throw new Error('`params.to` is required')
    }
    if (!params.subject) {
      throw new Error('`params.subject` is required')
    }

    if (key) {
      if (!params.rootDir) {
        throw new Error('if specified `params.key`, `params.rootDir` is required')
      }

      const templateData = { key, data, ...params }
      if (params.text === undefined) {
        params.text = await render(path.join(params.rootDir, `${key}.text.ejs`), templateData)
      }
      if (params.html === undefined) {
        params.html = await render(path.join(params.rootDir, `${key}.html.ejs`), templateData)
      }
    }

    if (!params.html) {
      console.debug('[INFO]without html mailbody')
    }
    if (!params.text) {
      console.error('[WARN]without text mailbody')
    }

    const info = await sender.sendMail(params)
    console.info(`sent mail ${info.messageId}`)
    return info
  }

  return {
    send,
    getSentLogs: () => { return sender.getSentLogs() }
  }
}

ex.component = { initialize }
ex.createMailer = createMailer
ex.dispose = () => { sender.dispose() }
