"use client";

import React, { useState, useEffect, PropsWithChildren, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SessionPayload } from "@/lib/auth/session";
import { MANITO_USER_STORAGE_KEY } from "@/lib/auth/constants";

type SessionUser = SessionPayload['user'];

function Header({ open, onToggleSidebar }: { open: boolean; onToggleSidebar: () => void }) {
  return (
    <header data-testid="app-header" className="fixed inset-x-0 top-0 z-50 relative flex h-14 items-center border-b border-slate-200 bg-white/90 backdrop-blur">
      <button
        data-testid="hamburger"
        onClick={onToggleSidebar}
        aria-pressed={open}
        className="absolute left-1 md:left-2 lg:left-4 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white/80 backdrop-blur text-slate-700 hover:bg-slate-50"
        aria-label="Abrir/cerrar menú"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <div className="mx-auto flex w-full max-w-screen-xl items-center gap-3 px-0 md:px-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-content-center rounded-md bg-emerald-600 text-white font-semibold">M</div>
          <span className="text-sm font-medium text-slate-700">Manito · Panel</span>
        </div>
        <div
          data-testid="header-slot"
          aria-label="Espacio para componente del header"
          className="ml-auto h-10 w-[220px] sm:w-[280px] md:w-[320px]"
        />
      </div>
    </header>
  );
}

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  navigate: (p: string) => void;
  onLogout: () => void;
  sessionUser: SessionPayload['user'] | null;
};

function Sidebar({ open, onClose, navigate, onLogout, sessionUser }: SidebarProps) {
  const [role, setRole] = useState<SessionPayload['user']['rol'] | null>(sessionUser?.rol ?? null);

  useEffect(() => {
    if (sessionUser?.rol) {
      setRole(sessionUser.rol);
      return;
    }

    if (typeof window === 'undefined') {
      setRole(null);
      return;
    }

    try {
      const stored = sessionStorage.getItem(MANITO_USER_STORAGE_KEY) || localStorage.getItem(MANITO_USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.rol) {
          setRole(parsed.rol);
          return;
        }
      }
    } catch (_) {
      // ignore
    }

    setRole(null);
  }, [sessionUser]);

  const isAdmin = role === 'administrador';
  const isEmpleado = role === 'trabajador';
  const isEmpresa = role === 'empresa';

  const allItems = [
    { label: "Dashboard empleado", key: "emp.dashboard" },
    { label: "Datos personales (E)", key: "emp.datosE" },
    { label: "Documentacion (E)", key: "emp.docsE" },
    { label: "Postular Aviso (E)", key: "emp.postularE" },
    { label: "Reclamos (E)", key: "emp.reclamosE" },
    { label: "Dashboard Empresa", key: "empr.dashboard" },
    { label: "Datos personales (EM)", key: "empr.datosEM" },
    { label: "Documentacion (EM)", key: "empr.docsEM" },
    { label: "Solicitud Empleado (EM)", key: "empr.solicitudEM" },
    { label: "Seleccion de Colaboladores (EM)", key: "empr.seleccionEM" },
    { label: "Datos Pago (EM)", key: "empr.pagosEM" },
    { label: "Reclamos (EM)", key: "empr.reclamosEM" },
    { label: "Cerrar Sesion", key: "common.logout" },
  ];

  const hiddenKeysForEmpleado = new Set([
    'empr.dashboard',
    'empr.datosEM',
    'empr.docsEM',
    'empr.solicitudEM',
    'empr.pagosEM',
    'empr.reclamosEM',
  ]);

  const hiddenKeysForEmpresa = new Set([
    'emp.dashboard',
    'emp.datosE',
    'emp.docsE',
    'emp.postularE',
    'emp.reclamosE',
  ]);

  const hiddenKeys = new Set<string>();
  if (isEmpleado && !isAdmin) {
    for (const k of hiddenKeysForEmpleado) hiddenKeys.add(k);
  }
  if (isEmpresa && !isAdmin) {
    for (const k of hiddenKeysForEmpresa) hiddenKeys.add(k);
  }

  if (!isEmpresa && !isAdmin) hiddenKeys.add('empr.seleccionEM');

  const items = allItems.filter((it) => !hiddenKeys.has(it.key));


  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 z-40 pt-14 flex h-full w-72 flex-col overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-200 lg:fixed lg:top-14 lg:z-40 ${
          open ? "translate-x-0" : "-translate-x-full lg:-translate-x-72"
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4 lg:hidden">
          <div className="grid h-8 w-8 place-content-center rounded-md bg-emerald-600 text-white font-semibold">M</div>
          <span className="text-sm font-medium text-slate-700">Menú</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" data-testid="sidebar-nav">
          {items.map((item) => (
            <button
              key={item.key}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => {
                // map specific keys to routes
                if (item.key === 'emp.dashboard') {
                  navigate('/DashboardEmpleado');
                } else if (item.key === 'emp.datosE') {
                  navigate('/DatosEmpleado');
                } else if (item.key === 'emp.docsE') {
                  navigate('/DocumentacionEmpleado');
                } else if (item.key === 'emp.postularE') {
                  navigate('/PostularAvisoEmpleado');
                } else if (item.key === 'emp.reclamosE') {
                  navigate('/ReclamosEmpleado');
                } else if (item.key === 'empr.dashboard') {
                  navigate('/DashboardEmpresa');
                } else if (item.key === 'empr.datosEM') {
                  navigate('/DatosEmpresa');
                } else if (item.key === 'empr.docsEM') {
                  navigate('/DocumentacionEmpresa');
                } else if (item.key === 'empr.solicitudEM') {
                  navigate('/AgregarAvisoEmpresa');
                } else if (item.key === 'empr.seleccionEM') {
                  navigate('/ElegirColaboradorEmpresa');
                } else if (item.key === 'empr.pagosEM') {
                  navigate('/PagosEmpresa');
                } else if (item.key === 'empr.reclamosEM') {
                  navigate('/ReclamosEmpresa');
                } else if (item.key === 'common.logout') {
                  onClose();
                  onLogout();
                  return;
                }
                onClose();
              }}
            >
              <span>{item.label}</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

function Footer() {
  return (
    <footer data-testid="app-footer" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Manito · CABA/AMBA
      </div>
    </footer>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || '/';

  useEffect(() => {
    let active = true;
    const loadSession = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!active) return;
        if (!res.ok) {
          setSessionUser(null);
        } else {
          const body = await res.json();
          setSessionUser(body?.user ?? null);
        }
      } catch (_) {
        if (active) setSessionUser(null);
      } finally {
        if (active) setSessionLoaded(true);
      }
    };
    loadSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // attach a global handler to suppress unhandled promise rejections that are AbortError from Next navigation
    const onUnhandled = (e:any) => {
      try {
        const reason = e?.reason || e?.detail || null;
        if (!reason) return;
        if (reason && (reason.name === 'AbortError' || (reason.message && String(reason.message).toLowerCase().includes('aborted')))) {
          // prevent default logging of this unhelpful rejected navigation promise
          if (e && typeof e.preventDefault === 'function') e.preventDefault();
        }
      } catch (_) {}
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', onUnhandled as EventListener);
    }

    try {
      const headerEl = document.querySelector('[data-testid="app-header"]') as HTMLElement | null;
      console.assert(headerEl, "TC1: header renderizado");
      if (headerEl) {
        console.assert(headerEl.className.includes('fixed'), 'TC2: header es fixed');
        console.assert(!headerEl.className.includes('\\'), 'TC3: header sin backslashes en className');
      }
      const rightCol = document.querySelector('[data-testid="right-col"]') as HTMLElement | null;
      console.assert(rightCol, "TC4: columna derecha existe");
      if (rightCol) {
        console.assert(rightCol.className.includes('pt-14'), 'TC5: columna derecha compensa header con pt-14');
        console.assert(!rightCol.className.includes('\\'), 'TC6: columna derecha sin backslashes en className');
      }
      const footerEl = document.querySelector('[data-testid="app-footer"]') as HTMLElement | null;
      console.assert(footerEl, 'TC7: footer renderizado');
      if (footerEl && rightCol) {
        console.assert(!rightCol.contains(footerEl), 'TC8: footer full-bleed fuera de la columna derecha');
      }
      const burger = document.querySelector('[data-testid="hamburger"]') as HTMLButtonElement | null;
      console.assert(burger, 'TC9: botón hamburguesa presente');
      if (burger) {
        console.assert(burger.getAttribute('aria-pressed') !== null, 'TC10: aria-pressed seteado en el botón');
        console.assert(burger.getAttribute('aria-pressed') === 'false', 'TC11: sidebar cerrado inicialmente');
      }
      const asideEl = document.querySelector('aside') as HTMLElement | null;
      console.assert(asideEl, 'TC12: sidebar existe');
      if (asideEl) {
        console.assert(asideEl.className.includes('-translate-x-full'), 'TC13: sidebar cerrado en mobile al iniciar');
      }
      const page = document.querySelector('[data-testid="page-container"]') as HTMLElement | null;
      console.assert(page, 'TC14: contenedor de página existe');
      if (page) {
        console.assert(page.className.includes('100vh'), 'TC15: contenedor usa altura relativa a viewport');
      }

      const nav = document.querySelector('[data-testid="sidebar-nav"]') as HTMLElement | null;
      console.assert(nav, 'TC16: nav del sidebar existe');
      if (nav) {
        console.assert(!nav.className.includes('\\'), 'TC17: nav sin backslashes');
        const buttons = Array.from(nav.querySelectorAll('button')) as HTMLButtonElement[];
        console.assert(buttons.length >= 6, `TC18: sidebar tiene items visibles, actual=${buttons.length}`);
      }

      const headerSlot = document.querySelector('[data-testid="header-slot"]') as HTMLElement | null;
      console.assert(headerSlot, 'TC21: header-slot reservado existe');
      if (headerSlot) {
        const rect = headerSlot.getBoundingClientRect();
        console.assert(rect.height >= 36, `TC22: header-slot tiene altura razonable >=36px, actual=${rect.height}`);
        console.assert(rect.width >= 200, `TC23: header-slot tiene ancho minimo >=200px, actual=${rect.width}`);
      }

      const anyBackslash = Array.from(document.querySelectorAll('[class]')).some(el => (el as HTMLElement).className.includes('\\'));
      console.assert(!anyBackslash, 'TC20: no hay backslashes en ninguna className');
    } catch (_) {
      // no-op
    }

    // keep effect for tests only; pathname is provided by next/navigation
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('unhandledrejection', onUnhandled as EventListener);
    };
  }, []);

    const navigate = useCallback((p: string) => {
    try {
      const nav = router.push(p);
      if (nav && typeof (nav as Promise<any>).catch === 'function') {
        (nav as Promise<any>).catch((err) => {
          if (err && (err.name === 'AbortError' || (err.message && err.message.toLowerCase().includes('aborted')))) return;
          // eslint-disable-next-line no-console
          console.error('Navigation error:', err);
        });
      }
    } catch (e) {
      if (typeof window !== 'undefined') window.history.pushState({}, '', p);
    }
  }, [router]);

  const logout = useCallback(() => {
    setSidebarOpen(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(MANITO_USER_STORAGE_KEY);
        sessionStorage.removeItem(MANITO_USER_STORAGE_KEY);
        sessionStorage.removeItem('manito_session');
      } catch (_) {}
      void fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    }
    // router.replace returns a promise; attach catch to avoid unhandled rejections
    try {
      const p = router.replace('/login');
      if (p && typeof (p as Promise<any>).catch === 'function') {
        (p as Promise<any>).catch((err: any) => {
          if (err && (err.name === 'AbortError' || (err.message && err.message.toLowerCase().includes('aborted')))) return;
          if (typeof window !== 'undefined') window.location.href = '/login';
        });
      }
    } catch (err) {
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
  }, [router]);

  return (
    <>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} navigate={navigate} onLogout={logout} />

        <div data-testid="right-col" className={`pt-14 flex min-h-screen flex-1 flex-col ${sidebarOpen ? "lg:ml-72" : "lg:ml-0"}`}>
          <Header open={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

          <main className="flex-1 px-2 py-2 md:px-4 md:py-4">
            <div data-testid="page-container" className="min-h-[calc(100vh-5.5rem)] w-full bg-white p-4 md:p-6 rounded-lg shadow-sm">
              {pathname === '/DashboardEmpleado' ? (
                // lazy require to avoid import cycles
                (() => {
                  try {
                    const Comp = require('../components/DashboardTrabajador').default;
                    return <Comp />;
                  } catch (e) {
                    return <div>DashboardEmpleado (componente no disponible)</div>;
                  }
                })()
              ) : pathname === '/DatosEmpleado' ? (
                (() => {
                  try {
                    const Comp = require('../components/DatosPersonalesEmpleado').default;
                    return <Comp />;
                  } catch (e) {
                    return <div>DatosEmpleado (componente no disponible)</div>;
                  }
                })()
              ) : pathname === '/DocumentacionEmpleado' ? (
                (() => {
                  try {
                    const Comp = require('../components/DocumentacionEmpleado').default;
                    return <Comp />;
                  } catch (e) {
                    return <div>DocumentacionEmpleado (componente no disponible)</div>;
                  }
                })()
              ) : pathname === '/PostularAvisoEmpleado' ? (
                (() => {
                  try {
                    const Comp = require('../components/EmpleadoPostulacion').default;
                    return <Comp />;
                  } catch (e) {
                    return <div>PostularAvisoEmpleado (componente no disponible)</div>;
                  }
                })()
              ) : pathname === '/DashboardEmpresa' ? (
                (() => {
                  try {
                    const Comp = require('../components/DashboardEmpresa').default;
                    return <Comp />;
                  } catch (e) {
                    return <div>DashboardEmpresa (componente no disponible)</div>;
                  }
                })()
              ) : pathname === '/DatosEmpresa' ? (
                (() => {
                  try {
                    const Comp = require('../components/DatosPersonalesEmpresa').default;
                    return <Comp />;
                  } catch (e) {
                    return <div>DatosEmpresa (componente no disponible)</div>;
                  }
                })()
              ) : pathname === '/AgregarAvisoEmpresa' ? (
                (() => {
                  try {
                    const Comp = require('../components/AgregarAvisoEmpresa').default;
                    return <Comp />;
                  } catch (e) {
                    return <div>AgregarAvisoEmpresa (componente no disponible)</div>;
                  }
                })()
              ) : pathname === '/PagosEmpresa' ? (
                (() => {
                  try {
                    const Comp = require('../components/DatosParaRecibirPagos').default;
                    return <Comp />;
                  } catch (e) {
                    return <div>PagosEmpresa (componente no disponible)</div>;
                  }
                })()
              ) : pathname === '/ElegirColaboradorEmpresa' ? (
                (() => {
                  try {
                    const Comp = require('../components/SeleccionColaboradoresSoloRol').default;
                    return <Comp />;
                  } catch (e) {
                    return <div>ElegirColaboradorEmpresa (componente no disponible)</div>;
                  }
                })()
              ) : (
                children
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function Demo() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-800">Vista previa del AppShell</h1>
        <p className="text-sm text-slate-600">
          Usa el botón hamburguesa para abrir/cerrar el sidebar. Este bloque es un ejemplo de contenido.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <h2 className="text-sm font-medium text-slate-700 mb-2">Tarjeta 1</h2>
            <p className="text-xs text-slate-600">Componente de demostración dentro del contenedor principal.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h2 className="text-sm font-medium text-slate-700 mb-2">Tarjeta 2</h2>
            <p className="text-xs text-slate-600">Puedes reemplazar este contenido por tus rutas reales.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
