import { mock, Random, setup } from "mockjs";

setup({
  timeout: "500-2000",
});

mock(/login\/wxUrl/, (opt) => {
  console.log(opt);
  return {
    code: 200,
    data: Random.url(),
    msg: "成功",
    timestamp: Random.date(),
    success: true,
  };
});
mock(/sales\/api\/login\/pc/, (opt) => {
  console.log(opt);
  return {
    code: 200,
    data: {
      userId: Random.name(),
      userName: Random.cname(),
      token: Random.id(),
      expiresIn: null,
      roleIds: [1, 2],
      companyId: Random.id(),
      companyName: Random.ctitle(),
      systemId: Random.name(),
    },
    msg: "提交成功",
    path: "/login/pc",
    timestamp: Random.date(),
    success: true,
  };
});
mock(/company\/list/, (opt) => {
  console.log(opt);
  let arr = [];
  for (let i = 0; i < Random.natural(5, 10); i++) {
    arr.push({
      id: Random.id(),
      companyName: Random.ctitle(),
      display_time: Random.datetime(),
    });
  }
  return {
    code: 200,
    data: {
      total: 50,
      records: arr,
    },
    msg: "提交成功",
    timestamp: Random.date(),
    success: true,
  };
});

mock(/type\/list/, (opt) => {
  console.log(opt);
  let arr = [];
  for (let i = 0; i < Random.natural(5, 10); i++) {
    arr.push({
      id: Random.id(),
      brand: Random.ctitle(),
      type: Random.ctitle(),
      useElectricity: Random.ctitle(),
      market: Random.ctitle(),
      name: Random.ctitle(),
      code: Random.ctitle(),
      platform: Random.ctitle(),
      sop: Random.ctitle(),
      totalSaleNum: Random.natural(1, 100000),
      driveSystem: Random.ctitle(),
      madePlace: Random.city(),
      createDate: Random.date(),
    });
  }
  return {
    code: 200,
    data: {
      total: arr.length,
      records: arr,
    },
    msg: "提交成功",
    timestamp: Random.date(),
    success: true,
  };
});

mock(/todo\/list/, (opt) => {
  console.log(opt);
  let arr = [];
  for (let i = 0; i < Random.natural(5, 10); i++) {
    arr.push({
      id: Random.id(),
      date: Random.date(),
      company: Random.ctitle(),
      writer: Random.ctitle(),
      totalSaleNum: Random.natural(1, 100000),
      status: Random.ctitle(),
    });
  }
  return {
    code: 200,
    data: {
      total: arr.length,
      records: arr,
    },
    msg: "提交成功",
    timestamp: Random.date(),
    success: true,
  };
});
