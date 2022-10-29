/**
 * 是否为汉字
 * @param {String} val 值
 * @returns 是否为汉字
 */
const isChinese = (val) => /[\u4e00-\u9fa5]/.test(val);

/**
 * 校验数字
 * @param {String} name 字段名
 * @param {String} val 值
 * @param {Function} callback
 * @returns 检验提示
 */
const validNum = (name, val, callback) =>
  /[^0-9]/.test(val) && callback(`【${name}】仅限数字`);

/**
 * 校验小数
 * @param {String} name 字段名
 * @param {String} val 值
 * @param {Function} callback
 * @param {Boolean} allowNegative 是否允许负数
 * @returns 检验提示
 */
const validDecimal = (name, val, callback, allowNegative) =>
  !new RegExp(
    `^[+${allowNegative ? "-" : ""}]?(0|([1-9]\\d*))(\\.\\d+)?$`
  ).test(val) && callback(`【${name}】仅限整数或小数`);

/**
 * 校验是否为数字或字母
 * @param {String} name 字段名
 * @param {String} val 值
 * @param {Function} callback
 * @returns 检验提示
 */
const validNumOrLetter = (name, val, callback) =>
  /[^0-9a-zA-Z]/.test(val) && callback(`【${name}】仅限数字和字母`);

/**
 * 校验是否为字母或汉字
 * @param {String} name 字段名
 * @param {String} val 值
 * @param {Function} callback
 * @returns 检验提示
 */
const validLetterOrChinese = (name, val, callback) =>
  /[^a-zA-Z\u4e00-\u9fa5]/.test(val) &&
  callback(`【${name}】不可使用数字及标点符号`);

/**
 * 校验是否为手机号
 * @param {String} val 值
 * @returns 检验提示
 */
const validCellPhone = (val) => /^1\d{10}$/.test(val);

/**
 * 获取必填的校验提示
 * @param {String} name 字段名
 * @returns 校验提示
 */
const getRequiredMsg = (name) => (name && `【${name}】`) + "不允许为空";

/**
 * 获取空白的校验提示
 * @param {String} name 字段名
 * @returns 校验提示
 */
const getBlankMsg = (name) => `【${name}】不允许为全空格`;

/**
 * 获取字符长度的校验提示
 * @param {String} name 字段名
 * @param {Number} len 字符长度
 * @returns 校验提示
 */
const getLenMsg = (name, len) => `【${name}】不允许超过${len}个字符`;

// 企业
export const enterpriseRules = {
  name: [{ required: true, message: getRequiredMsg("企业名称") }],
};
// 角色设置
export const userRules = {
  systemUid: [{ required: true, message: getRequiredMsg("用户名") }],
  companyId: [{ required: true, message: getRequiredMsg("公司名") }],
  role: [{ type: "array", required: true, message: getRequiredMsg("角色") }],
};
// 分组设置
export const groupingRules = {
  systemUid: [
    { type: "array", required: true, message: getRequiredMsg("用户姓名") },
  ],
  companyId: [{ required: true, message: getRequiredMsg("公司名") }],
  role: [{ type: "array", required: true, message: getRequiredMsg("角色") }],
};

// 型谱维护
export const typeMaintenanceRules = {
  brand: [{ required: true, message: getRequiredMsg("品牌") }],
  code: [{ required: true, message: getRequiredMsg("车型代号") }],
  type: [{ required: true, message: getRequiredMsg("车型代号") }],
  platform: [{ required: true, message: getRequiredMsg("平台/架构") }],
  useElectricity: [{ required: true, message: getRequiredMsg("含混动/纯电") }],
  sop: [{ required: true, message: getRequiredMsg("SOP") }],
  market: [{ required: true, message: getRequiredMsg("细分市场") }],
  totalSaleNum: [{ required: true, message: getRequiredMsg("总销量") }],
  name: [{ required: true, message: getRequiredMsg("车型名称") }],
  driveSystem: [{ required: true, message: getRequiredMsg("驱动系统") }],
  madePlace: [{ required: true, message: getRequiredMsg("制造地") }],
};
