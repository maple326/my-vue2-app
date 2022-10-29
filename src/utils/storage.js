import cryptoJS from "@/utils/crypto-js";
import utils from "@/utils/utils";

const save = (key, val) => {
  localStorage.setItem(key, cryptoJS.encrypt(JSON.stringify(val)));
};

const load = (key) => {
  let val = localStorage.getItem(key);
  if (!val) return null;
  let res;
  try {
    res = utils.parseJSON(cryptoJS.decrypt(val));
  } catch (err) {
    console.log(err);
  }
  return res;
};

export default {
  save,
  load,
};
