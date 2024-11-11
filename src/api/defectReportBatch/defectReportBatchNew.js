import req from '@/util/request';
import qs from 'qs';

export function save(data) {
  return req({
    url: '/defect-report-batch/save',
    method:'post',
    data: qs.stringify(data)
  })
}

export function getlist(data) {
  return req({
    url: '/defect-report-batch/form-list-search',
    method:'get'
  })
}

export function getListBatch(data) {
  return req({
    url: '/defect-report-batch/form-list-search',
    method:'get'
  })
}

export function getUnitInformation(data) {
  return req({
    url: '/defect-report-batch/get-unit-info',
    method:'get',
    params: data
  })
}

export function getCustomerInfo(data) {
  return req({
    url: '/defect-report-batch/get-customer-info',
    method:'get',
    params: data
  })
}

export function getCustomerList(data) {
  return req({
    url: '/defect-report-batch/get-customer-list',
    method:'get',
    params: data
  })
}
export function getBatchIdList(data) {
  return req({
    url: '/defect-report-batch/get-batch-list',
    method:'get',
    params: data
  })
}

export function getBatchInformation(data) {
  return req({
    url: '/defect-report-batch/get-batch-info',
    method:'get',
    params: data
  })
}



// WEBPACK FOOTER //
// ./src/api/defectReportBatch/defectReportBatchNew.js