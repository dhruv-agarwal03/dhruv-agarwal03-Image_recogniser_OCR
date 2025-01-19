import {useState } from "react"
import * as React from 'react';
import { styled } from '@mui/material/styles';

import LinearProgress from '@mui/material/LinearProgress';
import { Box } from "@mui/material";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Tesseract from 'tesseract.js';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DropZone = styled('div')({
  border: '2px dashed #ccc',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
  margin: '20px 0',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
});

export default function InputImageUpload() {
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setImage(URL.createObjectURL(selectedFile)); // Create a URL for the image
      processImage(selectedFile); // Start OCR processing
    } else {
      alert('Please select a valid image file.');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setImage(URL.createObjectURL(droppedFile)); // Create a URL for the image
      processImage(droppedFile); // Start OCR processing
    } else {
      alert('Please drop a valid image file.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); 
  };

  const processImage = (file) => {
    setOcrResult("Just Some More Time...");
    setIsLoading(true);
    Tesseract.recognize(
      file,
      'eng+hin',
      {
        logger: (m) => console.log(m), // Log progress
      }
    ).then(({ data: { text } }) => {
      setOcrResult(text); // Set the recognized text
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  };

  return (
    <div >
      <DropZone
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="mx-3 "
      >
        {image ? (
          <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        ) : (
          'Drag and drop an image here or click to upload'
        )}
      </DropZone>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      className="bg-black"
    >
      Upload Image
      <VisuallyHiddenInput
        type="file"
        accept="image/*" // Accept only image files
        onChange={handleFileChange}
     />
  </Button>
</div >
{isLoading&&(
<div className=" mx-5 mt-3">
<Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
</div>)}
<div className="px-5 py-3">
      {isLoading && <p>Processing image, please wait...</p>}
      {ocrResult && (
        <div>
          <h3>OCR Result:</h3>
          <p>{ocrResult}</p>
        </div>
      )}
    </div>
    </div>
  );
}