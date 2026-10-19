import { Link, useNavigate, useLocation, Navigate } from "react-router";
import { login } from "../services/authService";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "../hooks/authHook";

function Login() {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to intended protected page or /
  const redirectPath = location.state?.from?.pathname || "/";

  // Avoid flashing login form while checking authentication during the first mount. Manually typing url remounts the app.
  // status restes to loading.
  if (user.status === "loading") {
    return (
      <div className="container box-border text-white bg-black min-h-dvh w-full flex items-center justify-center">
        <p className="animate-pulse text-zinc-400">Loading...</p>
      </div>
    );
  }

  // For logged in users accessing /login url.
  if (user.status === "authenticated") {
    return <Navigate to={redirectPath} replace />;
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (loading) return;

    setFormErrors([]);
    const formData = new FormData(e.target);
    const { identifier, password } = Object.fromEntries(formData.entries());
    const trimmedIdentifier = identifier?.trim();

    if (!trimmedIdentifier || !password) {
      setFormErrors(["Please enter your username/email and password."]);
      return;
    }

    setLoading(true);

    try {
      const response = await login({ identifier: trimmedIdentifier, password });
      const userData = { status: "authenticated", ...response.data?.user };
      setUser(userData);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      if (err.response) {
        // Server responded with an HTTP error.
        const status = err.response.status;
        const message = err.response.data?.message;

        if (status === 400) {
          const validationErrors = err.response.data?.errors;

          if (Array.isArray(validationErrors)) {
            setFormErrors(validationErrors.map((e) => e.message));
          } else {
            setFormErrors(["Please check your login details."]);
          }
        } else if (status === 401) {
          setFormErrors([message || "Invalid credentials."]);
        } else if (status >= 500) {
          setFormErrors(["Server error. Please try again later."]);
          console.error(err);
        } else {
          setFormErrors([message || "Login failed. Please try again."]);
        }
      } else if (err.request) {
        // Request was sent, but no response was received.
        setFormErrors(["No response from the server. Check your connection."]);
      } else {
        // Error occurred while setting up the request.
        setFormErrors(["Something went wrong. Please try again."]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container box-border text-white bg-black min-h-dvh w-full flex flex-col justify-center gap-y-4 p-4 md:flex-row md:gap-10">
      <div className="brandSection text-[#f8a50b] flex justify-between items-center md:flex-col font-mono tracking-tight box-border p-2 px-4 font-bold text-3xl border-4 border-zinc-600 rounded-lg">
        <div className="brand">TrackEx</div>
        <a
          href="https://github.com/KSAdhikari008/ZTrackEx"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
          className="text-white hover:text-amber-400 transition-colors"
        >
          <FaGithub className="md:mb-2 text-2xl md:text-3xl" />
        </a>
      </div>
      <div className="formContainer box-border border-4 border-zinc-600 rounded-lg p-5">
        <div className="headings">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Your finances, organized.
          </h1>
          <p className="mt-1 text-md leading-tight text-zinc-400">
            Track expenses and keep your spending in check.
          </p>
        </div>

        <form onSubmit={handleLogin} className="form my-5">
          <label
            className="identifier inline-block mb-2 pl-1 text-zinc-200"
            htmlFor="identifier"
          >
            Username or Email
          </label>
          <input
            type="text"
            name="identifier"
            id="identifier"
            placeholder="john@example.com or johndoe"
            autoComplete="username"
            required
            maxLength={254}
            className="border-2 border-zinc-400 rounded-md h-10 w-full box-border py-5 px-3 mb-3"
          />

          <label
            className="pswd inline-block mb-2 pl-1 text-zinc-200"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            maxLength={128}
            className="border-2 border-zinc-400 rounded-md h-10 w-full box-border py-5 px-3 mb-3"
          />

          {formErrors.length > 0 && (
            <div className="formErrors text-[#ff4d00f3] pt-2 text-sm">
              {formErrors.map((err, i) => (
                <p className="pb-1" key={i}>
                  {err}
                </p>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="rounded-md h-12 w-full mt-5 mb-2 border-amber-400 bg-white text-black font-medium text-[20px] hover:cursor-pointer hover:bg-zinc-50 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:border-none"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="registerOption text-center text-zinc-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400">
            Sign up
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

export default Login;
