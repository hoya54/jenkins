import Vue from "vue";
import DashboardPlugin from "./plugins/dashboard-plugin";
// import MyPlugin from "./plugins/dashboard-plugin";
import App from "./App.vue";

// 로그인 유지를 위한 쿠키 설정
import VueCookies from "vue-cookies";

// 로그인 유지를 위한 세션 설정
import VueSession from "vue-session";

var sessionOptions = {
  persist: true,
};
Vue.use(VueSession, sessionOptions);
///////////////////////////////////

// router setup
import router from "./routes/router";
import "bootstrap-vue/dist/bootstrap-vue.css";

// plugin setup
Vue.use(DashboardPlugin);
// Vue.use(MyPlugin);

// cookie setup
Vue.use(VueCookies);
Vue.$cookies.config("7d"); // 쿠키 유효기간 7일로

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
});
