import axios from "axios";

const Kakao = axios.create({
  baseURL: "https://dapi.kakao.com", // 공통 요청 경로를 지정해준다.
  headers: {
    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_KEY}` // 공통으로 요청 할 헤더
  }
});

// search blog api
export const blogSearch = params => {
  return Kakao.get("/v2/search/blog", { params });
};
