<template>
  <div class="container">
    <div class="row text-center">
      <div class="col-md" />
      <div class="col-1">
        <img :src="player_avatar" alt="steam avatar" />
      </div>
      <div class="col-">
        <p>{{ player_nickname }} has been a snake for</p>
      </div>
      <div class="col-md" />
    </div>
    <div class="row text-center">
      <div class="col-md">
        <p>
          <b>{{ timeSince }}</b>
        </p>
      </div>
    </div>
    <div class="row text-center">
      <div class="col-md">
        <p>Last Online: {{ last_online }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import VueC3 from "vue-c3";
import moment from "moment";

@Component({
  components: {
    VueC3
  }
})
export default class TheSnake extends Vue {
  @Prop() steamId!: string;
  loading = false;
  player_avatar = null;
  player_nickname = null;
  last_online = "";
  error = null;
  lastOnlineRaw = moment();

  timeSinceRaw = 0;
  timeSince = "";

  updateTime() {
    this.timeSince =
      moment().diff(this.lastOnlineRaw, "days") +
      " days " +
      (moment().diff(this.lastOnlineRaw, "hours") % 24) +
      " hours " +
      (moment().diff(this.lastOnlineRaw, "minutes") % 60) +
      " minutes " +
      (moment().diff(this.lastOnlineRaw, "seconds") % 60) +
      " seconds";
  }

  created() {
    var timerID = setInterval(this.updateTime, 1000);
    this.fetchPlayerSummaries();
  }
  fetchPlayerSummaries() {
    fetch(
      `${process.env.VUE_APP_SERVER_URL}/v1/player/${this.steamId}/get_player_summaries/`
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.player_avatar = data.data.avatar;
        this.player_nickname = data.data.personaname;

        var date = moment.unix(data.data.lastlogoff);
        this.lastOnlineRaw = date;
        this.last_online = date.format("MM/DD/YYYY HH:MM:SS");
      })
      // .catch(err => console.error(err))
      .catch();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
