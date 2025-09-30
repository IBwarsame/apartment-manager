import React, { useState, useEffect } from "react";

function AddPaymentForm({ onClose, onPaymentAdded }) {
  const [formData, setFormData] = useState({
    apartment: "",
    booking: "",
    amount: "",
    dueDate: "",
    status: "pending",
    paymentMethod: "",
    notes: "",
  });

  const [apartments, setApartments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch apartments and bookings
    Promise.all([
      fetch("http://localhost:8000/api/apartments").then(res => res.json()),
      fetch("http://localhost:8000/api/bookings").then(res => res.json())
    ])
    .then(([apartmentsData, bookingsData]) => {
      setApartments(apartmentsData);
      setBookings(bookingsData);
    })
    .catch(err => console.error("Error fetching data:", err));
  }, []);

  // Filter bookings when apartment changes
  useEffect(() => {
    if (formData.apartment) {
      const relevantBookings = bookings.filter(
        booking => booking.apartment === formData.apartment && booking.status === "active"
      );
      setFilteredBookings(relevantBookings);
    } else {
      setFilteredBookings([]);
    }
  }, [formData.apartment, bookings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      const response = await fetch("http://localhost:8000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok) {
        onPaymentAdded(data);
        onClose();
      } else {
        setError(data.error || "Error adding payment");
      }
    } catch (error) {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const occupiedApartments = apartments.filter(apt => apt.status === "occupied");

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Record Payment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          {error && <div className="error-message">{error}</div>}

          {/* Apartment + Amount Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Apartment *</label>
              <select
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                required
              >
                <option value="">Select Apartment</option>
                {occupiedApartments.map((apt) => (
                  <option key={apt._id} value={apt._id}>
                    Unit {apt.number} - Floor {apt.floor}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount ($) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="1200.00"
              />
            </div>
          </div>

          {/* Booking Selection (if apartment selected) */}
          {formData.apartment && (
            <div className="form-group">
              <label>Tenant/Booking</label>
              <select
                name="booking"
                value={formData.booking}
                onChange={handleChange}
              >
                <option value="">Select Tenant (Optional)</option>
                {filteredBookings.map((booking) => (
                  <option key={booking._id} value={booking._id}>
                    {booking.tenantName} - ${booking.monthlyRent}/month
                  </option>
                ))}
              </select>
              <small>Optional - links payment to specific tenant lease</small>
            </div>
          )}

          {/* Due Date + Status Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
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
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">Select Method (Optional)</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="venmo">Venmo</option>
              <option value="zelle">Zelle</option>
            </select>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional payment details..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Recording..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPaymentForm;