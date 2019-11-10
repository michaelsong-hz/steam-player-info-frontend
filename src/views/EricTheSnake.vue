<template>
  <div class="asdf">
    <h1>When was Eric last a snake?</h1>
    <TheSnake steamId="76561198018464987" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheSnake from "@/components/TheSnake.vue";

@Component({
  components: {
    TheSnake
  }
})
export default class EricTheSnake extends Vue {}
</script>
