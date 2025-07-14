// Updated script.js with drag & drop, edit, tags, filter, and progress bar

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const dueDateInput = document.getElementById('due-date');
  const taskList = document.getElementById('task-list');
  const themeToggle = document.getElementById('theme-toggle');

  function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const percent = total > 0 ? (done / total) * 100 : 0;
  document.getElementById('progress-fill').style.width = percent + '%';
}
function generateCalendarView() {
  const calendar = document.getElementById('calendar-view');
  if (!calendar) return;

  calendar.innerHTML = ''; // clear previous calendar
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const daysInMonth = end.getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const taskCount = tasks.filter(t => t.dueDate === dateStr).length;

    const div = document.createElement('div');
    div.classList.add('calendar-day');
    if (taskCount > 0) {
      div.classList.add('has-task');
      div.innerHTML = `${day}<span class="task-count">${taskCount} task${taskCount > 1 ? 's' : ''}</span>`;
    } else {
      div.textContent = day;
    }
    calendar.appendChild(div);
  }
}


  const filter = document.createElement('select');
  filter.id = 'category-filter';
  filter.innerHTML = '<option value="all">All Categories</option>';
  form.insertAdjacentElement('beforebegin', filter);

  const progress = document.createElement('div');
  progress.id = 'progress-container';
  progress.innerHTML = '<div id="progress-bar"><div id="progress-fill"></div></div>';
  form.insertAdjacentElement('afterend', progress);

  let draggedItem = null;

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  renderTasks();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    const due = dueDateInput.value;
    const category = prompt("Enter a category/tag for this task (optional):") || '';
    if (text) {
      const task = { text, due, category, completed: false };
      tasks.push(task);
      saveTasks();
      renderTasks();
      taskInput.value = '';
      dueDateInput.value = '';
    }
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  filter.addEventListener('change', renderTasks);

  function renderTasks() {
    taskList.innerHTML = '';
    const selectedCategory = filter.value;
    const categories = new Set();

    tasks.forEach(task => categories.add(task.category));
    filter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
      if (cat) {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        filter.appendChild(opt);
      }
    });

    tasks.filter(t => selectedCategory === 'all' || t.category === selectedCategory)
      .forEach(task => addTaskToDOM(task));

    updateProgress();
  }

  function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.draggable = true;
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} />
      <span><strong>${task.text}</strong> ${task.due ? '(' + task.due + ')' : ''} <span class="category">${task.category}</span></span>
      <span>
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">❌</button>
      </span>
    `;
    taskList.appendChild(li);

    li.querySelector('input[type="checkbox"]').addEventListener('change', e => {
      task.completed = e.target.checked;
      saveTasks();
      updateProgress();
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      tasks = tasks.filter(t => t !== task);
      saveTasks();
      renderTasks();
    });

    li.querySelector('.edit-btn').addEventListener('click', () => {
      const newText = prompt("Edit task text:", task.text);
      if (newText) {
        task.text = newText;
        saveTasks();
        renderTasks();
      }
    });

    li.addEventListener('dragstart', () => {
      draggedItem = li;
      li.classList.add('dragging');
    });

    li.addEventListener('dragend', () => {
      draggedItem = null;
      li.classList.remove('dragging');
      updateTasksFromDOM();
    });

    li.addEventListener('dragover', (e) => e.preventDefault());
    li.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedItem && draggedItem !== li) {
        taskList.insertBefore(draggedItem, li);
      }
    });
  }

  function updateTasksFromDOM() {
    const lis = taskList.querySelectorAll('li');
    const newTasks = [];
    lis.forEach(li => {
      const text = li.querySelector('strong').textContent;
      const category = li.querySelector('.category')?.textContent || '';
      const dueMatch = li.textContent.match(/\((\d{4}-\d{2}-\d{2})\)/);
      const completed = li.querySelector('input[type="checkbox"]').checked;
      newTasks.push({ text, due: dueMatch ? dueMatch[1] : '', category, completed });
    });
    tasks = newTasks;
    saveTasks();
    updateProgress();
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function updateProgress() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const percent = total > 0 ? (done / total) * 100 : 0;
    document.getElementById('progress-fill').style.width = percent + '%';
  }
});
