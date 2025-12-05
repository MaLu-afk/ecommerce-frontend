import React, { useState, useRef } from 'react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageData: string) => void;
}

const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose, onSave }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validar tipo de archivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor selecciona una imagen válida (PNG, JPG o GIF)');
      return;
    }

    // Validar tamaño (máximo 1MB)
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    // Leer el archivo
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (previewImage) {
      onSave(previewImage);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreviewImage(null);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`} id="avatarModal">
      <div className="modal-overlay" onClick={handleOverlayClick}></div>
      <div className="modal-content modal-avatar">
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-camera"></i>
            Cambiar foto de perfil
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          {!previewImage ? (
            <div
              className={`upload-area ${isDragging ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h3 className="upload-title">Arrastra tu imagen aquí</h3>
              <p className="upload-subtitle">o</p>
              <button className="btn-upload" onClick={handleSelectFile}>
                <i className="fas fa-folder-open"></i>
                Seleccionar archivo
              </button>
              <p className="upload-info">PNG, JPG o GIF (máximo 1MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
            </div>
          ) : (
            <div className="preview-area">
              <img src={previewImage} alt="Vista previa" />
              <div className="preview-actions">
                <button className="btn-change" onClick={handleChangeImage}>
                  <i className="fas fa-sync-alt"></i>
                  Cambiar imagen
                </button>
                  <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                />
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={handleClose}>
            <i className="fas fa-times"></i> Cancelar
          </button>
          <button
            className="btn btn-save"
            onClick={handleSave}
            disabled={!previewImage}
          >
            <i className="fas fa-check"></i> Guardar foto
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
