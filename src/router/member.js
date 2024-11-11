import MemberList from '@/components/member/memberList'
import MemberRegSetting from '@/components/member/memberRegSetting'
import MemberDetail from '@/components/member/memberDetail'

import PaymentList from '@/components/member/paymentList'
import PaymentDetail from '@/components/member/paymentDetail'

export default [
  {
    path: '/customer/list',
    name: 'MemberList',
    component: MemberList
  },
  {
    path: '/customer/detail',
    name: 'MemberDetail',
    component: MemberDetail
  },
  {
    path: '/customer/register-setting',
    name: 'MemberRegSetting',
    component: MemberRegSetting,
  },
  {
    path: '/payment-record/list',
    name: 'PaymentList',
    component: PaymentList,
  },
  {
    path: '/payment-record/detail',
    name: 'PaymentDetail',
    component: PaymentDetail,
  },
]



// WEBPACK FOOTER //
// ./src/router/member.js