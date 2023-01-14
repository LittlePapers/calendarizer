import { useEffect, useState } from 'react';
import reactLogo from '../../assets/react.svg';
import upload from '../../assets/file_upload.svg';
import { DropImageZone, UploadImageButton } from '../../components';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [file, setFile] = useState<string>('');
  const navigate = useNavigate();

  const handleSetImage = (img: string) => {
    setFile(img);
  };

  useEffect(() => {
    if (file) {
      localStorage.setItem('fileUrl', file);
      navigate('/editor');
    }
  }, [file]);

  return (
    <div className="flex justify-center items-center w-2/3 h-screen mx-auto">
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
    </div>
  );
}

export default Home;
