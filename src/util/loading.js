import {
  Loading
} from 'element-ui'

const LOADING_TIMEOUT = 0

let loading
let timeout

export default {
  show(text) {
    timeout = setTimeout(() => {
      loading = Loading.service({
        fullscreen: true,
        body: true,
        lock: true,
        text: text || '',
      })
    }, LOADING_TIMEOUT)
    return loading
  },

  hide() {
    loading && loading.close()
    clearTimeout(timeout)
    return loading
  }
}



// WEBPACK FOOTER //
// ./src/util/loading.js