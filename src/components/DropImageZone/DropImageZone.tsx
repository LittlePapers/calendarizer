import { DragEvent } from 'react';
import upload from './assets/file_upload.svg';

interface DropImageZoneProps {
  onDropimage: (img: string) => void;
  mainIcon: string;
  subtitleText: string;
}

const DropImageZone = ({
  onDropimage,
  mainIcon,
  subtitleText,
}: DropImageZoneProps) => {
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    if (files?.length) {
      onDropimage(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div
      className="bg-sky-400 flex rounded-lg flex-col items-center justify-center p-12 hover:bg-sky-500"
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      <img src={mainIcon} className="h-20 w-20 mx-auto my-4" />
      <h2 className="text-black mb-4 text-xl font-sans w-40 text-center">{subtitleText}</h2>
    </div>
  );
};

export default DropImageZone;
