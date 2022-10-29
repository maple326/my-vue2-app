export default class LoadingManage {
  constructor({ addCallback, closeCallback }) {
    this.count = 0;
    this.addCallback = addCallback;
    this.closeCallback = closeCallback;
  }

  add(disableCb) {
    this.count++;
    !disableCb && this.addCallback();
  }

  close() {
    if (--this.count === 0) {
      this.closeCallback();
    }
  }

  reset() {
    this.count = 0;
    this.closeCallback();
  }
}
