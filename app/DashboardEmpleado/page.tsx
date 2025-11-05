"use client";

import React from "react";
import { AppShell } from "../components/AppShellDemo";

export default function DashboardEmpleadoPage() {
  let DashboardComp: React.ComponentType<any> | null = null;
  try {
    // dynamic import to reuse the same component
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    DashboardComp = require("../components/DashboardTrabajador").default;
  } catch (_) {
    DashboardComp = null;
  }

  return (
    <AppShell>
      {DashboardComp ? <DashboardComp /> : <div className="p-4">DashboardEmpleado (componente no disponible)</div>}
    </AppShell>
  );
}
