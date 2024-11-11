import req from '@/util/request';
import qs from 'qs'


export function edit(data) {
  return req({
    url: '/project/edit',
    method: 'get',
    params: data
  })
}
export function save(data) {
  return req({
    url: '/project/save',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/project/projectDetail.js