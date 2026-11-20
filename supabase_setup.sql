-- ========================================================
-- IT - B HOURLY ATTENDANCE SYSTEM - SUPABASE SCHEMA SETUP
-- Paste this entire script into your Supabase SQL Editor and click RUN
-- ========================================================

-- 1. Create Students Table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  roll_no TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  reg_no TEXT DEFAULT '',
  gender TEXT DEFAULT 'M',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Attendance Table (keyed by date and period, e.g. 2026-11-20_P1)
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  period INTEGER NOT NULL,
  subject TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  records JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy queries by date
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- 3. Create Class Config Table
CREATE TABLE IF NOT EXISTS class_config (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL
);

-- 4. Enable Row Level Security (RLS) & Allow Public Read/Write for our app API
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_config ENABLE ROW LEVEL SECURITY;

-- Create Open Policies (Anon can read & write for Class attendance)
DROP POLICY IF EXISTS "Public access students" ON students;
CREATE POLICY "Public access students" ON students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access attendance" ON attendance;
CREATE POLICY "Public access attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access config" ON class_config;
CREATE POLICY "Public access config" ON class_config FOR ALL USING (true) WITH CHECK (true);

-- 5. Seed Initial Class Config
INSERT INTO class_config (key, data)
VALUES (
  'config',
  '{
    "className": "IT - B",
    "academicYear": "2024 - 2028",
    "semester": "Semester 5",
    "tutorName": "Class Advisor",
    "crName": "Class Representative",
    "thresholdPercent": 75,
    "periods": [
      { "id": 1, "name": "Period 1", "time": "08:45 - 09:35", "defaultSubject": "Web Technologies" },
      { "id": 2, "name": "Period 2", "time": "09:35 - 10:25", "defaultSubject": "Cloud Computing" },
      { "id": 3, "name": "Period 3", "time": "10:40 - 11:30", "defaultSubject": "Data Science & AI" },
      { "id": 4, "name": "Period 4", "time": "11:30 - 12:20", "defaultSubject": "Cyber Security" },
      { "id": 5, "name": "Period 5", "time": "01:10 - 02:00", "defaultSubject": "Software Engineering" },
      { "id": 6, "name": "Period 6", "time": "02:00 - 02:50", "defaultSubject": "Mobile App Dev" },
      { "id": 7, "name": "Period 7", "time": "03:00 - 03:45", "defaultSubject": "Placement Training" },
      { "id": 8, "name": "Period 8", "time": "03:45 - 04:30", "defaultSubject": "Library / Seminar" }
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 6. Seed Default 55 IT - B Students
INSERT INTO students (id, roll_no, name, reg_no, gender)
VALUES
  ('1', '22ITB01', 'Aakash M', '730422205001', 'M'),
  ('2', '22ITB02', 'Abinaya S', '730422205002', 'F'),
  ('3', '22ITB03', 'Aditya Raj', '730422205003', 'M'),
  ('4', '22ITB04', 'Ajith Kumar K', '730422205004', 'M'),
  ('5', '22ITB05', 'Ananya Ramesh', '730422205005', 'F'),
  ('6', '22ITB06', 'Aravind Swamy', '730422205006', 'M'),
  ('7', '22ITB07', 'Archana V', '730422205007', 'F'),
  ('8', '22ITB08', 'Arun Prakash G', '730422205008', 'M'),
  ('9', '22ITB09', 'Balamurugan R', '730422205009', 'M'),
  ('10', '22ITB10', 'Bhavani Devi K', '730422205010', 'F'),
  ('11', '22ITB11', 'Chandru S', '730422205011', 'M'),
  ('12', '22ITB12', 'Deepak Kumar S', '730422205012', 'M'),
  ('13', '22ITB13', 'Dharani P', '730422205013', 'F'),
  ('14', '22ITB14', 'Dinesh Karthik M', '730422205014', 'M'),
  ('15', '22ITB15', 'Divya Bharathi R', '730422205015', 'F'),
  ('16', '22ITB16', 'Ganesh Moorthy B', '730422205016', 'M'),
  ('17', '22ITB17', 'Gokulnath T', '730422205017', 'M'),
  ('18', '22ITB18', 'Harini Sree V', '730422205018', 'F'),
  ('19', '22ITB19', 'Hariharan K', '730422205019', 'M'),
  ('20', '22ITB20', 'Janani M', '730422205020', 'F'),
  ('21', '22ITB21', 'Jeeva Ananth V', '730422205021', 'M'),
  ('22', '22ITB22', 'Karthikeyan P', '730422205022', 'M'),
  ('23', '22ITB23', 'Kavitha N', '730422205023', 'F'),
  ('24', '22ITB24', 'Kishore Kumar R', '730422205024', 'M'),
  ('25', '22ITB25', 'Madhan Raj S', '730422205025', 'M'),
  ('26', '22ITB26', 'Manojkumar T', '730422205026', 'M'),
  ('27', '22ITB27', 'Meena Priya S', '730422205027', 'F'),
  ('28', '22ITB28', 'Monish Kannan K', '730422205028', 'M'),
  ('29', '22ITB29', 'Nandhini G', '730422205029', 'F'),
  ('30', '22ITB30', 'Naveen Prasath C', '730422205030', 'M'),
  ('31', '22ITB31', 'Nithya Sri D', '730422205031', 'F'),
  ('32', '22ITB32', 'Pavithra K', '730422205032', 'F'),
  ('33', '22ITB33', 'Pradeep Chandran', '730422205033', 'M'),
  ('34', '22ITB34', 'Praveen Raj M', '730422205034', 'M'),
  ('35', '22ITB35', 'Preethi S', '730422205035', 'F'),
  ('36', '22ITB36', 'Raghavan S', '730422205036', 'M'),
  ('37', '22ITB37', 'Rahul V', '730422205037', 'M'),
  ('38', '22ITB38', 'Ramya Krishnan', '730422205038', 'F'),
  ('39', '22ITB39', 'Rithvik Sharma', '730422205039', 'M'),
  ('40', '22ITB40', 'Rohit Balaji', '730422205040', 'M'),
  ('41', '22ITB41', 'Sandhiya M', '730422205041', 'F'),
  ('42', '22ITB42', 'Sanjay Kumar P', '730422205042', 'M'),
  ('43', '22ITB43', 'Santhosh S', '730422205043', 'M'),
  ('44', '22ITB44', 'Saravanan R', '730422205044', 'M'),
  ('45', '22ITB45', 'Sneha R', '730422205045', 'F'),
  ('46', '22ITB46', 'Sowmiya T', '730422205046', 'F'),
  ('47', '22ITB47', 'Sri Ram K', '730422205047', 'M'),
  ('48', '22ITB48', 'Subash Chandra Bose', '730422205048', 'M'),
  ('49', '22ITB49', 'Swetha B', '730422205049', 'F'),
  ('50', '22ITB50', 'Vigneshwaran M', '730422205050', 'M'),
  ('51', '22ITB51', 'Vijay Anand S', '730422205051', 'M'),
  ('52', '22ITB52', 'Vishnu Vardhan P', '730422205052', 'M'),
  ('53', '22ITB53', 'Yogalakshmi K', '730422205053', 'F'),
  ('54', '22ITB54', 'Yuvan Shankar G', '730422205054', 'M'),
  ('55', '22ITB55', 'Zahir Hussain M', '730422205055', 'M')
ON CONFLICT (roll_no) DO NOTHING;
