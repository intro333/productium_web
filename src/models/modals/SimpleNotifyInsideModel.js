export class SimpleNotifyInsideModel {
  /* BASE FIELDS */
  state = false;
  width = 0;
  message = '';

  set(state, width, message) {
    this.state = state;
    this.width = width;
    this.message = message;

    return this;
  }
}