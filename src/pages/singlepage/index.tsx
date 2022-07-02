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
  SmallLoading,
} from "../../components/misc";
import "./css/singlepage.css";

import AdminImg from "../../images/admin.webp";
import AnonImg from "../../images/noprofile.webp";
import LazyImg from "../../images/lazyimage.webp";
import { useObserver } from "../../hooks";
import { comment, paragraph, post, postGen } from "../../interfaces";

const SinglePage = () => {
  const { category: query, id } = useParams(),
    [postData, setPostData] = useState<any>(),
    [postDataLoading, setPostDataLoading] = useState(true),
    [postError, setPostError] = useState<string>(),
    // related posts
    [relatedPostUrl, setRelatedPostUrl] = useState<string>(),
    // comment
    [commentAlert, setCommentAlert] = useState({
      message: "",
      show: false,
      error: false,
    });

  const [commentPage, setCommentPage] = useState(4);

  // create comment
  const createComment = (
    { currentTarget: c }: React.FormEvent<HTMLFormElement>,
    btn: HTMLButtonElement
  ) => {
    const form = new FormData(c);
    // append post id
    form.append("id", id as string);

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
        setPostData((prev: any) => {
          const { total_comments } = prev!;
          return {
            ...(prev as post),
            total_comments: (total_comments as number) + 1,
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
          setPostDataLoading(false);
          if (err.response) setPostError("request error");
          else {
            setPostError("response error");
          }
        });
  }, [id, query]);

  return postError === "response error" ? (
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

          <SinglePostComponent
            {...postData}
            {...{ postDataLoading, postError, query }}
          />

          {/* sidecontent */}

          <SideContent page="singlepost" />

          {/* commenmts */}
          <article className="comments d-grid">
            {postDataLoading === false && (
              <div className="main">
                <header className="header" id="comments">
                  <h3>Comments ( {postData?.total_comments} )</h3>
                </header>

                {postData?.comments.length ? (
                  <>
                    {/* comments */}
                    <div className="inner d-grid">
                      {postData?.comments
                        .slice(0, commentPage)
                        .map((it: any, id: number) => {
                          return <Comment {...it} img={AnonImg} key={id} />;
                        })}
                    </div>
                    {/* pagination */}
                    {postData?.total_comments > 0 &&
                      commentPage < postData?.total_comments && (
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
                  let btn = e.currentTarget
                    .lastElementChild as HTMLButtonElement;
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
          {relatedPostUrl && (
            <FeaturedPosts
              {...{ title: "Related Posts", url: relatedPostUrl }}
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
  postDataLoading,
  postError,
}: postGen) => {
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
  const parentRef = useRef<HTMLDivElement>(null);
  useObserver({ ref: parentRef });

  return (
    <section className="pagedetailscont d-grid">
      {postDataLoading ? (
        <SmallLoading />
      ) : postError === "request error" ? (
        <Empty
          {...{
            text2:
              "You're currently offline. Please check your network connection.",
          }}
        />
      ) : (
        <>
          <article className="postimg p-rel">
            <img src={image} alt="postbanner" />
          </article>

          {/* header */}
          <header className="d-grid">
            <div className="links">
              <Link to="/">Home </Link> &rarr;{" "}
              <Link to={`/${query}`}>{query}</Link> &rarr; <span>{title}</span>
            </div>

            <div className="categories d-flex">
              {featured && <button className="btn">FEATURED</button>}
              <button className="btn">{query}</button>
            </div>

            <h2 className="title">{title}</h2>

            <div className="info d-flex">
              <span>
                <FaRegClock />{" "}
                {new Date(date as string)
                  .toDateString()
                  .slice(4)
                  .toLocaleUpperCase()}
              </span>
              <span>
                <FaRegUser /> BY ADMIN
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
            {paragraphs?.map(({ image, text }: paragraph, id: number) => {
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
              {tags?.split(",").map((it: string, id: number) => {
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
        </>
      )}
    </section>
  );
};

const Comment = ({ name, comment, date, img }: comment) => {
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
            {new Date(date as string)
              .toDateString()
              .slice(4)
              .toLocaleUpperCase()}
          </span>
        </p>
        <p className="text">{comment}</p>
        <div className="social-links d-flex">
          {social.map(([icon, link], id) => {
            return (
              <a href={link as string} key={id}>
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
