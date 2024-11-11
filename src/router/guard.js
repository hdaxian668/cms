import GuardList from '@/components/guard/guardList'
import GuardDetail from '@/components/guard/guardDetail'

export default [
  {
    path: '/guard/list',
    name: 'Guard',
    component: GuardList
  },
  {
    path: '/guard/detail',
    name: 'GuardDetail',
    component: GuardDetail
  },
]



// WEBPACK FOOTER //
// ./src/router/guard.js