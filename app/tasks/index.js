const storage = require('../../extensions/storage')

module.exports = {
  dev: {
    testUpload: async function(srcPath, key, options) {
      return await storage.get().saveFile(srcPath, key, options)
    },
  
    testSignedUrl: function(key, expires = 60) {
      return storage.get().getSignedUrl(key, expires)
    }
  }
}