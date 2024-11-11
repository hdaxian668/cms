import req from '@/util/request';
import qs from 'qs';

/**
 * 获取项目列表
 */
export function edit() {
  return req({
    url: '/payment-record/project-list',
    method: 'get',
  })
}
/**
 * 新增付款进度信息，不展示详情、修改
 * @param data
 */
export function save(data) {
  return req({
    url: '/payment-record/save',
    method: 'post',
    data: qs.stringify(data),
  })
}



// WEBPACK FOOTER //
// ./src/api/member/paymentDetail.js