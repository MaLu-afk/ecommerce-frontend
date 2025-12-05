// src/admin/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/shared/AdminHeader';  
import AdminFooter from '../components/shared/AdminFooter';
import AdminNavigation from '../components/shared/AdminNavigation';
import NotificationProvider from '../context/NotificationContext';
import NotificationContainer from '../components/shared/NotificationContainer';
import '../styles/admin-global.css';

export default function AdminLayout() {
  return (
    <NotificationProvider>
      <div className="admin-layout" style={{ position: 'relative', minHeight: '100vh' }}>
        <AdminHeader /> 
        <NotificationContainer />
        <AdminNavigation />
        
        <main className="admin-main-content" style={{ paddingTop: '20px' }}>
          <div className="admin-container">
            <Outlet />
          </div>
        </main>

        <AdminFooter />
      </div>
    </NotificationProvider>
  );
}