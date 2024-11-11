import req from '@/util/request';
import qs from 'qs';

/**
 * 获取状态选择框数据
 */
export function emailData() {
  return req({
    url: '/setting/email-detail',
    method: 'get',
  })
}

export function save(data) {
  return req({
    url: '/setting/email-save',
    method:'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/system/email.js