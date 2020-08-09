/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const clipboardRouter = {
  path: '/clipboard',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/clipboard/index'),
      name: 'ClipboardDemo',
      meta: { title: 'clipboardDemo', icon: 'clipboard' }
    }
  ]
}

export default clipboardRouter
