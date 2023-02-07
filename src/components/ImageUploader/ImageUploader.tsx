import { useState } from 'react';
import axios from 'axios';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './ImageUploader.module.css';

const ImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (
      selectedFile.type.startsWith('image/') &&
      selectedFile.size <= 5000000
    ) {
      setFile(selectedFile);
      setThumbnailUrl(URL.createObjectURL(selectedFile));
    } else if (!selectedFile.type.startsWith('image/')) {
      alert('Only image files are allowed');
    } else {
      setError('File size is too large, max size is 5MB');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await axios.post(
        'http://localhost:3000/upload-single',
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
      setFile(null);
      setThumbnailUrl(null);
      setSuccess(true);
    } catch (error) {
      setUploading(false);
      console.error(error);
    }
  };

  return (
    <div>
      <label htmlFor='image-uploader' className={styles.label}>
        <input
          className={styles.input}
          id='image-uploader'
          name='image-uploader'
          type='file'
          onChange={handleFileChange}
        />
        Custom Upload
      </label>
      <button onClick={handleUpload}>Upload</button>
      {file ? (
        <>
          <p>{file.name}</p>
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={file.name}
              className={styles.thumbnail}
            />
          )}
        </>
      ) : null}
      {uploading ? <ProgressBar progress={progress} /> : null}
      {success ? <p>Upload successful!</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
};
export default ImageUploader;
