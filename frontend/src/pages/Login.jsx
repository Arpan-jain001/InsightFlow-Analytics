import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth.js";
import { clearPendingInvitation, getPendingInvitation, setPendingInvitation } from "../lib/pendingInvitation.js";
import { AuthShell, Toast, LoaderOverlay, SuccessOverlay, ErrorBanner, Field, GoogleButton, Divider } from "../components/auth/AuthKit";
import { ButtonSpinner } from "../components/ui/InsightLoader";

const BASE_API_URL = import.meta.env.VITE_BACKEND_API_URL;
const LOGIN_TIMEOUT_MS = 30_000;

/* The server decides the role. The client only follows what the server returns. */
const getRoleRedirect = (role) => {
  if (role === "SUPER_ADMIN") return "/admin-dashboard";
  if (role === "ORGANIZER") return "/organizer-dashboard";
  return "/dashboard";
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Signing you in...");
  const [rememberMe, setRememberMe] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, authenticate } = useAuth();
  const abortControllerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const isMountedRef = useRef(true);
  const inviteAcceptInFlightRef = useRef(false);
  const inviteToken = useMemo(() => {
    const tokenFromQuery = new URLSearchParams(location.search).get("invite");
    return tokenFromQuery || getPendingInvitation();
  }, [location.search]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
      clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const tokenFromQuery = new URLSearchParams(location.search).get("invite");
    if (tokenFromQuery) {
      setPendingInvitation(tokenFromQuery);
    }
  }, [location.search]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isLoading && !showSuccess) {
        const t = setTimeout(() => {
          if (isMountedRef.current && isLoading && !showSuccess) {
            abortControllerRef.current?.abort();
            setIsLoading(false);
            fireToast("info", "Login interrupted. Please try again.");
          }
        }, 300);
        return () => clearTimeout(t);
      }
    };
    const handlePopState = () => {
      if (isLoading && !showSuccess) { abortControllerRef.current?.abort(); setIsLoading(false); }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", () => abortControllerRef.current?.abort());
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isLoading, showSuccess]);

  useEffect(() => {
    if (!user) return;
    if (inviteToken) return;
    navigate(getRoleRedirect(user.role), { replace: true });
  }, [user, inviteToken, navigate]);

  const fireToast = useCallback((type, message) => {
    if (!isMountedRef.current) return;
    setToast({ type, message });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => { if (isMountedRef.current) setToast(null); }, 3500);
  }, []);

  const resetLoading = useCallback(() => { if (isMountedRef.current) setIsLoading(false); }, []);

  const handleLoaderTimeout = useCallback(() => {
    abortControllerRef.current?.abort();
    resetLoading();
    fireToast("error", "⏱ Request timed out. Check your connection.");
  }, [resetLoading, fireToast]);

  const acceptPendingInvitation = useCallback(async () => {
    if (!inviteToken) return;

    try {
      await axios.post(
        `${BASE_API_URL}/api/workspaces/invitations/accept`,
        { token: inviteToken },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      clearPendingInvitation();
      fireToast("success", "Invitation accepted successfully.");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Invitation could not be accepted automatically.";
      if (status && status < 500) {
        clearPendingInvitation();
      }
      fireToast("info", msg);
    }
  }, [inviteToken, fireToast]);

  const successFlow = useCallback(async (userData) => {
    if (!isMountedRef.current) return;
    if (inviteToken) {
      inviteAcceptInFlightRef.current = true;
      await acceptPendingInvitation();
    }
    setIsLoading(false);
    setShowSuccess(true);
    fireToast("success", "Welcome back! Login successful.");
    await new Promise((r) => setTimeout(r, 500));
    if (!isMountedRef.current) return;
    setShowSuccess(false);
    navigate(getRoleRedirect(userData.role), { replace: true });
  }, [inviteToken, navigate, fireToast, acceptPendingInvitation]);

  useEffect(() => {
    if (!user || !inviteToken || inviteAcceptInFlightRef.current) return;

    inviteAcceptInFlightRef.current = true;
    setIsLoading(true);
    setLoadingText("Accepting your invitation...");

    acceptPendingInvitation().finally(() => {
      if (!isMountedRef.current) return;
      setIsLoading(false);
      navigate(getRoleRedirect(user.role), { replace: true });
    });
  }, [user, inviteToken, acceptPendingInvitation, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || showSuccess) return;
    setError("");
    setIsLoading(true);
    setLoadingText("Signing you in...");
    abortControllerRef.current = new AbortController();
    try {
      const { data } = await axios.post(`${BASE_API_URL}/api/auth/login`,
        { email: email.trim().toLowerCase(), password },
        { headers: { "Content-Type": "application/json" }, signal: abortControllerRef.current.signal, timeout: LOGIN_TIMEOUT_MS }
      );
      if (data.success) {
        authenticate({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        await successFlow(data.user);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      if (axios.isCancel(err) || err.name === "AbortError" || err.name === "CanceledError") { resetLoading(); return; }
      if (err.code === "ECONNABORTED" || err.code === "ERR_CANCELED") { resetLoading(); fireToast("error", "⏱ Request timed out."); return; }
      const msg = err.response?.data?.message;
      if (msg === "EMAIL_NOT_VERIFIED") { fireToast("error", "⚠️ Please verify your email first."); navigate("/verify-email", { state: { email } }); }
      else { const m = msg || "Login failed. Please try again."; setError(m); fireToast("error", m); }
    } finally {
      if (isMountedRef.current && !showSuccess) setIsLoading(false);
    }
  };

  const handleGoogleError = useCallback(() => { resetLoading(); fireToast("error", "Google login cancelled."); }, [resetLoading, fireToast]);

  const handleGoogleSuccess = useCallback(async (tokenResponse) => {
    if (!isMountedRef.current || showSuccess) return;
    abortControllerRef.current = new AbortController();
    try {
      // ✅ Pass redirectUri for mobile redirect flow
      const isMobileFlow = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      const payload = {
        code: tokenResponse.code,
        ...(isMobileFlow ? { redirectUri: window.location.origin + "/login" } : {}),
      };
      const { data } = await axios.post(`${BASE_API_URL}/api/auth/google`,
        payload,
        { 
          headers: { "Content-Type": "application/json" },
          signal: abortControllerRef.current.signal, 
          timeout: LOGIN_TIMEOUT_MS 
        }
      );
      if (data.success) {
        authenticate({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        await successFlow(data.user);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      if (axios.isCancel(err) || err.name === "AbortError" || err.name === "CanceledError") { resetLoading(); return; }
      const msg = err.response?.data?.message || "Google login failed.";
      setError(msg); fireToast("error", msg); resetLoading();
    }
  }, [showSuccess, authenticate, successFlow, resetLoading, fireToast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      setIsLoading(true);
      setLoadingText("Completing Google login...");
      handleGoogleSuccess({ code });
      window.history.replaceState({}, document.title, "/login");
    }
  }, [handleGoogleSuccess]);

  // ✅ Detect mobile — use redirect flow to avoid popup blocking
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  const googleLogin = useGoogleLogin({
    onSuccess:  handleGoogleSuccess,
    onError:    handleGoogleError,
    flow:       "auth-code",
    ux_mode:    isMobile ? "redirect" : "popup",
    redirect_uri: isMobile ? window.location.origin + "/login" : undefined,
  });

  const handleGoogleClick = useCallback(() => {
    if (isLoading || showSuccess) return;
    setIsLoading(true);
    setLoadingText("Connecting to Google...");
    googleLogin();
  }, [isLoading, showSuccess, googleLogin]);

  const isDisabled = isLoading || showSuccess;

  return (
    <>
      <AnimatePresence>{isLoading && !showSuccess && <LoaderOverlay text={loadingText} timeoutSec={30} onTimeout={handleLoaderTimeout} />}</AnimatePresence>
      <AnimatePresence>{showSuccess && <SuccessOverlay />}</AnimatePresence>
      <AnimatePresence>{toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}</AnimatePresence>

      <AuthShell headline={<>Welcome back to <span className="text-coral-grad">InsightFlow</span></>} sub="Sign in to see what your visitors are doing, what the AI found, and who is likely to come back.">
        <div className="mb-8">
          <h1 className="text-[34px] font-extrabold leading-tight text-ink">Sign in</h1>
          <p className="mt-2 text-[15px] text-muted">Use your email and password. We take you to the right dashboard automatically.</p>
        </div>

        {inviteToken && <div className="mb-5 rounded-2xl border border-coral/30 bg-coral-soft px-4 py-3 text-[13.5px] font-semibold text-coral-dark">You have a workspace invitation. Sign in to accept it.</div>}
        <ErrorBanner error={error} />

        <GoogleButton onClick={handleGoogleClick} disabled={isDisabled} />
        <Divider />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
          <Field label="Email" icon={Mail} type="email" name="email" placeholder="you@company.com" autoComplete="email" required disabled={isDisabled}
            value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
          <Field label="Password" icon={Lock} type="password" reveal name="password" placeholder="Your password" autoComplete="current-password" required disabled={isDisabled}
            value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} />
          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] font-semibold text-ink-2">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={isDisabled} className="h-4 w-4 rounded border-line accent-[#f67963]" />Remember me
            </label>
            <Link to="/forgot-password" className="text-[13.5px] font-bold text-coral-dark hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={isDisabled || !email || !password} className="btn btn-dark w-full !rounded-2xl !py-4 !text-[15px] disabled:opacity-60">
            {isLoading ? <><ButtonSpinner />Signing in…</> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-[14px] text-muted">New to InsightFlow?{" "}
          <Link to={inviteToken ? `/signup?invite=${inviteToken}` : "/signup"} className="font-extrabold text-coral-dark hover:underline">Create an account</Link>
        </p>
      </AuthShell>
    </>
  );
};

export default Login;
