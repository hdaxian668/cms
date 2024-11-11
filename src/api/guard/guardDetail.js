import req from '@/util/request';
import qs from 'qs';

export function newForm(data) {
  return req({
    url: '/guard/new',
    method: 'get',
    params: data
  })
}
export function edit(data) {
  return req({
    url: '/guard/edit',
    method: 'get',
    params: data
  })
}
export function save(data) {
  return req({
    url: '/guard/save',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/guard/guardDetail.js