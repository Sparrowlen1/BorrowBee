import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Timer,
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
} from 'lucide-react';
import BeeLogo from '../../components/BeeLogo';
import { useToast } from '../../context/ToastContext';
import { useDeveloperAuth } from '../../auth/DeveloperAuthContext';
import { PASSCODE } from '../../utils/constants';

const LOCK_SECONDS = 300; // 5:00

// Shared class strings — keeps JSX readable and consistent.
const clsInput =
  'w-full h-12 rounded-xl border border-white/45 bg-white/5 text-white px-3.5 text-[15px] placeholder:text-[#8DA9A3]';
const clsLabel = 'block text-[13px] font-semibold mb-1.5';
const clsBtn =
  'min-h-12 rounded-2xl bg-[#FFB300] text-[#0F172A] font-extrabold text-[15px] px-5 inline-flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition';
const clsLink =
  'text-[#7FF0DC] font-semibold bg-transparent border-0 p-0 text-[13px] cursor-pointer inline-flex items-center disabled:text-[#A9C4BE] disabled:cursor-default';

export default function DeveloperLoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { login, isAuthenticated } = useDeveloperAuth();

  // Already signed in? Bounce to the dashboard.
  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  // ---- Form state ----
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ---- Lockout ----
  const [fails, setFails] = useState(0);
  const [lockedFor, setLockedFor] = useState(0);

  const lockTimerRef = useRef(null);
  const passwordRef = useRef(null);

  // Lockout ticker
  useEffect(() => {
    if (lockedFor <= 0) return;
    clearInterval(lockTimerRef.current);
    lockTimerRef.current = setInterval(() => {
      setLockedFor((s) => {
        if (s <= 1) {
          clearInterval(lockTimerRef.current);
          setFails(0);
          setError('');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(lockTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedFor > 0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting || lockedFor > 0) return;

    const em = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(em)) {
      setError('Enter the email you use for BorrowBee.');
      return;
    }
    if (!password) {
      setError('Enter your access code.');
      return;
    }

    setError('');

    // Single-step auth: password is compared against PASSCODE.
    // When the backend is ready, this becomes:
    //   await login({ email, password });
    // and the context will POST to /auth/dev/login instead of comparing locally.
    const ok = login({ passcode: password, email: em, remember });

    if (!ok) {
      const nextFails = fails + 1;
      setFails(nextFails);
      setPassword('');

      if (nextFails >= 3) {
        setError('');
        setLockedFor(LOCK_SECONDS);
        toast('Too many wrong codes. Locked for 5:00.');
      } else {
        const left = 3 - nextFails;
        setError(
          `That code is not right. ${left} attempt${left === 1 ? '' : 's'} left.`
        );
      }
      setTimeout(() => passwordRef.current?.focus(), 20);
      return;
    }

    setSubmitting(true);
    toast('Signed in.');
    navigate('/admin/dashboard', { replace: true });
  };

  const fmtLock = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <main className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] min-h-screen bg-[#04120F] text-[#F0FDF4] font-sans">
      {/* ============ Brand panel ============ */}
      <div
        className="relative overflow-hidden p-7 md:p-12 flex flex-col justify-between gap-8"
        style={{
          background: `
            radial-gradient(circle at 25% 20%, rgba(0,191,165,0.5), transparent 55%),
            radial-gradient(circle at 80% 85%, rgba(255,179,0,0.25), transparent 50%),
            #004D40
          `,
        }}
      >
        <div className="absolute -right-24 -bottom-16 w-[480px] h-[480px] opacity-10 pointer-events-none">
          <BeeLogo size={480} />
        </div>

        <div className="flex items-center gap-2.5 font-extrabold text-[22px]">
          <BeeLogo size={40} />
          BorrowBee
        </div>

        <div>
          <div className="flex items-center gap-2.5 text-xs font-bold tracking-[0.08em] uppercase text-[#CFE8DC]">
            <span className="shrink-0 w-[22px] h-[24px] bg-[#FFB300] grid place-items-center text-[#0F172A] [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]">
              <Lock size={12} strokeWidth={2.5} />
            </span>
            Lender console
          </div>
          <h1 className="mt-3.5 text-[clamp(2.1rem,4.4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] max-w-[520px]">
            Run BorrowBee <span className="text-[#FFB300]">with confidence.</span>
          </h1>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          {[
            { Icon: KeyRound, text: 'Private access code, rotated by the lender' },
            { Icon: Timer, text: 'Locks itself after 5 minutes of no activity' },
            { Icon: ShieldCheck, text: 'Every approval and payment is recorded' },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="shrink-0 w-[30px] h-[33px] bg-[#FFB300] grid place-items-center text-[#0F172A] [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]">
                <Icon size={13} strokeWidth={2.4} />
              </span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ============ Form panel ============ */}
      <div className="flex items-center justify-center p-7">
        <div className="w-full max-w-[430px] flex flex-col gap-3.5">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
            <div>
              <span className="inline-block text-xs font-extrabold bg-[#FFB300] text-[#0F172A] px-2.5 py-1 rounded-full">
                Private area
              </span>
              <h1 className="mt-2.5 text-[30px] font-extrabold">Developer sign in</h1>
              <p className="mt-1 text-[#A9C4BE] text-[13px] leading-relaxed">
                For the BorrowBee lender only. Borrowers sign in on their own page.
              </p>
            </div>

            <div className="flex gap-1.5">
              <span className="flex-1 h-1.5 rounded bg-[#00BFA5]" />
            </div>

            <div>
              <label htmlFor="email" className={clsLabel}>Email</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8DA9A3] pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@borrowbee.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${clsInput} pl-10`}
                  disabled={lockedFor > 0}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={clsLabel}>Access code</label>
              <div className="relative">
                <input
                  id="password"
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your access code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${clsInput} pr-[74px]`}
                  disabled={lockedFor > 0}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide access code' : 'Show access code'}
                  className="absolute right-1.5 top-1.5 h-9 bg-transparent text-[#7FF0DC] font-bold text-[13px] px-2.5 inline-flex items-center gap-1"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2.5 text-[13px]">
              <label className="flex items-center gap-2 m-0">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-[18px] h-[18px] accent-[#00BFA5]"
                />
                Trust this device for 7 days
              </label>
              <button
                type="button"
                onClick={() =>
                  toast('Contact the lender directly to reset your access code.')
                }
                className={clsLink}
              >
                Forgot access code?
              </button>
            </div>

            <p className="text-[#FCA5A5] text-[13px] font-semibold min-h-[18px]" role="alert">
              {error}
            </p>

            <button
              type="submit"
              disabled={submitting || lockedFor > 0}
              className={clsBtn}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            {/* Dev-only hint showing the current access code */}
            {import.meta.env.DEV && (
              <p className="text-[#A9C4BE] text-[13px]">
                Dev access code: <b className="text-white">{PASSCODE}</b>{' '}
                (remove this hint in production).
              </p>
            )}

            {lockedFor > 0 && (
              <div
                role="alert"
                className="bg-[rgba(255,179,0,0.12)] border border-[rgba(255,179,0,0.4)] rounded-xl px-3 py-2.5 text-[13px]"
              >
                Too many wrong codes. Sign-in is locked for {fmtLock(lockedFor)}.
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}