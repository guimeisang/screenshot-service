let config = require(`./${process.env.NODE_ENV}.config.js`);

console.log('node env: ', process.env.NODE_ENV, config)

module.exports = config