export class CurrentUserModel {
  id = 0;
  fullName = '';
  shortName = '';
  color = '';
  projects = []

  constructor(id, fullName, shortName, color, projects = []) {
    this.id = id;
    this.fullName = fullName;
    this.shortName = shortName;
    this.color = color;
    this.projects = projects;
  }

}
