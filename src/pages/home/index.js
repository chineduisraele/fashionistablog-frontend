import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

import {
  MainPostComponent,
  FeaturedPosts,
  SideContent,
  MostViewedPosts,
} from "../../components/post";
import { Loading, BASE_URL, GoogleAds } from "../../components/misc";

import "./css/home.css";
import "./css/responsive.css";
import Banner from "../../images/banner.webp";
import FacebookLike from "../../images/facebook.webp";

// home
const Home = () => {
  const path = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // for home ... page will be a state
  // console.log(`http://localhost:3000/?page=1`);
  // // category home
  // console.log(`http://localhost:3000/?category=cat&page=1`);
  // // search
  // console.log(`http://localhost:3000/search/?search=search`);

  // console.log(`${BASE_URL}/api/post/posts/filter/?category=all&page=1`);
  // console.log(`${BASE_URL}/api/post/posts/?page=1`);
  // console.log(path.search.replace("?", "").split("&"));

  // set page type
  const page = path.search.includes("search") ? "search" : "home";

  // set main post
  const [mainPosts, setMainPosts] = useState(),
    // category
    [mainPostsCategory, setMainPostsCategory] = useState(
      page === "home"
        ? sessionStorage.getItem(`${page}mainPostsCategory`)
        : "All"
    ),
    [mainPostsUrl, setMainPostsUrl] = useState(
      page === "home"
        ? sessionStorage.getItem(`${page}mainPostsUrl`)
        : `${BASE_URL}/api/post/posts/filter/${path.search}`
    ),
    [mainPostsLoading, setMainPostsLoading] = useState(true),
    [exploreUrl, setExploreUrl] = useState("");

  useEffect(() => {
    setSearchParams({ cat: mainPostsCategory, pg: "1" });
  }, [mainPostsCategory]);

  // fetch data
  useEffect(() => {
    console.log(page);
    const url = sessionStorage.getItem(`${page}mainPostsUrl`);
    path.search
      ? setMainPostsUrl(`${BASE_URL}/api/post/posts/filter/${path.search}`)
      : url
      ? setMainPostsUrl(url)
      : setMainPostsUrl(`${BASE_URL}/api/post/posts/`);
  }, [path.search]);

  // main
  useEffect(() => {
    mainPostsUrl === null && setMainPostsUrl(`${BASE_URL}/api/post/posts/`);
    mainPostsCategory === null && setMainPostsCategory("All");

    setMainPostsLoading(true);
    mainPostsUrl &&
      axios
        .get(mainPostsUrl)
        .then((mainposts) => {
          const randompost =
            page === "home" &&
            mainposts.data.results[
              Math.floor(Math.random() * mainposts.data.results.length)
            ];

          setMainPosts(mainposts.data);
          page === "home" &&
            setExploreUrl(`/post/${randompost?.category}/${randompost?.id}`);
          setMainPostsLoading(false);
        })
        .catch((err) => console.log(err));
  }, [mainPostsUrl]);

  return mainPosts === undefined ? (
    <Loading />
  ) : (
    <main className="home">
      {/* banner */}
      {page === "home" && (
        <section className="banner p-rel">
          <img src={Banner} alt="banner" className="d-block" />
          <div className="p-abs d-grid">
            <h2>Hottest news and trending gists in the fashion world!</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iustuam
              llitia!
            </p>

            <Link className="btn" role={"button"} to={exploreUrl}>
              Explore
            </Link>
          </div>
        </section>
      )}

      <section className="main-content d-grid">
        <MainPostComponent
          {...{
            mainPosts,
            mainPostsCategory,
            setMainPostsCategory,
            setMainPostsUrl,
            mainPostsLoading,
            navtabsData:
              page === "home"
                ? ["All", "Design", "Fashion", "Lifestyle", "Talks"]
                : [
                    `${path.search
                      .replace("?search=", "")
                      .split("&")
                      .slice(0, 1)}`,
                  ],
            page,
            path: path.search,
          }}
        />

        {/* side content */}
        <SideContent query="all" page={page} />
      </section>

      {/* ads */}
      <GoogleAds />

      {/* Popular posts */}
      <MostViewedPosts query="all" />

      <section className="more-content main-content d-grid">
        {/* featured posts */}
        <FeaturedPosts query="all" page="home" />

        {/* tweets */}
        <aside>
          <div className="tweets">
            <header className="header">
              <h3>RECENT TWEETS</h3>
            </header>
            <img src={FacebookLike} alt="tweets" />
          </div>
          <div className="fblikes">
            <header className="header">
              <h3>FACEBOOK LIKES</h3>
            </header>
            <img src={FacebookLike} alt="facebooklikes" />
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Home;
