import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

import "./css/index.css";
import Googlead from "../../images/add-1.webp";

const BASE_URL = "http://127.0.0.1:8000";
// No data
const Empty = ({ text, text1, text2, height }) => {
  return (
    <article class="empty d-grid aic jcc" style={{ height }}>
      <div className="inner">
        <p>{text1}</p>
        <p>{text}</p>
        <span>{text2}</span>
      </div>
    </article>
  );
};

// loading
const Loading = () => {
  return (
    <p
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: 1000,
      }}
    >
      Loading...
    </p>
  );
};

// small loading
const SmallLoading = () => {
  return (
    <p
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#39271b73",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: 1000,
      }}
    >
      Loading...
    </p>
  );
};

// alerts
const Alerts = ({ message, error, show }) => {
  return (
    <div className={`alerts d-flex aic jcc p-fixed ${show ? "show" : ""}`}>
      <div className={`inner d-flex aic jcc ${error === true ? "error" : ""}`}>
        {error === true ? (
          <FaInfoCircle />
        ) : (
          error === false && <FaCheckCircle />
        )}
        <p>{message}</p>
      </div>
    </div>
  );
};

// GoogleAds
const GoogleAds = () => {
  return (
    <article className="google-ads">
      <img src={Googlead} alt="googlead" />
    </article>
  );
};

export { Empty, SmallLoading, Loading, Alerts, GoogleAds, BASE_URL };
