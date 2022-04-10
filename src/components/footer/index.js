import React, { useState } from "react";
import axios from "axios";
import { Alerts, BASE_URL } from "../misc";
import { FollowTab } from "../post";
import "./css/index.css";

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
          message:
            "The email you entered is already subscribed to our Newsletter service!",
          error: true,
        });

        setTimeout(() => {
          setAlerts({
            show: false,
            message:
              "The email you entered is already subscribed to our Newsletter service!",
            error: true,
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
            message:
              "The email you entered is already subscribed to our Newsletter service!",
            error: true,
          });
        }, 1500);
      });
  };
  const imgData = [
      "./images/test-instagram/instagram-1(1).jpg",
      "./images/test-instagram/instagram-2(1).jpg",
      "./images/test-instagram/instagram-3(1).jpg",
      "./images/test-instagram/instagram-4(1).jpg",
      "./images/test-instagram/instagram-8.jpg",
      "./images/test-instagram/instagram-5(1).jpg",
      "./images/test-instagram/instagram-6.jpg",
      "./images/test-instagram/instagram-1(1).jpg",
    ],
    followData = [
      ["fab fa-facebook", "#"],
      ["fab fa-twitter", "#"],
      ["fab fa-instagram", "#"],
      ["fab fa-whatsapp", "#"],
      ["fab fa-telegram", "#"],
      ["fab fa-discord", "#"],
      ["fab fa-google-plus", "#"],
      ["fab fa-pinterest", "#"],
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
            <FollowTab data={followData} />
          </article>
        </article>

        <article className="d-flex jcsb third">
          <p>
            Created with <i class="fa fa-heart"></i> by
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
