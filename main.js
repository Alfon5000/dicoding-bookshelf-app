const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'bookshelf-data';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

function findBooks(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung local storage!');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = "Penulis:" + author;

  const textYear = document.createElement('p');
  textYear.innerText = "Tahun:" + year;

  const bookButton = document.createElement('div');
  bookButton.classList.add('action');

  const incompleteButton = document.createElement('button');
  incompleteButton.classList.add('green');
  incompleteButton.innerText = 'Belum selesai dibaca';

  const completeButton = document.createElement('button');
  completeButton.classList.add('green');
  completeButton.innerHTML = 'Selesai dibaca';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('red');
  deleteButton.innerHTML = 'Hapus buku';

  const textContainer = document.createElement('article');
  textContainer.classList.add('book_item');
  textContainer.append(textTitle, textAuthor, textYear);
  textContainer.append(bookButton);
  textContainer.setAttribute('id', `book-${bookObject.id}`);

  if (isComplete) {
    incompleteButton.addEventListener('click', function () {
      addBookToIncomplete(bookObject.id);
    });

    deleteButton.addEventListener('click', function () {
      deleteBook(bookObject.id);
    });

    bookButton.append(incompleteButton, deleteButton);
  } else {
    completeButton.addEventListener('click', function () {
      addBookToComplete(id);
    });

    deleteButton.addEventListener('click', function () {
      deleteBook(id);
    });

    bookButton.append(completeButton, deleteButton);
  }
  return textContainer;
}

function addBooks() {
  const textBooks = document.getElementById('inputBookTitle').value;
  const textAuthor = document.getElementById('inputBookAuthor').value;
  const textYear = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const generateID = generateId();
  const booksObject = generateBookObject(generateID, textBooks, textAuthor, textYear, isComplete);
  books.push(booksObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToComplete(bookId) {
  const bookTarget = findBooks(bookId);
  if (bookTarget == null) {
    return;
  }

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) {
    return;
  }

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToIncomplete(bookId) {
  const bookTarget = findBooks(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitform = document.getElementById('inputBook');

  submitform.addEventListener('submit', function (e) {
    e.preventDefault();
    addBooks();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookList = document.getElementById('incompleteBookshelfList');
  const completeBookList = document.getElementById('completeBookshelfList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
});

document.getElementById("searchSubmit").addEventListener("click", (e) => {
  const inputTitle = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookList = document.querySelectorAll("h3");

  for (let book of bookList) {
    const title = book.textContent.toLowerCase();
    console.log(title);
    if (title.includes(inputTitle)) {
      book.parentElement.style.display = "block";
    } else {
      book.parentElement.style.display = "none";
    }
  }
  e.preventDefault();
});