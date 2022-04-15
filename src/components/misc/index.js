import React from "react";
import "./css/index.css";
import Gad from "../../images/add-1.webp";

const BASE_URL = "https://israelefashionistablog.herokuapp.com";
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
          <i className="fa fa-info-circle"></i>
        ) : (
          <i className="fa fa-check-circle"></i>
        )}
        <p>{message}</p>
      </div>
    </div>
  );
};

const GoogleAds = () => {
  return (
    <article className="google-ads">
      <img src={Gad} alt="ad" />
    </article>
  );
};

export { Empty, SmallLoading, Loading, Alerts, GoogleAds, BASE_URL };
