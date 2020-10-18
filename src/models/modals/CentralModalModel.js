export class CentralModalModel {
  /* BASE FIELDS */
  state = false;
  type = '';
  width = 0;
  body = null;

  /* MORE FIELDS (optional) */
  //

  set(state, type, width, body= null) {
    this.state = state;
    this.type = type;
    this.width = width;
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