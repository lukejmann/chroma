// import Header from "components/Header";
// import Loader from "components/Loader";
// import TopBar from "components/TopBar";
import { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components/macro";

import ErrorBoundary from "./components/ErrorBoundary";
import DarkModeQueryParamReader from "./theme/DarkModeQueryParamReader";
import Home from "./pages/Home";
import Header from "./components/Header";
import Loader from "./components/Loader";
import TopBar from "./components/TopBar";
import CanvasMain from "pages/Home/Three";

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const BodyWrapper = styled.div`
  position: absolute;

  width: 100%;
  height: 100%;
  padding: 0px 0px 0px 0px;
  align-items: center;
  flex: 1;
  z-index: 1;

  // ${({ theme }) => theme.mediaWidth.upToSmall`
  //   padding: 4rem 8px 16px 8px;
  // `};
`;

const Marginer = styled.div`
  margin-top: 5rem;
`;

export default function App() {
  return (
    <ErrorBoundary>
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        {/* <HeaderWrapper> */}
        <Header />
        {/* </HeaderWrapper> */}
        <BodyWrapper>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route exact strict path="/" component={CanvasMain} />
            </Switch>
          </Suspense>
          {/* <Marginer /> */}
          {/* <TopBar></TopBar> */}
        </BodyWrapper>
      </AppWrapper>
    </ErrorBoundary>
  );
}
