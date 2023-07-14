import React from "react";

function SocialDiaplayModal({ setActiveMarker, activeMarker }) {
  return (
    <>
      <div className="modal-backdrop-custom fade show"></div>
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
        onClick={(event) =>
          event.target.className === "modal fade show" && setActiveMarker(null)
        }
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content modal-sizing">
            <div className="modal-header d-flex justify-content-between">
              <h2 className="modal-title" id="modalDataTitle">
                {activeMarker.title}
              </h2>
              <div className="text-end">
                <h6>
                  {activeMarker.name ? activeMarker.name : "Default Name"}
                </h6>
                <p>{activeMarker.date}</p>
              </div>
            </div>
            <div className="modal-body" id="modalDataBody">
              {activeMarker.image && (
                <div className="display-picture">
                  <img src={activeMarker.image} />
                </div>
              )}
              <p>{activeMarker.description}</p>
            </div>
            <div className="custom-modal-footer">
              <button
                id="left-button"
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveMarker(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SocialDiaplayModal;
