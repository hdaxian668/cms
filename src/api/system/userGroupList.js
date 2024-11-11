import req from '@/util/request';
import qs from 'qs';

export function list(data) {
  return req({
    url: '/user-group/list',
    method: 'get',
    params: data
  })
}

export function deleteItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/user-group/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/system/userGroupList.js