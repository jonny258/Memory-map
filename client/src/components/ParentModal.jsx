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
      {props.isEdit ? (
        <EditModal
          {...props}
          tempDescription={tempDescription}
          handler={editButtonHandler}
        />
      ) : (
        <DisplayModal {...props} tempDescription={tempDescription} />
      )}
    </>
  );
}

export default ParentModal;
