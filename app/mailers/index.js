const ex = module.exports = {}
const path = require('path')
require('../../lib/platform').autoload(ex, __dirname, path.basename(__filename))
