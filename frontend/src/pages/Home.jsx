import { Link } from "react-router";

function Home() {
  async function authme() {
    const response = await fetch("http://localhost:3000/api/auth/me");

    const data = await response.json();
    console.log(data);
  }
  authme();

  return (
    <>
      <h1>HOME PAGE</h1>
      <Link to="/register">Register</Link>
    </>
  );
}

export default Home;
