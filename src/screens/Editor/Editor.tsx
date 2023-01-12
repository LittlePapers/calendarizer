import React, { useEffect, useState } from 'react';

const Editor = () => {
  const [file, setFile] = useState<string>('');

  useEffect(() => {
    const savedFile = localStorage.getItem('fileUrl');
    if (savedFile) {
      setFile(savedFile);
    }
  }, []);

  return (
    <div>
      <h1>this will be the editor!</h1>
      {file && (
        <div className="bg-sky-400 flex rounded-lg flex-col items-center justify-center p-12">
          <img src={file} className="h-auto max-w-lg mx-auto my-4" />
        </div>
      )}
    </div>
  );
};

export default Editor;
