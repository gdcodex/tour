import React, { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LandingPage from "./landing/landing";
import Users from "./user/pages/userss";
import Newplace from "./places/pages/newplace";
import Userplaces from "./places/pages/userplaces";
import Mainnavigation from "./shared/components/Navigation/mainnavigation";
import Updateplace from "./places/pages/updateplace";
import Newstory from './stories/newstory';
import Auth from "./user/pages/authhh";
import { AuthContext } from "./shared/context/auth-context";

import ErrorModal from "./shared/components/UIElements/ErrorModal";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { useHttp } from "./shared/hooks/http-hook";
import Storyview from "./stories/storyview";

function App() {
  const [token, settoken] = useState(null);
  const [userId, setuserId] = useState(null);
  const [tokenExpiration, settokenExpiration] = useState(null);
  const [loadedUsers, setloadedUsers] = useState(false);
  const { isLoading, isError, resetError, sendRequest } = useHttp();

  useEffect(() => {
    sendRequest(process.env.REACT_APP_BACKEND_URL + "/users")
      .then((data) => {
        setloadedUsers(data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sendRequest]);

  const login = useCallback((uid, token) => {
    settoken(token);
    setuserId(uid);
    let tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);
    localStorage.setItem(
      "data",
      JSON.stringify({ token, uid, tokenExpiration: tokenExpirationDate })
    );
    settokenExpiration(tokenExpirationDate);
  }, []);

  const logout = useCallback(() => {
    settoken(null);
    setuserId(null);
    settokenExpiration(null);
    localStorage.removeItem("data");
  }, []);
  // so that login state is not lost on refresh
  useEffect(() => {
    const reslocal = JSON.parse(localStorage.getItem("data"));
    if (reslocal && reslocal.token) {
      settoken(reslocal.token);
      setuserId(reslocal.uid);
      settokenExpiration(new Date(reslocal.tokenExpiration));
    }
  }, []);
  useEffect(() => {
    if (token && tokenExpiration) {
      setTimeout(logout, tokenExpiration.getTime() - new Date().getTime());
    } else {
      clearTimeout();
    }
  }, [token, logout, tokenExpiration]);
  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact component={Users} />
        <Route path="/:userId/places" exact component={Userplaces} />
        <Route path="/places/new" exact component={Newplace} />
        <Route path="/story/new" exact component={Newstory} />
        <Route path="/stories/user/:userId" exact component={Storyview} />
        <Route path="/places/:placeId" exact component={Updateplace} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <>
        <Switch>
          <Route
            path="/"
            exact
            component={Users}
          />
          <Route path="/:userId/places" component={Userplaces} />
          <Route path="/stories/user/:userId" exact component={Storyview} />
          <Route path="/auth" exact component={Auth} />
          <Redirect to="/auth" />
        </Switch>
      </>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {isError && (
        <ErrorModal
          error={isError}
          header="An Error Occurred"
          onClear={resetError}
        />
      )}

      {loadedUsers && (
        <AuthContext.Provider
          value={{
            isLoggedIn: !!token,
            token,
            login,
            logout,
            userId,
            loadedUsers,
          }}
        >
          <Router>
            <LandingPage />
            <Mainnavigation />
            <main>{routes}</main>
          </Router>
        </AuthContext.Provider>
      )}
    </>
  );
}

export default App;
