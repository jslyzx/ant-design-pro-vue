<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索申请人" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
              <!-- <a @click="advanced = !advanced" style="margin-left: 8px" class="toggleAdvanced">
                更多筛选
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a> -->
            </a-form-item>
          </a-col>
           <a-col :md="13" style="text-align:right" :sm="24">
            <a-button type="primary" @click="reportApplyshow()">新建</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" :scroll="scroll" size="small" rowKey="ticketId" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
      <template slot="executeStatus" slot-scope="text">
        <a-badge :status="text == 0 ? 'success' : 'error'" :text="text == 0 ? '未注销' : '已注销'" />
      </template>
      <template slot="operation" slot-scope="text, record">
        <span v-if="record.executeStatus == 1">注销</span>
        <a v-else @click="handleLogout(record)">注销</a>
      </template>
    </s-table>
    <a-modal :visible="visible" title="申请开通报表" @ok="outSubmit"  @cancel="reportApplyhide">
      <a-form :form="form">
        <a-form-item label="申请理由" >
          <a-input  type="textarea" v-decorator="[
          'reason',
          { rules: [{ required: true, message: '请填写申请理由' }] },
        ]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import moment from 'moment'
import { getReporApplyList,saveReporApply } from '@/api/report'
import { STable } from '@/components'
import $ from 'jquery'
import { submitCheck } from '../../api/basis'

export default {
  name: 'reportApply',
  components: {
    STable
  },
  data() {
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
      loadData: parameter => {
        return getReporApplyList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
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
      columns: [{
          title: '申请中心',
          dataIndex: 'applyName',
          width: '120px'
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
          customRender: applyTime => moment(applyTime).format('YYYY-MM-DD'),
          width: '120px'
        },
        {
          title: '申请理由',
          dataIndex: 'reason',
          width: '200px'
        },
        {
          title: '申请状态',
          dataIndex: 'statusStr',
          width: '150px'
        },
         {
          title: '审核备注',
          dataIndex: 'checkReason',
          width: '200px'
        },
        {
          title: '审核时间',
          dataIndex: 'checkTime',
          customRender: checkTime => moment(checkTime).format('YYYY-MM-DD'),
          width: '150px'
        },
      ],
      form:this.$form.createForm(this),
      visible:false
    }
  },
  created() {
    this.scroll = {
      y: window.screen.height - 368 + 'px'
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    clearForm() {
      this.queryParam = {}
    },
    tableSearch(type) {
      this.queryParam.executeStatus = type
      this.$refs.table.refresh()
      this.advanced = false
    },
    handleLogout(record) {
      let that = this
      this.$confirm({
        title: '确定要注销该活动券吗？',
        onOk() {
          const params = new FormData();
          params.append('ticketId', record.ticketId)
          logoutTicket(params).then(res => {
            that.$refs.table.refresh()
          })
        },
        onCancel() {},
      });
    },
    refreshTable() {
      this.advanced = false
      this.$refs.table.refresh()
    },
    reportApplyshow(){
      this.visible=true
    },
    reportApplyhide(){
      this.visible=false
    },
    outSubmit(){
      var that = this
      this.form.validateFieldsAndScroll((errors, fieldsValue) => {
        if (!errors) {
          const params = new URLSearchParams()
          params.append('reason', fieldsValue.reason)
          saveReporApply(params).then(res => {
              if (res.code === -1) {
                that.$message.error(res.msg)
              } else {
                that.$message.success(res.msg)
                that.$refs.table.refresh()
                  that.visible = false
              }
          });
        }
      });
    }
  },
  mounted() {
    var that = this
    $(document).on('click', function(e) {
      if (e.target.className === 'toggleAdvanced') {
        return
      }
      if ($(e.target).closest(".tableSearch").length == 0 && $(e.target).closest(".ant-calendar").length == 0 && $(e.target).closest('.ant-calendar-year-panel-table').length === 0 && $(e.target).closest('.ant-calendar-month-panel-table').length === 0) {
        that.advanced = false
      }
    })
  }
}
</script>
<style lang="less" scoped>
/deep/.table-page-search-wrapper .ant-form-inline .ant-form-item {
  margin-bottom: 10px;
}

.tableSearch {
  background: #ffffff;
  position: absolute;
  top: 52px;
  box-shadow: 4px 4px 10px #ddd;
  z-index: 100;

  /deep/ .ant-card-body .ant-form-horizontal .ant-form-item>.ant-form-item-label {
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