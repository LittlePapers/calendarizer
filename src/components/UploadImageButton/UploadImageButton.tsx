import { ChangeEvent } from 'react';

interface UploadImageButtonProps {
  onUpload: (img: string) => void;
  text: string;
  icon?: string;
}

const UploadImageButton = ({
  onUpload,
  text,
  icon,
}: UploadImageButtonProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files?.length) {
      onUpload(URL.createObjectURL(files[0]));
    }
  };

  return (
    <label htmlFor="upload-file">
      <div className="bg-green-600 mt-2 py-7 flex flex-center justify-center rounded-lg cursor-pointer hover:bg-green-500">
        <input
          id="upload-file"
          accept="image/*"
          type="file"
          className="hidden"
          onChange={handleChange}
        />
        {icon && <img src={icon} />}
        <h4 className="text-black text-xl font-sans ml-4">
          Select from computer
          {text}
        </h4>
      </div>
    </label>
  );
};

export default UploadImageButton;
