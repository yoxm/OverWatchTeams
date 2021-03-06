import React, { PureComponent } from 'react'
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

export default class AccountRecruitOrderListView extends PureComponent {
  constructor(props) {
    super(props)
    this.onEndReached = this.onEndReached.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
  }

  onEndReached = event => {
    if (
      this.props.recruitOrder.isFetching ||
      !this.props.recruitOrder.isLoadMore
    ) {
      return
    }
    const page = this.props.recruitOrder.page + 1
    this.props.getAccountRecruitOrderList({ page: page })
  }

  onRefresh = () => {
    this.props.getAccountRecruitOrderList({ isRefreshing: true })
  }

  onRemove = objectId => e => {
    Modal.alert('警告', '是否删除该招募令？', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '确定',
        onPress: () => this.props.deleteRecruitOrder({ objectId: objectId })
      }
    ])
  }

  render() {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }).cloneWithRows(this.props.recruitOrder.list)
    const separator = (sectionID, rowID) => <WhiteSpace key={`${rowID}`} />
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowData.objectId}>
          <Card full>
            <Card.Header
              title={rowData.title}
              thumb={rowData.team.avatar}
              extra={
                <div>
                  <Button
                    onClick={() => {
                      this.props.navigateTo(
                        '/account/recruitorders/edit/' + rowData.objectId
                      )
                    }}
                    type="ghost"
                    size="small"
                    inline
                  >
                    编辑
                  </Button>
                  <WhiteSpace size="xs" />
                  <Button
                    onClick={this.onRemove(rowData.objectId)}
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
                        `/home/team/${rowData.team.objectId}`
                      )
                    }
                    style={{ color: 'red' }}
                  >
                    {rowData.team.englishFullName ||
                      rowData.team.chineseFullName ||
                      rowData.team.englishName ||
                      rowData.team.chineseName}
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
                  发布时间：<TimeAgo
                    datetime={rowData.createdAt}
                    locale="zh_CN"
                  />
                </div>
              }
              extra={
                <div style={{ color: 'red' }}>
                  有效日期：<TimeAgo
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
          {this.props.recruitOrder.isFetching ? '' : '到底了'}
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
            refreshing={this.props.recruitOrder.isRefreshing}
            onRefresh={this.onRefresh}
          />
        }
      />
    )
  }
}

AccountRecruitOrderListView.propTypes = {
  recruitOrder: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  getAccountRecruitOrderList: PropTypes.func.isRequired,
  deleteRecruitOrder: PropTypes.func.isRequired
}
