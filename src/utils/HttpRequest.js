import axios from "axios";
import { Loading, Message } from "element-ui";
import store from "@/store";
import LoadingManage from "@/utils/loadingManage";
let loadingInstance = null;

const loadingManage = new LoadingManage({
  addCallback() {
    loadingInstance = Loading.service();
  },

  closeCallback() {
    loadingInstance?.close();
  },
});

const pendingRequest = new Map();

const addPendingRequest = (config) => {
  let { method, url, params } = config;
  let key = `${method} ${url} ${JSON.stringify(params)}`;
  config.cancelToken = new axios.CancelToken((cancel) => {
    if (pendingRequest.has(key)) {
      cancel();
    } else {
      pendingRequest.set(key, cancel);
    }
  });
};

const removePendingRequest = (config) => {
  let { method, url, params } = config;
  let key = `${method} ${url} ${JSON.stringify(params)}`;
  if (pendingRequest.has(key)) {
    pendingRequest.delete(key);
  }
};

export default class HttpRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.loadingInstance = null;
  }

  createAxiosInstance(options) {
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: 2 * 60000,
      requireAuth: true, // 是否需要登录授权
      headers: {
        get: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      },
      ...options,
    });
    this.interceptors(instance);
    return instance;
  }

  interceptors(instance) {
    instance.interceptors.request.use(
      async (config) => {
        addPendingRequest(config);
        // loadingManage.add(config.hideLoading);
        if (config.requireAuth) {
          config.headers.token = await store.dispatch("user/getToken", {
            diableGetAuth: config.diableGetAuth,
          });
        }
        return config;
      },
      (error) => {
        loadingManage.close();
        return Promise.reject(error);
      }
    );
    instance.interceptors.response.use(
      (response) => {
        removePendingRequest(response.config);
        // loadingManage.close();
        let { status, data } = response;
        if (status === 200) {
          if (response.config.isBlob) {
            let contentDisposition = response.headers["content-disposition"];
            if (contentDisposition) {
              return Promise.resolve({
                data,
                fileName: decodeURIComponent(
                  contentDisposition.split(";")[1].split("=")[1]
                ),
              });
            } else {
              Message({
                type: "error",
                message: (data && data.msg) || "发生错误",
              });
            }
          } else {
            let { code, result, msg } = data;
            if (
              code == "200" ||
              result === "ok" ||
              data.code === "200" ||
              (data.data && data.data.result === "ok")
            ) {
              return Promise.resolve(data);
            } else if (code == "401") {
              Message({
                type: "error",
                message: msg,
              });
              // store.dispatch('user/logout')
            } else {
              !response.config.hideMsg &&
                Message({
                  type: "error",
                  message: msg || data.data.msg,
                });
              return Promise.reject(data);
            }
          }
        }
        return Promise.reject(response);
      },
      (error) => {
        console.log(error);
        loadingManage.close();
        return Promise.reject(error);
      }
    );
  }

  get(url, params, config) {
    return this.createAxiosInstance(config).request({
      url,
      params,
    });
  }

  post(url, data, config) {
    return this.createAxiosInstance(config).request({
      method: "post",
      url,
      data,
    });
  }

  put(url, data, config) {
    return this.createAxiosInstance(config).request({
      method: "put",
      url,
      data,
    });
  }
}
