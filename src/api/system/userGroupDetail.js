import req from '@/util/request';
import qs from 'qs';

export function newForm(data) {
  return req({
    url: '/user-group/new',
    method: 'get',
    params: data
  })
}

export function edit(data) {
  return req({
    url: '/user-group/edit',
    method: 'get',
    params: data
  })
}

export function save(data) {
  return req({
    url: '/user-group/save',
    method:'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/system/userGroupDetail.js