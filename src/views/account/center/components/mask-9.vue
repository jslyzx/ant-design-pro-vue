<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false" id="baselineHeader" style="background-color: #0399EC;color:#FFFFFF;" v-if="!isGroup">
      <a-row :gutter="30" style="line-height: 34px;">
        <a-col :md="1" :sm="4">
          <a-icon type="left" style="fontSize:18px;cursor: pointer;" @click="$router.back(-1)" />
        </a-col>
        <a-col :md="5" :sm="20" class="UserNameCard">
          <my-icon type="iconshoufangzhehuaban" />
          受访者：{{ patient.name }}
        </a-col>
        <a-col :md="7" :sm="24" class="UserNameCard">
          <my-icon type="iconshenfenzhenghuaban" />
          身份证：{{ patient.card }}
        </a-col>
        <a-col :md="11" :sm="24" style="fontSize:18px;textAlign: right;">创建时间：{{ patientBasis.createDate | moment }}</a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false" class="card-box">
      <a-row :gutter="8">
        <a-col :span="5" :style="baselineInfoStyle">
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="19" style="height:100%;">
          <a-form :form="form" @submit="handleSubmit" class="base-form">
            <div class="clearfix" style="position:relative;top: 20px;">
              <a-button class="btn fr" type="primary" @click="_importData">导入数据</a-button>
            </div>
            <div class="btn-array" v-if="executeStatus !== 2 && canEdit">
              <a-button class="btn fr" type="primary" html-type="submit" ref="submitBtn">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="btn-array" v-if="executeStatus === 2 && canEdit">
              <a-button class="btn fr" type="primary" @click="withdraw">撤回</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <p class="tip">必填项如数据缺失无法提交，请一律用"/"来填写!（ICON患者，必须填写实际检测值。基线访视辅助检查可使用入组前6个月内的检查结果，但要求从检查日期到入组日期之间未发生急性加重，否则需要在基线数据收集时重新辅助检查）</p>
              <div style="background-color:#f7f8f8;overflow:hidden">
                <a style="float: right;font-size:12px;line-height:40px;margin-right: 12px;font-weight: bold;" @click="showOcr = !showOcr">OCR</a>
              </div>
              <a-form-item label="报告上传:" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="showOcr">
                <div class="clearfix" style="margin-top: 10px;">
                  <a-upload :action="uploadUrl" class="images" v-viewer listType="picture-card" :fileList="fileList" @preview="handlePreview" @change="handleChange">
                    <div v-if="fileList.length < 1">
                      <a-icon type="plus" />
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <a-button style="position: absolute;top: 84px;left: 120px;font-size: 12px;padding: 0 5px;height: 30px;" @click="_import" v-if="fileList.length === 1 && showOcr">OCR识别</a-button>
                </div>
              </a-form-item>
              <a-form-item label="有无心脏彩超" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a1', {...require2, initialValue: initValue('a1')}]" @change="changeRadio($event, 'controla1')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla1">
                <a-form-item label="(1) 主动脉根部内径:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b1', { initialValue: initValue('b1')}]" addonAfter="cm" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(2) 左房收缩末期内径:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b2', { initialValue: initValue('b2')}]" addonAfter="cm" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(3) 左室舒张末期内径:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b3', { initialValue: initValue('b3')}]" addonAfter="cm" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(4) 左室收缩末期内径:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b4', { initialValue: initValue('b4')}]" addonAfter="cm" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(5) 室间隔厚度:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b5', { initialValue: initValue('b5')}]" addonAfter="cm" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(6) 左室后壁厚度:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b6', { initialValue: initValue('b6')}]" addonAfter="cm" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(7) 肺动脉收缩压:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b8', { initialValue: initValue('b8')}]" addonAfter="mmHg" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(8) 主肺动脉内径:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b7', { initialValue: initValue('b7')}]" addonAfter="cm" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(9) 右房内径:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['e1', { initialValue: initValue('e1')}]" addonAfter="cm" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(10) 右室内径:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['e2', { initialValue: initValue('e2')}]" addonAfter="cm" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(11) 右室流出道:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['e3', { initialValue: initValue('e3')}]" addonAfter="cm" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(12) 左室射血分数:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['c1', { initialValue: initValue('c1')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(13) 左室短轴缩短率:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['c2', { initialValue: initValue('c2')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
                <div class="title">3.小结</div>
                <a-form-item label="小结:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['d1', {initialValue: initValue('d1')}]">
                    <a-radio value="1">肺动脉高压</a-radio>
                    <a-radio value="2">肺源性心脏病</a-radio>
                    <a-radio value="3">无</a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
            </div>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
    <a-spin :spinning="spinning"></a-spin>
  </div>
</template>
<script>
import STree from '@/components/Tree/Tree'
import moment from 'moment'
import { mapActions } from 'vuex'
import { getPatientBasis, saveBasis, getBasisForm, recoverSubmit, exportFormData } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
import { getOcrResult } from '@/api/basis'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ContactForm from '@/views/account/ContactForm'
import { Modal } from 'ant-design-vue'
export default {
  name: 'mask9',
  components: {
    STree,
    MyIcon,
    ContactForm
  },
  data() {
    return {
      controla1: false,
      showOcr: false,
      markName: 'xzcc',
      title: '基线',
      openKeys: [],
      defaultSelectedKeys: [9],
      orgTree: [],
      patient: {},
      patientBasis: {},
      baselineInfoStyle: {
        overflow: "auto",
        height: '100%',
        "padding-right": "0px",
        "border-right": "1px solid #ddd"
      },
      baselineFormStyle: {
        // height: '444px',
      },
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 7 }
      },
      wrapper18: {
        md: { span: 18 }
      },
      labelColVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      wrapperHor: {
        xs: { span: 24 },
        sm: { span: 17 },
        md: { span: 17 }
      },
      wrapperVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      labelColOffset: {
        md: { span: 4, offset: 7 }
      },
      wrapperOffset: {
        md: { span: 13 }
      },
      dateRequire: {
        rules: [{ type: 'object', required: true, message: '请选择时间！' }]
      },
      require1: {
        rules: [{ required: true, message: '请选择是或否！' }]
      },
      require2: {
        rules: [{ required: true, message: '请选择有或无！' }]
      },
      selectRequired: {
        rules: [{ required: true, message: '请选择！' }]
      },
      inputRequired: {
        rules: [{ required: true, message: '请填写！' }]
      },
      form: this.$form.createForm(this),
      maskId: this.$route.meta.maskId,
      patientBasisId: this.$route.params.id,
      xzcc: undefined,
      spinning: false,
      executeStatus: false,
      uploadUrl: process.env.VUE_APP_API_UPLOAD_URL,
      viewPicUrl: process.env.VUE_APP_API_VIEW_PIC_URL,
      fileList: [],
      isGroup: this.$ls.get(ACCESS_TOKEN).roleId === 1 || false,
      canEdit: false,
      submitInfo: undefined
    }
  },
  created() {
    var that = this
    this.CloseSidebar()
    var params = new URLSearchParams()
    params.append('patientBasisId', this.patientBasisId)
    getPatientBasis(params)
      .then(res => {
        that.patient = res.data.patient
        that.patientBasis = res.data.patientBasis
        that.orgTree = res.data.list
        that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
        that.canEdit = that.$ls.get(ACCESS_TOKEN).centerId === that.patient.targetCenterId
      })
    this.getFormData()
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {
      if (e.target.value === '1') {
        this[t] = true
      } else {
        this[t] = false
      }
    },
    handleClick(e) {
      if (e.key >= 31 && e.key <= 36) {
        this.$router.replace('/basis/question/' + this.patientBasisId + '/' + e.key)
      } else {
        this.$router.replace('/list/basis/' + this.patientBasisId + '/' + e.key)
      }
    },
    handleSubmit(e) {
      var _this = this
      e.preventDefault()
      const { form: { validateFieldsAndScroll } } = this
      validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          var re = this.form.getFieldsValue()
          re = {
            ...re,
            't1': typeof re['t1'] !== 'undefined' ? re['t1'].format('YYYY-MM-DD') : ''
          }
          var that = this
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.xzcc && this.xzcc.xzccId) {
            re.xzccId = this.xzcc.xzccId
          }
          params.append('formData', JSON.stringify(re))
          params.append('patientBasis', JSON.stringify(this.patientBasis))
          params.append('basisMarkId', this.maskId)
          params.append('markName', this.markName)
          this.spinning = true
          saveBasis(params)
            .then(res => {
              console.log(res)
              that.spinning = false
              that.getFormData()
              // that.$message.success(res.msg)
              Modal.success({
                title: '提示',
                content: res.msg
              });
              params = new URLSearchParams()
              params.append('patientBasisId', that.patientBasisId)
              getPatientBasis(params)
                .then(res => {
                  that.orgTree = res.data.list
                  that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
                })
                .catch(error => {
                  console.log(error)
                })
            })
            .catch(error => {
              that.spinning = false
              console.log(error)
            })
        } else {
          this.spinning = false
        }
      })
    },
    initValue(key, type = 'normal') {
      if (!this.xzcc) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.xzcc[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.xzcc[key])
      } else if (type === 'array') {
        return this.xzcc[key].split(',')
      } else {
        return this.xzcc[key] + ''
      }
    },
    handleOk(v) {
      this.submitInfo = v
      this.$refs.submitBtn.$el.click()
    },
    dealAnswers(answer) {
      if (answer && !_.isEmpty(answer)) {
        if (answer.a1 === '1') {
          this.controla1 = true
        }
      }
      return answer
    },
    getFormData() {
      this.spinning = true
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', this.maskId)
      getBasisForm(params)
        .then(res => {
          this.spinning = false
          if (res.data && res.data.xzcc)
            that.xzcc = that.dealAnswers(res.data.xzcc)
        })
        .catch(error => {
          this.spinning = false
          console.log(error)
        })
    },
    save() {
      var re = this.form.getFieldsValue()
      re = {
        ...re,
        't1': typeof re['t1'] !== 'undefined' ? re['t1'].format('YYYY-MM-DD') : ''
      }
      var that = this
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.xzcc && this.xzcc.xzccId) {
        re.xzccId = this.xzcc.xzccId
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      this.spinning = true
      saveBasis(params)
        .then(res => {
          console.log(res)
          that.spinning = false
          that.getFormData()
          // that.$message.success(res.msg)
          Modal.success({
            title: '提示',
            content: res.msg
          });
          params = new URLSearchParams()
          params.append('patientBasisId', that.patientBasisId)
          getPatientBasis(params)
            .then(res => {
              that.orgTree = res.data.list
              that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          that.spinning = false
          console.log(error)
        })
      return false
    },
    _import() {
      this.spinning = true
      var params = new URLSearchParams()
      params.append('type', 5)
      params.append('url', this.fileList[0].url || this.fileList[0].response.data.src)
      var that = this
      getOcrResult(params)
        .then(res => {
          console.log(res.data)
          this.spinning = false
          // this.$message.success(res.data.info)
          Modal.success({
            title: '提示',
            content: res.data.info
          });
          this.xzcc = _.extend(this.xzcc || {}, this.dealAnswers(res.data))
          that.form.setFieldsValue(that.xzcc)
        })
        .catch(error => {
          this.confirmLoading = false
        })
    },
    getBirthdayByIdNO (IdNO){
      let birthday = "";
      if (IdNO.length==18) {
        birthday = IdNO.substr(6,8);
        return birthday.replace(/(.{4})(.{2})/,"$1-$2-");
      }else if(IdNO.length==15){
        birthday = "19"+IdNO.substr(6,6);
        return birthday.replace(/(.{4})(.{2})/,"$1-$2-");
      }else{
        return "";
      }
    },
    disabledDate(current) {
      let date = this.getBirthdayByIdNO(this.patient.card)
      return current && current > moment().endOf('day') || moment(date).endOf('day') > current;
    },
    handlePreview() {
      const viewer = this.$el.querySelector('.images').$viewer
      viewer.show()
    },
    handleChange({ fileList }) {
      var that = this
      this.fileList = fileList;
      if (fileList.every(function(v) { return v.status === 'done'})) {
        this.spinning = false
        this.fileList.forEach((f,i) => {
          if(f.response){
              that.$set(that.fileList,i,{
                name: f.response.fileName,
                status: 'done',
                uid: f.uid,
                url: f.response.data.src
              })
          }
        })
      }
    },
    withdraw() {
      var that = this
      this.$confirm({
        title: '确认撤销？',
        onOk() {
          that.spinning = true
          var params = new URLSearchParams()
          params.append('patientBasisMarkId', that.xzcc.patientBasisMarkId)
          recoverSubmit(params)
            .then(res => {
              that.spinning = false
              // that.$message.success(res.msg)
              Modal.success({
                title: '提示',
                content: res.msg
              });
              params = new URLSearchParams()
              params.append('patientBasisId', that.patientBasisId)
              getPatientBasis(params)
                .then(res => {

                  that.orgTree = res.data.list
                  that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
                })
                .catch(error => {
                  console.log(error)
                })
            }).catch(error => {
              that.spinning = false
              console.log(error)
            })
        }
      })
    },
    changeOcr() {
      this.showOcr = true
    },
    _importData() {
      var that = this
      this.$confirm({
        title: '是否确定导入数据？',
        onOk() {
          that.spinning = true
          var params = new URLSearchParams()
          params.append('basisMarkId', that.maskId)
          params.append('patientBasisId', that.patientBasisId)
          exportFormData(params)
            .then(res => {
              that.spinning = false
              // that.$message.success(res.msg)
              Modal.success({
                title: '提示',
                content: res.msg
              });
              that.xzcc = _.extend(that.xzcc || {}, that.dealAnswers(res.data.data.xzcc))
            }).catch(error => {
              that.spinning = false
              console.log(error)
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#baselineInfo {
  height: calc(100% - 10px);
}

/deep/ .card-box {
  margin-top: 10px;
  padding-left: 0;
  height: calc(100% - 54px);
}

/deep/ .ant-spin {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, .2);
  z-index: 2;

  & .ant-spin-dot {
    position: absolute;
    top: 55%;
    left: 50%;
  }
}

/deep/ #baselineHeader {
  .ant-card-body {
    padding: 10px
  }
}

.ant-row.ant-form-item:hover {
  background-color: #e6f7ff;
}

.ml-10 {
  margin-left: 10px;
}

.UserNameCard {
  font-size: 20px;

  .anticon {
    font-size: 26px;
    vertical-align: text-bottom;
    position: relative;
    left: -5px;
  }
}

.clear {
  clear: both;
}

.ant-calendar-picker {
  width: 240px;
}

.ant-checkbox-wrapper+.ant-checkbox-wrapper {
  margin-left: 0;
}

/deep/.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #1890FF;
  color: #FFF;

  .anticon.anticon-clock-circle,
  .anticon.anticon-check-circle {
    color: #FFF;
  }
}

/deep/ .anticon.anticon-clock-circle,
/deep/ .anticon.anticon-check-circle {
  font-size: 18px;
}

/deep/ .ant-menu-item:hover,
.ant-menu-item-active,
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active,
.ant-menu-submenu-title:hover {
  background-color: #e6f7ff;
}

/deep/.ant-menu-vertical .ant-menu-item:after,
.ant-menu-vertical-left .ant-menu-item:after,
.ant-menu-vertical-right .ant-menu-item:after,
.ant-menu-inline .ant-menu-item:after {
  border-right: 6px solid #1890ff;
}

/deep/ .ant-row {
  clear: both;
  height: 100%;
}

.page-header-index-wide {
  /deep/ .ant-card-wider-padding .ant-card-body {
    padding: 0;
    height: 100%;
  }

  /deep/ .tree-title {
    color: #25aefe;
    font-size: 20px;
    padding-left: 70px;
    padding-top: 18px;
    padding-bottom: 10px;
    background-image: url(../../../../assets/treeTop.png);
    background-repeat: no-repeat;
    border-bottom: 1px solid #eee;
    background-position: 8px 10px;
  }

  /deep/ .ant-menu-inline>.ant-menu-submenu>.ant-menu-submenu-title,
  .ant-menu .ant-menu-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eeeeee;
    margin: 0;
  }

  /deep/ .ant-menu-submenu-title {
    height: 50px;
    line-height: 50px;
  }

  /deep/ .anticon.anticon-clock-circle {
    color: #00A0E9;
  }

  /deep/ .anticon.anticon-clock-circle {
    color: #8ac51b;
  }

  /deep/ li.ant-menu-submenu.ant-menu-submenu-inline {
    background-color: rgba(245, 251, 255);

    .ant-menu.ant-menu-inline.ant-menu-sub {
      background-color: rgba(245, 251, 255);
      padding-left: 20px;

      .treeSubTitle {
        font-size: 14px;
      }

      li {
        border-bottom: none;
        height: 40px;
        line-height: 40px;
      }
    }
  }

  /deep/ li.ant-menu-submenu.ant-menu-submenu-inline {
    .ant-menu.ant-menu-inline.ant-menu-sub {
      li {
        border-bottom: none;
        height: 40px;
        line-height: 40px;
      }
    }
  }

  /deep/ .ant-menu-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eeeeee;
    margin: 0;

    .placeholderI {
      display: inline-block;
      width: 27px;
    }

    .anticon.anticon-check-circle {
      font-size: 18px;
      color: #8ac51b;
    }

    .anticon.anticon-clock-circle {
      font-size: 18px;
      color: #06a0e2;
    }

    .treeSubTitle {
      font-size: 16px;
      margin-left: 10px;
      display: inline-block;
      width: 140px;
    }

    .treeSubPercentage {
      font-size: 16px;
      margin-left: 10px;
    }
  }

  /deep/ .ant-menu-submenu {
    .anticon-check-circle {
      color: #8ac51b;
    }

    .anticon-clock-circle {
      color: #06a0e2;
    }

    &.ant-menu-submenu-inline {
      .treeSubTitle {
        font-size: 16px;
        margin-left: 10px;
        display: inline-block;
        width: 140px;
      }

      .treeSubPercentage {
        font-size: 16px;
        margin-left: 10px;
      }

      .action {
        font-size: 18px;

        &.anticon-check-circle {
          color: #8ac51b;
        }

        &.anticon-clock-circle {
          color: #06a0e2;
        }
      }

      .placeholderI {
        display: inline-block;
        width: 27px;
      }
    }
  }

  .fr {
    float: right;
  }

  .btn {
    margin-right: 10px;
  }

  .btn-array {
    overflow: hidden;
    position: absolute;
    padding-top: 10px;
    padding-right: 20px;
    width: calc(100% - 8px);
    // height: 42px;
    background: #fff;
    z-index: 1;
    padding-bottom: 10px;
    bottom: 0;
  }

  .baselineForm {
    margin-top: 42px;
    overflow: auto;

    .title {
      background-color: #f7f8f8;
      font-weight: bold;
      font-size: 16px;
      color: #231815;
      padding-left: 15px;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      height: 40px;
      line-height: 40px;
    }

    padding: 20px 20px 80px;

    .ant-form-item {
      // padding-bottom: 10px;
      // padding-top: 10px;
      margin-bottom: 0px;
      border-bottom: 1px solid #eee;

      &.no-border {
        border-bottom: none;
        padding-top: 0;
        padding-bottom: 0;
      }

      &:hover {}

      &.border-dotted {
        border-bottom: 1px dotted #eee;
      }
    }

    /deep/ .ant-form-item-label {
      text-align: left;
      line-height: 56px;
      white-space: inherit;

      label:after {
        content: '';
      }

      &.ant-col-md-24 label {
        display: block;
        background-color: #f7f8f8;
        font-weight: bold;
        font-size: 16px;
        color: #231815;
        padding-left: 15px;
        border-top: 1px solid #eee;
      }
    }

    /deep/ .ant-form-item-control-wrapper .ant-form-item-control {
      line-height: 56px;
    }

    .formSubtitle {
      height: 50px;
      line-height: 50px;
      font-weight: bold;
      font-size: 16px;
      padding-left: 10px;
      margin-bottom: 0px;
      background: #fafcfd;
      border-bottom: 1px solid #f3f3f3;
    }

    .itemRow:hover {
      background-color: #e6f7ff;
    }
  }
}

.question-title {
  text-align: center;
  font-size: 22px;
  color: #3398DC;
}

.question-des {
  font-size: 16px;
  // border: 1px solid #91D5FF ;
  // border-radius: 3px;
  // background: lightblue;
  padding: 0 10px;
}

.question-t {
  font-size: 18px;
  line-height: 40px;
  font-weight: 700;
}

/deep/.page-header-index-wide[data-v-30448598] .ant-menu-submenu.ant-menu-submenu-inline .treeSubTitle {
  width: 120px;
}

/deep/.ant-menu-inline .ant-menu-submenu-title {
  padding-right: 0px;
}

.base-form {
  height: 100%;
  -ms-overflow-x: hidden;
  overflow: hidden auto;
}
</style>