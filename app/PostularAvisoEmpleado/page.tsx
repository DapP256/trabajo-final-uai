"use client";

import React from "react";
import { AppShell } from "../components/AppShellDemo";

export default function PostularAvisoEmpleadoPage() {
  let Comp: React.ComponentType<any> | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Comp = require("../components/EmpleadoPostulacion").default;
  } catch (_) {
    Comp = null;
  }

  return (
    <AppShell>
      {Comp ? <Comp /> : <div className="p-4">PostularAvisoEmpleado (componente no disponible)</div>}
    </AppShell>
  );
}
