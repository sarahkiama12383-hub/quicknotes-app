// Selecting DOM elements
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");

// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem("quick_notes")) || [];

// Save to localStorage
function saveToStorage() {
  localStorage.setItem("quick_notes", JSON.stringify(notes));
}

// Update note count message
function updateCountMessage(count) {
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

// Render notes list
function render() {
  notesList.textContent = "";
  const query = searchInput.value.toLowerCase().trim();

  const filtered = notes.filter(n => n.text.toLowerCase().includes(query));

  updateCountMessage(filtered.length);

  if (filtered.length === 0 && query !== "") {
    const emptyMsg = document.createElement("li");
    emptyMsg.textContent = "No notes match your search.";
    notesList.appendChild(emptyMsg);
    return;
  }

  filtered.forEach(note => {
    const li = document.createElement("li");
    li.className = `note-card category-${note.category}`;

    const infoDiv = document.createElement("div");
    
    const pText = document.createElement("p");
    pText.textContent = note.text; // Safe text rendering

    const smallMeta = document.createElement("small");
    smallMeta.textContent = `[${note.category.toUpperCase()}] - ${note.createdAt}`;
    smallMeta.style.color = "#666";

    infoDiv.appendChild(pText);
    infoDiv.appendChild(smallMeta);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(infoDiv);
    li.appendChild(delBtn);
    notesList.appendChild(li);
  });
}

// Add Note Handler
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = noteInput.value.trim();

  // Validation
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = ""; // Clear error

  const newNote = {
    id: Date.now(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };

  notes.unshift(newNote);
  saveToStorage();
  render();

  noteInput.value = "";
});

// Delete Note Handler
function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveToStorage();
  render();
}

// Search Listener
searchInput.addEventListener("input", render);

// Initial call
render();
