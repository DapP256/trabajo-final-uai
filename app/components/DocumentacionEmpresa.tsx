"use client";

import React, { useMemo, useRef, useState } from "react";

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
  error?: string | false;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onPick = () => inputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    const f = files && files[0] ? files[0] : null;
    if (!f) return onFile(null);
    if (!ALLOWED.includes(f.type)) {
      onFile(null);
      alert("Formato no permitido. Usá JPG, PNG o PDF.");
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
        {!!error && <p className="mt-1 text-[11px] text-rose-600">Requerido</p>}
      </div>
    </div>
  );
}

export default function DocumentacionComercialEmpresa() {
  const [cuitConst, setCuitConst] = useState<File | null>(null);
  const [cuitNumero, setCuitNumero] = useState("");

  const [iibbConst, setIibbConst] = useState<File | null>(null);
  const [iibbNumero, setIibbNumero] = useState("");

  const [habMun, setHabMun] = useState<File | null>(null);
  const [habVto, setHabVto] = useState("");

  const [estatuto, setEstatuto] = useState<File | null>(null);

  const [dniFrente, setDniFrente] = useState<File | null>(null);
  const [dniDorso, setDniDorso] = useState<File | null>(null);
  const [dniNumero, setDniNumero] = useState("");

  const [domicilio, setDomicilio] = useState<File | null>(null);

  const [cbuConst, setCbuConst] = useState<File | null>(null);
  const [cbuNumero, setCbuNumero] = useState("");

  const [seguroArt, setSeguroArt] = useState<File | null>(null);
  const [seguroVto, setSeguroVto] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const cuitOk = useMemo(() => /^\d{2}-?\d{8}-?\d$/.test(cuitNumero), [cuitNumero]);
  const iibbOk = useMemo(() => iibbNumero.trim().length >= 6, [iibbNumero]);
  const dniOk = useMemo(() => /^\d{7,8}$/.test(dniNumero), [dniNumero]);
  const cbuAliasOk = useMemo(() => cbuNumero.trim().length >= 6, [cbuNumero]);

  const canSave = useMemo(() => {
    const reqFiles = !!cuitConst && !!iibbConst && !!habMun && !!estatuto && !!dniFrente && !!dniDorso && !!domicilio && !!cbuConst;
    const reqText = cuitOk && iibbOk && dniOk && cbuAliasOk;
    const reqDates = !!habVto;
    return reqFiles && reqText && reqDates;
  }, [cuitConst, iibbConst, habMun, estatuto, dniFrente, dniDorso, domicilio, cbuConst, cuitOk, iibbOk, dniOk, cbuAliasOk, habVto]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!canSave) return;
    alert("Documentación comercial enviada (demo)");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 px-4 py-6 text-slate-800">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-700">Subí o actualizá la documentación</h2>
          <p className="-mt-2 mb-4 text-xs text-slate-500">Formatos permitidos: JPG, PNG o PDF. Tamaño máx. 10 MB por archivo.</p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Constancia de CUIT (AFIP) <span className="text-rose-600">*</span></label>
                <p className="text-xs text-slate-500">PDF o imagen clara.</p>
                <label className="mb-1 block text-xs text-slate-600">Número / ID <span className="text-rose-600">*</span></label>
                <input
                  value={cuitNumero}
                  onChange={(e) => setCuitNumero(e.target.value)}
                  placeholder="20-12345678-3"
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                    !submitted || cuitOk ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                />
                {submitted && !cuitOk && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
              <Dropzone label=" " required file={cuitConst} onFile={setCuitConst} error={submitted && !cuitConst && "Requerido"} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Inscripción Ingresos Brutos (AGIP/ARBA) <span className="text-rose-600">*</span></label>
                <p className="text-xs text-slate-500">PDF o imagen clara.</p>
                <label className="mb-1 block text-xs text-slate-600">Número / ID <span className="text-rose-600">*</span></label>
                <input
                  value={iibbNumero}
                  onChange={(e) => setIibbNumero(e.target.value)}
                  placeholder="Número / ID"
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                    !submitted || iibbOk ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                />
                {submitted && !iibbOk && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
              <Dropzone label=" " required file={iibbConst} onFile={setIibbConst} error={submitted && !iibbConst && "Requerido"} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Habilitación municipal <span className="text-rose-600">*</span></label>
                <p className="text-xs text-slate-500">Foto o PDF. Requiere fecha de vencimiento.</p>
                <label className="mb-1 block text-xs text-slate-600">Fecha de vencimiento <span className="text-rose-600">*</span></label>
                <input
                  type="date"
                  value={habVto}
                  onChange={(e) => setHabVto(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                    !submitted || habVto ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                />
                {submitted && !habVto && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
              <Dropzone label=" " required file={habMun} onFile={setHabMun} error={submitted && !habMun && "Requerido"} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Contrato/Estatuto social <span className="text-rose-600">*</span></label>
                <p className="text-xs text-slate-500">PDF (si la sociedad es monotributo no aplica).</p>
              </div>
              <Dropzone label=" " required file={estatuto} onFile={setEstatuto} error={submitted && !estatuto && "Requerido"} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">DNI del representante (frente) <span className="text-rose-600">*</span></label>
                <p className="text-xs text-slate-500">Foto legible.</p>
                <label className="mb-1 block text-xs text-slate-600">Número / ID <span className="text-rose-600">*</span></label>
                <input
                  value={dniNumero}
                  onChange={(e) => setDniNumero(e.target.value)}
                  placeholder="Número / ID"
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                    !submitted || dniOk ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                />
                {submitted && !dniOk && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
              <Dropzone label=" " required file={dniFrente} onFile={setDniFrente} error={submitted && !dniFrente && "Requerido"} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">DNI del representante (dorso) <span className="text-rose-600">*</span></label>
                <p className="text-xs text-slate-500">Foto legible.</p>
              </div>
              <Dropzone label=" " required file={dniDorso} onFile={setDniDorso} error={submitted && !dniDorso && "Requerido"} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Comprobante de domicilio comercial <span className="text-rose-600">*</span></label>
                <p className="text-xs text-slate-500">Servicio o contrato de locación.</p>
              </div>
              <Dropzone label=" " required file={domicilio} onFile={setDomicilio} error={submitted && !domicilio && "Requerido"} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Constancia de CBU/Alias <span className="text-rose-600">*</span></label>
                <p className="text-xs text-slate-500">PDF del banco o captura de HomeBanking.</p>
                <label className="mb-1 block text-xs text-slate-600">Número / ID <span className="text-rose-600">*</span></label>
                <input
                  value={cbuNumero}
                  onChange={(e) => setCbuNumero(e.target.value)}
                  placeholder="Alias o CBU"
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                    !submitted || cbuAliasOk ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                  }`}
                />
                {submitted && !cbuAliasOk && <p className="text-[11px] text-rose-600">Requerido</p>}
              </div>
              <Dropzone label=" " required file={cbuConst} onFile={setCbuConst} error={submitted && !cbuConst && "Requerido"} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Seguro ART (si corresponde)</label>
                <p className="text-xs text-slate-500">Póliza vigente.</p>
                <label className="mb-1 block text-xs text-slate-600">Fecha de vencimiento</label>
                <input
                  type="date"
                  value={seguroVto}
                  onChange={(e) => setSeguroVto(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                />
              </div>
              <Dropzone label=" " file={seguroArt} onFile={setSeguroArt} />
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
