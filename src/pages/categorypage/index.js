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
import FacebookLike from "../../images/facebook.webp";

// home
const CategoryPage = () => {
  let { category } = useParams();

  const [mainPosts, setMainPosts] = useState(),
    [mainPostsUrl, setMainPostsUrl] = useState(),
    [mainPostsLoading, setMainPostsLoading] = useState(true);

  // fetch data
  useEffect(() => {
    let tempUrl = sessionStorage.getItem(`${category}mainPostsUrl`);
    if (tempUrl) {
      setMainPostsUrl(tempUrl);
    } else if (tempUrl === null) {
      setMainPostsUrl(
        `${BASE_URL}/api/post/posts/filter/?category=${category}`
      );
    }
  }, [category]);

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
            mainPostsCategory: category,
            setMainPostsUrl,
            mainPostsLoading,
            navtabsData: [category],
            page: "category",
          }}
        />

        {/* side content */}
        <SideContent page={"category"} />
      </section>

      {/* ads */}
      <GoogleAds />

      {/* Popular posts */}
      <MostViewedPosts query={category} />

      <section className="more-content main-content d-grid">
        {/* featured posts */}
        <FeaturedPosts query={category} page={category} />

        {/* tweets */}
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
      </section>
    </main>
  );
};

export default CategoryPage;
