// src/components/TenantList.js
import React, { useState, useEffect } from "react";
import AddTenantForm from "./AddTenantForm";
import EditTenantForm from "./EditTenantForm";  // ← Add this import
import ConfirmationDialog from "./ConfirmationDialog";

function TenantList() {
  const [tenants, setTenants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);  // ← Add this
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/tenants");
      const data = await response.json();
      setTenants(data);
    } catch (err) {
      console.error("Error fetching tenants:", err);
    }
  };

  const deleteTenant = async () => {
    if (!selectedTenant) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/tenants/${selectedTenant._id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setTenants(tenants.filter((t) => t._id !== selectedTenant._id));
        setShowDialog(false);
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleTenantAdded = (newTenant) => {
    setTenants([...tenants, newTenant]);
  };

  // ← Add this function
  const handleTenantUpdated = (updatedTenant) => {
    setTenants(tenants.map(t => 
      t._id === updatedTenant._id ? updatedTenant : t
    ));
  };

  // ← Add this function
  const openEditForm = (tenant) => {
    setSelectedTenant(tenant);
    setShowEditForm(true);
  };

  if (!tenants.length) {
    return (
      <div className="no-apartments">
        <h3>No tenants yet</h3>
        <button
          className="add-apartment-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Tenant
        </button>
        {showAddForm && (
          <AddTenantForm
            onClose={() => setShowAddForm(false)}
            onTenantAdded={handleTenantAdded}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="apartments-header">
        <h2 className="apartments-title">Tenants</h2>
        <button
          className="add-apartment-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Tenant
        </button>
      </div>

      <div className="tenants-grid">
        {tenants.map((tenant) => (
          <div key={tenant._id} className={`tenant-card status-${tenant.status}`}>
            <div className="tenant-header">
              <h3>{tenant.name}</h3>
              <div className="tenant-actions">
                {/* ← Add Edit Button */}
                <button
                  className="edit-btn"
                  onClick={() => openEditForm(tenant)}
                  title="Edit tenant"
                >
                  ✎
                </button>
                <button
                  className="delete-btn"
                  onClick={() => {
                    setSelectedTenant(tenant);
                    setShowDialog(true);
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="tenant-details">
              <p>Email: {tenant.email}</p>
              <p>Phone: {tenant.phone}</p>
              <p>Apartment: {tenant.apartment?.number || "N/A"}</p>
              <p>Status: {tenant.status}</p>
              {tenant.endDate && (
                <p>End Date: {new Date(tenant.endDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Tenant Form */}
      {showAddForm && (
        <AddTenantForm
          onClose={() => setShowAddForm(false)}
          onTenantAdded={handleTenantAdded}
        />
      )}

      {/* ← Add Edit Tenant Form */}
      {showEditForm && selectedTenant && (
        <EditTenantForm
          tenant={selectedTenant}
          onClose={() => setShowEditForm(false)}
          onTenantUpdated={handleTenantUpdated}
        />
      )}

      {/* Delete Confirmation */}
      {showDialog && (
        <ConfirmationDialog
          message={`Delete ${selectedTenant.name}?`}
          onConfirm={deleteTenant}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}

export default TenantList;