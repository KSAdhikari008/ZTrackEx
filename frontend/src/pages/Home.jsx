import { Link } from "react-router";
import Navbar from "../component/Navbar";
import './Home.css';
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import api from "../services/api";

function getMonthlyTotalErrorMessage(error) {
  if (!axios.isAxiosError(error)) {
    return "An unexpected error occurred. Please try again.";
  }

  if (!error.response) {
    return error.request
      ? "Unable to connect to the server. Check your connection and try again."
      : "The request could not be sent. Please try again.";
  }

  const { status, data } = error.response;

  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You don't have permission to view this information.";
  if (status === 404) return "The monthly spending service could not be found.";
  if (status === 408 || status === 504) return "The request timed out. Please try again.";
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  if (status >= 500) return "The server encountered a problem. Please try again later.";

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  return "The request failed. Please try again.";
}

function Home() {

  const [totalThisMonth, setTotalThisMonth] = useState(null);
  const [isMonthlyTotalLoading, setIsMonthlyTotalLoading] = useState(true);
  const [monthlyTotalError, setMonthlyTotalError] = useState(null);

  //NOTE write separate fns and loadin&err state for all the other dashboard data.
  useEffect(()=>{

    async function getMonthlySpent() {
      try {
        const response = await api.get('expenses/monthlyTotal');
        setTotalThisMonth(response.data.data.totalExpenses);
      } catch (error) {
        console.error("Could not load monthly spending:", error);
        setMonthlyTotalError(getMonthlyTotalErrorMessage(error));
      } finally {
        setIsMonthlyTotalLoading(false);
      }
    }

    getMonthlySpent();
  
  },[]);

  return (
    <div className=" flex flex-col gap-2 bg-black min-h-dvh p-2 text-zinc-50 md:flex-row  ">
      <Navbar />
      <main className=" flex-1 md:flex-5  ">

        <div className="monthly-expense bg-zinc-800 px-5 flex flex-col justify-center gap-1   rounded-md "> 
          <p>Total spent this month</p>
          <div className="amount text-2xl " aria-live="polite">
            {isMonthlyTotalLoading
              ? "Loading..."
              : monthlyTotalError
                ? <span role="alert">{monthlyTotalError}</span>
                : `₹ ${totalThisMonth ?? "0.00"}`}
          </div> 
          <div className="vs-lastMonth text-amber-700 "> 12% vs last month</div>
        </div>
        
        <div className="budget-left  bg-zinc-800 px-5 flex flex-col justify-center gap-1 rounded-md ">
          <p>Budget left</p>
          <div className="amount">$651.70</div>
        </div>
        <div className="top-category  bg-zinc-800  px-5 flex flex-col justify-center gap-1   rounded-md ">
          <p>Top category</p>
          <div className="">Food</div>
        </div>
      <div className="category-spending  bg-zinc-800  px-5 flex flex-col justify-center gap-1   rounded-md  ">
          <p>Spending by category</p>
          <div className="progress-bar">
            <span>Food</span>
            <span>Transport</span>
            <span>Bills</span>
            <span>Others</span>
          </div>
        </div>
        <div className="recent-expenses  bg-zinc-800  px-5 flex flex-col justify-center gap-1   rounded-md ">
          <p>Recent transactions</p>
          <div className="t1">Whole foods -$54.20</div>
          <div className="t2">Uber -$25.00</div>
          <div className="t3">Starbucks -$10.50</div>
          <Link to='/expenses' >Expenses</Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
