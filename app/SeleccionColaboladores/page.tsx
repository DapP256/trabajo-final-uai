"use client";

import React from "react";
import { AppShell } from "../components/AppShellDemo";

export default function SeleccionColaboladoresPage() {
  let Comp: React.ComponentType<any> | null = null;
  try {
    // placeholder: reuse a simple component or render a message
    Comp = () => (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Selección de Colaboladores</h2>
        <p className="mt-2 text-sm text-slate-600">Página de selección de colaboradores (demo).</p>
      </div>
    );
  } catch (_) {
    Comp = null;
  }

  return (
    <AppShell>
      {Comp ? <Comp /> : <div className="p-4">Seleccion de Colaboladores (componente no disponible)</div>}
    </AppShell>
  );
}
