"use client";

import React, { useMemo, useState } from "react";

export default function DatosPersonalesEmpresa() {
  const [form, setForm] = useState({
    razonSocial: "Panificados SRL",
    contacto: "Lucía Gómez",
    email: "empresa@example.com",
    telefono: "11 4444-4444",
    cp: "C1000",
    ciudad: "CABA",
    cuit: "20-12345678-3",
  });

  const emailOk = useMemo(() => /.+@.+\..+/.test(form.email), [form.email]);
  const telefonoOk = useMemo(() => form.telefono.trim().length >= 8, [form.telefono]);
  const cuitOk = useMemo(() => /^\d{2}-?\d{8}-?\d$/.test(form.cuit), [form.cuit]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOk || !telefonoOk || !cuitOk) {
      alert("Completá los campos obligatorios correctamente.");
      return;
    }
    alert("Datos de empresa guardados (demo)");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-emerald-50 via-white to-white px-4 py-6 text-slate-800">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-700">Datos personales (Empresa)</h2>

          <form onSubmit={onGuardar} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Razón social *</label>
              <input name="razonSocial" value={form.razonSocial} onChange={onChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400" required />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Contacto *</label>
              <input name="contacto" value={form.contacto} onChange={onChange} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400" required />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Correo electrónico *</label>
              <input name="email" value={form.email} onChange={onChange} className="w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400" required />
              {!emailOk && <p className="mt-1 text-[11px] text-rose-600">Ingresá un correo válido.</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Teléfono *</label>
              <input name="telefono" value={form.telefono} onChange={onChange} className="w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400" required />
              {!telefonoOk && <p className="mt-1 text-[11px] text-rose-600">Ingresá un teléfono válido.</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">CUIT/CUIL *</label>
              <input name="cuit" value={form.cuit} onChange={onChange} className="w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400" required />
              {!cuitOk && <p className="mt-1 text-[11px] text-rose-600">Ingresá CUIT válido.</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">CP</label>
              <input name="cp" value={form.cp} onChange={onChange} className="w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400" />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Ciudad</label>
              <input name="ciudad" value={form.ciudad} onChange={onChange} className="w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400" />
            </div>

            <div className="md:col-span-2 mt-4 flex items-center justify-between">
              <button type="button" onClick={() => alert('Eliminar cuenta (demo)')} className="rounded-full border border-rose-200 px-4 py-2 text-rose-600 hover:bg-rose-50">Eliminar cuenta</button>
              <button type="submit" className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-emerald-700">Guardar</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
