import React, {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react'
import tw, { css } from 'twin.macro'
import { Global } from '@emotion/react'
import cc from 'chrome-call'

import Client from '../../common/api'
import { Config } from '../../common/types'

import OptionSection from './components/OptionSection'

const Options: React.FC = () => {
  const [targetLang, setTargetLang] = useState('ZH')
  const [token, setToken] = useState('')

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    ;(async () => {
      await cc(chrome.storage.sync, 'set', {
        targetLang,
        token,
      })

      window.alert('保存成功')
    })()
  }

  const onTestToken: MouseEventHandler = (e) => {
    e.preventDefault()

    if (!token) {
      window.alert('请填入 API Token')
      return
    }

    const client = new Client(token)

    client
      .translate('This is a test message.', 'ZH')
      .then(() => {
        window.alert('测试成功')
      })
      .catch((err) => {
        window.alert('测试失败：' + err.message)
      })
  }

  useEffect(() => {
    cc(chrome.storage.sync, 'get').then((config: Config) => {
      setTargetLang(config.targetLang)
      setToken(config.token)
    })
  }, [])

  return (
    <div
      css={[
        css`
          width: 100vw;
          height: 100vh;
        `,
        tw`flex justify-center items-center bg-gray-50 text-gray-800`,
      ]}>
      <Global
        styles={css`
          body {
            font-size: 16px !important;
          }
        `}
      />

      <div
        css={[
          tw`max-w-4xl h-full mx-auto overflow-hidden flex flex-col bg-white rounded-md`,
          css`
            min-width: 500px;
            max-height: 800px;
          `,
        ]}>
        <div tw="px-5 py-5 bg-purple-800 font-bold text-2xl text-white shadow">
          设定
        </div>

        <form onSubmit={onSubmit} tw="flex flex-col justify-between flex-1">
          <div tw="space-y-6 p-5 overflow-auto">
            <OptionSection title={'目标语言'}>
              <select
                tw="px-4 py-3 rounded-md"
                name="target-language"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}>
                <option value="ZH">中文</option>
                <option value="EN-US">English (American)</option>
                <option value="EN-GB">English (British)</option>
                <option value="JA">日本語</option>
                <option value="DE">German</option>
                <option value="FR">French</option>
                <option value="ES">Spanish</option>
                <option value="PT-PT">Portuguese</option>
                <option value="PT-BR">Portuguese(Brazilian)</option>
                <option value="IT">Italian</option>
                <option value="NL">Dutch</option>
                <option value="PL">Polish</option>
                <option value="RU">Russian</option>
              </select>
            </OptionSection>

            <OptionSection title={'API Token'}>
              <input
                tw="rounded-md w-full"
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </OptionSection>
          </div>

          <div tw="p-5 space-x-4 justify-self-end">
            <a
              href="https://www.notion.so/geekdada/41aad58f38f0492197f9845e26b248d0"
              target="_blank"
              rel="noreferrer">
              <button
                type="button"
                tw="px-4 py-2 border border-solid border-indigo-800 text-indigo-800 rounded-md leading-normal">
                反馈问题
              </button>
            </a>

            <button
              onClick={onTestToken}
              tw="px-4 py-2 border border-solid border-indigo-800 text-indigo-800 rounded-md leading-normal">
              测试 Token
            </button>

            <button
              type="submit"
              tw="px-4 py-2 bg-indigo-800 text-white rounded-md leading-normal">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Options
