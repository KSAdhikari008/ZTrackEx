import { Link } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-4 text-white">
      <div className="text-center">
        <p className="text-lg font-medium tracking-wider text-amber-400">
          PAGE NOT FOUND
        </p>

        <h1 className="mt-4 text-8xl font-bold tracking-tight text-zinc-100">
          404
        </h1>

        <p className="mt-2 text-lg font-medium text-zinc-300">
          Lost your way?
        </p>

        <p className="mt-6 text-base leading-relaxed text-zinc-400">
          This page doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-400 transition-color
          s hover:text-amber-300"
        >
          <FaArrowLeft className="text-xs" aria-hidden="true" />
          Back to TrackEx
        </Link>
      </div>
    </div>
  );
}

export default NotFound;