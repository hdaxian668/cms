import req from '@/util/request';
import qs from 'qs'


export function edit(data) {
  return req({
    url: '/sales/edit',
    method: 'get',
    params: data
  })
}
export function save(data) {
  return req({
    url: '/sales/save',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function saveUnit(data) {
  return req({
    url: '/sales/save-unit',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/project/salesDetail.js