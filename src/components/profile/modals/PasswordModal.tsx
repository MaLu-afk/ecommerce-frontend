import React, { useState, useEffect } from 'react';
import type { PasswordStrength } from '../../../types/profile';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPassword: string) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSave }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    level: 0,
    text: 'Muy débil',
    class: ''
  });
  const [matchMessage, setMatchMessage] = useState<{
    text: string;
    type: 'success' | 'error' | null;
  }>({ text: '', type: null });
  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (newPassword) {
      const strength = calculatePasswordStrength(newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ level: 0, text: 'Muy débil', class: '' });
    }

    if (confirmPassword) {
      validatePasswordMatch();
    }
  }, [newPassword, confirmPassword]);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password || password.length === 0) {
      return { level: 0, text: 'Muy débil', class: '' };
    }

    let strength = 0;

    // Criterio 1: Longitud
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Criterio 2: Contiene números
    if (/\d/.test(password)) strength += 1;

    // Criterio 3: Contiene letras minúsculas
    if (/[a-z]/.test(password)) strength += 1;

    // Criterio 4: Contiene letras mayúsculas
    if (/[A-Z]/.test(password)) strength += 1;

    // Criterio 5: Contiene caracteres especiales
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1;

    // Determinar nivel
    if (strength <= 2) {
      return { level: 1, text: 'Débil', class: 'weak' };
    } else if (strength <= 4) {
      return { level: 2, text: 'Regular', class: 'fair' };
    } else if (strength <= 5) {
      return { level: 3, text: 'Buena', class: 'good' };
    } else {
      return { level: 4, text: 'Muy segura', class: 'strong' };
    }
  };

  const validatePasswordMatch = () => {
    if (!confirmPassword) {
      setMatchMessage({ text: '', type: null });
      setCanSave(false);
      return;
    }

    if (newPassword.length < 6) {
      setMatchMessage({ text: '', type: null });
      setCanSave(false);
      return;
    }

    if (newPassword === confirmPassword) {
      setMatchMessage({
        text: 'Las contraseñas coinciden',
        type: 'success'
      });
      setCanSave(true);
    } else {
      setMatchMessage({
        text: 'Las contraseñas no coinciden',
        type: 'error'
      });
      setCanSave(false);
    }
  };

  const resetForm = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordStrength({ level: 0, text: 'Muy débil', class: '' });
    setMatchMessage({ text: '', type: null });
    setCanSave(false);
  };

  const handleSave = () => {
    if (newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    onSave(newPassword);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`} id="passwordModal">
      <div className="modal-overlay" onClick={handleOverlayClick}></div>
      <div className="modal-content modal-password">
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-lock"></i>
            Cambio de contraseña
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-description">
            Ingresa una contraseña que no hayas usado anteriormente
          </p>

          {/* Nueva contraseña */}
          <div className="password-field-group">
            <label className="password-label">Nueva contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="password-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
              />
              <button
                className={`toggle-password ${showNewPassword ? 'active' : ''}`}
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Barra de seguridad */}
          <div className="password-strength">
            <div className="strength-label">Seguridad de la contraseña</div>
            <div className="strength-bar-container">
              <div className={`strength-bar ${passwordStrength.class}`}></div>
            </div>
            <div className={`strength-text ${passwordStrength.class}`}>
              {passwordStrength.text}
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="password-field-group">
            <label className="password-label">Confirmar contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
              />
              <button
                className={`toggle-password ${showConfirmPassword ? 'active' : ''}`}
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Mensaje de coincidencia */}
          {matchMessage.type && (
            <div
              className={`password-match-message ${matchMessage.type}`}
              style={{ display: 'flex' }}
            >
              <i
                className={`fas ${
                  matchMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
                }`}
              ></i>
              {matchMessage.text}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel-alt" onClick={handleClose}>
            Cancelar
          </button>
          <button
            className="btn btn-confirm-alt"
            onClick={handleSave}
            disabled={!canSave}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
