<template>
  <a-modal
    title="选择患者"
    :width="800"
    :destroyOnClose="destroyOnClose"
    :bodyStyle="bodyStyle"
    :centered="centered"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="checkuUser"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-table :columns="columns" rowKey="patientId" :rowSelection="rowSelection" :dataSource="data" :pagination="pagination" :loading="loading" @change="handleTableChange">
        <template slot="name" slot-scope="name">
          {{ name.first }} {{ name.last }}
        </template>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { getPatientList } from '@/api/patient'
import moment from 'moment'
import _ from 'lodash'
import { Modal } from 'ant-design-vue'

const columns = [
  {
    title: '入组编号',
    dataIndex: 'fileBasisCode'
  },
  {
    title: '患者姓名',
    dataIndex: 'name'
  },
  {
    title: '身份证号',
    dataIndex: 'card'
  },
  {
    title: '联系方式',
    dataIndex: 'telephone1'
  },
  {
    title: '创建日期',
    dataIndex: 'createDate',
    customRender: createDate => moment(createDate).format('YYYY-MM-DD')
  }
];
export default {
  data() {
    return {
      name: '',
      userData: {},
      data: [],
      pagination: {
        defaultPageSize: 5,
        pageSize: 5,
        hideOnSinglePage: true,
        total: 0
      },
      loading: false,
      columns,
      visible: false,
      confirmLoading: false,
      destroyOnClose: true,
      centered: true,
      bodyStyle: {
        height: '480px',
        overflow: 'auto'
      }
    };
  },
  methods: {
    add(value) {
      this.visible = true;
      this.confirmLoading = true;
      this.userData = {};
      this.getPatientList(1, this.pagination.pageSize, value);
    },
    checkuUser() {
      if (JSON.stringify(this.userData) == '{}') {
        this.$message.error('您还未选择患者！')
        Modal.error({
          title: '提示',
          content: '您还未选择患者！'
        });
        return
      }
      this.$emit('listen', this.userData);
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
    handleTableChange(pagination, filters, sorter) {
      this.getPatientList(pagination.current, pagination.pageSize);
    },
    getPatientList(pageNumber, pageSize, keyword) {
      const keyWord = keyword ? keyword : '';
      const Params = new URLSearchParams();
      Params.append('pageNumber', pageNumber);
      Params.append('pageSize', pageSize);
      Params.append('keyWord', keyWord);
      getPatientList(Params).then(res => {
        this.data = res.data;
        this.pagination.total = res.total;
        this.confirmLoading = false;
      });
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.userData = selectedRows[0];
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      };
    }
  }
};
</script>
