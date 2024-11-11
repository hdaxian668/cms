import req from '@/util/request';
import qs from 'qs';

/**
 * 查询设置状态
 */
export function getSettingStatus() {
  return req({
    url: '/customer/facebook-detail ',
    method: 'get',
  })
}
/**
 * 保存设置状态
 */
export function saveSettingStatus(status) {
  let data = {
    status,
  };
  return req({
    url: '/customer/facebook-save',
    method: 'post',
    data: qs.stringify(data),
  })
}



// WEBPACK FOOTER //
// ./src/api/member/memberRegSetting.js