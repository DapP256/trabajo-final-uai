"use client";

import React, { useState } from "react";

export default function ReclamosAltaListadoV2() {
  const [form, setForm] = useState<any>(emptyForm());
  const [items, setItems] = useState<any[]>([]); // listado en memoria
  const [toast, setToast] = useState<any | null>(null);

  const onChange = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));
  const showToast = (title: string, description?: string) => {
    setToast({ title, description });
    setTimeout(() => setToast(null), 2800);
  };

  const guardar = () => {
    const e: any = {};
    if (!form.titulo.trim()) e.titulo = 'Título requerido';
    if (!form.categoria) e.categoria = 'Categoría requerida';
    if (!form.prioridad) e.prioridad = 'Prioridad requerida';
    if (!form.fecha) e.fecha = 'Fecha requerida';
    if (!form.descripcion.trim()) e.descripcion = 'Descripción requerida';
    if (Object.keys(e).length) {
      const m = Object.values(e)[0];
      showToast('Revisar datos', String(m));
      return;
    }

    const id = generarId(form);
    const nuevo = { ...form, id, estado: 'Abierto' };
    setItems((prev) => [nuevo, ...prev]);
    showToast('Reclamo cargado', id);
    setForm(emptyForm());
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Formulario de alta */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        <section className="bg-white rounded-2xl border shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">Título</label>
            <input
              value={form.titulo}
              onChange={(e) => onChange('titulo', e.target.value)}
              placeholder="Ej. Alta de legajo / Novedad de haberes"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          {/* Categoría RRHH (subcategorías inventadas) */}
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">Categoría (RRHH)</label>
            <select
              value={form.categoria}
              onChange={(e) => onChange('categoria', e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              <option value="">Seleccionar…</option>
              {CATEGORIAS_RRHH.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-neutral-500">Ámbito: Recursos Humanos</p>
          </div>

          <div>
            <label className="text-xs text-neutral-600">Prioridad</label>
            <select
              value={form.prioridad}
              onChange={(e) => onChange('prioridad', e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              {PRIORIDADES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-600">Fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => onChange('fecha', e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">Descripción</label>
            <textarea
              rows={5}
              value={form.descripcion}
              onChange={(e) => onChange('descripcion', e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-2">
            <div className="text-xs text-neutral-500">
              Estado inicial: <span className="font-medium text-neutral-800">Abierto</span> (fijo) · Categoría RRHH
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setForm(emptyForm())}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
              >
                Limpiar
              </button>
              <button
                onClick={guardar}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm"
              >
                Cargar reclamo
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Listado */}
      <div className="mx-auto max-w-4xl px-4 pb-10">
        <section className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="text-sm font-medium text-neutral-900">Reclamos cargados</div>
            <div className="text-xs text-neutral-500">{items.length} registro(s)</div>
          </div>

          <div className="hidden md:grid grid-cols-12 px-4 py-2 text-xs text-neutral-500">
            <div className="col-span-3">Título</div>
            <div className="col-span-3">Categoría</div>
            <div className="col-span-2">Prioridad</div>
            <div className="col-span-2">Fecha</div>
            <div className="col-span-2 text-right">Estado</div>
          </div>

          <ul className="divide-y">
            {items.length === 0 && (
              <li className="px-4 py-6 text-sm text-neutral-500">Aún no hay reclamos cargados.</li>
            )}
            {items.map((r) => (
              <li key={r.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
                <div className="col-span-12 md:col-span-3">
                  <div className="font-medium text-neutral-900">{r.titulo}</div>
                  <div className="text-[11px] text-neutral-500">{r.id}</div>
                </div>
                <div className="col-span-6 md:col-span-3 text-sm text-neutral-800">{r.categoria}</div>
                <div className="col-span-3 md:col-span-2">
                  <span className={`text-xs px-2 py-1 rounded-full border ${badgeCls(r.prioridad)}`}>{r.prioridad}</span>
                </div>
                <div className="col-span-3 md:col-span-2 text-sm text-neutral-800">{fmtDate(r.fecha)}</div>
                <div className="col-span-12 md:col-span-2 text-right">
                  <EstadoChip estado={r.estado} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-2xl shadow-lg border bg-white px-4 py-3 min-w-[280px]">
            <p className="text-sm font-medium text-neutral-800">{toast.title}</p>
            {toast.description && <p className="text-xs text-neutral-500 mt-0.5">{toast.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Helpers =====
const PRIORIDADES = ['Baja', 'Media', 'Alta'];
const CATEGORIAS_RRHH = [
  'Nómina y haberes',
  'Legajos y documentación',
  'Altas, bajas y movimientos',
  'Vacaciones y licencias',
  'Asistencia y ausentismo',
  'Beneficios y compensaciones',
  'Capacitaciones y desarrollo',
  'Evaluación de desempeño',
  'Seguridad e higiene',
  'Relaciones laborales',
  'Reclutamiento y selección',
];

function emptyForm() {
  const hoy = new Date().toISOString().slice(0, 10);
  return { titulo: '', categoria: '', prioridad: 'Baja', fecha: hoy, descripcion: '' };
}

function generarId(f: any) {
  const fecha = (f?.fecha || new Date().toISOString().slice(0, 10)).replaceAll('-', '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RP-${fecha}-${rand}`;
}

function fmtDate(yyyyMMdd: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMMdd)) return yyyyMMdd;
  const [y, m, d] = yyyyMMdd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function badgeCls(p: string) {
  if (p === 'Alta') return 'bg-red-50 border-red-200 text-red-700';
  if (p === 'Media') return 'bg-amber-50 border-amber-200 text-amber-700';
  return 'bg-sky-50 border-sky-200 text-sky-700';
}

function EstadoChip({ estado }: { estado: string }) {
  const cls =
    estado === 'Abierto'
      ? 'bg-amber-50 border-amber-200 text-amber-700'
      : estado === 'En revisión'
      ? 'bg-sky-50 border-sky-200 text-sky-700'
      : estado === 'Resuelto'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
      : 'bg-neutral-100 border-neutral-200 text-neutral-700';
  return <span className={`text-xs px-2 py-1 rounded-full border ${cls}`}>{estado}</span>;
}
