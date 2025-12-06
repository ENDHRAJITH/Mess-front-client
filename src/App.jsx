import React, { useState, useEffect } from 'react';
import { LogIn, User, LayoutDashboard, Clock, DollarSign, History, Save, TrendingUp, Calendar, Users, Briefcase, Search, Plus, Edit, Trash2, X, QrCode, CheckCircle, UserPlus } from 'lucide-react';

const API_HOST = 'http://localhost:5000';

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {!user ? (
        showRegister ? (
          <RegistrationPage setShowRegister={setShowRegister} />
        ) : (
          <LoginPage setUser={setUser} setShowRegister={setShowRegister} />
        )
      ) : user.role === 'admin' ? (
        <AdminDashboard user={user} setUser={setUser} />
      ) : (
        <StudentDashboard user={user} setUser={setUser} />
      )}
    </div>
  );
}

function MessageModal({ message, type, onClose }) {
    if (!message) return null;

    const typeClasses = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-sm w-full border-l-4 p-4 rounded-lg shadow-xl ${typeClasses[type]}`}>
                <div className="flex justify-between items-start">
                    <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                    <button onClick={onClose} className="text-current hover:opacity-75 focus:outline-none text-2xl leading-none">
                        &times;
                    </button>
                </div>
                <p className="mt-2 text-sm">{message}</p>
            </div>
        </div>
    );
}

function RegistrationPage({ setShowRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    department: '',
    year: '',
    room_no: '',
    email: '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_HOST}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessageType('success');
        setMessage(data.message || 'Registration successful! Redirecting to login...');
        setTimeout(() => setShowRegister(false), 2000);
      } else {
        setMessageType('error');
        setMessage(data.error || 'Registration failed');
      }
    } catch (err) {
      setMessageType('error');
      setMessage('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <MessageModal message={message} type={messageType} onClose={() => setMessage('')} />

      <div className="w-full max-w-2xl">
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
          <h2 className="text-center mb-6 text-3xl font-extrabold text-indigo-700 flex items-center justify-center">
            <UserPlus className="w-8 h-8 mr-2"/> Student Registration
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Information Tech">Information Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room No *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.room_no}
                  onChange={(e) => setFormData({...formData, room_no: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Registering...' : <><UserPlus className="w-5 h-5 mr-2" /> Register</>}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowRegister(false)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Already have an account? Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ setUser, setShowRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_HOST}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
      } else {
        setMessageType('error');
        setMessage(data.error || 'Login failed');
      }
    } catch (err) {
      setMessageType('error');
      setMessage('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <MessageModal message={message} type={messageType} onClose={() => setMessage('')} />

      <div className="w-full max-w-md">
        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-100">
          <h2 className="text-center mb-6 text-3xl font-extrabold text-indigo-700 flex items-center justify-center">
            <LayoutDashboard className="w-8 h-8 mr-2"/> Mess Management
          </h2>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Logging in...' : <><LogIn className="w-5 h-5 mr-2" /> Login</>}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowRegister(true)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              New student? Register here
            </button>
          </div>

          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-xs text-indigo-800 font-semibold mb-1">Sample Credentials:</p>
            <p className="text-xs text-indigo-600">
              <span className="font-mono bg-indigo-100 px-1 rounded">Admin: admin / admin@123</span><br/>
              <span className="font-mono bg-indigo-100 px-1 rounded">Student: student1 / student@123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'attendance') {
      fetchStudents();
    }
  }, [activeTab, searchQuery, filterDept, filterYear]);

  useEffect(() => {
    if (students.length > 0 && activeTab === 'attendance') {
      fetchAttendance();
    }
  }, [selectedDate, selectedMeal, students]);

  const fetchStudents = async () => {
    try {
      let url = `${API_HOST}/api/students?`;
      if (searchQuery) url += `search=${searchQuery}&`;
      if (filterDept) url += `department=${filterDept}&`;
      if (filterYear) url += `year=${filterYear}&`;
      url += `status=active`;

      const response = await fetch(url);
      const data = await response.json();
      setStudents(data);

      const initial = {};
      data.forEach(student => {
        initial[student.student_id] = 'absent';
      });
      setAttendance(initial);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_HOST}/api/attendance/${selectedDate}`);
      const data = await response.json();
      
      const updated = {};
      students.forEach(student => {
        const record = data.find(a => a.student_id === student.student_id);
        if (record) {
          updated[student.student_id] = record[selectedMeal] || 'absent';
        } else {
          updated[student.student_id] = 'absent';
        }
      });
      setAttendance(updated);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    setLoading(true);
    
    const updates = students.map(student => ({
      student_id: student.student_id,
      status: attendance[student.student_id] || 'absent'
    }));

    try {
      const response = await fetch(`${API_HOST}/api/attendance/bulk-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          meal_type: selectedMeal,
          updates: updates
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessageType('success');
        setMessage('Attendance saved successfully!');
        fetchAttendance();
      } else {
        setMessageType('error');
        setMessage(data.error || 'Failed to save');
      }
    } catch (err) {
      setMessageType('error');
      setMessage('Error saving attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch(`${API_HOST}/api/admin/students/${studentId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessageType('success');
        setMessage('Student deleted successfully');
        fetchStudents();
      } else {
        setMessageType('error');
        setMessage(data.error || 'Failed to delete');
      }
    } catch (err) {
      setMessageType('error');
      setMessage('Error deleting student');
    }
  };

  const tabClass = (tabName) => 
    `flex items-center justify-center p-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
      activeTab === tabName 
        ? 'border-indigo-600 text-indigo-600 bg-indigo-50' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <MessageModal message={message} type={messageType} onClose={() => setMessage('')} />

      <nav className="bg-indigo-600 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <span className="text-xl font-bold text-white flex items-center">
            <LayoutDashboard className="w-6 h-6 mr-2" /> Admin Dashboard
          </span>
          <button 
            className="flex items-center text-sm px-4 py-2 border border-transparent rounded-full font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition duration-150" 
            onClick={() => setUser(null)}
          >
            <LogIn className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-col max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className={tabClass('students')} onClick={() => setActiveTab('students')}>
              <Users className="w-5 h-5 mr-2" /> Manage Students
            </button>
            <button className={tabClass('attendance')} onClick={() => setActiveTab('attendance')}>
              <Clock className="w-5 h-5 mr-2" /> Mark Attendance
            </button>
            <button className={tabClass('reports')} onClick={() => setActiveTab('reports')}>
              <TrendingUp className="w-5 h-5 mr-2" /> Reports
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'students' && (
            <StudentsManagementTab 
              students={students}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterDept={filterDept}
              setFilterDept={setFilterDept}
              filterYear={filterYear}
              setFilterYear={setFilterYear}
              setShowAddModal={setShowAddModal}
              handleDeleteStudent={handleDeleteStudent}
              fetchStudents={fetchStudents}
            />
          )}
          
          {activeTab === 'attendance' && (
            <AttendanceTab
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedMeal={selectedMeal}
              setSelectedMeal={setSelectedMeal}
              students={students}
              attendance={attendance}
              handleAttendanceChange={handleAttendanceChange}
              saveAttendance={saveAttendance}
              loading={loading}
            />
          )}
          
          {activeTab === 'reports' && (
            <ReportsTab students={students} />
          )}
        </div>
      </div>

      {showAddModal && (
        <AddStudentModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false);
            fetchStudents();
          }}
        />
      )}
    </div>
  );
}

function StudentsManagementTab({ students, searchQuery, setSearchQuery, filterDept, setFilterDept, filterYear, setFilterYear, setShowAddModal, handleDeleteStudent }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Users className="w-6 h-6 mr-2 text-indigo-500" /> Student Management
        </h5>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, or room..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
            <option value="Information Tech">Information Tech</option>
          </select>
        </div>
        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Room</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No students found</td></tr>
            ) : (
              students.map(student => (
                <tr key={student.student_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.student_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.room_no}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteStudent(student.student_id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddStudentModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '', password: '', name: '', department: '', year: '', room_no: '', email: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_HOST}/api/admin/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || 'Failed to add student');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Add New Student</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Full Name *" className="px-4 py-2 border rounded-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <input type="text" placeholder="Username *" className="px-4 py-2 border rounded-lg" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
            <input type="password" placeholder="Password *" className="px-4 py-2 border rounded-lg" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            <select className="px-4 py-2 border rounded-lg" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required>
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Information Tech">Information Tech</option>
            </select>
            <select className="px-4 py-2 border rounded-lg" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <input type="text" placeholder="Room No *" className="px-4 py-2 border rounded-lg" value={formData.room_no} onChange={(e) => setFormData({...formData, room_no: e.target.value})} required />
            <input type="email" placeholder="Email" className="px-4 py-2 border rounded-lg" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="tel" placeholder="Phone" className="px-4 py-2 border rounded-lg" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AttendanceTab({ selectedDate, setSelectedDate, selectedMeal, setSelectedMeal, students, attendance, handleAttendanceChange, saveAttendance, loading }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Clock className="w-6 h-6 mr-2 text-indigo-500" /> Mark Daily Attendance
      </h5>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input type="date" className="w-full px-3 py-2 border rounded-lg" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Meal</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Room</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => (
              <tr key={student.student_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.department}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.room_no}</td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex rounded-lg shadow-sm">
                    <button onClick={() => handleAttendanceChange(student.student_id, 'present')} className={`px-3 py-1 text-xs font-semibold rounded-l-lg border ${attendance[student.student_id] === 'present' ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50'}`}>
                      Present
                    </button>
                    <button onClick={() => handleAttendanceChange(student.student_id, 'absent')} className={`px-3 py-1 text-xs font-semibold rounded-r-lg border ${attendance[student.student_id] === 'absent' ? 'bg-red-600 text-white' : 'bg-white text-red-600 hover:bg-red-50'}`}>
                      Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={saveAttendance} className="mt-6 w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>
        {loading ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Attendance</>}
      </button>
    </div>
  );
}

function ReportsTab({ students }) {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!selectedStudent) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_HOST}/api/student/${selectedStudent}/bill?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <TrendingUp className="w-6 h-6 mr-2 text-indigo-500" /> Generate Reports
      </h5>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="col-span-2 md:col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Student</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            <option value="">Choose Student</option>
            {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Month</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Year</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="col-span-2 flex items-end">
          <button onClick={generateReport} className="w-full flex items-center justify-center py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50" disabled={loading}>
            {loading ? 'Generating...' : <><Calendar className='w-4 h-4 mr-2' /> Generate</>}
          </button>
        </div>
      </div>

      {report && (
        <div className="mt-4 border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Days" value={report.total_days} color="bg-blue-500" />
            <StatCard title="Present Days" value={report.present_days} color="bg-green-500" />
            <StatCard title="Leave Days" value={report.leave_days} color="bg-yellow-500" />
            <StatCard title="Total Bill" value={`₹${report.total_amount}`} color="bg-indigo-600" footer={`Per Day: ₹${report.amount_per_day}`} />
          </div>

          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Breakfast</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Lunch</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Dinner</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.attendance.map(att => (
                  <tr key={att.attendance_id}>
                    <td className="px-6 py-3 text-sm font-medium">{new Date(att.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-center"><AttendanceBadge status={att.breakfast} /></td>
                    <td className="px-6 py-3 text-center"><AttendanceBadge status={att.lunch} /></td>
                    <td className="px-6 py-3 text-center"><AttendanceBadge status={att.dinner} /></td>
                    <td className="px-6 py-3 text-center"><AttendanceBadge status={att.day_status} isDayStatus={true} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('bill');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState([]);
  const [bill, setBill] = useState(null);
  const [billHistory, setBillHistory] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    fetchAttendance();
    fetchBill();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBillHistory();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_HOST}/api/student/${user.student_id}/attendance?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      setAttendance(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchBill = async () => {
    try {
      const response = await fetch(`${API_HOST}/api/student/${user.student_id}/bill?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      setBill(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchBillHistory = async () => {
    try {
      const response = await fetch(`${API_HOST}/api/student/${user.student_id}/bill-history`);
      const data = await response.json();
      setBillHistory(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const generateQR = async () => {
    if (!bill) return;
    
    try {
      const response = await fetch(`${API_HOST}/api/payment/generate-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: user.student_id,
          bill_id: `${user.student_id}-${selectedMonth}-${selectedYear}`,
          amount: bill.total_amount
        })
      });
      const data = await response.json();
      setQrData(data);
      setShowQRModal(true);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const tabClass = (tabName) => 
    `flex items-center justify-center p-4 border-b-2 font-medium text-sm transition-colors ${
      activeTab === tabName ? 'border-green-600 text-green-600 bg-green-50' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-green-600 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="text-xl font-bold text-white flex items-center">
            <User className="w-6 h-6 mr-2" /> Student Portal
          </span>
          <button onClick={() => setUser(null)} className="flex items-center text-sm px-4 py-2 rounded-full font-medium text-green-600 bg-white hover:bg-green-50">
            <LogIn className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-col max-w-7xl mx-auto w-full p-4 sm:p-6">
        <div className="bg-white p-5 rounded-xl shadow-md border mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <InfoPill label="Name" value={user.name} />
            <InfoPill label="Department" value={user.department} />
            <InfoPill label="Year" value={user.year} />
            <InfoPill label="Room" value={user.room_no} />
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className={tabClass('bill')} onClick={() => setActiveTab('bill')}>
              <DollarSign className="w-5 h-5 mr-2" /> Monthly Bill
            </button>
            <button className={tabClass('attendance')} onClick={() => setActiveTab('attendance')}>
              <Clock className="w-5 h-5 mr-2" /> My Attendance
            </button>
            <button className={tabClass('history')} onClick={() => setActiveTab('history')}>
              <History className="w-5 h-5 mr-2" /> Bill History
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'bill' && (
            <StudentBillTab bill={bill} generateQR={generateQR} />
          )}
          {activeTab === 'attendance' && (
            <StudentAttendanceTab
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              attendance={attendance}
            />
          )}
          {activeTab === 'history' && (
            <StudentBillHistoryTab billHistory={billHistory} />
          )}
        </div>
      </div>

      {showQRModal && (
        <QRPaymentModal qrData={qrData} onClose={() => setShowQRModal(false)} />
      )}
    </div>
  );
}

function StudentBillTab({ bill, generateQR }) {
  if (!bill) return <div className="bg-white p-6 rounded-xl shadow-lg">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <DollarSign className="w-6 h-6 mr-2 text-green-500" /> Monthly Mess Bill
      </h5>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Days" value={bill.total_days} color="bg-gray-700" />
        <StatCard title="Present Days" value={bill.present_days} color="bg-green-600" />
        <StatCard title="Leave Days" value={bill.leave_days} color="bg-yellow-600" />
      </div>

      <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
        <h5 className="text-xl font-bold text-green-800 mb-4">Bill Summary</h5>
        <div className="space-y-2 text-sm">
          <p className="flex justify-between">
            <strong>Cost Per Day:</strong>
            <span className="text-lg text-green-600">₹{bill.amount_per_day}</span>
          </p>
          <p className="flex justify-between">
            <strong>Billing Days:</strong>
            <span>{bill.present_days} days</span>
          </p>
          <div className="py-4 border-t border-green-300">
            <div className="flex justify-between items-center font-bold text-2xl text-green-900 bg-green-200 p-3 rounded-lg">
              <span>TOTAL AMOUNT:</span>
              <span>₹{bill.total_amount}</span>
            </div>
          </div>
        </div>

        <button onClick={generateQR} className="mt-4 w-full flex items-center justify-center py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <QrCode className="w-5 h-5 mr-2" /> Pay Now with QR Code
        </button>
      </div>
    </div>
  );
}

function StudentAttendanceTab({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, attendance }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Clock className="w-6 h-6 mr-2 text-green-500" /> My Attendance
      </h5>
      
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="text-sm font-medium mb-1 block">Month</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Year</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {attendance.length === 0 ? (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">No records found</div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Date</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Breakfast</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Lunch</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Dinner</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.map(att => (
                <tr key={att.attendance_id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium">{new Date(att.date).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-center"><AttendanceBadge status={att.breakfast} /></td>
                  <td className="px-6 py-3 text-center"><AttendanceBadge status={att.lunch} /></td>
                  <td className="px-6 py-3 text-center"><AttendanceBadge status={att.dinner} /></td>
                  <td className="px-6 py-3 text-center"><AttendanceBadge status={att.day_status} isDayStatus={true} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StudentBillHistoryTab({ billHistory }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <History className="w-6 h-6 mr-2 text-green-500" /> Bill History
      </h5>
      
      {billHistory.length === 0 ? (
        <div className="p-4 bg-yellow-100 border text-yellow-700 rounded-lg">No history found</div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Month/Year</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Total Days</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Present</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Leave</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billHistory.map(bill => (
                <tr key={bill.bill_id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium">{new Date(bill.year, bill.month - 1).toLocaleString('default', { month: 'long' })} {bill.year}</td>
                  <td className="px-6 py-3 text-center text-sm">{bill.total_days}</td>
                  <td className="px-6 py-3 text-center text-sm">{bill.present_days}</td>
                  <td className="px-6 py-3 text-center text-sm">{bill.leave_days}</td>
                  <td className="px-6 py-3 text-right text-sm font-bold text-green-600">₹{bill.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function QRPaymentModal({ qrData, onClose }) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      const response = await fetch(`${API_HOST}/api/payment/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bill_id: qrData.payment_for,
          student_id: qrData.student_name,
          amount: qrData.amount,
          transaction_id: qrData.transaction_id
        })
      });
      
      if (response.ok) {
        setPaymentSuccess(true);
        setTimeout(() => onClose(), 3000);
      }
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        {paymentSuccess ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Transaction ID: {qrData.transaction_id}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Scan to Pay</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl mb-4">
              <div className="bg-white p-6 rounded-lg shadow-inner">
                <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center rounded-lg">
                  <QrCode className="w-32 h-32 text-gray-400" />
                  <div className="absolute text-xs text-gray-500 mt-40">Dummy QR Code</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="flex justify-between text-sm">
                <span className="text-gray-600">Student:</span>
                <span className="font-semibold">{qrData.student_name}</span>
              </p>
              <p className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-green-600 text-lg">₹{qrData.amount}</span>
              </p>
              <p className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs">{qrData.transaction_id}</span>
              </p>
            </div>

            <button onClick={handlePayment} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
              Simulate Payment Success
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              This is a dummy payment interface. In production, integrate with actual UPI/payment gateway.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function AttendanceBadge({ status, isDayStatus = false }) {
  let classes = '';
  let text = status.charAt(0).toUpperCase() + status.slice(1);

  if (status === 'present') {
    classes = 'bg-green-100 text-green-800';
  } else if (status === 'absent') {
    classes = 'bg-red-100 text-red-800';
  } else if (isDayStatus && status === 'leave') {
    classes = 'bg-yellow-100 text-yellow-800';
    text = 'Leave';
  } else {
    classes = 'bg-gray-100 text-gray-800';
  }

  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>{text}</span>;
}

function StatCard({ title, value, color, footer }) {
  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${color} text-white`}>
      <div className="p-5">
        <h3 className="text-lg font-medium opacity-80">{title}</h3>
        <p className="mt-2 text-4xl font-extrabold">{value}</p>
      </div>

      {footer && (
        <div className="bg-black bg-opacity-10 p-2 text-xs text-center">
          {footer}
        </div>
      )}
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
}
  
