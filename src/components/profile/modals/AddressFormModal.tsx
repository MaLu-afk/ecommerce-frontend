import React, { useState, useEffect } from 'react';
import type { Address, UbigeoData } from '../../../types/profile';

interface AddressFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  address: Address | null;
  ubigeoData: UbigeoData;
  onClose: () => void;
  onSave: (address: Omit<Address, 'id'>) => void;
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  mode,
  address,
  ubigeoData,
  onClose,
  onSave
}) => {
  const [departamento, setdepartamento] = useState('');
  const [provincia, setprovincia] = useState('');
  const [distrito, setDistrito] = useState('');
  const [tipo_Calle, settipo_Calle] = useState('');
  const [calle, setcalle] = useState('');
  const [numero_exterior, setnumero_exterior] = useState('');
  const [numero_interior, setnumero_interior] = useState('');
  const [referencias, setreferencias] = useState('');

  const [provincias, setprovincias] = useState<string[]>([]);
  const [Distritos, setDistritos] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && mode === 'edit' && address) {
      setdepartamento(address.departamento);
      setprovincia(address.provincia);
      setDistrito(address.distrito);
      settipo_Calle(address.tipo_Calle);
      setcalle(address.calle);
      // initialize number from possible fields
      setnumero_exterior(address.numero_exterior || '');
      setnumero_interior(address.numero_interior || '');
      setreferencias(address.referencias || '');
    } else if (isOpen && mode === 'add') {
      clearForm();
    }
  }, [isOpen, mode, address]);

  useEffect(() => {
    if (departamento && ubigeoData[departamento]) {
      const provinciaList = Object.keys(ubigeoData[departamento]).sort();
      setprovincias(provinciaList);
    } else {
      setprovincias([]);
      setprovincia('');
    }
  }, [departamento, ubigeoData]);

  useEffect(() => {
    if (departamento && provincia && ubigeoData[departamento]?.[provincia]) {
      const DistritoList = ubigeoData[departamento][provincia].sort();
      setDistritos(DistritoList);
    } else {
      setDistritos([]);
      setDistrito('');
    }
  }, [departamento, provincia, ubigeoData]);

  const clearForm = () => {
    setdepartamento('');
    setprovincia('');
    setDistrito('');
    settipo_Calle('');
    setcalle('');
    setreferencias('');
    setnumero_exterior('');
    setnumero_interior('');
    setprovincias([]);
    setDistritos([]);
  };

  const handleSave = () => {
    // Validaciones
    if (!departamento) {
      alert('Selecciona un departamento');
      return;
    }
    if (!provincia) {
      alert('Selecciona una provincia');
      return;
    }
    if (!distrito) {
      alert('Selecciona un distrito');
      return;
    }
    if (!tipo_Calle) {
      alert('Selecciona el tipo de vía');
      return;
    }
    if (!calle.trim()) {
      alert('El nombre de la vía es obligatorio');
      return;
    }
    if (!numero_exterior.trim()) {
      alert('El número exterior es obligatorio');
      return;
    }
    if (!/^[0-9]+$/.test(numero_exterior)) {
      alert('El número exterior solo debe contener números');
      return;
    }
    if (numero_interior && !/^[0-9]+$/.test(numero_interior)) {
      alert('El número interior solo debe contener números');
      return;
    }

    onSave({
      departamento,
      provincia,
      distrito,
      tipo_Calle,
      calle,
      numero_exterior,
      numero_interior,
      referencias
    });

    handleClose();
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const departamentos = Object.keys(ubigeoData).sort();

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`} id="addressFormModal">
      <div className="modal-overlay" onClick={handleOverlayClick}></div>
      <div className="modal-content modal-address-form">
        <div className="modal-header">
          <h2 className="modal-title" id="addressFormTitle">
            <i className="fas fa-map-marker-alt"></i>
            {mode === 'add' ? 'Agregar Dirección' : 'Editar Dirección'}
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="address-form">
            <div className="form-field">
              <label className="field-label">Departamento</label>
              <select
                className="field-input field-select"
                value={departamento}
                onChange={(e) => setdepartamento(e.target.value)}
              >
                <option value="">Selecciona un departamento</option>
                {departamentos.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

              <div className="form-row">
              <div className="form-field">
                <label className="field-label">Provincia</label>
                <select
                  className="field-input field-select"
                  value={provincia}
                  onChange={(e) => setprovincia(e.target.value)}
                  disabled={!departamento}
                >
                  <option value="">Selecciona una provincia</option>
                  {provincias.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">Distrito</label>
                <select
                  className="field-input field-select"
                  value={distrito}
                  onChange={(e) => setDistrito(e.target.value)}
                  disabled={!provincia}
                >
                  <option value="">Selecciona un distrito</option>
                  {Distritos.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field form-field-small">
                <label className="field-label">Tipo de vía</label>
                <select
                  className="field-input field-select"
                  value={tipo_Calle}
                  onChange={(e) => settipo_Calle(e.target.value)}
                >
                  <option value="">Selecciona</option>
                  <option value="Av.">Av. - Avenida</option>
                  <option value="Jr.">Jr. - Jirón</option>
                  <option value="Ca.">Ca. - Calle</option>
                  <option value="Psje.">Psje. - Pasaje</option>
                  <option value="Prol.">Prol. - Prolongación</option>
                  <option value="Mz.">Mz. - Manzana</option>
                  <option value="Lt.">Lt. - Lote</option>
                  <option value="Urb.">Urb. - Urbanización</option>
                  <option value="Asoc.">Asoc. - Asociación</option>
                  <option value="AA.HH.">AA.HH. - Asentamiento Humano</option>
                </select>
              </div>

              <div className="form-field form-field-large" style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr', alignItems: 'flex-start' }}>
                {/* First row: full width calle field */}
                <div style={{ width: '100%' }}>
                  <label className="field-label">Nombre de vía</label>
                  <input
                    type="text"
                    className="field-input"
                    value={calle}
                    onChange={(e) => setcalle(e.target.value)}
                    placeholder="Ej: Los Laureles"
                  />
                </div>

                {/* Second row: ext and int each take half width */}
                <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label className="field-label">Nº Ext.</label>
                    <input
                      type="text"
                      className="field-input"
                      value={numero_exterior}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setnumero_exterior(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <label className="field-label">Nº Int.</label>
                    <input
                      type="text"
                      className="field-input"
                      value={numero_interior}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setnumero_interior(e.target.value.replace(/\D/g, ''))}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Referencia (opcional)</label>
              <input
                type="text"
                className="field-input"
                value={referencias}
                onChange={(e) => setreferencias(e.target.value)}
                placeholder="Cerca de..."
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel-alt" onClick={handleClose}>
            Cancelar
          </button>
          <button className="btn btn-confirm-alt" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;
