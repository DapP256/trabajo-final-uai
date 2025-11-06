"use client";

import React from "react";
import { AppShell } from "../components/AppShellDemo";

export default function ReclamosEmpleadoPage() {
  let ReclamosComp: React.ComponentType<any> | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ReclamosComp = require("../components/ReclamosEmpleado").default;
  } catch (_) {
    ReclamosComp = null;
  }

  return (
    <AppShell>
      {ReclamosComp ? <ReclamosComp /> : <div className="p-4">ReclamosEmpleado (componente no disponible)</div>}
    </AppShell>
  );
}
