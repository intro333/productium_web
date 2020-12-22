export class CurrentUserModel {
  id = 0;
  fullName = '';
  shortName = '';
  color = '';

  constructor(id, fullName, shortName, color) {
    this.id = id;
    this.fullName = fullName;
    this.shortName = shortName;
    this.color = color;
  }

}