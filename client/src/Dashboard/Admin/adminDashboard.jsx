import React from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./adminDashboard.css";
import DashboardProduct from "./DashboardProduct";
import DashboardCategory from "./DashboardCategory";
import DashboardUsers from "./DashboardUsers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the current section from the URL search params
  const searchParams = new URLSearchParams(location.search);
  const activeSection = searchParams.get("section") || "overview";

  // Sample chart data (same as before)
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales",
        data: [1200, 1900, 1500, 2100, 2300, 2000, 2500],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const stockData = {
    labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
    datasets: [
      {
        label: "Stock Count",
        data: [50, 20, 35, 10, 40],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
      },
    ],
  };

  const userSignupData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "User Signups",
        data: [30, 45, 40, 60],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.3)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const categoryDistributionData = {
    labels: ["Electronics", "Clothing", "Books", "Home", "Toys"],
    datasets: [
      {
        label: "Category Distribution",
        data: [25, 30, 15, 20, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
      },
    ],
  };

  const handleSectionClick = (section) => {
    // Update the URL without causing a re-render
    navigate(`/admin/dashboard?section=${section}`, { replace: true });
  };

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>

      {/* Sections navigation */}
      <div className="sections-nav">
        <button
          className={activeSection === "overview" ? "active" : ""}
          onClick={() => handleSectionClick("overview")}
        >
          Overview
        </button>
        <button
          className={activeSection === "products" ? "active" : ""}
          onClick={() => handleSectionClick("products")}
        >
          Products
        </button>
        <button
          className={activeSection === "users" ? "active" : ""}
          onClick={() => handleSectionClick("users")}
        >
          Users
        </button>
        <button
          className={activeSection === "categories" ? "active" : ""}
          onClick={() => handleSectionClick("categories")}
        >
          Categories
        </button>
      </div>

      {/* Conditionally render sections content */}
      {activeSection === "overview" && (
        <div className="chart-grid">
          <div className="chart-box">
            <h3>Sales Overview</h3>
            <div className="chart-wrapper">
              <Line
                data={salesData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </div>

          <div className="chart-box">
            <h3>Product Stock Levels</h3>
            <div className="chart-wrapper">
              <Bar
                data={stockData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </div>

          <div className="chart-box">
            <h3>User Signups</h3>
            <div className="chart-wrapper">
              <Line
                data={userSignupData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </div>

          <div className="chart-box">
            <h3>Category Distribution</h3>
            <div className="chart-wrapper">
              <Doughnut
                data={categoryDistributionData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "right" } },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === "products" && (
        <section className="manage-section">
          <DashboardProduct />
        </section>
      )}

      {activeSection === "users" && (
        <section className="manage-section">
          <DashboardUsers />
        </section>
      )}

      {activeSection === "categories" && (
        <section className="manage-section">
          <DashboardCategory />
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
