import './App.css';
import { DragAndDropUploader, FileUploader, ImageUploader } from './components';

const App = () => {
  return (
    <div>
      <p>File uploader</p>
      <FileUploader />
      <p>Image uploader</p>
      <ImageUploader />
      <p>Drag and drop uploader</p>
      <DragAndDropUploader />
    </div>
  );
};

export default App;
