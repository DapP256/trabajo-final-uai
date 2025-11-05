"use client";

import React, { useEffect, useMemo, useState } from "react";

export default function EmpleadoPostulacion() {
  type Aviso = {
    id: number;
    titulo: string;
    rol: string;
    empresa: string;
    ubicacion: string;
    jornada: string;
    salario: number;
    fecha: string;
    descripcion: string;
    requerimientos: string;
  };

  type PostulacionForm = {
    mensaje: string;
    acepta: boolean;
  };

  const avisosSeed: Aviso[] = useMemo(
    () => [
      {
        id: 101,
        titulo: "Mozo/a fin de semana",
        rol: "Mozo/a",
        empresa: "Café Centro",
        ubicacion: "Microcentro",
        jornada: "Por horas",
        salario: 7500 * 4,
        fecha: "2025-09-21",
        descripcion: "Atención en salón, manejo de bandeja y pos.",
        requerimientos: "Experiencia 6m, libreta sanitaria vigente.",
      },
      {
        id: 102,
        titulo: "Cocinero/a part-time",
        rol: "Cocinero/a",
        empresa: "Restó Norte",
        ubicacion: "Núñez",
        jornada: "Part-time",
        salario: 7500 * 5,
        fecha: "2025-09-22",
        descripcion: "Producción fría/caliente, mise en place.",
        requerimientos: "Curso de manipulación de alimentos.",
      },
      {
        id: 103,
        titulo: "Cajero/a turno tarde",
        rol: "Cajero/a",
        empresa: "Panadería Oeste",
        ubicacion: "Haedo",
        jornada: "Full-time",
        salario: 7500 * 8,
        fecha: "2025-09-23",
        descripcion: "Caja, arqueos y conciliación básica.",
        requerimientos: "Secundario completo, manejo de POS.",
      },
    ],
    []
  );

  const [avisos, setAvisos] = useState<Aviso[]>(avisosSeed);
  const [filtroRol, setFiltroRol] = useState<string>("");
  const [filtroUbic, setFiltroUbic] = useState<string>("");
  const [seleccion, setSeleccion] = useState<Aviso | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const [form, setForm] = useState<PostulacionForm>({ mensaje: "", acepta: false });

  const money = (n: number) => `$ ${n.toLocaleString("es-AR")}`;
  const fmtDate = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("es-AR");

  const filtrados = avisos.filter((a) => {
    const okRol = !filtroRol || a.rol.toLowerCase().includes(filtroRol.toLowerCase());
    const okUb = !filtroUbic || a.ubicacion.toLowerCase().includes(filtroUbic.toLowerCase());
    return okRol && okUb;
  });

  const abrirPostulacion = (a: Aviso) => {
    setSeleccion(a);
    setExito(false);
    setEnviando(false);
    setForm({ mensaje: "", acepta: false });
  };

  const validar = (f: PostulacionForm) => !!f.acepta;

  const enviarPostulacion = async () => {
    if (!seleccion) return;
    if (!validar(form)) {
      alert("Aceptá los términos para postularte.");
      return;
    }
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 600));
    setEnviando(false);
    setExito(true);
  };

  const cerrarModal = () => {
    setSeleccion(null);
    setExito(false);
  };

  useEffect(() => {
    try {
      console.assert(Array.isArray(avisosSeed) && avisosSeed.length >= 3, "Debe haber al menos 3 avisos");
      console.assert(typeof money(1000) === "string", "money debe devolver string");
      console.assert(validar({ mensaje: "", acepta: true }) === true, "validar true con campos minimos");
      console.assert(validar({ mensaje: "", acepta: false }) === false, "validar false si faltan campos");
    } catch (_) {}
  }, [avisosSeed]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-emerald-50 via-white to-white text-slate-800">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Avisos disponibles</h1>
          <p className="text-sm text-slate-500">Postulate a un aviso y el negocio recibirá tu solicitud</p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Filtrar por Rol</label>
            <input
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring-4"
              placeholder="Ej. Mozo/a, Cocinero/a"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Filtrar por Ubicación</label>
            <input
              value={filtroUbic}
              onChange={(e) => setFiltroUbic(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring-4"
              placeholder="Ej. Microcentro, Núñez, Haedo"
            />
          </div>
        </div>

        <section className="rounded-2xl border border-emerald-100 bg-white">
          <div className="border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-semibold">Listado de avisos</h2></div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 font-medium">Título</th>
                  <th className="px-5 py-3 font-medium">Rol</th>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">Ubicación</th>
                  <th className="px-5 py-3 font-medium">Jornada</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                  <th className="px-5 py-3 font-medium">Salario ref.</th>
                  <th className="px-5 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 && (
                  <tr>
                    <td className="px-5 py-6 text-slate-400" colSpan={8}>No hay avisos con esos filtros.</td>
                  </tr>
                )}
                {filtrados.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100">
                    <td className="px-5 py-3">{a.titulo}</td>
                    <td className="px-5 py-3">{a.rol}</td>
                    <td className="px-5 py-3">{a.empresa}</td>
                    <td className="px-5 py-3">{a.ubicacion}</td>
                    <td className="px-5 py-3">{a.jornada}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{fmtDate(a.fecha)}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{money(a.salario)}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => abrirPostulacion(a)} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Postularme</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {seleccion && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
              {!exito ? (
                <>
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-base font-semibold">Postularse a: {seleccion.titulo}</h3>
                    <button onClick={cerrarModal} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">Cerrar</button>
                  </div>
                  <div className="mb-3 rounded-lg bg-slate-50 p-3 text-sm">
                    <p><span className="font-medium">Empresa:</span> {seleccion.empresa}</p>
                    <p><span className="font-medium">Rol:</span> {seleccion.rol}</p>
                    <p><span className="font-medium">Ubicación:</span> {seleccion.ubicacion} · <span className="font-medium">Fecha:</span> {fmtDate(seleccion.fecha)}</p>
                    <p><span className="font-medium">Jornada:</span> {seleccion.jornada} · <span className="font-medium">Salario ref.:</span> {money(seleccion.salario)}</p>
                  </div>

                  <form className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600">Mensaje para el negocio (opcional)</label>
                      <textarea value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-200 focus:ring-4" rows={3} placeholder="Breve presentación, disponibilidad horaria, experiencia relevante" />
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.acepta} onChange={(e) => setForm({ ...form, acepta: e.target.checked })} className="h-4 w-4 rounded border-slate-300" />
                      <span>Acepto compartir mis datos de perfil y documentación para esta postulación.</span>
                    </label>
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={cerrarModal} className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm">Cancelar</button>
                      <button type="button" onClick={enviarPostulacion} disabled={enviando} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                        {enviando ? "Enviando..." : "Enviar postulación"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-emerald-600/10 text-emerald-700 grid place-content-center">✓</div>
                  <h3 className="text-base font-semibold">¡Postulación enviada!</h3>
                  <p className="mt-1 text-sm text-slate-600">El negocio recibirá tu solicitud y podrás ver el estado en "Mis postulaciones".</p>
                  <div className="mt-4 flex justify-center">
                    <button onClick={cerrarModal} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Cerrar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
