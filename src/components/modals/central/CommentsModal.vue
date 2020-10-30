<template>
  <div class="p-comments">
    <div class="p-comments-list p-comments-padding-2 scroll-y-container">
      <CommentItem v-for="(_item, i) in cm.body.comments"
                   :comment="_item"
                   :key="i" />
    </div>
    <CommentInputArea :currentUserInfo="body.currentUserInfo" />
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
  computed: {
    cm() {
      return this.contextMenu();
    },
    body() {
      return this.cm.body;
    },
  },
  methods: {

  },
}
</script>
