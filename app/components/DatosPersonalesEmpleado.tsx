"use client";

import React, { useMemo, useState } from "react";

export default function DatosPersonalesEmpleado() {
  const [form, setForm] = useState({
    apodo: "Dani",
    nombre: "Daniel",
    apellido: "Pérez",
    idNumero: "95040248",
    email: "daniel@example.com",
    movil: "11 5555-5555",
    nacimiento: "1998-05-20",
    genero: "sin_definir" as "sin_definir" | "hombre" | "mujer",
  });

  const [seg, setSeg] = useState({ actual: "", nueva: "", confirmar: "" });
  const [show, setShow] = useState({ actual: false, nueva: false, confirmar: false });

  const emailOk = useMemo(() => /.+@.+\..+/.test(form.email), [form.email]);
  const movilOk = useMemo(() => form.movil.trim().length >= 8, [form.movil]);
  const passStrong = useMemo(() => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(seg.nueva), [seg.nueva]);
  const passMatch = useMemo(() => seg.nueva === seg.confirmar && seg.nueva.length > 0, [seg.nueva, seg.confirmar]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOk || !movilOk) return;
    alert("Datos personales guardados (demo)");
  };

  const onActualizarPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passStrong || !passMatch) return;
    alert("Contraseña actualizada (demo)");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-emerald-50 via-white to-white px-4 py-6 text-slate-800">
      <div className="mx-auto grid max-w-5xl gap-4">
        <section className="rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <form onSubmit={onGuardar} className="p-4 md:p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-700">Datos personales</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-500">¿Cómo te llaman tus amigos? *</label>
                <input
                  name="apodo"
                  value={form.apodo}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                  placeholder="Dani"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Nombre *</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                  placeholder="Daniel"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Apellido *</label>
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                  placeholder="Pérez"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Número de identificación *</label>
                <input
                  name="idNumero"
                  value={form.idNumero}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                  placeholder="95040248"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Correo electrónico *</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400 outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">Visible pero no editable</p>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Número móvil *</label>
                <input
                  name="movil"
                  value={form.movil}
                  onChange={onChange}
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                    movilOk ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                  placeholder="11 5555-5555"
                  required
                />
                {!movilOk && (
                  <p className="mt-1 text-[11px] text-rose-600">Ingresá un número válido.</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Fecha de nacimiento *</label>
                <input
                  type="date"
                  name="nacimiento"
                  value={form.nacimiento}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-slate-500">Género *</label>
                <div className="flex gap-2">
                  {[
                    { key: "sin_definir", label: "Sin definir" },
                    { key: "hombre", label: "Hombre" },
                    { key: "mujer", label: "Mujer" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setForm((s) => ({ ...s, genero: opt.key as any }))}
                      className={`rounded-md border px-3 py-1.5 text-sm transition ${
                        form.genero === opt.key
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => alert("Eliminar cuenta (demo)")}
                className="rounded-full border border-rose-200 px-4 py-2 text-rose-600 hover:bg-rose-50"
              >
                Eliminar cuenta
              </button>

              <button
                type="submit"
                disabled={!emailOk || !movilOk}
                className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-700">Seguridad</h2>

          <form onSubmit={onActualizarPass} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Contraseña actual *</label>
              <div className="relative">
                <input
                  type={show.actual ? "text" : "password"}
                  value={seg.actual}
                  onChange={(e) => setSeg((s) => ({ ...s, actual: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 outline-none focus:border-emerald-400 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, actual: !s.actual }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                >
                  {show.actual ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Nueva contraseña *</label>
              <div className="relative">
                <input
                  type={show.nueva ? "text" : "password"}
                  value={seg.nueva}
                  onChange={(e) => setSeg((s) => ({ ...s, nueva: e.target.value }))}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:border-emerald-400 focus:bg-white ${
                    seg.nueva.length === 0 || passStrong ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                  placeholder="Mínimo 8 caracteres, 1 letra y 1 número"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, nueva: !s.nueva }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                >
                  {show.nueva ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Usá al menos 8 caracteres, con letras y números.</p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-slate-500">Confirmar nueva contraseña *</label>
              <div className="relative">
                <input
                  type={show.confirmar ? "text" : "password"}
                  value={seg.confirmar}
                  onChange={(e) => setSeg((s) => ({ ...s, confirmar: e.target.value }))}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:border-emerald-400 focus:bg-white ${
                    seg.confirmar.length === 0 || passMatch ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                  placeholder="Repetí la nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, confirmar: !s.confirmar }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                >
                  {show.confirmar ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end md:col-span-2">
              <button
                type="submit"
                disabled={!passStrong || !passMatch}
                className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Actualizar contraseña
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
