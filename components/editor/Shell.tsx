import React from 'react';
import { ShellSettings } from './types';
import { cn } from '@/lib/utils';

interface ShellProps {
  shellSettings?: ShellSettings;
  children: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ shellSettings, children }) => {
  // Si no hay configuración o el tipo es 'none', simplemente devolver los children
  if (!shellSettings || shellSettings.type === 'none') {
    return <>{children}</>;
  }

  // Configuración predeterminada
  const title = shellSettings.title || 'Untitled';
  const showControls = shellSettings.showControls !== false;
  const shellColor = shellSettings.color || '#f0f0f0';

  // Renderizar shell de navegador
  if (shellSettings.type === 'browser') {
    return (
      <div className="flex flex-col w-full h-full overflow-hidden border border-gray-300 rounded-lg shadow-sm">
        {/* Barra de navegador */}
        <div 
          className="flex items-center px-2 py-1 border-b border-gray-300"
          style={{ backgroundColor: shellColor }}
        >
          {/* Controles (círculos de colores) */}
          {showControls && (
            <div className="flex space-x-1.5 mr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
          )}
          
          {/* Barra de URL */}
          <div className="flex-1 px-2 py-1 text-xs text-center bg-white bg-opacity-80 rounded-md mx-1 truncate">
            {title}
          </div>
        </div>
        
        {/* Contenido */}
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
    );
  }

  // Renderizar shell de teléfono
  else if (shellSettings.type === 'phone') {
    return (
      <div className="flex flex-col w-full h-full overflow-hidden border-2 border-gray-700 rounded-xl shadow-md">
        {/* Notch */}
        <div 
          className="relative flex justify-center py-1.5 border-b border-gray-300"
          style={{ backgroundColor: shellColor }}
        >
          <div className="absolute top-0 w-1/2 h-4 bg-gray-800 rounded-b-lg"></div>
        </div>
        
        {/* Contenido */}
        <div className="flex-1 w-full">
          {children}
        </div>
        
        {/* Barra inferior */}
        <div className="flex justify-center p-2 border-t border-gray-300 bg-gray-100">
          <div className="w-20 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Renderizar shell de tablet
  else if (shellSettings.type === 'tablet') {
    return (
      <div className="flex flex-col w-full h-full overflow-hidden border-2 border-gray-700 rounded-lg shadow-md">
        {/* Borde superior con cámara */}
        <div 
          className="flex justify-center py-2"
          style={{ backgroundColor: shellColor }}
        >
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
        </div>
        
        {/* Contenido */}
        <div className="flex-1 w-full border-t border-gray-300">
          {children}
        </div>
        
        {/* Botón inferior */}
        <div className="flex justify-center p-2 border-t border-gray-300 bg-gray-100">
          <div className="w-8 h-8 border border-gray-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Fallback para tipos no implementados
  return <>{children}</>;
};

export default Shell; 
