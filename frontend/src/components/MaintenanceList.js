import React, { useState, useEffect } from "react";
import AddMaintenanceForm from "./AddMaintenanceForm";

function MaintenanceList() {
  const [maintenance, setMaintenance] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/maintenance");
      const data = await response.json();
      setMaintenance(data);
    } catch (error) {
      console.error("Error fetching maintenance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceAdded = (newMaintenance) => {
    setMaintenance([newMaintenance, ...maintenance]);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/maintenance/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === "completed" && { completedDate: new Date().toISOString() })
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setMaintenance(maintenance.map(m => m._id === id ? updated : m));
      }
    } catch (error) {
      console.error("Error updating maintenance:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "priority-urgent";
      case "high": return "priority-high";
      case "medium": return "priority-medium";
      case "low": return "priority-low";
      default: return "priority-medium";
    }
  };

  if (loading) return <div className="loading">Loading maintenance requests...</div>;

  return (
    <div>
      <div className="apartments-header">
        <h2 className="apartments-title">Maintenance</h2>
        <button
          className="add-apartment-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Report Issue
        </button>
      </div>

      {maintenance.length === 0 ? (
        <div className="no-apartments">
          <h3>No maintenance requests</h3>
          <p>Report maintenance issues to track repairs</p>
        </div>
      ) : (
        <div className="maintenance-grid">
          {maintenance.map((item) => (
            <div key={item._id} className={`maintenance-card ${getPriorityColor(item.priority)}`}>
              <div className="maintenance-header">
                <h3 className="maintenance-title">{item.title}</h3>
                <div className={`priority-badge priority-${item.priority}`}>
                  {item.priority}
                </div>
              </div>

              <div className="maintenance-details">
                <p className="maintenance-description">{item.description}</p>
                
                <div className="detail-item">
                  <span className="detail-label">Apartment:</span>
                  <span className="detail-value">
                    Unit {item.apartment?.number || "N/A"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value status-${item.status}`}>
                    {item.status}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Reported:</span>
                  <span className="detail-value">
                    {new Date(item.reportedDate).toLocaleDateString()}
                  </span>
                </div>

                {item.scheduledDate && (
                  <div className="detail-item">
                    <span className="detail-label">Scheduled:</span>
                    <span className="detail-value">
                      {new Date(item.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {item.completedDate && (
                  <div className="detail-item">
                    <span className="detail-label">Completed:</span>
                    <span className="detail-value">
                      {new Date(item.completedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {item.cost > 0 && (
                  <div className="detail-item">
                    <span className="detail-label">Cost:</span>
                    <span className="detail-value">${item.cost}</span>
                  </div>
                )}
              </div>

              {item.status !== "completed" && (
                <div className="maintenance-actions">
                  {item.status === "reported" && (
                    <button
                      className="status-btn schedule-btn"
                      onClick={() => updateStatus(item._id, "scheduled")}
                    >
                      Schedule
                    </button>
                  )}
                  {item.status === "scheduled" && (
                    <button
                      className="status-btn progress-btn"
                      onClick={() => updateStatus(item._id, "in-progress")}
                    >
                      Start Work
                    </button>
                  )}
                  {item.status === "in-progress" && (
                    <button
                      className="status-btn complete-btn"
                      onClick={() => updateStatus(item._id, "completed")}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddMaintenanceForm
          onClose={() => setShowAddForm(false)}
          onMaintenanceAdded={handleMaintenanceAdded}
        />
      )}
    </div>
  );
}

export default MaintenanceList;