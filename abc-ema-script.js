// Data Storage
let usersDatabase = [];
let currentUser = null;

// Initialize on page load
window.onload = function() {
  initializeStorage();
  updateDateTime();
};

function initializeStorage() {
  const storedUsers = localStorage.getItem('abcEmaUsers');
  const storedCurrentUser = localStorage.getItem('abcEmaCurrentUser');
  
  if (storedUsers) {
    usersDatabase = JSON.parse(storedUsers);
  }
  
  if (storedCurrentUser) {
    currentUser = JSON.parse(storedCurrentUser);
    showDashboard(currentUser.role);
  }
}

function saveUsers() {
  localStorage.setItem('abcEmaUsers', JSON.stringify(usersDatabase));
}

function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem('abcEmaCurrentUser', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('abcEmaCurrentUser');
  }
}

function updateDateTime() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  
  const dayElement = document.getElementById('currentDay');
  const dateElement = document.getElementById('currentDate');
  
  if (dayElement) {
    dayElement.textContent = days[now.getDay()];
  }
  if (dateElement) {
    dateElement.textContent = now.getDate().toString().padStart(2, '0') + ' ' + months[now.getMonth()];
  }
}

function toggleMode() {
  const container = document.getElementById('authContainer');
  const toggleBtn = document.getElementById('toggleBtn');
  const panelTitle = document.getElementById('panelTitle');
  const panelText = document.getElementById('panelText');
  
  toggleBtn.disabled = true;
  container.classList.toggle('sign-in-mode');
  
  panelTitle.style.opacity = '0';
  panelText.style.opacity = '0';
  
  setTimeout(function() {
    if (container.classList.contains('sign-in-mode')) {
      toggleBtn.textContent = 'SIGN UP';
      panelTitle.textContent = 'Hello, Friend!';
      panelText.textContent = 'Enter your personal account and start your journey with us.';
    } else {
      toggleBtn.textContent = 'SIGN IN';
      panelTitle.textContent = 'Welcome Back!';
      panelText.textContent = 'To keep connected with us please login with your personal account';
    }
    
    panelTitle.style.opacity = '1';
    panelText.style.opacity = '1';
    toggleBtn.disabled = false;
  }, 300);
}

function toggleDropdown() {
  const dropdown = document.getElementById('roleDropdown');
  dropdown.classList.toggle('active');
}

function selectOption(element, value) {
  document.getElementById('selectedRole').textContent = value;
  document.getElementById('role').value = value;
  
  const options = document.querySelectorAll('.dropdown-option');
  options.forEach(function(opt) {
    opt.classList.remove('selected');
  });
  element.classList.add('selected');
  
  document.getElementById('roleDropdown').classList.remove('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('roleDropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});

function shakeInvalidFields(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll('input[required]');
  
  inputs.forEach(function(input) {
    if (!input.value) {
      input.parentElement.classList.add('shake');
      setTimeout(function() {
        input.parentElement.classList.remove('shake');
      }, 400);
    }
  });
}

function handleSignup(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const role = document.getElementById('role').value;
  const roleCode = document.getElementById('roleCode').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Validation
  if (!username || !email || !password || !confirmPassword) {
    shakeInvalidFields('signupForm');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  if (password.length < 8) {
    alert('Password must be at least 8 characters!');
    return;
  }
  
  // Check if email already exists
  const existingUser = usersDatabase.find(function(user) {
    return user.email === email;
  });
  
  if (existingUser) {
    alert('An account with this email already exists!');
    return;
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    username: username,
    email: email,
    role: role,
    roleCode: roleCode,
    password: password,
    createdAt: new Date().toISOString()
  };
  
  // Save to database
  usersDatabase.push(newUser);
  saveUsers();
  
  // Show success
  const btn = document.querySelector('#signupForm .btn-form');
  btn.innerHTML = '✓ SUCCESS';
  btn.style.background = '#3DBE8A';
  btn.style.borderColor = '#3DBE8A';
  btn.style.color = '#ffffff';
  
  setTimeout(function() {
    // Reset form
    document.getElementById('signupForm').reset();
    document.getElementById('selectedRole').textContent = 'Local Government Unit';
    document.getElementById('role').value = 'Local Government Unit';
    btn.innerHTML = 'SIGN UP';
    btn.style.background = 'transparent';
    btn.style.borderColor = '#CCCCCC';
    btn.style.color = '#999999';
    
    // Switch to sign-in mode
    document.getElementById('authContainer').classList.add('sign-in-mode');
    document.getElementById('toggleBtn').textContent = 'SIGN UP';
    document.getElementById('panelTitle').textContent = 'Hello, Friend!';
    document.getElementById('panelText').textContent = 'Enter your personal account and start your journey with us.';
    
    alert('Account created successfully! Please sign in.');
  }, 1000);
}

function handleSignin(event) {
  event.preventDefault();
  
  const email = document.getElementById('signinEmail').value.trim();
  const password = document.getElementById('signinPassword').value;
  
  // Validation
  if (!email || !password) {
    shakeInvalidFields('signinForm');
    return;
  }
  
  // Find user
  const user = usersDatabase.find(function(u) {
    return u.email === email && u.password === password;
  });
  
  if (!user) {
    alert('Invalid email or password!');
    return;
  }
  
  // Set as current user
  currentUser = user;
  saveCurrentUser();
  
  // Show success
  const btn = document.querySelector('#signinForm .btn-form');
  btn.innerHTML = '✓ SUCCESS';
  btn.style.background = '#3DBE8A';
  btn.style.borderColor = '#3DBE8A';
  btn.style.color = '#ffffff';
  
  setTimeout(function() {
    showDashboard(user.role);
    
    // Reset form
    document.getElementById('signinForm').reset();
    btn.innerHTML = 'SIGN IN';
    btn.style.background = 'transparent';
    btn.style.borderColor = '#CCCCCC';
    btn.style.color = '#999999';
  }, 1000);
}

function showDashboard(role) {
  // Hide auth container
  document.getElementById('authContainer').classList.add('hidden');
  
  // Hide all dashboards first
  const adminDashboard = document.getElementById('adminDashboard');
  const communityDashboard = document.getElementById('communityDashboard');
  const analyticsDashboard = document.getElementById('analyticsDashboard');
  
  if (adminDashboard) adminDashboard.classList.remove('active');
  if (communityDashboard) communityDashboard.classList.remove('active');
  if (analyticsDashboard) analyticsDashboard.classList.remove('active');
  
  if (role === 'Local Government Unit') {
    // Show admin dashboard
    if (adminDashboard) adminDashboard.classList.add('active');
    updateDateTime();
    updateGreeting();
  } else {
    // Show community dashboard
    if (communityDashboard) {
      communityDashboard.classList.add('active');
      document.getElementById('communityUsername').textContent = currentUser.username;
      document.getElementById('communityAvatar').textContent = currentUser.username.charAt(0).toUpperCase();
    }
  }
}

function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Hello';
  
  if (hour >= 5 && hour < 12) {
    greeting = 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }
  
  const greetingElement = document.querySelector('.greeting-section h1');
  if (greetingElement && currentUser) {
    greetingElement.innerHTML = greeting + ', <span class="name">' + currentUser.username.toUpperCase() + '</span>!';
  }
}

function logout() {
  // Clear current user
  currentUser = null;
  saveCurrentUser();
  
  // Close sidebar first
  closeSidebar();
  
  // Hide all dashboards
  const adminDashboard = document.getElementById('adminDashboard');
  const communityDashboard = document.getElementById('communityDashboard');
  const analyticsDashboard = document.getElementById('analyticsDashboard');
  const reportsDashboard = document.getElementById('reportsDashboard');
  const profileDashboard = document.getElementById('profileDashboard');
  const forecastDashboard = document.getElementById('forecastDashboard');
  const alertsDashboard = document.getElementById('alertsDashboard');
  
  if (adminDashboard) {
    adminDashboard.classList.remove('active');
    adminDashboard.style.display = 'none';
  }
  if (communityDashboard) {
    communityDashboard.classList.remove('active');
    communityDashboard.style.display = 'none';
  }
  if (analyticsDashboard) {
    analyticsDashboard.classList.remove('active');
    analyticsDashboard.style.display = 'none';
  }
  if (reportsDashboard) {
    reportsDashboard.classList.remove('active');
    reportsDashboard.style.display = 'none';
  }
  if (profileDashboard) {
    profileDashboard.classList.remove('active');
    profileDashboard.style.display = 'none';
  }
  if (forecastDashboard) {
    forecastDashboard.classList.remove('active');
    forecastDashboard.style.display = 'none';
  }
  if (alertsDashboard) {
    alertsDashboard.classList.remove('active');
    alertsDashboard.style.display = 'none';
  }
  
  // Show auth container in sign-in mode
  const authContainer = document.getElementById('authContainer');
  if (authContainer) {
    authContainer.classList.remove('hidden');
    authContainer.classList.add('sign-in-mode');
    authContainer.style.display = 'flex';
    authContainer.style.visibility = 'visible';
    authContainer.style.opacity = '1';
    authContainer.style.position = 'relative';
    authContainer.style.left = '0';
    authContainer.style.zIndex = '1';
  }
  
  
  // Reset panel text
  const toggleBtn = document.getElementById('toggleBtn');
  const panelTitle = document.getElementById('panelTitle');
  const panelText = document.getElementById('panelText');
  
  if (toggleBtn) toggleBtn.textContent = 'SIGN UP';
  if (panelTitle) panelTitle.textContent = 'Hello, Friend!';
  if (panelText) panelText.textContent = 'Enter your personal account and start your journey with us.';
  
  // Clear form inputs
  const signinForm = document.getElementById('signinForm');
  if (signinForm) signinForm.reset();
  
  console.log('User logged out successfully');
}

// Update showSection function (around line 330)
function showSection(section, event) {
  if (event) {
    event.preventDefault();
  }
  
  // ✅ HIDE AUTH CONTAINER FIRST
  const authContainer = document.getElementById('authContainer');
  if (authContainer) {
    authContainer.classList.add('hidden');
    authContainer.style.display = 'none';
    authContainer.style.visibility = 'hidden';
    authContainer.style.opacity = '0';
    authContainer.style.position = 'absolute';
    authContainer.style.left = '-9999px';
    authContainer.style.zIndex = '-1';
  }
  
  const adminDashboard = document.getElementById('adminDashboard');
  const analyticsDashboard = document.getElementById('analyticsDashboard');
  const reportsDashboard = document.getElementById('reportsDashboard');
  const profileDashboard = document.getElementById('profileDashboard');
  const forecastDashboard = document.getElementById('forecastDashboard');
  const alertsDashboard = document.getElementById('alertsDashboard');
  
  // Hide all sections
  if (adminDashboard) {
    adminDashboard.classList.remove('active');
    adminDashboard.style.display = 'none';
  }
  if (analyticsDashboard) {
    analyticsDashboard.classList.remove('active');
    analyticsDashboard.style.display = 'none';
  }
  if (reportsDashboard) {
    reportsDashboard.classList.remove('active');
    reportsDashboard.style.display = 'none';
  }
  if (profileDashboard) {
    profileDashboard.classList.remove('active');
    profileDashboard.style.display = 'none';
  }
  if (forecastDashboard) {
    forecastDashboard.classList.remove('active');
    forecastDashboard.style.display = 'none';
  }
  if (alertsDashboard) {
    alertsDashboard.classList.remove('active');
    alertsDashboard.style.display = 'none';
  }
  
  // ✅ Remove active class from ALL nav items in ALL headers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // ✅ Add active class to corresponding nav items
  if (section === 'home') {
    if (adminDashboard) {
      adminDashboard.style.display = 'block';
      adminDashboard.classList.add('active');
    }
    // Add active to all "Home" nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.textContent.trim().includes('Home') || item.textContent.trim().includes('Overview')) {
        item.classList.add('active');
      }
    });
  } else if (section === 'analytics') {
    if (analyticsDashboard) {
      analyticsDashboard.style.display = 'block';
      analyticsDashboard.classList.add('active');
    }
    // Add active to all "Analytics" nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.textContent.trim().includes('Analytics') || item.textContent.trim().includes('Analysis')) {
        item.classList.add('active');
      }
    });
  } else if (section === 'reports') {
    if (reportsDashboard) {
      reportsDashboard.style.display = 'block';
      reportsDashboard.classList.add('active');
    }
    // Add active to all "Reports" nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.textContent.trim().includes('Reports')) {
        item.classList.add('active');
      }
    });
  } else if (section === 'profile') {
    if (profileDashboard) {
      profileDashboard.style.display = 'block';
      profileDashboard.classList.add('active');
      updateProfileInfo();
    }
  } else if (section === 'forecast') {
    if (forecastDashboard) {
      forecastDashboard.style.display = 'block';
      forecastDashboard.classList.add('active');
    }
  } else if (section === 'alerts') {
    if (alertsDashboard) {
      alertsDashboard.style.display = 'block';
      alertsDashboard.classList.add('active');
    }
  }
}

function sidebarNavigate(section, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // Remove active class from all sidebar items
  document.querySelectorAll('.sidebar-menu-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to clicked item
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
  
  // Close sidebar first
  closeSidebar();
  
  // Navigate to section based on which menu item was clicked
  switch(section) {
    case 'home':
      showSection('home');
      break;
    case 'analytics':
      showSection('analytics');
      break;
    case 'reports':
      showSection('reports');
      break;
    case 'forecast':
      showSection('forecast');
      break;
    case 'alerts':
      showSection('alerts');
      break;
    default:
      showSection('home');
  }
  
  console.log('Sidebar navigated to:', section);
}

// Add new function for tab switching
function switchProfileTab(tabName, event) {
  event.preventDefault();
  
  // Remove active from all tabs
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active from all panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  // Add active to clicked tab
  event.currentTarget.classList.add('active');
  
  // Show corresponding panel
  const panelId = tabName + '-panel';
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.add('active');
  }
}

// Add new function to update profile info
function updateProfileInfo() {
  if (!currentUser) return;
  
  // Update profile display
  const avatarLarge = document.getElementById('profileAvatarLarge');
  const fullName = document.getElementById('profileFullName');
  const emailDisplay = document.getElementById('profileEmailDisplay');
  const fullNameInput = document.getElementById('profileFullNameInput');
  
  if (avatarLarge) {
    avatarLarge.textContent = currentUser.username.substring(0, 2).toUpperCase();
  }
  
  if (fullName) {
    fullName.textContent = currentUser.username;
  }
  
  if (emailDisplay) {
    emailDisplay.textContent = currentUser.email;
  }
  
  if (fullNameInput) {
    fullNameInput.value = currentUser.username;
  }
}

// ============================================
// SIDEBAR NAVIGATION
// ============================================

function toggleSidebar() {
  const sidebar = document.getElementById('sidebarNav');
  const overlay = document.getElementById('sidebarOverlay');
  
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  
  // Update sidebar user info
  if (currentUser && sidebar.classList.contains('active')) {
    document.getElementById('sidebarAvatar').textContent = currentUser.username.charAt(0).toUpperCase();
    document.getElementById('sidebarUsername').textContent = currentUser.username;
    document.getElementById('sidebarEmail').textContent = currentUser.email;
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebarNav');
  const overlay = document.getElementById('sidebarOverlay');
  
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
}

function sidebarNavigate(section, event) {
  if (event) {
    event.preventDefault();
  }
  
  // Remove active class from all sidebar items
  document.querySelectorAll('.sidebar-menu-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to clicked item
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
  
  // Navigate to section
  if (section === 'home') {
    showSection('home');
    closeSidebar();
  } else if (section === 'forecast') {
    showSection('forecast');
    closeSidebar();
  } else if (section === 'alerts') {
    showSection('alerts');  // ✅ NOW CALLS showSection PROPERLY
    closeSidebar();
  }
}

// Event Listeners
document.getElementById('toggleBtn').addEventListener('click', toggleMode);
document.getElementById('signupForm').addEventListener('submit', handleSignup);
document.getElementById('signinForm').addEventListener('submit', handleSignin);


// Community dashboard logout
const communityLogoutBtn = document.getElementById('communityLogout');
if (communityLogoutBtn) {
  communityLogoutBtn.addEventListener('click', logout);
}

// Dropdown functionality
const dropdownSelected = document.getElementById('dropdownSelected');
if (dropdownSelected) {
  dropdownSelected.addEventListener('click', toggleDropdown);
}

const dropdownOptions = document.querySelectorAll('.dropdown-option');
dropdownOptions.forEach(function(option) {
  option.addEventListener('click', function() {
    selectOption(this, this.getAttribute('data-value'));
  });
});

// Sidebar event listeners
window.addEventListener('DOMContentLoaded', function() {
  // Close button
  const closeBtn = document.getElementById('sidebarClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }
  
  // Overlay click
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
  
  // Escape key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeSidebar();
    }
  });
});
// ============================================
// HEADER ICON INTERACTIONS
// ============================================

// ============================================
// NOTIFICATION PANEL FUNCTIONS
// ============================================

function toggleNotifications() {
  const panel = document.getElementById('notificationPanel');
  const overlay = document.getElementById('notificationOverlay');
  
  panel.classList.toggle('active');
  overlay.classList.toggle('active');
  
  // Prevent body scroll when panel is open
  if (panel.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function closeNotifications() {
  const panel = document.getElementById('notificationPanel');
  const overlay = document.getElementById('notificationOverlay');
  
  panel.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function dismissNotification(button) {
  const notificationItem = button.closest('.notification-item');
  
  // Animate out
  notificationItem.style.transform = 'translateX(100%)';
  notificationItem.style.opacity = '0';
  
  setTimeout(() => {
    notificationItem.remove();
    
    // Update notification count
    updateNotificationCount();
  }, 300);
}

function updateNotificationCount() {
  const remainingNotifications = document.querySelectorAll('.notification-item').length;
  const subtitle = document.querySelector('.notification-subtitle');
  
  if (subtitle) {
    subtitle.textContent = `You have ${remainingNotifications} new notification${remainingNotifications !== 1 ? 's' : ''}`;
  }
  
  // Update notification dot
  const notificationDots = document.querySelectorAll('.notification-dot');
  notificationDots.forEach(dot => {
    if (remainingNotifications === 0) {
      dot.style.display = 'none';
    } else {
      dot.style.display = 'block';
    }
  });
}

// Close notification panel when pressing Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeNotifications();
  }
});
function goToForecast(sectionKey) {
  // show forecast dashboard
  showSection('forecast');

  // after forecast dashboard is visible, switch tab
  setTimeout(function () {
    switchForecastTab(sectionKey);
  }, 0);
}

// ============================================
// FORECAST TAB SWITCHING - FIXED
// ============================================
function switchForecastTab(tabName, event) {
  if (event) {
    event.preventDefault();
  }
  
  // Remove active class from all tabs
  document.querySelectorAll('.forecast-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active to clicked tab
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  } else {
    // called from goToForecast: activate tab by matching onclick
    const tab = document.querySelector(`.forecast-tab[onclick*="'${tabName}'"]`);
    if (tab) tab.classList.add('active');
  }
  
  // Hide all forecast sections
  document.querySelectorAll('.forecast-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const sectionId = tabName + '-section';
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  console.log('Switched to forecast:', tabName);
}

// ============================================
// FORECAST TAB SWITCHING 
// ============================================

function switchForecastTab(tabName, event) {
  if (event) {
    event.preventDefault();
  }
  
  // Remove active class from all tabs
  document.querySelectorAll('.forecast-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active to clicked tab
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
  
  // Hide all forecast sections
  document.querySelectorAll('.forecast-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const sectionId = tabName + '-section';
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  console.log('Switched to forecast:', tabName);
}

// ============================================
// ALERTS DASHBOARD FUNCTIONS
// ============================================

function filterAlerts(filter) {
  // Remove active class from all tabs
  document.querySelectorAll('.alerts-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active to clicked tab
  event.currentTarget.classList.add('active');
  
  console.log('Filtering alerts:', filter);
  // Add your filtering logic here
}

function toggleAllAlerts(checkbox) {
  const checkboxes = document.querySelectorAll('.alerts-table tbody .table-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = checkbox.checked;
  });
}

function openAddAlertModal() {
  const modal = document.getElementById('alertModal');
  const overlay = document.getElementById('alertModalOverlay');
  
  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAddAlertModal() {
  const modal = document.getElementById('alertModal');
  const overlay = document.getElementById('alertModalOverlay');
  
  modal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset form
  document.getElementById('alertForm').reset();
}

function submitAlert(event) {
  event.preventDefault();
  
  const title = document.getElementById('alertTitle').value;
  const type = document.getElementById('alertType').value;
  const message = document.getElementById('alertMessage').value;
  const delivery = document.getElementById('alertDelivery').value;
  
  // Show success message
  alert('Alert sent successfully!\n\nTitle: ' + title + '\nType: ' + type + '\nDelivery: ' + delivery);
  
  // Close modal
  closeAddAlertModal();
  
  // Here you can add logic to add the alert to the table
  console.log('Alert submitted:', { title, type, message, delivery });
}

// Close modal when pressing Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeAddAlertModal();
  }
});


function expandSearch() {
  // Find the search wrapper in the currently active dashboard
  const activeDashboard = document.querySelector('.admin-dashboard.active, .analytics-dashboard.active, .reports-dashboard.active, .profile-dashboard.active, .forecast-dashboard.active, .alerts-dashboard.active');
  
  if (!activeDashboard) return;
  
  const wrapper = activeDashboard.querySelector('.header-search-wrapper');
  const inputWrapper = activeDashboard.querySelector('.header-search-input-wrapper');
  const input = activeDashboard.querySelector('.header-search-input');
  
  if (!wrapper || !inputWrapper || !input) return;
  
  wrapper.classList.add('expanded');
  inputWrapper.classList.add('active');
  
  // Focus input after animation
  setTimeout(() => {
    input.focus();
  }, 300);
}

function collapseSearch() {
  // Find all active search wrappers and collapse them
  document.querySelectorAll('.header-search-wrapper.expanded').forEach(wrapper => {
    wrapper.classList.remove('expanded');
  });
  
  document.querySelectorAll('.header-search-input-wrapper.active').forEach(inputWrapper => {
    inputWrapper.classList.remove('active');
    const input = inputWrapper.querySelector('.header-search-input');
    if (input) input.value = '';
  });
}

// Click outside to close - UPDATED
document.addEventListener('click', function(e) {
  const searchWrappers = document.querySelectorAll('.header-search-wrapper');
  let clickedInsideSearch = false;
  
  searchWrappers.forEach(wrapper => {
    if (wrapper.contains(e.target)) {
      clickedInsideSearch = true;
    }
  });
  
  if (!clickedInsideSearch) {
    collapseSearch();
  }
});

// Close on Escape key - UPDATED
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    collapseSearch();
  }
});


document.addEventListener('DOMContentLoaded', function() {
  
  document.addEventListener('keypress', function(e) {
    if (e.target.classList.contains('header-search-input') && e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query) {
        console.log('Searching for:', query);
        alert('Searching for: ' + query);
      }
    }
  });
});

// ============================================
// EXCEL EXPORT FUNCTIONALITY
// ============================================

function exportReportsToExcel() {
  // Get table data
  const table = document.querySelector('.reports-table');
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  
  // Prepare data for Excel
  const excelData = [];
  
  // Add headers
  excelData.push(['ID No.', 'Message', 'Category', 'Status', 'Created At']);
  
  // Add data rows
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const rowData = [
      cells[1].textContent.trim(), // ID no.
      cells[2].textContent.trim(), // Message
      cells[3].textContent.trim(), // Category
      cells[4].textContent.trim(), // Status
      cells[5].textContent.trim()  // Created at
    ];
    excelData.push(rowData);
  });
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 10 },  // ID No.
    { wch: 30 },  // Message
    { wch: 20 },  // Category
    { wch: 15 },  // Status
    { wch: 20 }   // Created At
  ];
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Reports');
  
  // Generate filename with current date
  const today = new Date();
  const filename = `ABC-EMA_Reports_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.xlsx`;
  
  // Save file
  XLSX.writeFile(wb, filename);
  
  // Show success message
  alert('✓ Reports exported successfully!');
}

function updateCommunityDateTime() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  
  const dayElement = document.getElementById('communityCurrentDay');
  const dateElement = document.getElementById('communityCurrentDate');
  
  if (dayElement) {
    dayElement.textContent = days[now.getDay()];
  }
  if (dateElement) {
    dateElement.textContent = now.getDate().toString().padStart(2, '0') + ' ' + months[now.getMonth()];
  }
}

function updateCommunityGreeting() {
  const hour = new Date().getHours();
  let greeting = 'MAGANDANG ARAW';
  
  if (hour >= 5 && hour < 12) {
    greeting = 'MAGANDANG UMAGA';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'MAGANDANG HAPON';
  } else {
    greeting = 'MAGANDANG GABI';
  }
  
  const greetingElement = document.querySelector('.community-greeting h1');
  if (greetingElement && currentUser) {
    greetingElement.innerHTML = greeting + ', <span class="community-name">' + currentUser.username.toUpperCase() + '!</span>';
  }
}

function toggleCommunitySidebar() {
  toggleSidebar();
}

function expandCommunitySearch() {
  // Reuse the existing search functionality
  const activeDashboard = document.querySelector('.community-dashboard.active');
  if (!activeDashboard) return;
  
  alert('Search functionality - Coming soon!');
}

function toggleCommunityNotifications() {
  toggleNotifications();
}

function openReportModal() {
  // Create and show report modal
  let modal = document.getElementById('reportModal');
  let overlay = document.getElementById('reportModalOverlay');
  
  if (!modal) {
    // Create modal dynamically
    const modalHTML = `
      <div class="report-modal-overlay" id="reportModalOverlay" onclick="closeReportModal()"></div>
      <div class="report-modal" id="reportModal">
        <div class="report-modal-header">
          <h2>File a Report</h2>
          <button class="modal-close-btn" onclick="closeReportModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="report-modal-body">
          <form class="report-form" id="reportForm" onsubmit="submitReport(event)">
            <div class="report-form-group">
              <label>Report Type</label>
              <select id="reportType" required>
                <option value="">Select type...</option>
                <option value="Environmental Hazard">Environmental Hazard</option>
                <option value="Water Quality Issue">Water Quality Issue</option>
                <option value="Air Quality Concern">Air Quality Concern</option>
                <option value="Temperature Anomaly">Temperature Anomaly</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div class="report-form-group">
              <label>Location</label>
              <input type="text" id="reportLocation" placeholder="Enter location..." required>
            </div>
            
            <div class="report-form-group">
              <label>Description</label>
              <textarea id="reportDescription" rows="4" placeholder="Describe the issue..." required></textarea>
            </div>
            
            <div class="report-modal-footer">
              <button type="button" class="btn-cancel" onclick="closeReportModal()">Cancel</button>
              <button type="submit" class="btn-submit">Submit Report</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modal = document.getElementById('reportModal');
    overlay = document.getElementById('reportModalOverlay');
  }
  
  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeReportModal() {
  const modal = document.getElementById('reportModal');
  const overlay = document.getElementById('reportModalOverlay');
  
  if (modal) modal.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset form
  const form = document.getElementById('reportForm');
  if (form) form.reset();
}

function submitReport(event) {
  event.preventDefault();
  
  const type = document.getElementById('reportType').value;
  const location = document.getElementById('reportLocation').value;
  const description = document.getElementById('reportDescription').value;
  
  // Show success message
  alert('Report submitted successfully!\n\nType: ' + type + '\nLocation: ' + location);
  
  // Close modal
  closeReportModal();
  
  console.log('Report submitted:', { type, location, description });
}

// Update showDashboard function to include community dashboard updates
const originalShowDashboard = showDashboard;
showDashboard = function(role) {
  // Hide auth container
  document.getElementById('authContainer').classList.add('hidden');
  
  // Hide all dashboards first
  const adminDashboard = document.getElementById('adminDashboard');
  const communityDashboard = document.getElementById('communityDashboard');
  const analyticsDashboard = document.getElementById('analyticsDashboard');
  
  if (adminDashboard) adminDashboard.classList.remove('active');
  if (communityDashboard) communityDashboard.classList.remove('active');
  if (analyticsDashboard) analyticsDashboard.classList.remove('active');
  
  if (role === 'Local Government Unit') {
    // Show admin dashboard
    if (adminDashboard) adminDashboard.classList.add('active');
    updateDateTime();
    updateGreeting();
  } else {
    // Show community dashboard with new design
    if (communityDashboard) {
      communityDashboard.classList.add('active');
      updateCommunityDateTime();
      updateCommunityGreeting();
    }
  }
};

function toggleCommunitySidebar() {
  const sidebar = document.getElementById('communitySidebarNav');
  const overlay = document.getElementById('communitySidebarOverlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Update user info in sidebar
    if (currentUser && sidebar.classList.contains('active')) {
      const avatar = document.getElementById('communitySidebarAvatar');
      const username = document.getElementById('communitySidebarUsername');
      const email = document.getElementById('communitySidebarEmail');
      
      if (avatar) avatar.textContent = currentUser.username.substring(0, 2).toUpperCase();
      if (username) username.textContent = currentUser.username;
      if (email) email.textContent = currentUser.email;
    }
    
    // Prevent body scroll when sidebar is open
    if (sidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function closeCommunitySidebar() {
  const sidebar = document.getElementById('communitySidebarNav');
  const overlay = document.getElementById('communitySidebarOverlay');
  
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function communitySidebarNavigate(section, event) {
  if (event) {
    event.preventDefault();
  }
  
  // Remove active class from all community menu items
  document.querySelectorAll('.community-menu-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to clicked item
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
  
  // Close the sidebar
  closeCommunitySidebar();
  
  // Hide all community-related dashboards
  const communityDashboard = document.getElementById('communityDashboard');
  const communityForecastDashboard = document.getElementById('communityForecastDashboard');
  
  if (communityDashboard) communityDashboard.classList.remove('active');
  if (communityForecastDashboard) communityForecastDashboard.classList.remove('active');
  
  // Navigate based on section
  if (section === 'dashboard') {
    if (communityDashboard) {
      communityDashboard.classList.add('active');
      updateCommunityDateTime();
      updateCommunityGreeting();
    }
  } else if (section === 'forecast') {
    if (communityForecastDashboard) {
      communityForecastDashboard.classList.add('active');
    }
  } else if (section === 'reports') {
    // Open the report modal and keep community dashboard visible
    if (communityDashboard) communityDashboard.classList.add('active');
    openReportModal();
  }
}

// Add event listener for community sidebar overlay
window.addEventListener('DOMContentLoaded', function() {
  const communityOverlay = document.getElementById('communitySidebarOverlay');
  if (communityOverlay) {
    communityOverlay.addEventListener('click', closeCommunitySidebar);
  }
  
  // Close community sidebar on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCommunitySidebar();
    }
  });
});