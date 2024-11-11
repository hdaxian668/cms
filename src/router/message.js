import MessageList from '@/components/message/messageList'
import MessageDetail from '@/components/message/messageDetail'
import MessageReminder from '@/components/message/notice'

export default [
  {
    path: '/message/list',
    name: 'MessageList',
    component: MessageList,
  },
  {
    path: '/message/detail',
    name: 'MessageDetail',
    component: MessageDetail
  },
  {
    path: '/message/reminder',
    name: 'MessageReminder',
    component: MessageReminder,
  },
]



// WEBPACK FOOTER //
// ./src/router/message.js