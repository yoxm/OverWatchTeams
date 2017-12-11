import { put, fork, take, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { Toast } from 'antd-mobile'
import { replace } from 'react-router-redux'
import {
  GET_HOME_WAR_ORDER_LIST_REQUEST,
  GET_ACCOUNT_WAR_ORDER_LIST_REQUEST,
  POST_WAR_ORDER_REQUEST,
  PUT_WAR_ORDER_REQUEST,
  DELETE_WAR_ORDER_REQUEST
} from '../constants/actionTypes'
import * as action from '../actions'
import { warOrder, teams } from '../services/leanclound'

function* postWarOrderWorker(payload) {
  try {
    yield put(action.fetchRequest({ text: '提交中' }))
    const response = yield call(warOrder.cerateWarOrder, payload)
    yield put(action.postWarOrderSuccess(response))
    yield put(action.fetchSuccess())
    Toast.success('提交成功', 1)
    yield delay(1000)
    yield put(replace('/account/warorders'))
  } catch (error) {
    yield put(action.postWarOrderFailed(error))
    yield put(action.fetchFailed())
    Toast.success('提交失败', 1)
  }
}

function* putWarOrderWorker(payload) {
  try {
    yield put(action.fetchRequest({ text: '提交中' }))
    const team = yield call(teams.getTeam, payload)
    const response = yield call(warOrder.updateWarOrder, payload, team)
    yield put(action.putWarOrderSuccess(response))
    yield put(action.fetchSuccess())
    Toast.success('提交成功', 1)
    yield delay(1000)
    yield put(replace('/account/warorders'))
  } catch (error) {
    yield put(action.putWarOrderFailed(error))
    yield put(action.fetchFailed())
    Toast.success('提交失败', 1)
  }
}

function* deleteWarOrderWorker(payload) {
  try {
    yield put(action.fetchRequest({ text: '提交中' }))
    const response = yield call(warOrder.removeWarOrder, payload)
    yield put(action.deleteWarOrderSuccess(response))
    yield put(action.fetchSuccess())
    Toast.success('删除成功', 1)
  } catch (error) {
    yield put(action.deleteWarOrderFailed(error))
    yield put(action.fetchFailed())
    Toast.success('删除失败', 1)
  }
}

function* getAccountWarOrderListWorker(payload) {
  try {
    const response = yield call(
      warOrder.getAccountWarOrderList,
      payload
    )
    yield put(action.getAccountWarOrderListSuccess(response))
  } catch (error) {
    yield put(action.getAccountWarOrderListFailed(error))
  }
}

function* getHomeWarOrderListWorker(payload) {
  try {
    const response = yield call(warOrder.getHomeWarOrderList, payload)
    yield put(action.getHomeWarOrderListSuccess(response))
  } catch (error) {
    yield put(action.getHomeWarOrderListFailed(error))
  }
}

function* watchPostWarOrder() {
  while (true) {
    const { payload } = yield take(POST_WAR_ORDER_REQUEST)
    yield fork(postWarOrderWorker, payload)
  }
}

function* watchGetAccountWarOrderList() {
  while (true) {
    const { payload } = yield take(GET_ACCOUNT_WAR_ORDER_LIST_REQUEST)
    yield fork(getAccountWarOrderListWorker, payload)
  }
}

function* watchGetHomeWarOrderList() {
  while (true) {
    const { payload } = yield take(GET_HOME_WAR_ORDER_LIST_REQUEST)
    yield fork(getHomeWarOrderListWorker, payload)
  }
}

function* watchPutWarOrder() {
  while (true) {
    const { payload } = yield take(PUT_WAR_ORDER_REQUEST)
    yield fork(putWarOrderWorker, payload)
  }
}

function* watchDeleteWarOrder() {
  while (true) {
    const { payload } = yield take(DELETE_WAR_ORDER_REQUEST)
    yield fork(deleteWarOrderWorker, payload)
  }
}

export {
  watchGetHomeWarOrderList,
  watchPostWarOrder,
  watchGetAccountWarOrderList,
  watchPutWarOrder,
  watchDeleteWarOrder
}