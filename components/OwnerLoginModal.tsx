"use client";

import Link from "next/link";
import { useState } from "react";

export function OwnerLoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Soy propietario">
      <div className="overlay__backdrop" onClick={onClose} />
      <div className="overlay__panel">
        <div className="overlay__top">
          <span className="overlay__title">Acceso propietarios</span>
          <button className="overlay__close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Portal en construcción. (Login real se implementará en /portal)");
          }}
        >
          <label className="form__label">
            Correo electrónico
            <input
              className="form__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
          </label>

          <label className="form__label">
            Contraseña
            <input
              className="form__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </label>

          <div className="form__row">
            <Link className="form__link" href="/portal/forgot-password">
              Olvidé mi contraseña
            </Link>
          </div>

          <button className="form__submit" type="submit">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
