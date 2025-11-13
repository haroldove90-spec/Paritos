
import React, { useState } from 'react';
import Header from './components/Header';
import SearchAndFilters from './components/SearchAndFilters';
import RestaurantList from './components/RestaurantList';
import BottomNav from './components/BottomNav';
import RoleSwitcher from './components/RoleSwitcher';
import AdminDashboard from './components/AdminDashboard';
import CourierDashboard from './components/CourierDashboard';
import type { UserRole } from './types';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('Cliente');

  const renderContent = () => {
    switch (role) {
      case 'Administracion':
        return <AdminDashboard />;
      case 'Mensajero':
        return <CourierDashboard />;
      case 'Cliente':
      default:
        return (
          <>
            <Header />
            <SearchAndFilters />
            <main className="flex-grow overflow-y-auto pb-20 md:pb-4">
              <RestaurantList />
            </main>
            <BottomNav />
          </>
        );
    }
  };

  return (
    <div className="bg-[#181818] text-white font-sans">
      <div className="w-full max-w-6xl mx-auto bg-[#181818] relative flex flex-col min-h-screen">
        <RoleSwitcher currentRole={role} onRoleChange={setRole} />
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
