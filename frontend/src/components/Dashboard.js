import React, { useState, useEffect } from "react";

function Dashboard() {
  const [stats, setStats] = useState({
    apartments: { total: 0, available: 0, occupied: 0, maintenance: 0 },
    payments: { pending: 0, paid: 0, overdue: 0, totalRevenue: 0 },
    maintenance: { reported: 0, scheduled: 0, inProgress: 0, completed: 0 },
    tenants: { active: 0, pending: 0, ended: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [apartments, payments, maintenance, tenants] = await Promise.all([
        fetch("http://localhost:8000/api/apartments").then(res => res.json()),
        fetch("http://localhost:8000/api/payments").then(res => res.json()),
        fetch("http://localhost:8000/api/maintenance").then(res => res.json()),
        fetch("http://localhost:8000/api/tenants").then(res => res.json())
      ]);

      // Calculate apartment stats
      const apartmentStats = {
        total: apartments.length,
        available: apartments.filter(a => a.status === 'available').length,
        occupied: apartments.filter(a => a.status === 'occupied').length,
        maintenance: apartments.filter(a => a.status === 'maintenance').length
      };

      // Calculate payment stats
      const now = new Date();
      const paymentStats = {
        pending: payments.filter(p => p.status === 'pending').length,
        paid: payments.filter(p => p.status === 'paid').length,
        overdue: payments.filter(p => 
          p.status === 'pending' && new Date(p.dueDate) < now
        ).length,
        totalRevenue: payments
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + p.amount, 0)
      };

      // Calculate maintenance stats
      const maintenanceStats = {
        reported: maintenance.filter(m => m.status === 'reported').length,
        scheduled: maintenance.filter(m => m.status === 'scheduled').length,
        inProgress: maintenance.filter(m => m.status === 'in-progress').length,
        completed: maintenance.filter(m => m.status === 'completed').length
      };

      // Calculate tenant stats
      const tenantStats = {
        active: tenants.filter(t => t.status === 'active').length,
        pending: tenants.filter(t => t.status === 'pending').length,
        ended: tenants.filter(t => t.status === 'ended').length
      };

      setStats({
        apartments: apartmentStats,
        payments: paymentStats,
        maintenance: maintenanceStats,
        tenants: tenantStats
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Property Overview</h2>

      <div className="dashboard-grid">
        {/* Apartments Overview */}
        <div className="dashboard-section">
          <h3 className="section-title">Apartments</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.apartments.total}</div>
              <div className="stat-label">Total Units</div>
            </div>
            <div className="stat-item available">
              <div className="stat-number">{stats.apartments.available}</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-item occupied">
              <div className="stat-number">{stats.apartments.occupied}</div>
              <div className="stat-label">Occupied</div>
            </div>
            <div className="stat-item maintenance">
              <div className="stat-number">{stats.apartments.maintenance}</div>
              <div className="stat-label">Maintenance</div>
            </div>
          </div>
        </div>

        {/* Payments Overview */}
        <div className="dashboard-section">
          <h3 className="section-title">Payments</h3>
          <div className="stats-grid">
            <div className="stat-item revenue">
              <div className="stat-number">${stats.payments.totalRevenue.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-item pending">
              <div className="stat-number">{stats.payments.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-item paid">
              <div className="stat-number">{stats.payments.paid}</div>
              <div className="stat-label">Paid</div>
            </div>
            <div className="stat-item overdue">
              <div className="stat-number">{stats.payments.overdue}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>
        </div>

        {/* Maintenance Overview */}
        <div className="dashboard-section">
          <h3 className="section-title">Maintenance</h3>
          <div className="stats-grid">
            <div className="stat-item reported">
              <div className="stat-number">{stats.maintenance.reported}</div>
              <div className="stat-label">Reported</div>
            </div>
            <div className="stat-item scheduled">
              <div className="stat-number">{stats.maintenance.scheduled}</div>
              <div className="stat-label">Scheduled</div>
            </div>
            <div className="stat-item in-progress">
              <div className="stat-number">{stats.maintenance.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-item completed">
              <div className="stat-number">{stats.maintenance.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Tenants Overview */}
        <div className="dashboard-section">
          <h3 className="section-title">Tenants</h3>
          <div className="stats-grid">
            <div className="stat-item active">
              <div className="stat-number">{stats.tenants.active}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-item pending">
              <div className="stat-number">{stats.tenants.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-item ended">
              <div className="stat-number">{stats.tenants.ended}</div>
              <div className="stat-label">Ended</div>
            </div>
            <div className="stat-item occupancy">
              <div className="stat-number">
                {stats.apartments.total > 0 
                  ? Math.round((stats.apartments.occupied / stats.apartments.total) * 100)
                  : 0}%
              </div>
              <div className="stat-label">Occupancy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;