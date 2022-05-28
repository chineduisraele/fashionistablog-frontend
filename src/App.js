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

import { useEffect, useLayoutEffect } from "react";
import CategoryPage from "./pages/categorypage";
import { Empty } from "./components/misc";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// hook
const useObserver = (prop) => {
  useEffect(() => {
    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyimg = entry.target;
          lazyimg.src = lazyimg.dataset.src;
          lazyimg.classList.remove("lazyimg");
          imgObserver.unobserve(lazyimg);
        }
      });
    }, prop.options || { rootMargin: "400px" });

    if (prop.ref.current) {
      console.log(
        prop.ref.current,
        prop.ref.current.querySelectorAll(".lazyimg")
      );

      prop.ref.current
        .querySelectorAll(".lazyimg")
        .forEach((img) => imageObserver.observe(img));
    }
  }, [prop.ref, prop.options, prop.data]);
};

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
            <Route
              path="*"
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
export { useObserver };
