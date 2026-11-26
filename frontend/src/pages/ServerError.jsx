import { Link, useLocation } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

function ServerError() {
  const location = useLocation();
  const isRateLimited = location.state?.reason === "rate-limited";

  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-4 text-white">
      <div className="text-center">
        <p className="text-lg font-medium tracking-wider text-amber-400">
          {isRateLimited ? "TOO MANY REQUESTS" : "SERVER ERROR"}
        </p>

        <h1 className="mt-4 text-8xl font-bold tracking-tight text-zinc-100">
          {isRateLimited ? "429" : "500"}
        </h1>

        <p className="mt-2 text-lg font-medium text-zinc-300">
          {isRateLimited ? "Try again in a moment." : "Something went wrong."}
        </p>

        <p className="mt-6 text-base leading-relaxed text-zinc-400">
          {isRateLimited
            ? "You've made too many requests. Please wait before trying again."
            : "The server couldn't complete your request. Please try again later."}
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-400 transition-colors hover:text-amber-300"
        >
          <FaArrowLeft className="text-xs" aria-hidden="true" />
          Back to TrackEx
        </Link>
      </div>
    </div>
  );
}

export default ServerError;