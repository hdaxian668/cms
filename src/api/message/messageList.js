
import req from '@/util/request';
import qs from 'qs';

/**
 * 获取状态选择框数据
 */
export function selectLists() {
  return req({
    url: '/message/search-list',
    method: 'get',
  })
}

/**
 * 获取消息列表
 * @param data
 */
export function messageData(data) {return req({
    url: '/message/list-data',
    method: 'get',
    params: data
  })
}

/**
 * 删除条目
 * @param id
 */
export function deleteItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/message/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/message/messageList.js