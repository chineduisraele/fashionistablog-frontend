// Packages
import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

// components
import Nav from "./components/nav";
import Footer from "./components/footer";
import Home from "./pages/home";
import { Empty } from "./components/misc";

// styles
import "./css/index.css";
import "./css/responsive.css";
import CategoryPage from "./pages/categorypage";
import SinglePage from "./pages/singlepage";

// scroll to top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const notFound = {
    text1: "404!",
    text: "Page Not Found",
    text2:
      "This page may have been moved or deleted or the URL you entered is incorrect",
    height: "75vh",
  };

  // only load footer after last page conponent loads to avoid layout shift
  useEffect(() => {
    let footer = document.querySelector("footer") as HTMLElement;
    if (getComputedStyle(footer).display === "none") {
      footer.style.display = "block";
    }
  }, []);
  return (
    <>
      {
        <Router>
          <ScrollToTop />

          {/* nav */}
          <Nav />

          {/* routes */}
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/search" element={<Home />} />

            <Route path="/:category" element={<CategoryPage />} />

            <Route path="/post/:category/:id" element={<SinglePage />} />

            <Route path="/404" element={<Empty {...notFound} />} />
            <Route path="*" element={<Empty {...notFound} />} />
          </Routes>

          {/* footer */}
          <Footer />
        </Router>
      }
    </>
  );
};

export default App;
