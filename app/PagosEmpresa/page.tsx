"use client";

import React from "react";
import { AppShell } from "../components/AppShellDemo";

export default function PagosEmpresaPage() {
  let Comp: React.ComponentType | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Comp = require("../components/DatosParaRecibirPagos").default;
  } catch (_) {
    Comp = null;
  }

  return <AppShell>{Comp ? <Comp /> : <div className="p-4">Datos para recibir pagos (componente no disponible)</div>}</AppShell>;
}
