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
  const [searchParams, setSearchParams] = useSearchParams();

  // set page type
  const page = searchParams.get("search") || "home";

  // set main post
  const [mainPosts, setMainPosts] = useState(),
    // url
    [mainPostsUrl, setMainPostsUrl] = useState(),
    // loading
    [mainPostsLoading, setMainPostsLoading] = useState(true),
    // explore url
    [exploreUrl, setExploreUrl] = useState(`?${searchParams.toString()}`);

  // create page link from params
  useEffect(() => {
    const search = searchParams.has("search");
    const category = searchParams.has("cat");

    setMainPostsUrl(
      search
        ? `${BASE_URL}/api/post/posts/filter/?search=${searchParams.get(
            "search"
          )}&page=${searchParams.get("pg") || 1}`
        : // if search is false
        category
        ? `${BASE_URL}/api/post/posts/filter/?category=${searchParams.get(
            "cat"
          )}&page=${searchParams.get("pg") || 1}`
        : `${BASE_URL}/api/post/posts/?page=${searchParams.get("pg") || 1}`
    );
  }, [searchParams]);

  // main
  useEffect(() => {
    setMainPostsLoading(true);
    mainPostsUrl &&
      axios
        .get(mainPostsUrl)
        .then((mainposts) => {
          if (page === "home") {
            const randompost =
              mainposts.data.results[
                Math.floor(Math.random() * mainposts.data.results.length)
              ];

            setExploreUrl(
              randompost
                ? `/post/${randompost?.category}/${randompost?.id}`
                : `?${searchParams.toString()}`
            );
          }

          setMainPosts(mainposts.data);
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
            setMainPostsUrl,
            mainPostsLoading,
            navtabsData:
              page === "home"
                ? ["all", "design", "fashion", "lifestyle", "talks"]
                : [searchParams.get("search")],
            page,
            searchParams,
            setSearchParams,
          }}
        />

        {/* side content */}
        <SideContent {...{ page, searchParams }} />
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

// 162 lines
