<template>
  <div class="p-comments"
       :style="{height: pCommentsHeight}">
    <div ref="pCommentsListRef"
         class="p-comments-list p-comments-padding-2 scroll-y-container">
      <CommentItem v-for="_item in comments"
                   :comment="_item"
                   :key="_item.id"
                   :selectedCommentId="cm.commentId"
                   :contextMenu="cm"
                   :cKey="_item.id" />
    </div>
    <CommentInputArea :parentKey="0"
                      :checkPCommentsBlockHeightFunc="checkPCommentsBlockHeight" />
  </div>
</template>

<script>
import CommentInputArea from "@/components/includes/comment/CommentInputArea";
import CommentItem from "@/components/includes/comment/CommentItem";
import {fillCasesCommentsTree} from "@/functions/case-tracker/projectsF";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "CommentsModal",
  props: ['contextMenu'],
  components: {
    CommentInputArea,
    CommentItem
  },
  data: () => ({
    pCommentsHeight: 'auto',
    selectedCommentId: 0,
    idsCommentsToRemove: [],
  }),
  mounted() {
    this.fillCommentsIdsToRemove(this.comments);
    setTimeout(() => {
      if (this.idsCommentsToRemove.length) {
        this.readAllMessageByIds(this.idsCommentsToRemove).then(() => this.idsCommentsToRemove = []);
      }
    }, 1000);
  },
  computed: {
    currentUser() {
      return this.getCurrentUser();
    },
    cm() {
      return this.contextMenu();
    },
    comments() {
      const query = this.$route.query;
      if (query && query.caseId) {
        const filteredComments = this.getCasesComments()
            .filter(_c => (_c.caseId === query.caseId) &&
                _c.notifyInfo[this.currentUser.id].status !== 'archived');
        return fillCasesCommentsTree(filteredComments);
      }
      return [];
    }
  },
  methods: {
    ...mapActions(['readAllMessageByIds']),
    ...mapGetters(['getCasesComments', 'getCurrentUser']),
    checkPCommentsBlockHeight(pcInputAreaRef) {
      const _ref = this.$refs['pCommentsListRef'];
      if (_ref && pcInputAreaRef) {
        if ((_ref.clientHeight + pcInputAreaRef.clientHeight) > 435) {
          this.pCommentsHeight = '460px'; /* Плюс padding 40px = 500px */
        } else {
          this.pCommentsHeight = 'auto';
        }
      }
    },
    fillCommentsIdsToRemove(comments) {
      comments.forEach(_c => {
        if (_c.notifyInfo[this.currentUser.id].status === 'notRead') {
          this.idsCommentsToRemove.push(_c.id);
        }
        if (_c.children) {
          this.fillCommentsIdsToRemove(_c.children);
        }
      });
    },
  },
}
</script>
