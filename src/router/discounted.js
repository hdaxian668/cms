import DiscountedList from '@/components/discounted/discountedList'
import DiscountedDetail from '@/components/discounted/discountedDetail'

export default [
  {
    path: '/discounted/list',
    name: 'DiscountedList',
    component: DiscountedList
  },
  {
    path: '/discounted/detail',
    name: 'DiscountedDetail',
    component: DiscountedDetail
  },
]



// WEBPACK FOOTER //
// ./src/router/discounted.js