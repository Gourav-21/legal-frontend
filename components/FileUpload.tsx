'use client';

import React, { useCallback, useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';

interface FileUploadProps {
  id: string;
  title: string;
  text: string;
  buttonText: string;
  files: UploadedFile[];
  onFilesChange: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  maxFiles?: number;
  accept?: string;
}

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, title, text, buttonText, files, onFilesChange, maxFiles, accept }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to check if a file is an image
  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  // Function to compress image files
  const compressImageFile = async (file: File, id: string): Promise<File> => {
    if (!isImageFile(file)) {
      // For non-image files, simulate progress and return immediately
      setTimeout(() => {
        onFilesChange(prevFiles => prevFiles.map(f => f.id === id ? { ...f, progress: 100 } : f));
      }, 100);
      return file;
    }

    onFilesChange(prevFiles => prevFiles.map(f => f.id === id ? { ...f, progress: 10 } : f));
    try {
      const options = {
        maxSizeMB: 2, // Increased max file size to 2MB for better quality
        maxWidthOrHeight: 2048, // Increased max dimension to 2048px
        useWebWorker: true,
        fileType: file.type,
        initialQuality: 0.9 // Higher quality setting (0.9 instead of default 0.7)
      };

      onFilesChange(prevFiles => prevFiles.map(f => f.id === id ? { ...f, progress: 40 } : f));

      const compressedFile = await imageCompression(file, options);
      onFilesChange(prevFiles => prevFiles.map(f => f.id === id ? { ...f, progress: 80 } : f));

      // Set final progress to 100% after a small delay to make it visible
      setTimeout(() => {
        onFilesChange(prevFiles => prevFiles.map(f => f.id === id ? { ...f, progress: 100 } : f));
      }, 100);

      console.log(`Original size: ${file.size / 1024 / 1024} MB, Compressed size: ${compressedFile.size / 1024 / 1024} MB`);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      onFilesChange(prevFiles => prevFiles.map(f => f.id === id ? { ...f, progress: 100 } : f));
      return file; // Return original file if compression fails
    }
  };

  const handleFiles = useCallback(async (incomingFiles: FileList) => {
    let filesArray = Array.from(incomingFiles);
    // Filter by accept type if provided
    if (accept) {
      const acceptTypes = accept.split(',').map(type => type.trim().toLowerCase());
      filesArray = filesArray.filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return acceptTypes.includes(file.type.toLowerCase()) || acceptTypes.includes(ext);
      });
    }
    // Limit number of files if maxFiles is set
    if (typeof maxFiles === 'number') {
      const remainingSlots = maxFiles - files.length;
      if (remainingSlots <= 0) return;
      filesArray = filesArray.slice(0, remainingSlots);
    }
    for (const file of filesArray) {
      const id = `${file.name}-${Date.now()}`;
      onFilesChange(prevFiles => [
        ...prevFiles,
        {
          id,
          file,
          progress: 0
        }
      ]);
      const processedFile = await compressImageFile(file, id);
      onFilesChange(prevFiles =>
        prevFiles.map(f => f.id === id ? { ...f, file: processedFile } : f)
      );
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFilesChange, maxFiles, accept, files.length]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleUploadBoxClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback((fileId: string) => {
    // Use functional update for removing files
    onFilesChange(prevFiles => prevFiles.filter(f => f.id !== fileId));
    
    // Reset the file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFilesChange]); // Add onFilesChange to dependency array

  const getFileIcon = (fileName: string): string => {
    const fileType = fileName.split('.').pop()?.toUpperCase();
    if (fileType === 'PDF') return 'fa-file-pdf';
    if (fileType === 'PNG' || fileType === 'JPG' || fileType === 'JPEG' || fileType === 'GIF') return 'fa-file-image';
    return 'fa-file';
  };

  return (
    <div className="upload-file">
      <div className="file-list">
        {files.map(uploadedFile => (
          <div key={uploadedFile.id} className="file-item">
            <div className="d-flex align-items-center">
              <i className={`fa-regular ${getFileIcon(uploadedFile.file.name)} file-icon text-muted`}></i>
              <div>
                <h6>{uploadedFile.file.name}</h6>
                <p className="text-muted">{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB {uploadedFile.progress < 100 && <span className="text-danger ">{"compressing"}</span>}</p>
              </div>
            </div>
            <div className="progress-close-btn">
              {uploadedFile.progress < 100 ? (
                <div className="progress-circle">{uploadedFile.progress}%</div>
              ) : (
                <button className="remove-btn" onClick={() => handleRemoveFile(uploadedFile.id)}>&times;</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className={`upload-container ${isDragging ? 'dragging' : ''}`}
        onClick={handleUploadBoxClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <i className="bi bi-cloud-upload-fill"></i>
        <h4 className="mb-1">{title}</h4>
        <p className="mb-3">{text}</p>
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          multiple={typeof maxFiles === 'number' ? maxFiles > 1 : true}
          hidden
          accept={accept}
          onChange={handleFileInputChange}
        />
        <button type="button" className="btn btn-sm without-icon btn-fileupload" onClick={(e) => { e.stopPropagation(); handleUploadBoxClick(); }}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;