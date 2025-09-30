// src/components/AddTenantForm.js
import React, { useState, useEffect } from "react";

function AddTenantForm({ onClose, onTenantAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    apartment: "",
    startDate: "",
    endDate: "",
    status: "pending",
  });

  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/apartments")
      .then((res) => res.json())
      .then((data) => setApartments(data));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        onTenantAdded(data);
        onClose();
      } else {
        setError(data.error || "Error adding tenant");
      }
    } catch {
      setError("Network error, try again");
    }
  };

  const availableApartments = apartments.filter(
    (apt) => apt.status === "available"
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Tenant</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tenant-form">
          {error && <div className="error-message">{error}</div>}

          {/* Name + Status Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>

          {/* Email + Phone Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                placeholder="(555) 555-5555"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Apartment Selection */}
          <div className="form-group">
            <label>Apartment *</label>
            <select
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              required
            >
              <option value="">Select Available Unit</option>
              {availableApartments.map((apt) => (
                <option key={apt._id} value={apt._id}>
                  Unit {apt.number} – Floor {apt.floor}
                </option>
              ))}
            </select>
            {availableApartments.length === 0 && (
              <small style={{ color: "#c33" }}>
                ⚠ All apartments are occupied
              </small>
            )}
          </div>

          {/* Lease Dates */}
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date (Optional)</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddTenantForm;