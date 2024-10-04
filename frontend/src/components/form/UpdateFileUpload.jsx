import React, { useState, useEffect } from "react";
import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UpdateFileUpload = ({ label, onFileChange, images }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (images && images.length > 0) {
      const formattedFileList = images.map((url, index) => ({
        uid: `-${index}`,
        name: `image-${index}.png`,
        status: "done",
        url: typeof url === "string" ? url : "",
      }));
      setFileList(formattedFileList);
    }
  }, [images]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (onFileChange) {
      onFileChange(newFileList.map((file) => file.originFileObj || file.url));
    }
  };

  const handleRemove = (file) => {
    const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(updatedFileList);
    if (onFileChange) {
      onFileChange(
        updatedFileList.map((item) => item.originFileObj || item.url),
      );
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <section className="flex flex-col w-full">
      {label && (
        <label htmlFor="fileInput" className="block mb-2 text-sm text-gray-600">
          {label}
        </label>
      )}
      <Upload
        listType="picture-card"
        accept=".png, .svg, .jpeg, .jpg"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={() => false} // Prevent automatic upload
      >
        {fileList.length >= 10 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </section>
  );
};

export default UpdateFileUpload;
