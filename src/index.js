import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { App } from "App";
import reportWebVitals from "reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";
import ReactGA from "react-ga4";
import store from "store";

ReactGA.initialize("G-25FKX9WYJG");

ReactDOM.render(
  <Auth0Provider
    domain="dev--a9elj87.us.auth0.com"
    clientId="VgjPp8ZToYg4rKiatitaxVXUAJAhTotw"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </Auth0Provider>,
  document.getElementById("root")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
