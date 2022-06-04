import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaAngleDown,
  FaRegEye,
  FaRegUser,
  FaRegComment,
  FaRegClock,
  FaTags,
  FaRegShareSquare,
  FaFacebookSquare,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaTelegramPlane,
  FaRedditAlien,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa";

import { FollowTab, SideContent, FeaturedPosts } from "../../components/post";
import {
  Empty,
  Alerts,
  BASE_URL,
  DOMAIN,
  GoogleAds,
  Loading,
} from "../../components/misc";
import "./css/singlepage.css";

import AdminImg from "../../images/admin.webp";
import AnonImg from "../../images/noprofile.webp";
import LazyImg from "../../images/lazyimage.webp";
import { useObserver } from "../../App";

const SinglePage = () => {
  const { category: query, id } = useParams(),
    [postData, setPostData] = useState(),
    [postDataLoading, setPostDataLoading] = useState(true),
    // related posts
    [relatedPostData, setRelatedPostData] = useState(),
    [relatedPostUrl, setRelatedPostUrl] = useState(),
    // comment
    [commentAlert, setCommentAlert] = useState({ message: "", show: false });

  const [commentPage, setCommentPage] = useState(4);

  // create comment
  const createComment = ({ currentTarget: c }, btn) => {
    const form = new FormData(c);
    // append post id
    form.append("id", id);

    // create comment
    axios
      .post(`${BASE_URL}/api/post/posts/comment/`, form)
      .then((res) => {
        c.reset();
        btn.style.opacity = "1";
        btn.disabled = false;
        btn.textContent = "POST COMMENT";

        setCommentAlert({
          message: "Comment posted successfully",
          error: false,
          show: true,
        });
        setPostData((prev) => {
          return {
            ...prev,
            total_comments: prev.total_comments + 1,
            comments: res.data.results,
          };
        });

        setTimeout(() => {
          setCommentAlert((prev) => {
            return { ...prev, show: false };
          });
        }, 1200);
      })
      .catch((err) => {
        c.reset();
        btn.style.opacity = "1";
        btn.disabled = false;
        btn.textContent = "POST COMMENT";
        setCommentAlert({
          message: "There was a problem posting your comment!",
          error: true,
          show: true,
        });
        setTimeout(() => {
          setCommentAlert((prev) => {
            return { ...prev, show: false };
          });
        }, 1500);
      });
  };

  // fetch post data
  useEffect(() => {
    setPostDataLoading(true);
    id &&
      axios
        .get(
          `${BASE_URL}/api/post/posts/singlepost/?category=${query}&id=${id}`
        )
        .then((res) => {
          setPostData(res.data.results[0]);
          // !relatedPostUrl &&
          setRelatedPostUrl(
            `${BASE_URL}/api/post/posts/filter/?relatedcategory=${query}&relatedtag=${res.data.results[0].tags}&id=${id}`
          );
          setPostDataLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setPostData("404");
        });
  }, [id, query]);

  // fetch related post data
  useEffect(() => {
    relatedPostUrl &&
      axios
        .get(relatedPostUrl)
        .then((res) => {
          setRelatedPostData(res.data);
          console.log(res.data);
        })
        .catch((err) => console.error(err));
  }, [relatedPostUrl]);

  return postData === "404" ? (
    <Empty
      {...{
        text1: "404!",
        text: "Page Not Found",
        text2:
          "This page may have been moved or deleted or the URL you entered is incorrect",
        height: "75vh",
      }}
    />
  ) : (
    <>
      {/* comment alert */}
      <Alerts {...commentAlert} />

      <main className="singlepage">
        {/* main content */}
        <section className="main-content d-grid">
          {/* pagedetailscont */}
          {postDataLoading ? (
            <Loading />
          ) : (
            <SinglePostComponent {...postData} query={query} />
          )}

          {/* sidecontent */}

          <SideContent page="singlepost" />

          {/* commenmts */}
          <article className="comments d-grid">
            {postDataLoading === false && (
              <div className="main">
                <header className="header" id="comments">
                  <h3>Comments ( {postData.total_comments} )</h3>
                </header>

                {postData.comments.length ? (
                  <>
                    {/* comments */}
                    <div className="inner d-grid">
                      {postData.comments.slice(0, commentPage).map((it, id) => {
                        return <Comment {...it} img={AnonImg} key={id} />;
                      })}
                    </div>
                    {/* pagination */}
                    {postData.total_comments > 0 &&
                      commentPage < postData.total_comments && (
                        <div className="paginate d-grid">
                          <button
                            onClick={() => {
                              setCommentPage((prev) => prev + 4);
                            }}
                          >
                            <FaAngleDown /> More
                          </button>
                        </div>
                      )}
                  </>
                ) : (
                  <Empty
                    {...{
                      text: "No comments!",
                      text2: "Be the first to leave a comment",
                      height: "200px",
                    }}
                  />
                )}
              </div>
            )}

            {/* addcomment */}
            <aside>
              <p>Have something to contribute?</p>
              <form
                onSubmit={(e) => {
                  let btn = e.currentTarget.lastElementChild;
                  btn.style.opacity = "0.5";
                  btn.disabled = true;
                  btn.textContent = "SAVING...";
                  e.preventDefault();
                  createComment(e, btn);
                }}
              >
                <input
                  type="text"
                  placeholder="NAME"
                  name="name"
                  required
                  maxLength={50}
                />
                <textarea
                  required
                  name="comment"
                  placeholder="ENTER COMMENT..."
                  maxLength={250}
                ></textarea>
                <button type="submit" className="btn">
                  POST COMMENT
                </button>
              </form>
            </aside>
          </article>
        </section>

        <GoogleAds />

        {/* more */}
        {/* more content */}
        <section className="more-content main-content d-grid">
          {relatedPostData && (
            <FeaturedPosts
              {...{ title: "Related Posts", data: relatedPostData }}
            />
          )}
        </section>
      </main>
    </>
  );
};

const SinglePostComponent = ({
  id,
  image,
  title,
  date,
  featured,
  author,
  total_comments,
  views,
  paragraphs,
  tags,
  query,
}) => {
  const path = useLocation();
  const followData = [
    [
      <FaFacebookSquare />,
      `https://www.facebook.com/sharer/sharer.php?u=${DOMAIN}${path.pathname}`,
      "facebook",
    ],
    [
      <FaTwitter />,
      `https://twitter.com/intent/tweet?url=${DOMAIN}${path.pathname}&text=Fashionista Blog`,
      "twitter",
    ],
    [
      <FaRedditAlien />,
      `http://reddit.com/submit?url=${DOMAIN}${path.pathname}%23&title=Fashionista%20Blog`,
      "reddit",
    ],
    [
      <FaLinkedin />,
      `http://www.linkedin.com/shareArticle?url=${DOMAIN}${path.pathname}%23&title=Fashionista%20Blog`,
      "linkedin",
    ],
    [
      <FaPinterest />,
      `https://pinterest.com/pin/create/button/?url=${DOMAIN}${path.pathname}%23&description=FashionistaBlog`,
      "pinterest",
    ],
  ];

  // lazy load
  const parentRef = useRef();
  useObserver({ ref: parentRef, data: id });

  return (
    <section className="pagedetailscont d-grid">
      {/* postimg */}
      <article className="postimg p-rel">
        <img src={image} alt="postbanner" />
      </article>

      {/* header */}
      <header className="d-grid">
        <div className="links">
          <Link to="/">Home </Link> &rarr; <Link to={`/${query}`}>{query}</Link>{" "}
          &rarr; <span>{title}</span>
        </div>

        <div className="categories d-flex">
          {featured && <button className="btn">FEATURED</button>}
          <button className="btn">{query}</button>
        </div>

        <h2 className="title">{title}</h2>

        <div className="info d-flex">
          <span>
            <FaRegClock />{" "}
            {new Date(date).toDateString().slice(4).toLocaleUpperCase()}
          </span>
          <span>
            <FaRegUser /> BY {author}
          </span>
          <span>
            <FaRegComment /> {total_comments} COMMENTS
          </span>
          <span>
            <FaRegEye /> {views} VIEWS
          </span>
        </div>

        <div className="share d-flex aic">
          <span>
            <FaRegShareSquare /> SHARE:
          </span>
          <FollowTab data={followData} />
        </div>
      </header>

      {/* content */}
      <article className="page-content d-grid" ref={parentRef}>
        {paragraphs.map(({ image, text }, id) => {
          return image ? (
            <div key={id}>
              <div className="pagecontentimg p-rel">
                <img
                  src={LazyImg}
                  alt="post img"
                  data-src={image}
                  className="lazyimg"
                />
              </div>
              <p dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
          ) : (
            <p dangerouslySetInnerHTML={{ __html: text }}></p>
          );
        })}
      </article>

      {/* tags */}

      <article className="tags d-flex aic">
        <span>
          <FaTags /> TAGS:
        </span>
        <div className="d-flex">
          {tags.split(",").map((it, id) => {
            return (
              <Link to={`/search?search=${it}&tagonly=true`} key={id}>
                #{it}
              </Link>
            );
          })}
        </div>
      </article>

      {/* pagination */}
      {/* <div className="paginate d-grid">
        <button>
          <FaAngleLeft /> Previous
        </button>

        <button>
          Next <FaAngleRight />
        </button>
      </div> */}

      {/* author */}
      <article className="author">
        <Comment
          name={"Chinedu Israele"}
          comment={
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure modivitae aspernatur est, distinctio maxime tempora"
          }
          img={AdminImg}
        />
      </article>
    </section>
  );
};

const Comment = ({ name, comment, date, img }) => {
  const social = [
    [<FaFacebookSquare />, "#0"],
    [<FaTwitter />, "#0"],
    [<FaInstagram />, "#0"],
    [<FaWhatsapp />, "#0"],
    [<FaTelegramPlane />, "#0"],
  ];
  return (
    <article className="comment d-grid jcc">
      <img src={img} alt="profile" />
      <div className="text-part">
        <p className="name d-flex jcsb">
          {name}
          <span>
            <FaRegClock />{" "}
            {new Date(date).toDateString().slice(4).toLocaleUpperCase()}
          </span>
        </p>
        <p className="text">{comment}</p>
        <div className="social-links d-flex">
          {social.map(([icon, link], id) => {
            return (
              <a href={link} key={id}>
                {icon}
              </a>
            );
          })}
        </div>

        <div className="social-links d-flex"></div>
      </div>
    </article>
  );
};

export default SinglePage;

// 379 lines
