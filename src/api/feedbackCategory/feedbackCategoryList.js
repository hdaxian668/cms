import req from '@/util/request';
import qs from 'qs';

export function feedbackCategoryData(data) {
  return req({
    url: '/feedback-category/list-data',
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
    url: '/feedback-category/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/feedbackCategory/feedbackCategoryList.js