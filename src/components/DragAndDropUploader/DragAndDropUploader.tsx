import { useState } from 'react';
import axios from 'axios';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './DragAndDropUploader.module.css';

const DragAndDropUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    setFiles([...files, ...droppedFiles]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setUploading(true);
      const res = await axios.post(
        'http://localhost:3000/upload-multiple',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress =
                (progressEvent.loaded / progressEvent.total) * 100;
              setProgress(progress);
            }
          },
        }
      );

      await new Promise((resolve) => {
        setTimeout(() => resolve('success'), 500);
      });

      setUploading(false);
      setSuccess(true);
    } catch (error) {
      setUploading(false);
      console.error(error);
    }
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={styles.uploader}
      >
        {files.length === 0 ? <p>Drop files here</p> : null}
        {files.map((file) => (
          <p key={file.name}>{file.name}</p>
        ))}
      </div>
      <button onClick={handleUpload}>Upload</button>
      {uploading ? <ProgressBar progress={progress} /> : null}
      {success ? <p>Upload successful!</p> : null}
    </div>
  );
};

export default DragAndDropUploader;
