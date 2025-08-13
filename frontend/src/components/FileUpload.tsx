import React, { useState, useRef } from 'react';
import { calculateFileHash, formatFileSize } from '../utils/crypto';
import { FileHash } from '../types';

interface FileUploadProps {
  onFileHash: (fileHash: FileHash) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileHash }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const hash = await calculateFileHash(file);
      const fileHash: FileHash = {
        hash,
        fileName: file.name,
        fileSize: file.size,
      };
      onFileHash(fileHash);
    } catch (error) {
      console.error('文件处理失败:', error);
      alert('文件处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <div
        className={`upload-area ${isDragOver ? 'drag-over' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="*/*"
        />
        
        {isProcessing ? (
          <div className="upload-content">
            <div className="spinner"></div>
            <p>正在计算文件哈希值...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <h3>选择文件或拖拽到此处</h3>
            <p>支持任何类型的文件</p>
            <button className="upload-button" type="button">
              选择文件
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload; 