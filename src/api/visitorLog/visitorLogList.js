import req from '@/util/request';
import qs from 'qs';

export function visitorLogData(data) {
    return req({
      url: '/visitor-log/list-data',
      method: 'get',
      params: data
    })
  }
  


// WEBPACK FOOTER //
// ./src/api/visitorLog/visitorLogList.js