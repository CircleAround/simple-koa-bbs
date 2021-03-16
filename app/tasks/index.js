const storage = require('../../extensions/storage')

module.exports = {
  dev: {
    testUpload: async function(fileName, key, options) {
      return await storage.get().saveFile(fileName, key, options)
    },
  
    testSignedUrl: function(key, expires = 60) {
      return storage.get().getSignedUrl(key, expires)
    }
  }
}