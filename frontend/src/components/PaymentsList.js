import React, { useState, useEffect } from "react";
import AddPaymentForm from "./AddPaymentForm";

function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/payments");
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAdded = (newPayment) => {
    setPayments([newPayment, ...payments]);
  };

  const markAsPaid = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/payments/${paymentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "paid",
          paidDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const updatedPayment = await response.json();
        setPayments(payments.map(p => 
          p._id === paymentId ? updatedPayment : p
        ));
      }
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const getStatusColor = (payment) => {
    if (payment.status === "paid") return "status-paid";
    if (payment.status === "overdue") return "status-overdue";
    if (new Date(payment.dueDate) < new Date() && payment.status === "pending") {
      return "status-overdue";
    }
    return "status-pending";
  };

  if (loading) return <div className="loading">Loading payments...</div>;

  return (
    <div>
      <div className="apartments-header">
        <h2 className="apartments-title">Payments</h2>
        <button
          className="add-apartment-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Payment
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="no-apartments">
          <h3>No payments recorded</h3>
          <p>Add payment records to track rent collection</p>
        </div>
      ) : (
        <div className="payments-grid">
          {payments.map((payment) => (
            <div key={payment._id} className={`payment-card ${getStatusColor(payment)}`}>
              <div className="payment-header">
                <div className="payment-amount">${payment.amount}</div>
                <div className={`payment-status status-${payment.status}`}>
                  {payment.status}
                </div>
              </div>

              <div className="payment-details">
                <div className="detail-item">
                  <span className="detail-label">Apartment:</span>
                  <span className="detail-value">
                    Unit {payment.apartment?.number || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tenant:</span>
                  <span className="detail-value">
                    {payment.booking?.tenantName || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Due Date:</span>
                  <span className="detail-value">
                    {new Date(payment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                {payment.paidDate && (
                  <div className="detail-item">
                    <span className="detail-label">Paid Date:</span>
                    <span className="detail-value">
                      {new Date(payment.paidDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {payment.status === "pending" && (
                <button
                  className="mark-paid-btn"
                  onClick={() => markAsPaid(payment._id)}
                >
                  Mark as Paid
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddPaymentForm
          onClose={() => setShowAddForm(false)}
          onPaymentAdded={handlePaymentAdded}
        />
      )}
    </div>
  );
}

export default PaymentsList;