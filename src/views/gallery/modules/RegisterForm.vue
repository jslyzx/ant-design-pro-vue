<template>
  <a-modal title="添加采集" :width="800" :bodyStyle="bodyStyle" :maskClosable="maskClosable" :centered="centered" :destroyOnClose="destroyOnClose" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item v-if="JSON.stringify(userData) == '{}'">
          <a-input-search placeholder="搜索患者姓名、身份证号" @search="onSearch" v-decorator="['card', { rules: [{ required: true , message: '该选项必填'}] }]" enterButton />
        </a-form-item>
        <div v-else>
          <user-detail :option="userData"></user-detail>
          <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="采集报告" key="1">
              <a-form-item>
                <a-checkbox-group v-decorator="['basisElementId', { rules: [{ required: true , message: '该选项必填'}] }]" style="width:100%">
                  <a-row>
                    <a-col :span="8" style="margin-top: 20px;" v-for="item in registerList" :key="item.id">
                      <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
                    </a-col>
                  </a-row>
                </a-checkbox-group>
              </a-form-item>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-form>
      <user-list ref="userListModule" @listen="checkuUser" />
    </a-spin>
  </a-modal>
</template>
<script>
  import { getReportType, createReport } from '@/api/report';
  import UserList from './UserList';
  import UserDetail from '../../list/modules/UserDetailTop.vue';
  import _ from 'lodash';
  export default {
    components: {
      UserList,
      UserDetail
    },
    data() {
      return {
        userData: {},
        registerList: [],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        visible: false,
        confirmLoading: false,
        centered: true,
        maskClosable: false,
        destroyOnClose: true,
        bodyStyle: {
          height: '480px',
          overflow: 'auto'
        },
        form: this.$form.createForm(this),
        requiredRule: { rules: [{ required: true, message: '该选项必填' }] }
      };
    },
    methods: {
      add() {
        this.userData = {};
        this.visible = true;
      },
      handleSubmit() {
        const {
          form: { validateFieldsAndScroll }
        } = this;
        this.confirmLoading = true;
        validateFieldsAndScroll((errors, fieldsValue) => {
          const that = this;
          if (errors) {
            this.confirmLoading = false;
            return;
          }
          const params = new URLSearchParams();

          params.append('patientId', this.userData.patientId)
          params.append('basisMarkIds', fieldsValue.basisElementId.join(','))
          createReport(params).then(res => {
            console.log(res);
            that.visible = false;
            that.confirmLoading = false;
            that.$emit('ok');
            // that.$router.push({
            //   path: '/gallery/detail/' + res.data.reportCollectBaseId
            // })
          });
        });
      },
      handleCancel() {
        this.visible = false;
      },
      onSearch(value) {
        // this.form.validateFieldsAndScroll(['card'], (errors, values) => {
        //     if (errors) {
        //         return
        //     }
        this.$refs.userListModule.add(value);
        // })
      },
      checkuUser(data) {
        const that = this;
        this.userData = data;
        getReportType()
          .then(res => {
            that.registerList = _.map(res.data, function (v) {
              return {
                value: v.basisMarkId,
                label: v.basisMarkName
              }
            })
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  };
</script>