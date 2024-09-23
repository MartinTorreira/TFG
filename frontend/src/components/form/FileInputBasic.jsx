import { useRef } from 'react';
import { FwToggle, FwFileUploader, FwButton } from "@freshworks/crayons/react";

export const FileInputBasic = ({ onChange }) => {
  const fileUploader = useRef(null);

  const toggleChange = (event) => {
    if (event.currentTarget.checked === true) {
      fileUploader.current.actionURL = 'https://mocktarget.apigee.net/echo';
    } else {
      fileUploader.current.actionURL = '/no-api';
    }
  }

  const filesUploaded = async (event) => {
    console.log(event);
    if (event.files && event.files.length > 0) {
      await onChange(event.files); // Enviar el archivo al componente padre
    }
  }

  const fileReuploaded = (event) => {
    console.log(event);
  }

  return (
    <div className="App">
      <FwToggle
        id="succeed-toggle"
        size="small"
        checked="false"
        onFwChange={(event) => toggleChange(event)}
      />
      <div>
        <FwFileUploader
          name="avatar"
          id="file-uploader-3"
          text="Upload Avatar"
          description="or drag and drop your image file here"
          hint="File size must be within 5MB"
          max-file-size="5"
          accept=".png,.jpg,.jpeg"
          action-u-r-l="/no-api"
          onFwFilesUploaded={filesUploaded}
          onFwFileReuploaded={fileReuploaded}
          ref={fileUploader}
        />
        <FwButton file-uploader-id="file-uploader-3">Upload</FwButton>
      </div>
    </div>
  );
}
