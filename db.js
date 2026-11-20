const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const ATTENDANCE_FILE = path.join(DATA_DIR, 'attendance.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default 8 periods timetable schedule
const DEFAULT_PERIODS = [
  { id: 1, name: 'Period 1', time: '08:45 - 09:35', defaultSubject: 'Web Technologies' },
  { id: 2, name: 'Period 2', time: '09:35 - 10:25', defaultSubject: 'Cloud Computing' },
  { id: 3, name: 'Period 3', time: '10:40 - 11:30', defaultSubject: 'Data Science & AI' },
  { id: 4, name: 'Period 4', time: '11:30 - 12:20', defaultSubject: 'Cyber Security' },
  { id: 5, name: 'Period 5', time: '01:10 - 02:00', defaultSubject: 'Software Engineering' },
  { id: 6, name: 'Period 6', time: '02:00 - 02:50', defaultSubject: 'Mobile App Dev' },
  { id: 7, name: 'Period 7', time: '03:00 - 03:45', defaultSubject: 'Placement Training' },
  { id: 8, name: 'Period 8', time: '03:45 - 04:30', defaultSubject: 'Library / Seminar' },
];

// Default sample students for IT B
const DEFAULT_STUDENTS = [
  { id: '1', rollNo: '22ITB01', name: 'Aakash M', regNo: '730422205001', gender: 'M' },
  { id: '2', rollNo: '22ITB02', name: 'Abinaya S', regNo: '730422205002', gender: 'F' },
  { id: '3', rollNo: '22ITB03', name: 'Aditya Raj', regNo: '730422205003', gender: 'M' },
  { id: '4', rollNo: '22ITB04', name: 'Ajith Kumar K', regNo: '730422205004', gender: 'M' },
  { id: '5', rollNo: '22ITB05', name: 'Ananya Ramesh', regNo: '730422205005', gender: 'F' },
  { id: '6', rollNo: '22ITB06', name: 'Aravind Swamy', regNo: '730422205006', gender: 'M' },
  { id: '7', rollNo: '22ITB07', name: 'Archana V', regNo: '730422205007', gender: 'F' },
  { id: '8', rollNo: '22ITB08', name: 'Arun Prakash G', regNo: '730422205008', gender: 'M' },
  { id: '9', rollNo: '22ITB09', name: 'Balamurugan R', regNo: '730422205009', gender: 'M' },
  { id: '10', rollNo: '22ITB10', name: 'Bhavani Devi K', regNo: '730422205010', gender: 'F' },
  { id: '11', rollNo: '22ITB11', name: 'Chandru S', regNo: '730422205011', gender: 'M' },
  { id: '12', rollNo: '22ITB12', name: 'Deepak Kumar S', regNo: '730422205012', gender: 'M' },
  { id: '13', rollNo: '22ITB13', name: 'Dharani P', regNo: '730422205013', gender: 'F' },
  { id: '14', rollNo: '22ITB14', name: 'Dinesh Karthik M', regNo: '730422205014', gender: 'M' },
  { id: '15', rollNo: '22ITB15', name: 'Divya Bharathi R', regNo: '730422205015', gender: 'F' },
  { id: '16', rollNo: '22ITB16', name: 'Ganesh Moorthy B', regNo: '730422205016', gender: 'M' },
  { id: '17', rollNo: '22ITB17', name: 'Gokulnath T', regNo: '730422205017', gender: 'M' },
  { id: '18', rollNo: '22ITB18', name: 'Harini Sree V', regNo: '730422205018', gender: 'F' },
  { id: '19', rollNo: '22ITB19', name: 'Hariharan K', regNo: '730422205019', gender: 'M' },
  { id: '20', rollNo: '22ITB20', name: 'Janani M', regNo: '730422205020', gender: 'F' },
  { id: '21', rollNo: '22ITB21', name: 'Jeeva Ananth V', regNo: '730422205021', gender: 'M' },
  { id: '22', rollNo: '22ITB22', name: 'Karthikeyan P', regNo: '730422205022', gender: 'M' },
  { id: '23', rollNo: '22ITB23', name: 'Kavitha N', regNo: '730422205023', gender: 'F' },
  { id: '24', rollNo: '22ITB24', name: 'Kishore Kumar R', regNo: '730422205024', gender: 'M' },
  { id: '25', rollNo: '22ITB25', name: 'Madhan Raj S', regNo: '730422205025', gender: 'M' },
  { id: '26', rollNo: '22ITB26', name: 'Manojkumar T', regNo: '730422205026', gender: 'M' },
  { id: '27', rollNo: '22ITB27', name: 'Meena Priya S', regNo: '730422205027', gender: 'F' },
  { id: '28', rollNo: '22ITB28', name: 'Monish Kannan K', regNo: '730422205028', gender: 'M' },
  { id: '29', rollNo: '22ITB29', name: 'Nandhini G', regNo: '730422205029', gender: 'F' },
  { id: '30', rollNo: '22ITB30', name: 'Naveen Prasath C', regNo: '730422205030', gender: 'M' },
  { id: '31', rollNo: '22ITB31', name: 'Nithya Sri D', regNo: '730422205031', gender: 'F' },
  { id: '32', rollNo: '22ITB32', name: 'Pavithra K', regNo: '730422205032', gender: 'F' },
  { id: '33', rollNo: '22ITB33', name: 'Pradeep Chandran', regNo: '730422205033', gender: 'M' },
  { id: '34', rollNo: '22ITB34', name: 'Praveen Raj M', regNo: '730422205034', gender: 'M' },
  { id: '35', rollNo: '22ITB35', name: 'Preethi S', regNo: '730422205035', gender: 'F' },
  { id: '36', rollNo: '22ITB36', name: 'Raghavan S', regNo: '730422205036', gender: 'M' },
  { id: '37', rollNo: '22ITB37', name: 'Rahul V', regNo: '730422205037', gender: 'M' },
  { id: '38', rollNo: '22ITB38', name: 'Ramya Krishnan', regNo: '730422205038', gender: 'F' },
  { id: '39', rollNo: '22ITB39', name: 'Rithvik Sharma', regNo: '730422205039', gender: 'M' },
  { id: '40', rollNo: '22ITB40', name: 'Rohit Balaji', regNo: '730422205040', gender: 'M' },
  { id: '41', rollNo: '22ITB41', name: 'Sandhiya M', regNo: '730422205041', gender: 'F' },
  { id: '42', rollNo: '22ITB42', name: 'Sanjay Kumar P', regNo: '730422205042', gender: 'M' },
  { id: '43', rollNo: '22ITB43', name: 'Santhosh S', regNo: '730422205043', gender: 'M' },
  { id: '44', rollNo: '22ITB44', name: 'Saravanan R', regNo: '730422205044', gender: 'M' },
  { id: '45', rollNo: '22ITB45', name: 'Sneha R', regNo: '730422205045', gender: 'F' },
  { id: '46', rollNo: '22ITB46', name: 'Sowmiya T', regNo: '730422205046', gender: 'F' },
  { id: '47', rollNo: '22ITB47', name: 'Sri Ram K', regNo: '730422205047', gender: 'M' },
  { id: '48', rollNo: '22ITB48', name: 'Subash Chandra Bose', regNo: '730422205048', gender: 'M' },
  { id: '49', rollNo: '22ITB49', name: 'Swetha B', regNo: '730422205049', gender: 'F' },
  { id: '50', rollNo: '22ITB50', name: 'Vigneshwaran M', regNo: '730422205050', gender: 'M' },
  { id: '51', rollNo: '22ITB51', name: 'Vijay Anand S', regNo: '730422205051', gender: 'M' },
  { id: '52', rollNo: '22ITB52', name: 'Vishnu Vardhan P', regNo: '730422205052', gender: 'M' },
  { id: '53', rollNo: '22ITB53', name: 'Yogalakshmi K', regNo: '730422205053', gender: 'F' },
  { id: '54', rollNo: '22ITB54', name: 'Yuvan Shankar G', regNo: '730422205054', gender: 'M' },
  { id: '55', rollNo: '22ITB55', name: 'Zahir Hussain M', regNo: '730422205055', gender: 'M' }
];

// Read JSON helper
function readJson(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) {
      writeJson(filePath, defaultValue);
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

// Write JSON helper (atomic write)
function writeJson(filePath, data) {
  const tmpPath = `${filePath}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpPath, filePath);
}

// Initialize files if not existing
function initDb() {
  if (!fs.existsSync(STUDENTS_FILE)) {
    writeJson(STUDENTS_FILE, DEFAULT_STUDENTS);
  }
  if (!fs.existsSync(ATTENDANCE_FILE)) {
    writeJson(ATTENDANCE_FILE, {});
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    writeJson(CONFIG_FILE, {
      className: 'IT - B',
      academicYear: '2024 - 2028',
      semester: 'Semester 5',
      tutorName: 'Class Advisor',
      crName: 'Class Representative',
      thresholdPercent: 75,
      periods: DEFAULT_PERIODS
    });
  }
}

initDb();

const db = {
  // Students
  getStudents() {
    return readJson(STUDENTS_FILE, DEFAULT_STUDENTS);
  },

  addStudent(student) {
    const students = this.getStudents();
    const newStudent = {
      id: String(Date.now()),
      rollNo: student.rollNo.trim().toUpperCase(),
      name: student.name.trim(),
      regNo: (student.regNo || '').trim(),
      gender: student.gender || 'M'
    };
    students.push(newStudent);
    // Sort by rollNo
    students.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
    writeJson(STUDENTS_FILE, students);
    return newStudent;
  },

  updateStudent(id, updateData) {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return null;
    students[idx] = {
      ...students[idx],
      rollNo: updateData.rollNo ? updateData.rollNo.trim().toUpperCase() : students[idx].rollNo,
      name: updateData.name ? updateData.name.trim() : students[idx].name,
      regNo: updateData.regNo !== undefined ? updateData.regNo.trim() : students[idx].regNo,
      gender: updateData.gender || students[idx].gender
    };
    students.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
    writeJson(STUDENTS_FILE, students);
    return students[idx];
  },

  deleteStudent(id) {
    const students = this.getStudents();
    const filtered = students.filter(s => s.id !== id);
    if (filtered.length !== students.length) {
      writeJson(STUDENTS_FILE, filtered);
      return true;
    }
    return false;
  },

  resetStudents() {
    writeJson(STUDENTS_FILE, DEFAULT_STUDENTS);
    return DEFAULT_STUDENTS;
  },

  importStudents(list) {
    const students = list.map((s, idx) => ({
      id: String(Date.now() + idx),
      rollNo: (s.rollNo || `22ITB${String(idx + 1).padStart(2, '0')}`).trim().toUpperCase(),
      name: (s.name || `Student ${idx + 1}`).trim(),
      regNo: (s.regNo || '').trim(),
      gender: s.gender || 'M'
    }));
    students.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
    writeJson(STUDENTS_FILE, students);
    return students;
  },

  // Config & Periods
  getConfig() {
    return readJson(CONFIG_FILE, {
      className: 'IT - B',
      academicYear: '2024 - 2028',
      semester: 'Semester 5',
      tutorName: 'Class Advisor',
      crName: 'Class Representative',
      thresholdPercent: 75,
      periods: DEFAULT_PERIODS
    });
  },

  updateConfig(newConfig) {
    const current = this.getConfig();
    const updated = { ...current, ...newConfig };
    writeJson(CONFIG_FILE, updated);
    return updated;
  },

  // Attendance
  // Key format: YYYY-MM-DD_P{period}
  makeKey(date, period) {
    return `${date}_P${period}`;
  },

  getAttendance(date, period) {
    const allAttendance = readJson(ATTENDANCE_FILE, {});
    const key = this.makeKey(date, period);
    return allAttendance[key] || null;
  },

  saveAttendance(date, period, subject, records, notes = '') {
    const allAttendance = readJson(ATTENDANCE_FILE, {});
    const key = this.makeKey(date, period);

    const recordEntry = {
      date,
      period: Number(period),
      subject: subject || '',
      notes: notes || '',
      records, // { [studentId]: "P" | "A" | "OD" | "L" }
      updatedAt: new Date().toISOString()
    };

    allAttendance[key] = recordEntry;
    writeJson(ATTENDANCE_FILE, allAttendance);
    return recordEntry;
  },

  // Get full day attendance for all 8 periods
  getDayAttendance(date) {
    const allAttendance = readJson(ATTENDANCE_FILE, {});
    const result = {};
    for (let p = 1; p <= 8; p++) {
      const key = this.makeKey(date, p);
      result[p] = allAttendance[key] || null;
    }
    return result;
  },

  // Delete attendance record for a specific date and period
  deleteAttendance(date, period) {
    const allAttendance = readJson(ATTENDANCE_FILE, {});
    const key = this.makeKey(date, period);
    if (allAttendance[key]) {
      delete allAttendance[key];
      writeJson(ATTENDANCE_FILE, allAttendance);
      return true;
    }
    return false;
  },

  // Calculate Class Analytics & Defaulters
  getAnalytics(startDate, endDate) {
    const students = this.getStudents();
    const allAttendance = readJson(ATTENDANCE_FILE, {});
    const config = this.getConfig();
    const threshold = config.thresholdPercent || 75;

    // Filter attendance sessions within date range
    const filteredSessions = Object.values(allAttendance).filter(session => {
      if (!session || !session.date) return false;
      if (startDate && session.date < startDate) return false;
      if (endDate && session.date > endDate) return false;
      return true;
    });

    const totalSessions = filteredSessions.length;

    // Initialize stats per student
    const studentStats = {};
    students.forEach(s => {
      studentStats[s.id] = {
        student: s,
        present: 0,
        absent: 0,
        od: 0,
        late: 0,
        totalConducted: 0,
        effectivePresent: 0, // Present + OD counts towards academic attendance
        percentage: 100
      };
    });

    filteredSessions.forEach(session => {
      const records = session.records || {};
      students.forEach(s => {
        const status = records[s.id] || 'A'; // default to Absent if missing
        studentStats[s.id].totalConducted += 1;
        if (status === 'P') {
          studentStats[s.id].present += 1;
          studentStats[s.id].effectivePresent += 1;
        } else if (status === 'OD') {
          studentStats[s.id].od += 1;
          studentStats[s.id].effectivePresent += 1; // On-duty is considered present
        } else if (status === 'L') {
          studentStats[s.id].late += 1;
          studentStats[s.id].effectivePresent += 1; // Late also gets attendance
        } else {
          studentStats[s.id].absent += 1;
        }
      });
    });

    // Compute percentages
    const statsList = Object.values(studentStats).map(stat => {
      const pct = stat.totalConducted > 0 
        ? Math.round((stat.effectivePresent / stat.totalConducted) * 1000) / 10 
        : 100;
      stat.percentage = pct;
      stat.isDefaulter = pct < threshold;
      return stat;
    });

    // Summary counts
    const defaulters = statsList.filter(s => s.isDefaulter);
    const avgAttendance = statsList.length > 0 
      ? Math.round((statsList.reduce((acc, cur) => acc + cur.percentage, 0) / statsList.length) * 10) / 10 
      : 100;

    return {
      totalSessions,
      totalStudents: students.length,
      averageAttendance: avgAttendance,
      threshold,
      defaultersCount: defaulters.length,
      studentStats: statsList,
      defaulters
    };
  },

  // Export Daily Attendance to CSV format
  generateDailyCSV(date) {
    const students = this.getStudents();
    const dayAttendance = this.getDayAttendance(date);
    const config = this.getConfig();

    const headers = [
      'Roll No',
      'Name',
      'Reg No',
      'P1',
      'P2',
      'P3',
      'P4',
      'P5',
      'P6',
      'P7',
      'P8',
      'Total Present',
      'Total Absent',
      'Day %'
    ];

    const rows = [headers.join(',')];

    students.forEach(s => {
      let presentCount = 0;
      let absentCount = 0;
      const periodStatuses = [];

      for (let p = 1; p <= 8; p++) {
        const session = dayAttendance[p];
        const status = (session && session.records && session.records[s.id]) ? session.records[s.id] : '-';
        periodStatuses.push(status);
        if (status === 'P' || status === 'OD' || status === 'L') {
          presentCount++;
        } else if (status === 'A') {
          absentCount++;
        }
      }

      const totalMarked = presentCount + absentCount;
      const dayPct = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

      rows.push([
        s.rollNo,
        `"${s.name}"`,
        s.regNo || '',
        ...periodStatuses,
        presentCount,
        absentCount,
        `${dayPct}%`
      ].join(','));
    });

    return rows.join('\n');
  }
};

module.exports = db;
