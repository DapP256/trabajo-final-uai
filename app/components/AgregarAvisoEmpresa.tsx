"use client";

import React, { useMemo, useState } from "react";

type Aviso = {
  id: string;
  title: string;
  description: string;
  city: string;
  cp: string;
  salary?: string;
  jobType: string;
  requirements?: string;
  deadline?: string;
  contactEmail: string;
  contactPhone?: string;
  status: "published" | "draft";
  createdAt: string;
};

function formatMoney(value?: string) {
  if (!value) return "-";
  const numeric = Number(value.replace(/[^0-9.,-]/g, "").replace(",", "."));
  if (Number.isNaN(numeric) || numeric <= 0) return "-";
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(numeric);
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AgregarAvisoEmpresa() {
  const seedAvisos = useMemo<Aviso[]>(
    () => [
      {
        id: "av-101",
        title: "Cajero/a turno mañana",
        description: "Cobro, arqueos y asistencia en salón.",
        city: "Caballito",
        cp: "1424",
        salary: "180000",
        jobType: "Full-time",
        requirements: "Manejo de POS, secundario completo",
        deadline: "2025-06-30",
        contactEmail: "rrhh@panaderialaespiga.com",
        contactPhone: "11 4567-1234",
        status: "published",
        createdAt: "2025-03-15T09:00:00Z",
      },
      {
        id: "av-102",
        title: "Mozo/a fin de semana",
        description: "Atención en salón viernes a domingo.",
        city: "Recoleta",
        cp: "1425",
        salary: "95000",
        jobType: "Part-time",
        requirements: "Experiencia 1 año, curso bromatología",
        deadline: "2025-07-12",
        contactEmail: "talento@bistrodelcentro.com",
        contactPhone: "11 6789-4455",
        status: "draft",
        createdAt: "2025-03-20T13:20:00Z",
      },
    ],
    []
  );

  const [avisos, setAvisos] = useState<Aviso[]>(seedAvisos);
  const [editingId, setEditingId] = useState<string | null>(null);

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
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [submitted, setSubmitted] = useState(false);

  const canSave =
    title.trim() !== "" &&
    description.trim() !== "" &&
    city.trim() !== "" &&
    cp.trim() !== "" &&
    contactEmail.trim() !== "";

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCity("");
    setCp("");
    setSalary("");
    setJobType("Full-time");
    setRequirements("");
    setDeadline("");
    setContactEmail("");
    setContactPhone("");
    setStatus("published");
    setEditingId(null);
    setSubmitted(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!canSave) return;

    const payload: Omit<Aviso, "id" | "createdAt"> = {
      title: title.trim(),
      description: description.trim(),
      city: city.trim(),
      cp: cp.trim(),
      salary: salary.trim(),
      jobType,
      requirements: requirements.trim(),
      deadline: deadline.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      status,
    };

    setAvisos((prev) => {
      if (editingId) {
        return prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...payload,
              }
            : item
        );
      }
      const newAviso: Aviso = {
        ...payload,
        id: `av-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      return [newAviso, ...prev];
    });

    resetForm();
  };

  const startEdit = (id: string) => {
    const aviso = avisos.find((item) => item.id === id);
    if (!aviso) return;
    setEditingId(aviso.id);
    setTitle(aviso.title);
    setDescription(aviso.description);
    setCity(aviso.city);
    setCp(aviso.cp);
    setSalary(aviso.salary || "");
    setJobType(aviso.jobType);
    setRequirements(aviso.requirements || "");
    setDeadline(aviso.deadline || "");
    setContactEmail(aviso.contactEmail);
    setContactPhone(aviso.contactPhone || "");
    setStatus(aviso.status);
    setSubmitted(false);
  };

  const removeAviso = (id: string) => {
    setAvisos((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const toggleStatus = (id: string) => {
    setAvisos((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "published" ? "draft" : "published",
            }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 px-4 py-6 text-slate-800">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mb-1 text-base font-semibold text-slate-700">Crear o editar aviso</h2>
              <p className="text-xs text-slate-500">Completá los datos del puesto que querés publicar.</p>
            </div>
            {editingId && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Editando aviso</span>
            )}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-6">
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
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${!submitted || city ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"}`}
                />
                {submitted && !city && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Código Postal (CP) <span className="text-rose-600">*</span></label>
                <input
                  value={cp}
                  onChange={(e) => setCp(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${!submitted || cp ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"}`}
                />
                {submitted && !cp && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Salario (opcional)</label>
                <input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Ej. 180000"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Tipo de jornada</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Por hora</option>
                  <option>Temporario</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Requisitos (opcional)</label>
              <input
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Ej. 2 años de experiencia en..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Fecha límite</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Teléfono (opcional)</label>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Ej. 11 1234-5678"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Correo de contacto <span className="text-rose-600">*</span></label>
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contacto@empresa.com"
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${!submitted || contactEmail ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"}`}
                />
                {submitted && !contactEmail && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Estado del aviso</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                >
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!canSave}
                className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingId ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-700">Listado de avisos</h3>
              <p className="text-xs text-slate-500">Gestioná tus publicaciones: activá, editá o eliminá cuando quieras.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Total: {avisos.length}</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Título</th>
                  <th className="px-4 py-3 text-left font-medium">Ciudad</th>
                  <th className="px-4 py-3 text-left font-medium">CP</th>
                  <th className="px-4 py-3 text-left font-medium">Jornada</th>
                  <th className="px-4 py-3 text-left font-medium">Salario</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha límite</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {avisos.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-400" colSpan={8}>
                      Aún no cargaste avisos. Completá el formulario para publicar tu primer búsqueda laboral.
                    </td>
                  </tr>
                ) : (
                  avisos.map((aviso) => (
                    <tr key={aviso.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-800">{aviso.title}</span>
                          <span className="text-xs text-slate-500">Creado: {formatDate(aviso.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{aviso.city}</td>
                      <td className="px-4 py-3">{aviso.cp}</td>
                      <td className="px-4 py-3">{aviso.jobType}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatMoney(aviso.salary)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(aviso.deadline)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleStatus(aviso.id)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            aviso.status === "published"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                          }`}
                        >
                          {aviso.status === "published" ? "Publicado" : "Borrador"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(aviso.id)}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAviso(aviso.id)}
                            className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600 hover:bg-rose-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
