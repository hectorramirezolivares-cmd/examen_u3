"use client";

import { useMemo, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
} from "@/firebase/auth";

type AuthUser = {
  email: string;
};

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function LoginExam() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<AuthUser | null>(null);

  const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // TODO: limpiar errores previos.
    setError("");

    // TODO: validar campos vacíos.
    if (correo.trim() === "" || contrasena.trim() === "") {
      setError("No fue posible iniciar sesión.");
      return;
    }

    // TODO: validar formato de correo.
    if (!esCorreoValido(correo)) {
      setError("No fue posible iniciar sesión.");
      return;
    }

    // TODO: activar estado de carga.
    setCargando(true);

    try {
      // TODO: configurar persistencia según recordarme.
      await configurarPersistencia(recordarme);

      // TODO: autenticar usuario.
      const credencial = await autenticarUsuario(correo, contrasena);

      // TODO: guardar usuario autenticado en estado.
      if (credencial.user.email) {
        setUsuario({ email: credencial.user.email });
      }
    } catch {
      // TODO: manejar errores y mostrarlos en pantalla.
      setError("No fue posible iniciar sesión.");
    } finally {
      // TODO: limpiar estado de carga.
      setCargando(false);
    }
  }

  async function salir() {
    // TODO: cerrar sesión en Firebase.
    await cerrarSesionUsuario();

    // TODO: limpiar el usuario en estado.
    setUsuario(null);

    // TODO: limpiar formulario si se desea.
    setCorreo("");
    setContrasena("");
    setRecordarme(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-slate-50">
      <section className="w-full max-w-95 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-center font-bold text-lg text-slate-900">Acceso escolar</h1>
          <p className="text-center text-[11px] text-gray-500 mb-6 mt-1">Completa la funcionalidad de inicio de sesión.</p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="flex flex-col gap-4">
            <div>
              <label htmlFor="correo" className="block text-[11px] text-gray-700 mb-1.5">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="w-full border border-gray-200 rounded-md p-2 text-xs outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-[11px] text-gray-700 mb-1.5">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                className="w-full border border-gray-200 rounded-md p-2 text-xs outline-none focus:border-slate-400"
              />
            </div>

            <label className="flex items-center gap-2 text-[11px] text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 cursor-pointer"
              />
              Recordarme
            </label>

            {error ? (
              <div className="bg-red-50 text-red-500 text-[11px] text-center p-2.5 rounded-md mt-1 border border-red-100">
                {error}
              </div>
            ) : null}

            <button 
              type="submit" 
              disabled={cargando} 
              className="w-full bg-[#0f172a] text-white text-xs font-medium py-3 rounded-md hover:bg-slate-800 disabled:opacity-70 mt-2 transition-colors"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div>
            <div className="bg-green-50 text-green-800 p-4 rounded-md text-center mb-6">
              <p className="text-[11px] mb-1">Inicio de sesión correcto</p>
              <h2 className="font-semibold text-sm">Bienvenido, {usuario.email}</h2>
            </div>

            <button 
              type="button" 
              onClick={salir} 
              className="w-full bg-[#0f172a] text-white text-xs font-medium py-3 rounded-md hover:bg-slate-800 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}