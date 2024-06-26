<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索患者姓名、手机号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
              <a @click="advanced = !advanced" style="margin-left: 8px" class="toggleAdvanced">
                更多筛选
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </a-form-item>
          </a-col>
          <a-col v-if="advanced" class="tableSearch" :md="8">
            <div>
              <a-tabs :style="{width: '250px'}" defaultActiveKey="1">
                <a-tab-pane tab="常用检索" key="1">
                  <div class="commonRetrieval">
                    <p @click="tableSearch()">全部</p>
                    <p @click="tableSearch(1)">待答复</p>
                    <p @click="tableSearch(3)">已答复</p>
                  </div>
                </a-tab-pane>
                <!-- <a-tab-pane tab="自定义检索" key="2" forceRender>
                  <a-card :bordered="false">
                    <a-form>
                      <a-form-item label="姓名">
                        <a-input v-model.trim="queryParam.name" />
                      </a-form-item>
                      <a-form-item label="身份证号">
                        <a-input v-model.trim="queryParam.card" />
                      </a-form-item>
                      <a-form-item style="text-align: right; margin-bottom: 0; margin-top: 15px">
                        <a-button type="primary" @click="clearForm()">清空</a-button>
                        <a-button type="primary" style="margin-left: 10px" @click="refreshTable">查询</a-button>
                      </a-form-item>
                    </a-form>
                  </a-card>
                </a-tab-pane> -->
              </a-tabs>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      :scroll="scroll"
      size="small"
      rowKey="wxPatientId"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="operation" slot-scope="text, record">
        <template>
          <a @click="handleReview(record)">答复</a>
        </template>
      </span>
    </s-table>
    <reply-view ref="replyView" @ok="handleOk"></reply-view>
  </a-card>
</template>
<script>
import moment from 'moment'
import { getMessageDataList, getPatientMessageList } from '@/api/messageReply'
import { STable } from '@/components'
import $ from 'jquery'
import replyView from './modules/replyView.vue'
export default {
  components: {
    STable,
    replyView
  },
  data () {
    return {
      bodyStyle: {
        padding: '10px',
        paddingBottom: '0px'
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      scroll: false,
      dataEchoInfo: {},
      loadData: (parameter) => {
        return getMessageDataList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: {
          show: false,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      columns: [
        {
          title: '患者姓名',
          dataIndex: 'patientName',
          width: 100
        },
        {
          title: '手机号码',
          dataIndex: 'telephone',
          width: 120
        },
        {
          title: '留言状态',
          dataIndex: 'statusStr',
          width: 100
        },
        {
          title: '首次留言',
          dataIndex: 'firstMessage',
          width: 300,
          ellipsis: true
        },
        {
          title: '最新留言',
          dataIndex: 'lastMessage',
          width: 300,
          ellipsis: true
        },
        {
          title: '最新留言时间',
          dataIndex: 'lastMessageTime',
          customRender: (lastMessageTime) => moment(lastMessageTime).format('YYYY-MM-DD HH:mm:ss'),
          width: 150
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 60
        }
      ]
    }
  },
  created () {
    this.scroll = {
      y: window.screen.height - 368 + 'px'
    }
  },
  mounted () {
    var that = this
    $(document).on('click', function (e) {
      if (e.target.className === 'toggleAdvanced') {
        return
      }
      if (
        $(e.target).closest('.tableSearch').length == 0 &&
        $(e.target).closest('.ant-calendar').length == 0 &&
        $(e.target).closest('.ant-calendar-year-panel-table').length === 0 &&
        $(e.target).closest('.ant-calendar-month-panel-table').length === 0
      ) {
        that.advanced = false
      }
    })
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    clearForm () {
      this.queryParam = {}
    },
    tableSearch (type) {
      this.queryParam.replyStatus = type
      this.$refs.table.refresh()
      this.advanced = false
    },
    refreshTable () {
      this.advanced = false
      this.$refs.table.refresh()
    },
    async handleReview (recode) {
      const { data } = await getPatientMessageList(recode.patientCenterMessageId)
      this.$refs.replyView.replyMessage(data)
    },
    handleOk () {
      this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 10px;
}

/deep/ .ant-table-tbody td{
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tableSearch {
  background: #ffffff;
  position: absolute;
  top: 52px;
  box-shadow: 4px 4px 10px #ddd;
  z-index: 100;

  /deep/ .ant-card-body .ant-form-horizontal .ant-form-item > .ant-form-item-label {
    width: 70px !important;
  }

  .commonRetrieval {
    padding: 10px;

    p {
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}
</style>

