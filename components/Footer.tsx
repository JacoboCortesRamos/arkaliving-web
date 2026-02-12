export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="ARKA" width={90} height={26} />
          <div style={{ display: "flex", gap: 10 }}>
            <a className="footer__icon" href="#" aria-label="Instagram">Instagram</a>
            <a className="footer__icon" href="#" aria-label="Facebook">Facebook</a>
          </div>
        </div>

        <p className="footer__line">Operamos en Santa Marta y Bogotá</p>
        <p className="footer__line">© 2026 Sitio web creado por Jacobo Cortés Ramos</p>
      </div>
    </footer>
  );
}
