import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Container from "./components/layouts/PageContainer";
import Footer from "./components/layouts/PageFooter";
import Header from "./components/layouts/PageHeader";
import "./components/styles/index.scss";
import Home from "pages/Home";
import Repository from "pages/Repository";
import Deploy from "pages/deploy/Deploy";
import Axios from "axios";

import Version from "pages/console/Version/Version";
import VersionDetail from "pages/console/Version/VersionDetail";
import SaveVersion from "pages/console/Version/SaveVersion";
import CompareVersion from "pages/console/Version/CompareVersion";
import Button from "components/Button";
import CertificationList from "pages/console/ssl-for-saas/CertificationList";
import CloudFront from "pages/monitor/CloudFrontMetrics";
import WAF from "pages/monitor/WAF";
import { AmplifyConfigType } from "assets/js/type";
import { AMPLIFY_CONFIG_JSON } from "assets/js/const";
import LoadingText from "components/LoadingText";
import { ActionType } from "reducer/appReducer";
import { useDispatch } from "react-redux";
import VersionDetailDisplay from "./pages/console/Version/VersionDetailDisplay";
import Snapshot from "./pages/console/Snapshot/Snapshot";
import SnapshotDetail from "./pages/console/Snapshot/SnapshotDetail";
import SaveSnapshot from "./pages/console/Snapshot/SaveSnapshot";
import SnapshotDetailDisplay from "./pages/console/Snapshot/SnapshotDetailDisplay";
import CompareSnapshot from "./pages/console/Snapshot/CompareSnapshot";

import { Amplify } from "aws-amplify";
import { Authenticator, Heading, useTheme } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import SSLJobList from "./pages/console/ssl-for-saas/SSLJobList";
import JobDetail from "./pages/console/ssl-for-saas/JobDetail";

import CreateGuide from "pages/console/ssl-for-saas/create/CreateGuide";
import ImportGuide from "pages/console/ssl-for-saas/import/ImportGuide";
import ImportStart from "pages/console/ssl-for-saas/import/ImportStart";
import CreateStart from "pages/console/ssl-for-saas/create/CreateStart";

const components = {
  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Sign in to your account
        </Heading>
      );
    },
  },
};

const SignInRouter: React.FC = () => {
  return (
    <>
      <Authenticator hideSignUp components={components}>
        {({ signOut, user }) => {
          return (
            <>
              <Header signOut={signOut} user={user} />
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Container disablePadding hideHelpPanel>
                        <Home />
                      </Container>
                    }
                  />
                  <Route
                    path="/extentions-repository"
                    element={
                      <Container>
                        <Repository />
                      </Container>
                    }
                  />
                  <Route
                    path="/extentions/deploy/:extName"
                    element={
                      <Container>
                        <Deploy />
                      </Container>
                    }
                  />
                  <Route
                    path="/extentions/deploy/:extName/:status"
                    element={
                      <Container>
                        <Deploy />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/version"
                    element={
                      <Container>
                        <Version />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/version/detail/:id"
                    element={
                      <Container>
                        <VersionDetail />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/version/detail/:id/:version/save/:note"
                    element={
                      <Container>
                        <SaveVersion />
                      </Container>
                    }
                  />
                  <Route
                    path="/config/version/detail/:id/:version/save"
                    element={
                      <Container>
                        <SaveVersion />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/version/detail/display/:id/:version"
                    element={
                      <Container>
                        <VersionDetailDisplay />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/version/detail/:id/compare/:ver1/:ver2"
                    element={
                      <Container>
                        <CompareVersion />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/Snapshot"
                    element={
                      <Container>
                        <Snapshot />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/snapshot/detail/:id"
                    element={
                      <Container>
                        <SnapshotDetail />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/snapshot/detail/:id/:snapshot/save/:note"
                    element={
                      <Container>
                        <SaveSnapshot />
                      </Container>
                    }
                  />
                  <Route
                    path="/config/snapshot/detail/:id/:snapshot/save"
                    element={
                      <Container>
                        <SaveSnapshot />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/snapshot/detail/display/:id/:snapshot"
                    element={
                      <Container>
                        <SnapshotDetailDisplay />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/snapshot/detail/:id/compare/:snapshot1/:snapshot2"
                    element={
                      <Container>
                        <CompareSnapshot />
                      </Container>
                    }
                  />
                  <Route
                    path="/config/certification/createGuide"
                    element={
                      <Container>
                        <CreateGuide />
                      </Container>
                    }
                  />
                  <Route
                    path="/config/certification/create/start"
                    element={
                      <Container>
                        <CreateStart />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/certification/importGuide"
                    element={
                      <Container>
                        <ImportGuide />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/certification/import/start"
                    element={
                      <Container>
                        <ImportStart />
                      </Container>
                    }
                  />
                  <Route
                    path="/config/certification"
                    element={
                      <Container>
                        <CertificationList />
                      </Container>
                    }
                  />
                  <Route
                    path="/config/certification/list"
                    element={
                      <Container>
                        <CertificationList />
                      </Container>
                    }
                  />
                  <Route
                    path="/config/certification/jobs"
                    element={
                      <Container>
                        <SSLJobList />
                      </Container>
                    }
                  />
                  <Route
                    path="/config/certification/job/:jobId"
                    element={
                      <Container>
                        <JobDetail />
                      </Container>
                    }
                  />

                  <Route
                    path="/config/sslcertificate/create/guide"
                    element={
                      <Container>
                        <CreateGuide />
                      </Container>
                    }
                  />

                  <Route
                    path="/monitor/cloudfront"
                    element={
                      <Container>
                        <CloudFront />
                      </Container>
                    }
                  />

                  <Route
                    path="/monitor/waf"
                    element={
                      <Container>
                        <WAF />
                      </Container>
                    }
                  />

                  <Route
                    path="*"
                    element={
                      <Container>
                        <div className="not-found">
                          <h1>404 Page Not Found</h1>
                          <Link to="/">
                            <Button>Home</Button>
                          </Link>
                        </div>
                      </Container>
                    }
                  />
                </Routes>
              </BrowserRouter>
              <Footer />
            </>
          );
        }}
      </Authenticator>
    </>
  );
};

const App: React.FC = () => {
  const [loadingConfig, setLoadingConfig] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const timeStamp = new Date().getTime();
    const resMonitroing = Axios.get(
      `/aws-monitoring-exports.json?timestamp=${timeStamp}`
    );
    const recConsole = Axios.get(`/aws-exports.json?timestamp=${timeStamp}`);
    Axios.all([resMonitroing, recConsole]).then(
      Axios.spread((resMonitroing, recConsole) => {
        const res: AmplifyConfigType = recConsole.data;
        res.aws_monitoring_api_key = resMonitroing.data.aws_monitoring_api_key;
        res.aws_monitoring_url = resMonitroing.data.aws_monitoring_url;
        res.aws_monitoring_stack_name =
          resMonitroing.data.aws_monitoring_stack_name;
        const configData: AmplifyConfigType = res;
        dispatch({
          type: ActionType.UPDATE_AMPLIFY_CONFIG,
          amplifyConfig: configData,
        });
        localStorage.setItem(AMPLIFY_CONFIG_JSON, JSON.stringify(res));
        Amplify.configure(configData);
        setLoadingConfig(false);
      })
    );
  }, []);

  return (
    <div className="App">
      {loadingConfig ? <LoadingText /> : <SignInRouter />}
    </div>
  );
};

export default App;
