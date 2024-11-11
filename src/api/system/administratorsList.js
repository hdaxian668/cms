import req from '@/util/request';
import qs from 'qs';

/**
 * 获取状态选择框数据
 */
export function selectLists() {
  return req({
    url: '/user/list',
    method: 'get',
  })
}
export function userData(data) {
  return req({
    url: '/user/list-data',
    method: 'get',
    params: data
  })
}

/**
 * 删除条目
 * @param id
 * @param _csrf
 */
export function deleteItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/user/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/system/administratorsList.js