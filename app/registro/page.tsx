"use client";

import React, { useMemo, useState } from "react";

/**
 * Pantalla: Registro de usuario (Manito)
 * Tecnologías: React + Tailwind (un solo archivo, sin dependencias externas)
 *
 * ✔️ Toggle de rol: Empresa / Trabajador
 * ✔️ Form con validaciones básicas (requeridos, contraseñas iguales, términos)
 * ✔️ Medidor simple de fuerza de contraseña
 * ✔️ UI inspirada en la captura: layout dos columnas, tarjeta a la derecha
 * ✔️ Botón deshabilitado hasta cumplir validaciones
 */

// ==== Utilidades testeables ====
export function calcPassStrength(p: string): { label: string; level: 0 | 1 | 2 | 3 } {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score >= 4) return { label: "alta", level: 3 };
  if (score === 3) return { label: "media", level: 2 };
  if (score >= 1) return { label: "baja", level: 1 };
  return { label: "muy baja", level: 0 };
}

export function isEmailValid(email: string): boolean {
  return /.+@.+\..+/.test(email);
}

export default function RegistroManito() {
  const [role, setRole] = useState<"empresa" | "trabajador">("trabajador");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    cp: "",
    ciudad: "",
    pass: "",
    pass2: "",
    tyc: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const passStrength = useMemo(() => calcPassStrength(form.pass), [form.pass]);
  const passwordsMatch = form.pass && form.pass === form.pass2;

  const isValid =
    form.nombre.trim().length > 2 &&
    isEmailValid(form.email) &&
    form.pass.length >= 8 &&
    passwordsMatch &&
    form.tyc;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;

    // Construimos el payload con claves distintas según el rol
    const payload: Record<string, unknown> = {
      role,
      email: form.email,
      telefono: form.telefono || null,
      cp: form.cp || null,
      ciudad: form.ciudad || null,
      password: form.pass,
      tyc: form.tyc,
      ...(role === "empresa"
        ? { razon_social: form.nombre }
        : { nombre_apellido: form.nombre }),
    };

    // Aquí iría el submit real (API / fetch)
    alert(
      `Payload de registro:
${JSON.stringify(payload, null, 2)}`
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-emerald-50 via-white to-white text-slate-800">
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10 lg:py-14">
        {/* Columna izquierda: branding + bullets */}
        <div className="hidden w-1/2 flex-col justify-center lg:flex">
          <div className="mb-6 inline-flex items-center gap-3">
            <div className="grid h-10 w-10 place-content-center rounded-lg bg-emerald-600 text-white font-bold">M</div>
            <div>
              <h1 className="text-3xl font-semibold">Manito</h1>
              <p className="text-slate-500">Registrate para empezar a publicar avisos o tomar turnos.</p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white/70 p-5 shadow-sm backdrop-blur">
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  <strong>Empresas:</strong> gestionen publicaciones y pagos.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  <strong>Trabajadores:</strong> encontrá turnos cerca y cobralos rápido.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  <strong>Seguridad:</strong> pagos en garantía y calificaciones mutuas.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Columna derecha: tarjeta con formulario */}
        <div className="mx-auto w-full lg:w-[460px]">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl">
            {/* Toggle de rol */}
            <div className="mb-5 flex w-full rounded-full border border-emerald-200 bg-emerald-50 p-1 text-sm">
              <button
                type="button"
                onClick={() => setRole("empresa")}
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  role === "empresa" ? "bg-white shadow-sm" : "hover:bg-white/60"
                }`}
              >
                Empresa
              </button>
              <button
                type="button"
                onClick={() => setRole("trabajador")}
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  role === "trabajador" ? "bg-white shadow-sm" : "hover:bg-white/60"
                }`}
              >
                Trabajador
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Nombre/razón social (según rol) */}
              <div>
                <label className="mb-1 block text-sm text-slate-600">{role === "empresa" ? "Razón social" : "Nombre y apellido"}</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={onChange}
                  placeholder={role === "empresa" ? "Ej.: Panificados SRL" : "Juana Pérez"}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                />
                {submitted && form.nombre.trim().length <= 2 && (
                  <p className="mt-1 text-xs text-rose-600">{role === "empresa" ? "Ingresá la razón social." : "Ingresá tu nombre completo."}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm text-slate-600">Correo electrónico</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="usuario@correo.com"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                />
                {submitted && !isEmailValid(form.email) && (
                  <p className="mt-1 text-xs text-rose-600">Ingresá un correo válido.</p>
                )}
              </div>

              {/* Teléfono + CP */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm text-slate-600">Teléfono (opcional)</label>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={onChange}
                    placeholder="11 5555 5555"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-600">CP</label>
                  <input
                    name="cp"
                    value={form.cp}
                    onChange={onChange}
                    placeholder="C1000"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* Ciudad */}
              <div>
                <label className="mb-1 block text-sm text-slate-600">Ciudad</label>
                <input
                  name="ciudad"
                  value={form.ciudad}
                  onChange={onChange}
                  placeholder="CABA / AMBA"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                />
              </div>

              {/* Passwords */}
              <div>
                <label className="mb-1 block text-sm text-slate-600">Contraseña</label>
                <div className="relative">
                  <input
                    name="pass"
                    type={showPass ? "text" : "password"}
                    value={form.pass}
                    onChange={onChange}
                    placeholder={"M\u00EDnimo 8 caracteres"}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 outline-none focus:border-emerald-400 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                    aria-label="Mostrar/ocultar contraseña"
                  >
                    {showPass ? "Ocultar" : "Ver"}
                  </button>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Fuerza de la contraseña: {passStrength.label}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={
                        "h-full transition-all " +
                        (passStrength.level === 0
                          ? "w-1/12 bg-rose-400"
                          : passStrength.level === 1
                          ? "w-1/3 bg-orange-400"
                          : passStrength.level === 2
                          ? "w-2/3 bg-amber-400"
                          : "w-full bg-emerald-500")
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-600">Confirmar contraseña</label>
                <div className="relative">
                  <input
                    name="pass2"
                    type={showPass2 ? "text" : "password"}
                    value={form.pass2}
                    onChange={onChange}
                    placeholder="Repetí la contraseña"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 outline-none focus:border-emerald-400 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass2((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                    aria-label="Mostrar/ocultar confirmación"
                  >
                    {showPass2 ? "Ocultar" : "Ver"}
                  </button>
                </div>
                {submitted && !passwordsMatch && (
                  <p className="mt-1 text-xs text-rose-600">Las contraseñas no coinciden.</p>
                )}
              </div>

              {/* Términos */}
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  name="tyc"
                  checked={form.tyc}
                  onChange={onChange}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  Acepto los <a className="text-emerald-700 underline" href="#">Términos y Condiciones</a>.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isValid}
                className="w-full rounded-full bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Crear cuenta
              </button>

              <p className="text-center text-xs text-slate-500">
                ¿Ya tenés cuenta? <a className="text-emerald-700 hover:underline" href="/login">Iniciar sesión</a>
              </p>
            </form>
          </div>

          {/* Footer mini */}
          <p className="mt-4 text-center text-[10px] text-slate-400">© 2025 Manito · CABA/AMBA</p>
        </div>
      </div>
    </div>
  );
}

// ==== Test cases rápidos (se ejecutan en runtime del navegador, no rompen la UI) ====
if (typeof window !== "undefined") {
  try {
    console.assert(calcPassStrength("").level === 0, "TC1: vacío -> muy baja");
    console.assert(calcPassStrength("abcdefg").level === 1, "TC2: 7 letras -> baja (por longitud no llega a 8, pero tiene letras)");
    console.assert(calcPassStrength("Abcdef12").level >= 2, "TC3: mayúsculas+minúsculas+números >= media");
    console.assert(isEmailValid("test@example.com"), "TC4: email válido");
    console.assert(!isEmailValid("mal-email"), "TC5: email inválido");
  } catch (e) {
    // no-op: sólo para evitar que un assert rompa en entornos estrictos
  }
}
