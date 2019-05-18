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
