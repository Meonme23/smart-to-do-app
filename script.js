// Updated script.js with drag & drop, edit, and tags

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const dueDateInput = document.getElementById('due-date');
  const taskList = document.getElementById('task-list');
  const themeToggle = document.getElementById('theme-toggle');

  let draggedItem = null;

  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(addTaskToDOM);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    const due = dueDateInput.value;
    const category = prompt("Enter a category/tag for this task (optional):") || '';
    if (text) {
      const task = { text, due, category };
      addTaskToDOM(task);
      saveTask(task);
      taskInput.value = '';
      dueDateInput.value = '';
    }
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.draggable = true;
    li.innerHTML = `
      <span><strong>${task.text}</strong> ${task.due ? '(' + task.due + ')' : ''} <span class="category">${task.category}</span></span>
      <span>
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">❌</button>
      </span>
    `;
    taskList.appendChild(li);

    li.querySelector('.delete-btn').addEventListener('click', () => {
      li.remove();
      removeTask(task.text);
    });

    li.querySelector('.edit-btn').addEventListener('click', () => {
      const newText = prompt("Edit task text:", task.text);
      if (newText) {
        task.text = newText;
        updateTasks();
      }
    });

    li.addEventListener('dragstart', () => {
      draggedItem = li;
      li.classList.add('dragging');
    });

    li.addEventListener('dragend', () => {
      draggedItem = null;
      li.classList.remove('dragging');
      updateTasks();
    });

    li.addEventListener('dragover', (e) => e.preventDefault());
    li.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedItem && draggedItem !== li) {
        taskList.insertBefore(draggedItem, li);
      }
    });
  }

  function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function updateTasks() {
    const lis = taskList.querySelectorAll('li');
    const newTasks = [];
    lis.forEach(li => {
      const text = li.querySelector('strong').textContent;
      const category = li.querySelector('.category')?.textContent || '';
      const dueMatch = li.textContent.match(/\((\d{4}-\d{2}-\d{2})\)/);
      newTasks.push({ text, due: dueMatch ? dueMatch[1] : '', category });
    });
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }
});
