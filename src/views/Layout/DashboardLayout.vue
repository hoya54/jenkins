<template>
  <div>
    <!-- <notifications></notifications> -->
    <side-bar>
      <template slot="links">
        <b-media v-if="id == undefined" no-body class="align-items-center">
          <span class="avatar avatar-xl rounded-circle">
            <img
              alt="Image placeholder"
              src="https://user-images.githubusercontent.com/62598865/203680255-f7352a15-8050-40d9-8f77-2066b97d4b09.png"
            />
          </span>
          <b-media-body class="ml-2 d-none d-lg-block">
            <span class="mb-0 text-sm font-weight-bold"
              >로그인이 필요합니다</span
            >
          </b-media-body>
        </b-media>

        <b-media v-else no-body class="align-items-center">
          <span class="avatar avatar-xl rounded-circle">
            <img alt="Image placeholder" :src="src" />
          </span>
          <b-media-body class="ml-2 d-none d-lg-block">
            <span class="mb-0 text-sm font-weight-bold">
              {{ id }}
            </span>
          </b-media-body>
        </b-media>

        <sidebar-item
          :link="{
            name: '지도',
            path: '/maps',
            icon: 'ni ni-pin-3 text-orange',
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: '공지사항',
            path: '/tables',
            icon: 'ni ni-bullet-list-67 text-red',
          }"
        >
        </sidebar-item>

        <sidebar-item
          v-if="id != undefined"
          :link="{
            name: '회원 정보',
            path: '/profile',
            icon: 'ni ni-single-02 text-yellow',
          }"
        >
        </sidebar-item>

        <!-- 로그인 되지 않았으면 로그인 버튼 표시 -->
        <sidebar-item
          v-if="id == undefined"
          :link="{
            name: '로그인',
            path: '/login',
            icon: 'ni ni-key-25 text-info',
          }"
        >
        </sidebar-item>

        <!-- 로그인 되지 않았으면 회원가입 버튼 표시 -->
        <sidebar-item
          v-if="id == undefined"
          :link="{
            name: '회원가입',
            path: '/register',
            icon: 'ni ni-circle-08 text-pink',
          }"
        >
        </sidebar-item>

        <!-- 로그인 되었으면 로그아웃 버튼 표시 -->
        <div @click="logout">
          <sidebar-item
            v-if="id != undefined"
            :link="{
              name: '로그아웃',
              path: '/',
              icon: 'ni ni-circle-08 text-pink',
              beforeEnter: (to, from, next) => {
                alert('beforeEnter');
              },
            }"
          >
          </sidebar-item>
        </div>

        <div @click="disconn">
          <sidebar-item
            v-if="isKakao != undefined"
            :link="{
              name: '카카오 연결끊기',
              path: '/',
              icon: 'ni ni-circle-08 text-pink',
              beforeEnter: (to, from, next) => {
                alert('beforeEnter');
              },
            }"
          >
          </sidebar-item>
        </div>

        <!-- 관리자가 로그인(유저 코드가 0이면) 관리자 버튼 표시-->
        <div @click="admin">
          <sidebar-item
            v-if="id != undefined && code == 0"
            :link="{
              name: '관리자',
              path: '/admin',
              icon: 'ni ni-circle-08 text-pink',
              beforeEnter: (to, from, next) => {
                alert('beforeEnter');
              },
            }"
          >
          </sidebar-item>
        </div>
      </template>

      <!-- <template slot="links-after">
        <hr class="my-3" />
        <h6 class="navbar-heading p-0 text-muted">Documentation</h6>

        <b-nav class="navbar-nav mb-md-3">
          <b-nav-item
            href="https://www.creative-tim.com/learning-lab/bootstrap-vue/quick-start/argon-dashboard"
          >
            <i class="ni ni-spaceship"></i>
            <b-nav-text class="p-0">Getting started</b-nav-text>
          </b-nav-item>
          <b-nav-item
            href="https://www.creative-tim.com/learning-lab/bootstrap-vue/colors/argon-dashboard"
          >
            <i class="ni ni-palette"></i>
            <b-nav-text class="p-0">Foundation</b-nav-text>
          </b-nav-item>
          <b-nav-item
            href="https://www.creative-tim.com/learning-lab/bootstrap-vue/avatar/argon-dashboard"
          >
            <i class="ni ni-ui-04"></i>
            <b-nav-text class="p-0">Components</b-nav-text>
          </b-nav-item>
        </b-nav>
      </template> -->
    </side-bar>
    <div class="main-content">
      <!-- <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar> -->

      <div @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-new */
import http from "@/api/http";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import { FadeTransition } from "vue2-transitions";

export default {
  data() {
    return {
      // log_session: this.$cookies.isKey("loggedin"),
      //log_session: this.$session.isKey("loggedin"),
      // id: this.$cookies.get("loggedin"),
      // id: this.$session.get("loggedin"),
      id: sessionStorage.getItem("id"),
      code: sessionStorage.getItem("code"),
      src: "",
      isKakao: sessionStorage.getItem("JWT_refresh_token"),
    };
  },
  components: {
    DashboardNavbar,
    ContentFooter,
    DashboardContent,
    FadeTransition,
  },
  created() {
    if (this.isKakao != undefined) {
      this.src =
        "https://user-images.githubusercontent.com/103018534/207497876-701fc0f0-c68e-4a18-b337-2a20e9164482.png";
    } else if ("admin@admin.com" == this.id) {
      this.src =
        "https://user-images.githubusercontent.com/62598865/203680461-20dabb58-7199-4bbb-9e2a-58e278da0511.png";
    } else {
      this.src =
        "https://user-images.githubusercontent.com/62598865/203680458-423b4c1b-9dac-4d91-9b89-85b7451c070f.jpg";
    }
  },
  methods: {
    initScrollbar() {
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        initScrollbar("sidenav");
      }
    },
    logout() {
      if (sessionStorage.getItem("JWT_refresh_token") != undefined) {
        http.post("member/kakaoLogout", null, {
          params: {
            access_token: sessionStorage.getItem("Kakao_access_token"),
            id: sessionStorage.getItem("id"),
          },
        });
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("code");
        sessionStorage.removeItem("JWT_access_token");
        sessionStorage.removeItem("JWT_refresh_token");
        sessionStorage.removeItem("Kakao_access_token");
        alert("로그아웃 완료\n새로고침합니다.");
        location.reload();
      } else {
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("code");
        alert("로그아웃 완료\n새로고침합니다.");
        http.post("member/logout", null, {
          params: {},
        });
        location.reload();
      }
    },
    admin() {},
    disconn() {
      http
        .post("member/disconnect", null, {
          params: {
            access_token: sessionStorage.getItem("Kakao_access_token"),
            id: sessionStorage.getItem("id"),
          },
        })
        .then((res) => {
          this.logout();
        });
    },
  },
  mounted() {
    this.initScrollbar();
  },
};
</script>
<style lang="scss"></style>
