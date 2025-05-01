'use client';

import React, { useCallback, useRef, useState } from 'react';

interface FileUploadProps {
  id: string;
  title: string;
  text: string;
  buttonText: string;
  lang: string;
  files: UploadedFile[];
  onFilesChange: React.Dispatch<React.SetStateAction<UploadedFile[]>>; // Correct type for setState
}

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, title, text, buttonText, lang, files, onFilesChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFiles = useCallback((incomingFiles: FileList) => {
    const newFiles: UploadedFile[] = Array.from(incomingFiles).map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      progress: 0,
    }));

    // Use functional update to ensure we have the latest state
    onFilesChange(prevFiles => [...prevFiles, ...newFiles]);

    // Simulate progress using functional updates
    newFiles.forEach(newFile => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(interval);
          // Use functional update for progress completion
          onFilesChange(prevFiles =>
            prevFiles.map(f =>
              f.id === newFile.id ? { ...f, progress: 100 } : f
            )
          );
        } else {
          // Use functional update for progress update
          onFilesChange(prevFiles =>
            prevFiles.map(f =>
              f.id === newFile.id ? { ...f, progress: progress } : f
            )
          );
        }
      }, 200);
    });
  }, [onFilesChange]); // Add onFilesChange to dependency array

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
                <p className="text-muted">{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
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
          multiple
          hidden
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