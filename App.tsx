
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
            <main className="flex-grow overflow-y-auto pb-16">
              <RestaurantList />
            </main>
            <BottomNav />
          </>
        );
    }
  };

  return (
    <div className="bg-[#181818] text-white font-sans">
      {/* The max-w-sm and mx-auto classes make the design responsive 
          by centering the content in a mobile-sized container on larger screens. */}
      <div className="max-w-sm mx-auto bg-[#181818] relative flex flex-col h-screen">
        <RoleSwitcher currentRole={role} onRoleChange={setRole} />
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
