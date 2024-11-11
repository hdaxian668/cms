import req from '@/util/request';
import qs from 'qs'

/**
 * 获取状态选择框数据
 */
export function searchList() {
  return req({
    url: '/project/list',
    method: 'get',
  })
}

/**
 * 获取项目列表
 * @param data - 获取
 */
export function projectData(data) {
  return req({
    url: '/project/list-data',
    method: 'get',
    params: data
  })
}

/**
 * 修改项目状态
 * @param index
 * @param status
 */
export function visible(id,visible,_csrf) {
  // 原系统使用的是JQuery.ajax,改为axios.post时要修改。
  // 方法1：不是所有浏览器都适配
  // let data = new URLSearchParams();
  // data.append('id', id);
  // data.append('visible', visible);
  // 方法2：qs处理
  let data = {
    id,
    visible,
    '_csrf': _csrf
  };
  return req({
    url: '/project/change-visible',
    method: 'post',
    data: qs.stringify(data),
  })
}
export function sort(id,isUp,_csrf) {
  const data = {
    id: id,
    isUp: isUp,
    // '_csrf': _csrf
  };
  return req({
    url: '/project/change-sort',
    method: 'post',
    data: qs.stringify(data),
  })
}
export function deleteItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/project/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/project/projectList.js