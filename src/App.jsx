import React, { useState, useEffect } from 'react';
import { LogIn, User, LayoutDashboard, Clock, DollarSign, History, Save, TrendingUp, Calendar, Users, Briefcase } from 'lucide-react';

// ============================================
// MOCK API HOST (used for all fetch requests)
// ============================================
const API_HOST = 'http://localhost:5000';

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  // State Management
  const [user, setUser] = useState(null);
  
  // NOTE: In a real app, this would check localStorage for an existing session
  // or use Firebase Auth state listener.

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {!user ? (
        <LoginPage setUser={setUser} />
      ) : user.role === 'admin' ? (
        <AdminDashboard user={user} setUser={setUser} />
      ) : (
        <StudentDashboard user={user} setUser={setUser} />
      )}
    </div>
  );
}

// ============================================
// UTILITY COMPONENTS
// ============================================

// Custom Message Box (Replaces alert())
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
                    <button onClick={onClose} className="text-current hover:opacity-75 focus:outline-none">
                        &times;
                    </button>
                </div>
                <p className="mt-2 text-sm">{message}</p>
            </div>
        </div>
    );
}


// ============================================
// LOGIN PAGE COMPONENT
// ============================================
function LoginPage({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // Function for exponential backoff retry logic
    const fetchWithRetry = async (url, options, maxRetries = 3) => {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch(url, options);
                return response;
            } catch (err) {
                if (attempt < maxRetries - 1) {
                    const delay = Math.pow(2, attempt) * 1000;
                    console.warn(`Fetch attempt ${attempt + 1} failed. Retrying in ${delay / 1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw err; // Re-throw error on final attempt
                }
            }
        }
    };


    try {
        const response = await fetchWithRetry(`${API_HOST}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            setUser(data.user);
        } else {
            setMessageType('error');
            setMessage(data.error || 'Login failed. Check credentials.');
        }
    } catch (err) {
        setMessageType('error');
        setMessage('Server connection failed. Ensure the backend is running.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <MessageModal 
        message={message} 
        type={messageType} 
        onClose={() => setMessage('')} 
      />

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
                placeholder="e.g., admin or student1"
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
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" /> Login
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-xs text-indigo-800 font-semibold mb-1">
              Sample Credentials:
            </p>
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

// ============================================
// ADMIN DASHBOARD COMPONENT
// ============================================
function AdminDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  // Utility function to handle fetch with retry (extracted from LoginPage)
  const fetchWithRetry = async (url, options, maxRetries = 3) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (err) {
            if (attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw err;
            }
        }
    }
  };

  // Fetch all students on load
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch attendance when date or students change
  useEffect(() => {
    if (students.length > 0) {
        fetchAttendance();
    }
  }, [selectedDate, selectedMeal, students]);

  const fetchStudents = async () => {
    try {
        const response = await fetchWithRetry(`${API_HOST}/api/students`);
        const data = await response.json();
        setStudents(data);
        
        // Initialize attendance state for all students
        const initial = {};
        data.forEach(student => {
            initial[student.student_id] = 'absent';
        });
        setAttendance(initial);
    } catch (err) {
        console.error('Error fetching students:', err);
        setMessageType('error');
        setMessage('Failed to load student list.');
    }
  };

  const fetchAttendance = async () => {
    try {
        const response = await fetchWithRetry(`${API_HOST}/api/attendance/${selectedDate}`);
        const data = await response.json();
        
        // Update attendance state with existing data
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
        // Do not set error message for empty attendance, only critical failures
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = async () => {
    setLoading(true);
    
    const updates = students.map(student => ({
      student_id: student.student_id,
      status: attendance[student.student_id] || 'absent'
    }));

    try {
      const response = await fetchWithRetry(`${API_HOST}/api/attendance/bulk-update`, {
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
        setMessage(data.error || 'Failed to save attendance.');
      }
    } catch (err) {
      setMessageType('error');
      setMessage('Error saving attendance. Server connection issue.');
    } finally {
      setLoading(false);
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
      <MessageModal 
        message={message} 
        type={messageType} 
        onClose={() => setMessage('')} 
      />

      {/* Navigation Bar */}
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
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button 
              className={tabClass('attendance')}
              onClick={() => setActiveTab('attendance')}
            >
              <Clock className="w-5 h-5 mr-2" /> Mark Attendance
            </button>
            <button 
              className={tabClass('reports')}
              onClick={() => setActiveTab('reports')}
            >
              <TrendingUp className="w-5 h-5 mr-2" /> View Reports
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
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
            <ReportsTab students={students} fetchWithRetry={fetchWithRetry} API_HOST={API_HOST} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// ATTENDANCE TAB (Admin)
// ============================================
function AttendanceTab({ 
  selectedDate, setSelectedDate, selectedMeal, setSelectedMeal,
  students, attendance, handleAttendanceChange, saveAttendance, loading 
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Clock className="w-6 h-6 mr-2 text-indigo-500" /> Mark Daily Attendance
      </h5>
      
      {/* Date and Meal Selection Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Select Meal</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(e.target.value)}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room No</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendance Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Loading students or no students found...</td></tr>
            ) : (
                students.map((student, index) => (
                    <tr key={student.student_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.room_no}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <div className="inline-flex rounded-lg shadow-sm">
                                <button
                                    onClick={() => handleAttendanceChange(student.student_id, 'present')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-l-lg border transition-colors duration-150 
                                        ${attendance[student.student_id] === 'present' 
                                            ? 'bg-green-600 text-white border-green-700' 
                                            : 'bg-white text-green-600 border-gray-300 hover:bg-green-50'}`
                                    }
                                >
                                    Present
                                </button>
                                <button
                                    onClick={() => handleAttendanceChange(student.student_id, 'absent')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-r-lg border transition-colors duration-150 
                                        ${attendance[student.student_id] === 'absent' 
                                            ? 'bg-red-600 text-white border-red-700' 
                                            : 'bg-white text-red-600 border-gray-300 hover:bg-red-50'}`
                                    }
                                >
                                    Absent
                                </button>
                            </div>
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      <button 
        className="mt-6 w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
        onClick={saveAttendance}
        disabled={loading}
      >
        {loading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
            </>
        ) : (
            <>
                <Save className="w-5 h-5 mr-2" /> Save Attendance
            </>
        )}
      </button>
    </div>
  );
}

// ============================================
// REPORTS TAB (Admin)
// ============================================
function ReportsTab({ students, fetchWithRetry, API_HOST }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStudent, setSelectedStudent] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');

  const generateReport = async () => {
    if (!selectedStudent) {
        setMessageType('error');
        setMessage('Please select a student to generate the report.');
        return;
    }
    setMessage('');

    setLoading(true);
    try {
      const response = await fetchWithRetry(
        `${API_HOST}/api/student/${selectedStudent}/bill?month=${selectedMonth}&year=${selectedYear}`
      );
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setMessageType('error');
      setMessage('Error generating report. Check console for details.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <MessageModal 
        message={message} 
        type={messageType} 
        onClose={() => setMessage('')} 
      />
      <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <TrendingUp className="w-6 h-6 mr-2 text-indigo-500" /> Generate Monthly Report
      </h5>
      
      {/* Report Filters and Button */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="col-span-2 md:col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Student</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">-- Choose Student --</option>
            {students.map(student => (
              <option key={student.student_id} value={student.student_id}>
                {student.name} ({student.student_id})
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1 md:col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Month</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1 md:col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Year</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2 md:col-span-2 flex items-end">
          <button 
            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-150"
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? 'Generating...' : <><Calendar className='w-4 h-4 mr-2' /> Generate Report</>}
          </button>
        </div>
      </div>

      {/* Report Display */}
      {report ? (
        <div className="mt-4 border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Days" value={report.total_days} color="bg-blue-500" />
            <StatCard title="Present Days" value={report.present_days} color="bg-green-500" />
            <StatCard title="Leave Days" value={report.leave_days} color="bg-yellow-500" />
            <StatCard 
                title="Total Bill" 
                value={`₹${report.total_amount}`} 
                color="bg-indigo-600"
                footer={`Amount Per Day: ₹${report.amount_per_day}`}
            />
          </div>

          <h6 className="text-lg font-semibold text-gray-700 mb-3">Daily Attendance Breakdown</h6>
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Breakfast</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Lunch</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Dinner</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Day Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.attendance.map(att => (
                  <tr key={att.attendance_id}>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(att.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                      <AttendanceBadge status={att.breakfast} />
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                      <AttendanceBadge status={att.lunch} />
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                      <AttendanceBadge status={att.dinner} />
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                      <AttendanceBadge status={att.day_status} isDayStatus={true} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
            <p>Select a student, month, and year, then click 'Generate Report' to view the monthly bill and attendance history.</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// STUDENT DASHBOARD COMPONENT
// ============================================
function StudentDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('bill');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState([]);
  const [bill, setBill] = useState(null);
  const [billHistory, setBillHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Utility function to handle fetch with retry
  const fetchWithRetry = async (url, options, maxRetries = 3) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (err) {
            if (attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw err;
            }
        }
    }
  };


  useEffect(() => {
    fetchAttendance();
    fetchBill();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBillHistory();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await fetchWithRetry(
        `${API_HOST}/api/student/${user.student_id}/attendance?month=${selectedMonth}&year=${selectedYear}`
      );
      const data = await response.json();
      setAttendance(data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBill = async () => {
    try {
      const response = await fetchWithRetry(
        `${API_HOST}/api/student/${user.student_id}/bill?month=${selectedMonth}&year=${selectedYear}`
      );
      const data = await response.json();
      setBill(data);
    } catch (err) {
      console.error('Error fetching bill:', err);
      setBill(null); // Clear bill on error
    }
  };

  const fetchBillHistory = async () => {
    try {
      const response = await fetchWithRetry(
        `${API_HOST}/api/student/${user.student_id}/bill-history`
      );
      const data = await response.json();
      setBillHistory(data);
    } catch (err) {
      console.error('Error fetching bill history:', err);
    }
  };

  const tabClass = (tabName) => 
    `flex items-center justify-center p-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
      activeTab === tabName 
        ? 'border-green-600 text-green-600 bg-green-50' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;


  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-green-600 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <span className="text-xl font-bold text-white flex items-center">
            <User className="w-6 h-6 mr-2" /> Student Portal
          </span>
          <button 
            className="flex items-center text-sm px-4 py-2 border border-transparent rounded-full font-medium text-green-600 bg-white hover:bg-green-50 transition duration-150" 
            onClick={() => setUser(null)}
          >
            <LogIn className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-col max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        
        {/* Student Info Card */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <InfoPill label="Student Name" value={user.name} />
            <InfoPill label="Department" value={user.department} />
            <InfoPill label="Academic Year" value={user.year} />
            <InfoPill label="Room No" value={user.room_no} />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button 
              className={tabClass('bill')}
              onClick={() => setActiveTab('bill')}
            >
              <DollarSign className="w-5 h-5 mr-2" /> Monthly Bill
            </button>
            <button 
              className={tabClass('attendance')}
              onClick={() => setActiveTab('attendance')}
            >
              <Clock className="w-5 h-5 mr-2" /> My Attendance
            </button>
            <button 
              className={tabClass('history')}
              onClick={() => setActiveTab('history')}
            >
              <History className="w-5 h-5 mr-2" /> Bill History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'bill' && (
            <StudentBillTab bill={bill} />
          )}
          
          {activeTab === 'attendance' && (
            <StudentAttendanceTab
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              attendance={attendance}
              loading={loading}
            />
          )}
          
          {activeTab === 'history' && (
            <StudentBillHistoryTab billHistory={billHistory} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// STUDENT ATTENDANCE TAB
// ============================================
function StudentAttendanceTab({ 
  selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, 
  attendance, loading 
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Clock className="w-6 h-6 mr-2 text-green-500" /> My Daily Attendance
      </h5>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Month</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Year</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-green-600 font-medium">Loading attendance records...</div>
      ) : attendance.length === 0 ? (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
          No attendance records found for the selected period.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Breakfast</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Lunch</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Dinner</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Day Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.map(att => (
                <tr key={att.attendance_id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(att.date).toLocaleDateString()}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                    <AttendanceBadge status={att.breakfast} />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                    <AttendanceBadge status={att.lunch} />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                    <AttendanceBadge status={att.dinner} />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                    <AttendanceBadge status={att.day_status} isDayStatus={true} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================
// STUDENT BILL TAB
// ============================================
function StudentBillTab({ bill }) {
  if (!bill) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-green-500" /> Monthly Mess Bill
        </h5>
        <div className="p-4 text-center bg-blue-50 border border-blue-400 text-blue-700 rounded-lg">
          Loading monthly bill information...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <DollarSign className="w-6 h-6 mr-2 text-green-500" /> Monthly Mess Bill
      </h5>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Days in Month" value={bill.total_days} color="bg-gray-700" icon={<Calendar className="w-6 h-6" />} />
        <StatCard title="Days Attended" value={bill.present_days} color="bg-green-600" icon={<Clock className="w-6 h-6" />} />
        <StatCard title="Leave Days" value={bill.leave_days} color="bg-yellow-600" icon={<Briefcase className="w-6 h-6" />} />
      </div>

      <div className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-inner">
        <h5 className="text-xl font-bold text-green-800 mb-4">Bill Calculation Summary</h5>
        
        <div className="space-y-2 text-gray-700 text-sm">
          <p className="flex justify-between items-center border-b border-green-100 pb-1">
            <strong className="font-semibold">Cost Per Day:</strong> 
            <span className="font-mono text-lg text-green-600">₹{bill.amount_per_day}</span>
          </p>
          <p className="flex justify-between items-center border-b border-green-100 pb-1">
            <strong className="font-semibold">Billing Days:</strong> 
            <span className="font-mono">{bill.present_days} days</span>
          </p>
          
          <div className="pt-4 border-t border-green-300">
            <p className="flex justify-between items-center">
              <strong className="text-lg">Subtotal Calculation ({bill.present_days} x ₹{bill.amount_per_day}):</strong>
              <span className="text-lg font-bold text-green-700">₹{bill.present_days * bill.amount_per_day}</span>
            </p>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between items-center font-extrabold text-2xl text-green-900 bg-green-200 p-3 rounded-lg mt-3 shadow-md">
              <span className="uppercase">Total Amount Due:</span>
              <span>₹{bill.total_amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STUDENT BILL HISTORY TAB
// ============================================
function StudentBillHistoryTab({ billHistory }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h5 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <History className="w-6 h-6 mr-2 text-green-500" /> Previous Bills History
      </h5>
      
      {billHistory.length === 0 ? (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
          No previous bill history found.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Month/Year</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Days</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Present Days</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave Days</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billHistory.map(bill => (
                <tr key={bill.bill_id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(bill.year, bill.month - 1).toLocaleString('default', { month: 'long' })} {bill.year}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">{bill.total_days}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">{bill.present_days}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">{bill.leave_days}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-extrabold text-green-600">₹{bill.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================
// SHARED UTILITY COMPONENTS
// ============================================

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

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
            {text}
        </span>
    );
}

function StatCard({ title, value, color, icon, footer }) {
    return (
        <div className={`rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 ${color} text-white`}>
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium opacity-80">{title}</h3>
                    {icon && React.cloneElement(icon, { className: "w-8 h-8 opacity-70" })}
                </div>
                <p className="mt-2 text-4xl font-extrabold">{value}</p>
            </div>
            {footer && (
                <div className="bg-black bg-opacity-10 p-2 text-xs font-light text-center">
                    {footer}
                </div>
            )}
        </div>
    );
}

function InfoPill({ label, value }) {
    return (
        <div className="flex flex-col p-2 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
            <span className="text-base font-semibold text-gray-800 mt-0.5">{value}</span>
        </div>
    );
}