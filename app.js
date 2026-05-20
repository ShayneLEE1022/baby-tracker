// === Baby Sleep Tracker App ===

// Configuration
const STORAGE_KEY = 'babyTracker_records';
const CATEGORIES = {
    milk: { name: '奶量', icon: '🍼', color: '#FFB5A7' },
    food: { name: '辅食', icon: '🥣', color: '#FFAB76' },
    diaper: { name: '尿布', icon: '👶', color: '#A8E6CF' },
    sleep: { name: '睡眠', icon: '😴', color: '#C3B1E1' },
    supplement: { name: '补剂', icon: '💊', color: '#FFEAA7' },
    outdoor: { name: '外出', icon: '🏠', color: '#A8D8EA' }
};

// State
let records = [];
let currentTab = 'home';
let selectedDate = new Date();
let currentRecordId = null;
let currentEditCategory = null;

// Form Templates
const FORM_TEMPLATES = {
    milk: () => `
        <div class="form-group">
            <label class="form-label">记录日期</label>
            <input type="date" class="form-input" data-field="recordDate" value="${getDateKey(new Date())}">
        </div>
        <div class="form-group">
            <label class="form-label">喂养方式</label>
            <div class="radio-group" data-field="method">
                <div class="radio-item" data-value="breast">母乳</div>
                <div class="radio-item" data-value="formula">配方奶</div>
                <div class="radio-item" data-value="mixed">混合</div>
            </div>
        </div>
        <div class="form-group" id="formula-amount">
            <label class="form-label">奶量 (ml)</label>
            <input type="number" class="form-input" data-field="amount" placeholder="请输入奶量">
        </div>
        <div class="form-group" id="breast-duration" style="display:none;">
            <label class="form-label">喂养时长 (分钟)</label>
            <input type="number" class="form-input" data-field="duration" placeholder="请输入时长">
        </div>
        <div class="form-group" id="breast-side" style="display:none;">
            <label class="form-label">喂养侧</label>
            <div class="radio-group" data-field="side">
                <div class="radio-item" data-value="left">左侧</div>
                <div class="radio-item" data-value="right">右侧</div>
                <div class="radio-item" data-value="both">两侧</div>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">时间</label>
            <input type="time" class="form-input" data-field="time" value="${getCurrentTime()}">
        </div>
        <div class="form-group">
            <label class="form-label">备注</label>
            <input type="text" class="form-input" data-field="note" placeholder="选填，如"吃得很好"">
        </div>
    `,
    food: () => `
        <div class="form-group">
            <label class="form-label">记录日期</label>
            <input type="date" class="form-input" data-field="recordDate" value="${getDateKey(new Date())}">
        </div>
        <div class="form-group">
            <label class="form-label">食物名称</label>
            <input type="text" class="form-input" data-field="foodName" placeholder="如"米糊"、"南瓜泥"">
        </div>
        <div class="form-group">
            <label class="form-label">食物类别</label>
            <div class="radio-group" data-field="foodType">
                <div class="radio-item" data-value="grain">谷物</div>
                <div class="radio-item" data-value="vegetable">蔬菜</div>
                <div class="radio-item" data-value="fruit">水果</div>
                <div class="radio-item" data-value="meat">肉蛋</div>
                <div class="radio-item" data-value="snack">零食</div>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">进食量</label>
            <div class="radio-group" data-field="amount">
                <div class="radio-item" data-value="little">少量</div>
                <div class="radio-item" data-value="half">一半</div>
                <div class="radio-item" data-value="most">大部分</div>
                <div class="radio-item" data-value="all">全部</div>
            </div>
        </div>
        <div class="toggle-switch">
            <span class="form-label" style="margin:0;">是否新食材</span>
            <div class="toggle-track" data-field="isNew">
                <div class="toggle-thumb"></div>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">时间</label>
            <input type="time" class="form-input" data-field="time" value="${getCurrentTime()}">
        </div>
        <div class="form-group">
            <label class="form-label">备注</label>
            <input type="text" class="form-input" data-field="note" placeholder="选填，如过敏反应、喜好等">
        </div>
    `,
    diaper: () => `
        <div class="form-group">
            <label class="form-label">记录日期</label>
            <input type="date" class="form-input" data-field="recordDate" value="${getDateKey(new Date())}">
        </div>
        <div class="form-group">
            <label class="form-label">尿布类型</label>
            <div class="checkbox-group" data-field="diaperType">
                <div class="checkbox-item" data-value="wet">湿尿布</div>
                <div class="checkbox-item" data-value="poop">便便</div>
                <div class="checkbox-item" data-value="dry">干爽</div>
            </div>
        </div>
        <div class="form-group" id="poop-status" style="display:none;">
            <label class="form-label">便便状态</label>
            <div class="radio-group" data-field="poopStatus">
                <div class="radio-item" data-value="normal">正常</div>
                <div class="radio-item" data-value="loose">偏稀</div>
                <div class="radio-item" data-value="hard">偏硬</div>
                <div class="radio-item" data-value="abnormal">异常</div>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">时间</label>
            <input type="time" class="form-input" data-field="time" value="${getCurrentTime()}">
        </div>
        <div class="form-group">
            <label class="form-label">备注</label>
            <input type="text" class="form-input" data-field="note" placeholder="选填">
        </div>
    `,
    sleep: () => `
        <div class="form-group">
            <label class="form-label">记录日期</label>
            <input type="date" class="form-input" data-field="recordDate" value="${getDateKey(new Date())}">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">入睡时间</label>
                <input type="time" class="form-input" data-field="sleepStart" value="${getCurrentTime()}">
            </div>
            <div class="form-group">
                <label class="form-label">醒来时间</label>
                <input type="time" class="form-input" data-field="sleepEnd" value="${getCurrentTime()}">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">睡眠质量</label>
            <div class="radio-group" data-field="quality">
                <div class="radio-item" data-value="good">安稳</div>
                <div class="radio-item" data-value="normal">一般</div>
                <div class="radio-item" data-value="hard">哄睡困难</div>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">备注</label>
            <input type="text" class="form-input" data-field="note" placeholder="选填，如"午觉"、"夜间睡眠"">
        </div>
    `,
    supplement: () => `
        <div class="form-group">
            <label class="form-label">记录日期</label>
            <input type="date" class="form-input" data-field="recordDate" value="${getDateKey(new Date())}">
        </div>
        <div class="form-group">
            <label class="form-label">补剂名称</label>
            <div class="radio-group" data-field="supplementName">
                <div class="radio-item" data-value="vd">维生素D</div>
                <div class="radio-item" data-value="dha">DHA</div>
                <div class="radio-item" data-value="iron">铁剂</div>
                <div class="radio-item" data-value="calcium">钙</div>
                <div class="radio-item" data-value="other">其他</div>
            </div>
        </div>
        <div class="form-group" id="other-name" style="display:none;">
            <label class="form-label">请输入补剂名称</label>
            <input type="text" class="form-input" data-field="otherName" placeholder="请输入">
        </div>
        <div class="form-group">
            <label class="form-label">剂量</label>
            <input type="text" class="form-input" data-field="dosage" placeholder="如"1滴"、"5ml"">
        </div>
        <div class="form-group">
            <label class="form-label">时间</label>
            <input type="time" class="form-input" data-field="time" value="${getCurrentTime()}">
        </div>
        <div class="form-group">
            <label class="form-label">备注</label>
            <input type="text" class="form-input" data-field="note" placeholder="选填">
        </div>
    `,
    outdoor: () => `
        <div class="form-group">
            <label class="form-label">记录日期</label>
            <input type="date" class="form-input" data-field="recordDate" value="${getDateKey(new Date())}">
        </div>
        <div class="form-group">
            <label class="form-label">外出类型</label>
            <div class="radio-group" data-field="outdoorType">
                <div class="radio-item" data-value="walk">散步</div>
                <div class="radio-item" data-value="stroller">推车</div>
                <div class="radio-item" data-value="playground">游乐场</div>
                <div class="radio-item" data-value="hospital">就医</div>
                <div class="radio-item" data-value="other">其他</div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">开始时间</label>
                <input type="time" class="form-input" data-field="startTime" value="${getCurrentTime()}">
            </div>
            <div class="form-group">
                <label class="form-label">结束时间</label>
                <input type="time" class="form-input" data-field="endTime" value="${getCurrentTime()}">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">备注</label>
            <input type="text" class="form-input" data-field="note" placeholder="选填，如"小区花园"" >
        </div>
    `
};

// Utility Functions
function getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function getDateKey(date) {
    return date.toISOString().split('T')[0];
}

function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (getDateKey(date) === getDateKey(today)) {
        return '今天';
    } else if (getDateKey(date) === getDateKey(yesterday)) {
        return '昨天';
    } else {
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
    }
}

function formatTime(timeStr) {
    return timeStr;
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return '上午好';
    if (hour < 18) return '下午好';
    return '晚上好';
}

// Storage Functions
function loadRecords() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        records = data ? JSON.parse(data) : [];
    } catch (e) {
        records = [];
    }
}

function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function addRecord(record) {
    record.id = Date.now();
    // Use provided date or default to today
    if (!record.date) {
        record.date = getDateKey(new Date());
    }
    records.unshift(record);
    saveRecords();
    updateUI();
}

function deleteRecord(id) {
    records = records.filter(r => r.id !== id);
    saveRecords();
    updateUI();
}

function updateRecord(id, data) {
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
        records[index] = { ...records[index], ...data };
        saveRecords();
        updateUI();
    }
}

// Get records for a specific date
function getRecordsForDate(date) {
    const dateKey = getDateKey(date);
    return records.filter(r => r.date === dateKey).sort((a, b) => {
        // Get the effective time for each record
        const timeA = a.time || a.sleepStart || a.startTime || '00:00';
        const timeB = b.time || b.sleepStart || b.startTime || '00:00';
        return timeA.localeCompare(timeB);
    });
}

// UI Update Functions
function updateUI() {
    updateGreeting();
    updateBadges();
    updateRecentList();
    updateTimeline();
    updateStats();
}

function updateGreeting() {
    const dateEl = document.getElementById('greeting-date');
    const textEl = document.getElementById('greeting-text');
    const today = new Date();
    
    dateEl.textContent = `${today.getMonth() + 1}月${today.getDate()}日 ${['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][today.getDay()]}`;
    textEl.textContent = `${getGreeting()}，木子`;
}

function updateBadges() {
    const todayRecords = getRecordsForDate(new Date());
    
    Object.keys(CATEGORIES).forEach(cat => {
        const count = todayRecords.filter(r => r.category === cat).length;
        const badge = document.getElementById(`badge-${cat}`);
        if (badge) {
            badge.textContent = count;
        }
    });
}

function updateRecentList() {
    const listEl = document.getElementById('recent-list');
    const emptyEl = document.getElementById('home-empty');
    const recentRecords = records.slice(0, 3);
    
    if (recentRecords.length === 0) {
        listEl.innerHTML = '';
        emptyEl.style.display = 'flex';
        return;
    }
    
    emptyEl.style.display = 'none';
    listEl.innerHTML = recentRecords.map(record => {
        const cat = CATEGORIES[record.category];
        // Handle different time fields for different categories
        let displayTime = record.time;
        if (!displayTime && record.category === 'sleep' && record.sleepStart) {
            displayTime = record.sleepStart;
        }
        if (!displayTime && record.category === 'outdoor' && record.startTime) {
            displayTime = record.startTime;
        }
        // Get duration text for recent list
        let durationText = '';
        if (record.category === 'sleep' && record.sleepStart && record.sleepEnd) {
            const start = timeToMinutes(record.sleepStart);
            const end = timeToMinutes(record.sleepEnd);
            let duration = end >= start ? end - start : (end + 1440) - start;
            const hours = Math.floor(duration / 60);
            const mins = duration % 60;
            durationText = hours > 0 ? `${hours}h${mins > 0 ? mins + 'min' : ''}` : `${mins}min`;
        }
        if (record.category === 'outdoor' && record.durationMinutes) {
            const hours = Math.floor(record.durationMinutes / 60);
            const mins = record.durationMinutes % 60;
            durationText = hours > 0 ? `${hours}h${mins > 0 ? mins + 'min' : ''}` : `${mins}min`;
        }
        return `
            <div class="recent-card" data-id="${record.id}">
                <span class="recent-time">${displayTime || '--:--'}</span>
                <span class="recent-icon">${cat.icon}</span>
                <span class="recent-summary">${getRecordSummary(record)}${durationText ? ' ' + durationText : ''}</span>
            </div>
        `;
    }).join('');
    
    // Add click handlers
    listEl.querySelectorAll('.recent-card').forEach(card => {
        card.addEventListener('click', () => showRecordDetail(parseInt(card.dataset.id)));
    });
}

function updateTimeline() {
    const listEl = document.getElementById('timeline-list');
    const emptyEl = document.getElementById('timeline-empty');
    const dateRecords = getRecordsForDate(selectedDate);
    
    // Update date label
    const dateLabel = document.getElementById('date-label');
    const isToday = getDateKey(selectedDate) === getDateKey(new Date());
    if (isToday) {
        dateLabel.textContent = `今天 · ${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`;
    } else {
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        dateLabel.textContent = `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日 ${weekdays[selectedDate.getDay()]}`;
    }
    
    if (dateRecords.length === 0) {
        listEl.innerHTML = '';
        emptyEl.style.display = 'flex';
        return;
    }
    
    emptyEl.style.display = 'none';
    listEl.innerHTML = dateRecords.map(record => {
        const cat = CATEGORIES[record.category];
        // Handle different time fields for different categories
        let displayTime = record.time;
        if (!displayTime && record.category === 'sleep' && record.sleepStart) {
            displayTime = record.sleepStart;
        }
        if (!displayTime && record.category === 'outdoor' && record.startTime) {
            displayTime = record.startTime;
        }
        displayTime = displayTime || '00:00';
        
        // Calculate duration for outdoor
        let durationText = '';
        if (record.category === 'outdoor' && record.durationMinutes) {
            const hours = Math.floor(record.durationMinutes / 60);
            const mins = record.durationMinutes % 60;
            durationText = hours > 0 ? `${hours}小时${mins > 0 ? mins + '分钟' : ''}` : `${mins}分钟`;
        }
        
        return `
            <div class="timeline-item">
                <span class="timeline-time">${displayTime}</span>
                <div class="timeline-dot" style="background:${cat.color}"></div>
                <div class="timeline-content" data-id="${record.id}">
                    <div class="timeline-header">
                        <span class="timeline-icon">${cat.icon}</span>
                        <span class="timeline-title">${getRecordTitle(record)}</span>
                    </div>
                    ${record.note ? `<div class="timeline-detail">${record.note}</div>` : ''}
                    ${durationText ? `<div class="timeline-duration">${durationText}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Add click handlers
    listEl.querySelectorAll('.timeline-content').forEach(content => {
        content.addEventListener('click', () => showRecordDetail(parseInt(content.dataset.id)));
    });
}

function updateStats() {
    const yesterday = new Date(selectedDate);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayRecords = getRecordsForDate(selectedDate);
    const yesterdayRecords = getRecordsForDate(yesterday);
    
    // Milk
    const todayMilk = todayRecords.filter(r => r.category === 'milk');
    const yesterdayMilk = yesterdayRecords.filter(r => r.category === 'milk');
    const todayMilkTotal = todayMilk.reduce((sum, r) => sum + (parseInt(r.amount) || 0), 0);
    const yesterdayMilkTotal = yesterdayMilk.reduce((sum, r) => sum + (parseInt(r.amount) || 0), 0);
    document.getElementById('stat-milk').textContent = `${todayMilkTotal}ml`;
    updateCompare('stat-milk', todayMilkTotal, yesterdayMilkTotal, 'ml');
    
    // Food
    const todayFood = todayRecords.filter(r => r.category === 'food').length;
    const yesterdayFood = yesterdayRecords.filter(r => r.category === 'food').length;
    document.getElementById('stat-food').textContent = `${todayFood}次`;
    updateCompare('stat-food', todayFood, yesterdayFood, '次');
    
    // Sleep
    const sleepRecords = calculateTotalSleep(todayRecords);
    const yesterdaySleep = calculateTotalSleep(yesterdayRecords);
    document.getElementById('stat-sleep').textContent = sleepRecords.formatted;
    // Convert minutes to hours for comparison display
    const sleepDiffHours = Math.round((sleepRecords.minutes - yesterdaySleep.minutes) / 60 * 10) / 10;
    const el = document.getElementById('stat-sleep-compare');
    if (sleepDiffHours > 0) {
        el.textContent = `↑${sleepDiffHours}h`;
        el.className = 'stat-compare up';
    } else if (sleepDiffHours < 0) {
        el.textContent = `↓${Math.abs(sleepDiffHours)}h`;
        el.className = 'stat-compare down';
    } else {
        el.textContent = '—';
        el.className = 'stat-compare';
    }
    
    // Diaper
    const todayDiaper = todayRecords.filter(r => r.category === 'diaper').length;
    const yesterdayDiaper = yesterdayRecords.filter(r => r.category === 'diaper').length;
    document.getElementById('stat-diaper').textContent = `${todayDiaper}次`;
    updateCompare('stat-diaper', todayDiaper, yesterdayDiaper, '次');
    
    // Outdoor
    const todayOutdoor = todayRecords.filter(r => r.category === 'outdoor');
    const todayOutdoorMinutes = todayOutdoor.reduce((sum, r) => sum + (r.durationMinutes || 0), 0);
    const yesterdayOutdoor = yesterdayRecords.filter(r => r.category === 'outdoor');
    const yesterdayOutdoorMinutes = yesterdayOutdoor.reduce((sum, r) => sum + (r.durationMinutes || 0), 0);
    const outdoorStr = todayOutdoorMinutes >= 60 ? `${Math.floor(todayOutdoorMinutes / 60)}h${todayOutdoorMinutes % 60 > 0 ? todayOutdoorMinutes % 60 + 'min' : ''}` : `${todayOutdoorMinutes}min`;
    document.getElementById('stat-outdoor').textContent = outdoorStr || '0min';
    updateCompare('stat-outdoor', todayOutdoorMinutes, yesterdayOutdoorMinutes, 'min');
}

function updateCompare(id, today, yesterday, unit) {
    const el = document.getElementById(`${id}-compare`);
    const diff = today - yesterday;
    if (diff > 0) {
        el.textContent = `↑${Math.abs(diff)}${unit}`;
        el.className = 'stat-compare up';
    } else if (diff < 0) {
        el.textContent = `↓${Math.abs(diff)}${unit}`;
        el.className = 'stat-compare down';
    } else {
        el.textContent = '—';
        el.className = 'stat-compare';
    }
}

function calculateTotalSleep(records) {
    let totalMinutes = 0;
    const sleepRecords = records.filter(r => r.category === 'sleep');
    
    sleepRecords.forEach(record => {
        if (record.sleepStart && record.sleepEnd) {
            const start = timeToMinutes(record.sleepStart);
            const end = timeToMinutes(record.sleepEnd);
            // Handle overnight sleep (e.g., 23:00 to 07:00)
            if (end >= start) {
                totalMinutes += end - start;
            } else {
                totalMinutes += (end + 1440) - start;
            }
        }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return {
        minutes: totalMinutes,
        formatted: `${hours}h${mins > 0 ? mins + 'min' : ''}`
    };
}

function timeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

// Record Summary/Title Functions
function getRecordSummary(record) {
    return getRecordTitle(record);
}

function getRecordTitle(record) {
    switch (record.category) {
        case 'milk':
            if (record.method === 'formula') {
                return `配方奶 ${record.amount || ''}ml`;
            } else {
                const sideText = record.side === 'left' ? '左侧' : record.side === 'right' ? '右侧' : '两侧';
                return `母乳 ${sideText} ${record.duration || ''}min`;
            }
        case 'food':
            return record.foodName || '辅食';
        case 'diaper':
            const types = (record.diaperType || []).map(t => t === 'wet' ? '湿尿布' : t === 'poop' ? '便便' : '干爽');
            return types.join('+') || '尿布';
        case 'sleep':
            if (record.sleepStart && record.sleepEnd) {
                const start = timeToMinutes(record.sleepStart);
                const end = timeToMinutes(record.sleepEnd);
                let duration = end >= start ? end - start : (end + 1440) - start;
                const hours = Math.floor(duration / 60);
                const mins = duration % 60;
                return `睡眠 ${hours}h${mins > 0 ? mins + 'min' : ''}`;
            }
            return '睡眠';
        case 'supplement':
            const names = { vd: '维生素D', dha: 'DHA', iron: '铁剂', calcium: '钙', other: record.otherName || '其他' };
            return `${names[record.supplementName] || '补剂'} ${record.dosage || ''}`;
        case 'outdoor':
            const types2 = { walk: '散步', stroller: '推车', playground: '游乐场', hospital: '就医', other: '其他' };
            return types2[record.outdoorType] || '外出';
        default:
            return '';
    }
}

// Sheet Functions
function showSheet(category) {
    currentEditCategory = category;
    currentRecordId = null;
    
    const sheet = document.getElementById('bottom-sheet');
    const overlay = document.getElementById('sheet-overlay');
    const title = document.getElementById('sheet-title');
    const body = document.getElementById('sheet-body');
    
    title.textContent = `记录${CATEGORIES[category].name}`;
    body.innerHTML = FORM_TEMPLATES[category]();
    
    sheet.classList.add('active');
    overlay.classList.add('active');
    
    setupFormListeners(category);
}

function hideSheet() {
    const sheet = document.getElementById('bottom-sheet');
    const overlay = document.getElementById('sheet-overlay');
    sheet.classList.remove('active');
    overlay.classList.remove('active');
    currentEditCategory = null;
    currentRecordId = null;
}

function showRecordDetail(id) {
    const record = records.find(r => r.id === id);
    if (!record) return;
    
    currentRecordId = id;
    
    const sheet = document.getElementById('detail-sheet');
    const overlay = document.getElementById('sheet-overlay');
    const title = document.getElementById('detail-sheet-title');
    const body = document.getElementById('detail-sheet-body');
    
    title.textContent = `${CATEGORIES[record.category].icon} ${CATEGORIES[record.category].name}`;
    body.innerHTML = getDetailHTML(record);
    
    sheet.classList.add('active');
    overlay.classList.add('active');
}

function hideDetailSheet() {
    const sheet = document.getElementById('detail-sheet');
    const overlay = document.getElementById('sheet-overlay');
    sheet.classList.remove('active');
    overlay.classList.remove('active');
    currentRecordId = null;
}

function getDetailHTML(record) {
    const lines = [];
    // Handle time display for different categories
    let displayTime = record.time;
    if (!displayTime && record.category === 'sleep' && record.sleepStart) {
        displayTime = record.sleepStart;
    }
    if (!displayTime && record.category === 'outdoor' && record.startTime) {
        displayTime = record.startTime;
    }
    lines.push(`<div class="detail-item"><span class="detail-label">时间</span><span class="detail-value">${displayTime || '--:--'}</span></div>`);
    
    switch (record.category) {
        case 'milk':
            if (record.method === 'formula') {
                lines.push(`<div class="detail-item"><span class="detail-label">喂养方式</span><span class="detail-value">配方奶</span></div>`);
                lines.push(`<div class="detail-item"><span class="detail-label">奶量</span><span class="detail-value">${record.amount}ml</span></div>`);
            } else {
                lines.push(`<div class="detail-item"><span class="detail-label">喂养方式</span><span class="detail-value">母乳</span></div>`);
                if (record.side) {
                    const sides = { left: '左侧', right: '右侧', both: '两侧' };
                    lines.push(`<div class="detail-item"><span class="detail-label">喂养侧</span><span class="detail-value">${sides[record.side]}</span></div>`);
                }
                if (record.duration) {
                    lines.push(`<div class="detail-item"><span class="detail-label">时长</span><span class="detail-value">${record.duration}分钟</span></div>`);
                }
            }
            break;
        case 'food':
            lines.push(`<div class="detail-item"><span class="detail-label">食物</span><span class="detail-value">${record.foodName}</span></div>`);
            if (record.foodType) {
                const types = { grain: '谷物', vegetable: '蔬菜', fruit: '水果', meat: '肉蛋', snack: '零食' };
                lines.push(`<div class="detail-item"><span class="detail-label">类别</span><span class="detail-value">${types[record.foodType]}</span></div>`);
            }
            if (record.amount) {
                const amounts = { little: '少量', half: '一半', most: '大部分', all: '全部' };
                lines.push(`<div class="detail-item"><span class="detail-label">进食量</span><span class="detail-value">${amounts[record.amount]}</span></div>`);
            }
            if (record.isNew) {
                lines.push(`<div class="detail-item"><span class="detail-label">新食材</span><span class="detail-value">是</span></div>`);
            }
            break;
        case 'diaper':
            const types = (record.diaperType || []).map(t => t === 'wet' ? '湿尿布' : t === 'poop' ? '便便' : '干爽');
            lines.push(`<div class="detail-item"><span class="detail-label">类型</span><span class="detail-value">${types.join('+')}</span></div>`);
            if (record.poopStatus) {
                const statuses = { normal: '正常', loose: '偏稀', hard: '偏硬', abnormal: '异常' };
                lines.push(`<div class="detail-item"><span class="detail-label">便便状态</span><span class="detail-value">${statuses[record.poopStatus]}</span></div>`);
            }
            break;
        case 'sleep':
            if (record.sleepStart && record.sleepEnd) {
                lines.push(`<div class="detail-item"><span class="detail-label">入睡时间</span><span class="detail-value">${record.sleepStart}</span></div>`);
                lines.push(`<div class="detail-item"><span class="detail-label">醒来时间</span><span class="detail-value">${record.sleepEnd}</span></div>`);
                // Calculate duration
                const start = timeToMinutes(record.sleepStart);
                const end = timeToMinutes(record.sleepEnd);
                let duration = end >= start ? end - start : (end + 1440) - start;
                const hours = Math.floor(duration / 60);
                const mins = duration % 60;
                lines.push(`<div class="detail-item"><span class="detail-label">睡眠时长</span><span class="detail-value">${hours}小时${mins > 0 ? mins + '分钟' : ''}</span></div>`);
            }
            if (record.quality) {
                const qualities = { good: '安稳', normal: '一般', hard: '哄睡困难' };
                lines.push(`<div class="detail-item"><span class="detail-label">质量</span><span class="detail-value">${qualities[record.quality]}</span></div>`);
            }
            break;
        case 'supplement':
            const names = { vd: '维生素D', dha: 'DHA', iron: '铁剂', calcium: '钙', other: '其他' };
            lines.push(`<div class="detail-item"><span class="detail-label">补剂</span><span class="detail-value">${names[record.supplementName] || '其他'}${record.otherName ? ` (${record.otherName})` : ''}</span></div>`);
            lines.push(`<div class="detail-item"><span class="detail-label">剂量</span><span class="detail-value">${record.dosage}</span></div>`);
            break;
        case 'outdoor':
            const outdoorTypes = { walk: '散步', stroller: '推车', playground: '游乐场', hospital: '就医', other: '其他' };
            lines.push(`<div class="detail-item"><span class="detail-label">类型</span><span class="detail-value">${outdoorTypes[record.outdoorType]}</span></div>`);
            if (record.startTime && record.endTime) {
                lines.push(`<div class="detail-item"><span class="detail-label">开始时间</span><span class="detail-value">${record.startTime}</span></div>`);
                lines.push(`<div class="detail-item"><span class="detail-label">结束时间</span><span class="detail-value">${record.endTime}</span></div>`);
                lines.push(`<div class="detail-item"><span class="detail-label">时长</span><span class="detail-value">${record.durationMinutes || 0}分钟</span></div>`);
            }
            break;
    }
    
    if (record.note) {
        lines.push(`<div class="detail-item"><span class="detail-label">备注</span><span class="detail-value">${record.note}</span></div>`);
    }
    
    return lines.join('');
}

function setupFormListeners(category) {
    const body = document.getElementById('sheet-body');
    
    // Radio groups
    body.querySelectorAll('.radio-group').forEach(group => {
        group.querySelectorAll('.radio-item').forEach(item => {
            item.addEventListener('click', () => {
                group.querySelectorAll('.radio-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
            });
        });
    });
    
    // Checkbox groups
    body.querySelectorAll('.checkbox-group').forEach(group => {
        group.querySelectorAll('.checkbox-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
            });
        });
    });
    
    // Toggle switches
    body.querySelectorAll('.toggle-track').forEach(track => {
        track.addEventListener('click', () => {
            track.classList.toggle('active');
        });
    });
    
    // Category-specific listeners
    if (category === 'milk') {
        const methodGroup = body.querySelector('[data-field="method"]');
        if (methodGroup) {
            methodGroup.querySelectorAll('.radio-item').forEach(item => {
                item.addEventListener('click', () => {
                    const isFormula = item.dataset.value === 'formula';
                    document.getElementById('formula-amount').style.display = isFormula ? 'block' : 'none';
                    document.getElementById('breast-duration').style.display = isFormula ? 'none' : 'block';
                    document.getElementById('breast-side').style.display = isFormula ? 'none' : 'block';
                });
            });
        }
    }
    
    if (category === 'diaper') {
        const diaperGroup = body.querySelector('[data-field="diaperType"]');
        if (diaperGroup) {
            diaperGroup.querySelectorAll('.checkbox-item').forEach(item => {
                item.addEventListener('click', () => {
                    const hasPoop = diaperGroup.querySelector('.checkbox-item[data-value="poop"].selected');
                    document.getElementById('poop-status').style.display = hasPoop ? 'block' : 'none';
                });
            });
        }
    }
    
    if (category === 'supplement') {
        const supplementGroup = body.querySelector('[data-field="supplementName"]');
        if (supplementGroup) {
            supplementGroup.querySelectorAll('.radio-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById('other-name').style.display = item.dataset.value === 'other' ? 'block' : 'none';
                });
            });
        }
    }
}

function collectFormData() {
    const body = document.getElementById('sheet-body');
    const data = { category: currentEditCategory };
    
    // Text/Number inputs
    body.querySelectorAll('.form-input').forEach(input => {
        const field = input.dataset.field;
        if (field) {
            data[field] = input.value;
        }
    });
    
    // Radio groups (single selection)
    body.querySelectorAll('.radio-group').forEach(group => {
        const field = group.dataset.field;
        const selected = group.querySelector('.radio-item.selected');
        if (field && selected) {
            data[field] = selected.dataset.value;
        }
    });
    
    // Checkbox groups (multiple selection)
    body.querySelectorAll('.checkbox-group').forEach(group => {
        const field = group.dataset.field;
        const selected = group.querySelectorAll('.checkbox-item.selected');
        if (field) {
            data[field] = Array.from(selected).map(item => item.dataset.value);
        }
    });
    
    // Toggle switches
    body.querySelectorAll('.toggle-track').forEach(track => {
        const field = track.dataset.field;
        if (field) {
            data[field] = track.classList.contains('active');
        }
    });
    
    // Calculate duration for outdoor
    if (currentEditCategory === 'outdoor' && data.startTime && data.endTime) {
        const start = timeToMinutes(data.startTime);
        const end = timeToMinutes(data.endTime);
        data.durationMinutes = end >= start ? end - start : (end + 1440) - start;
    }
    
    // Set time field for sleep records (use sleepStart as the main time)
    if (currentEditCategory === 'sleep' && data.sleepStart) {
        data.time = data.sleepStart;
    }
    // Set time field for outdoor records (use startTime as the main time)
    if (currentEditCategory === 'outdoor' && data.startTime) {
        data.time = data.startTime;
    }
    
    // Use selected date if provided
    if (data.recordDate) {
        data.date = data.recordDate;
    }
    
    return data;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// Voice Input (Simulated)
let voiceTimeout = null;

function startVoiceInput() {
    const modal = document.getElementById('voice-modal');
    const status = document.getElementById('voice-modal-status');
    const text = document.getElementById('voice-modal-text');
    
    modal.classList.add('active');
    status.textContent = '正在聆听...';
    text.textContent = '';
    
    // Simulate voice recognition after 3 seconds
    voiceTimeout = setTimeout(() => {
        stopVoiceInput();
        
        // Parse the simulated text
        const simulatedTexts = [
            '刚喝了120毫升奶',
            '换了尿布是湿的',
            '睡了1个半小时',
            '吃了南瓜泥大部分'
        ];
        const result = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
        
        const voiceResult = document.getElementById('voice-result');
        const voiceResultText = document.getElementById('voice-result-text');
        voiceResult.style.display = 'block';
        voiceResultText.textContent = result;
        
        // Parse and show form
        const parsed = parseVoiceInput(result);
        if (parsed.category) {
            showSheet(parsed.category);
            // Pre-fill the form based on parsed data
            setTimeout(() => prefillForm(parsed), 100);
        }
    }, 3000);
}

function stopVoiceInput() {
    clearTimeout(voiceTimeout);
    const modal = document.getElementById('voice-modal');
    modal.classList.remove('active');
}

function parseVoiceInput(text) {
    const result = { category: null };
    
    if (text.includes('奶') || text.includes('喝')) {
        result.category = 'milk';
        const ml = text.match(/(\d+)\s*(?:毫升|ml|ml)/i);
        if (ml) result.amount = ml[1];
    } else if (text.includes('尿布') || text.includes('尿')) {
        result.category = 'diaper';
        if (text.includes('湿')) result.diaperType = ['wet'];
        else if (text.includes('便')) result.diaperType = ['poop'];
        else result.diaperType = ['wet'];
    } else if (text.includes('睡') || text.includes('觉')) {
        result.category = 'sleep';
        result.sleepType = text.includes('醒') ? 'wake' : 'sleep';
        const hours = text.match(/(\d+)\s*(?:个)?半?[时小时]/);
        if (hours) result.duration = parseInt(hours[1]) * 60;
    } else if (text.includes('吃') || text.includes('辅食') || text.includes('泥') || text.includes('糊')) {
        result.category = 'food';
        if (text.includes('南瓜')) result.foodName = '南瓜泥';
        const amounts = text.includes('全部') ? 'all' : text.includes('大部分') ? 'most' : text.includes('一半') ? 'half' : 'little';
        result.amount = amounts;
    }
    
    return result;
}

function prefillForm(parsed) {
    const body = document.getElementById('sheet-body');
    
    if (parsed.amount) {
        const amountInput = body.querySelector('[data-field="amount"]');
        if (amountInput) amountInput.value = parsed.amount;
    }
    
    if (parsed.diaperType) {
        parsed.diaperType.forEach(type => {
            const item = body.querySelector(`[data-value="${type}"]`);
            if (item) item.classList.add('selected');
        });
    }
    
    if (parsed.sleepType) {
        const item = body.querySelector(`[data-value="${parsed.sleepType}"]`);
        if (item) item.classList.add('selected');
    }
    
    if (parsed.foodName) {
        const foodInput = body.querySelector('[data-field="foodName"]');
        if (foodInput) foodInput.value = parsed.foodName;
    }
    
    if (parsed.amount) {
        const amountItems = body.querySelectorAll('[data-field="amount"] .radio-item');
        amountItems.forEach(item => {
            if (item.dataset.value === parsed.amount) item.classList.add('selected');
        });
    }
}

// Tab Navigation
function switchTab(tab) {
    currentTab = tab;
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    
    document.getElementById(`page-${tab}`).classList.add('active');
    document.querySelector(`.tab-item[data-tab="${tab}"]`).classList.add('active');
    
    if (tab === 'timeline') {
        updateTimeline();
        updateStats();
    }
}

// Date Navigation
function changeDate(delta) {
    selectedDate.setDate(selectedDate.getDate() + delta);
    updateTimeline();
    updateStats();
}

// Event Listeners
function initEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // View all
    document.getElementById('btn-view-all').addEventListener('click', () => switchTab('timeline'));
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => showSheet(card.dataset.category));
    });
    
    // Sheet controls
    document.getElementById('sheet-close').addEventListener('click', hideSheet);
    document.getElementById('sheet-overlay').addEventListener('click', hideSheet);
    document.getElementById('sheet-save').addEventListener('click', () => {
        const data = collectFormData();
        addRecord(data);
        hideSheet();
        showToast('记录成功');
    });
    
    // Detail sheet
    document.getElementById('detail-sheet-close').addEventListener('click', hideDetailSheet);
    document.getElementById('detail-sheet-delete').addEventListener('click', () => {
        if (currentRecordId) {
            deleteRecord(currentRecordId);
            hideDetailSheet();
            showToast('已删除');
        }
    });
    document.getElementById('detail-sheet-edit').addEventListener('click', () => {
        const record = records.find(r => r.id === currentRecordId);
        if (record) {
            hideDetailSheet();
            showSheet(record.category);
            // Note: Full edit functionality would require pre-filling the form
        }
    });
    
    // Date navigation
    document.getElementById('date-prev').addEventListener('click', () => changeDate(-1));
    document.getElementById('date-next').addEventListener('click', () => changeDate(1));
    
    // Voice input
    document.getElementById('voice-btn').addEventListener('click', startVoiceInput);
    document.getElementById('voice-modal-stop').addEventListener('click', stopVoiceInput);
}

// Initialize App
function init() {
    loadRecords();
    initEventListeners();
    updateUI();
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
