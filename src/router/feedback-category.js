import FeedbackChannelList from '@/components/feedbackChannel/feedbackChannelList'
import FeedbackChannelDetail from '@/components/feedbackChannel/feedbackChannelDetail'

export default [
  {
    path: '/feedback-channel/list',
    name: 'FeedbackChannelList',
    component: FeedbackChannelList
  },
  {
    path: '/feedback-channel/detail',
    name: 'FeedbackChannelDetail',
    component: FeedbackChannelDetail
  },
]



// WEBPACK FOOTER //
// ./src/router/feedback-category.js