import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import NotFound from '@/components/NotFound'
import CreateAccount from '@/components/CreateAccount'

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
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
