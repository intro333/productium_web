export class ProjectModel {
  id = 0;
  name = 'in-work';
  activityStatus = 'active';
  isSelected = false;
  nameIsEdited = false;

  constructor(_project) {
    this.id = _project.id;
    this.name = _project.name;
    this.activityStatus = _project.activityStatus;
    this.isSelected = _project.isSelected || false;
  }
}