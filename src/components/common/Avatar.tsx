// src/components/common/Avatar.tsx
import { useMemo } from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string;
}

// Colores vibrantes para los avatares
const AVATAR_COLORS = [
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-blue-500 to-cyan-500',
  'bg-gradient-to-br from-green-500 to-emerald-500',
  'bg-gradient-to-br from-orange-500 to-red-500',
  'bg-gradient-to-br from-indigo-500 to-purple-500',
  'bg-gradient-to-br from-pink-500 to-rose-500',
  'bg-gradient-to-br from-teal-500 to-green-500',
  'bg-gradient-to-br from-yellow-500 to-orange-500',
];

const SIZES = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

export default function Avatar({ name, size = 'md', imageUrl }: AvatarProps) {
  // Obtener iniciales del nombre
  const initials = useMemo(() => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, [name]);

  // Seleccionar color basado en el nombre (consistente)
  const colorClass = useMemo(() => {
    const charCode = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
    return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
  }, [name]);

  const sizeClass = SIZES[size];

  // Si hay imagen, mostrarla
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClass} rounded-full object-cover border-2 border-white shadow-md`}
      />
    );
  }

  // Sino, mostrar iniciales con color
  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white`}
      title={name}
    >
      {initials}
    </div>
  );
}
