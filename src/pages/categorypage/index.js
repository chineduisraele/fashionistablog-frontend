import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
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

// home
const CategoryPage = () => {
  let { query } = useParams();

  const [mainPosts, setMainPosts] = useState(),
    [mainPostsUrl, setMainPostsUrl] = useState(),
    [mainPostsLoading, setMainPostsLoading] = useState(true);

  // fetch data
  useEffect(() => {
    let tempUrl = sessionStorage.getItem(`${query}mainPostsUrl`);
    if (tempUrl) {
      setMainPostsUrl(tempUrl);
    } else if (tempUrl === null) {
      setMainPostsUrl(`${BASE_URL}/api/post/posts/filter/?category=${query}`);
    }
  }, [query]);

  // main
  useEffect(() => {
    setMainPostsLoading(true);

    mainPostsUrl &&
      axios
        .get(mainPostsUrl)
        .then((mainposts) => {
          setMainPosts(mainposts.data);
          console.log(mainposts.data);
          setMainPostsLoading(false);
        })
        .catch((err) => console.log(err));
  }, [mainPostsUrl]);

  // scroll to top on reload
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return mainPosts === undefined ? (
    <Loading />
  ) : (
    <main className="home">
      <section className="main-content d-grid">
        <MainPostComponent
          {...{
            mainPosts,
            mainPostsCategory: query,
            setMainPostsUrl,
            mainPostsLoading,
            navtabsData: [query],
            page: query,
          }}
        />

        {/* side content */}
        <SideContent query={query} page={query} />
      </section>

      {/* ads */}
      <GoogleAds />

      {/* Popular posts */}
      <MostViewedPosts query={query} />

      <section className="more-content main-content d-grid">
        {/* featured posts */}
        <FeaturedPosts query={query} page={query} />

        {/* tweets */}
        <aside>
          <div className="tweets">
            <header className="header">
              <h3>RECENT TWEETS</h3>
            </header>
            <img src="./images/test/facebook-like.jpg" alt="facebooklikes" />
          </div>
          <div className="fblikes">
            <header className="header">
              <h3>FACEBOOK LIKES</h3>
            </header>
            <img src="./images/test/facebook-like.jpg" alt="facebooklikes" />
          </div>
        </aside>
      </section>
    </main>
  );
};

export default CategoryPage;
