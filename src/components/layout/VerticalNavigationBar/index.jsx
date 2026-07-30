import { lazy, Suspense, useMemo } from 'react';
import FallbackLoading from '@/components/FallbackLoading';
import LogoBox from '@/components/LogoBox';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { getMenuItems } from '@/helpers/menu';
import HoverMenuToggle from './components/HoverMenuToggle';
import { useAuth } from '@/context/AuthContext';

const AppMenu = lazy(() => import('./components/AppMenu'));

const VerticalNavigationBar = () => {
  const { user } = useAuth();

  const menuItems = useMemo(() => {
    const items = getMenuItems();

    // ✅ If SUPERADMIN → return all menus
    if (user?.role === "superadmin") return items;

    // ✅ If ADMIN → remove User Management
   if (user?.role === "admin") {
  return items.filter(
    (item) =>
      item.key !== "user-management" &&
      item.key !== "general" &&
      item.key !== "herosection"
  );
}


    // ✅ Default (safety)
    return items;
  }, [user]);

  return (
    <div className="main-nav" id="leftside-menu-container">
      <LogoBox
        containerClassName="logo-box "
          style={{ color: "#22282e" }}

        squareLogo={{ className: 'logo-sm' }}
        textLogo={{ className: 'logo-lg' }}
      />

      <HoverMenuToggle />

      <SimplebarReactClient className="scrollbar">
        <Suspense fallback={<FallbackLoading />}>
          <AppMenu menuItems={menuItems} />
        </Suspense>
      </SimplebarReactClient>
    </div>
  );
};

export default VerticalNavigationBar;
