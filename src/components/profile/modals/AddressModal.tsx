import React from 'react';
import type { Address } from '../../../types/profile';

interface AddressModalProps {
  isOpen: boolean;
  addresses: Address[];
  selectedAddressId: string | null;
  onClose: () => void;
  onAddAddress: () => void;
  onEditAddress: (addressId: string) => void;
  onDeleteAddress: (addressId: string) => void;
  onSelectAddress: (addressId: string) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  addresses,
  selectedAddressId,
  onClose,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onSelectAddress
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCardClick = (addressId: string, e: React.MouseEvent) => {
    // No seleccionar si se hizo clic en los botones de acción
    if ((e.target as HTMLElement).closest('.address-card-actions')) {
      return;
    }
    onSelectAddress(addressId);
  };

  const handleDelete = (addressId: string, addressName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la dirección "${addressName}"?`)) {
      onDeleteAddress(addressId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`} id="addressModal">
      <div className="modal-overlay" onClick={handleOverlayClick}></div>
      <div className="modal-content modal-address">
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-map-marker-alt"></i>
            Direcciones
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-description">Selecciona o edita tus direcciones</p>

          {/* Lista de direcciones */}
          {addresses.length > 0 ? (
            <div className="address-list" style={{ display: 'flex' }}>
              {addresses.map((address) => {
                const isSelected = address.id === selectedAddressId;
                return (
                  <div
                    key={address.id}
                    className={`address-card ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => handleCardClick(address.id, e)}
                  >
                    <div className="address-card-content">
                      <div className="address-card-info">
                        <div className="address-card-name">
                          {address.direccion}
                          {isSelected && (
                            <i
                              className="fas fa-check-circle"
                              style={{ color: '#667eea' }}
                            ></i>
                          )}
                        </div>
                        <div className="address-card-details">
                          {address.tipo_Calle} {address.calle}
                          {(address.numero_exterior) && (
                            ` Ext. ${address.numero_exterior}`
                          )}
                          {(address.numero_interior) && (
                            ` Int. ${address.numero_interior}`
                          )}
                        </div>
                        <div className="address-card-details">
                          {address.distrito} - {address.provincia}, {address.departamento}
                        </div>
                        {address.referencias && (
                          <div className="address-card-reference">{address.referencias}</div>
                        )}
                      </div>
                      <div className="address-card-actions">
                        <button
                          className="address-action-btn edit-btn"
                          onClick={() => onEditAddress(address.id)}
                          title="Editar"
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          className="address-action-btn delete-btn"
                          onClick={() => handleDelete(address.id, address.direccion)}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state" style={{ display: 'block' }}>
              <i className="fas fa-map-marked-alt"></i>
              <p>No hay direcciones guardadas</p>
              <span>Agrega una nueva dirección para continuar</span>
            </div>
          )}

          {/* Botón para agregar nueva dirección */}
          <button className="btn-add-address" onClick={onAddAddress}>
            <i className="fas fa-plus"></i>
            Agregar Nueva Dirección
          </button>
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel-alt" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
