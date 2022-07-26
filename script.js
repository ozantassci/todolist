"use strict";

const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.getElementById("filter");
const clearButton = document.getElementById("clear-todos");

eventListeners();

function eventListeners() {
  form.addEventListener("submit", addTodo);

  //Sayfa yeniden yüklendiğinde todoları local storage'dan çekilmesi
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);

  //Todoların listeden silinmesi
  secondCardBody.addEventListener("click", deleteTodo);

  filter.addEventListener("keyup", filterTodos);

  clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos() {
  if (confirm("Are you sure you want to delete all?")) {
    //Arayüzden todoları temizleme
    while (todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos");
  }
}

function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();

    if (text.indexOf(filterValue) === -1) {
      //Bulamadı
      listItem.setAttribute("style", "display : none !important");
      //setAttribute yeni bir nitelik ekler ve bu niteliğe isteiğimiz değeri verir
    } else {
      listItem.setAttribute("style", "display : block");
    }
  });
}

function addTodo(e) {
  const newTodo = todoInput.value.trim();

  if (newTodo === "") {
    showAlert("danger", "Please, enter todo...");
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "Todo added.");
  }

  e.preventDefault();
}

function getTodosFromStorage() {
  // Storage'dan Todoları Alma
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();

  todos.push(newTodo);

  //Array'leri stringe çevirmek için JSON.stringify() kullanılır.
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
  const alert = document.createElement("div");

  alert.className = `alert alert-${type}`;

  alert.textContent = message;

  firstCardBody.appendChild(alert);

  setTimeout(() => alert.remove(), 1200);
}

function deleteTodo(e) {
  if (e.target.className === "fa fa-remove")
    //parent.Element bir üst ebeveyni kapsar dolayısıyla ebeveynin
    //diğer child'larını da kapsar
    e.target.parentElement.parentElement.remove();
  deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
  showAlert("success", "Deleted");
}

function deleteTodoFromStorage(storagedeleted) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === storagedeleted) {
      todos.splice(index, 1); // Arrayden değeri silebiliriz.
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function addTodoToUI(newTodo) {
  // String değerini list item olarak UI'a (arayüz) ekleyecek
  //List Item Oluşturma
  const listItem = document.createElement("li");
  //Link Oluşturma
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class = 'fa fa-remove'></i>";

  listItem.className = "list-group-item d-flex justify-content-between";

  //Text Node
  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);

  //Todo List'e List Item'ı ekleme
  todoList.appendChild(listItem);
  todoInput.value = "";
}
