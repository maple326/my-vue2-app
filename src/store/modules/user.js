import storage from "@/utils/storage";
import api from "@/api";
import { getQuery } from "@/utils/utils";
import router from "@/router";

const PREFIX = "MIDDLE_LONG_TERM_";
const CODE = "code";
const USER_ID = PREFIX + "userId";
const ROLE = PREFIX + "role";
const USER_INFO = PREFIX + "userInfo";
const TOKEN = "token";
const LOGIN_NAME = "login";

const state = {
  userId: localStorage.getItem(USER_ID),
  role: storage.load(ROLE),
  userInfo: storage.load(USER_INFO),
  token: localStorage.getItem(TOKEN),
  routes: null,
  cache: {},
};

const getters = {
  isLogin(state) {
    return !!state.token;
  },
  userInfo(state) {
    return state.userInfo;
  },
  menu(state) {
    const routes = state.routes;
    if (!routes) return [];
    return routes.reduce((pre, cur) => {
      if (!cur.meta.hidden) {
        pre.push(
          cur.children
            ? {
                ...cur,
                children: cur.children.filter((item) => !item.meta.hidden),
              }
            : cur
        );
      }
      return pre;
    }, []);
  },
};

const mutations = {
  SET_USER_ID(state, val) {
    if (!val) return;
    state.userId = val;
    localStorage.setItem(USER_ID, val);
  },
  SET_ROLE(state, val) {
    if (!val) return;
    state.role = val;
    storage.save(ROLE, val);
  },
  SET_USER_INFO(state, val) {
    if (!val) return;
    state.userInfo = val;
    storage.save(USER_INFO, val);
  },
  // 重置userId
  RESET_USER_ID(state) {
    state.userId = "";
    localStorage.removeItem(USER_ID);
  },
  SET_PROCESS_ID(state, val) {
    if (!val) return;
    state.processId = val;
    localStorage.setItem(PROCESS_ID, val);
  },
  // 重置processId
  RESET_PROCESS_ID(state) {
    state.processId = "";
    localStorage.removeItem(PROCESS_ID);
  },
  SET_SID(state, val) {
    if (!val) return;
    state.sid = val;
    localStorage.setItem(SID, val);
  },
  SET_TOKEN(state, val) {
    if (!val) return;
    state.token = val;
    localStorage.setItem(TOKEN, val);
  },
  // 重置sid
  RESET_SID(state) {
    state.sid = "";
    localStorage.removeItem(SID);
    location = location.href.replace(`${SID}=${getQuery(SID)}`, "");
  },
  // 重置token
  RESET_TOKEN(state) {
    state.token = "";
    localStorage.removeItem(TOKEN);
  },
  // 重置role
  RESET_ROLE(state) {
    state.token = "";
    localStorage.removeItem(ROLE);
  },
  SET_TASK_ID(state, val) {
    if (!val) return;
    state.taskId = val;
    localStorage.setItem(TASK_ID, val);
  },
  // 重置taskId
  RESET_TASK_ID(state) {
    state.taskId = "";
    localStorage.removeItem(TASK_ID);
  },
  SET_UID(state, val) {
    if (!val) return;
    let obj = JSON.parse(state.uid);
    obj[state.sid] = val;
    localStorage.setItem(UID, JSON.stringify(obj));
  },
  SET_ROUTES(state, val) {
    state.routes = val;
  },
  SET_PWD_STATUS(state, val) {
    state.pwdStatus = val;
    val ? storage.save(PWD_STATUS, val) : localStorage.removeItem(PWD_STATUS);
  },
  SET_CACHE(state, { key, val }) {
    state.cache[key] = val;
  },
};

const actions = {
  getAuth() {
    router.push({
      name: LOGIN_NAME,
    });
  },
  getCode({ dispatch }, { diableGetAuth } = {}) {
    return new Promise(async (resolve) => {
      let code = getQuery(CODE);
      if (code) {
        resolve(code);
        return;
      }
      if (!diableGetAuth) {
        dispatch("getAuth");
      } else {
        resolve();
      }
    });
  },
  getUserId({ dispatch, commit }, { diableGetAuth } = {}) {
    return new Promise(async (resolve, reject) => {
      let userId = getQuery(USER_ID) || localStorage.getItem(USER_ID);
      if (userId) {
        resolve(userId);
        return;
      }
      let code = await dispatch("getCode", { diableGetAuth });
      if (code) {
        let { data } = await api.getUserId(code);
        userId = data.userId;
        commit("SET_USER_ID", userId);
      }
      resolve(userId);
    });
  },
  getRole() {
    return Promise.resolve(storage.load(ROLE));
  },
  getUserInfo() {
    return Promise.resolve(storage.load(USER_INFO));
  },
  getProcessId() {
    return Promise.resolve(
      getQuery(PROCESS_ID) || localStorage.getItem(PROCESS_ID)
    );
  },
  getSid({ dispatch, commit }, { userId, isRenew } = {}) {
    return Promise.resolve();
  },
  /**
   * 获取token
   * @param {Object}
   * @param {Object} diableGetAuth:禁用获取授权
   * @returns
   */
  getToken({ dispatch, commit }, { diableGetAuth } = {}) {
    return new Promise(async (resolve, reject) => {
      let token = localStorage.getItem(TOKEN);
      if (token) {
        resolve(token);
        return;
      }
      try {
        let code = await dispatch("getCode", { diableGetAuth });
        if (code) {
          let { data } = await api.common.getToken({
            code,
          });
          let { token, roleIds } = data;
          commit("SET_TOKEN", token);
          commit("SET_ROLE", roleIds);
          resolve();
        } else {
          reject();
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  logout({ dispatch, commit }, { diableGetAuth } = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        await api.common.logout();
        commit("RESET_TOKEN");
        commit("RESET_ROLE");
        !diableGetAuth && dispatch("getAuth");
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  getTaskId() {
    return Promise.resolve(getQuery(TASK_ID) || localStorage.getItem(TASK_ID));
  },
  getUid({ dispatch }) {
    return new Promise(async (resolve) => {
      let uid = getQuery(UID);
      if (uid) {
        resolve(uid);
        return;
      }
      let sid = await dispatch("getSid");
      resolve((JSON.parse(localStorage.getItem(UID)) || {})[sid]);
    });
  },
  getPasswordStatus() {
    return Promise.resolve(storage.load(PWD_STATUS));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
