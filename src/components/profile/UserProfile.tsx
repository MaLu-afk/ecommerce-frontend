import React, { useState, useEffect } from 'react';
import type { User, Address, FieldId } from '../../types/profile';
import { ubigeoData } from '../../data/ubigeoData';
import ProfileHeader from './ProfileHeader';
import ProfileForm from './ProfileForm';
import AvatarModal from './modals/AvatarModal';
import AddressModal from './modals/AddressModal';
import AddressFormModal from './modals/AddressFormModal';
import PasswordModal from './modals/PasswordModal';
import Notification from './Notification';
import '../../styles/UserProfile.css';

interface UserProfileProps {
  user: User;
  onUpdateUser?: (user: User) => void;
}

interface NotificationState {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

type AddressChanges = {
  create: Omit<Address, 'id'>[];
  update: Address[];      // objetos con id para update
  delete: (string | number)[];
};

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser }) => {
  // =========================
  // Estado del usuario
  // =========================
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.image);

  // =========================
  // Estado de edición general
  // =========================
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<FieldId | null>(null);
  const [originalValues, setOriginalValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // =========================
  // Estado de campos
  // =========================
  const [fullName, setFullName] = useState(`${user.nombre} ${user.apellido}`);
  const [phone, setPhone] = useState(user.phone || '');
  const [addressField, setAddressField] = useState('');
  const [password, setPassword] = useState('password123'); // solo UI, real se maneja en PasswordModal

  // =========================
  // Estado de direcciones
  // =========================
  const initialAddresses: Address[] =
    (user.address && user.address.length ? user.address : user.addresses) || [];

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    if (!initialAddresses || initialAddresses.length === 0) return null;
    const main = initialAddresses.find((a: Address) => a.es_principal === true);
    return main ? String(main.id) : String(initialAddresses[0].id);
  });

  // Cambios pendientes de direcciones para enviar al backend
  const [addressChanges, setAddressChanges] = useState<AddressChanges>({
    create: [],
    update: [],
    delete: [],
  });

  // Backups para permitir "Cancelar" correctamente
  const [backupAddresses, setBackupAddresses] = useState<Address[] | null>(null);
  const [backupAddressChanges, setBackupAddressChanges] = useState<AddressChanges | null>(null);

  // =========================
  // Estado de modales
  // =========================
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddressFormModalOpen, setIsAddressFormModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [addressFormMode, setAddressFormMode] = useState<'add' | 'edit'>('add');
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // =========================
  // Notificaciones
  // =========================
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'success',
    show: false,
  });

  // =========================
  // Effects
  // =========================

  // Seleccionar dirección principal por defecto si cambia la lista
  useEffect(() => {
    if (!addresses || addresses.length === 0) {
      setSelectedAddressId(null);
      return;
    }

    const currentSelectedExists =
      selectedAddressId && addresses.some((a: Address) => String(a.id) === String(selectedAddressId));
    if (currentSelectedExists) return;

    const main = addresses.find((a: Address) => a.es_principal === true);
    if (main) {
      setSelectedAddressId(String(main.id));
    } else if (!selectedAddressId) {
      setSelectedAddressId(String(addresses[0].id));
    }
  }, [addresses, selectedAddressId]);

  // Actualizar campo de texto "DIRECCIÓN" cuando cambia la seleccionada o la lista
  useEffect(() => {
    updateAddressField();
  }, [selectedAddressId, addresses]);

  // =========================
  // Utilidades
  // =========================

  const updateAddressField = () => {
    if (!selectedAddressId) {
      setAddressField('');
      return;
    }
    const selectedAddress = addresses.find(
      (addr: Address) => String(addr.id) === String(selectedAddressId)
    );
    if (selectedAddress) {
      const ext = selectedAddress.numero_exterior || '';
      const intl = selectedAddress.numero_interior || '';
      const numberPart = `${ext ? ` ${ext}` : ''}${intl ? ` Int. ${intl}` : ''}`;
      const fullAddress = `${selectedAddress.tipo_Calle} ${selectedAddress.calle}${numberPart}, ${selectedAddress.distrito}, ${selectedAddress.provincia}`;
      setAddressField(fullAddress);
    } else {
      setAddressField('');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type, show: true });
  };

  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  const clearFieldError = (fieldId: FieldId) => {
    setErrors((prev: { [key: string]: string }) => ({ ...prev, [fieldId]: '' }));
  };

  const showFieldError = (fieldId: FieldId, message: string) => {
    setErrors((prev: { [key: string]: string }) => ({ ...prev, [fieldId]: message }));
  };

  const getFieldValue = (fieldId: FieldId): string => {
    switch (fieldId) {
      case 'fullName':
        return fullName;
      case 'phone':
        return phone;
      case 'address':
        return addressField;
      case 'password':
        return password;
      default:
        return '';
    }
  };

  const setFieldValue = (fieldId: FieldId, value: string) => {
    switch (fieldId) {
      case 'fullName':
        setFullName(value);
        break;
      case 'phone':
        {
          // Solo números y máximo 9 dígitos
          const numericValue = value.replace(/[^\d]/g, '').slice(0, 9);
          setPhone(numericValue);
        }
        break;
      case 'address':
        setAddressField(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
  };

  const handleInputChange = (fieldId: FieldId, value: string) => {
    setFieldValue(fieldId, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isEditing) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape' && isEditing) {
      e.preventDefault();
      handleCancel();
    }
  };

  const resetEditingState = () => {
    setIsEditing(false);
    setEditingField(null);
    setOriginalValues({});
  };

  const ensureAddressBackup = () => {
    if (!backupAddresses || !backupAddressChanges) {
      setBackupAddresses([...addresses]);
      setBackupAddressChanges({
        create: [...addressChanges.create],
        update: [...addressChanges.update],
        delete: [...addressChanges.delete],
      });
    }
  };

  const activateAddressEditing = () => {
    clearFieldError('address');
    setEditingField('address');
    setIsEditing(true);
  };

  // =========================
  // Edición general de campos
  // =========================

  const handleEdit = (fieldId: FieldId) => {
    const button = document.querySelector(`[data-field="${fieldId}"]`);
    const hasModal = button?.getAttribute('data-modal') === 'true';

    if (hasModal) {
      if (fieldId === 'address') {
        setIsAddressModalOpen(true);
      } else if (fieldId === 'password') {
        setIsPasswordModalOpen(true);
      }
      return;
    }

    if (isEditing && editingField !== fieldId) {
      return;
    }

    clearFieldError(fieldId);

    if (!isEditing) {
      const currentValue = getFieldValue(fieldId);
      setOriginalValues({ [fieldId]: currentValue });
    }

    setEditingField(fieldId);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingField) return;

    const newValue = getFieldValue(editingField).trim();
    clearFieldError(editingField);

    // Validar que el campo no esté vacío (para fullName/phone/password/address)
    if (!newValue && editingField !== 'address') {
      showFieldError(editingField, 'El campo no puede estar vacío');
      setFieldValue(editingField, originalValues[editingField]);
      return;
    }

    // Validaciones específicas
    if (editingField === 'fullName') {
      if (newValue.length < 4) {
        showFieldError(editingField, 'El nombre debe tener al menos 4 caracteres');
        setFieldValue(editingField, originalValues[editingField]);
        return;
      }
      if (newValue.length > 40) {
        showFieldError(editingField, 'El nombre no puede exceder 40 caracteres');
        setFieldValue(editingField, originalValues[editingField]);
        return;
      }
    }

    if (editingField === 'phone') {
      const phoneRegex = /^\d{9}$/;
      if (!phoneRegex.test(newValue)) {
        showFieldError(editingField, 'El teléfono debe tener exactamente 9 dígitos numéricos');
        setFieldValue(editingField, originalValues[editingField]);
        return;
      }
    }

    if (editingField === 'password') {
      if (newValue.length < 6) {
        showFieldError(editingField, 'La contraseña debe tener al menos 6 caracteres');
        setFieldValue(editingField, originalValues[editingField]);
        return;
      }
    }

    // =========================
    // Actualizar usuario + enviar al backend
    // =========================

    if (editingField === 'fullName') {
      const nameParts = newValue.split(' ');
      const updatedUser: User = {
        ...currentUser,
        nombre: nameParts[0] || '',
        apellido: nameParts.slice(1).join(' ') || '',
      };
      setCurrentUser(updatedUser);

      const payloadUser: User & { address?: any } = {
        ...updatedUser,
        address: addressChanges,
      };

      onUpdateUser?.(payloadUser);
    } else if (editingField === 'phone') {
      const updatedUser: User = { ...currentUser, phone: newValue };
      setCurrentUser(updatedUser);

      const payloadUser: User & { address?: any } = {
        ...updatedUser,
        address: addressChanges,
      };

      onUpdateUser?.(payloadUser);
    } else if (editingField === 'address') {
      // No cambiamos currentUser directamente, solo enviamos cambios de address
      const payloadUser: User & { address?: any } = {
        ...currentUser,
        address: addressChanges,
      };
      onUpdateUser?.(payloadUser);

      // Una vez enviados, limpiamos backups y cambios
      setBackupAddresses(null);
      setBackupAddressChanges(null);
      setAddressChanges({ create: [], update: [], delete: [] });
    }

    showNotification('Cambios guardados correctamente', 'success');
    resetEditingState();
  };

  const handleCancel = () => {
    if (!editingField) return;

    clearFieldError(editingField);

    if (editingField === 'address') {
      // Revertir direcciones y cambios pendientes
      if (backupAddresses && backupAddressChanges) {
        setAddresses(backupAddresses);
        setAddressChanges(backupAddressChanges);
        setBackupAddresses(null);
        setBackupAddressChanges(null);
        updateAddressField();
      }
    } else {
      // Revertir valor del campo
      setFieldValue(editingField, originalValues[editingField]);
    }

    resetEditingState();
  };

  // =========================
  // Manejo del avatar
  // =========================

  const handleAvatarSave = (imageData: string) => {
    const updatedUser: User = { ...currentUser, image: imageData };
    setAvatarUrl(imageData);
    setCurrentUser(updatedUser);

    const payloadUser: User & { address?: any } = {
      ...updatedUser,
      address: addressChanges,
    };

    onUpdateUser?.(payloadUser);
    showNotification('Foto de perfil actualizada correctamente', 'success');
  };

  // =========================
  // Manejo de direcciones
  // =========================

  const handleAddAddress = () => {
    ensureAddressBackup();
    setAddressFormMode('add');
    setEditingAddress(null);
    setIsAddressFormModalOpen(true);
  };

  const handleEditAddress = (addressId: string) => {
    ensureAddressBackup();
    const address = addresses.find((addr: Address) => String(addr.id) === String(addressId));
    if (address) {
      setAddressFormMode('edit');
      setEditingAddress(address);
      setIsAddressFormModalOpen(true);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    ensureAddressBackup();

    const address = addresses.find(a => String(a.id) === String(addressId));
    if (!address) return;

    // Registrar para borrar en backend
    setAddressChanges(prev => ({
      ...prev,
      delete: [...prev.delete, addressId],
    }));

    // Quitar de la lista local
    setAddresses(prev => prev.filter(a => String(a.id) !== String(addressId)));

    showNotification('Dirección eliminada correctamente', 'success');

    // Activar edición del campo address
    activateAddressEditing();
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  // addressData es lo que devuelve AddressFormModal (Omit<Address, 'id'>)
  const handleSaveAddress = (addressData: Omit<Address, 'id'>) => {
    ensureAddressBackup();

    if (addressFormMode === 'edit' && editingAddress) {
      // Editar dirección existente
      const updated: Address = { ...editingAddress, ...addressData };

      // Registrar en update para backend
      setAddressChanges(prev => ({
        ...prev,
        update: [...prev.update.filter(a => String(a.id) !== String(updated.id)), updated],
      }));

      // Actualizar en UI
      setAddresses(prev => prev.map(a => (String(a.id) === String(updated.id) ? updated : a)));

      // Si la editada era seleccionada, mantenerla
      if (selectedAddressId && String(selectedAddressId) === String(updated.id)) {
        setSelectedAddressId(String(updated.id));
      }

      showNotification('Dirección actualizada correctamente', 'success');
    } else {
      // Crear nueva dirección localmente con id temporal
      const tempId = Date.now().toString();
      const newAddress: Address = {
        id: tempId,
        ...addressData,
      };

      // Registrar en create para backend
      setAddressChanges(prev => ({
        ...prev,
        create: [...prev.create, addressData],
      }));

      // Añadir a UI
      setAddresses(prev => [...prev, newAddress]);

      // Seleccionar la nueva por defecto
      setSelectedAddressId(String(newAddress.id));

      showNotification('Dirección agregada correctamente', 'success');
    }

    // Activar edición de campo address en el perfil
    activateAddressEditing();

    setIsAddressFormModalOpen(false);
  };

  // =========================
  // Contraseña (solo UI, API real en PasswordModal)
  // =========================

  const handlePasswordSave = (newPassword: string) => {
    setPassword(newPassword);
    showNotification('Contraseña actualizada correctamente', 'success');
  };

  // =========================
  // Campos del formulario de perfil
  // =========================

  const formFields = [
    {
      id: 'fullName' as FieldId,
      label: 'NOMBRE Y APELLIDO',
      value: fullName,
      type: 'text',
      placeholder: 'No especificado',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.trimStart();
        const parts = value.split(/\s+/);
        if (parts.length > 2) {
          parts.splice(2);
        }
        setFullName(parts.join(' '));
      },
    },
    {
      id: 'phone' as FieldId,
      label: 'TELÉFONO',
      value: phone,
      type: 'text',
      placeholder: 'No especificado',
      maxLength: 9,
    },
    {
      id: 'address' as FieldId,
      label: 'DIRECCIÓN',
      value: addressField,
      type: 'text',
      placeholder: 'No especificado',
      hasModal: true,
    },
    {
      id: 'password' as FieldId,
      label: 'CONTRASEÑA',
      value: password,
      type: 'password',
      placeholder: 'No especificado',
      hasModal: true,
    },
  ];

  // =========================
  // Render
  // =========================

  return (
    <>
      <div className="container">
        <div className="profile-card">
          <ProfileHeader
            fullName={fullName}
            username={user.email}
            avatarUrl={avatarUrl}
            onAvatarClick={() => setIsAvatarModalOpen(true)}
          />

          <ProfileForm
            fields={formFields}
            isEditing={isEditing}
            editingField={editingField}
            errors={errors}
            onEdit={handleEdit}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          {isEditing && (
            <div className="action-buttons" style={{ display: 'flex' }}>
              <button className="btn btn-cancel" onClick={handleCancel}>
                <i className="fas fa-times"></i> Cancelar
              </button>
              <button className="btn btn-save" onClick={handleSave}>
                <i className="fa-solid fa-check"></i> Guardar Cambios
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSave={handleAvatarSave}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onClose={() => setIsAddressModalOpen(false)}
        onAddAddress={handleAddAddress}
        onEditAddress={handleEditAddress}
        onDeleteAddress={handleDeleteAddress}
        onSelectAddress={handleSelectAddress}
      />

      <AddressFormModal
        isOpen={isAddressFormModalOpen}
        mode={addressFormMode}
        address={editingAddress}
        ubigeoData={ubigeoData}
        onClose={() => setIsAddressFormModalOpen(false)}
        onSave={handleSaveAddress}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handlePasswordSave}
      />

      {/* Notificaciones */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </>
  );
};

export default UserProfile;
