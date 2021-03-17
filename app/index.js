const ex = module.exports = {}
const path = require('path')
require('../lib/autoload').autoload(ex, __dirname, path.basename(__filename))
