const ENUM = {
  CAR: "轿车",
  SUV: "SUV",
  MPV: "MPV",
};

export default Object.freeze(ENUM);

export const getText = (val) => {
  let s = "";
  switch (val) {
    case ENUM.CAR:
      s = "轿车";
      break;
    case ENUM.SUV:
      s = "SUV";
      break;
    case ENUM.MPV:
      s = "MPV";
      break;
  }
  return s;
};
