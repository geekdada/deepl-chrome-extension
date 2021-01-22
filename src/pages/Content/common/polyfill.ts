import smoothScrollPolyfill from 'smoothscroll-polyfill'

if (!('scrollBehavior' in document.documentElement.style)) {
  smoothScrollPolyfill.polyfill()
}
