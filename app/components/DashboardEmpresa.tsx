"use client";

import React from "react";

export default function DashboardEmpresa() {
  const stats = [
    { label: "Avisos activos", value: 12 },
    { label: "Postulantes últimos 7d", value: 87 },
    { label: "Pagos pendientes", value: 2 },
  ];

  const recent = [
    { id: 201, title: "Necesitamos mozo/a", applicants: 14, date: "2025-09-18" },
    { id: 202, title: "Cocinero/a jornada completa", applicants: 22, date: "2025-09-12" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-emerald-50 via-white to-white text-slate-800">
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Dashboard Empresa</h1>
            <p className="text-sm text-slate-500">Visión general de tus avisos y postulaciones</p>
          </div>
          <div>
            <button className="rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Nuevo aviso</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-emerald-100 bg-white p-4">
              <p className="text-xs text-slate-500">{s.label}</p>
              <div className="mt-2 text-2xl font-semibold">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4">
            <h2 className="text-sm font-semibold">Avisos recientes</h2>
            <ul className="mt-3 space-y-3">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{r.title}</div>
                    <div className="text-xs text-slate-500">{r.applicants} postulantes · {r.date}</div>
                  </div>
                  <div>
                    <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">Ver</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4">
            <h2 className="text-sm font-semibold">Pagos y facturación</h2>
            <p className="mt-2 text-xs text-slate-500">Resumen de últimas facturas y pagos realizados.</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm">Saldo disponible</div>
              <div className="text-lg font-semibold">$ 120.000</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
