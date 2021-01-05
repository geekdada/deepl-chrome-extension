import '../../assets/img/icon-34.png'
import '../../assets/img/icon-128.png'

import './common/server'
import { openExtension } from './common/utils'

chrome.browserAction.onClicked.addListener(openExtension)
