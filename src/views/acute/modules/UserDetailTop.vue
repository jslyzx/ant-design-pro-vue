<template>
  <div class="userDetail" :option="option">
    <div class="userDetailTop">
      <img src="../../../assets/woman.png" alt="" v-if="option.sex == 0" />
      <img src="../../../assets/man.png" alt="" v-else />
      <div class="userDetailInfo">
        <h4>
          {{ option.name }}
          <span class="userDetailCard">{{ option.card }}</span>
        </h4>
        <p>
          <span class="userDetailAge" :class="option.sex == 0 ? 'womenBg' : ''">
            <a-icon :type="option.sex == 1 ? 'man':'woman'" />
            {{getAge}}岁
          </span>
          <span class="userDetailNation">{{option.nationName}}</span>
        </p>
      </div>
    </div>
    <div class="userDetailContent">
      <p class="userDetailItem">
        <span class="userDetailItemTitle">患者编号</span>
        <span class="userDetailItemInfo"> {{option.code}}</span>
      </p>
      <p class="userDetailItem">
        <span class="userDetailItemTitle">联系电话</span>
        <span class="userDetailItemInfo">{{option.telephone1}}</span>
      </p>
      <p class="userDetailItem">
        <span class="userDetailItemTitle">出生日期</span>
        <span class="userDetailItemInfo">{{birthDay}}</span>
      </p>
      <p class="userDetailItem">
        <span class="userDetailItemTitle">居住地</span>
        <span class="userDetailItemInfo">{{option.address}}</span>
      </p>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {};
  },
  props: {
    option: {
      type: Object,
      default: {}
    }
  },
  mounted() {},
  methods: {
  },
  computed:{
    birthDay() {
      if (_.isEmpty(this.option)) {
        return ''
      }
      let card = this.option.card;
      let birthDay = ''
      if (card.length == 15) {
        birthDay = card.substr(6,6).replace(/(.{4})(.{2})/,"$1-$2-")
      } else if (card.length == 18) {
        birthDay = card.substr(6,8).replace(/(.{4})(.{2})/,"$1-$2-")
      }
      return birthDay
    },
    getAge() {
      if(_.isEmpty(this.option)){
        return ''
      }
      var identityCard=this.option.card;
      var len = (identityCard + '').length;
      if (len == 0) {
        return 0;
      } else {
        if (len != 15 && len != 18) {
          //身份证号码只能为15位或18位其它不合法
          return 0;
        }
      }
      var strBirthday = '';
      if (len == 18) {
        //处理18位的身份证号码从号码中得到生日和性别代码
        strBirthday = identityCard.substr(6, 4) + '/' + identityCard.substr(10, 2) + '/' + identityCard.substr(12, 2);
      }
      if (len == 15) {
        strBirthday = '19' + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2);
      }
      //时间字符串里，必须是“/”
      var birthDate = new Date(strBirthday);
      var nowDateTime = new Date();
      var age = nowDateTime.getFullYear() - birthDate.getFullYear();
      //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
      if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
  }
};
</script>
<style lang="less" scoped>
.userDetail {
  border: 1px solid #f8f8f8;
  border-top: 4px solid #168ffd;
  padding: 15px 25px;
  background-color: #ffffff;
  .userDetailTop {
    img {
      display: inline-block;
      vertical-align: top;
      width: 60px;
      height: 60px;
    }
    .userDetailInfo {
      display: inline-block;
      padding-top: 5px;
      padding-left: 15px;
      h4 {
        font-size: 18px;
        margin-bottom: 0px;
        span {
          font-weight: normal;
          font-size: 17px;
          margin-left: 10px;
          display: inline-block;
        }
      }
      p {
        .womenBg {
          background-color: #fd94dc!important;
        }
        .userDetailAge {
          display: inline-block;
          background-color: #96dcfd;
          color: #ffffff;
          padding: 0px 10px;
          border-radius: 3px;
          .anticon {
            margin-right: 5px;
          }
        }
        .userDetailNation {
          display: inline-block;
          background-color: #e8e8e8;
          padding: 0px 10px;
          border-radius: 3px;
          margin-left: 10px;
        }
      }
    }
  }
  .userDetailContent {
    margin-top: 20px;
    overflow: hidden;
    .userDetailItem {
      display: inline-block;
      width: 20%;
      color: #000000;
      vertical-align: top;
      .userDetailItemTitle {
        display: block;
        color: #a9a9a9;
      }
    }
  }
}
</style>
