/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const trackingDataRouter = {
  path: '/tracking-data',
  component: Layout,
  redirect: '/tracking-data/tracking-original-data',
  name: 'Table',
  meta: {
    title: 'trackingData',
    icon: 'nested'
  },
  children: [
    {
      path: 'tracking-original-data',
      component: () => import('@/views/tracking-data/tracking-original-data'),
      name: 'TrackingOriginalData',
      meta: { title: 'trackingOriginalData' }
    },
    {
      path: 'tracking-cleaned-data',
      component: () => import('@/views/tracking-data/tracking-cleaned-data'),
      name: 'TrackingCleanedData',
      meta: { title: 'trackingCleanedData' }
    }
  ]
}
export default trackingDataRouter
