import { useState, useEffect, useCallback } from 'react';
import './styles.css';

const EMPTY_FORM = {
  studentName: '',
  registerNumber: '',
  bookName: '',
  bookId: '',
  borrowDate: '',
  returnDate: '',
  status: 'Borrowed',
};

function App() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/records');
      if (!res.ok) throw new Error('Failed to fetch records');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      setError('Could not load records. Make sure the backend server is running (npm run server).');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setForm({
      studentName: record.studentName,
      registerNumber: record.registerNumber,
      bookName: record.bookName,
      bookId: record.bookId,
      borrowDate: record.borrowDate,
      returnDate: record.returnDate,
      status: record.status,
    });
    setEditingId(record.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (editingId) {
      const res = await fetch(`/api/records/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchRecords();
        closeForm();
      }
    } else {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchRecords();
        closeForm();
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/records/${deleteTarget}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchRecords();
    }
    setDeleteTarget(null);
  };

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.bookName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Book Borrowing Record Manager</h1>
        <p>Manage college library book borrowing records</p>
      </header>

      <main className="app-main">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search by student name or book name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-box"
          />
          <button className="btn btn-primary" onClick={openAddForm}>
            Add Record
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <p className="status-text">Loading records...</p>
        ) : filteredRecords.length === 0 ? (
          <p className="status-text">No records found.</p>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Register Number</th>
                <th>Book Name</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.studentName}</td>
                  <td>{record.registerNumber}</td>
                  <td>{record.bookName}</td>
                  <td>{record.borrowDate}</td>
                  <td>{record.returnDate}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn btn-small btn-edit" onClick={() => openEditForm(record)}>
                      Edit
                    </button>
                    <button className="btn btn-small btn-delete" onClick={() => setDeleteTarget(record.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Record' : 'Add Record'}</h2>
              <button className="btn-close" onClick={closeForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="record-form">
              <div className="form-group">
                <label>Student Name</label>
                <input type="text" name="studentName" value={form.studentName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Register Number</label>
                <input type="text" name="registerNumber" value={form.registerNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Book Name</label>
                <input type="text" name="bookName" value={form.bookName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Book ID</label>
                <input type="text" name="bookId" value={form.bookId} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Borrow Date</label>
                <input type="date" name="borrowDate" value={form.borrowDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Return Date</label>
                <input type="date" name="returnDate" value={form.returnDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="Borrowed">Borrowed</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this record? This action cannot be undone.</p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
