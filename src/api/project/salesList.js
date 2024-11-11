import req from '@/util/request';
import qs from 'qs'

/**
 * 获取项目列表
 * @param data - 获取
 */
export function salesData(data) {
  return req({
    url: '/sales/list-data',
    method: 'get',
    params: data
  })
}


export function deleteItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/progress/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/project/salesList.js