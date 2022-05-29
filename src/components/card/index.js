import React from "react";
import { Link } from "react-router-dom";
import { FaRegClock, FaRegComment, FaRegEye } from "react-icons/fa";

import "./css/index.css";
import LazyImage from "../../images/lazyimage.webp";

const Card = ({
  id,
  thumbnail,
  category,
  title,
  date,
  total_comments,
  views,
  short_text,
  index,
}) => {
  // console;
  return (
    <Link to={`/post/${category}/${id}`} className="card d-grid">
      <div className="card-img p-rel">
        <img
          data-src={thumbnail}
          src={index > 1 ? LazyImage : thumbnail}
          alt="cardimg"
          className={index > 1 ? "lazyimg" : ""}
        />
        <p>{category}</p>
      </div>
      <div className="text-part d-grid">
        <h3>{title}</h3>
        <div className="info d-flex">
          <span>
            <FaRegClock />{" "}
            {new Date(date).toDateString().slice(4).toLocaleUpperCase()}
          </span>
          <span>
            <FaRegComment /> {total_comments}
          </span>
          <span>
            <FaRegEye /> {views}
          </span>
        </div>
        <p className="content">{short_text}</p>
        <button>Read More</button>
      </div>
    </Link>
  );
};

const MiniCard = ({ id, thumbnail, category, title, date }) => {
  return (
    <Link to={`/post/${category}/${id}`} className="mini-card d-grid">
      <div className="imgcont p-rel">
        <img
          data-src={thumbnail}
          src={LazyImage}
          alt="cardimg"
          className="lazyimg"
        />
      </div>
      <div className="text d-grid">
        <h3>{title}</h3>
        <span>
          <FaRegClock />{" "}
          {new Date(date).toDateString().slice(4).toLocaleUpperCase()}
        </span>
      </div>
    </Link>
  );
};

const PhotoCard = ({
  id,
  thumbnail,
  category,
  title,
  date,
  total_comments,
  views,
}) => {
  return (
    <Link to={`/post/${category}/${id}`} className="photo-card p-rel">
      <img
        data-src={thumbnail}
        src={LazyImage}
        alt="cardimg"
        className="lazyimg"
      />
      <div className="overlay p-abs d-grid size-100">
        <div className="d-grid aic jcc">
          <p>{category}</p>
          <h3>{title}</h3>
          <div className="info d-flex">
            <span>
              <FaRegClock />{" "}
              {new Date(date).toDateString().slice(4).toLocaleUpperCase()}
            </span>
            <span>
              <FaRegComment /> {total_comments}
            </span>
            <span>
              <FaRegEye /> {views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export { Card, MiniCard, PhotoCard };
