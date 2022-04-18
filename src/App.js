import Nav from "./components/nav";
import Footer from "./components/footer";
import Home from "./pages/home";
import SinglePage from "./pages/singlepage";

import "./css/index.css";
import "./css/responsive.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { useLayoutEffect } from "react";
import CategoryPage from "./pages/categorypage";
import { Empty } from "./components/misc";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      {
        <Router>
          <ScrollToTop />
          {/* nav */}
          <Nav />

          {/* main */}
          <Routes>
            <Route exact path="/" element={<Home />} />

            <Route exact path="/search" element={<Home />} />

            <Route exact path="/:category" element={<CategoryPage />} />

            <Route exact path="/post/:category/:id" element={<SinglePage />} />

            <Route
              path="/404"
              element={
                <Empty
                  {...{
                    text1: "404!",
                    text: "Page Not Found",
                    text2:
                      "This page may have been moved or deleted or the URL you entered is incorrect",
                    height: "75vh",
                  }}
                />
              }
            />
          </Routes>

          {/* footer */}
          <Footer />
        </Router>
      }
    </>
  );
}

export default App;
