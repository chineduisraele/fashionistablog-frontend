import { FaInfoCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

import "./css/index.css";
import Googlead from "../../images/add-1.webp";
import { CSSProperties } from "react";

// const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL = "https://fashionistablog.herokuapp.com";

const DOMAIN = window.location.origin;

// No data
const Empty = ({
  text,
  text1,
  text2,
  height,
}: {
  text?: string;
  text1?: string;
  text2?: string;
  height?: string;
}) => {
  return (
    <article className="empty d-grid aic jcc" style={{ height }}>
      <div className="inner">
        <p>{text1}</p>
        <p>{text}</p>
        <span>{text2}</span>
      </div>
    </article>
  );
};

const LoadingSvg = ({
  style,
  stroke,
}: {
  style?: CSSProperties;
  stroke?: string;
}) => {
  return (
    <div className="loader" style={style}>
      <svg className="circular" viewBox="25 25 50 50">
        <circle
          className="path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth={stroke || "8"}
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
};

// loading
const Loading = () => {
  return (
    <div className="loading size-100 bg-w d-flex aic-jcc trans">
      <LoadingSvg />
    </div>
  );
};

// small loading
const SmallLoading = () => {
  return (
    <div
      className="loading size-100 bg-w d-flex aic-jcc trans"
      style={{
        backgroundColor: "#ba004b40",
      }}
    >
      <LoadingSvg style={{ width: "35px" }} stroke={"5"} />
    </div>
  );
};

// alerts
const Alerts = ({
  message,
  error,
  show,
}: {
  message: string;
  error?: boolean;
  show: boolean;
}) => {
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

export { Empty, SmallLoading, Loading, Alerts, GoogleAds, BASE_URL, DOMAIN };
