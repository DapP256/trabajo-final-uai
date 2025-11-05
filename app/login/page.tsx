"use client";

import React, { useMemo, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const emailOk = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const passOk = useMemo(() => pass.length >= 6, [pass]);
  const canSubmit = emailOk && passOk;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;

    const TEST_EMAIL = "a@a.com";
    const TEST_PASS = "123456";

    if (email === TEST_EMAIL && pass === TEST_PASS) {
      if (remember && typeof window !== "undefined") {
        try { localStorage.setItem("manito_user", JSON.stringify({ email })); } catch (_) {}
      }
      alert(`Bienvenido — sesión iniciada como ${email}`);
      if (typeof window !== "undefined") window.location.href = "/";
      return;
    }

    alert("Credenciales inválidas. Probá con correo: a@a.com y contraseña: 123456");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-emerald-50 via-white to-white text-slate-800">
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10 lg:py-14">
        <aside className="hidden w-1/2 flex-col justify-center lg:flex">
          <div className="mb-6 inline-flex items-center gap-3">
            <div className="brand-mark grid h-10 w-10 place-content-center rounded-lg bg-emerald-600 text-white font-bold">M</div>
            <div>
              <h1 className="brand-title text-3xl font-semibold">Manito</h1>
              <p className="brand-subtitle text-slate-500">Conectamos locales gastronómicos con talento validado en minutos.</p>
            </div>
          </div>

          <div className="features-card rounded-xl border border-emerald-100 bg-white/70 p-5 shadow-sm backdrop-blur">
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="feature-item flex items-start gap-3">
                <span className="feature-dot mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>Matching priorizado por skills y cercanía</span>
              </li>
              <li className="feature-item flex items-start gap-3">
                <span className="feature-dot mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>Publicaciones activas según tu plan</span>
              </li>
              <li className="feature-item flex items-start gap-3">
                <span className="feature-dot mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>Pagos en garantía y liberación según SLA</span>
              </li>
            </ul>
          </div>
        </aside>

        <main className="mx-auto w-full lg:w-[460px]">
          <div className="login-card rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="label text-sm text-slate-600">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="input-field w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                />
                {submitted && !emailOk && (
                  <p className="field-error mt-1 text-xs text-rose-600">Ingresá un correo válido.</p>
                )}
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <label className="label text-slate-600">Contraseña</label>
                  <a href="/recupero" className="forgot-link text-emerald-700 hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="••••••••"
                    className="input-field w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 outline-none focus:border-emerald-400 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="toggle-pass absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                    aria-label="Mostrar/ocultar contraseña"
                  >
                    {showPass ? "Ocultar" : "Ver"}
                  </button>
                </div>
                {submitted && !passOk && (
                  <p className="field-error mt-1 text-xs text-rose-600">La contraseña debe tener al menos 6 caracteres.</p>
                )}
              </div>

              <label className="remember-row flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="remember-checkbox h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Recordarme en este dispositivo
              </label>

              <button
                type="submit"
                disabled={!canSubmit}
                className="submit-btn w-full rounded-full bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Iniciar sesión
              </button>

              <div className="my-2 text-center text-sm text-slate-500">
                ¿No tenés cuenta? <a className="signup-link text-emerald-700 hover:underline" href="/registro">Crear cuenta</a>
              </div>

              <p className="mt-1 text-center text-xs text-slate-400">
                Al continuar, aceptás los <a className="text-emerald-700 underline" href="#">Términos y Condiciones</a> y la <a className="text-emerald-700 underline" href="#">Política de Privacidad</a>.
              </p>
            </form>
          </div>

          <p className="mt-4 text-center text-[10px] text-slate-400">© {new Date().getFullYear()} Manito · CABA/AMBA</p>
        </main>
      </div>
    </div>
  );
}

// ==== Test cases rápidos (runtime, no rompen la UI) ====
if (typeof window !== "undefined") {
  try {
    console.assert(/.+@.+\..+/.test("demo@demo.com"), "TC1: regex email básica OK");
    console.assert(!/.+@.+\..+/.test("demo"), "TC2: regex email rechaza formato inválido");
  } catch (_) {
    // no-op
  }
}
