import React, { useState } from "react";
import ApartmentList from "./components/ApartmentList";
import TenantList from "./components/TenantList";
import PaymentsList from "./components/PaymentsList";
import MaintenanceList from "./components/MaintenanceList";
import Dashboard from "./components/Dashboard";
import "./styles/App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="app">
      <header className="header">
        <h1>APARTMENT MANAGER</h1>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === "apartments" ? "active" : ""}`}
            onClick={() => setActiveTab("apartments")}
          >
            Apartments
          </button>
          <button
            className={`nav-tab ${activeTab === "tenants" ? "active" : ""}`}
            onClick={() => setActiveTab("tenants")}
          >
            Tenants
          </button>
          <button
            className={`nav-tab ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            Payments
          </button>
          <button
            className={`nav-tab ${activeTab === "maintenance" ? "active" : ""}`}
            onClick={() => setActiveTab("maintenance")}
          >
            Maintenance
          </button>
        </nav>
      </header>
      <main className="main-content">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "apartments" && <ApartmentList />}
        {activeTab === "tenants" && <TenantList />}
        {activeTab === "payments" && <PaymentsList />}
        {activeTab === "maintenance" && <MaintenanceList />}
      </main>
    </div>
  );
}

export default App;