/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const tabRouter = {
  path: '/tab',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/tab/index'),
      name: 'Tab',
      meta: { title: 'tab', icon: 'tab' }
    }
  ]
}

export default tabRouter
