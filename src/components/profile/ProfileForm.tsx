import React from 'react';
import type { FieldId } from '../../types/profile';

interface FormField {
  id: FieldId;
  label: string;
  value: string;
  type: string;
  placeholder: string;
  maxLength?: number;
  hasModal?: boolean;
}

interface ProfileFormProps {
  fields: FormField[];
  isEditing: boolean;
  editingField: FieldId | null;
  errors: { [key: string]: string };
  onEdit: (fieldId: FieldId) => void;
  onInputChange: (fieldId: FieldId, value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  fields,
  isEditing,
  editingField,
  errors,
  onEdit,
  onInputChange,
  onKeyDown
}) => {
  return (
    <div className="profile-form">
      {fields.map((field) => (
        <div className="form-group" key={field.id}>
          <label className="form-label">{field.label}</label>
          <div className="input-wrapper">
            <input
              type={field.type}
              className="form-input"
              id={field.id}
              value={field.value}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              readOnly={editingField !== field.id}
              onChange={(e) => {
                if (field.onChange) {
                  field.onChange(e);  // usa la validación personalizada
                } else {
                  onInputChange(field.id, e.target.value); // comportamiento normal
                }
              }}
              onKeyDown={onKeyDown}
            />
            <button
              className={`edit-btn ${editingField === field.id ? 'editing' : ''}`}
              data-field={field.id}
              data-modal={field.hasModal ? 'true' : 'false'}
              title="Editar"
              onClick={() => onEdit(field.id)}
            >
              <i className="fas fa-pen"></i>
            </button>
          </div>
          <div className="error-message" id={`${field.id}Error`}>
            {errors[field.id] || ''}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileForm;
