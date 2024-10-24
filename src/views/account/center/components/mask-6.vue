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
              <!-- <a-button class="btn fr" v-if="patientBasis.type === 3" @click="import">导入</a-button> -->
              <a-button class="btn fr" type="primary" html-type="submit" ref="submitBtn">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="btn-array" v-if="executeStatus === 2 && canEdit">
              <a-button class="btn fr" type="primary" @click="withdraw">撤回</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <p class="tip">必填项如数据缺失无法提交，请一律用"/"来填写!（ICON患者，必须填写实际检测值。基线访视辅助检查可使用入组前6个月内的检查结果，但要求从检查日期到入组日期之间未发生急性加重，否则需要在基线数据收集时重新辅助检查）</p>
              <a-form-item label="采样性质（多选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['a', {...selectRequired, initialValue: initValue('a', 'array')}]">
                  <a-checkbox value="1" @change="changeSelect($event, 'control1')" :disabled="detect('a', '4') || control4">细菌</a-checkbox>
                  <a-checkbox value="2" @change="changeSelect($event, 'control2')" :disabled="detect('a', '4') || control4">真菌</a-checkbox>
                  <a-checkbox value="3" @change="changeSelect($event, 'control3')" :disabled="detect('a', '4') || control4">分枝杆菌</a-checkbox>
                  <a-checkbox value="5" @change="changeSelect($event, 'control5')" :disabled="detect('a', '4') || control4">其他</a-checkbox>
                  <a-checkbox value="4" @change="handleNone($event, 'a', '4', [], 'control4')">无</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <div v-if="control1">
                <div class="title">1.细菌</div>
                <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['a1', {...dateRequire, initialValue: initValue('a1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="(2) 是否本院:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['a2', {...require1, initialValue: initValue('a2')}]" @change="changeRadio($event, 'controla2')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="医院名称" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controla2">
                  <a-input style="width: 240px;" v-decorator="['a21', {...inputRequired, initialValue: initValue('a21')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(3) 标本类型:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-checkbox-group v-decorator="['a3', {...selectRequired, initialValue: initValue('a3', 'array')}]">
                    <a-checkbox value="1" @change="changeSelect($event, 'controla31')">痰液</a-checkbox>
                    <a-checkbox value="2" @change="changeSelect($event, 'controla32')">诱导痰</a-checkbox>
                    <a-checkbox value="3" @change="changeSelect($event, 'controla33')">支气管肺泡灌洗液</a-checkbox>
                    <a-checkbox value="4" @change="changeSelect($event, 'controla34')">血标本</a-checkbox>
                    <a-checkbox value="5" @change="changeSelect($event, 'controla35')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <div v-if="controla31">
                  <div class="sub-t">痰液</div>
                  <a-form-item label="痰液培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['a31', {...selectRequired, initialValue: initValue('a31')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="痰液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['a311', {...selectRequired, initialValue: initValue('a311')}]" @change="changeRadio($event, 'controla3113')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他痰液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controla3113">
                    <a-input style="width: 240px;" v-decorator="['a3111', {...inputRequired, initialValue: initValue('a3111')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="痰液是否分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-radio-group v-decorator="['a4', {...require1, initialValue: initValue('a4')}]" @change="changeRadio($event, 'controla4')">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controla4">
                    <a-form-item label="分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                      <a-checkbox-group v-decorator="['a42', {...selectRequired, initialValue: initValue('a42', 'array')}]" class="control-m-line">
                        <a-checkbox value="0" @change="showList($event, '铜绿假单胞菌', 'controla420', '1')">铜绿假单胞菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[0]" v-if="controla420" :type1="type1" @listen="changeType1" :isFirst="true" :picSource="picList1[0]" @changePic1="changePic1($event, 0)"></add-table>
                        <a-checkbox value="2" @change="showList($event, '肺炎克雷伯菌', 'controla422', '1')">肺炎克雷伯菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[2]" v-if="controla422" :isFirst="true" :picSource="picList1[2]" @changePic1="changePic1($event, 2)"></add-table>
                        <a-checkbox value="10" @change="showList($event, '大肠杆菌', 'controla4210', '1')">大肠杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[10]" v-if="controla4210" :isFirst="true" :picSource="picList1[10]" @changePic1="changePic1($event, 10)"></add-table>
                        <a-checkbox value="3" @change="showList($event, '阴沟肠杆菌', 'controla423', '1')">阴沟肠杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[3]" v-if="controla423" :isFirst="true" :picSource="picList1[3]" @changePic1="changePic1($event, 3)"></add-table>
                        <a-checkbox value="1" @change="showList($event, '肺炎链球菌', 'controla421', '1')">肺炎链球菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[1]" v-if="controla421" :isFirst="true" :picSource="picList1[1]" @changePic1="changePic1($event, 1)"></add-table>
                        <a-checkbox value="6" @change="showList($event, '金黄色葡萄球菌', 'controla426', '1')">金黄色葡萄球菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[6]" v-if="controla426" :isFirst="true" :picSource="picList1[6]" @changePic1="changePic1($event, 6)"></add-table>
                        <a-checkbox value="8" @change="showList($event, '流感嗜血杆菌', 'controla428', '1')">流感嗜血杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[8]" v-if="controla428" :isFirst="true" :picSource="picList1[8]" @changePic1="changePic1($event, 8)"></add-table>
                        <a-checkbox value="4" @change="showList($event, '副流感嗜血杆菌', 'controla424', '1')">副流感嗜血杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[4]" v-if="controla424" :isFirst="true" :picSource="picList1[4]" @changePic1="changePic1($event, 4)"></add-table>
                        <a-checkbox value="9" @change="showList($event, '卡他莫拉菌', 'controla429', '1')">卡他莫拉菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[9]" v-if="controla429" :isFirst="true" :picSource="picList1[9]" @changePic1="changePic1($event, 9)"></add-table>
                        <a-checkbox value="5" @change="showList($event, '鲍曼不动杆菌', 'controla425', '1')">鲍曼不动杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[5]" v-if="controla425" :isFirst="true" :picSource="picList1[5]" @changePic1="changePic1($event, 5)"></add-table>
                        <a-checkbox value="11" @change="showList($event, '洋葱霍尔德菌', 'controla4211', '1')">洋葱霍尔德菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[11]" v-if="controla4211" :isFirst="true" :picSource="picList1[11]" @changePic1="changePic1($event, 11)"></add-table>
                        <a-checkbox value="12" @change="showList($event, '嗜麦芽窄食单胞菌', 'controla4212', '1')">嗜麦芽窄食单胞菌</a-checkbox>
                        <add-table :dataSource="optionDataSource1[12]" v-if="controla4212" :isFirst="true" :picSource="picList1[12]" @changePic1="changePic1($event, 12)"></add-table>
                        <a-checkbox value="7" @change="showList($event, '其他', 'controla427', '1')">其他</a-checkbox>
                        <a-input style="width: 240px;margin-right: 10px;" v-if="controla427" @change="otherChange($event, 7, '1')" autocomplete="off" v-decorator="['otherName1', {...inputRequired, initialValue: otherName1}]"></a-input>
                        <add-table :dataSource="optionDataSource1[7]" v-if="controla427" :isFirst="true" :picSource="picList1[7]" @changePic1="changePic1($event, 7)"></add-table>
                      </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="铜绿假单胞菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla420">
                      <a-radio-group v-decorator="['a421', {...require1, initialValue: initValue('a421')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="肺炎克雷伯菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla422">
                      <a-radio-group v-decorator="['a422', {...require1, initialValue: initValue('a422')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="大肠杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4210">
                      <a-radio-group v-decorator="['a423', {...require1, initialValue: initValue('a423')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="阴沟肠杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla423">
                      <a-radio-group v-decorator="['a424', {...require1, initialValue: initValue('a424')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="肺炎链球菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla421">
                      <a-radio-group v-decorator="['a425', {...require1, initialValue: initValue('a425')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="金黄色葡萄球菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla426">
                      <a-radio-group v-decorator="['a426', {...require1, initialValue: initValue('a426')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="流感嗜血杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla428">
                      <a-radio-group v-decorator="['a427', {...require1, initialValue: initValue('a427')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="副流感嗜血杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla424">
                      <a-radio-group v-decorator="['a428', {...require1, initialValue: initValue('a428')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="卡他莫拉菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla429">
                      <a-radio-group v-decorator="['a429', {...require1, initialValue: initValue('a429')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="鲍曼不动杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla425">
                      <a-radio-group v-decorator="['a4210', {...require1, initialValue: initValue('a4210')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="洋葱霍尔德菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4211">
                      <a-radio-group v-decorator="['a4211', {...require1, initialValue: initValue('a4211')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="嗜麦芽窄食单胞菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4212">
                      <a-radio-group v-decorator="['a4212', {...require1, initialValue: initValue('a4212')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="其他检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla427">
                      <a-radio-group v-decorator="['a4213', {...require1, initialValue: initValue('a4213')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                  </div>
                </div>
                <div v-if="controla32">
                  <div class="sub-t">诱导痰</div>
                  <a-form-item label="诱导痰培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border" >
                    <a-radio-group v-decorator="['a32', {...selectRequired, initialValue: initValue('a32')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="诱导痰检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['a321', {...selectRequired, initialValue: initValue('a321')}]" @change="changeRadio($event, 'controla3213')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他诱导痰检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controla3213">
                    <a-input style="width: 240px;" v-decorator="['a3211', {...inputRequired, initialValue: initValue('a3211')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="诱导痰是否分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-radio-group v-decorator="['a45', {...require1, initialValue: initValue('a45')}]" @change="changeRadio($event, 'controla45')">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controla45">
                    <a-form-item label="分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                      <a-checkbox-group v-decorator="['a452', {...selectRequired, initialValue: initValue('a452', 'array')}]" class="control-m-line">
                        <a-checkbox value="0" @change="showList($event, '铜绿假单胞菌', 'controla4520', '2')">铜绿假单胞菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[0]" v-if="controla4520" :type1="type2" @listen="changeType2" :isFirst="true" :picSource="picList1[0]" @changePic1="changePic1($event, 0)"></add-table>
                        <a-checkbox value="2" @change="showList($event, '肺炎克雷伯菌', 'controla4522', '2')">肺炎克雷伯菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[2]" v-if="controla4522" :isFirst="true" :picSource="picList1[2]" @changePic1="changePic1($event, 2)"></add-table>
                        <a-checkbox value="10" @change="showList($event, '大肠杆菌', 'controla45210', '2')">大肠杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[10]" v-if="controla45210" :isFirst="true" :picSource="picList1[10]" @changePic1="changePic1($event, 10)"></add-table>
                        <a-checkbox value="3" @change="showList($event, '阴沟肠杆菌', 'controla4523', '2')">阴沟肠杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[3]" v-if="controla4523" :isFirst="true" :picSource="picList1[3]" @changePic1="changePic1($event, 3)"></add-table>
                        <a-checkbox value="1" @change="showList($event, '肺炎链球菌', 'controla4521', '2')">肺炎链球菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[1]" v-if="controla4521" :isFirst="true" :picSource="picList1[1]" @changePic1="changePic1($event, 1)"></add-table>
                        <a-checkbox value="6" @change="showList($event, '金黄色葡萄球菌', 'controla4526', '2')">金黄色葡萄球菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[6]" v-if="controla4526" :isFirst="true" :picSource="picList1[6]" @changePic1="changePic1($event, 6)"></add-table>
                        <a-checkbox value="8" @change="showList($event, '流感嗜血杆菌', 'controla4528', '2')">流感嗜血杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[8]" v-if="controla4528" :isFirst="true" :picSource="picList1[8]" @changePic1="changePic1($event, 8)"></add-table>
                        <a-checkbox value="4" @change="showList($event, '副流感嗜血杆菌', 'controla4524', '2')">副流感嗜血杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[4]" v-if="controla4524" :isFirst="true" :picSource="picList1[4]" @changePic1="changePic1($event, 4)"></add-table>
                        <a-checkbox value="9" @change="showList($event, '卡他莫拉菌', 'controla4529', '2')">卡他莫拉菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[9]" v-if="controla4529" :isFirst="true" :picSource="picList1[9]" @changePic1="changePic1($event, 9)"></add-table>
                        <a-checkbox value="5" @change="showList($event, '鲍曼不动杆菌', 'controla4525', '2')">鲍曼不动杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[5]" v-if="controla4525" :isFirst="true" :picSource="picList1[5]" @changePic1="changePic1($event, 5)"></add-table>
                        <a-checkbox value="11" @change="showList($event, '洋葱霍尔德菌', 'controla45211', '2')">洋葱霍尔德菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[11]" v-if="controla45211" :isFirst="true" :picSource="picList1[11]" @changePic1="changePic1($event, 11)"></add-table>
                        <a-checkbox value="12" @change="showList($event, '嗜麦芽窄食单胞菌', 'controla45212', '2')">嗜麦芽窄食单胞菌</a-checkbox>
                        <add-table :dataSource="optionDataSource2[12]" v-if="controla45212" :isFirst="true" :picSource="picList1[12]" @changePic1="changePic1($event, 12)"></add-table>
                        <a-checkbox value="7" @change="showList($event, '其他', 'controla4527', '2')">其他</a-checkbox>
                        <a-input style="width: 240px;margin-right: 10px;" v-if="controla4527" @change="otherChange($event, 7, '2')" autocomplete="off" v-decorator="['otherName2', {...inputRequired, initialValue: initValue('otherName2')}]"></a-input>
                        <add-table :dataSource="optionDataSource2[7]" v-if="controla4527" :isFirst="true" :picSource="picList1[7]" @changePic1="changePic1($event, 7)"></add-table>
                      </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="铜绿假单胞菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4520">
                      <a-radio-group v-decorator="['a4521', {...require1, initialValue: initValue('a4521')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="肺炎克雷伯菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4522">
                      <a-radio-group v-decorator="['a4522', {...require1, initialValue: initValue('a4522')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="大肠杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla45210">
                      <a-radio-group v-decorator="['a4523', {...require1, initialValue: initValue('a4523')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="阴沟肠杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4523">
                      <a-radio-group v-decorator="['a5424', {...require1, initialValue: initValue('a4524')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="肺炎链球菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4521">
                      <a-radio-group v-decorator="['a4525', {...require1, initialValue: initValue('a4525')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="金黄色葡萄球菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4526">
                      <a-radio-group v-decorator="['a4526', {...require1, initialValue: initValue('a4526')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="流感嗜血杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4528">
                      <a-radio-group v-decorator="['a4527', {...require1, initialValue: initValue('a4527')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="副流感嗜血杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4524">
                      <a-radio-group v-decorator="['a4528', {...require1, initialValue: initValue('a4528')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="卡他莫拉菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4529">
                      <a-radio-group v-decorator="['a4529', {...require1, initialValue: initValue('a4529')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="鲍曼不动杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4525">
                      <a-radio-group v-decorator="['a45210', {...require1, initialValue: initValue('a45210')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="洋葱霍尔德菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla45211">
                      <a-radio-group v-decorator="['a45211', {...require1, initialValue: initValue('a45211')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="嗜麦芽窄食单胞菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla45212">
                      <a-radio-group v-decorator="['a45212', {...require1, initialValue: initValue('a45212')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="其他检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4527">
                      <a-radio-group v-decorator="['a45213', {...require1, initialValue: initValue('a45213')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                  </div>
                </div>
                <div v-if="controla33">
                  <div class="sub-t">支气管肺泡灌洗液</div>
                  <a-form-item label="支气管肺泡灌洗液培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['a33', {...selectRequired, initialValue: initValue('a33')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="支气管肺泡灌洗液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['a331', {...selectRequired, initialValue: initValue('a331')}]" @change="changeRadio($event, 'controla3313')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他支气管肺泡灌洗液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controla3313">
                    <a-input style="width: 240px;" v-decorator="['a3311', {...inputRequired, initialValue: initValue('a3311')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="支气管肺泡灌洗液分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-radio-group v-decorator="['a46', {...require1, initialValue: initValue('a46')}]" @change="changeRadio($event, 'controla46')">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controla46">
                    <a-form-item label="分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                      <a-checkbox-group v-decorator="['a462', {...selectRequired, initialValue: initValue('a462', 'array')}]" class="control-m-line">
                        <a-checkbox value="0" @change="showList($event, '铜绿假单胞菌', 'controla4620', '3')">铜绿假单胞菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[0]" v-if="controla4620" :type1="type3" @listen="changeType3" :isFirst="true" :picSource="picList1[0]" @changePic1="changePic1($event, 0)"></add-table>
                        <a-checkbox value="2" @change="showList($event, '肺炎克雷伯菌', 'controla4622', '3')">肺炎克雷伯菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[2]" v-if="controla4622" :isFirst="true" :picSource="picList1[2]" @changePic1="changePic1($event, 2)"></add-table>
                        <a-checkbox value="10" @change="showList($event, '大肠杆菌', 'controla46210', '3')">大肠杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[10]" v-if="controla46210" :isFirst="true" :picSource="picList1[10]" @changePic1="changePic1($event, 10)"></add-table>
                        <a-checkbox value="3" @change="showList($event, '阴沟肠杆菌', 'controla4623', '3')">阴沟肠杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[3]" v-if="controla4623" :isFirst="true" :picSource="picList1[3]" @changePic1="changePic1($event, 3)"></add-table>
                        <a-checkbox value="1" @change="showList($event, '肺炎链球菌', 'controla4621', '3')">肺炎链球菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[1]" v-if="controla4621" :isFirst="true" :picSource="picList1[1]" @changePic1="changePic1($event, 1)"></add-table>
                        <a-checkbox value="6" @change="showList($event, '金黄色葡萄球菌', 'controla4626', '3')">金黄色葡萄球菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[6]" v-if="controla4626" :isFirst="true" :picSource="picList1[6]" @changePic1="changePic1($event, 6)"></add-table>
                        <a-checkbox value="8" @change="showList($event, '流感嗜血杆菌', 'controla4628', '3')">流感嗜血杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[8]" v-if="controla4628" :isFirst="true" :picSource="picList1[8]" @changePic1="changePic1($event, 8)"></add-table>
                        <a-checkbox value="4" @change="showList($event, '副流感嗜血杆菌', 'controla4624', '3')">副流感嗜血杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[4]" v-if="controla4624" :isFirst="true" :picSource="picList1[4]" @changePic1="changePic1($event, 4)"></add-table>
                        <a-checkbox value="9" @change="showList($event, '卡他莫拉菌', 'controla4629', '3')">卡他莫拉菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[9]" v-if="controla4629" :isFirst="true" :picSource="picList1[9]" @changePic1="changePic1($event, 9)"></add-table>
                        <a-checkbox value="5" @change="showList($event, '鲍曼不动杆菌', 'controla4625', '3')">鲍曼不动杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[5]" v-if="controla4625" :isFirst="true" :picSource="picList1[5]" @changePic1="changePic1($event, 5)"></add-table>
                        <a-checkbox value="11" @change="showList($event, '洋葱霍尔德菌', 'controla46211', '3')">洋葱霍尔德菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[11]" v-if="controla46211" :isFirst="true" :picSource="picList1[11]" @changePic1="changePic1($event, 11)"></add-table>
                        <a-checkbox value="12" @change="showList($event, '嗜麦芽窄食单胞菌', 'controla46212', '3')">嗜麦芽窄食单胞菌</a-checkbox>
                        <add-table :dataSource="optionDataSource3[12]" v-if="controla46212" :isFirst="true" :picSource="picList1[12]" @changePic1="changePic1($event, 12)"></add-table>
                        <a-checkbox value="7" @change="showList($event, '其他', 'controla4627', '3')">其他</a-checkbox>
                        <a-input style="width: 240px;margin-right: 10px;" v-if="controla4627" @change="otherChange($event, 7, '3')" autocomplete="off" v-decorator="['otherName3', {...inputRequired, initialValue: initValue('otherName3')}]"></a-input>
                        <add-table :dataSource="optionDataSource3[7]" v-if="controla4627" :isFirst="true" :picSource="picList1[7]" @changePic1="changePic1($event, 7)"></add-table>
                      </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="铜绿假单胞菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4620">
                      <a-radio-group v-decorator="['a4621', {...require1, initialValue: initValue('a4621')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="肺炎克雷伯菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4622">
                      <a-radio-group v-decorator="['a4622', {...require1, initialValue: initValue('a4622')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="大肠杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla46210">
                      <a-radio-group v-decorator="['a4623', {...require1, initialValue: initValue('a4623')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="阴沟肠杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4623">
                      <a-radio-group v-decorator="['a4624', {...require1, initialValue: initValue('a4624')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="肺炎链球菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4621">
                      <a-radio-group v-decorator="['a4625', {...require1, initialValue: initValue('a4625')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="金黄色葡萄球菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4626">
                      <a-radio-group v-decorator="['a4626', {...require1, initialValue: initValue('a4626')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="流感嗜血杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4628">
                      <a-radio-group v-decorator="['a4627', {...require1, initialValue: initValue('a4627')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="副流感嗜血杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4624">
                      <a-radio-group v-decorator="['a4628', {...require1, initialValue: initValue('a4628')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="卡他莫拉菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4629">
                      <a-radio-group v-decorator="['a4629', {...require1, initialValue: initValue('a4629')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="鲍曼不动杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4625">
                      <a-radio-group v-decorator="['a46210', {...require1, initialValue: initValue('a46210')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="洋葱霍尔德菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla46211">
                      <a-radio-group v-decorator="['a46211', {...require1, initialValue: initValue('a46211')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="嗜麦芽窄食单胞菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla46212">
                      <a-radio-group v-decorator="['a46212', {...require1, initialValue: initValue('a46212')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="其他检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4627">
                      <a-radio-group v-decorator="['a46213', {...require1, initialValue: initValue('a46213')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                  </div>
                </div>
                <div v-if="controla34">
                  <div class="sub-t">血标本</div>
                  <a-form-item label="血标本培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['a34', {...selectRequired, initialValue: initValue('a34')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="血标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['a341', {...selectRequired, initialValue: initValue('a341')}]" @change="changeRadio($event, 'controla3413')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他血标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controla3413">
                    <a-input style="width: 240px;" v-decorator="['a3411', {...inputRequired, initialValue: initValue('a3411')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="血标本是否分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-radio-group v-decorator="['a47', {...require1, initialValue: initValue('a47')}]" @change="changeRadio($event, 'controla47')">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controla47">
                    <a-form-item label="分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                      <a-checkbox-group v-decorator="['a472', {...selectRequired, initialValue: initValue('a472', 'array')}]" class="control-m-line">
                        <a-checkbox value="0" @change="showList($event, '铜绿假单胞菌', 'controla4720', true)">铜绿假单胞菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[0]" v-if="controla4720" :type1="type4" @listen="changeType4" :isFirst="true" :picSource="picList1[0]" @changePic1="changePic1($event, 0)"></add-table>
                        <a-checkbox value="2" @change="showList($event, '肺炎克雷伯菌', 'controla4722', '4')">肺炎克雷伯菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[2]" v-if="controla4722" :isFirst="true" :picSource="picList1[2]" @changePic1="changePic1($event, 2)"></add-table>
                        <a-checkbox value="10" @change="showList($event, '大肠杆菌', 'controla47210', '4')">大肠杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[10]" v-if="controla47210" :isFirst="true" :picSource="picList1[10]" @changePic1="changePic1($event, 10)"></add-table>
                        <a-checkbox value="3" @change="showList($event, '阴沟肠杆菌', 'controla4723', '4')">阴沟肠杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[3]" v-if="controla4723" :isFirst="true" :picSource="picList1[3]" @changePic1="changePic1($event, 3)"></add-table>
                        <a-checkbox value="1" @change="showList($event, '肺炎链球菌', 'controla4721', '4')">肺炎链球菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[1]" v-if="controla4721" :isFirst="true" :picSource="picList1[1]" @changePic1="changePic1($event, 1)"></add-table>
                        <a-checkbox value="6" @change="showList($event, '金黄色葡萄球菌', 'controla4726', '4')">金黄色葡萄球菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[6]" v-if="controla4726" :isFirst="true" :picSource="picList1[6]" @changePic1="changePic1($event, 6)"></add-table>
                        <a-checkbox value="8" @change="showList($event, '流感嗜血杆菌', 'controla4728', '4')">流感嗜血杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[8]" v-if="controla4728" :isFirst="true" :picSource="picList1[8]" @changePic1="changePic1($event, 8)"></add-table>
                        <a-checkbox value="4" @change="showList($event, '副流感嗜血杆菌', 'controla4724', '4')">副流感嗜血杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[4]" v-if="controla4724" :isFirst="true" :picSource="picList1[4]" @changePic1="changePic1($event, 4)"></add-table>
                        <a-checkbox value="9" @change="showList($event, '卡他莫拉菌', 'controla4729', '4')">卡他莫拉菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[9]" v-if="controla4729" :isFirst="true" :picSource="picList1[9]" @changePic1="changePic1($event, 9)"></add-table>
                        <a-checkbox value="5" @change="showList($event, '鲍曼不动杆菌', 'controla4725', '4')">鲍曼不动杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[5]" v-if="controla4725" :isFirst="true" :picSource="picList1[5]" @changePic1="changePic1($event, 5)"></add-table>
                        <a-checkbox value="11" @change="showList($event, '洋葱霍尔德菌', 'controla47211', '4')">洋葱霍尔德菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[11]" v-if="controla47211" :isFirst="true" :picSource="picList1[11]" @changePic1="changePic1($event, 11)"></add-table>
                        <a-checkbox value="12" @change="showList($event, '嗜麦芽窄食单胞菌', 'controla47212', '4')">嗜麦芽窄食单胞菌</a-checkbox>
                        <add-table :dataSource="optionDataSource4[12]" v-if="controla47212" :isFirst="true" :picSource="picList1[12]" @changePic1="changePic1($event, 12)"></add-table>
                        <a-checkbox value="7" @change="showList($event, '其他', 'controla4727', '4')">其他</a-checkbox>
                        <a-input style="width: 240px;margin-right: 10px;" v-if="controla4727" @change="otherChange($event, 7, '4')" autocomplete="off" v-decorator="['otherName4', {...inputRequired, initialValue: initValue('otherName4')}]"></a-input>
                        <add-table :dataSource="optionDataSource4[7]" v-if="controla4727" :isFirst="true" :picSource="picList1[7]" @changePic1="changePic1($event, 7)"></add-table>
                      </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="铜绿假单胞菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4720">
                      <a-radio-group v-decorator="['a4721', {...require1, initialValue: initValue('a4721')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="肺炎克雷伯菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4722">
                      <a-radio-group v-decorator="['a4722', {...require1, initialValue: initValue('a4722')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="大肠杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla47210">
                      <a-radio-group v-decorator="['a4723', {...require1, initialValue: initValue('a4723')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="阴沟肠杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4723">
                      <a-radio-group v-decorator="['a4724', {...require1, initialValue: initValue('a4724')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="肺炎链球菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4721">
                      <a-radio-group v-decorator="['a4725', {...require1, initialValue: initValue('a4725')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="金黄色葡萄球菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4726">
                      <a-radio-group v-decorator="['a4726', {...require1, initialValue: initValue('a4726')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="流感嗜血杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4728">
                      <a-radio-group v-decorator="['a4727', {...require1, initialValue: initValue('a4727')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="副流感嗜血杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4724">
                      <a-radio-group v-decorator="['a4728', {...require1, initialValue: initValue('a4728')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="卡他莫拉菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4729">
                      <a-radio-group v-decorator="['a4729', {...require1, initialValue: initValue('a4729')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="鲍曼不动杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4725">
                      <a-radio-group v-decorator="['a47210', {...require1, initialValue: initValue('a47210')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="洋葱霍尔德菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla47211">
                      <a-radio-group v-decorator="['a47211', {...require1, initialValue: initValue('a47211')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="嗜麦芽窄食单胞菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla47212">
                      <a-radio-group v-decorator="['a47212', {...require1, initialValue: initValue('a47212')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="其他检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4727">
                      <a-radio-group v-decorator="['a47213', {...require1, initialValue: initValue('a47213')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                  </div>
                </div>
                <div v-if="controla35">
                  <div class="sub-t">其他标本</div>
                  <a-form-item label="其他标本名称:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-input style="width: 240px;" v-decorator="['aa31', {...inputRequired, initialValue: initValue('aa31')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="其他标本培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['a35', {...selectRequired, initialValue: initValue('a35')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['a351', {...selectRequired, initialValue: initValue('a351')}]" @change="changeRadio($event, 'controla3513')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controla3513">
                    <a-input style="width: 240px;" v-decorator="['a3511', {...inputRequired, initialValue: initValue('a3511')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="其他标本是否分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-radio-group v-decorator="['a48', {...require1, initialValue: initValue('a48')}]" @change="changeRadio($event, 'controla48')">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controla48">
                    <a-form-item label="分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                      <a-checkbox-group v-decorator="['a482', {...selectRequired, initialValue: initValue('a482', 'array')}]" class="control-m-line">
                        <a-checkbox value="0" @change="showList($event, '铜绿假单胞菌', 'controla4820', '5')">铜绿假单胞菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[0]" v-if="controla4820" :type1="type5" @listen="changeType5" :isFirst="true" :picSource="picList1[0]" @changePic1="changePic1($event, 0)"></add-table>
                        <a-checkbox value="2" @change="showList($event, '肺炎克雷伯菌', 'controla4822', '5')">肺炎克雷伯菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[2]" v-if="controla4822" :isFirst="true" :picSource="picList1[2]" @changePic1="changePic1($event, 2)"></add-table>
                        <a-checkbox value="10" @change="showList($event, '大肠杆菌', 'controla48210', '5')">大肠杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[10]" v-if="controla48210" :isFirst="true" :picSource="picList1[10]" @changePic1="changePic1($event, 10)"></add-table>
                        <a-checkbox value="3" @change="showList($event, '阴沟肠杆菌', 'controla4823', '5')">阴沟肠杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[3]" v-if="controla4823" :isFirst="true" :picSource="picList1[3]" @changePic1="changePic1($event, 3)"></add-table>
                        <a-checkbox value="1" @change="showList($event, '肺炎链球菌', 'controla4821', '5')">肺炎链球菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[1]" v-if="controla4821" :isFirst="true" :picSource="picList1[1]" @changePic1="changePic1($event, 1)"></add-table>
                        <a-checkbox value="6" @change="showList($event, '金黄色葡萄球菌', 'controla4826', '5')">金黄色葡萄球菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[6]" v-if="controla4826" :isFirst="true" :picSource="picList1[6]" @changePic1="changePic1($event, 6)"></add-table>
                        <a-checkbox value="8" @change="showList($event, '流感嗜血杆菌', 'controla4828', '5')">流感嗜血杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[8]" v-if="controla4828" :isFirst="true" :picSource="picList1[8]" @changePic1="changePic1($event, 8)"></add-table>
                        <a-checkbox value="4" @change="showList($event, '副流感嗜血杆菌', 'controla4824', '5')">副流感嗜血杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[4]" v-if="controla4824" :isFirst="true" :picSource="picList1[4]" @changePic1="changePic1($event, 4)"></add-table>
                        <a-checkbox value="9" @change="showList($event, '卡他莫拉菌', 'controla4829', '5')">卡他莫拉菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[9]" v-if="controla4829" :isFirst="true" :picSource="picList1[9]" @changePic1="changePic1($event, 9)"></add-table>
                        <a-checkbox value="5" @change="showList($event, '鲍曼不动杆菌', 'controla4825', '5')">鲍曼不动杆菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[5]" v-if="controla4825" :isFirst="true" :picSource="picList1[5]" @changePic1="changePic1($event, 5)"></add-table>
                        <a-checkbox value="11" @change="showList($event, '洋葱霍尔德菌', 'controla48211', '5')">洋葱霍尔德菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[11]" v-if="controla48211" :isFirst="true" :picSource="picList1[11]" @changePic1="changePic1($event, 11)"></add-table>
                        <a-checkbox value="12" @change="showList($event, '嗜麦芽窄食单胞菌', 'controla48212', '5')">嗜麦芽窄食单胞菌</a-checkbox>
                        <add-table :dataSource="optionDataSource5[12]" v-if="controla48212" :isFirst="true" :picSource="picList1[12]" @changePic1="changePic1($event, 12)"></add-table>
                        <a-checkbox value="7" @change="showList($event, '其他', 'controla4827', '5')">其他</a-checkbox>
                        <a-input style="width: 240px;margin-right: 10px;" v-if="controla4827" @change="otherChange($event, 7, '5')" autocomplete="off" v-decorator="['otherName5', {...inputRequired, initialValue: initValue('otherName5')}]"></a-input>
                        <add-table :dataSource="optionDataSource5[7]" v-if="controla4827" :isFirst="true" :picSource="picList1[7]" @changePic1="changePic1($event, 7)"></add-table>
                      </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="铜绿假单胞菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4820">
                      <a-radio-group v-decorator="['a4821', {...require1, initialValue: initValue('a4821')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="肺炎克雷伯菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4822">
                      <a-radio-group v-decorator="['a4822', {...require1, initialValue: initValue('a4822')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="大肠杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla48210">
                      <a-radio-group v-decorator="['a4823', {...require1, initialValue: initValue('a4823')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="阴沟肠杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4823">
                      <a-radio-group v-decorator="['a4824', {...require1, initialValue: initValue('a4824')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="肺炎链球菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4821">
                      <a-radio-group v-decorator="['a4825', {...require1, initialValue: initValue('a4825')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="金黄色葡萄球菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4826">
                      <a-radio-group v-decorator="['a4826', {...require1, initialValue: initValue('a4826')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="流感嗜血杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4828">
                      <a-radio-group v-decorator="['a4827', {...require1, initialValue: initValue('a4827')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="副流感嗜血杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4824">
                      <a-radio-group v-decorator="['a4828', {...require1, initialValue: initValue('a4828')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="卡他莫拉菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4829">
                      <a-radio-group v-decorator="['a4829', {...require1, initialValue: initValue('a4829')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="鲍曼不动杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4825">
                      <a-radio-group v-decorator="['a48210', {...require1, initialValue: initValue('a48210')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="洋葱霍尔德菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla48211">
                      <a-radio-group v-decorator="['a48211', {...require1, initialValue: initValue('a48211')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="嗜麦芽窄食单胞菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla48212">
                      <a-radio-group v-decorator="['a48212', {...require1, initialValue: initValue('a48212')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="其他检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controla4827">
                      <a-radio-group v-decorator="['a48213', {...require1, initialValue: initValue('a48213')}]">
                        <a-radio value="1">MIC</a-radio>
                        <a-radio value="2">纸片法</a-radio>
                      </a-radio-group>
                    </a-form-item>
                  </div>
                </div>
              </div>
              <div v-if="control2">
                <div class="title">2.真菌</div>
                <a-form-item label="取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b1', {...dateRequire, initialValue: initValue('b1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="是否本院:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['b2', {...require1, initialValue: initValue('b2')}]" @change="changeRadio($event, 'controlb2')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="医院名称" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb2">
                  <a-input style="width: 240px;" v-decorator="['b21', {...inputRequired, initialValue: initValue('b21')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="标本类型:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['b3', {...selectRequired, initialValue: initValue('b3', 'array')}]">
                    <a-checkbox value="1" @change="changeSelect($event, 'controlb31')">痰液</a-checkbox>
                    <a-checkbox value="2" @change="changeSelect($event, 'controlb32')">诱导痰</a-checkbox>
                    <a-checkbox value="3" @change="changeSelect($event, 'controlb33')">支气管肺泡灌洗液</a-checkbox>
                    <a-checkbox value="4" @change="changeSelect($event, 'controlb34')">血标本</a-checkbox>
                    <a-checkbox value="5" @change="changeSelect($event, 'controlb35')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <div v-if="controlb31">
                  <div class="sub-t">痰液</div>
                  <a-form-item label="痰液培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['b31', {...selectRequired, initialValue: initValue('b31')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="痰液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['b311', {...selectRequired, initialValue: initValue('b311')}]" @change="changeRadio($event, 'controlb3113')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他痰液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controlb3113">
                    <a-input style="width: 240px;" v-decorator="['b3111', {...inputRequired, initialValue: initValue('b3111')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="痰液是否分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-radio-group v-decorator="['b4', {...require1, initialValue: initValue('b4')}]" @change="changeRadio($event, 'controlb4')">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="真菌:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlb4">
                    <a-checkbox-group v-decorator="['b42', {...selectRequired, initialValue: initValue('b42', 'array')}]">
                      <a-checkbox value="0">白色念珠菌</a-checkbox>
                      <a-checkbox value="1">曲霉</a-checkbox>
                      <a-checkbox value="2" @change="changeSelect($event, 'controlb422')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item class="border-dotted" label="其他真菌" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlb422">
                    <a-input style="width: 240px;" v-decorator="['b43', {...inputRequired, initialValue: initValue('b43')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <div v-if="controlb32">
                  <div class="sub-t">诱导痰</div>
                  <a-form-item label="诱导痰培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="border-dotted">
                    <a-radio-group v-decorator="['b32', {...selectRequired, initialValue: initValue('b32')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="诱导痰检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="border-dotted">
                    <a-radio-group v-decorator="['b321', {...selectRequired, initialValue: initValue('b321')}]" @change="changeRadio($event, 'controlb3213')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他诱导痰检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controlb3213">
                    <a-input style="width: 240px;" v-decorator="['b3211', {...inputRequired, initialValue: initValue('b3211')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="诱导痰是否分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-radio-group v-decorator="['b5', {...require1, initialValue: initValue('b5')}]" @change="changeRadio($event, 'controlb5')">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="真菌:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlb5">
                    <a-checkbox-group v-decorator="['b52', {...selectRequired, initialValue: initValue('b52', 'array')}]">
                      <a-checkbox value="0">白色念珠菌</a-checkbox>
                      <a-checkbox value="1">曲霉</a-checkbox>
                      <a-checkbox value="2" @change="changeSelect($event, 'controlb522')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item class="border-dotted" label="其他真菌" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlb522">
                    <a-input style="width: 240px;" v-decorator="['b53', {...inputRequired, initialValue: initValue('b53')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <div v-if="controlb33">
                  <div class="sub-t">支气管肺泡灌洗液</div>
                  <a-form-item label="支气管肺泡灌洗液培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['b33', {...selectRequired, initialValue: initValue('b33')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="支气管肺泡灌洗液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['b331', {...selectRequired, initialValue: initValue('b331')}]" @change="changeRadio($event, 'controlb3313')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他支气管肺泡灌洗液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controlb3313">
                    <a-input style="width: 240px;" v-decorator="['b3311', {...inputRequired, initialValue: initValue('b3311')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="支气管肺泡灌洗液分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-radio-group v-decorator="['b6', {...require1, initialValue: initValue('b6')}]" @change="changeRadio($event, 'controlb6')">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="真菌:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlb6">
                    <a-checkbox-group v-decorator="['b62', {...selectRequired, initialValue: initValue('b62', 'array')}]">
                      <a-checkbox value="0">白色念珠菌</a-checkbox>
                      <a-checkbox value="1">曲霉</a-checkbox>
                      <a-checkbox value="2" @change="changeSelect($event, 'controlb622')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item class="border-dotted" label="其他真菌" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlb622">
                    <a-input style="width: 240px;" v-decorator="['b63', {...inputRequired, initialValue: initValue('b63')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <div v-if="controlb34">
                  <div class="sub-t">血标本</div>
                  <a-form-item label="血标本培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border" v-if="controlb34">
                    <a-radio-group v-decorator="['b34', {...selectRequired, initialValue: initValue('b34')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="血标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border" v-if="controlb34">
                    <a-radio-group v-decorator="['b341', {...selectRequired, initialValue: initValue('b341')}]" @change="changeRadio($event, 'controlb3413')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他血标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controlb3413">
                    <a-input style="width: 240px;" v-decorator="['b3411', {...inputRequired, initialValue: initValue('b3411')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="血标本是否分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-radio-group v-decorator="['b7', {...require1, initialValue: initValue('b7')}]" @change="changeRadio($event, 'controlb7')">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="真菌:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlb7">
                    <a-checkbox-group v-decorator="['b72', {...selectRequired, initialValue: initValue('b72', 'array')}]">
                      <a-checkbox value="0">白色念珠菌</a-checkbox>
                      <a-checkbox value="1">曲霉</a-checkbox>
                      <a-checkbox value="2" @change="changeSelect($event, 'controlb722')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item class="border-dotted" label="其他真菌" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlb722">
                    <a-input style="width: 240px;" v-decorator="['b73', {...inputRequired, initialValue: initValue('b73')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <div v-if="controlb35">
                  <div class="sub-t">其他标本</div>
                  <a-form-item label="其他标本名称:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-input style="width: 240px;" v-decorator="['bb31', {...inputRequired, initialValue: initValue('bb31')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="其他标本培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['b35', {...selectRequired, initialValue: initValue('b35')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['b351', {...selectRequired, initialValue: initValue('b351')}]" @change="changeRadio($event, 'controlb3513')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controlb3513">
                    <a-input style="width: 240px;" v-decorator="['b3511', {...inputRequired, initialValue: initValue('b3511')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
              </div>
              <div v-if="control3">
                <div class="title">3.分枝杆菌</div>
                <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['c1', {...dateRequire, initialValue: initValue('c1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="(2) 是否本院:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['c2', {...require1, initialValue: initValue('c2')}]" @change="changeRadio($event, 'controlc2')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="医院名称" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlc2">
                  <a-input style="width: 240px;" v-decorator="['c21', {...inputRequired, initialValue: initValue('c21')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(3) 标本类型:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['c3', {...selectRequired, initialValue: initValue('c3', 'array')}]">
                    <a-checkbox value="1" @change="changeSelect($event, 'controlc31')">痰液</a-checkbox>
                    <a-checkbox value="2" @change="changeSelect($event, 'controlc32')">诱导痰</a-checkbox>
                    <a-checkbox value="3" @change="changeSelect($event, 'controlc33')">支气管肺泡灌洗液</a-checkbox>
                    <a-checkbox value="4" @change="changeSelect($event, 'controlc34')">血标本</a-checkbox>
                    <a-checkbox value="5" @change="changeSelect($event, 'controlc35')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <div v-if="controlc31">
                  <div class="sub-t">痰液</div>
                  <a-form-item label="痰液培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['c31', {...selectRequired, initialValue: initValue('c31')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="痰液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['c311', {...selectRequired, initialValue: initValue('c311')}]" @change="changeRadio($event, 'controlc3113')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他痰液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controlc3113">
                    <a-input style="width: 240px;" v-decorator="['c3111', {...inputRequired, initialValue: initValue('c3111')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="痰液分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-checkbox-group v-decorator="['c4', {...selectRequired, initialValue: initValue('c4', 'array')}]">
                      <a-checkbox value="0" :disabled="detect('c4', '2') || initC4">结核分枝杆菌</a-checkbox>
                      <a-checkbox value="1" :disabled="detect('c4', '2') || initC4" @change="changeSelect($event, 'controlc41')">非结核分枝杆菌</a-checkbox>
                      <a-checkbox value="2" @change="handleNone($event, 'c4', '2', ['controlc41'])">阴性</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="非结核分枝杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controlc41">
                    <a-radio-group v-decorator="['c422', {...require1, initialValue: initValue('c422')}]">
                      <a-radio value="1">MIC</a-radio>
                      <a-radio value="2">纸片法</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controlc41">
                    <a-form-item label="非结核分枝杆菌:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2">
                      <a-checkbox-group v-decorator="['c41', {...selectRequired, initialValue: initValue('c41', 'array')}]">
                        <a-checkbox value="1">堪萨斯分枝杆菌</a-checkbox>
                        <a-checkbox value="2">龟分枝杆菌</a-checkbox>
                        <a-checkbox value="3">脓肿分枝杆菌</a-checkbox>
                        <a-checkbox value="4">鸟分枝杆菌复合群(MAC)</a-checkbox>
                        <a-checkbox value="5" @change="changeSelect($event, 'controlc415')">其他</a-checkbox>
                      </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="其他非结核分枝杆菌名称:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlc415">
                      <a-input style="width: 240px;margin-right: 10px;" autocomplete="off" v-decorator="['c43', {...inputRequired, initialValue: initValue('c43')}]"></a-input>
                    </a-form-item>
                  </div>
                </div>
                <div v-if="controlc32">
                  <div class="sub-t">诱导痰</div>
                  <a-form-item label="诱导痰培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="border-dotted">
                    <a-radio-group v-decorator="['c32', {...selectRequired, initialValue: initValue('c32')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="诱导痰检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="border-dotted">
                    <a-radio-group v-decorator="['c321', {...selectRequired, initialValue: initValue('c321')}]" @change="changeRadio($event, 'controlc3213')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他诱导痰检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controlc3213">
                    <a-input style="width: 240px;" v-decorator="['c3211', {...inputRequired, initialValue: initValue('c3211')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="诱导痰分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-checkbox-group v-decorator="['c52', {...selectRequired, initialValue: initValue('c52', 'array')}]">
                      <a-checkbox value="0" :disabled="detect('c52', '2') || initC4">结核分枝杆菌</a-checkbox>
                      <a-checkbox value="1" :disabled="detect('c52', '2') || initC4" @change="changeSelect($event, 'controlc521')">非结核分枝杆菌</a-checkbox>
                      <a-checkbox value="2" @change="handleNone($event, 'c52', '2', ['controlc521'])">阴性</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="非结核分枝杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controlc521">
                    <a-radio-group v-decorator="['c522', {...require1, initialValue: initValue('c522')}]">
                      <a-radio value="1">MIC</a-radio>
                      <a-radio value="2">纸片法</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controlc521">
                    <a-form-item label="非结核分枝杆菌:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2">
                      <a-checkbox-group v-decorator="['c51', {...selectRequired, initialValue: initValue('c51', 'array')}]">
                        <a-checkbox value="1">堪萨斯分枝杆菌</a-checkbox>
                        <a-checkbox value="2">龟分枝杆菌</a-checkbox>
                        <a-checkbox value="3">脓肿分枝杆菌</a-checkbox>
                        <a-checkbox value="4">鸟分枝杆菌复合群(MAC)</a-checkbox>
                        <a-checkbox value="5" @change="changeSelect($event, 'controlc515')">其他</a-checkbox>
                      </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="其他非结核分枝杆菌名称:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlc515">
                      <a-input style="width: 240px;margin-right: 10px;" autocomplete="off" v-decorator="['c53', {...inputRequired, initialValue: initValue('c53')}]"></a-input>
                    </a-form-item>
                  </div>
                </div>
                <div v-if="controlc33">
                  <div class="sub-t">支气管肺泡灌洗液</div>
                  <a-form-item label="支气管肺泡灌洗液培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['c33', {...selectRequired, initialValue: initValue('c33')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="支气管肺泡灌洗液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['c331', {...selectRequired, initialValue: initValue('c331')}]" @change="changeRadio($event, 'controlc3313')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他支气管肺泡灌洗液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controlc3313">
                    <a-input style="width: 240px;" v-decorator="['c3311', {...inputRequired, initialValue: initValue('c3311')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="支气管肺泡灌洗液分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-checkbox-group v-decorator="['c6', {...selectRequired, initialValue: initValue('c6', 'array')}]">
                      <a-checkbox value="0" :disabled="detect('c6', '2') || initC4">结核分枝杆菌</a-checkbox>
                      <a-checkbox value="1" :disabled="detect('c6', '2') || initC4" @change="changeSelect($event, 'controlc61')">非结核分枝杆菌</a-checkbox>
                      <a-checkbox value="2" @change="handleNone($event, 'c6', '2', ['controlc61'])">阴性</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="非结核分枝杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controlc61">
                    <a-radio-group v-decorator="['c622', {...require1, initialValue: initValue('c622')}]">
                      <a-radio value="1">MIC</a-radio>
                      <a-radio value="2">纸片法</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controlc61">
                    <a-form-item label="非结核分枝杆菌:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2">
                      <a-checkbox-group v-decorator="['c61', {...selectRequired, initialValue: initValue('c61', 'array')}]">
                        <a-checkbox value="1">堪萨斯分枝杆菌</a-checkbox>
                        <a-checkbox value="2">龟分枝杆菌</a-checkbox>
                        <a-checkbox value="3">脓肿分枝杆菌</a-checkbox>
                        <a-checkbox value="4">鸟分枝杆菌复合群(MAC)</a-checkbox>
                        <a-checkbox value="5" @change="changeSelect($event, 'controlc615')">其他</a-checkbox>
                      </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="其他非结核分枝杆菌名称:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlc615">
                      <a-input style="width: 240px;margin-right: 10px;" autocomplete="off" v-decorator="['c63', {...inputRequired, initialValue: initValue('c63')}]"></a-input>
                    </a-form-item>
                  </div>
                </div>
                <div v-if="controlc34">
                  <div class="sub-t">血标本</div>
                  <a-form-item label="血标本培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border" v-if="controlb34">
                    <a-radio-group v-decorator="['c34', {...selectRequired, initialValue: initValue('c34')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="血标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border" v-if="controlc34">
                    <a-radio-group v-decorator="['c341', {...selectRequired, initialValue: initValue('c341')}]" @change="changeRadio($event, 'controlc3413')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他血标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controlc3413">
                    <a-input style="width: 240px;" v-decorator="['c3411', {...inputRequired, initialValue: initValue('c3411')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="血标本分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-checkbox-group v-decorator="['c7', {...selectRequired, initialValue: initValue('c7', 'array')}]">
                      <a-checkbox value="0" :disabled="detect('c7', '2') || initC4">结核分枝杆菌</a-checkbox>
                      <a-checkbox value="1" :disabled="detect('c7', '2') || initC4" @change="changeSelect($event, 'controlc71')">非结核分枝杆菌</a-checkbox>
                      <a-checkbox value="2" @change="handleNone($event, 'c7', '2', ['controlc71'])">阴性</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="非结核分枝杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controlc71">
                    <a-radio-group v-decorator="['c722', {...require1, initialValue: initValue('c722')}]">
                      <a-radio value="1">MIC</a-radio>
                      <a-radio value="2">纸片法</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controlc71">
                    <a-form-item label="非结核分枝杆菌:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2">
                      <a-checkbox-group v-decorator="['c71', {...selectRequired, initialValue: initValue('c71', 'array')}]">
                        <a-checkbox value="1">堪萨斯分枝杆菌</a-checkbox>
                        <a-checkbox value="2">龟分枝杆菌</a-checkbox>
                        <a-checkbox value="3">脓肿分枝杆菌</a-checkbox>
                        <a-checkbox value="4">鸟分枝杆菌复合群(MAC)</a-checkbox>
                        <a-checkbox value="5" @change="changeSelect($event, 'controlc715')">其他</a-checkbox>
                      </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="其他非结核分枝杆菌名称:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlc715">
                      <a-input style="width: 240px;margin-right: 10px;" autocomplete="off" v-decorator="['c73', {...inputRequired, initialValue: initValue('c73')}]"></a-input>
                    </a-form-item>
                  </div>
                </div>
                <div v-if="controlc35">
                  <div class="sub-t">其他标本</div>
                  <a-form-item label="其他标本名称:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-input style="width: 240px;" v-decorator="['cc31', {...inputRequired, initialValue: initValue('cc31')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="其他标本培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['c35', {...selectRequired, initialValue: initValue('c35')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['c351', {...selectRequired, initialValue: initValue('c351')}]" @change="changeRadio($event, 'controlc3513')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controlc3513">
                    <a-input style="width: 240px;" v-decorator="['c3511', {...inputRequired, initialValue: initValue('c3511')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="其他标本分离到微生物:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3">
                    <a-checkbox-group v-decorator="['c8', {...selectRequired, initialValue: initValue('c8', 'array')}]">
                      <a-checkbox value="0" :disabled="detect('c8', '2') || initC4">结核分枝杆菌</a-checkbox>
                      <a-checkbox value="1" :disabled="detect('c8', '2') || initC4" @change="changeSelect($event, 'controlc81')">非结核分枝杆菌</a-checkbox>
                      <a-checkbox value="2" @change="handleNone($event, 'c8', '2', ['controlc81'])">阴性</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="非结核分枝杆菌检测方式:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" class="border-dotted" v-if="controlc81">
                    <a-radio-group v-decorator="['c822', {...require1, initialValue: initValue('c822')}]">
                      <a-radio value="1">MIC</a-radio>
                      <a-radio value="2">纸片法</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="controlc81">
                    <a-form-item label="非结核分枝杆菌:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2">
                      <a-checkbox-group v-decorator="['c81', {...selectRequired, initialValue: initValue('c81', 'array')}]">
                        <a-checkbox value="1">堪萨斯分枝杆菌</a-checkbox>
                        <a-checkbox value="2">龟分枝杆菌</a-checkbox>
                        <a-checkbox value="3">脓肿分枝杆菌</a-checkbox>
                        <a-checkbox value="4">鸟分枝杆菌复合群(MAC)</a-checkbox>
                        <a-checkbox value="5" @change="changeSelect($event, 'controlc815')">其他</a-checkbox>
                      </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="其他非结核分枝杆菌名称:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controlc815">
                      <a-input style="width: 240px;margin-right: 10px;" autocomplete="off" v-decorator="['c83', {...inputRequired, initialValue: initValue('c83')}]"></a-input>
                    </a-form-item>
                  </div>
                </div>
              </div>
              <div v-if="control5">
                <div class="title">4.其他病原</div>
                <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['d1', {...dateRequire, initialValue: initValue('d1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="(2) 其他病原种类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['d2', {...inputRequired, initialValue: initValue('d2')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(3) 标本类型:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['d3', {...selectRequired, initialValue: initValue('d3', 'array')}]">
                    <a-checkbox value="1" @change="changeSelect($event, 'controld31')">痰液</a-checkbox>
                    <a-checkbox value="2" @change="changeSelect($event, 'controld32')">诱导痰</a-checkbox>
                    <a-checkbox value="3" @change="changeSelect($event, 'controld33')">支气管肺泡灌洗液</a-checkbox>
                    <a-checkbox value="4" @change="changeSelect($event, 'controld34')">血标本</a-checkbox>
                    <a-checkbox value="5" @change="changeSelect($event, 'controld35')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <div v-if="controld31">
                  <div class="sub-t">痰液</div>
                  <a-form-item label="痰液培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['d31', {...selectRequired, initialValue: initValue('d31')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="痰液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['d311', {...selectRequired, initialValue: initValue('d311')}]" @change="changeRadio($event, 'controld3113')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他痰液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controld3113">
                    <a-input style="width: 240px;" v-decorator="['d3111', {...inputRequired, initialValue: initValue('d3111')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <div v-if="controld32">
                  <div class="sub-t">诱导痰</div>
                  <a-form-item label="诱导痰培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['d32', {...selectRequired, initialValue: initValue('d32')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="诱导痰检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['d321', {...selectRequired, initialValue: initValue('d321')}]" @change="changeRadio($event, 'controld3213')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他诱导痰检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controld3213">
                    <a-input style="width: 240px;" v-decorator="['d3211', {...inputRequired, initialValue: initValue('d3211')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <div v-if="controld33">
                  <div class="sub-t">支气管肺泡灌洗液</div>
                  <a-form-item label="支气管肺泡灌洗液培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['d33', {...selectRequired, initialValue: initValue('d33')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="支气管肺泡灌洗液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['d331', {...selectRequired, initialValue: initValue('d331')}]" @change="changeRadio($event, 'controld3313')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他支气管肺泡灌洗液检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controld3313">
                    <a-input style="width: 240px;" v-decorator="['d3311', {...inputRequired, initialValue: initValue('d3311')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <div v-if="controld34">
                  <div class="sub-t">血标本</div>
                  <a-form-item label="血标本培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['d34', {...selectRequired, initialValue: initValue('d34')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="血标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['d341', {...selectRequired, initialValue: initValue('d341')}]" @change="changeRadio($event, 'controld3413')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他血标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controld3413">
                    <a-input style="width: 240px;" v-decorator="['d3411', {...inputRequired, initialValue: initValue('d3411')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <div v-if="controld35">
                  <div class="sub-t">其他标本</div>
                  <a-form-item label="其他标本名称:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-input style="width: 240px;" v-decorator="['dd31', {...inputRequired, initialValue: initValue('dd31')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="其他标本培养结果:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['d35', {...selectRequired, initialValue: initValue('d35')}]">
                      <a-radio value="1">阳性</a-radio>
                      <a-radio value="0">阴性</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他标本检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" class="no-border">
                    <a-radio-group v-decorator="['d351', {...selectRequired, initialValue: initValue('d351')}]" @change="changeRadio($event, 'controld3513')">
                      <a-radio value="1">普通培养</a-radio>
                      <a-radio value="2">NGS</a-radio>
                      <a-radio value="3">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="其他检测方法:" :labelCol="labelColOffset3" :wrapperCol="wrapperOffset3" v-if="controld3513">
                    <a-input style="width: 240px;" v-decorator="['d3511', {...inputRequired, initialValue: initValue('d3511')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
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
import { getPatientBasis, saveBasis, getBasisForm, computeScore, getMedicineAllergyList, recoverSubmit, exportFormData } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
import AddTable from "../model/table"
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ContactForm from '@/views/account/ContactForm'
import _ from 'lodash'
import { Modal } from 'ant-design-vue'
export default {
  name: 'mask6',
  components: {
    STree,
    MyIcon,
    AddTable,
    ContactForm
  },
  data() {
    return {
      optionDataSource1: [],
      optionDataSource2: [],
      optionDataSource3: [],
      optionDataSource4: [],
      optionDataSource5: [],
      markName: 'bywsw',
      title: '基线',
      openKeys: [],
      defaultSelectedKeys: [6],
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
        sm: { span: 6 },
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
        sm: { span: 18 },
        md: { span: 17 }
      },
      wrapperVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      labelColOffset: {
        md: { span: 3, offset: 7 }
      },
      labelColOffset2: {
        md: { span: 4, offset: 7 }
      },
      wrapperOffset2: {
        md: { span: 13 }
      },
      wrapperOffset: {
        md: { span: 14 }
      },
      labelColOffset3: {
        md: { span: 4, offset: 2 }
      },
      wrapperOffset3: {
        md: { span: 18 }
      },
      dateRequire: {
        rules: [{ type: 'object', required: true, message: '请选择时间！' }]
      },
      require1: {
        rules: [{ required: true, message: '请选择是或否！' }]
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
      bywsw: undefined,
      controla2: false,
      controla4: false,
      controla6: false,
      controlb2: false,
      controlb4: false,
      controlc2: false,
      controlc41: false,
      controla420: false,
      controla421: false,
      controla422: false,
      controla423: false,
      controla424: false,
      controla425: false,
      controla426: false,
      controla427: false,
      controla428: false,
      controla429: false,
      controla4210: false,
      controla4211: false,
      controla4212: false,
      controlb422: false,
      controlc415: false,
      controla31: false,
      controla32: false,
      controla33: false,
      controla34: false,
      controla35: false,
      controlb31: false,
      controlb32: false,
      controlb33: false,
      controlb34: false,
      controlc31: false,
      controlc32: false,
      controlc33: false,
      controlc34: false,
      controld31: false,
      controld32: false,
      controld33: false,
      controld34: false,
      controld35: false,
      spinning: false,
      executeStatus: false,
      control1: false,
      control2: false,
      control3: false,
      control4: false,
      control5: false,
      type1: '',
      type2: '',
      type3: '',
      type4: '',
      type5: '',
      otherName1: '',
      otherName2: '',
      picList1: [],
      isGroup: this.$ls.get(ACCESS_TOKEN).roleId === 1 || false,
      canEdit: false,
      submitInfo: undefined,
      initC4: false,
      controla3113: false,
      controla3213: false,
      controla3313: false,
      controla3413: false,
      controlb3113: false,
      controlb3213: false,
      controlb3313: false,
      controlb3413: false,
      controlc3113: false,
      controlc3213: false,
      controlc3313: false,
      controlc3413: false,
      controla45: false,
      controla4520: false,
      controla4521: false,
      controla4522: false,
      controla4523: false,
      controla4524: false,
      controla4525: false,
      controla4526: false,
      controla4527: false,
      controla4528: false,
      controla4529: false,
      controla45210: false,
      controla45211: false,
      controla45212: false,
      controla45213: false,
      controla46: false,
      controla4620: false,
      controla4621: false,
      controla4622: false,
      controla4623: false,
      controla4624: false,
      controla4625: false,
      controla4626: false,
      controla4627: false,
      controla4628: false,
      controla4629: false,
      controla46210: false,
      controla46211: false,
      controla46212: false,
      controla46213: false,
      controla47: false,
      controla4720: false,
      controla4721: false,
      controla4722: false,
      controla4723: false,
      controla4724: false,
      controla4725: false,
      controla4726: false,
      controla4727: false,
      controla4728: false,
      controla4729: false,
      controla47210: false,
      controla47211: false,
      controla47212: false,
      controla47213: false,
      controla48: false,
      controla4820: false,
      controla4821: false,
      controla4822: false,
      controla4823: false,
      controla4824: false,
      controla4825: false,
      controla4826: false,
      controla4827: false,
      controla4828: false,
      controla4829: false,
      controla48210: false,
      controla48211: false,
      controla48212: false,
      controla48213: false,
      controla3513: false,
      controlb35: false,
      controlb5: false,
      controlb522: false,
      controlb6: false,
      controlb622: false,
      controlb7: false,
      controlb722: false,
      controlb3513: false,
      controlc35: false,
      controlc5: false,
      controlc522: false,
      controlc6: false,
      controlc622: false,
      controlc7: false,
      controlc722: false,
      controlc3513: false,
      controlc515: false,
      controlc61: false,
      controlc615: false,
      controlc71: false,
      controlc715: false,
      controlc81: false,
      controlc815: false,
      controlc3513: false,
      controld3113: false,
      controld3213: false,
      controld3313: false,
      controld3413: false,
      controld3513: false,
      controla48: false
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
    getFormData() {
      this.spinning = true
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', this.maskId)
      getBasisForm(params)
        .then(res => {
          this.spinning = false
          
          if (res.data && res.data.bywsw){
            Object.keys(res.data.bywsw).forEach(key => {
              if (res.data.bywsw[key] === 0) {
                res.data.bywsw[key] = "0";
              }
            });
            that.bywsw = that.dealAnswers(res.data)
          }
        })
        .catch(error => {
          this.spinning = false
          console.log(error)
        })
    },
    changeSelect(e, t) {
      var that = this
      this[t] = e.target.checked
      if (t === 'control4' && e.target.checked) {
        this.control1 = false
        this.control2 = false
        this.control3 = false
        this.control5 = false
        //赋值必须要延时
        setTimeout(function() {
          that.form.setFieldsValue({ a: ['4'] })
        }, 0)
      }
    },
    changeRadio(e, t) {
      if (t === 'controla2' || t === 'controlb2' || t === 'controlc2') {
        if (e.target.value === '-1') {
          this[t] = true
        } else {
          this[t] = false
        }
      } else if (t === 'controla4' && e.target.value === '-1') {
        this.controla4 = false
        // this.controla420 = false
        // this.controla421 = false
        // this.controla422 = false
        // this.controla423 = false
        // this.controla424 = false
        // this.controla425 = false
        // this.controla426 = false
        // this.controla427 = false
        // this.controla428 = false
        // this.controla429 = false
        // this.controla4210 = false
        // this.controla4211 = false
        // this.controla4212 = false
      } else if (t === 'controlb4' && e.target.value === '-1') {
        this.controlb4 = false
        this.controlb422 = false
      } else if ((t !== 'controla3113' && t !== 'controla3213' && t !== 'controla3313' && t !== 'controla3413' && t !== 'controlb3113' && t !== 'controlb3213' && t !== 'controlb3313' && t !== 'controlb3413' && t !== 'controlc3113' && t !== 'controlc3213' && t !== 'controlc3313' && t !== 'controlc3413') && e.target.value === '1') {
        this[t] = true
      } else if((t === 'controla3113' || t === 'controla3213' || t === 'controla3313' || t === 'controla3413' ||
        t === 'controlb3113' || t === 'controlb3213' || t === 'controlb3313' || t === 'controlb3413' ||
        t === 'controlc3113' || t === 'controlc3213' || t === 'controlc3313' || t === 'controlc3413' || t === 'controla3513' || t === 'controlb3513' || t === 'controlc3513' || t === 'controld3113' || t === 'controld3213' || t === 'controld3313' || t === 'controld3413' || t === 'controld3513') && e.target.value === '3') {
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
          const allergy = []
          for (var key in this.optionDataSource) {
            _.each(this.optionDataSource[key], function(item) {
              allergy.push({
                markId: 1,
                microbeName: item.microbeName,
                antibiotic: item.antibiotic,
                antibioticResult: item.antibioticResult,
                allergyValue: item.allergyValue
              })
            })
          }
          for (var key in this.optionDataSource2) {
            _.each(this.optionDataSource2[key], function(item) {
              allergy.push({
                markId: 2,
                microbeName: item.microbeName,
                antibiotic: item.antibiotic,
                antibioticResult: item.antibioticResult,
                allergyValue: item.allergyValue
              })
            })
          }
          //处理附件
          var alList1 = ['铜绿假单胞菌', '阴沟肠杆菌', '肺炎克雷伯菌', '肺炎链球菌', '副流感嗜血杆菌', '鲍曼不动杆菌', '金黄色葡萄球菌', this.form.getFieldValue('otherName1')]

          var pic1 = []
          if (!_.isEmpty(this.picList1)) {
            pic1 = _.map(this.picList1, function(v, i) {
              return '1-' + alList1[i] + '-' + v
            })
          }
          var re = this.form.getFieldsValue()
          var that = this
          re = {
            ...re,
            'a': typeof re['a'] !== 'undefined' ? re['a'].join(',') : '',
            'a3': typeof re['a3'] !== 'undefined' ? re['a3'].join(',') : '',
            'b3': typeof re['b3'] !== 'undefined' ? re['b3'].join(',') : '',
            'c3': typeof re['c3'] !== 'undefined' ? re['c3'].join(',') : '',
            'd3': typeof re['d3'] !== 'undefined' ? re['d3'].join(',') : '',
            'a1': typeof re['a1'] !== 'undefined' ? re['a1'].format('YYYY-MM-DD') : '',
            'b1': typeof re['b1'] !== 'undefined' ? re['b1'].format('YYYY-MM-DD') : '',
            'c1': typeof re['c1'] !== 'undefined' ? re['c1'].format('YYYY-MM-DD') : '',
            'd1': typeof re['d1'] !== 'undefined' ? re['d1'].format('YYYY-MM-DD') : '',
            'a42': typeof re['a42'] !== 'undefined' ? re['a42'].join(',') : '',
            'b42': typeof re['b42'] !== 'undefined' ? re['b42'].join(',') : '',
            'c4': typeof re['c4'] !== 'undefined' ? re['c4'].join(',') : '',
            'c41': typeof re['c41'] !== 'undefined' ? re['c41'].join(',') : '',
            'a452': typeof re['a452'] !== 'undefined' ? re['a452'].join(',') : '',
            'a462': typeof re['a462'] !== 'undefined' ? re['a462'].join(',') : '',
            'a472': typeof re['a472'] !== 'undefined' ? re['a472'].join(',') : '',
            'a52': typeof re['a52'] !== 'undefined' ? re['a52'].join(',') : '',
            'a62': typeof re['a62'] !== 'undefined' ? re['a62'].join(',') : '',
            'a72': typeof re['a72'] !== 'undefined' ? re['a72'].join(',') : '',
            'c51': typeof re['c51'] !== 'undefined' ? re['c51'].join(',') : '',
            'c52': typeof re['ca52'] !== 'undefined' ? re['c52'].join(',') : '',
            'c6': typeof re['c6'] !== 'undefined' ? re['c6'].join(',') : '',
            'c61': typeof re['c61'] !== 'undefined' ? re['c61'].join(',') : '',
            'c7': typeof re['c7'] !== 'undefined' ? re['c7'].join(',') : '',
            'c71': typeof re['c71'] !== 'undefined' ? re['c71'].join(',') : '',
            'c8': typeof re['c8'] !== 'undefined' ? re['c8'].join(',') : '',
            'c81': typeof re['c81'] !== 'undefined' ? re['c81'].join(',') : '',
            'a36': that.type1,
            'a37': that.type2,
            'a38': that.type3,
            'a39': that.type4,
            'a310': that.type5
          }
          console.log(re)
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.bywsw && this.bywsw.bywswId) {
            re.bywswId = this.bywsw.bywswId
          }
          params.append('formData', JSON.stringify(re))
          params.append('patientBasis', JSON.stringify(this.patientBasis))
          params.append('basisMarkId', this.maskId)
          params.append('markName', this.markName)
          params.append('allergy', JSON.stringify(allergy))
          params.append('fileNameForMa', JSON.stringify(pic1))
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
              params.append('patientBasisId', this.patientBasisId)
              getPatientBasis(params)
                .then(res => {
                  that.orgTree = res.data.list
                  that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
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
    save() {
      const allergy = []
      for (var key in this.optionDataSource1) {
        _.each(this.optionDataSource1[key], function(item) {
          allergy.push({
            markId: 1,
            microbeName: item.microbeName,
            antibiotic: item.antibiotic,
            antibioticResult: item.antibioticResult,
            allergyValue: item.allergyValue
          })
        })
      }
      for (var key in this.optionDataSource2) {
        _.each(this.optionDataSource2[key], function(item) {
          allergy.push({
            markId: 2,
            microbeName: item.microbeName,
            antibiotic: item.antibiotic,
            antibioticResult: item.antibioticResult,
            allergyValue: item.allergyValue
          })
        })
      }
      for (var key in this.optionDataSource3) {
        _.each(this.optionDataSource3[key], function(item) {
          allergy.push({
            markId: 3,
            microbeName: item.microbeName,
            antibiotic: item.antibiotic,
            antibioticResult: item.antibioticResult,
            allergyValue: item.allergyValue
          })
        })
      }
      for (var key in this.optionDataSource4) {
        _.each(this.optionDataSource4[key], function(item) {
          allergy.push({
            markId: 4,
            microbeName: item.microbeName,
            antibiotic: item.antibiotic,
            antibioticResult: item.antibioticResult,
            allergyValue: item.allergyValue
          })
        })
      }
      for (var key in this.optionDataSource5) {
        _.each(this.optionDataSource5[key], function(item) {
          allergy.push({
            markId: 5,
            microbeName: item.microbeName,
            antibiotic: item.antibiotic,
            antibioticResult: item.antibioticResult,
            allergyValue: item.allergyValue
          })
        })
      }
      //处理附件
      var alList1 = ['铜绿假单胞菌', '阴沟肠杆菌', '肺炎克雷伯菌', '肺炎链球菌', '副流感嗜血杆菌', '鲍曼不动杆菌', '金黄色葡萄球菌', this.form.getFieldValue('otherName1')]

      var pic1 = []
      if (!_.isEmpty(this.picList1)) {
        pic1 = _.map(this.picList1, function(v, i) {
          return '1-' + alList1[i] + '-' + v
        })
      }
      var re = this.form.getFieldsValue()
      var that = this
      re = {
        ...re,
        'a': typeof re['a'] !== 'undefined' ? re['a'].join(',') : '',
        'a3': typeof re['a3'] !== 'undefined' ? re['a3'].join(',') : '',
        'b3': typeof re['b3'] !== 'undefined' ? re['b3'].join(',') : '',
        'c3': typeof re['c3'] !== 'undefined' ? re['c3'].join(',') : '',
        'a1': typeof re['a1'] !== 'undefined' ? re['a1'].format('YYYY-MM-DD') : '',
        'b1': typeof re['b1'] !== 'undefined' ? re['b1'].format('YYYY-MM-DD') : '',
        'c1': typeof re['c1'] !== 'undefined' ? re['c1'].format('YYYY-MM-DD') : '',
        'd1': typeof re['d1'] !== 'undefined' ? re['d1'].format('YYYY-MM-DD') : '',
        'a42': typeof re['a42'] !== 'undefined' ? re['a42'].join(',') : '',
        'b42': typeof re['b42'] !== 'undefined' ? re['b42'].join(',') : '',
        'c4': typeof re['c4'] !== 'undefined' ? re['c4'].join(',') : '',
        'c41': typeof re['c41'] !== 'undefined' ? re['c41'].join(',') : '',
        'a452': typeof re['a452'] !== 'undefined' ? re['a452'].join(',') : '',
        'a462': typeof re['a462'] !== 'undefined' ? re['a462'].join(',') : '',
        'a472': typeof re['a472'] !== 'undefined' ? re['a472'].join(',') : '',
        'a52': typeof re['a52'] !== 'undefined' ? re['a52'].join(',') : '',
        'a62': typeof re['a62'] !== 'undefined' ? re['a62'].join(',') : '',
        'a72': typeof re['a72'] !== 'undefined' ? re['a72'].join(',') : '',
        'c51': typeof re['c51'] !== 'undefined' ? re['c51'].join(',') : '',
        'c52': typeof re['ca52'] !== 'undefined' ? re['c52'].join(',') : '',
        'c6': typeof re['c6'] !== 'undefined' ? re['c6'].join(',') : '',
        'c61': typeof re['c61'] !== 'undefined' ? re['c61'].join(',') : '',
        'c7': typeof re['c7'] !== 'undefined' ? re['c7'].join(',') : '',
        'c71': typeof re['c71'] !== 'undefined' ? re['c71'].join(',') : '',
        'c8': typeof re['c8'] !== 'undefined' ? re['c8'].join(',') : '',
        'c81': typeof re['c81'] !== 'undefined' ? re['c81'].join(',') : '',
        'a36': that.type1,
        'a37': that.type2,
        'a38': that.type3,
        'a39': that.type4,
        'a310': that.type5
      }
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.bywsw && this.bywsw.bywswId) {
        re.bywswId = this.bywsw.bywswId
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      params.append('allergy', JSON.stringify(allergy))
      params.append('fileNameForMa', JSON.stringify(pic1))

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
          params.append('patientBasisId', this.patientBasisId)
          getPatientBasis(params)
            .then(res => {
              that.orgTree = res.data.list
              that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
            })
        })
        .catch(error => {
          that.spinning = false
          console.log(error)
        })
      return false
    },
    initValue(key, type = 'normal') {
      if (!this.bywsw) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.bywsw[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.bywsw[key])
      } else if (type === 'array') {
        return this.bywsw[key].split(',')
      } else {
        return this.bywsw[key] + ''
      }
    },
    dealAnswers(data) {
      var that = this
      var answer = data.bywsw
      var alList = ['铜绿假单胞菌', '阴沟肠杆菌', '肺炎克雷伯菌', '肺炎链球菌', '副流感嗜血杆菌', '鲍曼不动杆菌', '金黄色葡萄球菌']
      if (answer && !_.isEmpty(answer)) {
        var splitArr = []
        if (answer.a) {
          splitArr = answer.a.split(',')
          if (splitArr.indexOf('1') > -1) {
            this.control1 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.control2 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.control3 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.control4 = true
          }
          if (splitArr.indexOf('5') > -1) {
            this.control5 = true
          }
        }
        if (answer.a2 && answer.a2 === -1) {
          this.controla2 = true
        }
        if (answer.a4 && answer.a4 === 1) {
          this.controla4 = true
        }
        if (answer.a6 && answer.a6 === 1) {
          this.controla6 = true
        }
        if (answer.b2 && answer.b2 === -1) {
          this.controlb2 = true
        }
        if (answer.b4 && answer.b4 === 1) {
          this.controlb4 = true
        }
        if (answer.c2 && answer.c2 === -1) {
          this.controlc2 = true
        }
        if (answer.c4) {
          splitArr = answer.c4.split(',')
          if (splitArr.indexOf('1') > -1) {
            this.controlc41 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.initC4 = true
          }
        }
        if (answer.a3) {
          splitArr = answer.a3.split(',')
          if (splitArr.indexOf('1') > -1) {
            this.controla31 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controla32 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controla33 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controla34 = true
          }
        }
        if(answer.a311 === 3) {
          this.controla3113 = true
        }
        if(answer.a321 === 3) {
          this.controla3213 = true
        }
        if(answer.a331 === 3) {
          this.controla3313 = true
        }
        if(answer.a341 === 3) {
          this.controla3413 = true
        }
        if(answer.b311 === 3) {
          this.controlb3113 = true
        }
        if(answer.b321 === 3) {
          this.controlb3213 = true
        }
        if(answer.b331 === 3) {
          this.controlb3313 = true
        }
        if(answer.b341 === 3) {
          this.controlb3413 = true
        }
        if(answer.c311 === 3) {
          this.controlc3113 = true
        }
        if(answer.c321 === 3) {
          this.controlc3213 = true
        }
        if(answer.c331 === 3) {
          this.controlc3313 = true
        }
        if(answer.c341 === 3) {
          this.controlc3413 = true
        }
        if(answer.c351 === 3) {
          this.controlc3513 = true
        }
        if(answer.d311 === 3) {
          this.controld3113 = true
        }
        if(answer.d321 === 3) {
          this.controld3213 = true
        }
        if(answer.d331 === 3) {
          this.controld3313 = true
        }
        if(answer.d341 === 3) {
          this.controld3413 = true
        }
        if(answer.d351 === 3) {
          this.controld3513 = true
        }
        if (answer.b3) {
          splitArr = answer.b3.split(',')
          if (splitArr.indexOf('1') > -1) {
            this.controlb31 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controlb32 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controlb33 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controlb34 = true
          }
        }
        if (answer.c3) {
          splitArr = answer.c3.split(',')
          if (splitArr.indexOf('1') > -1) {
            this.controlc31 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controlc32 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controlc33 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controlc34 = true
          }
        }
        if (answer.d3) {
          splitArr = answer.d3.split(',')
          if (splitArr.indexOf('1') > -1) {
            this.controld31 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controld32 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controld33 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controld34 = true
          }
        }
        if (answer.a42) {
          splitArr = answer.a42.split(',')
          if (splitArr.indexOf('0') > -1) {
            this.controla420 = true
          }
          if (splitArr.indexOf('1') > -1) {
            this.controla421 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controla422 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controla423 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controla424 = true
          }
          if (splitArr.indexOf('5') > -1) {
            this.controla425 = true
          }
          if (splitArr.indexOf('6') > -1) {
            this.controla426 = true
          }
          if (splitArr.indexOf('7') > -1) {
            this.controla427 = true
          }
          if (splitArr.indexOf('8') > -1) {
            this.controla428 = true
          }
          if (splitArr.indexOf('9') > -1) {
            this.controla429 = true
          }
          if (splitArr.indexOf('10') > -1) {
            this.controla4210 = true
          }
          if (splitArr.indexOf('11') > -1) {
            this.controla4211 = true
          }
          if (splitArr.indexOf('12') > -1) {
            this.controla4212 = true
          }
        }
        if (answer.a45 && answer.a45 === 1) {
          this.controla45 = true
        }
        if (answer.a46 && answer.a46 === 1) {
          this.controla46 = true
        }
        if (answer.a47 && answer.a47 === 1) {
          this.controla47 = true
        }
        if (answer.a48 && answer.a48 === 1) {
          this.controla48 = true
        }
        if (answer.a452) {
          splitArr = answer.a452.split(',')
          if (splitArr.indexOf('0') > -1) {
            this.controla4520 = true
          }
          if (splitArr.indexOf('1') > -1) {
            this.controla4521 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controla4522 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controla4523 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controla4524 = true
          }
          if (splitArr.indexOf('5') > -1) {
            this.controla4525 = true
          }
          if (splitArr.indexOf('6') > -1) {
            this.controla4526 = true
          }
          if (splitArr.indexOf('7') > -1) {
            this.controla4527 = true
          }
          if (splitArr.indexOf('8') > -1) {
            this.controla4528 = true
          }
          if (splitArr.indexOf('9') > -1) {
            this.controla4529 = true
          }
          if (splitArr.indexOf('10') > -1) {
            this.controla45210 = true
          }
          if (splitArr.indexOf('11') > -1) {
            this.controla45211 = true
          }
          if (splitArr.indexOf('12') > -1) {
            this.controla45212 = true
          }
        }

        if (answer.a462) {
          splitArr = answer.a462.split(',')
          if (splitArr.indexOf('0') > -1) {
            this.controla4620 = true
          }
          if (splitArr.indexOf('1') > -1) {
            this.controla4621 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controla4622 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controla4623 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controla4624 = true
          }
          if (splitArr.indexOf('5') > -1) {
            this.controla4625 = true
          }
          if (splitArr.indexOf('6') > -1) {
            this.controla4626 = true
          }
          if (splitArr.indexOf('7') > -1) {
            this.controla4627 = true
          }
          if (splitArr.indexOf('8') > -1) {
            this.controla4628 = true
          }
          if (splitArr.indexOf('9') > -1) {
            this.controla4629 = true
          }
          if (splitArr.indexOf('10') > -1) {
            this.controla46210 = true
          }
          if (splitArr.indexOf('11') > -1) {
            this.controla46211 = true
          }
          if (splitArr.indexOf('12') > -1) {
            this.controla46212 = true
          }
        }

        if (answer.a472) {
          splitArr = answer.a472.split(',')
          if (splitArr.indexOf('0') > -1) {
            this.controla4720 = true
          }
          if (splitArr.indexOf('1') > -1) {
            this.controla4721 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controla4722 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controla4723 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controla4724 = true
          }
          if (splitArr.indexOf('5') > -1) {
            this.controla4725 = true
          }
          if (splitArr.indexOf('6') > -1) {
            this.controla4726 = true
          }
          if (splitArr.indexOf('7') > -1) {
            this.controla4727 = true
          }
          if (splitArr.indexOf('8') > -1) {
            this.controla4728 = true
          }
          if (splitArr.indexOf('9') > -1) {
            this.controla4729 = true
          }
          if (splitArr.indexOf('10') > -1) {
            this.controla47210 = true
          }
          if (splitArr.indexOf('11') > -1) {
            this.controla47211 = true
          }
          if (splitArr.indexOf('12') > -1) {
            this.controla47212 = true
          }
        }

        if (answer.a482) {
          splitArr = answer.a482.split(',')
          if (splitArr.indexOf('0') > -1) {
            this.controla4820 = true
          }
          if (splitArr.indexOf('1') > -1) {
            this.controla4821 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controla4822 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controla4823 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controla4824 = true
          }
          if (splitArr.indexOf('5') > -1) {
            this.controla4825 = true
          }
          if (splitArr.indexOf('6') > -1) {
            this.controla4826 = true
          }
          if (splitArr.indexOf('7') > -1) {
            this.controla4827 = true
          }
          if (splitArr.indexOf('8') > -1) {
            this.controla4828 = true
          }
          if (splitArr.indexOf('9') > -1) {
            this.controla4829 = true
          }
          if (splitArr.indexOf('10') > -1) {
            this.controla48210 = true
          }
          if (splitArr.indexOf('11') > -1) {
            this.controla48211 = true
          }
          if (splitArr.indexOf('12') > -1) {
            this.controla48212 = true
          }
        }


        this.type1 = answer.a36 ? answer.a36 + '' : ''
        this.type2 = answer.a37 ? answer.a37 + '' : ''
        this.type3 = answer.a38 ? answer.a38 + '' : ''
        this.type4 = answer.a39 ? answer.a39 + '' : ''
        this.type5 = answer.a310 ? answer.a310 + '' : ''
        if (data[1]) {
          _.each(alList, function(v, i) {
            if (data[1][v]) {
              that.optionDataSource1[i] = _.map(data[1][v], function(v, i) {
                return {
                  keyW: i,
                  microbeName: v.microbeName,
                  antibiotic: v.antibiotic,
                  antibioticResult: v.antibioticResult,
                  allergyValue: v.allergyValue
                };
              })
            }
          })
          var other = _.filter(data[1], function(v, k) { return alList.indexOf(k) === -1 })
          if (other && other.length) {
            that.optionDataSource1[7] = _.map(other[0], function(v, i) {
              return {
                keyW: i,
                microbeName: v.microbeName,
                antibiotic: v.antibiotic,
                antibioticResult: v.antibioticResult,
                allergyValue: v.allergyValue
              };
            })
            that.otherName1 = other[0][0].microbeName
          }
        }
        if (answer.b42) {
          if (splitArr.indexOf('2') > -1) {
            this.controlb422 = true
          }
        }
        if (data[2]) {
          _.each(alList, function(v, i) {
            if (data[2][v]) {
              that.optionDataSource2[i] = _.map(data[2][v], function(v, i) {
                return {
                  keyW: i,
                  microbeName: v.microbeName,
                  antibiotic: v.antibiotic,
                  antibioticResult: v.antibioticResult,
                  allergyValue: v.allergyValue
                };
              })
            }
          })
          var other = _.filter(data[2], function(v, k) { return alList.indexOf(k) === -1 })
          if (other && other.length) {
            that.optionDataSource2[7] = _.map(other[0], function(v, i) {
              return {
                keyW: i,
                microbeName: v.microbeName,
                antibiotic: v.antibiotic,
                antibioticResult: v.antibioticResult,
                allergyValue: v.allergyValue
              };
            })
            that.otherName2 = other[0][0].microbeName
          }
        }
        if (answer.c41) {
          splitArr = answer.c41.split(',')
          if (splitArr.indexOf('5') > -1) {
            this.controlc415 = true
          }
        }
      }
      return answer
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
    showList(e, name, controlNode, _index) {
      if (e.target.checked) {
        this[controlNode] = true
        if (name == "其他") return
        this.getMedicineAllergyList(name, e.target.value, _index)
      } else {
        this[controlNode] = false
        this.$set(this[`optionDataSource${_index}`], e.target.value, [])
      }
    },
    getMedicineAllergyList(value, index, _index) {
      const that = this
      const params = new URLSearchParams()
      params.append('microbeName', value)
      getMedicineAllergyList(params).then(res => {
        const optionDataSource = _.map(res.data, function(v, i) {
          return {
            keyW: i,
            microbeName: v.microbeName,
            antibiotic: v.antibiotic,
            antibioticResult: v.antibioticResult,
            allergyValue: v.allergyValue
          };
        })
        that.$set(that[`optionDataSource${_index}`], index, optionDataSource)
      })
    },
    otherChange(e, index, _index) {
      this.getMedicineAllergyList(e.target.value, index, _index)
    },
    changeType1(v) {
      this.type1 = v
    },
    changeType2(v) {
      this.type2 = v
    },
    changeType3(v) {
      this.type3 = v
    },
    changeType4(v) {
      this.type4 = v
    },
    changeType5(v) {
      this.type5 = v
    },
    changePic1(e, index) {
      this.picList1[index] = e
    },
    withdraw() {
      var that = this
      this.$confirm({
        title: '确认撤销？',
        onOk() {
          that.spinning = true
          var params = new URLSearchParams()
          params.append('patientBasisMarkId', that.bywsw.patientBasisMarkId)
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
    handleOk(v) {
      this.submitInfo = v
      this.$refs.submitBtn.$el.click()
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
              that.bywsw = _.extend(that.bywsw || {}, that.dealAnswers(res.data.data))
            }).catch(error => {
              that.spinning = false
              console.log(error)
            })
        }
      })
    },
    handleNone(e, d, v, arr, extra) {
      if(e.target.checked){
        let data = {}
        data[d] = [v]
        if(d === 'a') {
          this.control1 = false
          this.control2 = false
          this.control3 = false
          this.control5 = false
          this[extra] = true
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(data)
          arr.forEach((t) => {
            this[t] = false
          })
        })
      } else {
        if(d === 'a') {
          this.control4 = false
        }
        if(d === 'c4') {
          this.initC4 = false
        }
      }
    },
    detect(d, v) {
      if(Array.isArray(this.form.getFieldValue(d)) && this.form.getFieldValue(d).indexOf(v) > -1) {
        return true
      } else {
        return false
      }
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

    padding: 20px 20px 40px;

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

@media screen and (max-width: 1366px) {
  .control-m-line.ant-checkbox-group {
    top: 10px;
    position: relative;
  }
}

.base-form {
  height: 100%;
  -ms-overflow-x: hidden;
  overflow: hidden auto;
}
.sub-t {
    margin-top: 10px;
    margin-left: 20px;
    color: #000;
}
</style>