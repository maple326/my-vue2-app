export const paddingZero = (val) => {
  if (parseInt(val) < 10) {
    return "0" + val;
  }
  return val;
};

/**
 * 异步加载js文件
 * @param {*} src js文件地址
 * @returns
 */
export const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    document.body.appendChild(script);
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject();
    };
  });
};

export const getURLString = (name, url = location.href) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = url.slice(url.indexOf("?") + 1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
};

export const setQuery = (name, val = "", url = location.href) => {
  let oldVal = getURLString(name, url);
  if (url.includes(`${name}=${oldVal}`)) {
    url = url.replace(`${name}=${oldVal}`, `${name}=${val}`);
  } else {
    url = url + (url.includes("?") ? "&" : "?") + `${name}=${val}`;
  }
  return url;
};

/**
 * 下载文件
 * @param {String} url 文件地址url
 * @param {String} fileName 文件名
 * @returns
 */
export const download = (url, fileName) => {
  let link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadBinary = (data, fileName) => {
  console.log(data);
  const blob = new Blob([data]);
  let href = window.URL.createObjectURL(blob);
  download(href, fileName);
  window.URL.revokeObjectURL(href); //释放掉blob对象
};

const delay = (delay = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

const parseJSON = (str) => {
  let res;
  try {
    res = JSON.parse(str);
  } catch (err) {
    res = str;
  }
  return res;
};

/**
 * 将文件转成图片对象
 * @param {Object} file 文件
 * @returns 图片对象
 */
const convertToImage = (file) =>
  new Promise((resolve, reject) => {
    try {
      var fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function (e) {
        var img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          resolve(img);
        };
      };
    } catch (err) {
      reject();
    }
  });

const setClipboard = (text) => {
  try {
    let input = document.createElement("input");
    document.body.appendChild(input);
    input.value = text;
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  } catch (err) {
    return false;
  }
  return true;
};

const hasRole = ($route, roleName) => {
  let roles = ($route.meta && $route.meta.roles) || [];
  return (
    ($route.matched.length === 1 &&
      (roles.length === 0 || roles.includes(roleName))) ||
    ($route.matched.length === 2 &&
      $route.matched.some((item) => {
        roles = (item.meta && item.meta.roles) || [];
        return roles.includes(roleName);
      }))
  );
};

export default {
  paddingZero,
  loadScript,
  getURLString,
  setQuery,
  download,
  downloadBinary,
  delay,
  parseJSON,
  convertToImage,
  setClipboard,
  hasRole,
};
