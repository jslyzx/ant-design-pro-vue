import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  patient: '/patient',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api


export function getPatientList(parameter) {
  return axios({
    url: '/patient/getDataList',
    method: 'post',
    params: parameter
  })
}

export function getPatientDataList(parameter) {
  return axios({
    url: '/patient/getPatientDataList',
    method: 'post',
    params: parameter
  })
}

export function deletePatient(parameter) {
  return axios({
    url: '/patient/deletePatient',
    method: 'post',
    params: parameter
  })
}

export function getPatientDetail(parameter) {
  return axios({
    url: '/patient/detail',
    method: 'post',
    params: parameter
  })
}

//根据身份证号获取患者详情
export function getPatientDetailByCard(parameter) {
  return axios({
    url: '/patient/getPatientDetailByCard',
    method: 'post',
    data: parameter
  })
}

export function getSFDataList(parameter) {
  return axios({
    url: '/patient/getSFDataList',
    method: 'post',
    data: parameter
  })
}

export function exportPatient() {
  return axios({
    url: '/patient/export',
    method: 'get'
  })
}

export function resetPwd(params) {
  return axios({
    url: '/authority/resetPassword',
    method: 'post',
    data: params
  })
}