import { useState } from 'react';
import reactLogo from './assets/react.svg';
import upload from './assets/file_upload.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex justify-center items-center w-2/3 h-screen mx-auto">
      <div className="bg-white p-4 flex flex-col rounded-lg shadow-xl flex-1">
        <div className="bg-sky-400 flex rounded-lg flex-col items-center justify-center p-12">
          <img src={upload} className="h-20 w-20 mx-auto my-4" />
          <h2 className="text-black mb-4 text-xl font-sans w-40">
            Drag and drop file here to upload
          </h2>
        </div>

        <div className="bg-green-600 mt-2 py-7 flex flex-center justify-center rounded-lg">
          <img src={reactLogo} />
          <h4 className="text-black text-xl font-sans ml-4">
            Select from computer
          </h4>
        </div>
      </div>
    </div>
  );
}

export default App;
