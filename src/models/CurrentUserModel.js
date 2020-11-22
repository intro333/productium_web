export class CurrentUserModel {
  fullName = '';
  shortName = '';
  color = '';

  constructor(fullName, shortName, color) {
    this.fullName = fullName;
    this.shortName = shortName;
    this.color = color;
  }

}