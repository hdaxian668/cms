import FeedbackCategoryList from '@/components/feedbackCategory/feedbackCategoryList'
import FeedbackCategoryDetail from '@/components/feedbackCategory/feedbackCategoryDetail'

export default [
  {
    path: '/feedback-category/list',
    name: 'FeedbackCategoryList',
    component: FeedbackCategoryList
  },
  {
    path: '/feedback-category/detail',
    name: 'FeedbackCategoryDetail',
    component: FeedbackCategoryDetail
  },
]



// WEBPACK FOOTER //
// ./src/router/feedback-channel.js