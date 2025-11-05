"use client";

import React, { useState } from "react";

export default function AgregarAvisoEmpresa() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [cp, setCp] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [requirements, setRequirements] = useState("");
  const [deadline, setDeadline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSave = title.trim() !== "" && description.trim() !== "" && city.trim() !== "" && cp.trim() !== "" && contactEmail.trim() !== "";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!canSave) return;
    alert("Aviso agregado (demo)");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 px-4 py-6 text-slate-800">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-700">Crear nuevo aviso</h2>
          <p className="-mt-2 mb-4 text-xs text-slate-500">Completá los datos del puesto que querés publicar.</p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Título del aviso <span className="text-rose-600">*</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Desarrollador frontend, Auxiliar administrativo..."
                className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${!submitted || title ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"}`}
              />
              {submitted && !title && <p className="text-[11px] text-rose-600">Requerido</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Descripción <span className="text-rose-600">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detallá tareas, experiencia requerida y beneficios..."
                rows={6}
                className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${!submitted || description ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"}`}
              />
              {submitted && !description && <p className="text-[11px] text-rose-600">Requerido</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Ciudad <span className="text-rose-600">*</span></label>
                <input value={city} onChange={(e) => setCity(e.target.value)} className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${!submitted || city ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"}`} />
                {submitted && !city && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Código Postal (CP) <span className="text-rose-600">*</span></label>
                <input value={cp} onChange={(e) => setCp(e.target.value)} className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${!submitted || cp ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"}`} />
                {submitted && !cp && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Salario (opcional)</label>
                <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Ej. 120000" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Tipo de jornada</label>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Por hora</option>
                  <option>Temporario</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Requisitos (opcional)</label>
              <input value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Ej. 2 años de experiencia en..." className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Fecha límite</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Teléfono (opcional)</label>
                <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Ej. 11 1234-5678" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Correo de contacto <span className="text-rose-600">*</span></label>
              <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="contacto@empresa.com" className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${!submitted || contactEmail ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"}`} />
              {submitted && !contactEmail && <p className="text-[11px] text-rose-600">Requerido</p>}
            </div>

            <div className="mt-2 flex items-center justify-end gap-2">
              <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50">Cancelar</button>
              <button type="submit" disabled={!canSave} className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">Guardar</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
