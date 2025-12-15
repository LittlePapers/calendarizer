import { useEffect, useRef, useState } from 'react';
import upload from '../../assets/file_upload.svg';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [file, setFile] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleSetImage = (img: string) => setFile(img);

  useEffect(() => {
    if (file) {
      localStorage.setItem('fileUrl', file);
      navigate('/editor');
    }
  }, [file, navigate]);

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) setDragging(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      handleSetImage(URL.createObjectURL(files[0]));
    }
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      handleSetImage(URL.createObjectURL(files[0]));
    }
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="relative rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-2xl p-8 md:p-10">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Design a calendar from your photo</h1>
            <p className="mt-1 text-sm md:text-base text-slate-300">Drag an image below or browse to get started.</p>
          </div>

          <div
            className={`transition border-2 border-dashed rounded-xl p-10 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer select-none ${dragging ? 'border-blue-400/80 bg-white/10' : 'border-slate-600/50 bg-white/5 hover:bg-white/10'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={openPicker}
            role="button"
            aria-label="Upload image"
          >
            <img src={upload} alt="Upload" className="h-12 w-12 opacity-90" />
            <p className="mt-4 text-sm text-slate-300">
              <span className="font-medium text-slate-100">Drag & drop</span> your image here
            </p>
            <p className="text-xs text-slate-400">JPG, PNG. High-resolution recommended.</p>
            <button
              type="button"
              onClick={openPicker}
              className="mt-5 inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Browse files
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400">
            <div>Secure, local processing. Nothing is uploaded.</div>
            <div>Tip: You can change layout and language later.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
