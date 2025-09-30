import React, { useState } from 'react';

function AddApartmentForm({ onClose, onApartmentAdded }) {
    const [formData, setFormData] = useState({
        number: '',
        floor: '',
        bedrooms: '',
        bathrooms: '',
        rent: '',
        status: 'available',
        amenities: '',
        notes: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const apartmentData = {
                ...formData,
                floor: parseInt(formData.floor),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseFloat(formData.bathrooms),
                rent: parseFloat(formData.rent),
                amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()).filter(a => a) : []
            };

            const response = await fetch('http://localhost:8000/api/apartments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apartmentData),
            });

            const data = await response.json();

            if (response.ok) {
                onApartmentAdded(data);
                onClose();
            } else {
                setError(data.error || 'Failed to add apartment');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Apartment</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="apartment-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Apartment Number *</label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 501"
                            />
                        </div>
                        <div className="form-group">
                            <label>Floor *</label>
                            <input
                                type="number"
                                name="floor"
                                value={formData.floor}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="e.g., 5"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Bedrooms *</label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="e.g., 2"
                            />
                        </div>
                        <div className="form-group">
                            <label>Bathrooms *</label>
                            <input
                                type="number"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                required
                                min="0.5"
                                step="0.5"
                                placeholder="e.g., 1.5"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Monthly Rent ($) *</label>
                            <input
                                type="number"
                                name="rent"
                                value={formData.rent}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="e.g., 1200"
                            />
                        </div>
                        <div className="form-group">
                            <label>Status *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Amenities (comma-separated)</label>
                        <input
                            type="text"
                            name="amenities"
                            value={formData.amenities}
                            onChange={handleChange}
                            placeholder="e.g., parking, balcony, dishwasher"
                        />
                        <small>Optional - separate multiple amenities with commas</small>
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Additional notes about this apartment..."
                        />
                        <small>Optional - any additional information</small>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Apartment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddApartmentForm;