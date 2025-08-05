import { useGlobalContext } from '@/context/GlobalContext';

export const useSideMenu = () => {
  const { 
    isSideMenuVisible, 
    openSideMenu, 
    closeSideMenu, 
    toggleSideMenu 
  } = useGlobalContext();

  return {
    isSideMenuVisible,
    openSideMenu,
    closeSideMenu,
    toggleSideMenu,
  };
}; 