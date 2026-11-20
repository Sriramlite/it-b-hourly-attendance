// State Management
const state = {
  config: null,
  students: [],
  currentDate: getTodayString(),
  currentPeriod: 1,
  currentRecords: {}, // { studentId: 'P' | 'A' | 'OD' | 'L' }
  dayData: {}, // { 1: session, 2: session, ... }
  checkedStudents: new Set(),
  analyticsData: null
};

// Helper: Format Date to YYYY-MM-DD
function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Live Clock in Header
function startClock() {
  const clockEl = document.getElementById('header-clock');
  const update = () => {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  };
  update();
  setInterval(update, 1000);
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-indigo-600';
  const icon = type === 'success' ? 'ph-check-circle' : type === 'error' ? 'ph-warning-circle' : 'ph-info';

  toast.className = `toast pointer-events-auto px-4 py-2.5 rounded-xl text-white shadow-xl flex items-center space-x-2 text-xs font-semibold ${bg}`;
  toast.innerHTML = `<i class="ph ${icon} text-base"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Switch between Tabs
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-sm', 'shadow-indigo-500/30');
    btn.classList.add('text-slate-400');
  });

  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-indigo-600', 'text-white', 'shadow-sm', 'shadow-indigo-500/30');
    activeBtn.classList.remove('text-slate-400');
  }

  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
  });

  const activeContent = document.getElementById(`tab-${tabName}`);
  if (activeContent) {
    activeContent.classList.remove('hidden');
  }

  if (tabName === 'matrix') {
    document.getElementById('matrix-date').value = state.currentDate;
    loadDayMatrix();
  } else if (tabName === 'analytics') {
    loadAnalytics();
  } else if (tabName === 'students') {
    renderManageStudentsTable();
  }
}

// Date offset button handler
function setDateOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  document.getElementById('attendance-date').value = dateStr;
  state.currentDate = dateStr;
  loadCurrentPeriodAttendance();
}

// Initial API Load
async function init() {
  startClock();

  try {
    // 1. Fetch Config
    const configRes = await fetch('/api/config');
    const configJson = await configRes.json();
    if (configJson.success) {
      state.config = configJson.data;
    }

    // 2. Fetch Students
    const studentsRes = await fetch('/api/students');
    const studentsJson = await studentsRes.json();
    if (studentsJson.success) {
      state.students = studentsJson.data;
    }

    // Set initial date in input
    const dateInput = document.getElementById('attendance-date');
    dateInput.value = state.currentDate;
    dateInput.addEventListener('change', (e) => {
      state.currentDate = e.target.value;
      loadCurrentPeriodAttendance();
    });

    // Render Period pills
    renderPeriodPills();

    // Load attendance for current date & period 1
    await loadCurrentPeriodAttendance();

  } catch (err) {
    console.error('Initialization error:', err);
    showToast('Failed to connect to server', 'error');
  }
}

// Render the 8 Period selector pills
function renderPeriodPills() {
  const container = document.getElementById('periods-pill-container');
  if (!container || !state.config) return;

  container.innerHTML = '';
  const periods = state.config.periods || [];

  periods.forEach(p => {
    const isActive = p.id === state.currentPeriod;
    const isSaved = state.dayData[p.id] != null;

    const div = document.createElement('div');
    div.className = `period-pill rounded-xl p-2.5 border text-center transition flex flex-col justify-between ${
      isActive 
        ? 'active bg-indigo-600 border-indigo-400 text-white shadow-lg' 
        : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
    } ${isSaved ? 'is-saved' : ''}`;

    div.onclick = () => selectPeriod(p.id);

    div.innerHTML = `
      <div class="flex items-center justify-between text-[11px] font-semibold mb-1">
        <span>P${p.id}</span>
        ${isSaved 
          ? '<span class="w-2 h-2 rounded-full bg-emerald-400" title="Saved"></span>' 
          : '<span class="w-1.5 h-1.5 rounded-full bg-slate-600"></span>'}
      </div>
      <div class="text-[10px] text-slate-400 truncate font-mono">${p.time.split('-')[0].trim()}</div>
    `;

    container.appendChild(div);
  });
}

// Switch Period (1 to 8)
async function selectPeriod(periodId) {
  state.currentPeriod = periodId;
  renderPeriodPills();
  await loadCurrentPeriodAttendance();
}

// Fetch Attendance for Current Date & Period
async function loadCurrentPeriodAttendance() {
  try {
    // Also fetch full day status to mark saved periods in pills
    const dayRes = await fetch(`/api/attendance/day?date=${state.currentDate}`);
    const dayJson = await dayRes.json();
    if (dayJson.success) {
      state.dayData = dayJson.data;
    }

    renderPeriodPills();

    // Fetch this period's record
    const res = await fetch(`/api/attendance?date=${state.currentDate}&period=${state.currentPeriod}`);
    const json = await res.json();

    const periodConfig = (state.config.periods || []).find(p => p.id === state.currentPeriod) || {};
    const subjectInput = document.getElementById('period-subject');
    const notesInput = document.getElementById('period-notes');
    const statusText = document.getElementById('period-saved-status');

    if (json.success && json.data) {
      // Existing saved record found
      state.currentRecords = json.data.records || {};
      subjectInput.value = json.data.subject || periodConfig.defaultSubject || '';
      notesInput.value = json.data.notes || '';
      statusText.textContent = `✓ Saved (${Object.values(state.currentRecords).filter(v => v === 'P' || v === 'OD').length}/${state.students.length} Present)`;
      statusText.className = 'text-xs font-semibold text-emerald-400';
    } else {
      // No record yet: default all students to 'P' (Present) for convenience
      state.currentRecords = {};
      state.students.forEach(s => {
        state.currentRecords[s.id] = 'P';
      });
      subjectInput.value = periodConfig.defaultSubject || '';
      notesInput.value = '';
      statusText.textContent = '○ Not saved yet (Default: All Present)';
      statusText.className = 'text-xs font-semibold text-amber-400/80';
    }

    state.checkedStudents.clear();
    const checkAll = document.getElementById('check-all-students');
    if (checkAll) checkAll.checked = false;

    renderStudentList();
    updateStatsAndAnnouncement();

  } catch (err) {
    console.error('Failed to load attendance:', err);
    showToast('Failed to fetch period attendance', 'error');
  }
}

// Render Student Attendance Roster List
function renderStudentList() {
  const container = document.getElementById('student-list-container');
  if (!container) return;

  const searchQuery = (document.getElementById('search-student')?.value || '').trim().toLowerCase();
  const genderFilter = document.getElementById('filter-gender')?.value || 'ALL';

  container.innerHTML = '';

  const filteredStudents = state.students.filter(s => {
    const matchSearch = s.rollNo.toLowerCase().includes(searchQuery) || s.name.toLowerCase().includes(searchQuery);
    const matchGender = genderFilter === 'ALL' || s.gender === genderFilter;
    return matchSearch && matchGender;
  });

  const countBadge = document.getElementById('visible-student-count');
  if (countBadge) countBadge.textContent = filteredStudents.length;

  if (filteredStudents.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <i class="ph ph-magnifying-glass text-3xl mb-2"></i>
        <p class="text-sm">No students match current search / filter.</p>
      </div>
    `;
    return;
  }

  filteredStudents.forEach((student, index) => {
    const status = state.currentRecords[student.id] || 'P';
    const isChecked = state.checkedStudents.has(student.id);

    const row = document.createElement('div');
    row.id = `student-row-${student.id}`;
    row.className = `student-row flex items-center justify-between px-4 py-3 transition hover:bg-slate-700/30 student-row-${status}`;

    row.innerHTML = `
      <!-- Left: Checkbox & Info -->
      <div class="flex items-center space-x-3 min-w-0">
        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleStudentCheck('${student.id}', this.checked)" class="w-4 h-4 rounded border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500">
        <div class="flex flex-col">
          <div class="flex items-center space-x-2">
            <span class="font-mono font-bold text-xs ${status === 'A' ? 'text-rose-400 font-extrabold' : 'text-indigo-300'}">${student.rollNo}</span>
            <span class="text-sm font-semibold text-slate-100 truncate">${student.name}</span>
          </div>
          <span class="text-[11px] text-slate-400">Reg: ${student.regNo || 'N/A'} • ${student.gender === 'F' ? 'Female' : 'Male'}</span>
        </div>
      </div>

      <!-- Right: Status Toggle Buttons (P, A, OD, L) -->
      <div class="flex items-center space-x-1.5 shrink-0">
        <button onclick="setStatus('${student.id}', 'P')" class="status-btn px-2.5 py-1 rounded-md text-xs font-semibold ${status === 'P' ? 'selected-P' : 'bg-slate-800 text-slate-400 hover:text-emerald-400'}">P</button>
        <button onclick="setStatus('${student.id}', 'A')" class="status-btn px-2.5 py-1 rounded-md text-xs font-semibold ${status === 'A' ? 'selected-A' : 'bg-slate-800 text-slate-400 hover:text-rose-400'}">A</button>
        <button onclick="setStatus('${student.id}', 'OD')" class="status-btn px-2 py-1 rounded-md text-[11px] font-semibold ${status === 'OD' ? 'selected-OD' : 'bg-slate-800 text-slate-400 hover:text-sky-400'}" title="On Duty">OD</button>
        <button onclick="setStatus('${student.id}', 'L')" class="status-btn px-2 py-1 rounded-md text-[11px] font-semibold ${status === 'L' ? 'selected-L' : 'bg-slate-800 text-slate-400 hover:text-amber-400'}" title="Late">L</button>
      </div>
    `;

    container.appendChild(row);
  });
}

// Single student status change
function setStatus(studentId, newStatus) {
  state.currentRecords[studentId] = newStatus;
  updateStudentRow(studentId);
  updateStatsAndAnnouncement();
}

// Update specific student row styling in DOM without re-rendering whole list
function updateStudentRow(studentId) {
  const row = document.getElementById(`student-row-${studentId}`);
  if (!row) return;

  const status = state.currentRecords[studentId] || 'P';
  row.className = `student-row flex items-center justify-between px-4 py-3 transition hover:bg-slate-700/30 student-row-${status}`;

  const buttons = row.querySelectorAll('.status-btn');
  buttons.forEach(btn => {
    const text = btn.textContent.trim();
    btn.className = `status-btn px-2.5 py-1 rounded-md text-xs font-semibold ${text === status ? `selected-${status}` : 'bg-slate-800 text-slate-400'}`;
  });
}

// Bulk Actions: SELECT ALL PRESENT / SELECT ALL ABSENT
function selectAllStatus(status) {
  state.students.forEach(s => {
    state.currentRecords[s.id] = status;
  });
  renderStudentList();
  updateStatsAndAnnouncement();
  showToast(status === 'P' ? 'All students marked Present' : 'All students marked Absent', status === 'P' ? 'success' : 'error');
}

// Bulk Actions: Invert Status (P <-> A)
function invertStatus() {
  state.students.forEach(s => {
    const current = state.currentRecords[s.id] || 'P';
    state.currentRecords[s.id] = (current === 'P') ? 'A' : 'P';
  });
  renderStudentList();
  updateStatsAndAnnouncement();
  showToast('Inverted attendance status', 'info');
}

// Checkbox selection for multi-student operations
function toggleStudentCheck(studentId, isChecked) {
  if (isChecked) {
    state.checkedStudents.add(studentId);
  } else {
    state.checkedStudents.delete(studentId);
  }
}

function toggleSelectAllRows(isChecked) {
  if (isChecked) {
    state.students.forEach(s => state.checkedStudents.add(s.id));
  } else {
    state.checkedStudents.clear();
  }
  renderStudentList();
}

function applyBatchToChecked(status) {
  if (state.checkedStudents.size === 0) {
    showToast('Select one or more students using checkboxes first', 'error');
    return;
  }
  state.checkedStudents.forEach(id => {
    state.currentRecords[id] = status;
  });
  renderStudentList();
  updateStatsAndAnnouncement();
  showToast(`Marked ${state.checkedStudents.size} students as ${status}`, 'success');
}

// Filter students on typing search or changing gender dropdown
function filterStudents() {
  renderStudentList();
}

// Real-time calculations: Total, Present, Absent, OD, WhatsApp Announcement
function updateStatsAndAnnouncement() {
  const total = state.students.length;
  let present = 0;
  let absent = 0;
  let od = 0;
  let late = 0;

  const absenteesList = [];

  state.students.forEach(s => {
    const status = state.currentRecords[s.id] || 'P';
    if (status === 'P') present++;
    else if (status === 'A') {
      absent++;
      absenteesList.push(s);
    }
    else if (status === 'OD') od++;
    else if (status === 'L') late++;
  });

  const presentPct = total > 0 ? Math.round(((present + od + late) / total) * 100) : 0;
  const absentPct = total > 0 ? Math.round((absent / total) * 100) : 0;

  // Update Stats Cards
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-present').textContent = present;
  document.getElementById('stat-present-pct').textContent = `(${presentPct}%)`;
  document.getElementById('stat-absent').textContent = absent;
  document.getElementById('stat-absent-pct').textContent = `(${absentPct}%)`;
  document.getElementById('stat-od').textContent = od;
  document.getElementById('stat-late').textContent = `+${late} Late`;

  // Update Absentee Badge & List
  const absenteeBadge = document.getElementById('absentee-badge-count');
  if (absenteeBadge) absenteeBadge.textContent = absenteesList.length;

  const absenteeContainer = document.getElementById('absentee-list-items');
  if (absenteeContainer) {
    if (absenteesList.length === 0) {
      absenteeContainer.innerHTML = `<p class="text-xs text-slate-500 italic py-2 text-center">🎉 100% Attendance! No absentees in this period.</p>`;
    } else {
      absenteeContainer.innerHTML = absenteesList.map(s => `
        <div class="flex items-center justify-between p-2 rounded-lg bg-rose-950/20 border border-rose-900/30 text-xs">
          <div class="flex items-center space-x-2">
            <span class="font-mono font-bold text-rose-400">${s.rollNo}</span>
            <span class="text-slate-200 font-medium">${s.name}</span>
          </div>
          <button onclick="setStatus('${s.id}', 'P')" class="text-[10px] text-emerald-400 hover:underline">Mark Present</button>
        </div>
      `).join('');
    }
  }

  // Generate WhatsApp Announcement Format
  generateWhatsAppAnnouncement(absenteesList, total, present, absent, od, late);
}

// Generate formatted announcement for WhatsApp
function generateWhatsAppAnnouncement(absentees, total, present, absent, od, late) {
  const preview = document.getElementById('whatsapp-preview');
  if (!preview) return;

  const periodConfig = (state.config?.periods || []).find(p => p.id === state.currentPeriod) || {};
  const subject = document.getElementById('period-subject')?.value || periodConfig.defaultSubject || 'Class';
  const staff = document.getElementById('period-staff')?.value || '';

  const absenteeRolls = absentees.map(s => s.rollNo.replace('22ITB', '')).join(', ');

  const text = 
`📋 *IT - B HOURLY ATTENDANCE*
📅 *Date:* ${state.currentDate}
⏰ *Period ${state.currentPeriod}* (${periodConfig.time || 'N/A'})
📖 *Subject:* ${subject} ${staff ? `(Faculty: ${staff})` : ''}

👥 *Total Strength:* ${total}
✅ *Present:* ${present + od + late} (${Math.round(((present + od + late) / total) * 100)}%)
❌ *Absent:* ${absent}
${od > 0 ? `🏅 *On Duty (OD):* ${od}\n` : ''}${late > 0 ? `⏰ *Late:* ${late}\n` : ''}
🔴 *Absentees (${absent}):*
${absentees.length > 0 ? absentees.map(s => `• ${s.rollNo} - ${s.name}`).join('\n') : '• None (Full Attendance)'}

_Report generated via IT-B Attendance Portal_`;

  preview.textContent = text;
}

// Copy WhatsApp Message to Clipboard
async function copyWhatsAppMessage() {
  const text = document.getElementById('whatsapp-preview')?.textContent || '';
  try {
    await navigator.clipboard.writeText(text);
    const btnText = document.getElementById('copy-btn-text');
    if (btnText) {
      btnText.textContent = 'Copied!';
      setTimeout(() => { btnText.textContent = 'Copy Text'; }, 2000);
    }
    showToast('WhatsApp announcement copied to clipboard!', 'success');
  } catch (err) {
    showToast('Failed to copy text', 'error');
  }
}

// Save Current Period Attendance to Backend
async function saveCurrentPeriodAttendance() {
  const saveBtn = document.getElementById('save-btn');
  const originalText = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<i class="ph ph-spinner animate-spin"></i><span>Saving...</span>`;

  try {
    const subject = document.getElementById('period-subject').value;
    const notes = document.getElementById('period-notes').value;

    const payload = {
      date: state.currentDate,
      period: state.currentPeriod,
      subject,
      notes,
      records: state.currentRecords
    };

    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (json.success) {
      showToast(`Period ${state.currentPeriod} attendance saved!`, 'success');
      state.dayData[state.currentPeriod] = json.data;
      renderPeriodPills();
      const statusText = document.getElementById('period-saved-status');
      statusText.textContent = `✓ Saved (${Object.values(state.currentRecords).filter(v => v === 'P' || v === 'OD').length}/${state.students.length} Present)`;
      statusText.className = 'text-xs font-semibold text-emerald-400';
    } else {
      showToast(json.error || 'Failed to save', 'error');
    }
  } catch (err) {
    showToast('Network error while saving attendance', 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalText;
  }
}

// ==========================================
// TAB 2: DAY MATRIX (8 PERIODS SPREADSHEET)
// ==========================================
async function loadDayMatrix() {
  const date = document.getElementById('matrix-date').value || state.currentDate;
  const tbody = document.getElementById('matrix-tbody');
  tbody.innerHTML = `<tr><td colspan="12" class="text-center py-8 text-slate-400"><i class="ph ph-spinner animate-spin mr-2"></i>Loading day records...</td></tr>`;

  try {
    const res = await fetch(`/api/attendance/day?date=${date}`);
    const json = await res.json();
    if (!json.success) return;

    const dayData = json.data || {};
    tbody.innerHTML = '';

    state.students.forEach(student => {
      let presentCount = 0;
      let markedPeriods = 0;

      const cells = [];
      for (let p = 1; p <= 8; p++) {
        const session = dayData[p];
        const status = (session && session.records && session.records[student.id]) ? session.records[student.id] : null;

        if (status) {
          markedPeriods++;
          if (status === 'P' || status === 'OD' || status === 'L') presentCount++;
        }

        let badgeClass = 'text-slate-600';
        let label = '-';
        if (status === 'P') {
          badgeClass = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
          label = 'P';
        } else if (status === 'A') {
          badgeClass = 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold';
          label = 'A';
        } else if (status === 'OD') {
          badgeClass = 'bg-sky-500/20 text-sky-400 border border-sky-500/30';
          label = 'OD';
        } else if (status === 'L') {
          badgeClass = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
          label = 'L';
        }

        cells.push(`<td class="px-2 py-2.5 text-center"><span class="inline-block px-1.5 py-0.5 rounded text-[11px] ${badgeClass}">${label}</span></td>`);
      }

      const dayPct = markedPeriods > 0 ? Math.round((presentCount / markedPeriods) * 100) : '-';

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-700/20';
      tr.innerHTML = `
        <td class="px-4 py-2.5 font-mono text-indigo-300 font-bold">${student.rollNo}</td>
        <td class="px-4 py-2.5 text-slate-100">${student.name}</td>
        ${cells.join('')}
        <td class="px-3 py-2.5 text-center text-slate-300">${presentCount}/${markedPeriods}</td>
        <td class="px-3 py-2.5 text-center font-bold ${dayPct !== '-' && dayPct < 75 ? 'text-rose-400' : 'text-emerald-400'}">${dayPct === '-' ? '-' : `${dayPct}%`}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="12" class="text-center py-6 text-rose-400">Failed to load day matrix data.</td></tr>`;
  }
}

function exportCSVCurrentDate() {
  const date = document.getElementById('matrix-date').value || state.currentDate;
  window.open(`/api/export/csv?date=${date}`, '_blank');
}

// ==========================================
// TAB 3: ANALYTICS & DEFAULTERS
// ==========================================
async function loadAnalytics() {
  try {
    const res = await fetch('/api/analytics');
    const json = await res.json();
    if (!json.success) return;

    state.analyticsData = json.data;
    const { totalSessions, totalStudents, averageAttendance, defaultersCount, studentStats, defaulters } = json.data;

    document.getElementById('ana-total-periods').textContent = totalSessions;
    document.getElementById('ana-class-avg').textContent = `${averageAttendance}%`;
    document.getElementById('ana-defaulters-count').textContent = defaultersCount;
    document.getElementById('ana-students-count').textContent = totalStudents;

    // Defaulters Section
    const defaulterSection = document.getElementById('defaulters-alert-section');
    const defaulterGrid = document.getElementById('defaulters-cards-grid');
    const defaulterCountEl = document.getElementById('defaulter-list-count');

    if (defaulters && defaulters.length > 0) {
      defaulterSection.classList.remove('hidden');
      defaulterCountEl.textContent = defaulters.length;
      defaulterGrid.innerHTML = defaulters.map(d => `
        <div class="bg-slate-900/90 border border-rose-800/40 rounded-xl p-3 shadow">
          <div class="flex items-center justify-between mb-1">
            <span class="font-mono text-xs font-bold text-rose-400">${d.student.rollNo}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">${d.percentage}%</span>
          </div>
          <p class="text-xs font-semibold text-slate-100 truncate">${d.student.name}</p>
          <div class="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Attended: <b class="text-slate-200">${d.effectivePresent}/${d.totalConducted}</b> periods</span>
            <span class="text-rose-400 font-semibold">Below 75%</span>
          </div>
        </div>
      `).join('');
    } else {
      defaulterSection.classList.add('hidden');
    }

    renderAnalyticsTable(studentStats);

  } catch (err) {
    console.error('Failed to load analytics:', err);
  }
}

function renderAnalyticsTable(stats) {
  const tbody = document.getElementById('analytics-tbody');
  if (!tbody || !stats) return;

  const searchQuery = (document.getElementById('search-analytics')?.value || '').trim().toLowerCase();

  const filtered = stats.filter(s => 
    s.student.rollNo.toLowerCase().includes(searchQuery) || 
    s.student.name.toLowerCase().includes(searchQuery)
  );

  tbody.innerHTML = filtered.map(stat => {
    const isDefaulter = stat.isDefaulter;
    const badge = isDefaulter 
      ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">Defaulter (&lt;75%)</span>'
      : '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Good Standing</span>';

    return `
      <tr class="hover:bg-slate-700/20">
        <td class="px-4 py-2.5 font-mono font-bold text-indigo-300">${stat.student.rollNo}</td>
        <td class="px-4 py-2.5 text-slate-100">${stat.student.name}</td>
        <td class="px-3 py-2.5 text-center text-slate-300">${stat.totalConducted}</td>
        <td class="px-3 py-2.5 text-center text-emerald-400 font-semibold">${stat.present}</td>
        <td class="px-3 py-2.5 text-center text-rose-400 font-semibold">${stat.absent}</td>
        <td class="px-3 py-2.5 text-center text-sky-400">${stat.od + stat.late}</td>
        <td class="px-4 py-2.5 text-center font-bold ${isDefaulter ? 'text-rose-400 text-sm' : 'text-emerald-400'}">${stat.percentage}%</td>
        <td class="px-4 py-2.5 text-center">${badge}</td>
      </tr>
    `;
  }).join('');
}

function filterAnalyticsTable() {
  if (state.analyticsData && state.analyticsData.studentStats) {
    renderAnalyticsTable(state.analyticsData.studentStats);
  }
}

// ==========================================
// TAB 4: MANAGE STUDENTS (CRUD)
// ==========================================
function renderManageStudentsTable() {
  const tbody = document.getElementById('manage-students-tbody');
  if (!tbody) return;

  tbody.innerHTML = state.students.map((student, idx) => `
    <tr class="hover:bg-slate-700/20">
      <td class="px-4 py-2.5 text-slate-500">${idx + 1}</td>
      <td class="px-4 py-2.5 font-mono font-bold text-indigo-300">${student.rollNo}</td>
      <td class="px-4 py-2.5 font-semibold text-slate-100">${student.name}</td>
      <td class="px-4 py-2.5 font-mono text-slate-400">${student.regNo || '-'}</td>
      <td class="px-4 py-2.5 text-slate-300">${student.gender === 'F' ? 'Female' : 'Male'}</td>
      <td class="px-4 py-2.5 text-right space-x-2">
        <button onclick="openEditStudentModal('${student.id}')" class="text-indigo-400 hover:text-indigo-300 text-xs font-semibold">Edit</button>
        <button onclick="deleteStudent('${student.id}')" class="text-rose-400 hover:text-rose-300 text-xs font-semibold">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openAddStudentModal() {
  document.getElementById('student-modal-title').textContent = 'Add New Student';
  document.getElementById('modal-student-id').value = '';
  document.getElementById('modal-roll').value = '';
  document.getElementById('modal-name').value = '';
  document.getElementById('modal-reg').value = '';
  document.getElementById('modal-gender').value = 'M';
  document.getElementById('student-modal').classList.remove('hidden');
}

function openEditStudentModal(id) {
  const student = state.students.find(s => s.id === id);
  if (!student) return;

  document.getElementById('student-modal-title').textContent = 'Edit Student Details';
  document.getElementById('modal-student-id').value = student.id;
  document.getElementById('modal-roll').value = student.rollNo;
  document.getElementById('modal-name').value = student.name;
  document.getElementById('modal-reg').value = student.regNo || '';
  document.getElementById('modal-gender').value = student.gender || 'M';
  document.getElementById('student-modal').classList.remove('hidden');
}

function closeStudentModal() {
  document.getElementById('student-modal').classList.add('hidden');
}

async function saveStudentFromModal() {
  const id = document.getElementById('modal-student-id').value;
  const rollNo = document.getElementById('modal-roll').value.trim();
  const name = document.getElementById('modal-name').value.trim();
  const regNo = document.getElementById('modal-reg').value.trim();
  const gender = document.getElementById('modal-gender').value;

  if (!rollNo || !name) {
    showToast('Roll number and name are required', 'error');
    return;
  }

  try {
    let res;
    if (id) {
      // Update
      res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo, name, regNo, gender })
      });
    } else {
      // Add
      res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo, name, regNo, gender })
      });
    }

    const json = await res.json();
    if (json.success) {
      showToast(id ? 'Student updated successfully' : 'Student added successfully', 'success');
      closeStudentModal();
      // Reload students
      const freshRes = await fetch('/api/students');
      const freshJson = await freshRes.json();
      if (freshJson.success) {
        state.students = freshJson.data;
        renderManageStudentsTable();
        renderStudentList();
      }
    } else {
      showToast(json.error || 'Failed to save student', 'error');
    }
  } catch (err) {
    showToast('Network error saving student', 'error');
  }
}

async function deleteStudent(id) {
  if (!confirm('Are you sure you want to remove this student?')) return;

  try {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Student deleted', 'info');
      state.students = state.students.filter(s => s.id !== id);
      renderManageStudentsTable();
      renderStudentList();
    }
  } catch (err) {
    showToast('Failed to delete student', 'error');
  }
}

async function resetDefaultStudents() {
  if (!confirm('Reset roster back to default 55 IT - B students?')) return;

  try {
    const res = await fetch('/api/students/reset', { method: 'POST' });
    const json = await res.json();
    if (json.success) {
      state.students = json.data;
      renderManageStudentsTable();
      renderStudentList();
      showToast('Roster reset to default IT - B students', 'success');
    }
  } catch (err) {
    showToast('Failed to reset students', 'error');
  }
}

// Bulk Import Modal
function openImportModal() {
  document.getElementById('import-modal').classList.remove('hidden');
}

function closeImportModal() {
  document.getElementById('import-modal').classList.add('hidden');
}

async function processBulkImport() {
  const text = document.getElementById('import-csv-textarea').value.trim();
  if (!text) {
    showToast('Please paste CSV records first', 'error');
    return;
  }

  const lines = text.split('\n');
  const students = [];

  lines.forEach(line => {
    const parts = line.split(',').map(p => p.trim());
    if (parts.length >= 2 && parts[0] && parts[1]) {
      students.push({
        rollNo: parts[0],
        name: parts[1],
        regNo: parts[2] || '',
        gender: parts[3] ? parts[3].toUpperCase() : 'M'
      });
    }
  });

  if (students.length === 0) {
    showToast('No valid student rows recognized. Format: RollNo, Name, RegNo, Gender', 'error');
    return;
  }

  try {
    const res = await fetch('/api/students/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students })
    });
    const json = await res.json();
    if (json.success) {
      state.students = json.data;
      renderManageStudentsTable();
      renderStudentList();
      closeImportModal();
      showToast(`Imported ${json.data.length} students successfully!`, 'success');
    }
  } catch (err) {
    showToast('Failed to import student list', 'error');
  }
}

// Start application on load
window.addEventListener('DOMContentLoaded', init);
