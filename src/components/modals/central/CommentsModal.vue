<template>
  <div class="p-comments"
       :style="{height: pCommentsHeight}">
    <div ref="pCommentsListRef"
         class="p-comments-list p-comments-padding-2 scroll-y-container">
      <CommentItem v-for="_item in cm.body.comments"
                   :comment="_item"
                   :key="_item.id"
                   :cKey="_item.id" />
    </div>
    <CommentInputArea :cKey="0"
                      :checkPCommentsBlockHeightFunc="checkPCommentsBlockHeight" />
  </div>
</template>

<script>
import CommentInputArea from "@/components/includes/comment/CommentInputArea";
import CommentItem from "@/components/includes/comment/CommentItem";

export default {
  name: "CommentsModal",
  props: ['contextMenu'],
  components: {
    CommentInputArea,
    CommentItem
  },
  data: () => ({
    pCommentsHeight: 'auto'
  }),
  computed: {
    cm() {
      return this.contextMenu();
    },
    body() {
      return this.cm.body;
    },
  },
  methods: {
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
  },
}
</script>
