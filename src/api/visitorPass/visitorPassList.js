import req from '@/util/request';
import qs from 'qs';

export function visitorPassData(data) {
    return req({
      url: '/visitor-pass/list-data',
      method: 'get',
      params: data
    })
  }
  


// WEBPACK FOOTER //
// ./src/api/visitorPass/visitorPassList.js