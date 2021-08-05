import mixins from 'vue-typed-mixins';
import {mapActions, mapGetters} from "vuex";
import {baseURLConst} from "@/plugins/axios";

export const pushConnection = mixins()
  .extend({
    data: () => ({
      eventSource: null,
      reconnectTimeout: null,
    }),
    created() {
      const connectionUrl = `${baseURLConst}push?sessionId=${this.sessionId}`;
      this.eventSource = new EventSource(connectionUrl);
    },
    computed: {
      sessionId() {
        return this.getSessionId();
      },
      currentUser() {
        return this.getCurrentUser();
      },
      selectedProject() {
        return this.getSelectedProject();
      },
    },
    methods: {
      ...mapActions(['setPushConnectionActive', 'updateCurrentProjectFromSocket']),
      ...mapGetters(['getSessionId', 'getCurrentUser', 'getSelectedProject']),
      pushAutomaticReconnect() {
        if (this.reconnectTimeout !== null) {
          return;
        }

        this.reconnectTimeout = setTimeout(() => {
          this.pushConnect();
        }, 3000);
      },
      pushConnect() {
        this.pushDisconnect();

        const connectionUrl = `${baseURLConst}push?sessionId=${this.sessionId}&userId=${this.currentUser.id}`;
        this.eventSource = new EventSource(connectionUrl);

        this.eventSource.addEventListener('open', () => {
          console.log('addEventListener OPEN');
          this.setPushConnectionActive(true);
          if (this.reconnectTimeout !== null) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
          }
        }, false);

        this.eventSource.addEventListener('error', () => {
          console.log('addEventListener ERROR');
          this.pushDisconnect();

          if (this.reconnectTimeout !== null) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
          }

          this.setPushConnectionActive(false);
          this.pushAutomaticReconnect();
        }, false);

        this.eventSource.addEventListener('message', this.pushMessageReceived, false);
      },
      pushDisconnect() {
        if (this.eventSource !== null) {
          this.eventSource.close();
          this.eventSource = null;

          this.setPushConnectionActive(false);
        }
      },
      pushMessageReceived(event) {
        const data = JSON.parse(event.data);
        // console.log('FROM pushMessageReceived', data);
        const foundProject = data.find(_p => _p.id === this.selectedProject.id);
        if (foundProject) { /* Обновляем только текущий проект (пошаренный) */
          this.updateCurrentProjectFromSocket(foundProject);
        }
      }
    }
  });
