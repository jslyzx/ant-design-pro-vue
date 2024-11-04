<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="3" :sm="24">
            <a-form-item>
              <a-date-picker placeholder="请选择截止时间" :disabled-date="disabledDate" v-model="queryParam.date" style="width: 200px;" @change="changeTime"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
            </a-form-item>
          </a-col>
          <a-col :md="15" style="text-align:right" :sm="24">
            <a-button type="primary" @click="_export">导出</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="small" rowKey="centerName" :scroll="scroll" :columns="columns" :data="loadData" :alert="options.alert" showPagination="auto" :locale="locale" :pageSizeOptions="pageSizeOptions" :pageSize="pageSize">
    </s-table>
    <a-modal v-model="visible" title="提示" :footer="null" :bodyStyle="bodyStyle">
      <p>请选择截止时间进行导出！</p>
    </a-modal>
  </a-card>
</template>
<script>
import moment from 'moment'
import { getCenterMonthDate } from '@/api/report'
import { STable } from '@/components'
import { Modal } from 'ant-design-vue'

export default {
  name: 'monthlyData',
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      bodyStyle: {
        padding: '10px',
        paddingBottom: '0px'
      },
      // 查询参数
      queryParam: {},
      loadData: parameter => {
        if(this.queryParam.dateStr) {
          return getCenterMonthDate(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        } else {
          return []
        }
      },
      scroll: false,
      pageSizeOptions: [50, 100, 200],
      pageSize: 200,
      locale: {
        emptyText: '请选择截止时间进行查询'
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
        title: '中心编号',
        dataIndex: 'centerCode',
        width: '100px'
      },{
        title: '分支中心',
        dataIndex: 'centerName',
        width: '270px'
      },{
        title: '基线总数量',
        dataIndex: 'type1Num',
        width: '110px'
      },{
        title: '基线提交总数量',
        dataIndex: 'type9Num',
        width: '170px'
      },{
        title: '上月新增基线数量',
        dataIndex: 'type4Num',
        width: '160px'
      },{
        title: '上月新增基线提交数',
        dataIndex: 'type10Num',
        width: '160px'
      },{
        title: '上月新增随访数量',
        dataIndex: 'type7Num',
        width: '160px'
      },{
        title: '近6个月新增基线数量',
        dataIndex: 'type2Num',
        width: '170px'
      },{
        title: '近3个月新增基线数量',
        dataIndex: 'type3Num',
        width: '170px'
      },{
        title: '近6个月新增随访数量',
        dataIndex: 'type5Num',
        width: '170px'
      },{
        title: '近3个月新增随访数量',
        dataIndex: 'type6Num',
        width: '170px'
      },{
        title: '截止查询时间基线数量',
        dataIndex: 'type8Num'
      }],
      createArr: [],
      submitArr: [],
      bodyStyle: {
        fontSize: '30px',
        color: 'red'
      }
    }
  },
  created() {
    this.scroll = {
      x: '1300px',
      y: (window.screen.height - 398) + "px"
    }
  },
  methods: {
    disabledDate(current) {
      return current && (current > moment().endOf('day') || current.get('year') < 1930)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    tableSearch(type) {
      this.queryParam.isUser = type
      this.$refs.table.refresh()
      this.advanced = false
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    changeSubmit(time) {
      this.submitArr = time;
      this.queryParam.submitDateStart = moment(time[0]).format('YYYY-MM-DD')
      this.queryParam.submitDateEnd = moment(time[1]).format('YYYY-MM-DD')
    },
    _export() {
      const h = this.$createElement
      if(this.queryParam.dateStr) {
        window.open(this.baseUrl + 'patientReport/exportCenterDate')
      } else {
        this.visible = true
      }
    },
    changeTime(time) {
      this.queryParam.dateStr = moment(time).format('YYYY-MM-DD')
      this.refreshTable()
    }
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

/deep/ .ant-table td {
  white-space: nowrap;
}
</style>