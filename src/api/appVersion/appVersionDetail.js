
import req from '@/util/request';
import qs from 'qs';

export function editItem(data) {
  return req({
    url: '/app-version/detail',
    method: 'get',
    params: data
  })
}

export function saveItem(data) {
  return req({
    url: '/app-version/save',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/appVersion/appVersionDetail.js