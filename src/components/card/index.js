import React from "react";
import { Link } from "react-router-dom";
import { FaRegClock, FaRegComment, FaRegEye } from "react-icons/fa";

import "./css/index.css";

const Card = ({
  id,
  thumbnail,
  category,
  title,
  total_comments,
  views,
  short_text,
}) => {
  return (
    <Link to={`/post/${category}/${id}`} className="card d-grid">
      <div className="card-img p-rel">
        <img src={thumbnail} alt="cardimg" />
        <p>{category}</p>
      </div>
      <div className="text-part d-grid">
        <h3>{title}</h3>
        <div className="info d-flex">
          <span>
            <FaRegClock /> MARCH 1, 2022
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
      <img src={thumbnail} alt="cardimg" />
      <div className="text d-grid">
        <h3>{title}</h3>
        <span>
          <FaRegClock /> MARCH 1, 2022
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
      <img src={thumbnail} alt="cardimg" />
      <div className="overlay p-abs d-flex aic jcc size-100">
        <p>{category}</p>
        <h3>{title}</h3>
        <div className="info d-flex">
          <span>
            <FaRegClock /> MARCH 1, 2022
          </span>
          <span>
            <FaRegComment /> {total_comments}
          </span>
          <span>
            <FaRegEye /> {views}
          </span>
        </div>
      </div>
    </Link>
  );
};

export { Card, MiniCard, PhotoCard };
