import { ChangeEvent, useState, useEffect, useRef, DragEvent } from 'react';
import reactLogo from './assets/react.svg';
import upload from './assets/file_upload.svg';
import './App.css';

function App() {
  const [file, setFile] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files?.length) {
      setFile(URL.createObjectURL(files[0]));
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    if (files?.length) {
      setFile(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div className="flex justify-center items-center w-2/3 h-screen mx-auto">
      {file ? (
        <div className="bg-sky-400 flex rounded-lg flex-col items-center justify-center p-12">
          <img src={file} className="h-auto max-w-lg mx-auto my-4" />
        </div>
      ) : (
        <div className="bg-white p-4 flex flex-col rounded-lg shadow-xl flex-1">
          <div
            className="bg-sky-400 flex rounded-lg flex-col items-center justify-center p-12 hover:bg-sky-500"
            onDragOver={onDragOver}
            onDrop={handleDrop}
          >
            <img src={upload} className="h-20 w-20 mx-auto my-4" />
            <h2 className="text-black mb-4 text-xl font-sans w-40">
              Drag and drop file here to upload
            </h2>
          </div>

          <label htmlFor="upload-file">
            <div className="bg-green-600 mt-2 py-7 flex flex-center justify-center rounded-lg cursor-pointer hover:bg-green-500">
              <input
                id="upload-file"
                accept="image/*"
                type="file"
                className="hidden"
                onChange={handleChange}
              />
              <img src={reactLogo} />
              <h4 className="text-black text-xl font-sans ml-4">
                Select from computer
              </h4>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}

export default App;
