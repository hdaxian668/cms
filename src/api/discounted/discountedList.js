import req from '@/util/request';
import qs from 'qs'
/**
 * 获取状态选择框数据
 */
export function selectLists() {
  return req({
    url: '/discounted/search-list',
    method: 'get',
  })
}
export function discountData(data) {
  return req({
    url: '/discounted/list-data',
    method: 'get',
    params: data
  });
}
/**
 * 排序
 * @param id
 * @param isUp
 * @param _csrf
 */
export function sort(id,isUp) {
  const data = {
    id: id,
    isUp: isUp,
    // '_csrf': _csrf
  };
  return req({
    url: '/discounted/change-sort',
    method: 'post',
    data: qs.stringify(data),
  })
}
export function deleteItem(id,_csrf) {
  const data = {
    id,
    _csrf
  };
  return req({
    url: '/discounted/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/discounted/discountedList.js