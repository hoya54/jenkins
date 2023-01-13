import DashboardLayout from "@/views/Layout/DashboardLayout.vue";
import AuthLayout from "@/views/Pages/AuthLayout.vue";

import NotFound from "@/views/NotFoundPage.vue";
import http from "@/api/http";

const onlyAuthUser = async (to, from, next) => {
  let access_token = sessionStorage.getItem("JWT_access_token");
  let refresh_token = sessionStorage.getItem("JWT_refresh_token");
  let id = sessionStorage.getItem("id");

  // 카카오로그인일 경우
  // 토큰을 사용해서 로그인을 유지한다
  if (id != null && access_token) {
    console.log("토큰 유효성 체크");
    http
      .post("member/checkToken", null, {
        params: {
          access_token: access_token,
          id: id,
        },
      })
      .then((res) => {
        console.log("로그인 확인 완료");
        next();
      })
      .catch((err) => {
        console.log("토큰 재발급 필요");
        http
          .post("member/refresh", null, {
            params: {
              refresh_token: refresh_token,
              id: id,
            },
          })
          .then((res) => {
            // access Token이 만료 됐을때 acesst Token을 갱신한다.
            // console.log(res.data["access-token"]);
            sessionStorage.setItem(
              "JWT_access_token",
              res.data["access-token"]
            );
            next();
          })
          .catch((err) => {
            // refresh Token도 만료 됐을때 다시로그인 필요
            // 로그아웃 하고 다시 로그인하도록 한다
            console.log("refreshToken 만료 다시 로그인 필요");
            http.post("member/kakaoLogout", null, {
              params: {
                access_token: access_token,
                id: sessionStorage.getItem("id"),
              },
            });
            sessionStorage.removeItem("id");
            sessionStorage.removeItem("code");
            sessionStorage.removeItem("JWT_access_token");
            sessionStorage.removeItem("JWT_refresh_token");
            sessionStorage.removeItem("Kakao_access_token");
            alert("세션이 완료 되었습니다\n 다시 로그인 해주세요");
            window.location.replace("/error2");
          });
      });
  } else {
    // Session 로그인을 한상태
    next();
  }
};

const routes = [
  {
    // 메인페이지에서 바로 지도가 보여지도록 처리
    path: "/",
    redirect: "maps",
    component: DashboardLayout,
    children: [
      {
        path: "/maps",
        name: "maps",
        component: () => import("../views/KaKaoMaps.vue"),
      },
      {
        path: "/admin",
        name: "admin",
        component: () => import("../views/AdminPage.vue"),
        redirect: "/admin/admin_list",
        children: [
          {
            path: "admin_list",
            name: "admin_list",
            component: () => import("@/views/Admin/AdminList.vue"),
          },
          {
            path: "member_modify",
            name: "member_modify",
            component: () => import("@/views/Admin/MemberModify.vue"),
          },
          {
            path: "board_modify",
            name: "board_modify",
            component: () => import("@/views/Admin/BoardModify.vue"),
          },
          {
            path: "imjang_modify",
            name: "imjang_modify",
            component: () => import("@/views/Admin/ImjangModify.vue"),
          },
        ],
      },
      {
        path: "/icons",
        name: "icons",
        component: () => import("../views/Icons.vue"),
      },
      {
        path: "/profile",
        name: "profile",
        component: () => import("../views/Pages/UserProfile.vue"),
        redirect: "/profile/profile_detail",
        children: [
          {
            path: "profile_detail",
            name: "profile_detail",
            component: () =>
              import("@/views/Pages/UserProfile/DetailProfile.vue"),
          },
          {
            path: "profile_modify",
            name: "profile_modify",
            component: () =>
              import("@/views/Pages/UserProfile/EditProfileForm.vue"),
          },
        ],
      },
      // {
      //   path: "/maps",
      //   name: "maps",
      //   component: () =>
      //     import(/* webpackChunkName: "demo" */ "../views/GoogleMaps.vue"),
      // },
      {
        path: "/tables",
        name: "tables",
        beforeEnter: onlyAuthUser,
        component: () => import("@/views/RegularTables.vue"),
        redirect: "/tables/list",
        children: [
          {
            path: "list",
            name: "list",
            component: () =>
              import("@/views/Tables/RegularTables/BoardTable.vue"),
          },
          {
            path: "write",
            name: "write",
            component: () =>
              import("@/views/Tables/RegularTables/BoardWrite.vue"),
          },
          {
            path: "detail",
            name: "detail",
            component: () =>
              import("@/views/Tables/RegularTables/BoardDetail.vue"),
          },
          {
            path: "modify",
            name: "modify",
            component: () =>
              import("@/views/Tables/RegularTables/BoardModify.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "kakao_redirect",
    redirect: "kakao_redirect",
    component: AuthLayout,
    children: [
      {
        path: "/kakao_redirect",
        name: "kakao_redirect",
        component: () => import("../views/Pages/KakaoLogin.vue"),
      },
    ],
  },
  {
    path: "/",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/Pages/Login.vue"),
      },
      {
        path: "/register",
        name: "register",
        component: () => import("../views/Pages/Register.vue"),
      },
      {
        path: "/error1",
        name: "error1",
        component: () => import("../views/ErrorPage1.vue"),
      },
      {
        path: "/error2",
        name: "error2",
        component: () => import("../views/ErrorPage2.vue"),
      },
      {
        path: "/error3",
        name: "error3",
        component: () => import("../views/ErrorPage3.vue"),
      },
      { path: "*", name: "error4", component: NotFound },
    ],
  },
];

export default routes;
