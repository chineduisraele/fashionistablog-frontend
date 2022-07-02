// packages
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

// components
import {
  MainPostComponent,
  FeaturedPosts,
  SideContent,
  MostViewedPosts,
  Tweets,
} from "../../components/post";
import { Loading, BASE_URL, GoogleAds } from "../../components/misc";

// interfaces
import { post } from "../../interfaces";

// styles
import "./css/home.css";
import { useFetch } from "../../hooks";

// home
const Home = () => {
  const [searchParams] = useSearchParams();
  // set page type
  const page = searchParams.get("search") || "home";

  // urls
  const [postsUrl, setPostsUrl] = useState<string>(),
    [exploreUrl, setExploreUrl] = useState(`?${searchParams.toString()}`);

  // fetch data
  const { data, isLoading, isError } = useFetch(
    "homeMainPostsData",
    postsUrl!,
    postsUrl!
  );

  // create page link from params
  useEffect(() => {
    const search = searchParams.get("search"),
      category = searchParams.get("cat"),
      pg = searchParams.get("pg") || 1;

    setPostsUrl(
      search
        ? `${BASE_URL}/api/post/posts/filter/?search=${search}&page=${pg}`
        : // if not search
        category
        ? `${BASE_URL}/api/post/posts/filter/?category=${category}&page=${pg}`
        : //if not category
          `${BASE_URL}/api/post/posts/?page=${pg}`
    );
  }, [searchParams]);

  // set explore url
  useEffect(() => {
    if (page === "home" && data?.data.length) {
      const randompost: post =
        data?.data.results[
          Math.floor(Math.random() * data?.data.results.length)
        ];

      setExploreUrl(`/post/${randompost?.category}/${randompost?.id}`);
    }
  }, [data?.data]);

  // props
  const mainPostProps = {
    data: data?.data,
    isLoading,
    isError,
    navtabsData:
      page === "home"
        ? ["all", "design", "fashion", "lifestyle", "talks"]
        : [searchParams.get("search")!],
    page,
  };

  return searchParams === undefined ? (
    <Loading />
  ) : (
    <main className="home">
      {/* banner */}
      {page === "home" && (
        <section className="banner p-rel">
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
        {/* mainposts */}
        <MainPostComponent {...mainPostProps} />

        {/* side content */}
        <SideContent {...{ page, searchParams }} />
      </section>

      {/* ads */}
      <GoogleAds />

      {/* Popular posts */}
      <MostViewedPosts query="all" />

      <section className="more-content main-content d-grid">
        {/* featured posts */}
        <FeaturedPosts query="all" />

        {/* tweets */}
        <Tweets />
      </section>
    </main>
  );
};

export default Home;
