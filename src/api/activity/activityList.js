
import req from '@/util/request';
import qs from 'qs';

/**
 * 获取状态选择框数据
 */
export function selectLists() {
  return req({
    url: '/activity/activity-search-list',
    method: 'get',
  })
}

/**
 * 获取活动列表
 * @param data
 */
export function activityData(data) {
  return req({
    url: '/activity/list-data',
    method: 'get',
    params: data
  })
}

/**
 * 活动可见度修改
 * @param id
 * @param visible
 * @param _csrf
 */
export function visible(id,visible) {
  let data = {
    id,
    visible,
  };
  return req({
    url: '/activity/change-visible',
    method: 'post',
    data: qs.stringify(data),
  })
}

/**
 * 排序
 * @param id
 * @param isUp
 * @param _csrf
 */
export function sort(id,isUp) {
  const data = {
    id: id,
    isUp: isUp,
    // '_csrf': _csrf
  };
  return req({
    url: '/activity/change-sort',
    method: 'post',
    data: qs.stringify(data),
  })
}
/**
 * 删除活动条目
 * @param id
 * @param _csrf
 */
export function deleteItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/activity/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}




// WEBPACK FOOTER //
// ./src/api/activity/activityList.js