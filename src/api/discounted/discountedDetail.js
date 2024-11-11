import req from '@/util/request';
import qs from 'qs'

/**
 * 获取折扣编辑信息
 * @param id
 */
export function edit(id) {
  return req({
    url: '/discounted/edit',
    method: 'get',
    params: id
  })
}

/**
 * 保存折扣详情
 */
export function save(data) {
  return req({
    url: '/discounted/save',
    method: 'post',
    data: qs.stringify(data),
  })
}




// WEBPACK FOOTER //
// ./src/api/discounted/discountedDetail.js