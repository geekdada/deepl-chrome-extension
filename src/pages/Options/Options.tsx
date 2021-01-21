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
import { supportedLanguages } from '../../common/constant'
import { APIRegions, Config, SupportLanguageKeys } from '../../common/types'
import OptionSection from './components/OptionSection'

const Options: React.FC = () => {
  const [targetLang, setTargetLang] = useState('ZH')
  const [token, setToken] = useState('')
  const [region, setRegion] = useState<APIRegions>('default')
  const [ocrSecretId, setOCRSecretId] = useState('')
  const [ocrSecretKey, setOCRSecretKey] = useState('')

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    ;(async () => {
      await cc(chrome.storage.sync, 'set', {
        targetLang,
        token,
        region,
        ocrSecretId,
        ocrSecretKey,
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

    const client = new Client(token, region)

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
    cc(chrome.storage.sync, 'get').then((config: Partial<Config>) => {
      if (config.targetLang !== undefined) setTargetLang(config.targetLang)
      if (config.token !== undefined) setToken(config.token)
      if (config.region !== undefined) setRegion(config.region)
      if (config.ocrSecretId !== undefined) setOCRSecretId(config.ocrSecretId)
      if (config.ocrSecretKey !== undefined)
        setOCRSecretKey(config.ocrSecretKey)
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

        <form
          onSubmit={onSubmit}
          tw="flex flex-col justify-between flex-1 overflow-hidden">
          <div tw="space-y-6 p-5 overflow-auto">
            <OptionSection title={'目标语言'}>
              <select
                tw="px-4 py-3 rounded-md"
                name="target-lang"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}>
                {Object.keys(supportedLanguages).map((lang, index) => (
                  <option value={lang} key={index}>
                    {supportedLanguages[lang as SupportLanguageKeys]}
                  </option>
                ))}
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

            <OptionSection title={'API 地区'}>
              <select
                tw="px-4 py-3 rounded-md"
                name="region"
                value={region}
                onChange={(e) => setRegion(e.target.value as APIRegions)}>
                <option value="default">默认</option>
                <option value="global">全球（非亚洲地区）</option>
                {process.env.NODE_ENV !== 'production' ? (
                  <option value="dev">DEV</option>
                ) : undefined}
              </select>
            </OptionSection>

            <OptionSection title={'腾讯云 OCR'}>
              <div tw="space-y-3">
                <div>
                  <input
                    tw="rounded-md w-full"
                    type="text"
                    placeholder="Secret Id"
                    value={ocrSecretId}
                    onChange={(e) => setOCRSecretId(e.target.value)}
                  />
                </div>

                <div>
                  <input
                    tw="rounded-md w-full"
                    type="password"
                    placeholder="Secret Key"
                    value={ocrSecretKey}
                    onChange={(e) => setOCRSecretKey(e.target.value)}
                  />
                </div>

                <div tw="text-sm text-gray-600">
                  可不填，填入后可使用 OCR 识别文字翻译。
                </div>
              </div>
            </OptionSection>

            <OptionSection title={'🔗 相关链接'}>
              <ul tw="space-y-2">
                <li>
                  <a
                    tw="text-blue-600 cursor-pointer"
                    href="https://a-translator.royli.dev/dashboard"
                    target="_blank"
                    rel="noreferrer">
                    → 后台
                  </a>
                </li>
                <li>
                  <a
                    tw="text-blue-600 cursor-pointer"
                    href="https://ripperhe.gitee.io/bob/#/service/ocr/tencent"
                    target="_blank"
                    rel="noreferrer">
                    → 如何配置腾讯云 OCR
                  </a>
                </li>
              </ul>
            </OptionSection>
          </div>

          <div tw="p-5 space-x-4 justify-self-end border-t border-solid border-gray-100">
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
