export class SimpleNotifyModel {
  /* BASE FIELDS */
  state = false;
  width = 0;
  headerMessage = '';
  bodyMessage = [];
  closeTimeout = 0;

  set(state, width, headerMessage, bodyMessage, closeTimeout=1000) {
    this.state = state;
    this.width = width;
    this.headerMessage = headerMessage;
    this.bodyMessage = bodyMessage;
    this.closeTimeout = closeTimeout;

    return this;
  }
}
