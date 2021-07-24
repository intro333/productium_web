export class ProjectModel {
  id = 0;
  name = 'in-work';
  activityStatus = 'active';
  isSelected = false;
  nameIsEdited = false;
  users = [];

  constructor(_project) {
    this.id = _project.id;
    this.name = _project.name;
    this.activityStatus = _project.activityStatus || 'active';
    this.isSelected = _project.isSelected || false;
  }
}
