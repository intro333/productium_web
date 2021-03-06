export class ProjectModel {
  id = 0;
  name = 'in-work';
  activityStatus = 'active';
  isSelected = false;
  nameIsEdited = false;
  users = [];
  shareUsers = [];

  constructor(_project) {
    this.id = _project.id;
    this.name = _project.name;
    this.activityStatus = _project.activityStatus || 'active';
    this.isSelected = _project.isSelected || false;
    this.isShared = _project.isShared || false;
    this.creator = _project.creator || null;
    this.shareUsers = _project.shareUsers || [];
  }
}
