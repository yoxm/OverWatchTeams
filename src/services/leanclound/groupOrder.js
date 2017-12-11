import AV from 'leancloud-storage'
import { getCurrentUser } from './user'

// 创建组队贴
export function cerateGroupOrder(payload) {
  const user = getCurrentUser()
  const groupOrders = new AV.Object('GroupOrders')
  groupOrders.set('title', payload.title)
  groupOrders.set('description', payload.description)
  groupOrders.set('contact', payload.contact)
  const endDate = new Date(payload.endDate)
  groupOrders.set('endDate', endDate)
  groupOrders.set('user', user)

  var acl = new AV.ACL()
  acl.setPublicReadAccess(true)
  acl.setWriteAccess(user, true)

  groupOrders.setACL(acl)

  return groupOrders.save().then(function(result) {
    return result.toJSON()
  })
}

export function updateGroupOrder(payload) {
  const user = getCurrentUser()
  const recruitOrders = AV.Object.createWithoutData(
    'GroupOrders',
    payload.objectId
  )
  recruitOrders.set('title', payload.title)
  recruitOrders.set('description', payload.description)
  recruitOrders.set('contact', payload.contact)
  const endDate = new Date(payload.endDate)
  recruitOrders.set('endDate', endDate)
  recruitOrders.set('user', user)

  return recruitOrders.save().then(function(result) {
    return {
      ...result.toJSON()
    }
  })
}

export function removeGroupOrder(payload) {
  var recruitOrders = AV.Object.createWithoutData('GroupOrders', payload.objectId)
  return recruitOrders.destroy().then(function(success) {
    return success.toJSON()
  })
}

export function getAccountGroupOrderList(payload) {
  let list = []
  let { page, pagesize } = payload
  pagesize = pagesize || 20
  const user = getCurrentUser()
  const query = new AV.Query('GroupOrders')
  query.descending('updatedAt')
  query.limit(pagesize)
  query.skip(pagesize * (page - 1))
  query.equalTo('user', user)
  query.greaterThanOrEqualTo('endDate', new Date())
  query.include('user')
  query.include('user.userinfo')
  return query.find().then(function(result) {
    result.forEach(item => {
      const userinfo = item
        .get('user')
        .get('userinfo')
        .toJSON()
      const res = { ...item.toJSON(), userinfo }
      list.push(res)
    })
    return list
  })
}

export function getHomeGroupOrderList(payload) {
  let list = []
  let { page, pagesize } = payload
  pagesize = pagesize || 20
  const query = new AV.Query('GroupOrders')
  query.limit(pagesize)
  query.skip(pagesize * (page - 1))
  query.greaterThanOrEqualTo('endDate', new Date())
  query.include('user')
  query.include('user.userinfo')
  query.include('team')
  return query.find().then(function(result) {
    result.forEach(item => {
      const userinfo = item
        .get('user')
        .get('userinfo')
        .toJSON()
      const res = { ...item.toJSON(), userinfo }
      list.push(res)
    })
    return list
  })
}