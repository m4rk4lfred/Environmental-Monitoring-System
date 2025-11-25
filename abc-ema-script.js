// Data Storage
let usersDatabase = [];
let currentUser = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeStorage();
  updateDateTime();
  setupEventListeners();
});

function setupEventListeners() {
  // Toggle button (Sign In / Sign Up)
  const toggleBtn = document.getElementById('toggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMode);
  }

  // Sign Up Form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  // Sign In Form
  const signinForm = document.getElementById('signinForm');
  if (signinForm) {
    signinForm.addEventListener('submit', handleSignin);
  }

  // Dropdown
  const dropdownSelected = document.getElementById('dropdownSelected');
  if (dropdownSelected) {
    dropdownSelected.addEventListener('click', toggleDropdown);
  }

  // Dropdown Options
  const dropdownOptions = document.querySelectorAll('.dropdown-option');
  dropdownOptions.forEach(function(option) {
    option.addEventListener('click', function() {
      selectOption(this);
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('roleDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  // Profile/Logout button in admin dashboard
  const profileLogout = document.getElementById('profileLogout');
  if (profileLogout) {
    profileLogout.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }

  // Logout button in community dashboard
  const communityLogout = document.getElementById('communityLogout');
  if (communityLogout) {
    communityLogout.addEventListener('click', logout);
  }
}

function initializeStorage() {
  const storedUsers = localStorage.getItem('abcEmaUsers');
  const storedCurrentUser = localStorage.getItem('abcEmaCurrentUser');
  
  if (storedUsers) {
    usersDatabase = JSON.parse(storedUsers);
  }
  
  // Check if user is already logged in
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
  
  if (!container || !toggleBtn || !panelTitle || !panelText) {
    console.error('Required elements not found');
    return;
  }
  
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
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

function selectOption(element) {
  const value = element.getAttribute('data-value') || element.textContent;
  const selectedRole = document.getElementById('selectedRole');
  const roleInput = document.getElementById('role');
  
  if (selectedRole) {
    selectedRole.textContent = value;
  }
  if (roleInput) {
    roleInput.value = value;
  }
  
  // Update selected state
  const options = document.querySelectorAll('.dropdown-option');
  options.forEach(function(opt) {
    opt.classList.remove('selected');
  });
  element.classList.add('selected');
  
  // Close dropdown
  const dropdown = document.getElementById('roleDropdown');
  if (dropdown) {
    dropdown.classList.remove('active');
  }
}

function shakeInvalidFields(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
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

// ============================================
// SIGN UP - Only registers user, then redirects to Sign In
// ============================================
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
  
  // Create new user (DO NOT log them in)
  const newUser = {
    id: Date.now(),
    username: username,
    email: email,
    role: role,
    roleCode: roleCode,
    password: password,
    createdAt: new Date().toISOString()
  };
  
  // Save to database only (not as current user)
  usersDatabase.push(newUser);
  saveUsers();
  
  // Show success message on button
  const btn = document.querySelector('#signupForm .btn-form');
  if (btn) {
    btn.innerHTML = '✓ REGISTERED';
    btn.style.background = '#3DBE8A';
    btn.style.borderColor = '#3DBE8A';
    btn.style.color = '#ffffff';
  }
  
  // After success, redirect to Sign In page
  setTimeout(function() {
    // Reset form
    document.getElementById('signupForm').reset();
    document.getElementById('selectedRole').textContent = 'Local Government Unit';
    document.getElementById('role').value = 'Local Government Unit';
    
    // Reset dropdown selection
    const options = document.querySelectorAll('.dropdown-option');
    options.forEach(function(opt, index) {
      if (index === 0) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });
    
    // Reset button
    if (btn) {
      btn.innerHTML = 'SIGN UP';
      btn.style.background = 'transparent';
      btn.style.borderColor = '#CCCCCC';
      btn.style.color = '#999999';
    }
    
    // Show success alert
    alert('Account created successfully! Please sign in with your credentials.');
    
    // Switch to Sign In mode
    toggleMode();
    
  }, 1000);
}

// ============================================
// SIGN IN - Authenticates user and redirects based on role
// ============================================
function handleSignin(event) {
  event.preventDefault();
  
  const email = document.getElementById('signinEmail').value.trim();
  const password = document.getElementById('signinPassword').value;
  
  // Validation
  if (!email || !password) {
    shakeInvalidFields('signinForm');
    return;
  }
  
  // Find user in database
  const user = usersDatabase.find(function(u) {
    return u.email === email && u.password === password;
  });
  
  if (!user) {
    alert('Invalid email or password!');
    return;
  }
  
  // Set as current user (NOW they are logged in)
  currentUser = user;
  saveCurrentUser();
  
  // Show success message on button
  const btn = document.querySelector('#signinForm .btn-form');
  if (btn) {
    btn.innerHTML = '✓ SUCCESS';
    btn.style.background = '#3DBE8A';
    btn.style.borderColor = '#3DBE8A';
    btn.style.color = '#ffffff';
  }
  
  // Redirect to appropriate dashboard based on role
  setTimeout(function() {
    // Reset form
    document.getElementById('signinForm').reset();
    
    // Reset button
    if (btn) {
      btn.innerHTML = 'SIGN IN';
      btn.style.background = 'transparent';
      btn.style.borderColor = '#CCCCCC';
      btn.style.color = '#999999';
    }
    
    // Determine which dashboard to show based on user role
    if (user.role === 'Local Government Unit') {
      // Admin/LGU Dashboard
      showDashboard('Local Government Unit');
    } else {
      // Community Member Dashboard
      showDashboard('Community Member');
    }
    
  }, 1000);
}

// ============================================
// SHOW DASHBOARD - Based on user role
// ============================================
function showDashboard(role) {
  // Hide auth container
  const authContainer = document.getElementById('authContainer');
  if (authContainer) {
    authContainer.classList.add('hidden');
  }
  
  // Hide all dashboards first
  const adminDashboard = document.getElementById('adminDashboard');
  const communityDashboard = document.getElementById('communityDashboard');
  
  if (adminDashboard) {
    adminDashboard.classList.remove('active');
  }
  if (communityDashboard) {
    communityDashboard.classList.remove('active');
  }
  
  // Show appropriate dashboard based on role
  if (role === 'Local Government Unit') {
    // ========== ADMIN DASHBOARD ==========
    console.log('Showing Admin Dashboard for LGU user');
    
    if (adminDashboard) {
      adminDashboard.classList.add('active');
    }
    
    // Update admin name
    const adminName = document.getElementById('adminName');
    if (adminName && currentUser) {
      adminName.textContent = currentUser.username.toUpperCase();
    }
    
    // Update date and greeting
    updateDateTime();
    updateGreeting();
    
  } else {
    // ========== COMMUNITY DASHBOARD ==========
    console.log('Showing Community Dashboard for Community Member');
    
    if (communityDashboard) {
      communityDashboard.classList.add('active');
    }
    
    // Update community user info
    const communityUsername = document.getElementById('communityUsername');
    const communityAvatar = document.getElementById('communityAvatar');
    
    if (communityUsername && currentUser) {
      communityUsername.textContent = currentUser.username;
    }
    if (communityAvatar && currentUser) {
      communityAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
    }
  }
}

// ============================================
// UPDATE GREETING - Filipino greeting based on time
// ============================================
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = 'MAGANDANG UMAGA'; // Good Morning (default)
  
  if (hour >= 12 && hour < 18) {
    greeting = 'MAGANDANG HAPON'; // Good Afternoon
  } else if (hour >= 18) {
    greeting = 'MAGANDANG GABI'; // Good Evening
  }
  
  const greetingText = document.getElementById('greetingText');
  
  if (greetingText && currentUser) {
    greetingText.innerHTML = greeting + ', <span class="name">' + currentUser.username.toUpperCase() + '</span>!';
  }
}

// ============================================
// LOGOUT - Clear session and return to login
// ============================================
function logout() {
  // Clear current user
  currentUser = null;
  saveCurrentUser();
  
  // Hide dashboards
  const adminDashboard = document.getElementById('adminDashboard');
  const communityDashboard = document.getElementById('communityDashboard');
  const authContainer = document.getElementById('authContainer');
  
  if (adminDashboard) {
    adminDashboard.classList.remove('active');
  }
  if (communityDashboard) {
    communityDashboard.classList.remove('active');
  }
  
  // Show auth container (login/signup)
  if (authContainer) {
    authContainer.classList.remove('hidden');
    // Make sure we're in sign-in mode after logout
    authContainer.classList.add('sign-in-mode');
  }
  
  // Update panel text for sign-in mode
  const toggleBtn = document.getElementById('toggleBtn');
  const panelTitle = document.getElementById('panelTitle');
  const panelText = document.getElementById('panelText');
  
  if (toggleBtn) {
    toggleBtn.textContent = 'SIGN UP';
  }
  if (panelTitle) {
    panelTitle.textContent = 'Hello, Friend!';
  }
  if (panelText) {
    panelText.textContent = 'Enter your personal account and start your journey with us.';
  }
  
  console.log('User logged out successfully');
}