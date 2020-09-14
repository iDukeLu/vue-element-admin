import request from '@/utils/request'

export function pageTrackingRecord(query) {
  return request({
    url: '/tracking/page',
    method: 'get',
    params: query
  })
}

export function listTrackingElement(query) {
  return request({
    url: '/tracking/element/list',
    method: 'get',
    params: query
  })
}

export function createTrackingElement(data) {
  return request({
    url: '/tracking/element',
    method: 'post',
    data
  })
}

export function updateTrackingElement(data) {
  return request({
    url: `/tracking/element/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteTrackingElement(id) {
  return request({
    url: `/tracking/element/${id}`,
    method: 'delete'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}
