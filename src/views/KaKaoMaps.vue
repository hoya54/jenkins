<template>
  <div>
    <div id="mapContainer" class="p-0 m-0">
      <b-container fluid id="map" class="map-canvas" style="height: 1200px">
        <b-row id="detailContainer">
          <b-sidebar v-model="isSidebarOpen" style="width: 600px" right shadow>
            <div>
              <b-button size="sm" @click="closeSideBar">Close</b-button>
            </div>

          </b-sidebar>
        </b-row>

        <b-row id="buttons">
          
          <b-button type="success" @click="findAddress">스프링에 요청 전송4</b-button>
          <div id="location_select">
          </div>
        </b-row>
      </b-container>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import http from "@/api/http";
import HouseListItem from "@/components/House/HouseListItem";

export default {
  name: "KakaoMap",
  components: {
    HouseListItem,
  },
  data() {
    return {
      markerPositions: [],
      markerImjangs: [],
      marker: Object,
      house: Object,
      isColor: true,
      isSidebarOpen: false,
      selected_house: Object,
      selected_imjang: Object,
      selected_imjang_btn: false,
      selected_house_btn: false,

      myCode: null,

      selected_sido: "시도 선택",
      selected_gugun: "구군 선택",
      selected_dong: "동 선택",
      sidos: [{value: null, sidoName:"시도 선택"}],
      guguns: [{ value: null, gugunName: "구군 선택" }],
      dongs: [{ value: null, dongName: "동 선택" }],

      houseinfos: [],
      housedeals: [],

      imjanginfos: [],

      markers: [],
      markers_imjang: [],
      infowindow: null,
      geocoder: null,

      imjang_title: null,
      min_people: null,
      max_people: null,
      gather_date: null,
      imjang_sido: null,
      imjang_gugun: null,
      imjang_dong: null,
      captcha_url: String,

      minP: [
        { value: null, text: "최소인원" },
        { value: 1, text: 1 },
        { value: 2, text: 2 },
        { value: 3, text: 3 },
        { value: 4, text: 4 },
        { value: 5, text: 5 },
        { value: 6, text: 6 },
        { value: 7, text: 7 },
        { value: 8, text: 8 },
        { value: 9, text: 9 },
        { value: 10, text: 10 },
      ],
      maxP: [{ value: null, text: "최대인원" }],
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=0752958a730458f6ca6dedd9bc8b93b5&libraries=services&autoload=false";
      // "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=0752958a730458f6ca6dedd9bc8b93b5";
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 5,
      };

      //지도 객체를 등록합니다.
      //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
      this.map = new kakao.maps.Map(container, options);
      // 주소-좌표 변환 객체를 생성합니다
      this.geocoder = new kakao.maps.services.Geocoder();
    },
    changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      this.map.relayout();
    },
    displayMarker() {
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = this.markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      const positionsImjang = this.markerImjangs.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      // 매물 마커 생성하기
      if (positions.length > 0) {
        this.markers = positions.map((position, index) => {
          const marker = new kakao.maps.Marker({
            map: this.map,
            position,
          });
          kakao.maps.event.addListener(marker, "click", () => {
            // 마커를 클릭했을때 sidebar가 나오도록한다.
            this.selected_imjang_btn = false;
            this.selected_house_btn = true;
            this.marker = this.houseinfos[index];
            this.openSidebar();
            this.search_deals(this.marker.aptCode);
          });
          return marker;
        });
      }

      if (positionsImjang.length > 0) {
        var imageSrc =
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 마커이미지의 주소입니다
          imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
          imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        this.markers_imjang = positionsImjang.map((position, index) => {
          const marker = new kakao.maps.Marker({
            map: this.map,
            position,
            image: markerImage,
          });

          kakao.maps.event.addListener(marker, "click", () => {
            // 마커를 클릭했을때 sidebar가 나오도록한다.
            this.selected_imjang_btn = false;
            this.selected_house_btn = false;
            this.selected_imjang = this.imjanginfos[index];
            this.openSidebar();
            // this.search_imjang(this.marker.aptCode);
          });
          return marker;
        });
      }
      const bounds = positions.reduce(
        (bounds, latlng) => bounds.extend(latlng),
        new kakao.maps.LatLngBounds()
      );
      this.map.setBounds(bounds);
    },
    displayInfoWindow() {
      if (this.infowindow && this.infowindow.getMap()) {
        //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
        this.map.setCenter(this.infowindow.getPosition());
        return;
      }

      var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
      });

      this.map.setCenter(iwPosition);
    },
    findAddress() {
      http.get("connect").then(({ data }) => {
      alert(data.name);
    });
    },
    search_deals(aptcode) {
      http
        .get("map/housedeal", { params: { aptCode: aptcode } })
        .then(({ data }) => {
          console.log("housedeal", data.list);
          this.housedeals = data.list;
        });
    },
    makeMarkerPositions() {
      this.houseinfos.forEach((element) => {
        this.markerPositions.push([element.lat, element.lng]);
      });

      console.log(this.markerImjangs);
      this.imjanginfos.forEach((element) => {
        console.log(element);
        this.markerImjangs.push([element.latitude, element.longitude]);
        // this.markerPositionsImjang.push([element.latitude, element.longitude]);
      });

      this.displayMarker();
    },
    openSidebar() {
      if (this.isSidebarOpen == false) {
        this.isSidebarOpen = true;
      }
    },
    closeSideBar() {
      if (this.isSidebarOpen == true) {
        this.isSidebarOpen = false;
      }
    },
    selectHouse(house) {
      console.log("here", house);
      this.selected_house = house;
    },
    showImjang() {
      this.selected_imjang_btn = true;
      this.openSidebar();
    },
    searchDetailAddrFromCoords(coords, callback) {
      // 좌표로 법정동 상세 주소 정보를 요청합니다
      this.geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    },
    selectPlace() {
      alert("지도에서 위치를 선택해주세요");
      var map = this.map;
      // // 지도를 클릭한 위치에 표출할 마커입니다
      var imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      var markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      var marker = new kakao.maps.Marker({
        // 지도 중심좌표에 마커를 생성합니다
        position: map.getCenter(),
        image: markerImage,
      });

      // 지도에 마커를 표시합니다
      marker.setMap(map);

      // 지도에 클릭 이벤트를 등록합니다
      // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
      var tt = "";
      kakao.maps.event.addListener(map, "click", (mouseEvent) => {
        // 클릭한 위도, 경도 정보를 가져옵니다
        var latlng = mouseEvent.latLng;

        // 마커 위치를 클릭한 위치로 옮깁니다
        marker.setPosition(latlng);
        localStorage.setItem("lat", latlng.getLat());
        localStorage.setItem("lng", latlng.getLng());
        console.log(latlng);

        // 위도 경도를 바탕으로 시동구군 얻어오기
        this.searchDetailAddrFromCoords(latlng, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            // console.log(result);
            var detailAddr = result[0].address.address_name.split(" ");
            var roadAddr = result[0].road_address.address_name.split(" ");
            console.log(detailAddr, roadAddr);
            this.imjang_sido = roadAddr[0];
            this.imjang_gugun = detailAddr[1];
            this.imjang_dong = detailAddr[2];
          }
        });

        // var message = "클릭한 위치의 위도는 " + latlng.getLat() + " 이고, ";
        // message += "경도는 " + latlng.getLng() + " 입니다";

        // var resultDiv = document.getElementById("clickLatlng");
        // resultDiv.innerHTML = message;
      });
    },
    regist_imjang() {
      http
        .post("map/writeImjang", null, {
          params: {
            title: this.imjang_title,
            min_people: this.min_people,
            max_people: this.max_people,
            date: this.gather_date,
            latitude: localStorage.getItem("lat"),
            longitude: localStorage.getItem("lng"),
            sido: this.imjang_sido,
            gugun: this.imjang_gugun,
            dong: this.imjang_dong,
          },
        })
        .catch();
      alert("임장 모임 등록 완료");
      this.$router.go();
    },
    joinImjang() {
      if (this.selected_imjang.max_people > this.selected_imjang.cur_people) {
        http
          .post("map/joinImjang", null, {
            params: {
              site_gathering_code: this.selected_imjang.code,
            },
          })
          .then(({ data }) => {
            if (data == -1) {
              alert("이미 신청한 모임입니다.");
            } else {
              alert("모임 신청 완료!");
              this.isSidebarOpen = false;
            }
          });
      } else {
        alert("인원 초과!");
      }
    },
  },
  created() {
    // alert("create 시작");
    
  },
};
</script>
<style>
.b-sidebar {
  width: 600px !important;
  height: 100%;
}
#mapContainer {
  position: relative;
}
#buttons {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  z-index: 3;
}
#detailContainer {
  position: absolute;
  padding: 5px;
  z-index: 4;
}
.mouse-over-bgcolor {
  background-color: lightblue;
}
</style>
