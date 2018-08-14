import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import NotFound from '@/components/NotFound'
import CreateAccount from '@/components/CreateAccount'
import AccountList  from '@/components/AccountList'
import ImportAccount from '@/components/ImportAccount'
import AccountDetail from '@/components/AccountDetail'
import Transaction from '@/components/Transaction'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/createAccount',
      name: 'CreateAccount',
      component: CreateAccount
    },
    {
      path: '/accountList',
      name: 'AccountList',
      component: AccountList
    },
    {
      path: '/importAccount',
      name: 'ImportAccount',
      component: ImportAccount
    },
    {
      path: '/accountDetail/:address',
      name: 'AccountDetail',
      component: AccountDetail
    },
    {
      path: '/transaction/:token/:address',
      name: 'Transaction',
      component: Transaction
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
