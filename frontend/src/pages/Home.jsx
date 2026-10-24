import { Link } from "react-router";
import Navbar from "../component/Navbar";
import './Home.css';

function Home() {

  return (
    <div className=" flex flex-col gap-2 bg-black min-h-dvh p-2 text-zinc-50 md:flex-row  ">
      <Navbar />
      <main className=" flex-1 md:flex-5  ">

        <div className="monthly-expense bg-zinc-800 px-5 flex flex-col justify-center gap-1   rounded-md "> 
          <p>Total spent this month</p>
          <div className="amount text-2xl ">$2148.30</div> 
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
