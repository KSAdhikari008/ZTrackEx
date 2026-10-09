import { Link } from "react-router";

function Register() {
  function handleRegistration(e) {
    e.preventDefault();
    console.log("somesome");
  }

  return (
    <div className="container box-border  text-white bg-black h-screen w-screen flex flex-col justify-center gap-y-4 p-4 md:flex-row md:gap-10">
      <div className="brandSection  text-[#f8a50b]  font-mono tracking-tight box-border p-2 pl-4 font-bold text-3xl border-4 border-zinc-600 rounded-lg ">
        <div className="brand">TrackEx</div>
      </div>
      <div className="fromContainer box-border border-4 border-zinc-600 rounded-lg p-5 ">
        <div className="headings ">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100  ">
            Your finances, organized.
          </h1>
          <p className="mt-1 text-md leading-tight text-zinc-400">
            Track expenses and keep your spending in check.
          </p>
        </div>
        <form onSubmit={handleRegistration} className="form my-5 ">
          <div className="fullname mb-2 pl-1 text-zinc-200 ">Username</div>
          <input
            type="text"
            name="username"
            placeholder="John Doe"
            className="border-2 border-zinc-400 rounded-md h-10 w-full box-border py-5 px-3 mb-3 "
          />
          <div className="email mb-2 pl-1 text-zinc-200 ">Email</div>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            className="border-2 border-zinc-400 rounded-md h-10 w-full box-border py-5 px-3 mb-3 "
          />
          <div className="pswd mb-2 pl-1 text-zinc-200 ">Password</div>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="border-2 border-zinc-400 rounded-md h-10 w-full box-border py-5 px-3 mb-2 "
          />
          <div className="pswdFormat font-light text-sm/snug text-zinc-400 ">
            At least 8 characters with uppercase, lowercase, and special
            characters
          </div>

          <button
            type="submit"
            className=" rounded-md h-12 w-full  mt-5 mb-2 border-amber-400   bg-white text-black font-medium text-[20px] hover:cursor-pointer hover:bg-zinc-50 hover:border-3 "
          >
            Create account
          </button>
        </form>
        <div className="loginOption text-center text-zinc-300 ">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Log in
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

export default Register;
