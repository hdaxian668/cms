import req from '@/util/request';
import qs from 'qs';

export function levelData(data) {
  return req({
    url: '/level/list-data',
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
    url: '/level/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/level/levelList.js