/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const externalLinkRouter = {
  path: 'external-link',
  component: Layout,
  children: [
    {
      path: 'https://github.com/PanJiaChen/vue-element-admin',
      meta: { title: 'externalLink', icon: 'link' }
    }
  ]
}

export default externalLinkRouter
