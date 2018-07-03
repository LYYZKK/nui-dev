import request from '@/utils/request'

// 获取所有的产品
export function findAllProduct() {
  return request({
    url: `/productServer/findAllProduct`,
    method: 'get'
  })
}

// 获取活动组织
export function queryDepts() {
  return request({
    url: `employee/queryDepts`,
    method: 'get'
  })
}

// 获取小结
export function findAllNodules() {
  return request({
    url: `nodule/findAllNodules`,
    method: 'get'
  })
}

// 根据活动id获取评分表
export function findMarksByCampaignId(campaignId) {
  return request({
    url: `quality/getMarksByCampaignId`,
    method: 'get',
    params: { activityId: campaignId }
  })
}
// 根据活动id获取质检组织
export function findDeptByCampaignId(campaignId) {
  return request({
    url: `quality/getDeptByCampaignId`,
    method: 'get',
    params: { activityId: campaignId }
  })
}
// 修改活动
export function modifyCampaign(req) {
  if (req.productIds.length !== 0) {
    req.productIds = req.productIds.join(',')
  } else {
    req.productIds = req.productIds.toString()
  }
  if (req.productIds.length !== 0) {
    req.products = req.products.join(',')
  } else {
    req.products = req.products.toString()
  }
  return request({
    url: `campaign/modifyCampaign`,
    method: 'post',
    params: req
  })
}

// 启用活动
export function changeCampaignStatus(req) {
  return request({
    url: 'campaign/changeCampaignStatus',
    method: 'post',
    params: req
  })
}
