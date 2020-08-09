/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const iconRouter = {
  path: '/icon',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/icons/index'),
      name: 'Icons',
      meta: { title: 'icons', icon: 'icon', noCache: true }
    }
  ]
}

export default iconRouter
