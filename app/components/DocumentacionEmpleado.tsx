"use client";

import React, { useMemo, useState, useRef } from "react";

const MAX_MB = 10;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

function prettyBytes(n: number) {
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function Dropzone({
  label,
  required,
  file,
  onFile,
  error,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  onFile: (f: File | null) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onPick = () => inputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    const f = files && files[0] ? files[0] : null;
    if (!f) return onFile(null);
    if (!ALLOWED.includes(f.type)) {
      onFile(null);
      alert("Formato no permitido. Us�� JPG, PNG o PDF.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      onFile(null);
      alert(`El archivo supera ${MAX_MB} MB.`);
      return;
    }
    onFile(f);
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-rose-600">*</span>}
        </div>
        <p className="text-xs text-slate-500">JPG, PNG o PDF. Tamaño máx. 10 MB por archivo.</p>
      </div>

      <div className="ml-auto w-full max-w-[260px]">
        <div
          className={`grid place-content-center rounded-xl border border-dashed p-4 text-center ${
            error ? "border-rose-300 bg-rose-50/40" : "border-slate-300 bg-white"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {!file ? (
            <>
              <p className="text-xs text-slate-500">Arrastrá y soltá el archivo aquí</p>
              <button type="button" className="mt-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50" onClick={onPick}>
                Agregar archivo
              </button>
            </>
          ) : (
            <div className="text-left text-xs">
              <p className="truncate font-medium text-slate-700">{file.name}</p>
              <p className="text-slate-500">{file.type || "archivo"} · {prettyBytes(file.size)}</p>
              <div className="mt-2 flex gap-2">
                <button type="button" className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50" onClick={onPick}>
                  Cambiar
                </button>
                <button type="button" className="rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50" onClick={() => onFile(null)}>
                  Quitar
                </button>
              </div>
            </div>
          )}
        </div>
        {!!error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
      </div>
    </div>
  );
}

export default function DocumentacionEmpleado() {
  const [dniFrente, setDniFrente] = useState<File | null>(null);
  const [dniDorso, setDniDorso] = useState<File | null>(null);
  const [dniNumero, setDniNumero] = useState("");

  const [libSan, setLibSan] = useState<File | null>(null);
  const [libSanVto, setLibSanVto] = useState("");

  const [certMan, setCertMan] = useState<File | null>(null);
  const [certManVto, setCertManVto] = useState("");

  const [cuilConst, setCuilConst] = useState<File | null>(null);
  const [cuilNumero, setCuilNumero] = useState("");

  const [domicilio, setDomicilio] = useState<File | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const dniNumOk = useMemo(() => /^\d{7,8}$/.test(dniNumero), [dniNumero]);
  const cuilOk = useMemo(() => /^\d{2}-?\d{8}-?\d$/.test(cuilNumero) || /^\d{7,8}$/.test(cuilNumero), [cuilNumero]);

  const canSave = useMemo(() => {
    const reqFiles = !!dniFrente && !!dniDorso && !!libSan && !!certMan && !!cuilConst;
    const reqDates = !!libSanVto && !!certManVto;
    const reqNumbers = dniNumOk && cuilOk;
    return reqFiles && reqDates && reqNumbers;
  }, [dniFrente, dniDorso, libSan, certMan, cuilConst, libSanVto, certManVto, dniNumOk, cuilOk]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!canSave) return;
    alert("Documentación enviada (demo)");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 px-4 py-6 text-slate-800">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-700">Subí o actualizá tus documentos</h2>
          <p className="-mt-2 mb-4 text-xs text-slate-500">Formatos permitidos: JPG, PNG o PDF. Tamaño máx. 10 MB por archivo.</p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">DNI (frente) <span className="text-rose-600">*</span></label>
                <p className="text-xs text-slate-500">Foto legible</p>
                <label className="mb-1 block text-xs text-slate-600">Número / ID <span className="text-rose-600">*</span></label>
                <input
                  value={dniNumero}
                  onChange={(e) => setDniNumero(e.target.value)}
                  placeholder="Número / ID"
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                    !submitted || dniNumOk ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                />
                {submitted && !dniNumOk && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
              <Dropzone label=" " required file={dniFrente} onFile={setDniFrente} error={submitted && !dniFrente ? "Requerido" : ""} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">DNI (dorso) <span className="text-rose-600">*</span></label>
                <p className="text-xs text-slate-500">Foto legible</p>
              </div>
              <Dropzone label=" " required file={dniDorso} onFile={setDniDorso} error={submitted && !dniDorso ? "Requerido" : ""} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Libreta sanitaria</label>
                <p className="text-xs text-slate-500">Foto o PDF. Requiere fecha de vencimiento.</p>
                <label className="mb-1 block text-xs text-slate-600">Fecha de vencimiento <span className="text-rose-600">*</span></label>
                <input
                  type="date"
                  value={libSanVto}
                  onChange={(e) => setLibSanVto(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                    !submitted || libSanVto ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                />
                {submitted && !libSanVto && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
              <Dropzone label=" " required file={libSan} onFile={setLibSan} error={submitted && !libSan ? "Requerido" : ""} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Cert. Manipulación de Alimentos</label>
                <p className="text-xs text-slate-500">Foto o PDF. Requiere fecha de vencimiento.</p>
                <label className="mb-1 block text-xs text-slate-600">Fecha de vencimiento <span className="text-rose-600">*</span></label>
                <input
                  type="date"
                  value={certManVto}
                  onChange={(e) => setCertManVto(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                    !submitted || certManVto ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                />
                {submitted && !certManVto && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
              <Dropzone label=" " required file={certMan} onFile={setCertMan} error={submitted && !certMan ? "Requerido" : ""} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">CUIL/CUIT (Constancia)</label>
                <p className="text-xs text-slate-500">PDF o imagen clara</p>
                <label className="mb-1 block text-xs text-slate-600">Número / ID <span className="text-rose-600">*</span></label>
                <input
                  value={cuilNumero}
                  onChange={(e) => setCuilNumero(e.target.value)}
                  placeholder="Número / ID"
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                    !submitted || cuilOk ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                />
                {submitted && !cuilOk && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
              <Dropzone label=" " required file={cuilConst} onFile={setCuilConst} error={submitted && !cuilConst ? "Requerido" : ""} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Constancia de domicilio</label>
                <p className="text-xs text-slate-500">JPG/PNG o PDF</p>
              </div>
              <Dropzone label=" " file={domicilio} onFile={setDomicilio} />
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
