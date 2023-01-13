<template>
  <div></div>
</template>

<script>
// 아래와 같이 로그인 했을 때 로그인이 성공하도록 확인하기 위한 변수(DB 대용)
import http from "@/api/http";
import axios from "axios";

export default {
  name: "login",
  data() {
    return {
      code: "",
      codes: "",
      user_email: "",
      user_nickname: "",
      JWT_access_token: "",
      JWT_refresh_token: "",
      Kakao_access_token: "",
      Kakao_refresh_token: "",
    };
  },
  methods: {
    // 인가코드를 보내서 access-token, refresh-token, email, nickname 가져오기
    getToken() {
      http
        .post("member/getToken", null, {
          params: {
            codes: this.codes,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.user_email = res.data.email;
          this.user_nickname = res.data.nickname;
          this.JWT_access_token = res.data.JWT_access_token;
          this.JWT_refresh_token = res.data.JWT_refresh_token;
          this.Kakao_access_token = res.data.Kakao_access_token;
          this.Kakao_refresh_token = res.data.Kakao_refresh_token;
          this.code = res.data.code;
          //   alert(this.user_email + " ::::: " + this.user_nickname);
          sessionStorage.setItem("code", this.code);
          sessionStorage.setItem("id", this.user_email);
          sessionStorage.setItem("JWT_access_token", this.JWT_access_token);
          sessionStorage.setItem("JWT_refresh_token", this.JWT_refresh_token);
          sessionStorage.setItem("Kakao_access_token", this.Kakao_access_token);
          sessionStorage.setItem(
            "Kakao_refresh_token",
            this.Kakao_refresh_token
          );

          this.$router.push({ name: "maps" }).catch(() => {});
        });
    },
  },
  created() {
    this.codes = this.$route.query.code;
    this.getToken();
  },
};
</script>
