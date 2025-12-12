import { useEffect, useMemo, useState } from "react";
import { FULL_WIDTH, MINI_WIDTH, LOCAL_KEY } from "../../constants";

export default function useSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved === "true";
  });
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, String(collapsed));
  }, [collapsed]);

  const drawerWidth = useMemo(() => (collapsed ? MINI_WIDTH : FULL_WIDTH), [collapsed]);

  return {
    // state
    mobileOpen, collapsed, authOpen, drawerWidth,
    // setters
    setMobileOpen, setCollapsed, setAuthOpen,
    // helpers
    toggleMobile: () => setMobileOpen(v => !v),
    closeMobile: () => setMobileOpen(false),
    toggleCollapsed: () => setCollapsed(v => !v)
  };
}
