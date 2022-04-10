import Nav from "./components/nav";
import Footer from "./components/footer";
import Home from "./pages/home";
import SinglePage from "./pages/singlepage";

import "./css/index.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { useLayoutEffect } from "react";
import CategoryPage from "./pages/categorypage";

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

            <Route exact path="/:query" element={<CategoryPage />} />

            <Route exact path="/post/:category/:id" element={<SinglePage />} />
          </Routes>

          {/* footer */}
          <Footer />
        </Router>
      }
    </>
  );
}

export default App;
