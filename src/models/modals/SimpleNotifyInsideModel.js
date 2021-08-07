export class SimpleNotifyInsideModel {
  /* BASE FIELDS */
  state = false;
  width = 0;
  message = '';
  closeTimeout = 0;

  set(state, width, message, closeTimeout=1000) {
    this.state = state;
    this.width = width;
    this.message = message;
    this.closeTimeout = closeTimeout;

    return this;
  }
}
