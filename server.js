const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, 'public')));

// Northflank Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Config & Timetable API
app.get('/api/config', (req, res) => {
  try {
    const config = db.getConfig();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/config', (req, res) => {
  try {
    const updated = db.updateConfig(req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Students API
app.get('/api/students', (req, res) => {
  try {
    const students = db.getStudents();
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/students', (req, res) => {
  try {
    const { rollNo, name, regNo, gender } = req.body;
    if (!rollNo || !name) {
      return res.status(400).json({ success: false, error: 'Roll number and name are required' });
    }
    const student = db.addStudent({ rollNo, name, regNo, gender });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/students/:id', (req, res) => {
  try {
    const updated = db.updateStudent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/students/:id', (req, res) => {
  try {
    const deleted = db.deleteStudent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.json({ success: true, message: 'Student removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/students/import', (req, res) => {
  try {
    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid students array' });
    }
    const saved = db.importStudents(students);
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/students/reset', (req, res) => {
  try {
    const resetList = db.resetStudents();
    res.json({ success: true, data: resetList, message: 'Reset to default IT B students' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Attendance API
// Get single period attendance
app.get('/api/attendance', (req, res) => {
  try {
    const { date, period } = req.query;
    if (!date || !period) {
      return res.status(400).json({ success: false, error: 'Date and period are required' });
    }
    const record = db.getAttendance(date, period);
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save single period attendance
app.post('/api/attendance', (req, res) => {
  try {
    const { date, period, subject, records, notes } = req.body;
    if (!date || !period || !records) {
      return res.status(400).json({ success: false, error: 'Date, period, and records are required' });
    }
    const saved = db.saveAttendance(date, period, subject, records, notes);
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get full day attendance (all 8 periods)
app.get('/api/attendance/day', (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, error: 'Date is required' });
    }
    const dayData = db.getDayAttendance(date);
    res.json({ success: true, data: dayData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete attendance record
app.delete('/api/attendance', (req, res) => {
  try {
    const { date, period } = req.query;
    if (!date || !period) {
      return res.status(400).json({ success: false, error: 'Date and period are required' });
    }
    const deleted = db.deleteAttendance(date, period);
    res.json({ success: true, message: deleted ? 'Attendance cleared' : 'Record not found' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Analytics & Reports
app.get('/api/analytics', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = db.getAnalytics(startDate, endDate);
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CSV Export
app.get('/api/export/csv', (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).send('Date parameter is required');
    }
    const csvContent = db.generateDailyCSV(date);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="IT_B_Attendance_${date}.csv"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`IT B Attendance System running on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(`Northflank ready on 0.0.0.0:${PORT}`);
  console.log(`=========================================`);
});
