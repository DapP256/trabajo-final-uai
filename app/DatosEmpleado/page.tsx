"use client";

import React from "react";
import { AppShell } from "../../app/components/AppShellDemo";

export default function DatosEmpleadoPage() {
  let Comp: React.ComponentType<any> | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Comp = require("../../app/components/DatosPersonalesEmpleado").default;
  } catch (_) {
    Comp = null;
  }

  return (
    <AppShell>
      {Comp ? <Comp /> : <div className="p-4">DatosEmpleado (componente no disponible)</div>}
    </AppShell>
  );
}
