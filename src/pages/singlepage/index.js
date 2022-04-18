import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaAngleLeft,
  FaAngleRight,
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
  FaGooglePlus,
  FaPinterest,
} from "react-icons/fa";

import { FollowTab, SideContent, FeaturedPosts } from "../../components/post";
import {
  Empty,
  Alerts,
  BASE_URL,
  GoogleAds,
  Loading,
} from "../../components/misc";
import "./css/singlepage.css";
import "./css/responsive.css";

import AdminImg from "../../images/admin.webp";
import AnonImg from "../../images/noprofile.webp";

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
  const createComment = ({ currentTarget: c }) => {
    const form = new FormData(c),
      submitBtn = c.querySelector("button");

    // disable btn
    submitBtn.disabled = true;

    // append post id
    form.append("id", id);

    // create comment
    axios
      .post("http://127.0.0.1:8000/api/post/posts/comment/", form)
      .then((res) => {
        c.reset();
        submitBtn.disabled = false;

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
        submitBtn.disabled = false;
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
        .get(`${BASE_URL}/api/post/posts/singlepost/?id=${id}`)
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
                      {postData.comments.slice(0, commentPage).map((it) => {
                        return <Comment {...it} img={AnonImg} />;
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
                  e.preventDefault();
                  createComment(e);
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
  image,
  title,
  featured,
  author,
  total_comments,
  views,
  paragraphs,
  tags,
  query,
}) => {
  const followData = [
    [<FaFacebookSquare />, "#", "facebook"],
    [<FaTwitter />, "#", "twitter"],
    [<FaInstagram />, "#", "instagram"],
    [<FaGooglePlus />, "#", "google"],
    [<FaPinterest />, "#", "pinterest"],
  ];
  return (
    <section className="pagedetailscont d-grid">
      {/* postimg */}
      <article className="postimg">
        <img src={image} alt="postbanner" />
      </article>

      {/* header */}
      <header className="d-grid">
        <div className="links">
          <Link to="/">Home</Link>

          <FaAngleRight />

          <Link to={`/${query}`}>{query}</Link>

          <FaAngleRight />
          <span>{title}</span>
        </div>

        <div className="categories d-flex">
          {featured && <button className="btn">FEATURED</button>}
          <button className="btn">{query}</button>
        </div>

        <h2 className="title">{title}</h2>

        <div className="info d-flex">
          <span>
            <FaRegClock /> MARCH 1, 2022
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
      <article className="page-content d-grid">
        {paragraphs.map(({ image, text }, i) => {
          return image ? (
            <div>
              <img src={image} alt="post img" />
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
          {tags.split(",").map((it, i) => {
            return <Link to={`/search?search=${it}&tagonly=true`}>#{it}</Link>;
          })}
        </div>
      </article>

      {/* pagination */}
      <div className="paginate d-grid">
        <button>
          <FaAngleLeft /> Previous
        </button>

        <button>
          Next <FaAngleRight />
        </button>
      </div>

      {/* author */}
      <article className="author">
        <Comment
          name={"Chinedu Emeka"}
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
    [<FaFacebookSquare />, "http://"],
    [<FaTwitter />, "http://"],
    [<FaInstagram />, "http://"],
    [<FaWhatsapp />, "http://"],
    [<FaTelegramPlane />, "http://"],
  ];
  return (
    <article className="comment d-grid jcc">
      <img src={img} alt="profile" />
      <div className="text-part">
        <p className="name d-flex jcsb">
          {name}
          <span>
            <FaRegClock /> MARCH 1, 2022
          </span>
        </p>
        <p className="text">{comment}</p>
        <div className="social-links d-flex">
          {social.map(([icon, link]) => {
            return (
              <a href={link} target="_blank" rel="noreferrer">
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
