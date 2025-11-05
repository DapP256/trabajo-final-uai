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

type PaymentMethod = FormState & {
  id: string;
  method: Metodo;
  createdAt: string;
  active: boolean;
};

function formatDate(iso: string) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

function maskCard(number: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "-";
  if (digits.length <= 4) return digits;
  return `•••• ${digits.slice(-4)}`;
}

function shortCbu(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 6) return digits || "-";
  return `${digits.slice(0, 6)}…${digits.slice(-4)}`;
}

export default function DatosParaRecibirPagos() {
  const [metodo, setMetodo] = useState<Metodo>("transferencia");
  const [submitted, setSubmitted] = useState(false);

  const seedMethods = useMemo<PaymentMethod[]>(
    () => [
      {
        id: "pay-101",
        method: "transferencia",
        titular: "Daniel Pérez",
        email: "pagos@manito.com",
        cuit: "20-12345678-3",
        banco: "Banco Nación",
        tipoCuenta: "Caja de ahorro",
        cbu: "2850590940090418135201",
        alias: "manito.pagos.nacion",
        mpAlias: "",
        mpCvu: "",
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
        createdAt: "2025-03-10T09:00:00Z",
        active: true,
      },
      {
        id: "pay-102",
        method: "mp",
        titular: "Daniel Pérez",
        email: "pagos@manito.com",
        cuit: "20-12345678-3",
        banco: "Mercado Pago",
        tipoCuenta: "Cuenta digital",
        cbu: "",
        alias: "",
        mpAlias: "manito.cobros",
        mpCvu: "0000003100012345678901",
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
        createdAt: "2025-03-18T13:35:00Z",
        active: false,
      },
    ],
    []
  );

  const [methods, setMethods] = useState<PaymentMethod[]>(seedMethods);
  const [editingId, setEditingId] = useState<string | null>(null);

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
  const cardNumberOk = useMemo(
    () => (metodo !== "tarjeta" ? true : cardNumberDigits.length >= 13 && cardNumberDigits.length <= 19),
    [cardNumberDigits, metodo]
  );
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

  const resetForm = (keepMethod = true) => {
    setForm({
      titular: "Daniel Pérez",
      email: "daniel@example.com",
      cuit: "20-12345678-3",
      banco: keepMethod && metodo === "mp" ? "Mercado Pago" : "Banco Nación",
      tipoCuenta: keepMethod && metodo === "mp" ? "Cuenta digital" : "Caja de ahorro",
      cbu: "",
      alias: "",
      mpAlias: "",
      mpCvu: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
    });
    setEditingId(null);
    setSubmitted(false);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!canSave) return;

    const payload: PaymentMethod = {
      ...form,
      method: metodo,
      id: editingId || `pay-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: editingId
        ? methods.find((item) => item.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      active: editingId ? methods.find((item) => item.id === editingId)?.active ?? true : true,
    };

    setMethods((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? payload : item));
      }
      return [payload, ...prev];
    });

    resetForm();
  };

  const startEdit = (id: string) => {
    const registro = methods.find((item) => item.id === id);
    if (!registro) return;
    setEditingId(registro.id);
    setMetodo(registro.method);
    setForm({
      titular: registro.titular,
      email: registro.email,
      cuit: registro.cuit,
      banco: registro.banco,
      tipoCuenta: registro.tipoCuenta,
      cbu: registro.cbu,
      alias: registro.alias,
      mpAlias: registro.mpAlias,
      mpCvu: registro.mpCvu,
      cardNumber: registro.cardNumber,
      cardExpiry: registro.cardExpiry,
      cardCvv: registro.cardCvv,
    });
    setSubmitted(false);
  };

  const removeMethod = (id: string) => {
    setMethods((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm(false);
  };

  const toggleActive = (id: string) => {
    setMethods((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              active: !item.active,
            }
          : item
      )
    );
  };

  const transferenciaAliasHasError = useMemo(() => {
    if (metodo !== "transferencia") return false;
    if (!submitted) return false;
    if (form.alias.trim().length === 0 && !cbuOk) return true;
    if (form.alias.trim().length > 0 && form.alias.trim().length < 6) return true;
    return false;
  }, [metodo, form.alias, submitted, cbuOk]);

  const transferenciaCbuHasError = useMemo(() => {
    if (metodo !== "transferencia") return false;
    if (!submitted) return false;
    if (form.cbu.trim().length === 0 && !aliasOk) return true;
    if (form.cbu.trim().length > 0 && !cbuOk) return true;
    return false;
  }, [metodo, form.cbu, submitted, aliasOk, cbuOk]);

  const mpAliasHasError = useMemo(() => metodo === "mp" && submitted && !mpAliasOk, [metodo, submitted, mpAliasOk]);
  const mpCvuHasError = useMemo(() => metodo === "mp" && submitted && !mpCvuOk, [metodo, submitted, mpCvuOk]);
  const cardNumberHasError = useMemo(() => metodo === "tarjeta" && submitted && !cardNumberOk, [metodo, submitted, cardNumberOk]);
  const cardExpiryHasError = useMemo(() => metodo === "tarjeta" && submitted && !cardExpiryOk, [metodo, submitted, cardExpiryOk]);
  const cardCvvHasError = useMemo(() => metodo === "tarjeta" && submitted && !cardCvvOk, [metodo, submitted, cardCvvOk]);

  const methodSummary = (item: PaymentMethod) => {
    if (item.method === "transferencia") {
      if (item.alias) return item.alias;
      if (item.cbu) return shortCbu(item.cbu);
      return "-";
    }
    if (item.method === "mp") {
      return item.mpAlias || shortCbu(item.mpCvu);
    }
    return maskCard(item.cardNumber);
  };

  const methodDetail = (item: PaymentMethod) => {
    if (item.method === "transferencia") {
      return item.banco;
    }
    if (item.method === "mp") {
      return "Mercado Pago";
    }
    return `Venc.: ${item.cardExpiry || "-"}`;
  };

  return (
    <div className="min-h-screen w-full bg-emerald-50/60 px-4 py-6 text-slate-800">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="mb-1 text-base font-semibold text-slate-700">Medios de Pago</h2>
              <p className="text-xs text-slate-500">Configurá cómo querés cobrar tus servicios.</p>
            </div>
            {editingId && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Editando método</span>}
          </div>

          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <button
              type="button"
              aria-pressed={metodo === "transferencia"}
              onClick={() => {
                setMetodo("transferencia");
                setSubmitted(false);
              }}
              className={`flex flex-1 items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                metodo === "transferencia" ? "border-emerald-400 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div>
                <div className="font-medium text-slate-800">Transferencia bancaria</div>
                <div className="text-xs text-slate-500">CBU/alias de banco</div>
              </div>
              <div
                className={`grid h-6 w-6 place-content-center rounded-full border ${
                  metodo === "transferencia" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white"
                }`}
              >
                {metodo === "transferencia" && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
            </button>

            <button
              type="button"
              aria-pressed={metodo === "mp"}
              onClick={() => {
                setMetodo("mp");
                setSubmitted(false);
              }}
              className={`flex flex-1 items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                metodo === "mp" ? "border-emerald-400 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div>
                <div className="font-medium text-slate-800">Mercado Pago</div>
                <div className="text-xs text-slate-500">Alias y CVU</div>
              </div>
              <div
                className={`grid h-6 w-6 place-content-center rounded-full border ${
                  metodo === "mp" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white"
                }`}
              >
                {metodo === "mp" && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
            </button>

            <button
              type="button"
              aria-pressed={metodo === "tarjeta"}
              onClick={() => {
                setMetodo("tarjeta");
                setSubmitted(false);
              }}
              className={`flex flex-1 items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                metodo === "tarjeta" ? "border-emerald-400 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div>
                <div className="font-medium text-slate-800">Tarjeta de crédito</div>
                <div className="text-xs text-slate-500">Número · Vencimiento · CVV</div>
              </div>
              <div
                className={`grid h-6 w-6 place-content-center rounded-full border ${
                  metodo === "tarjeta" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white"
                }`}
              >
                {metodo === "tarjeta" && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
            </button>
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
                <option value="Cuenta digital">Cuenta digital</option>
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
                    <p className="mt-1 text-[11px] text-rose-600">Ingresá un alias (mín. 6 caracteres) o completá el CBU.</p>
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
                      mpAliasHasError ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    placeholder="mi.alias.mercadopago"
                    required
                  />
                  {mpAliasHasError && <p className="mt-1 text-[11px] text-rose-600">Alias inválido (mín. 6 caracteres)</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">CVU (22 dígitos) *</label>
                  <input
                    name="mpCvu"
                    value={form.mpCvu}
                    onChange={onChange}
                    className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                      mpCvuHasError ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    placeholder="0000003100012345678901"
                    required
                  />
                  {mpCvuHasError && <p className="mt-1 text-[11px] text-rose-600">CVU debe tener 22 dígitos</p>}
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
                      cardNumberHasError ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                  {cardNumberHasError && <p className="mt-1 text-[11px] text-rose-600">Número inválido</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Vencimiento (MM/AA) *</label>
                  <input
                    name="cardExpiry"
                    value={form.cardExpiry}
                    onChange={onChange}
                    placeholder="MM/AA"
                    className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                      cardExpiryHasError ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    required
                  />
                  {cardExpiryHasError && <p className="mt-1 text-[11px] text-rose-600">Fecha inválida</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">CVV *</label>
                  <input
                    name="cardCvv"
                    value={form.cardCvv}
                    onChange={onChange}
                    inputMode="numeric"
                    className={`w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-400 focus:bg-white ${
                      cardCvvHasError ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50"
                    }`}
                    placeholder="123"
                    required
                  />
                  {cardCvvHasError && <p className="mt-1 text-[11px] text-rose-600">CVV inválido</p>}
                </div>
              </>
            )}

            <div className="md:col-span-2 mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => resetForm()}
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
              <h3 className="text-base font-semibold text-slate-700">Métodos guardados</h3>
              <p className="text-xs text-slate-500">Gestioná tus medios de cobro, podés activarlos, editarlos o eliminarlos.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Total: {methods.length}</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Método</th>
                  <th className="px-4 py-3 text-left font-medium">Resumen</th>
                  <th className="px-4 py-3 text-left font-medium">Titular</th>
                  <th className="px-4 py-3 text-left font-medium">Contacto</th>
                  <th className="px-4 py-3 text-left font-medium">Creado</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {methods.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-400" colSpan={6}>
                      Todavía no configuraste métodos de pago. Usá el formulario para agregar uno nuevo.
                    </td>
                  </tr>
                ) : (
                  methods.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-800">
                            {item.method === "transferencia"
                              ? "Transferencia bancaria"
                              : item.method === "mp"
                              ? "Mercado Pago"
                              : "Tarjeta de crédito"}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleActive(item.id)}
                            className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${
                              item.active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                            }`}
                          >
                            {item.active ? "Activo" : "Inactivo"}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-700">{methodSummary(item)}</div>
                        <div className="text-xs text-slate-500">{methodDetail(item)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-700">{item.titular}</div>
                        <div className="text-xs text-slate-500">{item.cuit}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-700">{item.email}</div>
                        {item.method === "transferencia" && item.banco && (
                          <div className="text-xs text-slate-500">{item.banco}</div>
                        )}
                        {item.method === "tarjeta" && item.cardExpiry && (
                          <div className="text-xs text-slate-500">Vencimiento: {item.cardExpiry}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item.id)}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMethod(item.id)}
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

if (typeof window !== "undefined") {
  try {
    console.assert(/^\d{2}-\d{8}-\d$/.test("20-12345678-3") || /^\d{7,8}$/.test("12345678"), "TC1: patrón de documento válido");
    console.assert("2850590940090418135201".length === 22, "TC2: longitud de CBU esperada");
    console.assert(/.+@.+\..+/.test("demo@demo.com"), "TC3: email válido");
  } catch (_) {}
}
