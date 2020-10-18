export class ContextMenuBaseModel {
  /* BASE FIELDS */
  state = false;
  type = '';
  width = 0;
  top = 0;
  left = 0;
  triangle = null; // up | down | null
  body = null;

  /* MORE FIELDS (optional) */
  position = 'fixed';
  zIndex = 5;

  set(state, type, width, top, left, triangle, body= null) {
    this.state = state;
    this.type = type;
    this.width = width;
    this.top = top;
    this.left = left;
    this.triangle = triangle;
    this.body = body;

    return this;
  }

  more(fields) {
    Object.keys(fields).forEach(field => {
      this[field] = fields[field];
    });

    return this;
  }
}