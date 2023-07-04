import React, { useState } from "react";
import EditModal from "./EditModal";
import DisplayModal from "./DisplayModal";

function ParentModal({
  setActiveModal,
  title,
  description,
  index,
  markerArr,
  setMarkersArr,
  name,
  date,
  isEdit,
  setIsEdit,
  deleteButtonHandler,
}) {
  const [tempDescription, setTempDescription] = useState();

  const editButtonHandler = (title, description) => {
    setTempDescription({
      title: title,
      description: description,
    });
    console.log(title, description);
  };

  const modalBackgroundHandler = (event) => {
    if (event.target.className === "modal fade show") {
      setActiveModal(-1);
    }
  };
  return (
    <>
      <div className="modal-backdrop-custom fade show"></div>
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
        onClick={modalBackgroundHandler}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content modal-sizing">
            {isEdit ? (
              <EditModal
              deleteButtonHandler={deleteButtonHandler}
                tempDescription={tempDescription}
                handler={editButtonHandler}
                markerArr={markerArr}
                setMarkersArr={setMarkersArr}
                index={index}
                title={title}
                description={description}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                setActiveModal={setActiveModal}
              />
            ) : (
              <DisplayModal
                name={name}
                date={date}
                tempDescription={tempDescription}
                title={title}
                description={description}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                setActiveModal={setActiveModal}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ParentModal;
