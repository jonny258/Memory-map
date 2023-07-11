import React, { useState } from "react";
import EditModal from "./EditModal";
import DisplayModal from "./DisplayModal";

function ParentModal(props) {
  const [tempDescription, setTempDescription] = useState();

  const editButtonHandler = (title, description, image) => {
    setTempDescription({
      title: title,
      description: description,
      image: image,
    });
  };

  return (
    <>
      <div className="modal-backdrop-custom fade show"></div>
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
        onClick={(event) => event.target.className === "modal fade show" && props.setActiveModal(-1)}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content modal-sizing">
            {props.isEdit ? (
              <EditModal
                {...props}
                tempDescription={tempDescription}
                handler={editButtonHandler}
              />
            ) : (
              <DisplayModal {...props} tempDescription={tempDescription} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ParentModal;
