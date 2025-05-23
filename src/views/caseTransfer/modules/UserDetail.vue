<template>
  <a-modal
    title="患者详情"
    :width="800"
    :bodyStyle="bodyStyle"
    :maskClosable="maskClosable"
    :centered="centered"
    :destroyOnClose="destroyOnClose"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <user-detail :patient="patient"></user-detail>
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="详细信息" key="1">
          <div class="userCard">
            <a-row id="userInfo">
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>患者同意注册日期：</span>
                  {{ patient.registerDate | formDate }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>文化程度：</span>
                  {{ patient.censusName }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>访视状态：</span>
                  {{ patient.visit | visitStatus }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>医疗费用支付情况：</span>
                  {{ patient.payTypeName }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>职业：</span>
                  {{ patient.workName }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>家庭年收入：</span>
                  {{ patient.income }}万
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>创建机构：</span>
                  {{ patient.centerName }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>创建时间：</span>
                  {{ patient.createDate | formDate }}
                </p>
              </a-col>
              <a-col :sm="8">
                <p class="userInfoItem">
                  <span>创建人：</span>
                  {{ patient.creatorName }}
                </p>
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="待访视任务" key="2" forceRender>
          <div class="userCard" v-if="visitTasks.length>0">
            <div class="followupItem" v-for="item in visitTasks">
              <my-icon class="my-icon-huaban" type="iconshijian_huaban" />
              <p>
                <span>计划时间：</span>
                {{item.planDate}}
              </p>
              <p>
                <span>随访摘要：</span>
                 {{item.taskName}}
              </p>
                <router-link :to="{path:'/list/task/' + item.visitTaskId}"> 
              <a-button type="primary" size="small" style="float:right;">
                <my-icon type="iconxiangqing_huaban" />
                执行
              </a-button>
               </router-link>
            </div>
          </div>
          <div v-else class="userCard">
               <div style="text-align: center;">
                   <img src="@/assets/noData.png" alt="">
                   <p>暂无数据</p>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="访视情况" key="3">
          <div class="userCard" v-if="patientBasisList.length>0">
            <a-timeline>
              <a-timeline-item v-for="item in patientBasisList">
                <span class="followupDate">{{item.createDate|formDate}}</span>
                <div class="followupInfoItem">
                  <div class="followupInfoItemType">
                    <p>
                      访视类型:
                      <span>{{item.type|patientBasisType}}</span>
                    </p>
                    <p>访视时间: {{item.wirteDate|formDate}}</p>
                  </div>
                  <div class="followupInfoItemPro">
                    <span>访视进度:</span>
                    <p>
                      <a-progress  :percent="item.progress" status="active" />
                    </p>
                  </div>
                   <router-link :to="{path:'/list/basis/' + item.patientBasisId}"> 
                  <a-button type="primary" size="small"     style="float:right;margin-top:5px ;">
                    <my-icon type="iconxiangqing_huaban" />
                    详情
                  </a-button>
                  </router-link>
                </div>
              </a-timeline-item>
            </a-timeline>
          </div>
          <div v-else class="userCard">
            <div style="text-align: center;">
                   <img src="@/assets/noData.png" alt="">
                   <p>暂无数据</p>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
import { getPatientDetail } from '@/api/patient';
import UserDetail from './UserDetailTop';
import { MyIcon } from '@/components/_util/util';
import moment from 'moment';
import _ from 'lodash';
export default {
  components: {
    UserDetail,
    MyIcon
  },
  data() {
    return {
      patientBasisList: [],
      visitTasks: [],
      patient: {},
      visible: false,
      confirmLoading: false,
      centered: true,
      maskClosable: false,
      destroyOnClose: true,
      bodyStyle: {
        height: '500px',
        overflow: 'auto',
        background:"#F8FBFC"
      }
    };
  },
  filters: {
    formDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    visitStatus(value) {
      const visitMap = {
        '1': '忽略',
        '2': '未执行',
        '3': '执行中',
        '4': '已完成'
      };
      return visitMap[value];
    },
    patientBasisType(type){
      const patientBasisTypeMap=['','支扩基线','半年随访','年访视','急性加重期随访', '', 'ICON常规随访', '急性加重期随访', 'ICON基线']
      return patientBasisTypeMap[type];
    }
  },
  methods: {
    show(value) {
      this.visible = true;
      this.confirmLoading = true;
      const Params = new URLSearchParams();
      Params.append('patientId', value.patientId);
      getPatientDetail(Params).then(res => {
          this.patient = res.data.patient;
          this.patientBasisList = res.data.patientBasisList;
          this.visitTasks = res.data.visitTasks;
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ant-modal-body {
  background-color: #fdfdfd;
}
.userCard {
  background: #ffffff;
  padding: 20px;
  border: 1px solid #f1f1f1;
  padding-right:0px; 
  overflow: auto;
  #userInfo {
    p.userInfoItem {
      color: #000000;
      span {
        color: #888888;
      }
    }
  }
  .followupItem {
    border-bottom: 1px dashed #f3f3f3;
    padding-bottom: 10px;
    margin-bottom: 15px;
    padding-right: 20px;
    .my-icon-huaban {
      color: #26adfa;
      font-size: 30px;
      margin-right: 10px;
      vertical-align: middle;
    }
    p {
      display: inline-block;
      margin: 0px;
      margin-right: 40px;
      color: #000000;
      span {
        color: #888888;
      }
    }
  }
  span.followupDate{
      display: inline-block;
    border: 1px solid #dddddd;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 15px;
    vertical-align: top;
    position: relative;
    top: -3px;
  }
  div.followupInfoItem{
   display: inline-block;
    width: 590px;
    background: #F1F8FE;
    margin-left: 20px;
    position: relative;
    top: -11px;
    padding: 5px 20px;
     div.followupInfoItemType{
       display: inline-block;
       width: 200px;
       font-size: 12px;
       p:first-child{
             color: #000;
            margin-bottom: 5px;
            font-size: 14px;
            span{
              color: #F0C070;
            }
       }
       p:nth-child(2){
             margin: 0;
       }
     }
     div.followupInfoItemPro{
       display: inline-block;
       width: 200px;
       vertical-align: top;
       span{
         font-size: 14px;
         color: #000;
       }
       p{
         width: 100px;
         display: inline-block;
         margin: 0;
         margin-left: 10px;
         /deep/ .ant-progress-inner{
           background-color:#C4C4C4;
         }
       }
     }
  }

}

::-webkit-scrollbar-track-piece { //滚动条凹槽的颜色，还可以设置边框属性
background-color:#f8f8f8;
}
::-webkit-scrollbar {//滚动条的宽度
width:5px;
height:9px;
}
::-webkit-scrollbar-thumb {//滚动条的设置
background-color:#dddddd;
background-clip:padding-box;
min-height:28px;
}
::-webkit-scrollbar-thumb:hover {
background-color:#bbb;
}
</style>
