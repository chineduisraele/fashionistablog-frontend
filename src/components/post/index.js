import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import {
  FaFacebookSquare,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaGooglePlus,
  FaPinterest,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

import { Empty, SmallLoading, BASE_URL } from "../misc";
import { Card, MiniCard, PhotoCard } from "../card";

import "./css/index.css";
import Affiliate from "../../images/purchase.webp";
import FacebookLike from "../../images/facebook.webp";

// Paginate

const Paginate = ({ posts, to }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <ScrollLink to={to} spy={true} offset={-100} style={{ display: "block" }}>
      <div className="paginate d-grid">
        <button
          className={posts.previous ? "" : "inactive"}
          onClickCapture={(e) => {
            if (posts.previous) {
              searchParams.set(
                "pg",
                posts.previous.includes("page") ? posts.previous.slice(-1) : "1"
              );

              setSearchParams(searchParams);
            } else {
              e.stopPropagation();
            }
          }}
        >
          <FaAngleLeft />t Previous
        </button>

        <button
          className={posts.next ? "" : "inactive"}
          onClickCapture={(e) => {
            if (posts.next) {
              searchParams.set("pg", posts.next.slice(-1));
              setSearchParams(searchParams);
            } else {
              e.stopPropagation();
            }
          }}
        >
          Next <FaAngleRight />
        </button>
      </div>
    </ScrollLink>
  );
};

// Main post component
const MainPostComponent = ({
  mainPosts,
  mainPostsLoading,
  navtabsData,
  page,
  searchParams,
  setSearchParams,
  category,
}) => {
  return (
    <div className="card-cont">
      {/* card-nav */}
      <div className="nav-tabs" id="nav-tabs">
        <ul className="d-flex">
          <li>
            {category
              ? `${category} ( ${mainPosts.count} )`
              : searchParams.has("tagonly")
              ? `Tags ( ${mainPosts.count} )`
              : searchParams.has("search")
              ? `Search ( ${mainPosts.count} )`
              : `${searchParams.get("cat") || "all"}  ${
                  searchParams.get("cat") ? "( " + mainPosts.count + " )" : ""
                }
                 `}
          </li>
          {navtabsData.map((text, i) => {
            return (
              <li
                key={i}
                role="button"
                className={
                  text === searchParams.get("cat") ||
                  (text === "all" && !searchParams.get("cat"))
                    ? "active"
                    : ""
                }
                onClick={() => {
                  page === "home" &&
                    setSearchParams(text === "all" ? {} : { cat: text });
                }}
              >
                {searchParams.has("tagonly") && "# "}
                {text.slice(0, 25)}
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
              to: "nav-tabs",
            }}
          />
        </>
      ) : (
        <Empty
          {...{
            text: "No Posts Found!",
            text2: "Hopefully, there'll be something next time",
            height: "50vh",
          }}
        />
      )}
    </div>
  );
};

// Featured Posts
const FeaturedPosts = ({ query, title, data }) => {
  // featured
  const [featuredPosts, setFeaturedPosts] = useState(data),
    [featuredPostsUrl, setFeaturedPostsUrl] = useState(),
    [featuredPostsLoading, setFeaturedPostsLoading] = useState(
      data ? false : true
    );
  //featured
  useEffect(() => {
    !data &&
      setFeaturedPostsUrl(
        `${BASE_URL}/api/post/posts/filter/?featured=${query}`
      );
  }, [query]);

  useEffect(() => {
    if (!data) {
      setFeaturedPostsLoading(true);

      featuredPostsUrl &&
        axios
          .get(featuredPostsUrl)
          .then((featuredposts) => {
            setFeaturedPosts(featuredposts.data);
            setFeaturedPostsLoading(false);
          })
          .catch((err) => {
            console.error(err);
          });
    }
  }, [featuredPostsUrl]);
  return (
    /* featured posts */

    <div className="card-cont featured-posts" id="featured-posts">
      <header className="header">
        <h3>{title || "Featured Posts"}</h3>
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
  const [mostViewedPosts, setMostViewedPosts] = useState();
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/post/posts/filter/?most_viewed=${query}`)
      .then((mostviewedposts) => {
        setMostViewedPosts(mostviewedposts.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [query]);

  return mostViewedPosts?.count === 0 ? (
    <></>
  ) : (
    <section className="most-viewed">
      <header className="header">
        <h3>Most Viewed</h3>
      </header>

      <article className="slide d-grid">
        {mostViewedPosts?.results.map((i) => {
          return <PhotoCard {...i} />;
        })}
      </article>
    </section>
  );
};

// side content
const SideContent = ({ page, searchParams }) => {
  const path = useParams();

  const [categoriesData, setCategoriesdata] = useState(),
    [archivesData, setArchivesData] = useState(),
    // popular
    [popularPostsUrl, setPopularPostsUrl] = useState(),
    [popularPosts, setPopularPosts] = useState();

  useEffect(() => {
    setPopularPostsUrl(
      (page === "home" &&
        `${BASE_URL}/api/post/posts/filter/?popular=${
          searchParams.get("cat") || "all"
        }`) ||
        (page === "singlepost" &&
          `${BASE_URL}/api/post/posts/filter/?popular=${path.category}&id=${path.id}`) ||
        (page === "category" &&
          `${BASE_URL}/api/post/posts/filter/?popular=${path.category}`)
    );
  }, [searchParams, path.category, path.id]);

  //popular
  useEffect(() => {
    popularPostsUrl &&
      axios
        .get(popularPostsUrl)
        .then((popularposts) => {
          setPopularPosts(popularposts.data);
        })
        .catch((err) => {
          console.error(err);
        });
  }, [popularPostsUrl]);

  // fetch categories tab and archives tab data
  useEffect(() => {
    axios
      .all([
        axios.get(`${BASE_URL}/api/post/posts/filter/?category_count=all`),
        axios.get(`${BASE_URL}/api/post/posts/filter/?archives_count=all`),
      ])
      .then(
        axios.spread((categories, archives) => {
          setCategoriesdata(categories.data);
          setArchivesData(archives.data);
        })
      )
      .catch((err) => console.error(err));
  }, []);

  return (
    <aside className="d-grid side-content">
      {/* purchase box */}
      <article className="purchase-box p-rel">
        <img src={Affiliate} alt="affiliate" className="d-block" />
        <div className="overlay p-abs size-100 d-flex aic jcc">
          <h3>The Dawn</h3>
          <p>Follow the path that leads to morning.</p>
          <a
            href="https://www.friendlystores.netlify.app"
            target="_blank"
            rel="noreferrer"
          >
            Purchase Now
          </a>
        </div>
      </article>

      {/* social links */}
      <FollowTab />

      {/* popular posts */}
      {popularPosts?.count !== 0 && page !== "search" && (
        <>
          <article className="popular-tabs d-grid" id="popular-tabs">
            <header className="header">
              <h3>Popular</h3>
            </header>

            <div className="minicards-cont d-grid">
              {popularPosts?.results.map((i) => {
                return <MiniCard {...i} />;
              })}
            </div>
          </article>

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
        </>
      )}
    </aside>
  );
};

// follow tab
const FollowTab = ({ data }) => {
  let followdata = data
    ? data
    : [
        [<FaFacebookSquare />, "#", "facebook"],
        [<FaTwitter />, "#", "twitter"],
        [<FaInstagram />, "#", "instagram"],
        [<FaWhatsapp />, "#", "whatsapp"],
        [<FaTelegram />, "#", "telegram"],
        [<FaDiscord />, "#", "discord"],
        [<FaGooglePlus />, "#", "google"],
        [<FaPinterest />, "#", "pinterest"],
      ];
  return (
    <article className="follow-tab">
      <header className="header">
        <h3>Follow Us</h3>
      </header>
      <ul className="d-grid">
        {followdata.map(([name, link, classname], i) => {
          return (
            <li key={i}>
              <a href={link} className={`d-flex aic jcc ${classname}`}>
                {name}
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
              <li key={i}>
                <FaAngleDoubleRight /> <Link to={`/${text}`}>{text}</Link> ({" "}
                {count} )
              </li>
            );
          })}
      </ul>
    </article>
  );
};

// tweets
const Tweets = () => {
  return (
    <aside>
      <div className="tweets">
        <header className="header">
          <h3>RECENT TWEETS</h3>
        </header>
        <img src={FacebookLike} alt="facebooklikes" />
      </div>
      <div className="fblikes">
        <header className="header">
          <h3>FACEBOOK LIKES</h3>
        </header>
        <img src={FacebookLike} alt="facebooklikes" />
      </div>
    </aside>
  );
};

export {
  MainPostComponent,
  FeaturedPosts,
  MostViewedPosts,
  SideContent,
  FollowTab,
  Paginate,
  Tweets,
};
