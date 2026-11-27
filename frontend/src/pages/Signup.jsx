import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, User, Building2, UserCircle, Check } from "lucide-react";
import axios from "axios";
import { getPendingInvitation, setPendingInvitation } from "../lib/pendingInvitation.js";
import { AuthShell, Toast, LoaderOverlay, SuccessOverlay, ErrorBanner, Field, PasswordStrength } from "../components/auth/AuthKit";
import { ButtonSpinner } from "../components/ui/InsightLoader";

const BASE_API_URL = import.meta.env.VITE_BACKEND_API_URL;
const SIGNUP_TIMEOUT_MS = 30_000;

const ACCOUNT_TYPES = [
  { value: "USER", label: "Personal", icon: UserCircle, desc: "Individual use, or a company invited me", hint: "View analytics of workspaces you are invited to" },
  { value: "ORGANIZER", label: "Team / Org", icon: Building2, desc: "I represent a company", hint: "Create workspaces, add projects, get API keys" },
];

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", companyName: "", email: "", password: "",
  });
  const [role, setRole] = useState("USER");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingText, setLoadingText] = useState("Creating your account...");
  const [focusedField, setFocusedField] = useState(null);
  const [inviteToken] = useState(() => new URLSearchParams(window.location.search).get("invite") || getPendingInvitation());

  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
      clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const tokenFromQuery = new URLSearchParams(window.location.search).get("invite");
    if (tokenFromQuery) {
      setPendingInvitation(tokenFromQuery);
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isSubmitting && !showSuccess) {
        const t = setTimeout(() => {
          if (isMountedRef.current && isSubmitting && !showSuccess) {
            abortControllerRef.current?.abort();
            setIsSubmitting(false);
            fireToast("info", "Signup interrupted. Please try again.");
          }
        }, 300);
        return () => clearTimeout(t);
      }
    };
    const handlePopState = () => {
      if (isSubmitting && !showSuccess) { abortControllerRef.current?.abort(); setIsSubmitting(false); }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", () => abortControllerRef.current?.abort());
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isSubmitting, showSuccess]);

  const fireToast = useCallback((type, message) => {
    if (!isMountedRef.current) return;
    setToast({ type, message });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => { if (isMountedRef.current) setToast(null); }, 3500);
  }, []);

  const resetLoading = useCallback(() => { if (isMountedRef.current) setIsSubmitting(false); }, []);

  const handleLoaderTimeout = useCallback(() => {
    abortControllerRef.current?.abort();
    resetLoading();
    fireToast("error", "⏱ Request timed out. Check your connection.");
  }, [resetLoading, fireToast]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || showSuccess) return;

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please enter your full name.");
      fireToast("error", "First and last name are required.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      fireToast("error", "Password must be at least 8 characters.");
      return;
    }
    if (role === "ORGANIZER" && !formData.companyName.trim()) {
      setError("Company name is required for organizers.");
      fireToast("error", "Please enter your company name.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setLoadingText("Creating your account...");
    abortControllerRef.current = new AbortController();

    try {
      const payload = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role,
        companyName: formData.companyName.trim() || null,
      };

      const { data } = await axios.post(`${BASE_API_URL}/api/auth/register`, payload, {
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        timeout: SIGNUP_TIMEOUT_MS,
      });

      if (data.success) {
        if (!isMountedRef.current) return;
        setIsSubmitting(false);
        setShowSuccess(true);
        fireToast("success", "Account created successfully! 🎉");

        if (data.accessToken) {
          // ✅ Sirf token save karo — user data DB se aayega
          localStorage.setItem("accessToken", data.accessToken);
          if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("isLoggedIn", "true");
        }

        setTimeout(() => {
          if (!isMountedRef.current) return;
          setShowSuccess(false);
          navigate("/verify-email", { state: { email: formData.email } });
        }, 1500);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      if (axios.isCancel(err) || err.name === "AbortError" || err.name === "CanceledError") { resetLoading(); return; }
      if (err.code === "ECONNABORTED" || err.code === "ERR_CANCELED") {
        resetLoading(); fireToast("error", "⏱ Request timed out."); return;
      }
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      fireToast("error", msg);
      resetLoading();
    }
  };

  const isDisabled = isSubmitting || showSuccess;
  const org = role === "ORGANIZER";

  return (
    <>
      <AnimatePresence>{isSubmitting && !showSuccess && <LoaderOverlay text={loadingText} timeoutSec={30} onTimeout={handleLoaderTimeout} />}</AnimatePresence>
      <AnimatePresence>{showSuccess && <SuccessOverlay title="Account created!" text="Taking you to email verification…" />}</AnimatePresence>
      <AnimatePresence>{toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}</AnimatePresence>

      <AuthShell headline={<>Start tracking what <span className="text-coral-grad">really</span> happens</>} sub="Create a free account. Organizations add projects and get a tracking script in minutes. Teammates join by invitation.">
        <div className="mb-7">
          <h1 className="text-[34px] font-extrabold leading-tight text-ink">Create your account</h1>
          <p className="mt-2 text-[15px] text-muted">Free to register. It takes less than a minute.</p>
        </div>

        {inviteToken && <div className="mb-5 rounded-2xl border border-coral/30 bg-coral-soft px-4 py-3 text-[13.5px] font-semibold text-coral-dark">You were invited to a workspace. Create your account (use the invited email) to accept it.</div>}
        <ErrorBanner error={error} />

        <p className="mb-2 text-[13px] font-bold text-ink-2">I am signing up as</p>
        <div className="grid grid-cols-2 gap-3">
          {ACCOUNT_TYPES.map(({ value, label, icon: Icon, desc }) => (
            <button key={value} type="button" disabled={isDisabled} onClick={() => setRole(value)}
              className={`relative rounded-2xl border p-4 text-left transition-all ${role === value ? "border-coral bg-coral-soft shadow-[0_16px_34px_-18px_rgba(246,121,99,.8)]" : "border-line bg-white hover:border-slate-300"}`}>
              {role === value && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-coral text-white"><Check className="h-3 w-3" /></span>}
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${role === value ? "bg-coral text-white" : "bg-slate-100 text-ink-2"}`}><Icon className="h-[18px] w-[18px]" /></span>
              <p className="mt-2.5 text-[14.5px] font-extrabold text-ink">{label}</p><p className="mt-0.5 text-[12px] leading-4 text-muted">{desc}</p>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-muted">{ACCOUNT_TYPES.find((a) => a.value === role)?.hint}.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" icon={User} name="firstName" placeholder="Aarav" autoComplete="given-name" required disabled={isDisabled} value={formData.firstName} onChange={handleChange} />
            <Field label="Last name" name="lastName" placeholder="Sharma" autoComplete="family-name" required disabled={isDisabled} value={formData.lastName} onChange={handleChange} />
          </div>
          <AnimatePresence initial={false}>
            <motion.div key={role} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <Field label="Company name" hint={org ? "Required" : "Optional"} icon={Building2} name="companyName" placeholder="Your company" autoComplete="organization" required={org} disabled={isDisabled} value={formData.companyName} onChange={handleChange} />
            </motion.div>
          </AnimatePresence>
          <Field label="Email" icon={Mail} type="email" name="email" placeholder="you@company.com" autoComplete="email" required disabled={isDisabled} value={formData.email} onChange={handleChange} />
          <div>
            <Field label="Password" icon={Lock} type="password" reveal name="password" placeholder="At least 8 characters" autoComplete="new-password" required disabled={isDisabled} value={formData.password} onChange={handleChange} />
            <PasswordStrength password={formData.password} />
          </div>
          <button type="submit" disabled={isDisabled} className="btn btn-dark w-full !rounded-2xl !py-4 !text-[15px] disabled:opacity-60">
            {isSubmitting ? <><ButtonSpinner />Creating account…</> : <>Create account <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="mt-7 text-center text-[14px] text-muted">Already have an account?{" "}
          <Link to={inviteToken ? `/login?invite=${inviteToken}` : "/login"} className="font-extrabold text-coral-dark hover:underline">Sign in</Link>
        </p>
      </AuthShell>
    </>
  );
};

export default Signup;
