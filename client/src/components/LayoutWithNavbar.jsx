import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}