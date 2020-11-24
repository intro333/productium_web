export class CentralModalModel {
  /* BASE FIELDS */
  state = false;
  type = '';
  width = 0;
  commentId = null;
  body = null;

  /* MORE FIELDS (optional) */
  //

  set(state, type, width, commentId = null, body= null) {
    this.state = state;
    this.type = type;
    this.width = width;
    this.commentId = commentId;
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