import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/ericthesnake",
    name: "ericthesnake",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/EricTheSnake.vue")
  },
  {
    path: "/michaelthesnake",
    name: "michaelthesnake",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MichaelTheSnake.vue")
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "about" */ "../views/404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
