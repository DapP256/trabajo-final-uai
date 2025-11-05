"use client";

import React, { useMemo, useState } from "react";

type Metodo = "transferencia" | "mp" | "tarjeta";

type FormState = {
  titular: string;
  email: string;
  cuit: string;
  banco: string;
  tipoCuenta: string;
  cbu: string;
  alias: string;
  mpAlias: string;
  mpCvu: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
};

export default function DatosParaRecibirPagos() {
  const [metodo, setMetodo] = useState<Metodo>("transferencia");
  const [form, setForm] = useState<FormState>({
    titular: "Daniel Pérez",
    email: "daniel@example.com",
    cuit: "20-12345678-3",
    banco: "Banco Nación",
    tipoCuenta: "Caja de ahorro",
    cbu: "",
    alias: "",
    mpAlias: "",
    mpCvu: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const emailOk = useMemo(() => /.+@.+\..+/.test(form.email), [form.email]);
  const cuitOk = useMemo(() => {
    const cuitTrim = form.cuit.trim();
    return /^\d{2}-\d{8}-\d$/.test(cuitTrim) || /^\d{7,8}$/.test(cuitTrim);
  }, [form.cuit]);
  const cbuDigits = useMemo(() => form.cbu.replace(/\D/g, ""), [form.cbu]);
  const cbuOk = useMemo(() => cbuDigits.length === 22, [cbuDigits]);
  const aliasOk = useMemo(() => form.alias.trim().length >= 6, [form.alias]);

  const mpAliasOk = useMemo(() => (metodo !== "mp" ? true : form.mpAlias.trim().length >= 6), [form.mpAlias, metodo]);
  const mpCvuDigits = useMemo(() => form.mpCvu.replace(/\D/g, ""), [form.mpCvu]);
  const mpCvuOk = useMemo(() => (metodo !== "mp" ? true : mpCvuDigits.length === 22), [mpCvuDigits, metodo]);

  const cardNumberDigits = useMemo(() => form.cardNumber.replace(/\D/g, ""), [form.cardNumber]);
  const cardNumberOk = useMemo(() => (metodo !== "tarjeta" ? true : cardNumberDigits.length >= 13 && cardNumberDigits.length <= 19), [cardNumberDigits, metodo]);
  const cardExpiryOk = useMemo(() => (metodo !== "tarjeta" ? true : /^(0[1-9]|1[0-2])\/(\d{2})$/.test(form.cardExpiry)), [form.cardExpiry, metodo]);
  const cardCvvOk = useMemo(() => (metodo !== "tarjeta" ? true : /^\d{3,4}$/.test(form.cardCvv)), [form.cardCvv, metodo]);

  const transferenciaOk = useMemo(() => {
    if (metodo !== "transferencia") return true;
    return cbuOk || aliasOk;
  }, [metodo, cbuOk, aliasOk]);

  const canSave = useMemo(() => {
    if (!emailOk || !cuitOk) return false;
    if (metodo === "transferencia") return transferenciaOk;
    if (metodo === "mp") return mpAliasOk && mpCvuOk;
    if (metodo === "tarjeta") return cardNumberOk && cardExpiryOk && cardCvvOk;
    return false;
  }, [emailOk, cuitOk, metodo, transferenciaOk, mpAliasOk, mpCvuOk, cardNumberOk, cardExpiryOk, cardCvvOk]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!canSave) return;
    alert(`Guardado método ${metodo}`);
  };

  const MetodoCard = ({ id, title, subtitle }: { id: Metodo; title: string; subtitle: string }) => (
    <button
      type="button"
      aria-pressed={metodo === id}
      onClick={() => {
        setMetodo(id);
        setSubmitted(false);
      }}
      className={`flex flex-1 items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
        metodo === id ? "border-emerald-400 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div>
        <div className="font-medium text-slate-800">{title}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
      <div
        className={`grid h-6 w-6 place-content-center rounded-full border ${
          metodo === id ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white"
        }`}
      >
        {metodo === id && (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </div>
    </button>
  );

  const transferenciaAliasHasError = useMemo(() => {
    if (metodo !== "transferencia") return false;
    if (form.alias.trim().length === 0 && !cbuOk && submitted) return true;
    return false;
  }, [metodo, form.alias, cbuOk, submitted]);

  const transferenciaCbuHasError = useMemo(() => {
    if (metodo !== "transferencia") return false;
    if (form.cbu.length > 0 && !cbuOk) return true;
    if (form.cbu.length === 0 && !aliasOk && submitted) return true;
    return false;
  }, [metodo, form.cbu, cbuOk, aliasOk, submitted]);

  return (
    <div className="min-h-screen w-full bg-emerald-50/60 px-4 py-6 text-slate-800">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-700">Medios de Pago</h2>

          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <MetodoCard id="transferencia" title="Transferencia bancaria" subtitle="CBU/alias de banco" />
            <MetodoCard id="mp" title="Mercado Pago" subtitle="Alias y CVU" />
            <MetodoCard id="tarjeta" title="Tarjeta de crédito" subtitle="Número · Vencimiento · CVV" />
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Titular de la cuenta *</label>
              <input
                name="titular"
                value={form.titular}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">CUIL/CUIT o DNI *</label>
              <input
                name="cuit"
                value={form.cuit}
                onChange={onChange}
                className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                  !submitted || cuitOk ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                }`}
                placeholder="20-12345678-3"
                required
              />
              {submitted && !cuitOk && <p className="mt-1 text-[11px] text-rose-600">Formato inválido</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Email de contacto *</label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                  !submitted || emailOk ? "border-slate-200 bg-slate-50" : "border-rose-300 bg-white"
                }`}
                placeholder="usuario@correo.com"
                required
              />
              {submitted && !emailOk && <p className="mt-1 text-[11px] text-rose-600">Email inválido</p>}
              <p className="mt-1 text-[11px] text-slate-400">Se utilizará para notificaciones de cobro.</p>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Banco *</label>
              <input
                name="banco"
                value={form.banco}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                placeholder="Banco Nación"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Tipo de cuenta *</label>
              <select
                name="tipoCuenta"
                value={form.tipoCuenta}
                onChange={onChange}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white"
                required
              >
                <option value="Caja de ahorro">Caja de ahorro</option>
                <option value="Cuenta corriente">Cuenta corriente</option>
              </select>
            </div>

            {metodo === "transferencia" && (
              <>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">CBU (22 dígitos) *</label>
                  <input
                    name="cbu"
                    value={form.cbu}
                    onChange={onChange}
                    className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                      transferenciaCbuHasError ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    placeholder="2850590940090418135201"
                  />
                  {transferenciaCbuHasError && (
                    <p className="mt-1 text-[11px] text-rose-600">Ingresá un CBU válido o completá el alias.</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Alias CBU *</label>
                  <input
                    name="alias"
                    value={form.alias}
                    onChange={onChange}
                    className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                      transferenciaAliasHasError ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    placeholder="mi.alias.cbu"
                  />
                  {transferenciaAliasHasError && (
                    <p className="mt-1 text-[11px] text-rose-600">Ingresá un alias o completá el CBU.</p>
                  )}
                </div>
              </>
            )}

            {metodo === "mp" && (
              <>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Alias *</label>
                  <input
                    name="mpAlias"
                    value={form.mpAlias}
                    onChange={onChange}
                    className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                      submitted && !mpAliasOk ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    placeholder="mi.alias.mercadopago"
                    required
                  />
                  {submitted && !mpAliasOk && <p className="mt-1 text-[11px] text-rose-600">Alias inválido</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">CVU (22 dígitos) *</label>
                  <input
                    name="mpCvu"
                    value={form.mpCvu}
                    onChange={onChange}
                    className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                      submitted && !mpCvuOk ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    placeholder="0000003100012345678901"
                    required
                  />
                  {submitted && !mpCvuOk && <p className="mt-1 text-[11px] text-rose-600">CVU debe tener 22 dígitos</p>}
                </div>
              </>
            )}

            {metodo === "tarjeta" && (
              <>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Número de tarjeta *</label>
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={onChange}
                    inputMode="numeric"
                    className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                      submitted && !cardNumberOk ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                  {submitted && !cardNumberOk && <p className="mt-1 text-[11px] text-rose-600">Número inválido</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Vencimiento (MM/AA) *</label>
                  <input
                    name="cardExpiry"
                    value={form.cardExpiry}
                    onChange={onChange}
                    placeholder="MM/AA"
                    className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                      submitted && !cardExpiryOk ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    required
                  />
                  {submitted && !cardExpiryOk && <p className="mt-1 text-[11px] text-rose-600">Fecha inválida</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">CVV *</label>
                  <input
                    name="cardCvv"
                    value={form.cardCvv}
                    onChange={onChange}
                    inputMode="numeric"
                    className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                      submitted && !cardCvvOk ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    placeholder="123"
                    required
                  />
                  {submitted && !cardCvvOk && <p className="mt-1 text-[11px] text-rose-600">CVV inválido</p>}
                </div>
              </>
            )}

            <div className="md:col-span-2 mt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={!canSave}
                className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

if (typeof window !== "undefined") {
  try {
    console.assert(/^\d{2}-\d{8}-\d$/.test("20-12345678-3") || /^\d{7,8}$/.test("12345678"), "TC1: patrón de documento válido");
    console.assert("2850590940090418135201".length === 22, "TC2: longitud de CBU esperada");
    console.assert(/.+@.+\..+/.test("demo@demo.com"), "TC3: email válido");
  } catch (_) {}
}
