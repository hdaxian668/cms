import req from '@/util/request';
import qs from 'qs';

/**
 * 获取详情数据
 * @param data
 */
export function detail(data) {
  return req({
    url: '/defect-report/detail',
    method: 'get',
    params: data
  })
}

/**
 * 修改状态
 * @param data
 */
export function changeStatus(data) {
  return req({
    url: '/defect-report/change-status',
    method:'post',
    data: qs.stringify(data)
  })
}

export function edit(data) {
  return req({
    url: '/defect-report/edit',
    method: 'get',
    params: data
  })
}

export function save(data) {
  return req({
    url: '/defect-report/save-import',
    method:'post',
    data: qs.stringify(data)
  })
}

export function saveNew(data) {
  return req({
    url: '/defect-report/save-new',
    method:'post',
    data: qs.stringify(data)
  })
}

export function saveRemark(data) {
  return req({
    url: '/defect-report/save-remark',
    method:'post',
    data: qs.stringify(data)
  })
}
export function saveDetail(data) {
  console.log(data);
  return req({
    url: '/defect-report/save-detail',
    method:'post',
    data: qs.stringify(data)
  })
}


// WEBPACK FOOTER //
// ./src/api/defectReport/defectReportDetail.js