const ENUM = {
  MIX: "含混动",
  PURE: "纯电",
};

export default Object.freeze(ENUM);

export const getText = (val) => {
  let s = "";
  switch (val) {
    case ENUM.MIX:
      s = "含混动";
      break;
    case ENUM.PURE:
      s = "纯电";
      break;
  }
  return s;
};
