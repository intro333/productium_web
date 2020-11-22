export function slidesOfProjectFilter(_slides, projectId) {
  return _slides.filter(_sl =>
    (_sl.slideState !== 'archived' &&
      _sl.projectId === projectId));
}