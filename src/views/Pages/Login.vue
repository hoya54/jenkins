<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <!-- <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h1 class="text-white">Welcome!</h1>
              <p class="text-lead text-white">
                Use these awesome forms to login or create new account in your
                project for free.
              </p>
            </b-col>
          </b-row>
        </div>
      </b-container> -->
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            class="fill-default"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <b-container class="mt--8 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7">
          <b-card no-body class="bg-secondary border-0 mb-0">
            <!-- <b-card-header class="bg-transparent pb-5">
              <div class="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div class="btn-wrapper text-center">
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"
                    ><img src="img/icons/common/github.svg"
                  /></span>
                  <span class="btn-inner--text">Github</span>
                </a>
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"
                    ><img src="img/icons/common/google.svg"
                  /></span>
                  <span class="btn-inner--text">Google</span>
                </a>
              </div>
            </b-card-header> -->
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>?????????</small>
              </div>
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <b-form role="form" @submit.prevent="handleSubmit(login)">
                  <base-input
                    alternative
                    class="mb-3"
                    name="Email"
                    :rules="{ required: true, email: true }"
                    prepend-icon="ni ni-email-83"
                    placeholder="???????????? ???????????????"
                    v-model="model.email"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    name="Password"
                    :rules="{ required: true, min: 6 }"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="??????????????? ???????????????"
                    v-model="model.password"
                  >
                  </base-input>

                  <b-form-checkbox v-model="model.rememberMe"
                    >????????? ??????</b-form-checkbox
                  >
                  <br />

                  <img :src="captcha_url" />
                  <b-button type="success" @click="captcha"> ????????????</b-button>
                  <base-input
                    alternative
                    class="mb-3"
                    name="Capcha"
                    :rules="{ required: true }"
                    prepend-icon="ni ni-key-25"
                    type="text"
                    placeholder="?????? ????????? ???????????????."
                    v-model="model.capcha_code"
                  >
                  </base-input>
                  <div class="text-center">
                    <base-button
                      type="primary"
                      native-type="submit"
                      class="my-4"
                      >?????????</base-button
                    >
                  </div>
                  <b-button v-on:click="kakaoLoginBtn"
                    ><img
                      src="https://user-images.githubusercontent.com/62598865/206984414-60df6ebc-0196-4bb6-84ff-e5135df33c98.png"
                  /></b-button>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
          <!-- <b-row class="mt-3">
            <b-col cols="6">
              <router-link to="/dashboard" class="text-light"
                ><small>Forgot password?</small></router-link
              >
            </b-col>
            <b-col cols="6" class="text-right">
              <router-link to="/register" class="text-light"
                ><small>Create new account</small></router-link
              >
            </b-col>
          </b-row> -->
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// ????????? ?????? ????????? ?????? ??? ???????????? ??????????????? ???????????? ?????? ??????(DB ??????)
import http from "@/api/http";
import axios from "axios";

const saved_model = {
  email: "edu@ssafy.com",
  password: "123123",
  rememberMe: false,
};
export default {
  name: "login",
  data() {
    return {
      model: {
        email: "",
        password: "",
        rememberMe: false,
        capcha_code: "",
      },
      captcha_url: String,
    };
  },
  methods: {
    // onSubmit() {
    //   if (
    //     saved_model.email == this.model.email &&
    //     saved_model.password == this.model.password
    //   ) {
    //     alert("????????? ??????\n??? ???????????? ???????????????.");
    //     this.$cookies.set("loggedin", this.model.email, "60");
    //     this.$router.push({ name: "maps" });
    //   } else {
    //     alert("????????? ??????\n????????? ??? ??????????????? ?????? ???????????????.");
    //   }
    //   // this will be called only after form is valid. You can do api call here to login
    // },
    login() {
      http
        .post("/member/checkCapcha", null, {
          params: {
            code: this.model.capcha_code,
          },
        })
        .then(({ data }) => {
          if (data["result"] == true) {
            http
              .post("member/login", null, {
                params: {
                  id: this.model.email,
                  pw: this.model.password,
                },
              })
              .then(({ data }) => {
                console.log(data);
                if (data.name != null) {
                  alert("????????? ??????\n??? ???????????? ???????????????.");
                  // this.$cookies.set("loggedin", this.model.email, "60");
                  // this.$session.set("loggedin", this.model.email, "60");
                  sessionStorage.setItem("code", data.code);
                  sessionStorage.setItem("id", data.id);
                  this.$router.push({ name: "maps" }).catch(() => {});
                } else {
                  alert("????????? ??????\n????????? ??? ??????????????? ?????? ???????????????.");
                }
              });
          } else {
            alert("???????????? ?????? ????????? ???????????????.");
            this.captcha();
          }
        })
        .catch((e) => {
          console.log(`error === ${e}`);
        });
    },
    captcha() {
      const config = {
        method: "GET",
        headers: {
          ContentType: "application/json",
        },
        responseType: "blob",
      };

      http
        .get("/member/getCapcha", config)
        .then((res) => {
          console.log(res.data);
          const url = window.URL.createObjectURL(
            new Blob([res.data], { type: res.headers["content-type"] })
          );
          console.log(url);
          this.captcha_url = url;
        })
        .catch((e) => {
          console.log(`error === ${e}`);
        });
    },
    kakaoLoginBtn() {
      window.location.replace(
        "https://kauth.kakao.com/oauth/authorize?client_id=fb278a95dec1e1249a12333c86d016d6&redirect_uri=http://43.200.171.157:9999/kakao_redirect&response_type=code"
      );
    },
  },
  created() {
    const config = {
      method: "GET",
      headers: {
        ContentType: "application/json",
      },
      responseType: "blob",
    };

    http
      .get("/member/getCapcha", config)
      .then((res) => {
        console.log(res.data);
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: res.headers["content-type"] })
        );
        console.log(url);
        this.captcha_url = url;
      })
      .catch((e) => {
        console.log(`error === ${e}`);
      });
  },
};
</script>
