import React, { useState, useEffect } from 'react';
import AddApartmentForm from './AddApartmentForm';
import ConfirmationDialog from './ConfirmationDialog';

function ApartmentList() {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState(null);

    useEffect(() => {
        fetchApartments();
    }, []);

    const fetchApartments = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/apartments'); const data = await response.json();
            setApartments(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching apartments:', error);
            setLoading(false);
        }
    };

    const handleDeleteApartment = async () => {
        if (!selectedApartment) return;
        try {

            const response = await fetch(`http://localhost:8000/api/apartments/${selectedApartment._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setApartments(apartments.filter(apt => apt._id !== selectedApartment._id));
                setShowDialog(false);
            } else {
                alert('Failed to delete apartment');
            }
        } catch (error) {
            alert('Error deleting apartment');
        }
    };

    const openConfirmDialog = (apartment) => {
        setSelectedApartment(apartment);
        setShowDialog(true);
    };

    const handleApartmentAdded = (newApartment) => {
        setApartments([...apartments, newApartment]);
    };

    const getStats = () => {
        const total = apartments.length;
        const available = apartments.filter(apt => apt.status === 'available').length;
        const occupied = apartments.filter(apt => apt.status === 'occupied').length;
        const maintenance = apartments.filter(apt => apt.status === 'maintenance').length;

        return { total, available, occupied, maintenance };
    };

    if (loading) return <div className="loading">Loading apartments...</div>;

    const stats = getStats();

    return (
        <div>
            {/* Stats Bar */}
            <div className="stats-bar">
                <div className="stat-card">
                    <div className="stat-number">{stats.total}</div>
                    <div className="stat-label">Total Units</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.available}</div>
                    <div className="stat-label">Available</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.occupied}</div>
                    <div className="stat-label">Occupied</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.maintenance}</div>
                    <div className="stat-label">Maintenance</div>
                </div>
            </div>

            {/* Header */}
            <div className="apartments-header">
                <h2 className="apartments-title">Apartments</h2>
                <button
                    className="add-apartment-btn"
                    onClick={() => setShowAddForm(true)}
                >
                    + Add Apartment
                </button>
            </div>

            {/* Apartments Grid */}
            {apartments.length === 0 ? (
                <div className="no-apartments">
                    <h3>No apartments found</h3>
                    <p>Add some apartments to get started!</p>
                </div>
            ) : (
                <div className="apartments-grid">
                    {apartments.map(apt => (
                        <div key={apt._id} className={`apartment-card ${apt.status}`}>
                            <div className="apartment-header">
                                <div className="apartment-number">Unit {apt.number}</div>
                                <button
                                    className="delete-btn"
                                    onClick={() => openConfirmDialog(apt)}
                                    title="Delete apartment"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="apartment-details">
                                <div className="detail-item">
                                    <div className="detail-label">Floor</div>
                                    <div className="detail-value">{apt.floor}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Bedrooms</div>
                                    <div className="detail-value">{apt.bedrooms}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Bathrooms</div>
                                    <div className="detail-value">{apt.bathrooms}</div>
                                </div>
                            </div>

                            <div className="rent-price">${apt.rent}/month</div>

                            <div className={`status-badge status-${apt.status}`}>
                                {apt.status}
                            </div>

                            {apt.amenities && apt.amenities.length > 0 && (
                                <div className="amenities">
                                    <div className="amenities-label">Amenities</div>
                                    <div className="amenities-list">
                                        {apt.amenities.map((amenity, index) => (
                                            <span key={index} className="amenity-tag">{amenity}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Apartment Modal */}
            {showAddForm && (
                <AddApartmentForm
                    onClose={() => setShowAddForm(false)}
                    onApartmentAdded={handleApartmentAdded}
                />
            )}

            {/* Confirmation Dialog */}
            {showDialog && (
                <ConfirmationDialog
                    message={`Are you sure you want to delete apartment ${selectedApartment.number}?`}
                    onConfirm={handleDeleteApartment}
                    onCancel={() => setShowDialog(false)}
                />
            )}
        </div>
    );
}

export default ApartmentList;