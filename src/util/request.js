/***
 * 引入axios
 */
import axios from 'axios';
import storage from '@/util/storage'

const req = axios.create({
  baseURL: '',
  timeout: 60000,
  headers: {
    'cache-control':'no-cache,no-store',
    'pragma':'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded'}
});

req.interceptors.request.use((config) => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

// 拦截响应response，并做一些错误处理
req.interceptors.response.use((response) => {
  const data = response.data;
// 根据返回的errcode值来做不同的处理（和后端约定）
  if(data.errcode) { // post请求
    if(data.errcode === 0) {
      return response;
    } else {
      const err = new Error();
      err.data = data;
      err.response = response;
      err.message = data.errmsg.toString();
      throw err
    }
  } else { // get请求
    return response;
  }
}, (err) => { // 这里是返回状态码不为200时候的错误处理
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '請求錯誤';
        break;

      case 401:
        err.message = '未授權，請登錄';
        break;

      case 403:
        err.message = '您已退出登錄，請重登';
        storage.remove();
        window.location.reload(); // 刷新頁面，此時頁面數據是退登的
        break;

      case 404:
        err.message = `請求地址出錯: ${err.response.config.url}`;
        break;

      case 408:
        err.message = '請求超時';
        break;

      case 500:
        if(err.response.data === "<pre></pre>" ) {
          err.message = "服務器內部錯誤";
        } else {
          if(err.response.data) {
            const arr = err.response.data.split(";"); // 取出文字字段
            const arr1 = arr[3].split('&'); // 去掉末尾符号
            err.message = arr1[0];
          } else {
            err.message = "服務器內部錯誤";
          }
        }
        break;

      case 501:
        err.message = '服務未實現';
        break;

      case 502:
        err.message = '網關錯誤';
        break;

      case 503:
        err.message = '服務不可用';
        break;

      case 504:
        err.message = '網關超時';
        break;

      case 505:
        err.message = 'HTTP版本不受支持';
        break;

      default:
    }
  } else {
    // storage.remove();
    // window.location.reload(); // 刷新頁面，此時頁面數據是退登的
    console.log('1111');
  }
  return Promise.reject(err)
});

export default req;



// WEBPACK FOOTER //
// ./src/util/request.js