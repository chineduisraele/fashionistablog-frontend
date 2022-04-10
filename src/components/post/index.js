import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

import { Empty, SmallLoading, BASE_URL } from "../misc";
import { Card, MiniCard, PhotoCard } from "../card";

import "./css/index.css";
import Affiliate from "../../images/purchase.webp";

// Paginate

const Paginate = ({ posts, setPostUrl, page, to }) => {
  return (
    <ScrollLink to={to} spy={true} offset={-100} style={{ display: "block" }}>
      <div className="paginate d-grid">
        <button
          className={posts.previous ? "" : "inactive"}
          onClick={() => {
            posts.previous && setPostUrl(posts.previous);
            posts.previous &&
              sessionStorage.setItem(`${page}PostsUrl`, posts.previous);
          }}
        >
          <i className="fa fa-angle-left"></i> Previous
        </button>

        <button
          className={posts.next ? "" : "inactive"}
          onClick={() => {
            posts.next && setPostUrl(posts.next);
            posts.next && sessionStorage.setItem(`${page}PostsUrl`, posts.next);
          }}
        >
          Next <i className="fa fa-angle-right"></i>
        </button>
      </div>
    </ScrollLink>
  );
};

// Main post component
const MainPostComponent = ({
  mainPosts,
  mainPostsCategory,
  setMainPostsCategory,
  setMainPostsUrl,
  mainPostsLoading,
  navtabsData,
  page,
  path,
}) => {
  return (
    <div className="card-cont">
      {/* card-nav */}
      <div className="nav-tabs" id="nav-tabs">
        <ul className="d-flex">
          <li>
            {path?.includes("tagonly")
              ? `Tags ( ${mainPosts.count} )`
              : path?.includes("search")
              ? `Search ( ${mainPosts.count} )`
              : `${mainPostsCategory}  ${
                  mainPostsCategory !== "All" ? ` ( ${mainPosts.count} )` : ""
                } `}
          </li>
          {navtabsData.map((text, i) => {
            return (
              <li
                key={i}
                role="button"
                className={text === mainPostsCategory ? "active" : ""}
                onClick={({ currentTarget: c }) => {
                  // mainposts category control
                  // should only apply to home page
                  if (navtabsData.length > 1) {
                    setMainPostsCategory(c.textContent);

                    let url =
                      c.textContent === "All"
                        ? `${BASE_URL}/api/post/posts/`
                        : `${BASE_URL}/api/post/posts/filter/?category=${c.textContent}`;

                    setMainPostsUrl(url);

                    // save for reload
                    sessionStorage.setItem(
                      `${page}mainPostsCategory`,
                      c.textContent
                    );
                    sessionStorage.setItem(`${page}mainPostsUrl`, url);
                  }
                }}
              >
                {page.includes("tagonly") && "# "}
                {text.split("%20").join(" ").slice(0, 25)}
              </li>
            );
          })}
        </ul>
      </div>

      {/* cards */}
      {mainPostsLoading ? (
        <SmallLoading />
      ) : mainPosts.results.length ? (
        <>
          <div className="cards d-grid">
            {mainPosts.results.map((i) => {
              return <Card {...i} />;
            })}
          </div>

          <Paginate
            {...{
              posts: mainPosts,
              setPostUrl: setMainPostsUrl,
              page: `${page}main`,
              to: "nav-tabs",
            }}
          />
        </>
      ) : (
        <Empty
          {...{
            text: "No Posts found!",
            text2: "Hopefully, there'll be something next time",
            height: "50vh",
          }}
        />
      )}
    </div>
  );
};

// Featured Posts
const FeaturedPosts = ({ query, page }) => {
  // featured
  const [featuredPosts, setFeaturedPosts] = useState(),
    [featuredPostsUrl, setFeaturedPostsUrl] = useState(),
    [featuredPostsLoading, setFeaturedPostsLoading] = useState(true);

  //featured
  useEffect(() => {
    let tempUrl =
      query === "all"
        ? sessionStorage.getItem(`homefeaturedPostsUrl`)
        : sessionStorage.getItem(`${query}featuredPostsUrl`);
    console.log(query);
    if (tempUrl) {
      setFeaturedPostsUrl(tempUrl);
    } else if (tempUrl === null) {
      setFeaturedPostsUrl(
        `${BASE_URL}/api/post/posts/filter/?featured=${query}`
      );
    }
  }, [query]);

  useEffect(() => {
    setFeaturedPostsLoading(true);

    featuredPostsUrl &&
      axios
        .get(featuredPostsUrl)
        .then((featuredposts) => {
          setFeaturedPosts(featuredposts.data);
          setFeaturedPostsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [featuredPostsUrl]);
  return (
    /* featured posts */

    <div className="card-cont featured-posts" id="featured-posts">
      <header className="header">
        <h3>Featured Posts</h3>
      </header>
      {/* cards */}
      {featuredPostsLoading ? (
        <SmallLoading />
      ) : featuredPosts.results.length ? (
        <>
          <div className="cards d-grid">
            {featuredPosts.results.map((i) => {
              return <Card {...i} />;
            })}
          </div>

          {/* paginate */}
          <Paginate
            {...{
              posts: featuredPosts,
              setPostUrl: setFeaturedPostsUrl,
              page: `${page}featured`,
              to: "featured-posts",
            }}
          />
        </>
      ) : (
        <Empty
          {...{
            text: "No Posts found!",
            text2: "Hopefully, there'll be something next time",
            height: "50vh",
          }}
        />
      )}
    </div>
  );
};

// popular posts
const MostViewedPosts = ({ query }) => {
  // states
  const [mostViewedPosts, setMostViewedPosts] = useState(),
    [moved, setMoved] = useState(0);

  // element ref
  const slideRef = useRef();
  const prevRef = useRef();
  const nextRef = useRef();

  // slide mover function
  const moveSlide = (direction, moved) => {
    let factor = window.innerWidth < 600 ? 10 : 8,
      slide = slideRef.current;
    // slide = c.parentElement.parentElement.querySelector(".slide"),

    if (direction === "right" && moved > -(factor * 410)) {
      setMoved((prev) => {
        slide.style.transform = `translateX(${prev - 401}px)`;
        return prev - 401;
      });
    }
    if (direction === "left" && moved < 0) {
      setMoved((prev) => {
        slide.style.transform = `translateX(${prev + 401}px)`;
        return prev + 401;
      });
    }
  };

  // auto slide
  // useEffect(() => {
  //   setInterval(() => {
  //     if (getComputedStyle(nextRef.current).visibility === "hidden") {
  //       slideRef.current.style.transition = "none";
  //       slideRef.current.style.transform = `translateX(0)`;

  //       nextRef.current.style.visibility = "visible";
  //       prevRef.current.style.visibility = "hidden";

  //       setMoved(0);
  //       setTimeout(() => {
  //         slideRef.current.style.transition = "transform 0.5s ease-out";
  //       }, []);

  //       return;
  //     }

  //     moveSlide("right", moved);
  //   }, 5000);
  // }, []);

  //fetchdata
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/post/posts/filter/?most_viewed=${query}`)
      .then((mostviewedposts) => {
        setMostViewedPosts(mostviewedposts.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [query]);

  return (
    <section className="most-viewed">
      <header className="header">
        <h3>Most Viewed</h3>
      </header>
      <div className="inner p-rel">
        {mostViewedPosts && (
          <div>
            <article className="slide d-flex" ref={slideRef}>
              {mostViewedPosts.results.map((i) => {
                return <PhotoCard {...i} />;
              })}
            </article>
          </div>
        )}

        <div className="controls p-abs d-flex jcsb ty-50">
          <button
            style={{ visibility: moved === 0 ? "hidden" : "" }}
            onClick={() => {
              moveSlide("left", moved);
            }}
            ref={prevRef}
          >
            <i className="fa fa-angle-left"></i>
          </button>

          <button
            style={{
              visibility:
                window.innerWidth < 600 && moved === -4411
                  ? "hidden"
                  : window.innerWidth > 600 && moved === -3609
                  ? "hidden"
                  : "",
            }}
            onClick={(e) => {
              moveSlide("right", moved);
            }}
            ref={nextRef}
          >
            <i className="fa fa-angle-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

// side content
const SideContent = ({ query, id }) => {
  const [categoriesData, setCategoriesdata] = useState(),
    [archivesData, setArchivesData] = useState(),
    // popular
    [popularPosts, setPopularPosts] = useState();
  // [popularPostUrl, setPopularPostUrl] = useState();

  const path = useLocation();

  const followData = [
    ["fab fa-facebook", "#"],
    ["fab fa-twitter", "#"],
    ["fab fa-instagram", "#"],
    ["fab fa-whatsapp", "#"],
    ["fab fa-telegram", "#"],
    ["fab fa-discord", "#"],
    ["fab fa-google-plus", "#"],
    ["fab fa-pinterest", "#"],
  ];

  //popular
  useEffect(() => {
    !path.search &&
      axios
        .get(
          `${BASE_URL}/api/post/posts/filter/?popular=${query}${
            id ? `&id=${id}` : ""
          }`
        )
        .then((popularposts) => {
          setPopularPosts(popularposts.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [query, id, path.search]);

  useEffect(() => {
    axios
      .all([
        axios.get(`${BASE_URL}/api/post/posts/filter/?category_count=all`),
        axios.get(`${BASE_URL}/api/post/posts/filter/?archives_count=all`),
      ])
      .then(
        axios.spread((categoriescount, archivescount) => {
          setCategoriesdata(categoriescount.data);
          setArchivesData(archivescount.data);
        })
      )
      .catch((err) => console.log(err));
  }, []);

  return (
    <aside className="d-grid side-content">
      {/* purchase box */}
      <article className="purchase-box p-rel">
        <img src={Affiliate} alt="affiliate" className="d-block" />
        <div className="overlay p-abs size-100 d-flex aic jcc">
          <h3>The Dawn</h3>
          <p>Follow the path that leads to morning.</p>
          <Link to="/">Purchase Now</Link>
        </div>
      </article>

      {/* social links */}
      <FollowTab data={followData} />

      {/* popular posts */}
      {!path.search && (
        <article className="popular-tabs d-grid" id="popular-tabs">
          <header className="header">
            <h3>Popular</h3>
          </header>

          {popularPosts && (
            <div className="minicards-cont d-grid">
              {popularPosts.results.map((i) => {
                return <MiniCard {...i} />;
              })}
            </div>
          )}
        </article>
      )}

      {/* categories tab and archives tab */}
      <div className="d-grid catscont">
        <CategoriesTab
          {...{
            data: categoriesData,
            title: "Categories",
          }}
        />
        <CategoriesTab
          {...{
            data: archivesData,
            title: "Archives",
          }}
        />
      </div>
    </aside>
  );
};

// follow tab
const FollowTab = ({ data }) => {
  return (
    <article className="follow-tab">
      <header className="header">
        <h3>Follow Us</h3>
      </header>
      <ul className="d-grid">
        {data.map(([name, link], i) => {
          return (
            <li key={i}>
              <a href={link} className="d-flex aic jcc">
                <i className={name}></i>
              </a>
            </li>
          );
        })}
      </ul>
    </article>
  );
};

// category tab
const CategoriesTab = ({ data, title }) => {
  return (
    <article className="categories-tab">
      <header className="header">
        <h3>{title}</h3>
      </header>

      <ul>
        {data &&
          data.map(({ text, count }, i) => {
            return (
              <li key={i} className="trans">
                <i className="fa fa-angle-double-right"></i>
                <Link to={`/${text}`}>{text}</Link> ( {count} )
              </li>
            );
          })}
      </ul>
    </article>
  );
};

export {
  MainPostComponent,
  FeaturedPosts,
  MostViewedPosts,
  SideContent,
  FollowTab,
  Paginate,
};
