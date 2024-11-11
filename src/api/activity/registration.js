/**
 * 报名管理页
 */
import req from '@/util/request';
import qs from 'qs';


/**
 * 报名状态列表
 */
export function enrolMax(id) {
  return req({
    url: '/activity-attend/enrol-max',
    method: 'get',
    params: {
      id: id,
    },
  })
}


/**
 * 报名状态列表
 */
export function selectLists(id) {
  return req({
    url: '/activity-attend/search-list',
    method: 'get',
    params: {
      id: id,
    },
  })
}

/**
 * 报名管理列表
 * @param data
 */
export function registrationData(data) {
  return req({
    url: '/activity-attend/list-data',
    method: 'get',
    params: data,
  })
}

/**
 * 报名状态改变
 * @param id
 * @param status
 */
export function status(id,status) {
  let data = {
    id,
    status,
  };
  return req({
    url: '/activity-attend/change-attend-status',
    method: 'post',
    data: qs.stringify(data),
  })
}



/**
 * 出席状态改变
 * @param id
 * @param status
 */
export function attend(id,attend) {
  let data = {
    id,
    attend,
  };
  return req({
    url: '/activity-attend/change-attend',
    method: 'post',
    data: qs.stringify(data),
  })
}

/**
 * 侯補状态改变
 * @param id
 * @param status
 */
export function amends(id,amends) {
  let data = {
    id,
    amends,
  };
  return req({
    url: '/activity-attend/change-attend-amends',
    method: 'post',
    data: qs.stringify(data),
  })
}


/**
 * 改变報名人數
 * @param id
 * @param status
 */
export function attendNumber(id,attendNumber) {
  let data = {
    id,
    attendNumber,
  };
  return req({
    url: '/activity-attend/change-attend-number',
    method: 'post',
    data: qs.stringify(data),
  })
}



// WEBPACK FOOTER //
// ./src/api/activity/registration.js