import req from '@/util/request';
import qs from 'qs';

export function appVersion(data) {
  return req({
    url: '/app-version/list-data',
    method: 'get',
    params: data
  })
}



// WEBPACK FOOTER //
// ./src/api/system/app-version.js