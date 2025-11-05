"use client";

import { useState } from "react";

export default function RecuperarContrasenaPage() {
  const [tab, setTab] = useState<"email" | "otp">(typeof window !== "undefined" && window.location.hash === "#otp" ? "otp" : "email");
  const [loading, setLoading] = useState(false);

  const handleSendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    if (!email) return alert("Ingresá tu correo electrónico");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Te enviamos instrucciones a: ${email}`);
      setTab("otp");
      if (typeof window !== "undefined") window.location.hash = "#otp";
    }, 600);
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const code = (form.elements.namedItem("code") as HTMLInputElement)?.value;
    const pass1 = (form.elements.namedItem("pass1") as HTMLInputElement)?.value;
    const pass2 = (form.elements.namedItem("pass2") as HTMLInputElement)?.value;
    if (!code || code.length < 4) return alert("Ingresá el código OTP válido");
    if (!pass1 || pass1.length < 8) return alert("La contraseña debe tener al menos 8 caracteres");
    if (pass1 !== pass2) return alert("Las contraseñas no coinciden");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Contraseña actualizada. Ya podés iniciar sesión.");
      // Redirigir a login si existiera router
      if (typeof window !== "undefined") window.location.href = "/login";
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-emerald-50 via-white to-white text-slate-700">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Columna izquierda: marca + info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-content-center rounded-xl bg-emerald-600 font-semibold text-white">M</div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-800 md:text-3xl">Manito</h1>
                <p className="text-sm text-slate-600 md:text-base">Recuperá el acceso a tu cuenta en pocos pasos.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white/70 p-5 shadow-sm">
              <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-600">
                <li>
                  Te enviamos un <span className="font-medium text-slate-800">enlace</span> y un <span className="font-medium text-slate-800">código</span> (OTP) al email.
                </li>
                <li>Podés pegar el código en la pestaña <span className="font-medium">OTP</span> y definir tu nueva contraseña.</li>
                <li>Por seguridad, el código expira en minutos.</li>
              </ul>
            </div>
          </div>

          {/* Columna derecha: tarjeta con pestañas */}
          <div>
            <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-0 shadow-sm">
              <div className="p-6">
                {tab === "email" ? (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Recuperar contraseña</h2>
                    <form className="mt-4 space-y-4" onSubmit={handleSendEmail}>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-700">
                          Correo electrónico
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="usuario@correo.com"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:ring-4"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:opacity-60"
                      >
                        {loading ? "Enviando…" : "Enviar instrucciones"}
                      </button>

                      <p className="text-[13px] text-slate-500">Te llegará un enlace y un código (OTP). Si no aparece, revisá spam.</p>

                      <div className="flex items-center justify-between text-sm">
                        <button type="button" onClick={() => { setTab("otp"); if (typeof window !== "undefined") window.location.hash = "#otp"; }} className="text-emerald-700 hover:underline">
                          ¿Ya lo recibiste? Ingresar código
                        </button>
                        <a href="/login" className="text-emerald-700 hover:underline">¿Recordaste tu clave? Volver a iniciar sesión</a>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div id="ingresar-codigo">
                    <h2 className="text-lg font-semibold text-slate-800">Ingresar código y crear nueva clave</h2>
                    <form className="mt-4 space-y-4" onSubmit={handleOtpSubmit}>
                      <div className="space-y-2">
                        <label htmlFor="code" className="text-sm font-medium text-slate-700">Código OTP</label>
                        <input
                          id="code"
                          name="code"
                          type="text"
                          inputMode="numeric"
                          placeholder="123456"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm tracking-widest outline-none ring-emerald-200 focus:ring-4"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="pass1" className="text-sm font-medium text-slate-700">Nueva contraseña</label>
                        <input
                          id="pass1"
                          name="pass1"
                          type="password"
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:ring-4"
                          required
                          minLength={8}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="pass2" className="text-sm font-medium text-slate-700">Repetir contraseña</label>
                        <input
                          id="pass2"
                          name="pass2"
                          type="password"
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-emerald-200 focus:ring-4"
                          required
                          minLength={8}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:opacity-60"
                      >
                        {loading ? "Guardando…" : "Actualizar contraseña"}
                      </button>

                      <p className="text-[13px] text-slate-500">El código expira en minutos. Si caduca, volvé a solicitar uno.</p>

                      <div className="flex items-center justify-between text-sm">
                        <button type="button" onClick={() => setTab("email")} className="text-emerald-700 hover:underline">Reenviar instrucciones</button>
                        <a href="/login" className="text-emerald-700 hover:underline">Volver a iniciar sesión</a>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">© 2025 Manito · CABA/AMBA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
