import { useState, useEffect, useRef } from "react";
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
import LazyImage from "../../images/lazyimage.webp";
import { useFetch, useObserver } from "../../hooks";
import {
  archiveTab,
  mainPosts,
  paginatedResponse,
  post,
} from "../../interfaces";
// Paginate

const Paginate = ({ posts, to }: { posts: paginatedResponse; to: string }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // get numbers from string
  const getNumbersFromString = (str: string) => {
    let arr: number[] = str
      .replace(BASE_URL, "")
      .split("")
      .reduce((a: number[], b: string) => {
        if (+b) {
          a.push(+b);
        }
        return a;
      }, []);
    return arr.join("");
  };

  return (
    <ScrollLink
      to={to}
      spy={true}
      offset={-100}
      style={{ display: "block" }}
      role="button"
    >
      <div className="paginate d-grid">
        <button
          className={posts.previous ? "" : "inactive"}
          onClickCapture={(e) => {
            if (posts.previous) {
              searchParams.set(
                "pg",
                posts.previous.includes("page")
                  ? getNumbersFromString(posts.previous)
                  : "1"
              );

              setSearchParams(searchParams);
            } else {
              e.stopPropagation();
            }
          }}
        >
          <FaAngleLeft /> Previous
        </button>

        <button
          className={posts.next ? "" : "inactive"}
          onClickCapture={(e) => {
            if (posts.next) {
              searchParams.set("pg", getNumbersFromString(posts.next));
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

const MainPostComponent = ({
  data,
  isLoading,
  isError,
  navtabsData,
  page,
  category,
}: mainPosts) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // lazy load
  const parentRef = useRef<HTMLDivElement>(null);
  useObserver({ ref: parentRef });

  // tabs
  const tabValue = category
    ? `${category}`
    : searchParams.has("tagonly")
    ? `Tags`
    : searchParams.has("search")
    ? `Search`
    : `${searchParams.get("cat") || "all"}`;

  return (
    <div className="card-cont" ref={parentRef}>
      {/* card-nav */}
      <div className="nav-tabs" id="nav-tabs">
        <ul className="d-flex">
          <li> {`${tabValue} ( ${data?.count || 0} )`}</li>
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
                {text?.slice(0, 25)}
              </li>
            );
          })}
        </ul>
      </div>

      {/* cards */}
      {isLoading ? (
        <SmallLoading />
      ) : isError ? (
        <Empty
          {...{
            text2:
              "You're currently offline. Please check your network connection.",
          }}
        />
      ) : data?.results.length ? (
        <>
          <div className="cards d-grid">
            {data?.results.map((it: any, id: any) => {
              return <Card {...it} key={id} index={id} />;
            })}
          </div>

          <Paginate
            {...{
              posts: data,
              to: "nav-tabs",
            }}
          />
        </>
      ) : (
        <Empty
          {...{
            text: "No Posts Found!",
            text2: "Hopefully, there'll be something next time",
          }}
        />
      )}
    </div>
  );
};

// Featured Posts
const FeaturedPosts = ({
  query,
  title,
  url,
}: {
  query?: string;
  title?: string;
  url?: string;
}) => {
  // featured
  const [featuredPostsUrl, setFeaturedPostsUrl] = useState<
      string | undefined
    >(),
    parentRef = useRef<HTMLDivElement>(null);

  const { data: featuredPosts, isError: featuredPostsError } = useFetch(
    `${query}featuredPosts`,
    featuredPostsUrl!,
    featuredPostsUrl
  );

  //featured
  useEffect(() => {
    url
      ? setFeaturedPostsUrl(url)
      : setFeaturedPostsUrl(
          `${BASE_URL}/api/post/posts/filter/?featured=${query}`
        );
  }, [query, url]);

  // lazy load
  useObserver({ ref: parentRef });

  return (
    /* featured posts */
    <div
      className="card-cont featured-posts"
      id="featured-posts"
      ref={parentRef}
    >
      <header className="header">
        <h3>{title || "Featured Posts"}</h3>
      </header>
      {/* cards */}
      {featuredPostsError ? (
        <Empty
          {...{
            text2:
              "You're currently offline. Please check your network connection.",
          }}
        />
      ) : featuredPosts?.data.results.length ? (
        <>
          <div className="cards d-grid">
            {featuredPosts?.data.results.map((it: any, id: any) => {
              return <Card {...it} key={id} index={4} />;
            })}
          </div>
        </>
      ) : (
        <Empty
          {...{
            text: "No Posts found!",
            text2: "Hopefully, there'll be something next time",
          }}
        />
      )}
    </div>
  );
};

// most viewed posts
const MostViewedPosts = ({ query }: { query: string }) => {
  const { data, isError } = useFetch(
    query,
    `${BASE_URL}/api/post/posts/filter/?most_viewed=${query}`,
    query
  );

  // lazy load
  const parentRef = useRef<HTMLDivElement>(null);
  useObserver({ ref: parentRef });

  return data?.data.count === 0 ? (
    <Empty
      {...{
        text: "No Posts found!",
        text2: "Hopefully, there'll be something next time",
      }}
    />
  ) : (
    <section className="most-viewed" ref={parentRef}>
      <header className="header">
        <h3>Most Viewed</h3>
      </header>

      <article className="slide d-grid">
        {isError ? (
          <Empty
            {...{
              text2:
                "You're currently offline. Please check your network connection.",
            }}
          />
        ) : (
          <>
            {data?.data.results.map((it: any, id: any) => {
              return <PhotoCard {...it} key={id} />;
            })}
          </>
        )}
      </article>
    </section>
  );
};

// side content
const SideContent = ({
  page,
  searchParams,
}: {
  page: string;
  searchParams?: URLSearchParams;
}) => {
  const path = useParams();

  const [categoriesData, setCategoriesdata] = useState<archiveTab["data"]>(),
    [archivesData, setArchivesData] = useState<archiveTab["data"]>(),
    // popular
    [popularPostsUrl, setPopularPostsUrl] = useState<string>();

  useEffect(() => {
    setPopularPostsUrl(
      (page === "home" &&
        `${BASE_URL}/api/post/posts/filter/?popular=${
          searchParams?.get("cat") || "all"
        }`) ||
        (page === "singlepost" &&
          `${BASE_URL}/api/post/posts/filter/?popular=${path.category}&id=${path.id}`) ||
        (page === "category"
          ? `${BASE_URL}/api/post/posts/filter/?popular=${path.category}`
          : undefined)
    );
  }, [searchParams, path.category, path.id]);

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
      );
  }, []);

  // fetch data
  const { data, isError: isPopularError } = useFetch(
    `popular${page}PostsData`,
    popularPostsUrl as string,
    popularPostsUrl
  );

  // lazy load
  const parentRef = useRef<HTMLDivElement>(null);
  useObserver({ ref: parentRef });

  return (
    <aside className="d-grid side-content">
      {/* purchase box */}
      <article className="purchase-box p-rel">
        <img src={Affiliate} alt="affiliate" className="d-block" />
        <div className="overlay p-abs size-100 d-flex aic jcc">
          <h3>The Dawn</h3>
          <p>Follow the path that leads to morning.</p>
          <a
            href="https://friendlee.netlify.app"
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
      {data?.data.count !== 0 && page !== "search" && (
        <>
          <article
            className="popular-tabs d-grid"
            id="popular-tabs"
            ref={parentRef}
          >
            <header className="header">
              <h3>Popular</h3>
            </header>

            <div className="minicards-cont d-grid">
              {isPopularError ? (
                <Empty
                  {...{
                    text2:
                      "You're currently offline. Please check your network connection.",
                  }}
                />
              ) : (
                data?.data.results.map((it: post, id: number) => {
                  return <MiniCard {...it} key={id} />;
                })
              )}
            </div>
          </article>

          {/* categories tab and archives tab */}
          {!isPopularError && page !== "singlepost" && (
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
          )}
        </>
      )}
    </aside>
  );
};

// follow tab
const FollowTab = ({ data }: { data?: (string | JSX.Element)[][] }) => {
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
              <a
                href={link as string}
                target={data && "_blank"}
                rel={data && "noreferrer"}
                className={`d-flex aic jcc ${classname}`}
                aria-label={`${classname}-link`}
                role="button"
              >
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
const CategoriesTab = ({ data, title }: archiveTab) => {
  return (
    <article className="categories-tab">
      <header className="header">
        <h3>{title}</h3>
      </header>

      <ul>
        {data ? (
          data.map(({ text, count }, i) => {
            return (
              <li key={i}>
                <FaAngleDoubleRight /> <Link to={`/${text}`}>{text}</Link> ({" "}
                {count} )
              </li>
            );
          })
        ) : (
          <Empty
            {...{
              text2:
                "You're currently offline. Please check your network connection.",
            }}
          />
        )}
      </ul>
    </article>
  );
};

// tweets
const Tweets = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  useObserver({ ref: parentRef });
  return (
    <aside ref={parentRef}>
      {[
        ["RECENT TWEETS", FacebookLike],
        ["FACEBOOK LIKES", FacebookLike],
      ].map((item, id) => (
        <div className="tweets" key={id}>
          <header className="header">
            <h3>{item[0]}</h3>
          </header>
          <img
            data-src={item[1]}
            src={LazyImage}
            alt="facebooklikes"
            className="lazyimg"
          />
        </div>
      ))}
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
