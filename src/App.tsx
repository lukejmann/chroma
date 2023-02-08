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

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 70px 16px 0px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 4rem 8px 16px 8px;
  `};
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
              <Route exact strict path="/" component={Home} />
            </Switch>
          </Suspense>
          <Marginer />
          <TopBar></TopBar>
        </BodyWrapper>
      </AppWrapper>
    </ErrorBoundary>
  );
}
