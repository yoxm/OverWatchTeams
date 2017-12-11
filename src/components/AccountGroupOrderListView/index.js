import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ListView,
  PullToRefresh,
  Card,
  Flex,
  WhiteSpace,
  Button,
  Modal
} from 'antd-mobile'
import TimeAgo from 'timeago-react'

export default class AccountGroupOrderListView extends Component {
  constructor(props) {
    super(props)
    this.onEndReached = this.onEndReached.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }

  onEndReached = event => {
    if (
      this.props.groupOrder.isFetching ||
      !this.props.groupOrder.isLoadMore
    ) {
      return
    }
    const page = this.props.groupOrder.page + 1
    this.props.getAccountGroupOrderList({ page: page })
  }

  onRefresh = () => {
    this.props.getAccountGroupOrderList({ isRefreshing: true })
  }

  onRemove = objectId => {
    Modal.alert('警告', '是否删除该组队贴？', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '确定',
        onPress: () => this.props.deleteGroupOrder({ objectId: objectId })
      }
    ])
  }

  render() {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }).cloneWithRows(this.props.groupOrder.list)
    const separator = (sectionID, rowID) => <WhiteSpace key={`${rowID}`} />
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID}>
          <Card full>
            <Card.Header
              title={rowData.title}
              thumb={rowData.userinfo.avatar}
              extra={
                <div>
                  <Button
                    onClick={() => {
                      this.props.navigateTo(
                        '/account/grouporders/edit/' + rowData.objectId
                      )
                    }}
                    type="ghost"
                    size="small"
                    inline
                  >
                    编辑
                  </Button>
                  <Button
                    onClick={this.onRemove.bind(this, rowData.objectId)}
                    type="warning"
                    size="small"
                    inline
                  >
                    删除
                  </Button>
                </div>
              }
            />
            <Card.Body>
              <Flex>
                <Flex.Item>
                  <span
                    onClick={() =>
                      this.props.navigateTo(
                        `/home/user/${rowData.userinfo.objectId}`
                      )
                    }
                    style={{ color: 'red' }}
                  >
                    {rowData.userinfo.nickname}
                  </span>
                </Flex.Item>
                <Flex.Item>
                  <span style={{ color: 'red' }}>{rowData.contact}</span>
                </Flex.Item>
              </Flex>
              <WhiteSpace />
              <Flex>
                <Flex.Item>{rowData.description}</Flex.Item>
              </Flex>
            </Card.Body>
            <Card.Footer
              content={
                <div>
                  开始时间：<TimeAgo
                    datetime={rowData.createdAt}
                    locale="zh_CN"
                  />
                </div>
              }
              extra={
                <div style={{ color: 'red' }}>
                  截止日期：<TimeAgo
                    datetime={rowData.endDate}
                    locale="zh_CN"
                  />
                </div>
              }
            />
          </Card>
        </div>
      )
    }
    const fonter = () => {
      return (
        <div style={{ padding: 5, textAlign: 'center' }}>
          {this.props.groupOrder.isFetching ? '' : '到底了'}
        </div>
      )
    }
    return (
      <ListView
        dataSource={dataSource}
        renderFooter={fonter}
        renderRow={row}
        renderSeparator={separator}
        initialListSize={20}
        pageSize={20}
        style={{
          height: '100%',
          overflow: 'auto'
        }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={100}
        pullToRefresh={
          <PullToRefresh
            refreshing={this.props.groupOrder.isRefreshing}
            onRefresh={this.onRefresh}
          />
        }
      />
    )
  }
}

AccountGroupOrderListView.propTypes = {
  groupOrder: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  getAccountGroupOrderList: PropTypes.func.isRequired,
  deleteGroupOrder: PropTypes.func.isRequired
}