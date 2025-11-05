"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  createdAt: string;
};

type Admin = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  creado: string;
};

type Negocio = {
  id: number;
  nombre: string;
  plan: string;
  publicaciones: number;
  deudaARS: number;
  ownerEmail: string;
  alta: string;
};

type IncidenciaEstado =
  | "abierta"
  | "en_revisión"
  | "resuelta"
  | "reembolsar_negocio"
  | "pagar_trabajador";

type Incidencia = {
  id: string;
  servicio: string;
  negocio: string;
  trabajador: string;
  motivo: string;
  estado: IncidenciaEstado;
  creada: string;
};

type PagoEstado = "pendiente" | "aprobado" | "rechazado";

type PagoTipo = "payout_trabajador" | "cobro_negocio" | string;

type Pago = {
  id: string;
  tipo: PagoTipo;
  beneficiario: string;
  monto: number;
  metodo: string;
  estado: PagoEstado;
  creado: string;
};

type ToastState = { title: string; description?: string } | null;

type ModalState =
  | { type: "usuario"; payload: Usuario }
  | { type: "incidencia"; payload: Incidencia }
  | { type: "pago"; payload: Pago }
  | { type: "admin_form"; payload: { mode: "new" } | { mode: "edit"; admin: Admin } }
  | { type: "admin_delete"; payload: Admin }
  | null;

export default function AdminBackoffice() {
  const router = useRouter();
  const hoyISO = new Date().toISOString().slice(0, 10);

  const usuariosInit = useMemo<Usuario[]>(
    () => [
      { id: 1, nombre: "Carla López", email: "carla@correo.com", rol: "empleado", estado: "activo", createdAt: "2025-08-12" },
      { id: 2, nombre: "Diego Fernández", email: "diego@correo.com", rol: "empleado", estado: "activo", createdAt: "2025-07-02" },
      { id: 3, nombre: "Restó La Plaza", email: "admin@laplaza.com", rol: "negocio", estado: "activo", createdAt: "2025-06-10" },
      { id: 4, nombre: "Cafetería 9 de Julio", email: "admin@cafe9.com", rol: "negocio", estado: "suspendido", createdAt: "2025-05-28" },
      { id: 5, nombre: "Mariana Silva", email: "mariana@correo.com", rol: "empleado", estado: "activo", createdAt: "2025-08-30" },
    ],
    []
  );

  const adminsInit = useMemo<Admin[]>(
    () => [
      { id: 9001, nombre: "Soporte Central", email: "soporte@manito.app", rol: "admin", estado: "activo", creado: "2025-07-01" },
      { id: 9002, nombre: "Operaciones", email: "ops@manito.app", rol: "admin", estado: "activo", creado: "2025-08-15" },
    ],
    []
  );

  const negociosInit = useMemo<Negocio[]>(
    () => [
      { id: 101, nombre: "Restó La Plaza", plan: "Profesional", publicaciones: 12, deudaARS: 0, ownerEmail: "admin@laplaza.com", alta: "2025-04-01" },
      { id: 102, nombre: "Cafetería 9 de Julio", plan: "Esencial", publicaciones: 5, deudaARS: 45800, ownerEmail: "admin@cafe9.com", alta: "2025-06-12" },
      { id: 103, nombre: "Sushi Central", plan: "Enterprise", publicaciones: 44, deudaARS: 0, ownerEmail: "cto@sushicentral.com", alta: "2025-03-22" },
    ],
    []
  );

  const incidenciasInit = useMemo<Incidencia[]>(
    () => [
      { id: "INC-1201", servicio: "SRV-2025-0001", negocio: "Restó La Plaza", trabajador: "Diego Fernández", motivo: "tardanza", estado: "abierta", creada: hoyISO },
      { id: "INC-1202", servicio: "SRV-2025-0007", negocio: "Cafetería 9 de Julio", trabajador: "Mariana Silva", motivo: "desempeno", estado: "en_revisión", creada: "2025-09-19" },
      { id: "INC-1203", servicio: "SRV-2025-0009", negocio: "Sushi Central", trabajador: "Carla López", motivo: "otros", estado: "resuelta", creada: "2025-09-15" },
    ],
    [hoyISO]
  );

  const pagosInit = useMemo<Pago[]>(
    () => [
      { id: "PAY-901", tipo: "payout_trabajador", beneficiario: "Diego Fernández", monto: 54000, metodo: "CBU", estado: "pendiente", creado: hoyISO },
      { id: "PAY-902", tipo: "payout_trabajador", beneficiario: "Mariana Silva", monto: 38000, metodo: "CBU", estado: "aprobado", creado: "2025-09-18" },
      { id: "PAY-903", tipo: "cobro_negocio", beneficiario: "Cafetería 9 de Julio", monto: 45800, metodo: "MP", estado: "pendiente", creado: "2025-09-18" },
    ],
    [hoyISO]
  );

  const [tab, setTab] = useState<
    "resumen" | "usuarios" | "negocios" | "incidencias" | "pagos" | "administradores" | "ajustes"
  >("resumen");
  const [q, setQ] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosInit);
  const [admins, setAdmins] = useState<Admin[]>(adminsInit);
  const [negocios, setNegocios] = useState<Negocio[]>(negociosInit);
  const [incidencias, setIncidencias] = useState<Incidencia[]>(incidenciasInit);
  const [pagos, setPagos] = useState<Pago[]>(pagosInit);
  const [toast, setToast] = useState<ToastState>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const showToast = (title: string, description?: string) => {
    setToast({ title, description });
    setTimeout(() => setToast(null), 3200);
  };

  const fmt = (n: number | string) => (Number(n) || 0).toLocaleString("es-AR");

  const exportCSV = (rows: (string | number)[][], filename: string) => {
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const filteredUsers = usuarios.filter((u) => (q ? (u.nombre + u.email).toLowerCase().includes(q.toLowerCase()) : true));
  const filteredAdmins = admins.filter((a) => (q ? (a.nombre + a.email).toLowerCase().includes(q.toLowerCase()) : true));
  const filteredBiz = negocios.filter((b) => (q ? (b.nombre + b.ownerEmail).toLowerCase().includes(q.toLowerCase()) : true));
  const filteredInc = incidencias.filter((i) => (q ? (i.id + i.servicio + i.negocio + i.trabajador).toLowerCase().includes(q.toLowerCase()) : true));
  const filteredPay = pagos.filter((p) => (q ? (p.id + p.beneficiario + p.tipo).toLowerCase().includes(q.toLowerCase()) : true));

  const toggleBan = (id: number) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, estado: u.estado === "activo" ? "suspendido" : "activo" } : u)));
    showToast("Usuario actualizado", `ID ${id} · estado cambiado`);
  };

  const updateUserRole = (id: number, rol: string) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol } : u)));
    showToast("Rol actualizado", `${rol.toUpperCase()} aplicado`);
  };

  const resolveIncidencia = (id: string, decision: IncidenciaEstado) => {
    setIncidencias((prev) => prev.map((i) => (i.id === id ? { ...i, estado: decision } : i)));
    showToast("Incidencia actualizada", `#${id} → ${decision}`);
  };

  const updatePago = (id: string, estado: PagoEstado) => {
    setPagos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)));
    showToast("Pago actualizado", `#${id} → ${estado}`);
  };

  const createAdmin = (payload: { nombre: string; email: string; estado?: string }) => {
    const nuevo: Admin = {
      id: Date.now(),
      nombre: payload.nombre,
      email: payload.email,
      rol: "admin",
      estado: payload.estado || "activo",
      creado: hoyISO,
    };
    setAdmins((prev) => [nuevo, ...prev]);
    showToast("Administrador creado", nuevo.email);
  };

  const handleLogout = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("manito_user");
        sessionStorage.removeItem("manito_session");
      }
    } catch (error) {
      console.error(error);
    }
    try {
      router.replace("/login");
    } catch (error) {
      if (typeof window !== "undefined") window.location.href = "/login";
    }
  }, [router]);

  const editAdmin = (id: number, patch: Partial<Admin>) => {
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    showToast("Administrador actualizado", `ID ${id}`);
  };

  const deleteAdmin = (id: number) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    showToast("Administrador eliminado", `ID ${id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">Backoffice / Administrador</h1>
              <p className="text-sm text-neutral-500">Monitoreo, soporte y configuración del sistema</p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Kpi label="Usuarios" value={usuarios.length} />
              <Kpi label="Negocios" value={negocios.length} />
              <Kpi label="Incidencias abiertas" value={incidencias.filter((i) => i.estado !== "resuelta").length} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex overflow-hidden rounded-xl border">
            {(
              [
                ["resumen", "Resumen"],
                ["usuarios", "Usuarios"],
                ["negocios", "Negocios"],
                ["incidencias", "Incidencias"],
                ["pagos", "Pagos"],
                ["administradores", "Administradores"],
                ["ajustes", "Ajustes"],
                ["logout", "Cerrar sesión"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  if (key === "logout") {
                    handleLogout();
                    return;
                  }
                  setTab(key);
                }}
                className={`px-3 py-2 text-sm ${tab === key ? "bg-neutral-100" : "hover:bg-neutral-50"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Buscar…"
              className="rounded-xl border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-6">
          {tab === "resumen" && (
            <Resumen usuarios={usuarios} negocios={negocios} incidencias={incidencias} pagos={pagos} fmt={fmt} />
          )}

          {tab === "usuarios" && (
            <UsuariosTable
              rows={filteredUsers}
              onBan={toggleBan}
              onRole={updateUserRole}
              onExport={() => {
                const rows: (string | number)[][] = [["ID", "Nombre", "Email", "Rol", "Estado", "Creado"]];
                filteredUsers.forEach((u) => rows.push([u.id, u.nombre, u.email, u.rol, u.estado, u.createdAt]));
                exportCSV(rows, `usuarios_${hoyISO}.csv`);
              }}
              onOpen={(user) => setModal({ type: "usuario", payload: user })}
            />
          )}

          {tab === "negocios" && (
            <NegociosTable
              rows={filteredBiz}
              onExport={() => {
                const rows: (string | number)[][] = [["ID", "Nombre", "Plan", "Publicaciones", "Deuda", "Owner", "Alta"]];
                filteredBiz.forEach((b) =>
                  rows.push([b.id, b.nombre, b.plan, b.publicaciones, `$${b.deudaARS}`, b.ownerEmail, b.alta])
                );
                exportCSV(rows, `negocios_${hoyISO}.csv`);
              }}
            />
          )}

          {tab === "incidencias" && (
            <IncidenciasTable
              rows={filteredInc}
              onResolver={(inc) => setModal({ type: "incidencia", payload: inc })}
              onExport={() => {
                const rows: (string | number)[][] = [["ID", "Servicio", "Negocio", "Trabajador", "Motivo", "Estado", "Creada"]];
                filteredInc.forEach((i) =>
                  rows.push([i.id, i.servicio, i.negocio, i.trabajador, i.motivo, i.estado, i.creada])
                );
                exportCSV(rows, `incidencias_${hoyISO}.csv`);
              }}
            />
          )}

          {tab === "pagos" && (
            <PagosTable
              rows={filteredPay}
              onEstado={(pago) => setModal({ type: "pago", payload: pago })}
              onExport={() => {
                const rows: (string | number)[][] = [["ID", "Tipo", "Beneficiario", "Monto", "Método", "Estado", "Creado"]];
                filteredPay.forEach((p) =>
                  rows.push([p.id, p.tipo, p.beneficiario, p.monto, p.metodo, p.estado, p.creado])
                );
                exportCSV(rows, `pagos_${hoyISO}.csv`);
              }}
            />
          )}

          {tab === "administradores" && (
            <AdminsTable
              rows={filteredAdmins}
              onCreate={() => setModal({ type: "admin_form", payload: { mode: "new" } })}
              onEdit={(adm) => setModal({ type: "admin_form", payload: { mode: "edit", admin: adm } })}
              onDelete={(adm) => setModal({ type: "admin_delete", payload: adm })}
              onExport={() => {
                const rows: (string | number)[][] = [["ID", "Nombre", "Email", "Estado", "Creado"]];
                filteredAdmins.forEach((a) => rows.push([a.id, a.nombre, a.email, a.estado, a.creado]));
                exportCSV(rows, `administradores_${hoyISO}.csv`);
              }}
            />
          )}

          {tab === "ajustes" && <AjustesPanel />}
        </div>
      </div>

      {modal?.type === "usuario" && (
        <Modal onClose={() => setModal(null)} title="Usuario">
          <UsuarioModal u={modal.payload} onBan={toggleBan} onRole={updateUserRole} />
        </Modal>
      )}

      {modal?.type === "incidencia" && (
        <Modal onClose={() => setModal(null)} title={`Incidencia ${modal.payload.id}`}>
          <IncidenciaModal
            i={modal.payload}
            onResolve={(decision) => {
              resolveIncidencia(modal.payload.id, decision);
              setModal(null);
            }}
          />
        </Modal>
      )}

      {modal?.type === "pago" && (
        <Modal onClose={() => setModal(null)} title={`Pago ${modal.payload.id}`}>
          <PagoModal
            p={modal.payload}
            onUpdate={(estado) => {
              updatePago(modal.payload.id, estado);
              setModal(null);
            }}
          />
        </Modal>
      )}

      {modal?.type === "admin_form" && (
        <Modal
          onClose={() => setModal(null)}
          title={modal.payload.mode === "new" ? "Nuevo administrador" : "Editar administrador"}
        >
          <AdminForm
            mode={modal.payload.mode}
            initialValue=
              {"admin" in modal.payload ? modal.payload.admin : { nombre: "", email: "", estado: "activo" }}
            onCancel={() => setModal(null)}
            onSubmit={(val) => {
              if (modal.payload.mode === "new") {
                createAdmin(val);
              } else if ("admin" in modal.payload) {
                editAdmin(modal.payload.admin.id, val);
              }
              setModal(null);
            }}
          />
        </Modal>
      )}

      {modal?.type === "admin_delete" && (
        <Modal onClose={() => setModal(null)} title="Eliminar administrador">
          <div className="text-sm">
            <p className="text-neutral-700">
              ¿Confirmás eliminar a <strong>{modal.payload.nombre}</strong> ({modal.payload.email})?
            </p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setModal(null)} className="rounded-xl border px-3 py-2 text-sm">
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteAdmin(modal.payload.id);
                  setModal(null);
                }}
                className="rounded-xl bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="min-w-[280px] rounded-2xl border bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-medium text-neutral-800">{toast.title}</p>
            {toast.description && <p className="mt-0.5 text-xs text-neutral-500">{toast.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

type ResumenProps = {
  usuarios: Usuario[];
  negocios: Negocio[];
  incidencias: Incidencia[];
  pagos: Pago[];
  fmt: (n: number | string) => string;
};

function Resumen({ usuarios, negocios, incidencias, pagos, fmt }: ResumenProps) {
  const activos = usuarios.filter((u) => u.estado === "activo").length;
  const incAbiertas = incidencias.filter((i) => i.estado !== "resuelta").length;
  const pagosPend = pagos.filter((p) => p.estado === "pendiente").length;
  const deudaTotal = negocios.reduce((acc, n) => acc + (Number(n.deudaARS) || 0), 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Kpi big label="Usuarios activos" value={activos} />
      <Kpi big label="Incidencias abiertas" value={incAbiertas} />
      <Kpi big label="Pagos pendientes" value={pagosPend} />
      <Kpi big label="Deuda total (ARS)" value={`$${fmt(deudaTotal)}`} />

      <div className="rounded-2xl border bg-white p-4 md:col-span-2">
        <h3 className="mb-2 text-sm font-semibold text-neutral-800">Últimos movimientos</h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          {pagos.slice(0, 3).map((p) => (
            <li key={p.id} className="flex items-center justify-between">
              <span>
                Pago {p.id} · {labelTipoPago(p.tipo)} → {p.beneficiario}
              </span>
              <span className="text-xs text-neutral-500">
                {p.estado} · {p.creado}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-neutral-800">Incidencias recientes</h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          {incidencias.slice(0, 3).map((i) => (
            <li key={i.id} className="flex items-center justify-between">
              <span>
                #{i.id} · {i.motivo} · {i.negocio}
              </span>
              <span className="text-xs text-neutral-500">{labelEstadoInc(i.estado)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type UsuariosTableProps = {
  rows: Usuario[];
  onBan: (id: number) => void;
  onRole: (id: number, rol: string) => void;
  onExport: () => void;
  onOpen: (usuario: Usuario) => void;
};

function UsuariosTable({ rows, onBan, onRole, onExport, onOpen }: UsuariosTableProps) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">Usuarios</h3>
        <button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
          Exportar CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500">
              <th className="py-2 pr-3">ID</th>
              <th className="py-2 pr-3">Nombre</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Rol</th>
              <th className="py-2 pr-3">Estado</th>
              <th className="py-2 pr-3">Creado</th>
              <th className="py-2 pr-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((u) => (
              <tr key={u.id} className="hover:bg-neutral-50">
                <td className="py-2 pr-3">{u.id}</td>
                <td className="py-2 pr-3">{u.nombre}</td>
                <td className="py-2 pr-3">{u.email}</td>
                <td className="py-2 pr-3">{u.rol}</td>
                <td className="py-2 pr-3">{u.estado}</td>
                <td className="py-2 pr-3">{u.createdAt}</td>
                <td className="flex items-center gap-2 py-2 pr-3">
                  <button onClick={() => onOpen(u)} className="rounded-lg border px-2 py-1 text-xs">
                    Ver/Editar
                  </button>
                  <button
                    onClick={() => onRole(u.id, u.rol === "empleado" ? "negocio" : "empleado")}
                    className="rounded-lg border px-2 py-1 text-xs"
                  >
                    Cambiar rol
                  </button>
                  <button
                    onClick={() => onBan(u.id)}
                    className={`rounded-lg px-2 py-1 text-xs border ${
                      u.estado === "activo" ? "hover:bg-neutral-50" : "border-amber-300 bg-amber-100"
                    }`}
                  >
                    {u.estado === "activo" ? "Suspender" : "Reactivar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type AdminsTableProps = {
  rows: Admin[];
  onCreate: () => void;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  onExport: () => void;
};

function AdminsTable({ rows, onCreate, onEdit, onDelete, onExport }: AdminsTableProps) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">Administradores</h3>
        <div className="flex items-center gap-2">
          <button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
            Exportar CSV
          </button>
          <button
            onClick={onCreate}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
          >
            Nuevo
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500">
              <th className="py-2 pr-3">ID</th>
              <th className="py-2 pr-3">Nombre</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Estado</th>
              <th className="py-2 pr-3">Creado</th>
              <th className="py-2 pr-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((a) => (
              <tr key={a.id} className="hover:bg-neutral-50">
                <td className="py-2 pr-3">{a.id}</td>
                <td className="py-2 pr-3">{a.nombre}</td>
                <td className="py-2 pr-3">{a.email}</td>
                <td className="py-2 pr-3">{a.estado}</td>
                <td className="py-2 pr-3">{a.creado}</td>
                <td className="flex items-center gap-2 py-2 pr-3">
                  <button onClick={() => onEdit(a)} className="rounded-lg border px-2 py-1 text-xs">
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(a)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700 hover:bg-rose-100"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type NegociosTableProps = {
  rows: Negocio[];
  onExport: () => void;
};

function NegociosTable({ rows, onExport }: NegociosTableProps) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">Negocios</h3>
        <button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
          Exportar CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500">
              <th className="py-2 pr-3">ID</th>
              <th className="py-2 pr-3">Nombre</th>
              <th className="py-2 pr-3">Plan</th>
              <th className="py-2 pr-3">Publicaciones</th>
              <th className="py-2 pr-3">Deuda (ARS)</th>
              <th className="py-2 pr-3">Owner</th>
              <th className="py-2 pr-3">Alta</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((b) => (
              <tr key={b.id} className="hover:bg-neutral-50">
                <td className="py-2 pr-3">{b.id}</td>
                <td className="py-2 pr-3">{b.nombre}</td>
                <td className="py-2 pr-3">{b.plan}</td>
                <td className="py-2 pr-3">{b.publicaciones}</td>
                <td className="py-2 pr-3">${b.deudaARS.toLocaleString("es-AR")}</td>
                <td className="py-2 pr-3">{b.ownerEmail}</td>
                <td className="py-2 pr-3">{b.alta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type IncidenciasTableProps = {
  rows: Incidencia[];
  onResolver: (inc: Incidencia) => void;
  onExport: () => void;
};

function IncidenciasTable({ rows, onResolver, onExport }: IncidenciasTableProps) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">Incidencias</h3>
        <button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
          Exportar CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500">
              <th className="py-2 pr-3">ID</th>
              <th className="py-2 pr-3">Servicio</th>
              <th className="py-2 pr-3">Negocio</th>
              <th className="py-2 pr-3">Trabajador</th>
              <th className="py-2 pr-3">Motivo</th>
              <th className="py-2 pr-3">Estado</th>
              <th className="py-2 pr-3">Creada</th>
              <th className="py-2 pr-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((i) => (
              <tr key={i.id} className="hover:bg-neutral-50">
                <td className="py-2 pr-3">{i.id}</td>
                <td className="py-2 pr-3">{i.servicio}</td>
                <td className="py-2 pr-3">{i.negocio}</td>
                <td className="py-2 pr-3">{i.trabajador}</td>
                <td className="py-2 pr-3">{i.motivo}</td>
                <td className="py-2 pr-3">{labelEstadoInc(i.estado)}</td>
                <td className="py-2 pr-3">{i.creada}</td>
                <td className="flex items-center gap-2 py-2 pr-3">
                  <button onClick={() => onResolver(i)} className="rounded-lg border px-2 py-1 text-xs">
                    Resolver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type PagosTableProps = {
  rows: Pago[];
  onEstado: (pago: Pago) => void;
  onExport: () => void;
};

function PagosTable({ rows, onEstado, onExport }: PagosTableProps) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">Pagos</h3>
        <button onClick={onExport} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
          Exportar CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500">
              <th className="py-2 pr-3">ID</th>
              <th className="py-2 pr-3">Tipo</th>
              <th className="py-2 pr-3">Beneficiario</th>
              <th className="py-2 pr-3">Monto (ARS)</th>
              <th className="py-2 pr-3">Método</th>
              <th className="py-2 pr-3">Estado</th>
              <th className="py-2 pr-3">Creado</th>
              <th className="py-2 pr-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50">
                <td className="py-2 pr-3">{p.id}</td>
                <td className="py-2 pr-3">{labelTipoPago(p.tipo)}</td>
                <td className="py-2 pr-3">{p.beneficiario}</td>
                <td className="py-2 pr-3">${p.monto.toLocaleString("es-AR")}</td>
                <td className="py-2 pr-3">{p.metodo}</td>
                <td className="py-2 pr-3">{labelEstadoPago(p.estado)}</td>
                <td className="py-2 pr-3">{p.creado}</td>
                <td className="flex items-center gap-2 py-2 pr-3">
                  <button onClick={() => onEstado(p)} className="rounded-lg border px-2 py-1 text-xs">
                    Cambiar estado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AjustesPanel() {
  const [comisionRecurso, setComisionRecurso] = useState<number>(80000);

  return (
    <div className="space-y-4 rounded-2xl border bg-white p-4">
      <h3 className="text-sm font-semibold text-neutral-800">Ajustes</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className="text-xs text-neutral-600">Comisión por recurso (ARS)</label>
          <input
            type="number"
            min={0}
            step={100}
            value={comisionRecurso}
            onChange={(event) => setComisionRecurso(Number(event.target.value) || 0)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-neutral-500">Actual: ${" " + comisionRecurso.toLocaleString("es-AR")}</p>
        </div>
      </div>
    </div>
  );
}

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
          <button onClick={onClose} className="rounded-lg border px-2 py-1 text-xs">
            Cerrar
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

type UsuarioModalProps = {
  u: Usuario;
  onBan: (id: number) => void;
  onRole: (id: number, rol: string) => void;
};

function UsuarioModal({ u, onBan, onRole }: UsuarioModalProps) {
  const [rol, setRol] = useState<string>(u.rol);
  const [estado, setEstado] = useState<string>(u.estado);

  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-neutral-600">Nombre</div>
          <div className="font-medium">{u.nombre}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-600">Email</div>
          <div className="font-medium">{u.email}</div>
        </div>
        <div>
          <label className="text-xs text-neutral-600">Rol</label>
          <select
            value={rol}
            onChange={(event) => setRol(event.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
          >
            <option value="empleado">Empleado</option>
            <option value="negocio">Negocio</option>
            <option value="soporte">Soporte</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-neutral-600">Estado</label>
          <select
            value={estado}
            onChange={(event) => setEstado(event.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
          >
            <option value="activo">Activo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onRole(u.id, rol)}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
        >
          Guardar rol
        </button>
        <button
          onClick={() => onBan(u.id)}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
        >
          {estado === "activo" ? "Suspender" : "Reactivar"}
        </button>
      </div>
    </div>
  );
}

type AdminFormProps = {
  mode: "new" | "edit";
  initialValue: { nombre: string; email: string; estado: string };
  onSubmit: (payload: { nombre: string; email: string; estado: string; password?: string }) => void;
  onCancel: () => void;
};

function AdminForm({ mode, initialValue, onSubmit, onCancel }: AdminFormProps) {
  const [nombre, setNombre] = useState<string>(initialValue.nombre || "");
  const [email, setEmail] = useState<string>(initialValue.email || "");
  const [estado, setEstado] = useState<string>(initialValue.estado || "activo");
  const [password, setPassword] = useState<string>("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState<boolean>(false);

  const validatePassword = (pw: string) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pw);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nombre || !email) {
      alert("Completá nombre y email");
      return;
    }

    if (mode === "new") {
      if (!password) {
        setPwError("Ingresá una contraseña");
        return;
      }
      if (!validatePassword(password)) {
        setPwError("Mínimo 8 caracteres, con letras y números");
        return;
      }
      setPwError(null);
      onSubmit({ nombre, email, estado, password });
      return;
    }

    if (password) {
      if (!validatePassword(password)) {
        setPwError("Mínimo 8 caracteres, con letras y números");
        return;
      }
      setPwError(null);
      onSubmit({ nombre, email, estado, password });
    } else {
      setPwError(null);
      onSubmit({ nombre, email, estado });
    }
  };

  try {
    console.assert(validatePassword("Abcdef12") === true, "Pwd válida debería dar true");
    console.assert(validatePassword("short1") === false, "Pwd corta debería dar false");
  } catch (error) {
    console.error(error);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs text-neutral-600">Nombre</label>
          <input
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Nombre y apellido"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="correo@manito.app"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-600">Estado</label>
          <select
            value={estado}
            onChange={(event) => setEstado(event.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
          >
            <option value="activo">Activo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-neutral-600">
            Contraseña {mode === "edit" && <span className="text-neutral-400">(opcional)</span>}
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm"
              placeholder={mode === "new" ? "Mín. 8 caracteres, letras y números" : "Dejar vacío para no cambiar"}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="rounded-lg border px-2 py-1 text-xs"
            >
              {showPw ? "Ocultar" : "Ver"}
            </button>
          </div>
          {pwError && <p className="mt-1 text-xs text-rose-600">{pwError}</p>}
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="rounded-xl border px-3 py-2">
          Cancelar
        </button>
        <button type="submit" className="rounded-xl bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700">
          Guardar
        </button>
      </div>
    </form>
  );
}

type IncidenciaModalProps = {
  i: Incidencia;
  onResolve: (estado: IncidenciaEstado) => void;
};

function IncidenciaModal({ i, onResolve }: IncidenciaModalProps) {
  const [decision, setDecision] = useState<IncidenciaEstado>("resuelta");
  const [nota, setNota] = useState<string>("");

  return (
    <div className="space-y-3 text-sm">
      <div className="text-neutral-700">
        Resolver incidencia <strong>#{i.id}</strong> del servicio <strong>{i.servicio}</strong>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs text-neutral-600">Decisión</label>
          <select
            value={decision}
            onChange={(event) => setDecision(event.target.value as IncidenciaEstado)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
          >
            <option value="resuelta">Marcar como resuelta</option>
            <option value="reembolsar_negocio">Reembolsar negocio</option>
            <option value="pagar_trabajador">Pagar trabajador</option>
            <option value="en_revisión">Mantener en revisión</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-neutral-600">Nota interna</label>
          <input
            value={nota}
            onChange={(event) => setNota(event.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Resumen de soporte"
          />
        </div>
      </div>
      <div>
        <button
          onClick={() => onResolve(decision)}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-600"
        >
          Aplicar resolución
        </button>
      </div>
    </div>
  );
}

type PagoModalProps = {
  p: Pago;
  onUpdate: (estado: PagoEstado) => void;
};

function PagoModal({ p, onUpdate }: PagoModalProps) {
  const [estado, setEstado] = useState<PagoEstado>(p.estado);

  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-neutral-600">Beneficiario</div>
          <div className="font-medium">{p.beneficiario}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-600">Monto</div>
          <div className="font-medium">${p.monto.toLocaleString("es-AR")}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-600">Método</div>
          <div className="font-medium">{p.metodo}</div>
        </div>
        <div>
          <label className="text-xs text-neutral-600">Estado</label>
          <select
            value={estado}
            onChange={(event) => setEstado(event.target.value as PagoEstado)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => onUpdate(estado)}
        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-600"
      >
        Guardar
      </button>
    </div>
  );
}

type KpiProps = {
  label: string;
  value: string | number;
  big?: boolean;
};

function Kpi({ label, value, big }: KpiProps) {
  return (
    <div className={`rounded-2xl border bg-white p-4 ${big ? "shadow-sm" : ""}`}>
      <div className="text-xs text-neutral-500">{label}</div>
      <div className={`text-neutral-900 font-semibold ${big ? "text-2xl" : "text-lg"}`}>{value}</div>
    </div>
  );
}

function labelTipoPago(t: PagoTipo) {
  switch (t) {
    case "payout_trabajador":
      return "Payout trabajador";
    case "cobro_negocio":
      return "Cobro a negocio";
    default:
      return t;
  }
}

function labelEstadoPago(e: PagoEstado) {
  switch (e) {
    case "pendiente":
      return "Pendiente";
    case "aprobado":
      return "Aprobado";
    case "rechazado":
      return "Rechazado";
    default:
      return e;
  }
}

function labelEstadoInc(e: IncidenciaEstado) {
  switch (e) {
    case "abierta":
      return "Abierta";
    case "en_revisión":
      return "En revisión";
    case "resuelta":
      return "Resuelta";
    case "reembolsar_negocio":
      return "Reembolsar negocio";
    case "pagar_trabajador":
      return "Pagar trabajador";
    default:
      return e;
  }
}

function csvEscape(value: string | number) {
  const str = String(value).replaceAll('"', '""');
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}
