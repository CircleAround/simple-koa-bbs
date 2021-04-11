const ex = module.exports = {}

const AWS = require('aws-sdk');
const fs = require('fs')

class S3Adapter {
  constructor(options) {
    const defaultOptions = {
      apiVersion: '2006-03-01',
      region: process.env.AWS_DEFAULT_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }

    options = { ...defaultOptions, ...options }

    this.s3 = new AWS.S3(options);
  }

  async saveFile(srcPath, key, options = {}) {
    const fileContent = fs.readFileSync(srcPath);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: fileContent,
      ...options
    }

    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }

  getSignedUrl(key, expires = 60) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: expires,
    })
  }
}

let adapter

function initialize({options}) {
  adapter = new S3Adapter(options)
}

ex.component = { initialize }
ex.get = function(_ = '__default') { return adapter }



