<script>
import {ProjectModel} from "@/models/case-tracker/ProjectModel";
import {mapActions, mapGetters} from "vuex";
import {projectFilterWithSelect} from "@/functions/case-tracker/projectsF";

export default {
  name: "ProjectMixin",
  data: () => ({
    projectNameEditableState: false,
    projects: [],
  }),
  created() {
    this.projUnsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'SET_ALL_PROJECTS_STATE') {
        this.fetchProjectsL();
      }
    });
  },
  beforeDestroy() {
    if (this.projUnsubscribe) {
      this.projUnsubscribe();
    }
  },
  computed: {
    project() {
      const projects = this.projects;
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
    ...mapActions(['updateProjectInfoOnServer']),
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
        if (!state && state !== this.projectNameEditableState) {
          this.updateProjectInfoOnServer();
        }
        this.projectNameEditableState = state;
      }, 20)
    },
    projectNameModalBody() {
      return {
        list: [
          {
            isItemOfMenu: true,
            title: this.$t('common.rename'),
            action: () => {
              this.changeProjectNameEditable(true);
            }
          },
          {
            isItemOfMenu: true,
            title: this.$t('common.delete'),
            action: () => {
              console.log('ACTION Удалить')
            }
          },
          // {
          //   isItemOfMenu: true,
          //   title: 'Дублировать',
          //   action: () => {
          //     console.log('ACTION Дублировать')
          //   }
          // },
        ]
      };
    },
    changeProjectNameText($event) {
      const name = $event.target.value;
      if (name.length <= 40) {
        this.project.name = name;
      }
    },
    fetchProjectsL() {
      const query = this.$route.query;
      if (query && query.projectId) {
        this.projects = projectFilterWithSelect(
            this.getProjects(),
            parseInt(query.projectId)
        );
      } else {
        this.projects = [];
      }
    },
  },
  watch: {
    $route () {
      this.fetchProjectsL();
    }
  }
}
</script>
