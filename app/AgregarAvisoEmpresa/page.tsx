"use client";

import React from "react";
import { AppShell } from "../components/AppShellDemo";

export default function AgregarAvisoEmpresaPage() {
  let Comp: React.ComponentType<any> | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Comp = require("../components/AgregarAvisoEmpresa").default;
  } catch (_) {
    Comp = null;
  }

  return (
    <AppShell>
      {Comp ? <Comp /> : <div className="p-4">AgregarAvisoEmpresa (componente no disponible)</div>}
    </AppShell>
  );
}
