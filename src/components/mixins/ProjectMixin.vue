<script>
import {ProjectModel} from "@/models/case-tracker/ProjectModel";
import {mapGetters} from "vuex";

export default {
  name: "ProjectMixin",
  computed: {
    project() {
      const projects = this.getProjects();
      if (projects.length) {
        const foundProject = projects.find(_p => _p.isSelected);
        if (foundProject) {
          return foundProject;
        }
        return projects[0];
      } else {
        return new ProjectModel({
          id: 0,
          name: 'Untitled',
          activityStatus: 'active',
        });
        // TODO Если нет проектов, редиректить на главную
      }
    },
  },
  methods: {
    ...mapGetters(['getProjects']),
    changeProjectNameEditable(state) {
      this.project.nameIsEdited = state;
      setTimeout(() => {
        if (state && this.$refs['projectNameInputRef']) {
          const inputRef = this.$refs['projectNameInputRef'];
          inputRef.focus();
        }
        if (!state && this.project.name === '') {
          this.project.name = 'Untitled'
        }
      }, 20)
    },
    projectNameModalBody() {
      return {
        list: [
          {
            isItemOfMenu: true,
            title: 'Переименовать',
            action: () => {
              console.log('ACTION Переименовать');
              this.changeProjectNameEditable(true);
            }
          },
          {
            isItemOfMenu: true,
            title: 'Удалить',
            action: () => {
              console.log('ACTION Удалить')
            }
          },
          {
            isItemOfMenu: true,
            title: 'Дублировать',
            action: () => {
              console.log('ACTION Дублировать')
            }
          },
        ]
      };
    }
  },
}
</script>