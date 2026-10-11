import { Link, useNavigate } from "react-router";
import { register } from "../services/authService";
import { useState } from "react";

function Register() {

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const navigate = useNavigate();

  async function handleRegistration(e) {
    e.preventDefault()

    if(loading) return

    setFormErrors([])
    setLoading(true)

    // returns a FormData object, not a normal JS obj.
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {

      await register(data); 
      // replace current history and redirect. 
      navigate('/',{replace: true}); 

    } catch (err) {

      
      if(err.response) {   // Server responded with an HTTP error.
        const status = err.response?.status;

        if (status === 400) {
          const validationErrors = err.response?.data?.errors;

          if (Array.isArray(validationErrors)) {
            setFormErrors(validationErrors.map((e) => `${e.message}`));
          } else {
            setFormErrors(["Please check your registration details."]);
          }
        } else if (status === 409) {  // name/email already in use

          setFormErrors([err.response?.data?.message]);
        } else if (status === 500) {
          setFormErrors(["Server error. Try again later."]);
          console.error(err);
        } else {
          setFormErrors([
            err.response?.data?.message ||
              "Registration failed. Please try again.",
          ]);
        }
      }else if(err.request){   // Request was sent, but no response was received.
        setFormErrors(["No reponse from the server."]);
      }else{        // Error occurred while setting up the request.
        setFormErrors(['Something went wrong. Unable to send request.'])
      }
    }finally{
      setLoading(false);
    }
  }

  // console.log(formErrors);

  return (
    <div className="container box-border  text-white bg-black h-screen w-screen flex flex-col justify-center gap-y-4 p-4 md:flex-row md:gap-10">
      <div className="brandSection  text-[#f8a50b]  font-mono tracking-tight box-border p-2 px-4 font-bold text-3xl border-4 border-zinc-600 rounded-lg ">
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
            required
            minLength={3}
            maxLength={20}
            className="border-2 border-zinc-400 rounded-md h-10 w-full box-border py-5 px-3 mb-3 "
          />
          <div className="email mb-2 pl-1 text-zinc-200 ">Email</div>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            required
            maxLength={254}
            className="border-2 border-zinc-400 rounded-md h-10 w-full box-border py-5 px-3 mb-3 "
          />
          <div className="pswd mb-2 pl-1 text-zinc-200 ">Password</div>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            minLength={8}
            maxLength={64}
            className="border-2 border-zinc-400 rounded-md h-10 w-full box-border py-5 px-3 mb-2 "
          />
          <div className="pswdFormat font-light text-sm/snug text-zinc-400 ">
            At least 8 characters with uppercase, lowercase, and special
            characters
          </div>


          {
            formErrors.length > 0 && (
              <div className="formErrors text-[#ff4d00f3] pt-2 text-sm  ">
                {formErrors.map(err => (
                  <p className=" pb-1 " key={err} >{err}</p>
                ))}
              </div>
            )
          }

          <button
            type="submit"
            className=" rounded-md h-12 w-full  mt-5 mb-2 border-amber-400   bg-white text-black font-medium text-[20px] hover:cursor-pointer hover:bg-zinc-50 hover:border-3 hover:disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:border-none "
            disabled={loading}
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
