import React, { useState, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";

import "./css/index.css";
import Logo from "../../images/logo.webp";

const Nav = () => {
  let path = useLocation(),
    [search, setSearch] = useState<string>();

  let navData = [
    ["/", "Home"],
    ["/design", "Design"],
    ["/fashion", "Fashion"],
    ["/lifestyle", "Lifestyle"],
    ["/talks", "Talks"],
  ];

  const toggleHeight = (scroll?: any) => {
    let cont = document.querySelector(".linkscont") as HTMLDivElement,
      child = cont.firstElementChild!,
      contheight = cont.getBoundingClientRect().height,
      childheight = child.getBoundingClientRect().height;

    if (scroll) {
      cont.style.height = "0";
      return;
    }
    if (contheight === 0) {
      cont.style.height = `${childheight}px`;
    } else {
      cont.style.height = "0";
    }
  };

  useLayoutEffect(() => {
    let cont = document.querySelector(".linkscont") as HTMLDivElement;
    cont.style.transition = "none";
    cont.style.height = "0";
    setTimeout(() => {
      cont.style.transition = "height 0.35s";
    });
  }, [path.pathname]);

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
          aria-label="toggle button"
        >
          <FaBars />
        </button>

        {/* menu */}
        <div className="linkscont p-rel trans">
          <ul>
            {navData.map(([link, text], id) => {
              return (
                <li
                  key={id}
                  className={path.pathname === link ? "active" : undefined}
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
            role="button"
            aria-label="search-link"
            className="d-flex aic jcc c-white"
          >
            <FaSearch />
          </Link>
        </form>
      </div>
    </nav>
  );
};

export default Nav;
