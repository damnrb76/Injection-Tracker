document.addEventListener('DOMContentLoaded', function() {
  // Color themes - each with gradient colors and matching text/button colors
  const colorThemes = [
    {
      name: 'Purple Dream',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      primary: '#6b46c1',
      secondary: '#9f7aea',
      button: 'linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4)',
      success: 'linear-gradient(to right, #0ba360, #3cba92)'
    },
    {
      name: 'Ocean Blue',
      gradient: 'linear-gradient(135deg, #12c2e9 0%, #0693e3 50%, #2a5298 100%)',
      primary: '#2c5282',
      secondary: '#4299e1',
      button: 'linear-gradient(to right, #1a78c2, #2b95d6)',
      success: 'linear-gradient(to right, #04a77a, #0cbf85)'
    },
    {
      name: 'Sunset Orange',
      gradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
      primary: '#c05621',
      secondary: '#ed8936',
      button: 'linear-gradient(to right, #f56038, #f57c00)',
      success: 'linear-gradient(to right, #32d296, #26a69a)'
    },
    {
      name: 'Forest Green',
      gradient: 'linear-gradient(135deg, #52c234 0%, #056839 100%)',
      primary: '#2f855a',
      secondary: '#48bb78',
      button: 'linear-gradient(to right, #34d399, #059669)',
      success: 'linear-gradient(to right, #4299e1, #3182ce)'
    },
    {
      name: 'Berry Pink',
      gradient: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
      primary: '#b83280',
      secondary: '#ed64a6',
      button: 'linear-gradient(to right, #ec4899, #db2777)',
      success: 'linear-gradient(to right, #06b6d4, #0284c7)'
    }
  ];

  // App state
  let logs = [];
  let schedule = null;
  let countdown = null;
  let themeIndex = 0;
  let isLoggedIn = false;
  let userDisplayName = ''; 

  // Initialize
  function init() {
    const storedUser = localStorage.getItem('injectionTrackerUser');
    
    if (storedUser) {
      // User has logged in before, so use their stored theme and username
      const userData = JSON.parse(storedUser);
      userDisplayName = userData.name;
      // Each time they log in, we want to change the theme
      themeIndex = (userData.themeIndex + 1) % colorThemes.length;
      
      // Save the updated theme
      localStorage.setItem('injectionTrackerUser', JSON.stringify({
        name: userData.name,
        themeIndex: themeIndex
      }));
      
      loadData();
      showApp();
    } else {
      // New user, show login form
      showLoginForm();
    }
    
    // Apply theme
    applyTheme(themeIndex);
  }

  // Load data from localStorage
  function loadData() {
    try {
      const savedLogs = localStorage.getItem('injectionLogs');
      const savedSchedule = localStorage.getItem('injectionSchedule');
      if (savedLogs) logs = JSON.parse(savedLogs);
      if (savedSchedule) schedule = JSON.parse(savedSchedule);
      updateCountdown();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  // Save data to localStorage
  function saveData() {
    try {
      localStorage.setItem('injectionLogs', JSON.stringify(logs));
      if (schedule) localStorage.setItem('injectionSchedule', JSON.stringify(schedule));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Apply color theme
  function applyTheme(index) {
    const theme = colorThemes[index];
    document.body.style.background = theme.gradient;
    document.body.style.minHeight = '100vh';
    document.body.style.color = '#333';
    
    // Apply theme colors to CSS variables for easier access in styles
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--button-gradient', theme.button);
    document.documentElement.style.setProperty('--success-gradient', theme.success);
    
    // Apply colors to elements
    const primaryElements = document.querySelectorAll('.primary-color');
    const secondaryElements = document.querySelectorAll('.secondary-color');
    const primaryButtons = document.querySelectorAll('.primary-button');
    const successButtons = document.querySelectorAll('.success-button');
    
    primaryElements.forEach(el => el.style.color = theme.primary);
    secondaryElements.forEach(el => el.style.color = theme.secondary);
    
    primaryButtons.forEach(btn => {
      btn.style.background = theme.button;
    });
    
    successButtons.forEach(btn => {
      btn.style.background = theme.success;
    });
  }

  // Update countdown timer
  function updateCountdown() {
    if (!schedule) return;
    
    const nextDate = getNextInjectionDate();
    if (!nextDate) return;
    
    const now = new Date();
    const difference = nextDate.getTime() - now.getTime();
    countdown = Math.ceil(difference / (1000 * 3600 * 24));
    
    // Update countdown display
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
      let message = '';
      if (countdown === 0) {
        message = "Due today!";
      } else if (countdown < 0) {
        message = `Overdue by ${Math.abs(countdown)} days`;
      } else {
        message = `${countdown} days remaining`;
      }
      countdownEl.textContent = message;
    }
  }

  // Calculate next injection date
  function getNextInjectionDate() {
    if (!schedule) return null;
    
    const startDate = new Date(schedule.startDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today - startDate) / (1000 * 3600 * 24));
    const cyclesCompleted = Math.floor(daysSinceStart / schedule.interval);
    
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + ((cyclesCompleted + 1) * schedule.interval));
    
    return nextDate;
  }

  // Get upcoming injection dates
  function getUpcomingDates() {
    if (!schedule) return [];
    
    const dates = [];
    const nextDate = getNextInjectionDate();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(nextDate);
      date.setDate(nextDate.getDate() + (i * schedule.interval));
      dates.push(date);
    }
    
    return dates;
  }

  // Show login form
  function showLoginForm() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
      <div class="login-section">
        <div class="login-card">
          <h1 class="text-2xl font-bold mb-6 text-center primary-color">Welcome to Injection Tracker</h1>
          <form id="login-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1 primary-color">Your Name</label>
              <input 
                type="text" 
                id="username" 
                class="input" 
                placeholder="Enter your name" 
                required
              >
            </div>
            <button 
              type="submit" 
              class="btn primary-button"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    `;
    
    // Handle login form submission
    document.getElementById('login-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      
      if (username) {
        userDisplayName = username;
        // Save user with random theme
        themeIndex = Math.floor(Math.random() * colorThemes.length);
        localStorage.setItem('injectionTrackerUser', JSON.stringify({
          name: username,
          themeIndex: themeIndex
        }));
        
        loadData();
        showApp();
        applyTheme(themeIndex);
      }
    });
  }

  // Show main app after login
  function showApp() {
    const appContainer = document.getElementById('app');
    
    // Generate the HTML for the app
    appContainer.innerHTML = `
      <div class="max-w-4xl mx-auto p-6 space-y-6">
        <header class="flex justify-between items-center mt-8 mb-12">
          <h1 class="text-4xl font-bold text-white">✨ Injection Tracker ✨</h1>
          <div class="flex items-center gap-2">
            <span class="text-white">Hello, ${userDisplayName}</span>
            <button id="logout-btn" class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-sm">Logout</button>
          </div>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Schedule Card -->
          <div class="card">
            <div class="card-header">
              <div class="card-title primary-color">
                <span class="lucide-icon" data-icon="calendar"></span>
                Schedule
              </div>
            </div>
            <div class="card-content space-y-4">
              ${!schedule ? `
                <button
                  id="setup-schedule-btn"
                  class="btn primary-button"
                >
                  Set Up Your Schedule
                </button>
              ` : `
                <div class="p-4 bg-white/50 rounded-lg">
                  <div class="text-lg font-medium primary-color">
                    Next injection: ${getNextInjectionDate()?.toLocaleDateString()}
                  </div>
                  <div id="countdown" class="mt-2 text-lg font-bold">
                    ${countdown !== null ? countdown === 0 ? "Due today!" : 
                      countdown < 0 ? `Overdue by ${Math.abs(countdown)} days` : 
                      `${countdown} days remaining` : ''}
                  </div>
                </div>
                <div>
                  <h3 class="font-medium mb-2 primary-color">Upcoming Schedule</h3>
                  <div class="space-y-2 upcoming-dates">
                    ${getUpcomingDates().map((date, i) => `
                      <div class="p-3 border rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-200">
                        ${date.toLocaleDateString()}
                      </div>
                    `).join('')}
                  </div>
                </div>
                <button
                  id="modify-schedule-btn"
                  class="text-sm flex items-center gap-1 primary-color hover:opacity-80 transition-opacity"
                >
                  <span class="lucide-icon" data-icon="settings"></span>
                  Modify Schedule
                </button>
              `}
              <div id="schedule-form" class="space-y-4 p-4 bg-white/20 rounded-lg ${schedule ? 'hidden' : ''}">
                <div>
                  <label class="block text-sm font-medium mb-1 primary-color">
                    First injection date:
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    class="input"
                    required
                  >
                </div>
                <button
                  id="save-schedule-btn"
                  class="btn success-button"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>

          <!-- New Injection Card -->
          <div class="card">
            <div class="card-header">
              <div class="card-title primary-color">
                <span class="lucide-icon" data-icon="plus"></span>
                New Injection
              </div>
            </div>
            <div class="card-content">
              <form id="injection-form" class="space-y-4">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1 primary-color">Date</label>
                    <input
                      type="date"
                      id="injection-date"
                      required
                      class="input"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1 primary-color">Time</label>
                    <input
                      type="time"
                      id="injection-time"
                      required
                      class="input"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1 primary-color">Site</label>
                    <select
                      id="injection-site"
                      required
                      class="select"
                    >
                      <option value="">Select site</option>
                      <option value="Stomach Right">Stomach Right</option>
                      <option value="Stomach Left">Stomach Left</option>
                      <option value="Thigh Right">Thigh Right</option>
                      <option value="Thigh Left">Thigh Left</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1 primary-color">Serial Number</label>
                    <input
                      type="text"
                      id="injection-serial"
                      required
                      class="input"
                      placeholder="Enter serial number"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1 primary-color">Side Effects</label>
                    <input
                      type="text"
                      id="injection-side-effects"
                      class="input"
                      placeholder="Any side effects?"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1 primary-color">Notes</label>
                    <textarea
                      id="injection-notes"
                      class="textarea"
                      placeholder="Additional notes"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  class="btn primary-button"
                >
                  Save Injection Log
                </button>
              </form>
            </div>
          </div>
        </div>

        <div id="success-alert" class="alert bg-green-50 border-green-200 hidden">
          <div class="flex gap-2 items-center">
            <span class="lucide-icon text-green-500" data-icon="thumbs-up"></span>
            <div>Successfully logged your injection!</div>
          </div>
        </div>

        <!-- History Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-title primary-color">
              <span class="lucide-icon" data-icon="list"></span>
              Injection History
            </div>
          </div>
          <div class="card-content">
            <div id="logs-container" class="space-y-4">
              ${logs.length === 0 ? 
                `<p class="text-gray-500 text-center py-4">No injections logged yet</p>` : 
                logs.map(log => `
                  <div class="border rounded-lg p-4 hover:bg-white/75 hover:shadow-md transition-all duration-200">
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <span class="text-sm primary-color">Date:</span>
                        <p class="font-medium">${new Date(log.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span class="text-sm primary-color">Time:</span>
                        <p class="font-medium">${log.time}</p>
                      </div>
                      <div>
                        <span class="text-sm primary-color">Site:</span>
                        <p class="font-medium">${log.site}</p>
                      </div>
                      <div>
                        <span class="text-sm primary-color">Serial Number:</span>
                        <p class="font-medium">${log.serialNumber}</p>
                      </div>
                      ${log.sideEffects ? `
                        <div>
                          <span class="text-sm primary-color">Side Effects:</span>
                          <p class="font-medium">${log.sideEffects}</p>
                        </div>
                      ` : ''}
                      ${log.notes ? `
                        <div>
                          <span class="text-sm primary-color">Notes:</span>
                          <p class="font-medium">${log.notes}</p>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')
              }
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Initialize Lucide icons
    const icons = document.querySelectorAll('.lucide-icon');
    icons.forEach(icon => {
      const iconName = icon.getAttribute('data-icon');
      icon.innerHTML = lucide.createIcons({ icons: { [iconName]: lucide[iconName] } });
    });
    
    // Add event listeners
    setupEventListeners();
  }

  // Set up event listeners for the app
  function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        // Just clear the current session, not stored data
        localStorage.removeItem('injectionTrackerUser');
        showLoginForm();
      });
    }
    
    // Schedule setup button
    const setupScheduleBtn = document.getElementById('setup-schedule-btn');
    if (setupScheduleBtn) {
      setupScheduleBtn.addEventListener('click', function() {
        document.getElementById('schedule-form').classList.remove('hidden');
        this.classList.add('hidden');
      });
    }
    
    // Modify schedule button
    const modifyScheduleBtn = document.getElementById('modify-schedule-btn');
    if (modifyScheduleBtn) {
      modifyScheduleBtn.addEventListener('click', function() {
        document.getElementById('schedule-form').classList.toggle('hidden');
      });
    }
    
    // Save schedule button
    const saveScheduleBtn = document.getElementById('save-schedule-btn');
    if (saveScheduleBtn) {
      saveScheduleBtn.addEventListener('click', function() {
        const startDate = document.getElementById('start-date').value;
        if (startDate) {
          schedule = {
            startDate: new Date(startDate).toISOString(),
            interval: 14
          };
          saveData();
          showApp(); // Refresh UI
        }
      });
    }
    
    // Injection form
    const injectionForm = document.getElementById('injection-form');
    if (injectionForm) {
      injectionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newLog = {
          id: Date.now(),
          date: document.getElementById('injection-date').value,
          time: document.getElementById('injection-time').value,
          site: document.getElementById('injection-site').value,
          serialNumber: document.getElementById('injection-serial').value,
          sideEffects: document.getElementById('injection-side-effects').value,
          notes: document.getElementById('injection-notes').value,
          createdAt: new Date().toISOString()
        };
        
        logs = [newLog, ...logs];
        saveData();
        
        // Reset form
        injectionForm.reset();
        
        // Show success message
        const successAlert = document.getElementById('success-alert');
        successAlert.classList.remove('hidden');
        setTimeout(() => {
          successAlert.classList.add('hidden');
        }, 3000);
        
        // Update logs display
        updateLogsDisplay();
        // Update countdown as the next due date might have changed
        updateCountdown();
      });
    }
  }

  // Update logs display
  function updateLogsDisplay() {
    const logsContainer = document.getElementById('logs-container');
    if (!logsContainer) return;
    
    if (logs.length === 0) {
      logsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No injections logged yet</p>';
    } else {
      logsContainer.innerHTML = logs.map(log => `
        <div class="border rounded-lg p-4 hover:bg-white/75 hover:shadow-md transition-all duration-200">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span class="text-sm primary-color">Date:</span>
              <p class="font-medium">${new Date(log.date).toLocaleDateString()}</p>
            </div>
            <div>
              <span class="text-sm primary-color">Time:</span>
              <p class="font-medium">${log.time}</p>
            </div>
            <div>
              <span class="text-sm primary-color">Site:</span>
              <p class="font-medium">${log.site}</p>
            </div>
            <div>
              <span class="text-sm primary-color">Serial Number:</span>
              <p class="font-medium">${log.serialNumber}</p>
            </div>
            ${log.sideEffects ? `
              <div>
                <span class="text-sm primary-color">Side Effects:</span>
                <p class="font-medium">${log.sideEffects}</p>
              </div>
            ` : ''}
            ${log.notes ? `
              <div>
                <span class="text-sm primary-color">Notes:</span>
                <p class="font-medium">${log.notes}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('');
    }
    
    // Re-apply theme colors
    applyTheme(themeIndex);
  }

  // Start the app
  init();
  
  // Set up a timer to update the countdown every minute
  setInterval(updateCountdown, 60000);
});
