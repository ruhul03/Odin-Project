// State Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  renderTasks();
  updateClock();
  setInterval(updateClock, 1000);
  updateGreeting();
});

// --- Theme Logic ---
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
  localStorage.setItem('theme', currentTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.innerHTML = theme === 'light' ? '<span class="icon">🌙</span>' : '<span class="icon">☀️</span>';
}

// --- Clock & Greeting Logic ---
function updateClock() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  
  document.getElementById('clock').textContent = now.toLocaleTimeString([], { hour12: false });
  document.getElementById('date').textContent = now.toLocaleDateString(undefined, options);
}

function updateGreeting() {
  const hour = new Date().getHours();
  let text = "Good Evening!";
  if (hour < 12) text = "Good Morning!";
  else if (hour < 18) text = "Good Afternoon!";
  document.getElementById('greeting').textContent = text;
}

// --- Task CRUD Logic ---
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');

function openModal(taskId = null) {
  const modalTitle = document.getElementById('modalTitle');
  const taskTitleInput = document.getElementById('taskTitle');
  const taskDescInput = document.getElementById('taskDesc');
  const taskIdInput = document.getElementById('taskId');

  if (taskId) {
    const task = tasks.find(t => t.id === taskId);
    modalTitle.textContent = 'Edit Task';
    taskTitleInput.value = task.title;
    taskDescInput.value = task.description;
    taskIdInput.value = task.id;
  } else {
    modalTitle.textContent = 'Add New Task';
    taskForm.reset();
    taskIdInput.value = '';
  }
  taskModal.classList.add('active');
}

function closeModal() {
  taskModal.classList.remove('active');
}

function handleTaskSubmit(e) {
  e.preventDefault();
  const idInput = document.getElementById('taskId').value;
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDesc').value;

  if (idInput) {
    // Update existing
    tasks = tasks.map(t => t.id === Number(idInput) ? { ...t, title, description } : t);
  } else {
    // Create new
    const newTask = {
      id: Date.now(),
      title,
      description,
      createdAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
  }

  saveAndRender();
  closeModal();
}

function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
  }
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// --- Filter & Sort Logic ---
let searchQuery = '';
let currentSort = 'newest';

function handleSearch() {
  searchQuery = document.getElementById('searchInput').value.toLowerCase();
  renderTasks();
}

function handleSort() {
  currentSort = document.getElementById('sortSelect').value;
  renderTasks();
}

function renderTasks() {
  const container = document.getElementById('taskList');
  let filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery) || 
    t.description.toLowerCase().includes(searchQuery)
  );

  // Sorting
  switch(currentSort) {
    case 'oldest':
      filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'alphabetical':
      filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default: // newest
      filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  container.innerHTML = filteredTasks.map(task => `
    <div class="task-card">
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.description)}</p>
      <div class="task-actions">
        <button class="btn-icon" onclick="openModal(${task.id})" title="Edit">
          ✏️
        </button>
        <button class="btn-icon btn-delete" onclick="deleteTask(${task.id})" title="Delete">
          🗑️
        </button>
      </div>
    </div>
  `).join('');

  if (filteredTasks.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); margin-top: 2rem;">No tasks found.</p>';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
