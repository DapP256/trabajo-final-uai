"use client";

import { useMemo } from "react";

export default function DashboardTrabajador() {
  const resumen = { proximos: 3, horas30d: 48, balance: 152000 };

  const proximosTurnos = useMemo(
    () => [
      {
        id: 1,
        rol: "Mozo/a",
        lugar: "Bar Centro",
        fecha: "22/09/2025",
        hora: "18:00–23:30",
        estado: "Check-in",
        direccion: "Av. Siempre Viva 123",
        statusTag: "checkin",
      },
      {
        id: 2,
        rol: "Cocina",
        lugar: "Resto Norte",
        fecha: "23/09/2025",
        hora: "12:00–16:00",
        estado: "Pendiente",
        direccion: "Av. Libertad 456",
        statusTag: "pendiente",
      },
      {
        id: 3,
        rol: "Cajero/a",
        lugar: "Café Oeste",
        fecha: "24/09/2025",
        hora: "09:00–13:00",
        estado: "Check-in",
        direccion: "Calle Sol 789",
        statusTag: "checkin",
      },
    ],
    []
  );

  const reclamos = [
    { id: "RP-20250920-AB12", titulo: "Pago/propina", subtitulo: "Diferencia en el monto acreditado", estado: "Abierto", prioridad: "Media", fecha: "2025-09-20" },
    { id: "RP-20250921-2X34", titulo: "Dirección incorrecta", subtitulo: "El mapa indicaba otra puerta de ingreso", estado: "En revisión", prioridad: "Baja", fecha: "2025-09-21" },
  ];

  const oportunidades = [
    { rol: "Mozo/a", lugar: "Bistró Palermo", fecha: "22/09/2025", horario: "19:00–23:30", distancia: "2.1 km", pago: 18000 },
    { rol: "Cocina", lugar: "Parrilla Centro", fecha: "22/09/2025", horario: "11:30–15:30", distancia: "3.8 km", pago: 16000 },
    { rol: "Delivery", lugar: "Pizza Norte", fecha: "23/09/2025", horario: "20:00–00:00", distancia: "5.2 km", pago: 21000 },
  ];

  const docs = [
    { nombre: "DNI", estado: "Vigente" },
    { nombre: "Libreta sanitaria", estado: "Vence en 12 días" },
    { nombre: "Cert. Manipulación", estado: "Vencido" },
  ];

  const badge = (label: string) => (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-slate-700">
      {label}
    </span>
  );

  const tagEstado = (tag: string) => {
    if (tag === "checkin") return <span className="rounded-full bg-emerald-600/10 px-2 py-1 text-xs font-semibold text-emerald-700">Check-in</span>;
    if (tag === "pendiente") return <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-700">Pendiente</span>;
    return badge(tag);
  };

  const tagDoc = (estado: string) => {
    if (estado === "Vigente") return <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-xs font-semibold text-emerald-700">Vigente</span>;
    if (estado.startsWith("Vence")) return <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700">{estado}</span>;
    return <span className="rounded-full bg-rose-600/10 px-2 py-0.5 text-xs font-semibold text-rose-700">Vencido</span>;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-emerald-50 via-white to-white text-slate-800">
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <p className="text-xs text-slate-500">Empresa</p>
            <p className="text-xs text-slate-500">ingrese nombre</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">Remuneración</p>
                <div className="mt-1 text-2xl font-semibold">$ {resumen.balance.toLocaleString("es-AR")}</div>
                <p className="text-xs text-slate-500">Monto estimado a hoy</p>
              </div>
              <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Ver detalle</button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <section className="md:col-span-2 rounded-2xl border border-emerald-100 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold">Empresa</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {proximosTurnos.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold">{t.rol} · {t.lugar}</p>
                    <p className="text-xs text-slate-500">{t.fecha} · {t.hora}</p>
                    <p className="text-xs text-slate-500">{t.direccion}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {tagEstado(t.statusTag)}
                    {t.statusTag === "checkin" && (
                      <button onClick={() => alert(`Check-in para turno #${t.id}`)} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Check-in</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="rounded-2xl border border-emerald-100 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold">Mis reclamos abiertos</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{reclamos.length}</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {reclamos.map((r) => (
                <li key={r.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold">{r.titulo}</p>
                    <p className="text-xs text-slate-500">{r.subtitulo}</p>
                    <p className="text-[11px] text-slate-400">{r.id} · {r.prioridad} · {r.fecha}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      r.estado === "Abierto" ? "bg-amber-500/10 text-amber-700" : "bg-sky-500/10 text-sky-700"
                    }`}>{r.estado}</span>
                    <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Ver detalle</button>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <section className="md:col-span-2 rounded-2xl border border-emerald-100 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold">Oportunidades sugeridas</h2>
              <p className="text-xs text-slate-400">Basadas en tu perfil y zona</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs text-slate-500">
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 font-medium">Rol</th>
                    <th className="px-5 py-3 font-medium">Lugar</th>
                    <th className="px-5 py-3 font-medium">Fecha</th>
                    <th className="px-5 py-3 font-medium">Horario</th>
                    <th className="px-5 py-3 font-medium">Distancia</th>
                    <th className="px-5 py-3 font-medium">Pago</th>
                    <th className="px-5 py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {oportunidades.map((o, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="px-5 py-3">{o.rol}</td>
                      <td className="px-5 py-3">{o.lugar}</td>
                      <td className="px-5 py-3">{o.fecha}</td>
                      <td className="px-5 py-3">{o.horario}</td>
                      <td className="px-5 py-3">{o.distancia}</td>
                      <td className="px-5 py-3">$ {o.pago.toLocaleString("es-AR")}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Ver detalles</button>
                          <button className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Aceptar</button>
                          <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Rechazar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-emerald-100 bg-white">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-semibold">Documentación</h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {docs.map((d) => (
                  <li key={d.nombre} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm">{d.nombre}</span>
                    {tagDoc(d.estado)}
                  </li>
                ))}
              </ul>
              <div className="px-5 pb-4 pt-2">
                <button className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Actualizar documentos</button>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-5">
              <h2 className="text-sm font-semibold">Reputación</h2>
              <div className="mt-2 flex items-end gap-3">
                <div className="text-4xl font-semibold leading-none">4.7</div>
                <div className="text-xs text-slate-500">Puntualidad 98% · Finalización 97%</div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
