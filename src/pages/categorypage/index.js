import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams(),
    { category } = useParams();

  // set page type
  const page = "category";

  const [mainPosts, setMainPosts] = useState(),
    [mainPostsUrl, setMainPostsUrl] = useState(),
    [mainPostsLoading, setMainPostsLoading] = useState(true);

  // fetch data
  useEffect(() => {
    setMainPostsUrl(
      `${BASE_URL}/api/post/posts/filter/?category=${category}&page=${
        searchParams.get("pg") || 1
      }`
    );
  }, [category, searchParams]);

  // main
  useEffect(() => {
    setMainPostsLoading(true);

    mainPostsUrl &&
      axios
        .get(mainPostsUrl)
        .then((mainposts) => {
          setMainPosts(mainposts.data);
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
            mainPostsLoading,
            navtabsData: [category],
            searchParams,
            setSearchParams,
            category,
            page,
          }}
        />

        {/* side content */}
        <SideContent page={page} />
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
