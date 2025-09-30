import React, { useState, useEffect } from "react";

function AddMaintenanceForm({ onClose, onMaintenanceAdded }) {
  const [formData, setFormData] = useState({
    apartment: "",
    title: "",
    description: "",
    priority: "medium",
    scheduledDate: "",
    cost: "",
    notes: "",
  });

  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/apartments")
      .then(res => res.json())
      .then(data => setApartments(data))
      .catch(err => console.error("Error fetching apartments:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const maintenanceData = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        status: "reported",
      };

      const response = await fetch("http://localhost:8000/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(maintenanceData),
      });

      const data = await response.json();

      if (response.ok) {
        onMaintenanceAdded(data);
        onClose();
      } else {
        setError(data.error || "Error reporting maintenance issue");
      }
    } catch (error) {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Report Maintenance Issue</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="maintenance-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Leaky faucet in kitchen"
              />
            </div>
            <div className="form-group">
              <label>Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Apartment *</label>
            <select
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              required
            >
              <option value="">Select Apartment</option>
              {apartments.map((apt) => (
                <option key={apt._id} value={apt._id}>
                  Unit {apt.number} - Floor {apt.floor}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Detailed description of the issue..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Scheduled Date (Optional)</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Estimated Cost ($)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Reporting..." : "Report Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMaintenanceForm;