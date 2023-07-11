import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import "../assets/css/fileUploader.css";
import { useState } from "react";

function PictureUploader({ pictureState, setPictureState }) {
  const uploader = Uploader({ apiKey: "public_FW25bUsEgLaLmifCsyAEZMAxaX9j" });

  const [isUploaded, setIsUploaded] = useState(false);
  return (
    <UploadButton
      uploader={uploader}
      options={{
        multi: false,
        editor: {
          images: {
            crop: true,
            cropRatio: 1.5,
            cropShape: "rect",
            preview: true,
          },
        },
      }}
      onComplete={(files) => {
        console.log(files);
        setPictureState(files[0].fileUrl);
        setIsUploaded(true);
      }}
    >
      {({ onClick }) => (
        <button
          className={
            isUploaded
              ? "form-control upload-button btn btn-success"
              : "form-control upload-button btn btn-secondary"
          }
          onClick={onClick}
        >
          {isUploaded ? "Image uploaded" : "Upload an Image..."}
        </button>
      )}
    </UploadButton>
  );
}

export default PictureUploader;
