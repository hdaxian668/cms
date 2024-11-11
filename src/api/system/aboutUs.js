import req from '@/util/request';
import qs from 'qs';

/**
 * 获取状态选择框数据
 */
export function aboutData() {
  return req({
    url: '/setting/about-detail',
    method: 'get',
  })
}

export function save(data) {
  return req({
    url: '/setting/about-save',
    method:'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/system/aboutUs.js