import { useEffect, useState } from 'react';
import reactLogo from '../../assets/react.svg';
import upload from '../../assets/file_upload.svg';
import { DropImageZone, UploadImageButton } from '../../components';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function Home() {
  const [file, setFile] = useState<string>('');
  const navigate = useNavigate();

  const handleSetImage = (img: string) => {
    setFile(img);
  };

  useEffect(() => {
    if (file) {
      navigate('/editor');
    }
  }, [file]);

  return (
    <div className="flex justify-center items-center w-2/3 h-screen mx-auto">
      {file ? (
        // Temporal piece of code, ideally after having the image we should keep it in state (redux ?)
        <div className="bg-sky-400 flex rounded-lg flex-col items-center justify-center p-12">
          <img src={file} className="h-auto max-w-lg mx-auto my-4" />
        </div>
      ) : (
        <div className="bg-white p-4 flex flex-col rounded-lg shadow-xl flex-1">
          <DropImageZone
            onDropimage={handleSetImage}
            mainIcon={upload}
            subtitleText={'Drag and drop file here to upload'}
          />

          <UploadImageButton
            onUpload={handleSetImage}
            text={'Select from computer'}
            icon={reactLogo}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
