import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.2.0";
import "assets/demo/demo.css";

import Home from "views/examples/Home.js";

ReactDOM.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Switch>
      <Route
        path="/"
        render={(props) => <Home {...props} />}
      />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
