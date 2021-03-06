<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 pad-bottom">
        <h1>Steam Player Info</h1>
        <b-input-group prepend="Steam ID Base64" class="mt-3">
          <b-form-input v-model="steamId"></b-form-input>
          <b-input-group-append>
            <b-button variant="outline-success" v-on:click="fetchData()"
              >Get Player Info</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <Loading v-bind:loading="loadingPlayerInfo" />
    <div class="row" v-if="!loadingPlayerInfo">
      <div class="col-md" />
      <div class="col-xs">
        <img :src="player_avatar" alt="steam avatar" />
      </div>
      <div class="col-xs">
        <p>{{ player_nickname }}</p>
      </div>
      <div class="col-md" />
    </div>
    <div class="row" v-if="!loadingPlayerInfo">
      <div class="col-lg">
        <p>Last Online: {{ last_online }}</p>
      </div>
    </div>
    <div class="row pad-bottom">
      <div class="col-lg">
        <h2>Recent Games Playtime</h2>
        <vue-c3 :handler="barGraphHandler"></vue-c3>
      </div>
    </div>
    <Loading
      v-bind:loading="loadingRecentPlaytime"
      :shouldShowLoadingTip="false"
    />
    <div class="row">
      <div class="col-lg">
        <h2>All Games Playtime</h2>
        <b-table
          striped
          hover
          :items="ownedGamesTable"
          :fields="fieldsTable"
        ></b-table>
      </div>
    </div>
    <Loading v-bind:loading="loadingAllGames" :shouldShowLoadingTip="false" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Loading from "@/components/Loading.vue";
import VueC3 from "vue-c3";

@Component({
  components: {
    Loading,
    VueC3
  }
})
export default class TheSnake extends Vue {
  barGraphHandler = new Vue();
  loadingPlayerInfo = false;
  loadingRecentPlaytime = false;
  loadingAllGames = false;
  player_avatar = null;
  player_nickname = null;
  last_online = "";
  error = null;
  steamId = "76561198059385232";
  ownedGamesTable: any = [];
  fieldsTable: any = null;

  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  }
  fetchData() {
    this.fetchPlayerSummaries();
    this.fetchOwnedGames();
    this.fetchRecentlyPlayedGames();
  }
  fetchPlayerSummaries() {
    this.loadingPlayerInfo = true;
    fetch(
      `${process.env.VUE_APP_SERVER_URL}/v1/player/${this.steamId}/get_player_summaries/`
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.player_avatar = data.data.avatar;
        this.player_nickname = data.data.personaname;

        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(data.data.lastlogoff * 1000);
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        var formattedTime =
          date.getFullYear() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getDate() +
          " " +
          date.getHours() +
          ":" +
          minutes.substr(-2);

        this.last_online = formattedTime;
      })
      // .catch(err => console.error(err))
      .catch()
      .then(() => (this.loadingPlayerInfo = false));
  }
  fetchOwnedGames() {
    this.loadingAllGames = true;
    fetch(
      `${process.env.VUE_APP_SERVER_URL}/v1/player/${this.steamId}/get_owned_games/`
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        var owned_games = [];
        for (var i = 0; i < data.data.length; i++) {
          owned_games.push({
            Game: data.data[i].name,
            Playtime: this.toHours(data.data[i].playtime_forever)
          });
        }
        this.ownedGamesTable = owned_games;
        this.fieldsTable = [
          { key: "Game" },
          { key: "Playtime", sortable: true }
        ];
      })
      // .catch(err => console.error(err))
      .catch()
      .then(() => (this.loadingAllGames = false));
  }
  fetchRecentlyPlayedGames() {
    this.loadingRecentPlaytime = true;
    fetch(
      `${process.env.VUE_APP_SERVER_URL}/v1/player/${this.steamId}/get_recently_played_games/`
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        var chartPlaytime2weeks = ["Playtime Last 2 Weeks"];
        var chartPlaytimeForever = ["Playtime Overall"];
        var nameXAxis = [];
        for (var i = 0; i < data.data.length; i++) {
          chartPlaytime2weeks.push(this.toHours(data.data[i].playtime_2weeks));
          chartPlaytimeForever.push(
            this.toHours(data.data[i].playtime_forever)
          );
          nameXAxis.push(data.data[i].name);
        }
        const barGraphOptions = {
          data: {
            columns: [chartPlaytimeForever, chartPlaytime2weeks],
            type: "bar"
          },
          axis: {
            x: {
              type: "category",
              categories: nameXAxis
            }
          },
          padding: {
            bottom: 60
          }
        };
        this.barGraphHandler.$emit("init", barGraphOptions);
      })
      // .catch(err => console.error(err))
      .catch()
      .then(() => (this.loadingRecentPlaytime = false));
  }
  toHours(minutes: number) {
    return (minutes / 60).toFixed(1);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom {
  padding-bottom: 30px;
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
