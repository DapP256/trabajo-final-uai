"use client";
import React, { useMemo, useState } from 'react';

export default function SeleccionColaboradoresSoloRol() {
  // ====== Mock data ======
  const base = useMemo(() => (
    [
      { id: 'c01', nombre: 'Brenda Núñez', rol: 'Mozo/a', empresa: 'Sucursal Centro', match: 92, rating: 4.7, docs: 'Vigente', disponibilidad: 'Fin de semana', estado: 'Postulado' },
      { id: 'c02', nombre: 'Lucas Peralta', rol: 'Cocina', empresa: 'Sucursal Norte', match: 86, rating: 4.4, docs: 'Próx. a vencer', disponibilidad: 'Turno noche', estado: 'Postulado' },
      { id: 'c03', nombre: 'Micaela Soto', rol: 'Cajero/a', empresa: 'Sucursal Centro', match: 79, rating: 4.1, docs: 'Incompleto', disponibilidad: 'Full-time', estado: 'Observado' },
      { id: 'c04', nombre: 'Daniel P.', rol: 'Mozo/a', empresa: 'Sucursal Centro', match: 88, rating: 4.6, docs: 'Vigente', disponibilidad: 'Turno mañana', estado: 'Postulado' },
      { id: 'c05', nombre: 'Carla López', rol: 'Cocina', empresa: 'Sucursal Norte', match: 73, rating: 3.9, docs: 'Vigente', disponibilidad: 'Turno tarde', estado: 'Postulado' },
    ]
  ), []);

  // ====== Estado UI ======
  const [rows, setRows] = useState(base);
  const [fRol, setFRol] = useState('');
  const [checked, setChecked] = useState<any>({});
  const [selectAll, setSelectAll] = useState(false);
  const [detailId, setDetailId] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null); // {action, ids}
  const [toast, setToast] = useState<any>(null);

  // ====== Derivados ======
  const filtered = rows
    .filter((r:any) => (!fRol || r.rol === fRol))
    .sort((a:any,b:any)=> b.match - a.match); // fijo por match desc

  const checkedIds = Object.keys(checked).filter(k => checked[k]);

  // ====== Helpers ======
  const toggleAll = () => {
    const value = !selectAll;
    setSelectAll(value);
    const next:any = {};
    filtered.forEach((r:any) => next[r.id] = value);
    setChecked(next);
  };
  const toggleOne = (id:string) => setChecked((prev:any) => ({...prev, [id]: !prev[id]}));
  const fmt = (n:any) => (Number(n) || 0).toLocaleString('es-AR');
  const showToast = (title:string, description?:string) => { setToast({ title, description }); setTimeout(()=>setToast(null), 2800); };

  // ====== Acciones ======
  const doAction = (action:string, ids:string[]) => {
    if (!ids.length) { showToast('Seleccioná candidatos', 'No hay colaboradores seleccionados'); return; }
    setConfirm({ action, ids });
  };
  const confirmAction = () => {
    if (!confirm) return;
    const { action, ids } = confirm;
    setRows((prev:any) => prev.map((r:any) => {
      if (!ids.includes(r.id)) return r;
      if (action === 'choose') return { ...r, estado: 'Elegido' };
      if (action === 'reject') return { ...r, estado: 'Rechazado' };
      return r;
    }));
    setChecked({}); setSelectAll(false);
    showToast('Acción aplicada', `${ids.length} colaborador(es): ${labelAction(confirm.action)}`);
    setConfirm(null);
  };

  // ====== Render ======
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Toolbar: SOLO filtro por rol */}
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="bg-white border rounded-2xl p-3 grid grid-cols-1 gap-3">
          <select value={fRol} onChange={(e)=>setFRol(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
            <option value="">Buscar por rol…</option>
            {uniq(base.map((b:any)=>b.rol)).map((r:any)=> <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Acciones masivas */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={()=>doAction('choose', checkedIds)} className="rounded-xl border px-3 py-2 text-sm bg-white">Elegir</button>
          <button onClick={()=>doAction('reject', checkedIds)} className="rounded-xl border px-3 py-2 text-sm bg-white">Rechazar</button>
          <span className="text-xs text-neutral-500 ml-auto">Seleccionados: {fmt(checkedIds.length)}</span>
        </div>
      </div>

      {/* Listado */}
      <div className="mx-auto max-w-7xl px-4 pb-10">
        <section className="bg-white rounded-2xl border overflow-hidden">
          <div className="hidden md:grid grid-cols-12 px-4 py-2 text-xs text-neutral-500">
            <div className="col-span-1"><input type="checkbox" checked={selectAll} onChange={toggleAll} /></div>
            <div className="col-span-3">Colaborador</div>
            <div className="col-span-2">Rol · Sede</div>
            <div className="col-span-1 text-right">Match</div>
            <div className="col-span-1 text-right">Rating</div>
            <div className="col-span-2">Docs</div>
            <div className="col-span-1 text-right">Estado</div>
          </div>
          <ul className="divide-y">
            {filtered.map((r:any) => (
              <li key={r.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
                <div className="col-span-2 md:col-span-1"><input type="checkbox" checked={!!checked[r.id]} onChange={()=>toggleOne(r.id)} /></div>
                <div className="col-span-10 md:col-span-3">
                  <div className="font-medium text-neutral-900">{r.nombre}</div>
                  <div className="text-[11px] text-neutral-500">ID {r.id}</div>
                </div>
                <div className="col-span-6 md:col-span-2 text-sm text-neutral-800">{r.rol} · {r.empresa}</div>
                <div className="col-span-3 md:col-span-1 text-sm text-right font-medium">{r.match}%</div>
                <div className="col-span-3 md:col-span-1 text-sm text-right">{r.rating.toFixed(1)}</div>
                <div className="col-span-6 md:col-span-2 text-sm">
                  <DocsChip v={r.docs} /> · <span className="text-neutral-500">{r.disponibilidad}</span>
                </div>
                <div className="col-span-9 md:col-span-1 text-right">
                  <EstadoChip estado={r.estado} />
                </div>
                <div className="col-span-12 md:col-span-12 flex justify-end gap-2 mt-2">
                  <button onClick={()=>setDetailId(r.id)} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50">Ver detalle</button>
                  <button onClick={()=>doAction('choose',[r.id])} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50">Elegir</button>
                  <button onClick={()=>doAction('reject',[r.id])} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50">Rechazar</button>
                </div>
              </li>
            ))}
            {filtered.length===0 && (
              <li className="px-4 py-6 text-sm text-neutral-500">No hay postulaciones que coincidan con el rol seleccionado.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Modal detalle */}
      {detailId && (
        <Modal onClose={()=>setDetailId(null)} title="Detalle del colaborador">
          {(() => { const r = rows.find((x:any)=>x.id===detailId); if(!r) return null; return (
            <div className="space-y-3 text-sm">
              <Row label="Nombre" value={r.nombre} />
              <Row label="Rol postulado" value={r.rol} />
              <Row label="Sede/Empresa" value={r.empresa} />
              <Row label="Match" value={`${r.match}%`} />
              <Row label="Rating" value={r.rating.toFixed(1)} />
              <Row label="Documentación" value={<DocsChip v={r.docs} />} />
              <Row label="Disponibilidad" value={r.disponibilidad} />
              <Row label="Estado" value={<EstadoChip estado={r.estado} />} />
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={()=>doAction('choose',[r.id])} className="rounded-xl border px-3 py-2 text-sm">Elegir</button>
              </div>
            </div>
          ); })()}
        </Modal>
      )}

      {/* Modal confirmación */}
      {confirm && (
        <Modal onClose={()=>setConfirm(null)} title="Confirmar acción">
          <div className="text-sm text-neutral-700">Vas a <span className="font-medium">{labelAction(confirm.action)}</span> {confirm.ids.length} colaborador(es). ¿Confirmás?</div>
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={()=>setConfirm(null)} className="rounded-xl border px-3 py-2 text-sm">Cancelar</button>
            <button onClick={confirmAction} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm">Confirmar</button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-2xl shadow-lg border bg-white px-4 py-3 min-w-[280px]">
            <p className="text-sm font-medium text-neutral-800">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-neutral-500 mt-0.5">{toast.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== UI helpers & utils ===== */
function uniq(arr:any){ return Array.from(new Set(arr)); }

function DocsChip({ v }:{ v:string }){
  const map:any = {
    'Vigente': 'bg-emerald-50 border-emerald-200 text-emerald-700',
    'Próx. a vencer': 'bg-amber-50 border-amber-200 text-amber-700',
    'Incompleto': 'bg-rose-50 border-rose-200 text-rose-700',
  };
  const cls = map[v] || 'bg-neutral-100 border-neutral-200 text-neutral-700';
  return <span className={`text-xs px-2 py-1 rounded-full border ${cls}`}>{v}</span>;
}

function EstadoChip({ estado }:{ estado:string }){
  const cls = estado === 'Postulado' ? 'bg-sky-50 border-sky-200 text-sky-700' :
              estado === 'Elegido' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
              estado === 'Rechazado' ? 'bg-rose-50 border-rose-200 text-rose-700' :
              'bg-neutral-100 border-neutral-200 text-neutral-700';
  return <span className={`text-xs px-2 py-1 rounded-full border ${cls}`}>{estado}</span>;
}

function Row({ label, value }:{ label:string; value:any }){
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className="text-sm text-neutral-800">{value}</span>
    </div>
  );
}

function Modal({ title, children, onClose }:{ title:string; children:any; onClose:()=>void }){
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white border shadow-lg">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold text-neutral-900">{title}</div>
          <button onClick={onClose} className="text-sm text-neutral-500">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function labelAction(a:string){
  switch(a){
    case 'choose': return 'elegir';
    case 'reject': return 'rechazar';
    default: return a;
  }
}
