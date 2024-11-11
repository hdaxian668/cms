import req from '@/util/request';
import qs from 'qs';

/**
 * 获取郵件列表
 * @param data
 */
export function subscribeData(data) {
  return req({
    url: '/subscribe/list-data',
    method: 'get',
    params: data
  })
}



// WEBPACK FOOTER //
// ./src/api/subscribe/subscribe.js