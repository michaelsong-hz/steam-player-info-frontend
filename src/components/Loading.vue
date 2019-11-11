<template>
  <div class="row text-center" v-if="loading">
    <div class="col-md">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="show-loading-tip">
        <p v-if="showLoadingTip">Waiting for response from backend service</p>
        <p v-if="showLoadingTip">(Heroku instance might be waking up)</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Loading extends Vue {
  @Prop({ default: true }) loading!: boolean;
  @Prop({ default: true }) shouldShowLoadingTip!: boolean;
  showLoadingTip = false;
  // loading = true;
  created() {
    if (this.shouldShowLoadingTip) {
      setTimeout(() => (this.showLoadingTip = true), 2500);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.show-loading-tip {
  padding-top: 20px;
}
/* h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>
