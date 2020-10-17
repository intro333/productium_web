export class TooltipModel {
  /* BASE FIELDS */
  state = false;
  top = 0;
  left = 0;
  title = '';

  set(state, top, left, title) {
    this.state = state;
    this.top = top;
    this.left = left;
    this.title = title;

    return this;
  }
}