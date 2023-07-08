import React from "react";
import "../assets/css/loading.css";

const Loading = () => {
  return (
    <>
      <div
        className="modal fade show d-block loading-parent-modal"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-dialog-centered">
            <div className="load-1">
              <h1>Loading</h1>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
            </div>

        </div>
      </div>
    </>
  );
};

export default Loading;
