import React, { useState, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/index.css";
import Logo from "../../images/logo.webp";

const Nav = () => {
  let path = useLocation(),
    [search, setSearch] = useState();

  let navData = [
    ["/", "Home"],
    ["/design", "Design"],
    ["/fashion", "Fashion"],
    ["/lifestyle", "Lifestyle"],
    ["/talks", "Talks"],
  ];

  const toggleHeight = (scroll) => {
    let cont = document.querySelector(".linkscont"),
      child = cont.firstElementChild,
      contheight = cont.getBoundingClientRect().height,
      childheight = child.getBoundingClientRect().height;

    if (scroll) {
      cont.style.height = 0;
      return;
    }
    if (contheight === 0) {
      cont.style.height = `${childheight}px`;
    } else {
      cont.style.height = 0;
    }
  };

  // axis
  const [cordinate, setCordinate] = useState(0);
  useLayoutEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > cordinate) {
        let nav = document.querySelector("nav");
        nav.style.position = "static";
        nav.style.zIndex = "100";
        nav.style.backgroundColor = "transparent";
        setCordinate(window.scrollY);
      } else if (window.scrollY < cordinate) {
        let nav = document.querySelector("nav");
        nav.style.position = "sticky";
        nav.style.top = "-1px";
        nav.style.zIndex = "100";
        nav.style.backgroundColor = "#fff";
        setCordinate(window.scrollY);
      }
    });
  }, [cordinate]);

  useLayoutEffect(() => {
    let cont = document.querySelector(".linkscont");
    cont.style.transition = "none";
    cont.style.height = "0";
    setTimeout(() => {
      cont.style.transition = "height 0.35s";
    });
  }, [path.pathname]);

  // toggle height on scroll
  useLayoutEffect(() => {
    window.addEventListener("scroll", () => {
      toggleHeight(true);
    });
  }, []);

  return (
    <nav className="shad2 mainnavbar">
      <div className="inner d-flex aic jcsb">
        <Link to="/">
          <img src={Logo} alt="logo" />
        </Link>

        {/* menu bar */}
        <button
          className="shad1"
          onClick={() => {
            toggleHeight();
          }}
        >
          <i className="fa fa-bars"></i>
        </button>

        {/* menu */}
        <div className="linkscont p-rel trans">
          <ul>
            {navData.map(([link, text], id) => {
              return (
                <li
                  key={id}
                  class={path.pathname === link ? "active" : undefined}
                >
                  <Link to={link}>{text}</Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* search */}
        <form action="" className="d-flex aic jcc">
          <input
            name="search"
            type="text"
            placeholder="Enter search word ..."
            onChange={(e) => {
              setSearch(e.currentTarget.value);
            }}
          />
          <Link
            to={`/search?search=${search}`}
            onClick={(e) => {
              !search && e.preventDefault();
            }}
          >
            <button className="d-flex aic jcc c-white">
              <i className="fa fa-search "></i>
            </button>
          </Link>
        </form>
      </div>
    </nav>
  );
};

export default Nav;
