export class TooltipModel {
  /* BASE FIELDS */
  state = false;
  top = 0;
  left = 0;
  title = '';
  trianglePosition = 'up';

  set(state, top, left, title, trianglePosition = 'up') {
    this.state = state;
    this.top = top;
    this.left = left;
    this.title = title;
    this.trianglePosition = trianglePosition;

    return this;
  }
}