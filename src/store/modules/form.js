const state = {
  status: "", // 表单的状态
  validResult: "", // 表单的校验结果
  needValidResultKeys: [], // 表单的校验结果中需要校验的键值
  invalidFields: null, // 未通过校验的字段
  operationType: "", // 操作类型
  data: null, // 表单的数据
  detailData: null, // 详情的数据
  videoPreview: null,
  showLogin: false,
  showRetrievePassword: false, // 是否显示找回密码
  userList: [],
  companyList: [],
  roleList: [],
};

const getters = {
  // 表单的id
  id(state) {
    return state.detailData ? state.detailData.id : undefined;
  },
  showVideoPreview(state) {
    return state.videoPreviewUrl?.visible;
  },
  roleList(state) {
    return state.roleList;
  },
  userList(state) {
    return state.userList;
  },
  companyList(state) {
    return state.companyList;
  },
};

const mutations = {
  SET_VIDEO_PREVIEW(state, { visible, url }) {
    state.videoPreview = {
      visible,
      url,
    };
  },
  SET_SHOW_LOGIN(state, val) {
    state.showLogin = val;
  },
  SET_RETRIEVE_PASSWORD(state, val) {
    state.showRetrievePassword = val;
  },
  // 重置表单相关数据
  RESET_FORM_DATA(state) {
    state.status = "";
    state.validResult = "";
    state.invalidFields = null;
    state.data = null;
    state.operationType = "";
  },
  SET_STATUS(state, val) {
    state.status = val;
  },
  SET_VALIDRESULT(state, val) {
    state.validResult = val;
  },
  SET_NEED_VALIDRESULT_KEYS(state, val) {
    state.needValidResultKeys = val;
  },
  SET_INVALID_FIELDS(state, val) {
    state.invalidFields = {
      ...state.invalidFields,
      ...val,
    };
  },
  RESET_INVALID_FIELDS(state) {
    state.invalidFields = null;
  },
  SET_OPERATION_TYPE(state, val) {
    state.operationType = val;
  },
  SET_DATA(state, val) {
    state.data = val;
  },
  SET_DETAIL_DATA(state, val) {
    state.detailData = val;
  },
  SET_USER_LIST(state, val) {
    state.userList = val;
  },
  SET_COMPANY_LIST(state, val) {
    state.companyList = val;
  },
  SET_ROLE_LIST(state, val) {
    state.roleList = val;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
