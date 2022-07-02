import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

import {
  MainPostComponent,
  FeaturedPosts,
  SideContent,
  MostViewedPosts,
  Tweets,
} from "../../components/post";
import { Loading, BASE_URL, GoogleAds } from "../../components/misc";

import "../home/css/home.css";
import { useFetch } from "../../hooks";

// home
const CategoryPage = () => {
  const [searchParams] = useSearchParams(),
    { category } = useParams();

  // set page type
  const page = "category";

  const [mainPostsUrl, setMainPostsUrl] = useState<string>(),
    { data, isLoading, isError } = useFetch(
      category!,
      mainPostsUrl!,
      mainPostsUrl
    );

  // fetch data
  useEffect(() => {
    setMainPostsUrl(
      `${BASE_URL}/api/post/posts/filter/?category=${category}&page=${
        searchParams.get("pg") || 1
      }`
    );
  }, [category, searchParams]);

  // main
  // useEffect(() => {
  //   setMainPostsLoading(true);

  //   mainPostsUrl &&
  //     axios
  //       .get(mainPostsUrl)
  //       .then((mainposts) => {
  //         setMainPosts(mainposts.data);
  //         setMainPostsLoading(false);
  //       })
  //       .catch((err) => console.log(err));
  // }, [mainPostsUrl]);

  const mainPostProps = {
    data: data?.data,
    isLoading,
    isError,
    navtabsData: [category!],
    page,
  };

  return (
    <main className="home">
      <section className="main-content d-grid">
        <MainPostComponent {...mainPostProps} />

        {/* side content */}
        <SideContent page={page} />
      </section>

      {/* ads */}
      <GoogleAds />

      {/* Popular posts */}
      <MostViewedPosts query={category as string} />

      <section className="more-content main-content d-grid">
        {/* featured posts */}
        <FeaturedPosts query={category} />

        {/* tweets */}
        <Tweets />
      </section>
    </main>
  );
};

export default CategoryPage;
