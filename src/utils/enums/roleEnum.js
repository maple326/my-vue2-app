const ENUM = {
  ADMIN: 1,
  PLAN_PUBLISHER: 2,
  PLAN_AUDITOR: 3,
  QA_AUDITOR: 4,
  ENTERPRISE_WRITER: 5,
  ENTERPRISE_CAR_MAINTAIN: 6,
  ENTERPRISE_SIGNER: 7,
};

export default Object.freeze(ENUM);

export const getText = (val) => {
  let s = "";
  switch (val) {
    case ENUM.ADMIN:
      s = "系统管理员";
      break;
    case ENUM.PLAN_PUBLISHER:
      s = "规划部销量发布人";
      break;
    case ENUM.PLAN_AUDITOR:
      s = "规划部销量审核人";
      break;
    case ENUM.QA_AUDITOR:
      s = "质经部销量审核人";
      break;
    case ENUM.ENTERPRISE_WRITER:
      s = "企业销量填报人";
      break;
    case ENUM.ENTERPRISE_CAR_MAINTAIN:
      s = "企业车型维护人";
      break;
    case ENUM.ENTERPRISE_SIGNER:
      s = "企业草签人";
      break;
  }
  return s;
};
