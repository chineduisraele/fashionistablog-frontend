import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";

import axios from "axios";
import { Alerts, BASE_URL } from "../misc";
import { FollowTab } from "../post";
import "./css/index.css";

import Image1 from "../../images/instagram/1.webp";
import Image2 from "../../images/instagram/2.webp";
import Image3 from "../../images/instagram/3.webp";
import Image4 from "../../images/instagram/4.webp";
import Image5 from "../../images/instagram/5.webp";
import Image6 from "../../images/instagram/6.webp";
import Image7 from "../../images/instagram/7.webp";
import Image8 from "../../images/instagram/8.webp";

const Footer = () => {
  const [alerts, setAlerts] = useState({
    show: false,
    message: "",
    error: "false",
  });

  const handleForm = (e) => {
    let form = new FormData(e.currentTarget);
    axios
      .post(`${BASE_URL}/api/post/newsfeed/`, form)
      .then((res) => {
        setAlerts({
          show: true,
          message: "Thank you for subscribing to our Newsletter service!",
          error: false,
        });

        setTimeout(() => {
          setAlerts({
            show: false,
          });
        }, 1500);
      })
      .catch((err) => {
        setAlerts({
          show: true,
          message:
            "The email you entered is already subscribed to our Newsletter service!",
          error: true,
        });

        setTimeout(() => {
          setAlerts({
            show: false,
          });
        }, 1500);
      });
  };
  const imgData = [
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
    Image7,
    Image8,
  ];

  return (
    <footer>
      <Alerts
        message={alerts.message}
        show={alerts.show}
        error={alerts.error}
      />

      <div className="inner">
        <article className="second d-grid  jcc">
          <article className="subscribeform d-grid">
            <h3>NEWSLETTER</h3>
            <p>Get latest posts delivered right to your inbox!</p>
            <form
              className="d-grid rg-1"
              method="POST"
              onSubmit={(e) => {
                e.preventDefault();
                handleForm(e);
              }}
            >
              <input type="name" name="name" placeholder="NAME" />
              <input type="email" name="email" placeholder="EMAIL" />
              <button className="btn f-bold" type="submit">
                Subscribe
              </button>
            </form>
          </article>
          <article className="instagram d-grid">
            <h3>INSTAGRAM PHOTOS</h3>
            <div className="d-grid aic-jcc">
              {imgData.map((it) => {
                return <img src={it} alt="" />;
              })}
            </div>
          </article>
          <article className="socials d-grid">
            <h3>SOCIAL LINKS</h3>
            <FollowTab />
          </article>
        </article>

        <article className="d-flex jcsb third">
          <p>
            Created with <FaHeart /> by
            <span>
              <img src="./images/fivefingers.png" alt="" />
              ive Fingers Dev.
            </span>
          </p>
          <p>Powered by Django. &copy; 2022</p>
        </article>
      </div>
    </footer>
  );
};

export default Footer;
