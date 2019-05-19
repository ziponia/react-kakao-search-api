import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";

const Client = props => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/search/:keyword" component={App} />
        <Route exact path="/" component={App} />
      </Switch>
    </BrowserRouter>
  );
};

export default Client;
