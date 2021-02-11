export class ContextMenuBaseModel {
  /* BASE FIELDS */
  state = false;
  type = '';
  width = 0;
  top = 0;
  left = 0;
  triangle = null; // up | down | left | null
  body = null;
  cKey = null;

  /* MORE FIELDS (optional) */
  position = 'fixed';
  zIndex = 5;

  set(state, type, width, top, left, triangle, body= null, cKey = null) {
    this.state = state;
    this.type = type;
    this.width = width;
    this.top = top;
    this.left = left;
    this.triangle = triangle;
    this.body = body;
    this.cKey = cKey;

    return this;
  }

  more(fields) {
    Object.keys(fields).forEach(field => {
      this[field] = fields[field];
    });

    return this;
  }
}