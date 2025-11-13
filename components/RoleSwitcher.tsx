
import React from 'react';
import type { UserRole } from '../types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles: UserRole[] = ['Cliente', 'Mensajero', 'Administracion'];

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="bg-[#3A3D42] p-2 flex justify-around items-center flex-shrink-0">
      <span className="text-sm font-bold text-white mr-2">Ver como:</span>
      <div className="flex space-x-2">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200
              ${
                currentRole === role
                  ? 'bg-[#FFDF00] text-[#181818]'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSwitcher;
