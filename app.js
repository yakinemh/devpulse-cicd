// ── TaskFlow — app.js ──────────────────────────────────────────────

const taskInput     = document.getElementById('taskInput');
const prioritySelect= document.getElementById('prioritySelect');
const addBtn        = document.getElementById('addBtn');
const taskList      = document.getElementById('taskList');
const totalCount    = document.getElementById('totalCount');
const doneCount     = document.getElementById('doneCount');
const filterBtns    = document.querySelectorAll('.filter-btn');
const envBadge      = document.getElementById('envBadge');

// Affiche l'environnement (variable injectée via window.ENV ou défaut "dev")
envBadge.textContent = window.ENV || 'dev';

let tasks  = JSON.parse(localStorage.getItem('taskflow_tasks') || '[]');
let filter = 'all';

// ── Sauvegarde ────────────────────────────────────────────────────
function save() {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

// ── Rendu ─────────────────────────────────────────────────────────
function render() {
  taskList.innerHTML = '';

  const visible = tasks.filter(t => {
    if (filter === 'pending') return !t.done;
    if (filter === 'done')    return  t.done;
    return true;
  });

  if (visible.length === 0) {
    taskList.innerHTML = '<li class="empty-state">Aucune tâche ici 🎉</li>';
  } else {
    visible.forEach(t => {
      const li = document.createElement('li');
      li.className = 'task-item' + (t.done ? ' done' : '');
      li.dataset.id = t.id;

      li.innerHTML = `
        <div class="task-check"></div>
        <div class="priority-dot ${t.priority}"></div>
        <span class="task-text">${escapeHtml(t.text)}</span>
        <button class="delete-btn" title="Supprimer">✕</button>
      `;

      // Toggle done
      li.querySelector('.task-check').addEventListener('click', () => toggle(t.id));
      li.querySelector('.task-text').addEventListener('click', () => toggle(t.id));
      // Delete
      li.querySelector('.delete-btn').addEventListener('click', () => remove(t.id));

      taskList.appendChild(li);
    });
  }

  // Statistiques
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  totalCount.textContent = `${total} tâche${total > 1 ? 's' : ''}`;
  doneCount.textContent  = `${done} terminée${done > 1 ? 's' : ''}`;
}

// ── Actions ───────────────────────────────────────────────────────
function addTask() {
  const text = taskInput.value.trim();
  if (!text) { taskInput.focus(); return; }

  tasks.unshift({
    id:       Date.now(),
    text,
    priority: prioritySelect.value,
    done:     false,
  });

  taskInput.value = '';
  taskInput.focus();
  save();
  render();
}

function toggle(id) {
  const t = tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; save(); render(); }
}

function remove(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

// ── Filtres ───────────────────────────────────────────────────────
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

// ── Événements ────────────────────────────────────────────────────
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

// ── Utilitaires ───────────────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ── Init ──────────────────────────────────────────────────────────
render();
