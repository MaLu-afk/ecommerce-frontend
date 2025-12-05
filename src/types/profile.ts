// Interfaces para los datos del usuario

export type Address = {
  id: number;
  alias?: string;
  nombre_completo?: string;
  telefono?: string;
  tipo_Calle: string;
  calle: string;
  direccion: string;
  numero_exterior?: string;
  numero_interior?: string | null;
  distrito: string;
  provincia: string;
  departamento: string;
  pais?: string;
  referencias?: string;
  es_principal: boolean;
  [key: string]: any;
};


export type User = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  image?: string;
  phone?: string;
  addresses?: Address[];
  address?: Address[];
};


// Interfaz para la estructura de datos de ubigeo
export type UbigeoData = {
  [department: string]: {
    [province: string]: string[];
  };
}

// src/types/profile.ts
export type FieldId = 'fullName' | 'phone' | 'address' | 'password';

export type PasswordStrength = {
  level: number;
  text: string;
  class: string;
}
