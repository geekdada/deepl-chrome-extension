const path = require('path')

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env'),
})

const NODE_ENV = process.env.NODE_ENV || 'development'

require('dotenv').config({
  path: path.resolve(process.cwd(), `.env.${NODE_ENV}`),
})

// tiny wrapper with default env vars
module.exports = {
  NODE_ENV,
  PORT: process.env.PORT || 3000,
  USE_MOCK_TRANSLATE: process.env.USE_MOCK_TRANSLATE === 'true',
}
