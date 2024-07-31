import { RiCloseCircleFill, RiCloseCircleLine, RiDeleteBin2Line } from '@remixicon/react';
import React, { useState, useRef, useEffect } from 'react';

const MAX_IMAGES = 5;

const DragAndDropUploader = ({ onFilesAdded }) => {
  const [highlight, setHighlight] = useState(false);
  const fileInputRef = useRef(null);
  
  // images previews
  const [previews, setPreviews] = useState([]);
  const visiblePreviews = previews.slice().reverse().slice(0, MAX_IMAGES);
  const extraImagesCount = previews.length - MAX_IMAGES;

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const onFilesAddedHandler = (event) => {
    const files = event.target.files || event.dataTransfer.files;
    const array = fileListToArray(files);
    if (onFilesAdded) {
      onFilesAdded(array);
    }
    updatePreviews(array);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setHighlight(true);
  };

  const onDragLeave = () => {
    setHighlight(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setHighlight(false);
    const files = event.dataTransfer.files;
    const array = fileListToArray(files);
    if (onFilesAdded) {
      onFilesAdded(array);
    }
    updatePreviews(array);
  };

  const fileListToArray = (list) => {
    const array = [];
    for (let i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  };

  const updatePreviews = (files) => {
    const previewsArray = files.map(file => URL.createObjectURL(file));
    setPreviews(prevPreviews => [...prevPreviews, ...previewsArray]);
  };

  const handleImageClick = (url) => {
    setPreviews(previews.filter(preview => preview !== url));
  };

  useEffect(() => {
    if (previews.length > 0) {
      console.log('Previews updated', previews);
    }
  }, [previews]);

  return (
    <>
      <div
        className={`border-dashed border-4 p-4 mt-10 rounded-lg ${highlight ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={openFileDialog}
        style={{ cursor: 'pointer' }}
      >
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          multiple
          onChange={onFilesAddedHandler}
        />
        <p className="text-center text-gray-600">Déposez les fichiers ici ou cliquez pour télécharger</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {visiblePreviews.map((preview, index) => (
          <div key={index} className='group relative'>
            <img src={preview} alt="preview" className="w-full h-auto rounded-lg aspect-square object-cover cursor-pointer" onClick={(e) => {e.stopPropagation(); handleImageClick(preview)} } />
            <div className='absolute w-full h-full top-0 left-0 rounded-md bg-white/60 backdrop-blur-md flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-100'>
                <RiCloseCircleFill size={32}/>
            </div>
          </div>
        ))}
        {
            extraImagesCount > 0 && (
                <div className='relative'>
                    <img className='absolute h-full w-full object-cover rounded-lg opacity-100' src={previews[0]} alt="" />
                    <p className="text-2xl font-bold text-white h-full absolute overflow-hidden w-full rounded-lg backdrop-blur-sm flex items-center justify-center">{`+${extraImagesCount}`}</p>
                </div>
            )
        }
      </div>
    </>
  );
};

export default DragAndDropUploader;
