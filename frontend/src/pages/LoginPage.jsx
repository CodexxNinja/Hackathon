import { useEffect, useState } from "react";

// ── Hardcoded super-admin credentials ──────────────────────────────────────
const SUPER_ADMIN = { email: "superadmin@secure.com", password: "Admin@1234" };

const floatingOrbs = [
  { size: 300, x: 10, y: 15, color: "#a78bfa", delay: 0 },
  { size: 200, x: 70, y: 60, color: "#38bdf8", delay: 2 },
  { size: 250, x: 40, y: 80, color: "#34d399", delay: 4 },
  { size: 180, x: 85, y: 20, color: "#f472b6", delay: 1 },
];

// ── Styles ─────────────────────────────────────────────────────────────────
const getStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }

  .login-root {
    min-height: 100vh;
    background: ${dark ? "#060612" : "#f0f4ff"};
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.5s ease;
  }

  .orb {
    position: absolute; border-radius: 50%;
    filter: blur(80px); opacity: ${dark ? "0.18" : "0.22"};
    animation: floatOrb 12s ease-in-out infinite; pointer-events: none;
    transition: opacity 0.5s ease;
  }
  @keyframes floatOrb {
    0%,100% { transform: translateY(0px) scale(1); }
    33% { transform: translateY(-30px) scale(1.05); }
    66% { transform: translateY(20px) scale(0.97); }
  }

  .grid-overlay {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(${dark ? "rgba(167,139,250,0.04)" : "rgba(99,102,241,0.06)"} 1px, transparent 1px),
      linear-gradient(90deg, ${dark ? "rgba(167,139,250,0.04)" : "rgba(99,102,241,0.06)"} 1px, transparent 1px);
    background-size: 60px 60px; pointer-events: none;
  }

  /* ── Theme Toggle ── */
  .theme-toggle {
    position: fixed; top: 20px; right: 20px; z-index: 100;
    display: flex; align-items: center; gap: 2px;
    background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)"};
    border-radius: 50px; padding: 5px;
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px ${dark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)"};
    transition: all 0.4s ease;
  }
  .theme-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 16px; border-radius: 40px; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); white-space: nowrap;
  }
  .theme-btn-dark {
    background: ${dark ? "linear-gradient(135deg,#1e1b4b,#312e81)" : "transparent"};
    color: ${dark ? "#c4b5fd" : "rgba(0,0,0,0.3)"};
    box-shadow: ${dark ? "0 2px 12px rgba(99,102,241,0.3)" : "none"};
  }
  .theme-btn-light {
    background: ${!dark ? "linear-gradient(135deg,#fef9c3,#fde68a)" : "transparent"};
    color: ${!dark ? "#92400e" : "rgba(255,255,255,0.3)"};
    box-shadow: ${!dark ? "0 2px 12px rgba(251,191,36,0.3)" : "none"};
  }
  .theme-btn:hover { transform: scale(1.04); }

  /* ── Card ── */
  .card-wrapper {
    position: relative; z-index: 10; width: 100%; max-width: 480px; padding: 16px;
    animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .card {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.78)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"};
    border-radius: 24px; padding: 40px 36px;
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    box-shadow: ${dark
      ? "0 0 0 1px rgba(255,255,255,0.05), 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)"
      : "0 0 0 1px rgba(255,255,255,0.9), 0 32px 80px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.9)"};
    transition: all 0.4s ease;
  }

  /* ── 3-Tab Bar ── */
  .tab-bar {
    display: flex;
    background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
    border-radius: 14px; padding: 5px; gap: 4px; margin-bottom: 32px;
    border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
    transition: all 0.4s ease;
  }
  .tab-btn {
    flex: 1; padding: 9px 4px; border: none; border-radius: 10px;
    background: transparent;
    color: ${dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"};
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.3px; cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    white-space: nowrap;
  }
  .tab-btn.active-secure {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; box-shadow: 0 4px 20px rgba(16,185,129,0.4);
  }
  .tab-btn.active-user {
    background: linear-gradient(135deg, #a78bfa, #38bdf8);
    color: #fff; box-shadow: 0 4px 20px rgba(167,139,250,0.35);
  }
  .tab-btn.active-admin {
    background: linear-gradient(135deg, #f472b6, #fb923c);
    color: #fff; box-shadow: 0 4px 20px rgba(244,114,182,0.35);
  }
  .tab-btn:not(.active-secure):not(.active-user):not(.active-admin):hover {
    color: ${dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"};
    background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"};
  }

  /* ── Header ── */
  .header {
    text-align: center; margin-bottom: 28px;
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.15s; opacity: 0;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .icon-wrap {
    width: 60px; height: 60px; border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px; font-size: 28px;
  }
  .icon-wrap-secure {
    background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2));
    border: 1px solid rgba(16,185,129,0.35);
    box-shadow: 0 0 30px rgba(16,185,129,0.2);
  }
  .icon-wrap-user {
    background: linear-gradient(135deg, rgba(167,139,250,0.2), rgba(56,189,248,0.2));
    border: 1px solid rgba(167,139,250,0.3);
    box-shadow: 0 0 30px rgba(167,139,250,0.15);
  }
  .icon-wrap-admin {
    background: linear-gradient(135deg, rgba(244,114,182,0.2), rgba(251,146,60,0.2));
    border: 1px solid rgba(244,114,182,0.3);
    box-shadow: 0 0 30px rgba(244,114,182,0.15);
  }
  .login-title {
    font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800;
    color: ${dark ? "#fff" : "#1e1b4b"}; letter-spacing: -0.5px; margin-bottom: 6px;
    transition: color 0.4s;
  }
  .login-subtitle {
    font-size: 13px; font-weight: 300;
    color: ${dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)"}; transition: color 0.4s;
  }

  /* ── Secure Login callout banner ── */
  .secure-callout {
    background: ${dark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.07)"};
    border: 1px solid rgba(16,185,129,0.25);
    border-radius: 12px; padding: 12px 14px; margin-bottom: 22px;
    display: flex; align-items: flex-start; gap: 10px;
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.2s; opacity: 0;
  }
  .secure-callout-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .secure-callout-text { font-size: 12.5px; line-height: 1.55; color: ${dark ? "rgba(52,211,153,0.9)" : "#065f46"}; }
  .secure-callout-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; margin-bottom: 2px; }

  /* ── Form ── */
  .form-group { margin-bottom: 18px; animation: fadeUp 0.5s ease forwards; opacity: 0; }
  .form-group:nth-child(1) { animation-delay: 0.25s; }
  .form-group:nth-child(2) { animation-delay: 0.35s; }
  .form-group:nth-child(3) { animation-delay: 0.42s; }
  .form-label {
    display: block; font-size: 12px; font-weight: 500; letter-spacing: 0.8px;
    text-transform: uppercase; margin-bottom: 8px;
    color: ${dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"}; transition: color 0.4s;
  }
  .input-wrap { position: relative; }
  .input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    font-size: 16px; opacity: 0.45; pointer-events: none;
  }
  .form-input {
    width: 100%; padding: 13px 14px 13px 42px;
    background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
    border-radius: 12px; color: ${dark ? "#fff" : "#1e1b4b"};
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    outline: none; transition: all 0.25s ease;
  }
  .form-input::placeholder { color: ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)"}; }
  .form-input:focus {
    background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(167,139,250,0.06)"};
    border-color: rgba(167,139,250,0.5); box-shadow: 0 0 0 3px rgba(167,139,250,0.1);
  }
  .form-input.secure-focus:focus {
    border-color: rgba(16,185,129,0.55); box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
  }
  .form-input.admin-focus:focus {
    border-color: rgba(244,114,182,0.5); box-shadow: 0 0 0 3px rgba(244,114,182,0.1);
  }

  /* ── Error msg ── */
  .error-msg {
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
    border-radius: 10px; padding: 10px 14px; margin-bottom: 16px;
    font-size: 13px; color: #fca5a5; display: flex; align-items: center; gap: 8px;
    animation: shake 0.4s ease;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  /* ── Extras Row ── */
  .extras-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 26px;
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.45s; opacity: 0;
  }
  .remember-label {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    font-size: 13px; user-select: none;
    color: ${dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"}; transition: color 0.4s;
  }
  .remember-check { width: 16px; height: 16px; accent-color: #a78bfa; cursor: pointer; }
  .forgot-link { font-size: 13px; color: rgba(167,139,250,0.85); text-decoration: none; cursor: pointer; transition: color 0.2s; }
  .forgot-link:hover { color: #a78bfa; }
  .forgot-link-admin { color: rgba(244,114,182,0.85); }
  .forgot-link-admin:hover { color: #f472b6; }
  .forgot-link-secure { color: rgba(16,185,129,0.85); }
  .forgot-link-secure:hover { color: #10b981; }

  /* ── Submit Button ── */
  .submit-btn {
    width: 100%; padding: 14px; border: none; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: 0.5px; cursor: pointer; position: relative; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.5s; opacity: 0;
  }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }
  .submit-btn-user { background: linear-gradient(135deg, #a78bfa, #38bdf8); color: #fff; box-shadow: 0 6px 30px rgba(167,139,250,0.4); }
  .submit-btn-user:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(167,139,250,0.5); }
  .submit-btn-admin { background: linear-gradient(135deg, #f472b6, #fb923c); color: #fff; box-shadow: 0 6px 30px rgba(244,114,182,0.4); }
  .submit-btn-admin:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(244,114,182,0.5); }
  .submit-btn-secure { background: linear-gradient(135deg, #10b981, #0ea5e9); color: #fff; box-shadow: 0 6px 30px rgba(16,185,129,0.4); }
  .submit-btn-secure:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(16,185,129,0.5); }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .btn-shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
    transform: translateX(-100%); transition: transform 0.5s ease;
  }
  .submit-btn:hover .btn-shimmer { transform: translateX(100%); }

  /* ── Divider / Social ── */
  .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; animation: fadeUp 0.5s ease forwards; animation-delay: 0.55s; opacity: 0; }
  .divider-line { flex: 1; height: 1px; background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}; transition: background 0.4s; }
  .divider-text { font-size: 12px; white-space: nowrap; color: ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)"}; transition: color 0.4s; }
  .social-row { display: flex; gap: 10px; animation: fadeUp 0.5s ease forwards; animation-delay: 0.6s; opacity: 0; }
  .social-btn {
    flex: 1; padding: 11px;
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"};
    border-radius: 10px; color: ${dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)"};
    font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.25s ease; font-family: 'DM Sans', sans-serif;
  }
  .social-btn:hover { background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}; color: ${dark ? "#fff" : "#1e1b4b"}; transform: translateY(-1px); }

  /* ── SSL Badge ── */
  .secure-badge {
    display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px;
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
    border-radius: 20px; font-size: 11px; letter-spacing: 0.5px; margin-bottom: 24px;
    color: ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)"};
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.1s; opacity: 0; transition: all 0.4s;
  }
  .dot-green { width: 6px; height: 6px; background: #34d399; border-radius: 50%; box-shadow: 0 0 6px #34d399; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* ── Strength Bar ── */
  .strength-wrap { margin-top: 8px; display: flex; gap: 4px; }
  .strength-seg { height: 3px; flex: 1; border-radius: 4px; background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}; transition: background 0.3s; }

  /* ── Success overlay (for user/admin) ── */
  .success-overlay {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: ${dark ? "rgba(6,6,18,0.95)" : "rgba(240,244,255,0.95)"};
    border-radius: 24px; z-index: 20; animation: cardIn 0.4s ease forwards;
  }
  .success-icon { font-size: 56px; margin-bottom: 16px; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .success-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: ${dark ? "#fff" : "#1e1b4b"}; margin-bottom: 8px; }
  .success-sub { font-size: 14px; color: ${dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)"}; }

  /* ── Card Footer ── */
  .card-footer {
    text-align: center; margin-top: 28px; font-size: 13px;
    color: ${dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)"};
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.65s; opacity: 0; transition: color 0.4s;
  }
  .footer-link { color: rgba(167,139,250,0.85); cursor: pointer; font-weight: 500; transition: color 0.2s; }
  .footer-link:hover { color: #a78bfa; }
  .footer-link-admin { color: rgba(244,114,182,0.85); }
  .footer-link-admin:hover { color: #f472b6; }

  /* ══════════════════════════════════════════════
     VERIFICATION PAGE
  ══════════════════════════════════════════════ */
  .verify-root {
    min-height: 100vh;
    background: ${dark ? "#060612" : "#f0f4ff"};
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; font-family: 'DM Sans', sans-serif;
    transition: background 0.5s ease;
  }
  .verify-card {
    position: relative; z-index: 10; width: 100%; max-width: 440px; padding: 16px;
    animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .verify-inner {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.78)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"};
    border-radius: 24px; padding: 44px 36px; text-align: center;
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    box-shadow: ${dark
      ? "0 0 0 1px rgba(255,255,255,0.05), 0 32px 80px rgba(0,0,0,0.5)"
      : "0 0 0 1px rgba(255,255,255,0.9), 0 32px 80px rgba(16,185,129,0.1)"};
  }
  .verify-shield {
    width: 80px; height: 80px; border-radius: 24px; margin: 0 auto 24px;
    background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.15));
    border: 1px solid rgba(16,185,129,0.3);
    box-shadow: 0 0 40px rgba(16,185,129,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 36px;
    animation: pulseShield 2.5s ease-in-out infinite;
  }
  @keyframes pulseShield {
    0%,100% { box-shadow: 0 0 40px rgba(16,185,129,0.2); }
    50% { box-shadow: 0 0 70px rgba(16,185,129,0.4); }
  }
  .verify-title {
    font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
    color: ${dark ? "#fff" : "#1e1b4b"}; margin-bottom: 8px;
  }
  .verify-sub {
    font-size: 14px; color: ${dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)"};
    margin-bottom: 6px; line-height: 1.6;
  }
  .verify-email-tag {
    display: inline-block; padding: 4px 14px;
    background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25);
    border-radius: 20px; font-size: 13px; color: #34d399; font-weight: 500;
    margin-bottom: 32px;
  }
  .otp-row {
    display: flex; gap: 10px; justify-content: center; margin-bottom: 28px;
  }
  .otp-input {
    width: 52px; height: 60px; border-radius: 14px; text-align: center;
    font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700;
    background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"};
    border: 2px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
    color: ${dark ? "#fff" : "#1e1b4b"}; outline: none;
    transition: all 0.2s ease; caret-color: #10b981;
  }
  .otp-input:focus {
    border-color: #10b981; background: ${dark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.06)"};
    box-shadow: 0 0 0 3px rgba(16,185,129,0.15); transform: scale(1.06);
  }
  .otp-input.filled {
    border-color: rgba(16,185,129,0.5); color: #10b981;
  }
  .verify-btn {
    width: 100%; padding: 14px; border: none; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px;
    cursor: pointer; position: relative; overflow: hidden;
    background: linear-gradient(135deg, #10b981, #0ea5e9); color: #fff;
    box-shadow: 0 6px 30px rgba(16,185,129,0.4);
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    margin-bottom: 20px;
  }
  .verify-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(16,185,129,0.5); }
  .verify-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .verify-timer {
    font-size: 13px; color: ${dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)"};
    margin-bottom: 6px;
  }
  .verify-resend {
    font-size: 13px; color: rgba(16,185,129,0.85); cursor: pointer; font-weight: 500;
    transition: color 0.2s; background: none; border: none; font-family: 'DM Sans', sans-serif;
  }
  .verify-resend:hover { color: #10b981; }
  .verify-resend:disabled { color: ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}; cursor: default; }
  .back-btn {
    display: flex; align-items: center; gap: 6px; margin: 0 auto; margin-top: 20px;
    background: none; border: none; cursor: pointer;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    color: ${dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)"};
    transition: color 0.2s;
  }
  .back-btn:hover { color: ${dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"}; }

  /* ── Verified success ── */
  .verified-overlay {
    position: absolute; inset: 0; border-radius: 24px; z-index: 20;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: ${dark ? "rgba(6,6,18,0.97)" : "rgba(240,253,250,0.97)"};
    animation: cardIn 0.4s ease forwards;
  }
  .verified-check {
    width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    display: flex; align-items: center; justify-content: center; font-size: 38px;
    box-shadow: 0 0 50px rgba(16,185,129,0.5);
    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  .verified-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: ${dark ? "#fff" : "#1e1b4b"}; margin-bottom: 8px; }
  .verified-sub { font-size: 14px; color: ${dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)"}; }
`;

// ── Strength Bar ──────────────────────────────────────────────────────────
function StrengthBar({ password }) {
  const score = password.length === 0 ? 0
    : password.length < 4 ? 1
    : password.length < 8 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const colors = ["", "#ef4444", "#fb923c", "#facc15", "#34d399"];
  return (
    <div className="strength-wrap">
      {[1,2,3,4].map(i => (
        <div key={i} className="strength-seg" style={{ background: i <= score ? colors[score] : undefined }} />
      ))}
    </div>
  );
}

// ── OTP Verification Page ─────────────────────────────────────────────────
function VerificationPage({ dark, email, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [wrongOtp, setWrongOtp] = useState(false);
  // Demo OTP always "123456"
  const DEMO_OTP = "123456";

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleOtpChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setWrongOtp(false);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    const entered = otp.join("");
    if (entered.length < 6) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (entered === DEMO_OTP) {
        setVerified(true);
      } else {
        setWrongOtp(true);
        setOtp(["", "", "", "", "", ""]);
        document.getElementById("otp-0")?.focus();
      }
    }, 1400);
  };

  const handleResend = () => {
    setTimer(59);
    setOtp(["", "", "", "", "", ""]);
    setWrongOtp(false);
  };

  return (
    <div className="verify-root">
      {floatingOrbs.map((orb, i) => (
        <div key={i} className="orb" style={{
          width: orb.size, height: orb.size,
          left: `${orb.x}%`, top: `${orb.y}%`,
          background: orb.color, animationDelay: `${orb.delay}s`,
        }} />
      ))}
      <div className="grid-overlay" />

      {/* Theme toggle stays on verify page too */}
      <div className="theme-toggle" style={{ position: "fixed", top: 20, right: 20, zIndex: 100 }}>
        {/* passed as children via prop if needed — handled by parent */}
      </div>

      <div className="verify-card">
        <div className="verify-inner" style={{ position: "relative" }}>

          {verified && (
            <div className="verified-overlay">
              <div className="verified-check">✓</div>
              <div className="verified-title">Identity Verified!</div>
              <div className="verified-sub">Access granted. Welcome, Super Admin.</div>
            </div>
          )}

          <div className="verify-shield">🛡️</div>
          <div className="verify-title">Two-Factor Verification</div>
          <div className="verify-sub">A 6-digit code was sent to</div>
          <span className="verify-email-tag">{email}</span>

          {wrongOtp && (
            <div className="error-msg">⚠️ Incorrect code. Please try again.</div>
          )}

          <div className="otp-row">
            {otp.map((v, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                className={`otp-input${v ? " filled" : ""}`}
                maxLength={1}
                value={v}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKey(i, e)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button
            className="verify-btn"
            onClick={handleVerify}
            disabled={otp.join("").length < 6 || verifying}
          >
            <span className="btn-shimmer" />
            {verifying ? "Verifying…" : "✓ Verify & Access Dashboard"}
          </button>

          <div className="verify-timer">
            {timer > 0 ? `Resend code in 0:${String(timer).padStart(2, "0")}` : "Didn't receive the code?"}
          </div>
          <button className="verify-resend" disabled={timer > 0} onClick={handleResend}>
            Resend OTP
          </button>

          <div style={{ marginTop: 12, fontSize: 12, color: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)" }}>
            Demo OTP: <strong style={{ color: "#10b981" }}>123456</strong>
          </div>

          <button className="back-btn" onClick={onBack}>← Back to login</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Login Page ───────────────────────────────────────────────────────
export default function LoginPage({ onLogin }) {
  const [dark, setDark] = useState(true);
  const [mode, setMode] = useState("user");   // "secure" | "user" | "admin"
  const [form, setForm] = useState({ email: "", password: "", adminId: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [remember, setRemember] = useState(false);
  const [secureError, setSecureError] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const isAdmin = mode === "admin";
  const isSecure = mode === "secure";

  const handleSwitch = (m) => {
    setMode(m); setSuccess(false); setSecureError("");
    setForm({ email: "", password: "", adminId: "" });
  };

  const handleSubmit = () => {
    if (isSecure) {
      // Validate super-admin credentials
      if (form.email !== SUPER_ADMIN.email || form.password !== SUPER_ADMIN.password) {
        setSecureError("Invalid credentials. Access denied.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Redirect to /verification route instead of internal verification
        if (onLogin) {
          onLogin("secure");
        }
      }, 1200);
      return;
    }
    
    // For user and admin, call onLogin with role
    setLoading(true);
    setTimeout(() => { 
      setLoading(false); 
      setSuccess(true);
      if (onLogin) {
        setTimeout(() => onLogin(mode), 800);
      }
    }, 1500);
  };

  useEffect(() => { setSuccess(false); setSecureError(""); }, [mode]);

  const ThemeToggle = (
    <div className="theme-toggle">
      <button className="theme-btn theme-btn-dark" onClick={() => setDark(true)}>🌙 Dark</button>
      <button className="theme-btn theme-btn-light" onClick={() => setDark(false)}>☀️ Light</button>
    </div>
  );

  if (showVerify) {
    return (
      <>
        <style>{getStyles(dark)}</style>
        {ThemeToggle}
        <VerificationPage dark={dark} email={verifiedEmail} onBack={() => setShowVerify(false)} />
      </>
    );
  }

  return (
    <>
      <style>{getStyles(dark)}</style>
      <div className="login-root">

        {ThemeToggle}

        {floatingOrbs.map((orb, i) => (
          <div key={i} className="orb" style={{
            width: orb.size, height: orb.size,
            left: `${orb.x}%`, top: `${orb.y}%`,
            background: orb.color, animationDelay: `${orb.delay}s`,
          }} />
        ))}
        <div className="grid-overlay" />

        <div className="card-wrapper">
          <div className="card" style={{ position: "relative" }}>

            {/* Success overlay (user / admin) */}
            {success && (
              <div className="success-overlay">
                <div className="success-icon">{isAdmin ? "🛡️" : "✨"}</div>
                <div className="success-title">{isAdmin ? "Admin Access Granted" : "Welcome Back!"}</div>
                <div className="success-sub">{isAdmin ? "Redirecting to dashboard…" : "Logging you in…"}</div>
              </div>
            )}

            {/* ── 3-Tab bar ── */}
            <div className="tab-bar">
              <button className={`tab-btn ${mode === "secure" ? "active-secure" : ""}`} onClick={() => handleSwitch("secure")}>
                🔐 Secure
              </button>
              <button className={`tab-btn ${mode === "user" ? "active-user" : ""}`} onClick={() => handleSwitch("user")}>
                👤 User
              </button>
              <button className={`tab-btn ${mode === "admin" ? "active-admin" : ""}`} onClick={() => handleSwitch("admin")}>
                🛡️ Admin
              </button>
            </div>

            {/* SSL badge */}
            <div style={{ textAlign: "center" }}>
              <span className="secure-badge"><span className="dot-green" />256-bit SSL Encrypted</span>
            </div>

            {/* Header */}
            <div className="header" key={mode}>
              <div className={`icon-wrap ${isSecure ? "icon-wrap-secure" : isAdmin ? "icon-wrap-admin" : "icon-wrap-user"}`}>
                {isSecure ? "🔐" : isAdmin ? "🛡️" : "👤"}
              </div>
              <div className="login-title">
                {isSecure ? "Secure Login" : isAdmin ? "Admin Portal" : "Welcome Back"}
              </div>
              <div className="login-subtitle">
                {isSecure
                  ? "Super-admin restricted access"
                  : isAdmin
                    ? "Restricted access — authorised personnel only"
                    : "Sign in to continue your journey"}
              </div>
            </div>

            {/* Secure mode info callout */}
            {isSecure && (
              <div className="secure-callout">
                <span className="secure-callout-icon">🔒</span>
                <div className="secure-callout-text">
                  <div className="secure-callout-title">Single Super-Admin Access</div>
                  Only one authorised account may access this portal. Successful login redirects to OTP verification.
                </div>
              </div>
            )}

            {/* Error message for secure login */}
            {isSecure && secureError && (
              <div className="error-msg">⚠️ {secureError}</div>
            )}

            {/* Form fields */}
            <div key={mode + "form"}>
              {isAdmin && (
                <div className="form-group">
                  <label className="form-label">Admin ID</label>
                  <div className="input-wrap">
                    <span className="input-icon">🔑</span>
                    <input className="form-input admin-focus" placeholder="ADM-XXXXXXXX"
                      value={form.adminId} onChange={e => setForm({ ...form, adminId: e.target.value })} />
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    className={`form-input ${isAdmin ? "admin-focus" : ""} ${isSecure ? "secure-focus" : ""}`}
                    type="email"
                    placeholder={isSecure ? "superadmin@secure.com" : isAdmin ? "admin@company.com" : "you@example.com"}
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setSecureError(""); }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    className={`form-input ${isAdmin ? "admin-focus" : ""} ${isSecure ? "secure-focus" : ""}`}
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setSecureError(""); }}
                  />
                </div>
                {isAdmin && <StrengthBar password={form.password} />}
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="extras-row">
              <label className="remember-label">
                <input type="checkbox" className="remember-check" checked={remember} onChange={() => setRemember(!remember)} />
                Remember me
              </label>
              <span className={`forgot-link ${isAdmin ? "forgot-link-admin" : ""} ${isSecure ? "forgot-link-secure" : ""}`}>
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <button
              className={`submit-btn ${isAdmin ? "submit-btn-admin" : isSecure ? "submit-btn-secure" : "submit-btn-user"}`}
              onClick={handleSubmit} disabled={loading}
            >
              <span className="btn-shimmer" />
              {loading
                ? "Authenticating…"
                : isSecure ? "🔐 Proceed to Verification →"
                : isAdmin ? "🛡️ Access Admin Panel"
                : "Sign In →"}
            </button>

            {/* Social (user only) */}
            {!isAdmin && !isSecure && (
              <>
                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-text">or continue with</span>
                  <div className="divider-line" />
                </div>
                <div className="social-row">
                  <button className="social-btn"><span>G</span> Google</button>
                  <button className="social-btn"><span>⌘</span> Apple</button>
                  <button className="social-btn"><span>in</span> LinkedIn</button>
                </div>
              </>
            )}

            {/* Secure mode hint */}
            {isSecure && (
              <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)" }}>
                Demo: <strong style={{ color: "#10b981" }}>superadmin@secure.com</strong> / <strong style={{ color: "#10b981" }}>Admin@1234</strong>
              </div>
            )}

            {/* Footer */}
            <div className="card-footer">
              {isAdmin
                ? <>Need access? <span className="footer-link footer-link-admin">Request permissions →</span></>
                : isSecure
                  ? <>Authorised by <span style={{ color: "#10b981", fontWeight: 500 }}>Security Team</span></>
                  : <>Don't have an account? <span className="footer-link">Create one →</span></>
              }
            </div>

          </div>
        </div>
      </div>
    </>
  );
}