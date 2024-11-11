import req from '@/util/request';
import qs from 'qs';

/**
 * 获取状态选择框数据
 */
export function clauseData() {
  return req({
    url: '/setting/clause-detail',
    method: 'get',
  })
}

export function save(data) {
  return req({
    url: '/setting/clause-save',
    method:'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/system/rules.js