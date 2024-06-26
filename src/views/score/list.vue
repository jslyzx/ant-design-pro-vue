<template>
  <a-card :bordered="false" :bodyStyle="bodyStyle">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-input v-model.trim="queryParam.keyWord" placeholder="搜索患者姓名、入组编号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="refreshTable">查询</a-button>
            </a-form-item>
          </a-col>
          <a-col :md="13" style="text-align:right" :sm="24">
            <a-button type="primary" @click="_export">导出</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="small" rowKey="centerName" :scroll="scroll" :columns="columns" :data="loadData" :alert="options.alert" showPagination="auto">
    </s-table>
  </a-card>
</template>
<script>
import moment from 'moment'
import { patientReport } from '@/api/basis'
import { STable } from '@/components'

const visitMap = {
  1: {
    text: '有铜绿'
  },
  2: {
    text: '无铜绿'
  }
};

export default {
  name: 'scoreList',
  components: {
    STable
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      bodyStyle: {
        padding: '10px',
        paddingBottom: '0px'
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      loadData: parameter => {
        return patientReport(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      scroll: {x: 3160},
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
        title: '患者姓名',
        dataIndex: 'patientName',
        width: 80
      },{
        title: '患者性别',
        dataIndex: 'sexName',
        width: 80
      },{
        title: '患者年龄',
        dataIndex: 'age',
        width: 80
      },{
        title: '文化程度',
        dataIndex: 'census',
        width: 120
      },{
        title: '过去两年急性加重住院次数',
        dataIndex: 'a71',
        width: 190
      },{
        title: '过去一年急性加重住院次数',
        dataIndex: 'a81',
        width: 190
      },{
        title: '过去1年急性加重次数',
        dataIndex: 'a91',
        width: 150
      },{
        title: '胸部影像学支扩类型',
        dataIndex: 'a101',
        width: 150
      },{
        title: '心超小结',
        dataIndex: 'a111',
        width: 80
      },{
        title: '肺功能结论',
        dataIndex: 'a121',
        width: 100
      },{
        title: '通气功能减退类型',
        dataIndex: 'a131',
        width: 150
      }, {
        title: '入组编号',
        dataIndex: 'fileCode',
        width: 100
      }, {
        title: '是否有铜绿',
        dataIndex: 'itTlStr',
        width: 100
      }, {
        title: 'FACED评分',
        dataIndex: 'faced',
        width: 100
      }, {
        title: 'BACI评分',
        dataIndex: 'baci',
        width: 100
      }, {
        title: 'REFFI评分',
        dataIndex: 'reffi',
        width: 100
      }, {
        title: '病因诊断',
        dataIndex: 'byzd',
        width: 240
      }, {
        title: 'FVC',
        dataIndex: 'a21',
        width: 150
      },{
        title: 'FVC%',
        dataIndex: 'a61',
        width: 80
      }, {
        title: 'FEV1',
        dataIndex: 'a31',
        width: 150
      }, {
        title: 'FEV1% ',
        dataIndex: 'a51',
        width: 80
      },{
        title: 'FEV1%FVC',
        dataIndex: 'a41',
        width: 150
      }, {
        title: 'BSI评分',
        dataIndex: 'bsi',
        width: 100
      }, {
        title: 'BHQ问卷得分',
        dataIndex: 'bhq',
        width: 100
      }, {
        title: 'MMRC评分',
        dataIndex: 'mmrc',
        width: 100
      }, {
        title: 'HADS-A评分',
        dataIndex: 'had',
        width: 100
      },{
        title: 'HADS-D评分',
        dataIndex: 'hadd',
        width: 100
      }, {
        title: 'lcq总评分',
        dataIndex: 'lcq',
        width: 100
      }, {
        title: 'lcq生理评分',
        dataIndex: 'lcqSl',
        width: 100
      }, {
        title: 'lcq心理评分',
        dataIndex: 'lcqXl',
        width: 100
      }, {
        title: 'lcq社会评分',
        dataIndex: 'lcqSh',
        width: 100
      }, {
        title: 'qolb身体评分',
        dataIndex: 'qolb1',
        width: 100
      }, {
        title: 'qolb角色评分',
        dataIndex: 'qolb2',
        width: 100
      }, {
        title: 'qolb活力评分',
        dataIndex: 'qolb3',
        width: 100
      }, {
        title: 'qolb情绪评分',
        dataIndex: 'qolb4',
        width: 100
      }, {
        title: 'qolb社会评分',
        dataIndex: 'qolb5',
        width: 100
      }, {
        title: 'qolb医疗评分',
        dataIndex: 'qolb6',
        width: 100
      }, {
        title: 'qolb健康评分',
        dataIndex: 'qolb7',
        width: 100
      }, {
        title: 'qolb呼吸评分',
        dataIndex: 'qolb8',
        width: 100
      }],
      createArr: [],
      submitArr: []
    }
  },
  created() {
    // this.scroll = {
    //   X: '9999999px',
    //   y: window.screen.height - 400 + 'px'
    // }
    // this.scroll.x = 9999999 + 'px'
    this.scroll.y = window.screen.height - 400 + 'px'
  },
  filters: {
    visitFilter(type) {
      return visitMap[type].text;
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
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    clearForm() {
      this.queryParam = {}
      this.createArr = []
      this.submitArr = []
    },
    tableSearch(type) {
      this.queryParam.isUser = type
      this.$refs.table.refresh()
      this.advanced = false
    },
    refreshTable() {
      this.advanced = false
      this.$refs.table.refresh()
    },
    changeCreate(time) {
      this.createArr = time;
      this.queryParam.createDateStart = moment(time[0]).format('YYYY-MM-DD')
      this.queryParam.createDateEnd = moment(time[1]).format('YYYY-MM-DD')
    },
    changeSubmit(time) {
      this.submitArr = time;
      this.queryParam.submitDateStart = moment(time[0]).format('YYYY-MM-DD')
      this.queryParam.submitDateEnd = moment(time[1]).format('YYYY-MM-DD')
    },
    _export() {
      window.open(this.baseUrl + 'patientReport/export')
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