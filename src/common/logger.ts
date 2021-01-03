import pino from 'pino'
import omit from 'lodash-es/omit'

const logger = pino({
  browser: {
    write(o) {
      // eslint-disable-next-line prefer-const
      let { level, msg, err } = o as {
        level: number
        msg: string
        err?: Error
      }
      if (!msg && err) {
        msg = err.message
      }

      const label = pino.levels.labels[level]
      const logs: any[] = [`[ATE] [${label.toUpperCase()}] ${msg}`]
      const method = getMethod(level)
      const extra = omit(o, ['msg', 'level', 'time', 'err'])

      if (Object.keys(extra).length) {
        logs.push(extra)
      }

      if (err) {
        logs[0] += `\n${err.stack || err}`
      }

      method.apply(console, logs)
    },
  },
})

function getMethod(level: number) {
  if (level <= 20) {
    return console.debug
  } else if (level <= 30) {
    return console.info
  } else if (level <= 40) {
    return console.warn
  } else {
    return console.error
  }
}

export default logger
