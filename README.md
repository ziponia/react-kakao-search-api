---
layout: post
title: "[리액트] API 사용하기"
summary: "Kakao API 를 활용해서 블로그 서비스를 만들어 보자"
tags: [react]
---

source: [https://github.com/ziponia/react-kakao-search-api](https://github.com/ziponia/react-kakao-search-api)

리액트에서, 카카오 검색 API 를 활용하여 블로그를 검색해주는 사이트를 만들어 보자.

먼저 리액트 프로젝트를 만든다.

```
$ create-react-app my-search-service
```

다음엔, http 통신을 할 수 있도록, [axios](https://github.com/axios/axios) 라이브러리를 설치하자.

```
$ yarn add axios
```

> 만약에 yarn 이 없다면, `npm install -g yarn` 으로 먼저 설치 해야한다.

우리는 카카오가 만들어 둔, [검색 API](https://developers.kakao.com/docs/restapi/search) 를 사용 할것이다.

카카오로 가서 KEY 앱을 등록하고, rest api key 를 적어두자.

이제 준비가 끝났으니, App.js 에다 먼저 기본적인 틀을 만들어 주겠다.

_App.js_

```jsx
import React from "react";
import "./App.css";

const App = props => {
  return (
    <div className="container">
      <input
        type="search"
        placeholder="검색어를 입력 하세요..."
        name="query"
        className="input_search"
      />
    </div>
  );
};

export default App;
```

다음으로 [해당 문서](https://developers.kakao.com/docs/restapi/search#%EB%B8%94%EB%A1%9C%EA%B7%B8-%EA%B2%80%EC%83%89) 에서 보면

request 로 https://dapi.kakao.com/v2/search/blog 로 요청하고 header 로 키를 전달하라고 되어있다.

그대로 axios 로 구현하자.

_src/api.js_

```jsx
import axios from "axios";

const Kakao = axios.create({
  baseURL: "https://dapi.kakao.com", // 공통 요청 경로를 지정해준다.
  headers: {
    Authorization: "KakaoAK {kakao rest api key}" // 공통으로 요청 할 헤더
  }
});

// search blog api
export const blogSearch = params => {
  return Kakao.get("/v2/search/blog", { params });
};
```

{kakao rest api key} 에 자신이 카카오 에서 발급 받은, API 키를 넣어주면 된다.

이제 App.js 에 가서 api 를 호출 해보자.

```jsx
import React, { useEffect } from "react";
import { blogSearch } from "./api";

import "./App.css";

const App = props => {
  useEffect(() => {
    blogSearchHttpHandler(); // 컴포넌트 마운트 후에, 함수를 호출한다.
  }, []);

  // blog search 핸들러
  const blogSearchHttpHandler = async () => {
    // paramter 설정
    const params = {
      query: "어밴져스",
      sort: "accuracy", // accuracy | recency 정확도 or 최신
      page: 1, // 페이지번호
      size: 10 // 한 페이지에 보여 질 문서의 개수
    };

    const { data } = await blogSearch(params); // api 호출
    console.log(data); // 결과 호출
  };

  return (
    <div className="container">
      <input
        type="search"
        placeholder="검색어를 입력 하세요..."
        name="query"
        className="input_search"
      />
    </div>
  );
};

export default App;
```

이제 콘솔을 확인 해 보면, 잘 가져오는것을 볼 수 있다.

![api call 1](https://s3.ap-northeast-2.amazonaws.com/ziponia.github.io/2019-5-19/kakao_blog_api_example_1.png)

이제 리스팅 해주는 컴포넌트를 만들어 주자.

_src/Item.js_

```jsx
import React from "react";

const Item = props => {
  return (
    <li>
      <dl>
        <dt>
          <img src={props.thumbnail} alt={props.thumbnail} />
        </dt>
        <dd>
          <h3>{props.title}</h3>
          <p>{props.blogname}</p>
          <article>{props.contents}</article>
          <a href={props.url}>링크 바로가기</a>
        </dd>
      </dl>
    </li>
  );
};

export default Item;
```

각각 props 로 내용을 받아와서 연결 시켜 줄것이다.

이제 App.js 로 돌아와서, 이벤트들을 연결 해보자.

- 검색창에서 검색어를 입력한다.
- 엔터를 누른다.
- 리스트가 나온다.

이 순서대로 해보자.

먼저 기초데이터 state , 검색어 state, 쿼리 state 를 생성 해주자.

```jsx
const [blogs, setBlogs] = useState([]);
const [text, setText] = useState("");
const [query, setQuery] = useState("");
```

다음으로, text 업데이트 함수, 엔터키 이벤트 함수 를 만들어주자.

```javascript
// 엔터를 눌렀을 때 호출 되는 함수
const onEnter = e => {};

// text 검색어가 바뀔 때 호출되는 함수.
const onTextUpdate = e => {};
```

그럼 나는, `query` state 가 업데이트 하면 api 를 호출 할 것이다.

```javascript
useEffect(() => {
  if (query.length > 0) {
    blogSearchHttpHandler(query, true);
  }
}, [query]);
```

blogSearchHttpHandler 함수의 인자값으로, 첫번째는, 변경 된 query state 이고, 두번째는, 리스트를 초기화 한 후 다시 랜더링 할껀지 여부이다.

다음, input 엘리먼트에다, 이벤트를 연결하자.

```jsx
<input
  type="search"
  placeholder="검색어를 입력 하세요..."
  name="query"
  className="input_search"
  onKeyDown={onEnter} // enter
  onChange={onTextUpdate} // change
  value={text} // view
/>
```

그리고, onTextUpdate 가 호출 될 때, text state 를 변경 해주자.

```jsx
// text 검색어가 바뀔 때 호출되는 함수.
const onTextUpdate = e => {
  setText(e.target.value);
};
```

다음으로, enter 를 눌렀을 때, query state 를 text state 로 교체 해주자.

```jsx
// 엔터를 눌렀을 때 호출 되는 함수
const onEnter = e => {
  if (e.keyCode === 13) {
    setQuery(text);
  }
};
```

이제, blogSearchHttpHandler 에서, api 를 호출 한후, 호출 한 데이터와, 현재 blogs state 를 병합 해 주자.

```jsx
const blogSearchHttpHandler = async (query, reset) => {
  const params = {
    query: query,
    sort: "accuracy", // accuracy | recency 정확도 or 최신
    page: 1, // 페이지번호
    size: 10 // 한 페이지에 보여 질 문서의 개수
  };

  const { data } = await blogSearch(params);
  if (reset) {
    setBlogs(data.documents);
  } else {
    setBlogs(blogs.concat(data.documents));
  }
};
```

그 다음, 우리가 아까 만들어 둔 컴포넌트를 랜더링 해 주면 된다.

```jsx
return (
  <div className="container">
    <input
      type="search"
      placeholder="검색어를 입력 하세요..."
      name="query"
      className="input_search"
      onKeyDown={onEnter} // enter
      onChange={onTextUpdate} // change
      value={text} // view
    />

    <ul>
      {blogs.map((blog, index) => (
        <Item
          key={index}
          thumbnail={blog.thumbnail}
          title={blog.title}
          blogname={blog.blogname}
          contents={blog.contents}
          url={blog.url}
        />
      ))}
    </ul>
  </div>
);
```

결과적으론 이런 소스가 된다.

```jsx
import React, { useEffect, useState } from "react";
import { blogSearch } from "./api";

import "./App.css";
import Item from "./Item";

const App = props => {
  const [blogs, setBlogs] = useState([]);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.length > 0) {
      blogSearchHttpHandler(query, true);
    }
  }, [query]);

  // 엔터를 눌렀을 때 호출 되는 함수
  const onEnter = e => {
    if (e.keyCode === 13) {
      setQuery(text);
    }
  };

  // text 검색어가 바뀔 때 호출되는 함수.
  const onTextUpdate = e => {
    setText(e.target.value);
  };

  const blogSearchHttpHandler = async (query, reset) => {
    const params = {
      query: query,
      sort: "accuracy", // accuracy | recency 정확도 or 최신
      page: 1, // 페이지번호
      size: 10 // 한 페이지에 보여 질 문서의 개수
    };

    const { data } = await blogSearch(params);
    if (reset) {
      setBlogs(data.documents);
    } else {
      setBlogs(blogs.concat(data.documents));
    }
  };

  return (
    <div className="container">
      <input
        type="search"
        placeholder="검색어를 입력 하세요..."
        name="query"
        className="input_search"
        onKeyDown={onEnter} // enter
        onChange={onTextUpdate} // change
        value={text} // view
      />

      <ul>
        {blogs.map((blog, index) => (
          <Item
            key={index}
            thumbnail={blog.thumbnail}
            title={blog.title}
            blogname={blog.blogname}
            contents={blog.contents}
            url={blog.url}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
```

마지막으로, 아주 살짝만 App.css 를 바꾸어 주면 그럴싸한, 블로그 검색 사이트가 나온다..

아래 코드를 복붙하자.

_App.css_

```css
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap");

* {
  font-family: "Noto Sans KR", sans-serif;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  height: 100%;
}

.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
}

.input_search {
  font-family: "Noto Sans KR", sans-serif;
  font-size: 18px;
  border: 0;
  border-bottom: 1px solid #dddddd;
  width: 600px;
  padding: 20px;
  display: block;
  transition: border 0.3s;
}

.input_search:focus {
  outline: none;
  border-bottom: 1px solid #0675f3;
}

ul {
  display: grid;
  padding: 20px;
  width: 1100px;
  margin: auto;
  grid-gap: 10px;
  grid-template-columns: repeat(3, 1fr);
}

li {
  list-style-type: none;
  border: 1px solid #dddddd;
  padding: 20px;
}

li dl {
  display: flex;
  flex-direction: column;
}

li dl dt {
  height: 200px;
}

li dl dt img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

li dl dd {
  flex: 1;
}
```

최종 결과

![이미지](https://s3.ap-northeast-2.amazonaws.com/ziponia.github.io/2019-5-19/kakao_blog_api_example_result.png)

_마무리_

사실 욕심같아선, 스크롤 이벤트와, 트랜지션 까지 하려고 했는데

벌써 시간이 오전 3시반이라 다음으로 미뤄야 할것 같다...
