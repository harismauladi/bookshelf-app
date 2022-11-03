document.addEventListener('DOMContentLoaded', function () {
    const submit = document.getElementById('form');
    const search = document.getElementById('formSearchBook');
    const bookInfo = [];
    const RENDER_HTML = 'render-object';
    const SAVED_VALUE = 'saved-book';
    const STORAGE_KEY = 'BOOK_SHELF';


    function generateID() {
        return Date.now();
    }

    function generateBookObject(id, title, penulis, year, isCompleted) {
        return {
            id,
            title,
            penulis,
            year,
            isCompleted
        }
    }

    document.addEventListener(SAVED_VALUE, function () {
        console.log(localStorage.getItem(STORAGE_KEY));
    });

    function loadData() {
        const serialData = localStorage.getItem(STORAGE_KEY);
        let bookData = JSON.parse(serialData);

        if (bookData !== null) {
            for (const data of bookData) {
                bookInfo.push(data)
            }
        }
        document.dispatchEvent(new Event(RENDER_HTML));
    }



    function storageExist() {
        if (typeof (Storage) === undefined) {
            alert('Not Supported Browser Version');

            return false;
        }
        return true;
    }

    function saveData() {
        if (storageExist()) {
            const parsedArray = JSON.stringify(bookInfo);
            localStorage.setItem(STORAGE_KEY, parsedArray);
            document.dispatchEvent(new Event(SAVED_VALUE))
        }
    }

    document.addEventListener(RENDER_HTML, function () {
        const uncompletedReadingBook = document.getElementById('bookList');
        uncompletedReadingBook.innerText = '';

        const completedReadingBook = document.getElementById('doneList');
        completedReadingBook.innerText = '';

        for (const bookItem of bookInfo) {
            const bookElment = makeBook(bookItem);
            if (!bookItem.isCompleted) {
                uncompletedReadingBook.append(bookElment);
            } else {
                completedReadingBook.append(bookElment);
            }
        }
    });




    function makeBook(bookObject) {

        const textTitle = document.createElement('h2');
        textTitle.classList.add('bookTitle');
        textTitle.innerText = bookObject.title;

        const textPenulis = document.createElement('p');
        textPenulis.innerText = bookObject.penulis;

        const textYear = document.createElement('p');
        textYear.innerText = bookObject.year;


        const doneButton = document.createElement('button');
        doneButton.classList.add('doneButton');
        doneButton.setAttribute('type', 'menu');
        doneButton.innerText = 'Done';


        const removeButton = document.createElement('button');
        removeButton.classList.add('removeButton');
        removeButton.setAttribute('type', 'menu');
        removeButton.innerText = 'Remove';

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('buttonContainer');
        buttonContainer.append(doneButton, removeButton);



        const textContainer = document.createElement('div');
        textContainer.classList.add('contain-text');
        textContainer.append(textTitle, textPenulis, textYear, buttonContainer);

        const container = document.createElement('div')
        container.classList.add('shadow', 'item-contain');
        container.append(textContainer);
        container.setAttribute('id', 'book-${bookObject.id}');

        function findBook(bookId) {
            for (const bookItem of bookInfo) {
                if (bookItem.id === bookId) {
                    return bookItem;
                }
            }

            return null;
        }

        function addBookToComplete(bookId) {
            const bookTarget = findBook(bookId);

            if (bookTarget == null) {
                return;
            }

            bookTarget.isCompleted = true;
            document.dispatchEvent(new Event(RENDER_HTML));
            saveData();
        }

        function undoBookFromCompleted(bookId) {
            const bookTarget = findBook(bookId);

            if (bookTarget == null) {
                return;
            };

            bookTarget.isCompleted = false;
            document.dispatchEvent(new Event(RENDER_HTML));
            saveData();
        }

        function findBookIndex(bookId) {
            for (const index in bookInfo) {
                if (bookInfo[index].id === bookId) {
                    return index;
                }
            }
            return -1;
        }


        function removeBookFromCompleted(bookId) {
            const bookTarget = findBookIndex(bookId);

            if (bookTarget === -1) {
                return;
            };

            bookInfo.splice(bookTarget, 1);
            document.dispatchEvent(new Event(RENDER_HTML));
            saveData();
        };

        if (bookObject.isCompleted) {
            doneButton.innerText = 'Undo';

            doneButton.addEventListener('click', function () {
                undoBookFromCompleted(bookObject.id);
            });

            removeButton.addEventListener('click', function () {
                removeBookFromCompleted(bookObject.id);
            });

            textContainer.append(doneButton, removeButton)

        } else {

            doneButton.addEventListener('click', function () {
                addBookToComplete(bookObject.id);

            });

            removeButton.addEventListener('click', function () {
                removeBookFromCompleted(bookObject.id);
            });

            textContainer.append(doneButton, removeButton);
        }

        return container
    }

    function addBook() {
        const bookTitle = document.getElementById('title').value;
        const penulis = document.getElementById('name').value;
        const bookYear = document.getElementById('year').value;
        const bookYearNum = parseInt(bookYear);

        if (bookYearNum === null) {
            alert('Input Tahun Wajib Menggunakan Angka!');
        }


        const checkBox = document.getElementById('isCompleted').checked;


        const idGenerator = generateID();
        const bookObject = generateBookObject(idGenerator, bookTitle, penulis, bookYearNum, checkBox);

        bookInfo.push(bookObject);

        document.dispatchEvent(new Event(RENDER_HTML));
        saveData();
    }




    submit.addEventListener('submit', function (action) {

        action.preventDefault();

        addBook();

    });

    function searchBook() {
        const searchValue = document.getElementById('searchType').value;
        const bookTitle = document.querySelectorAll('.bookTitle');

        for (const book of bookTitle) {
            if (!book.innerText.toLowerCase().includes(searchValue.toLowerCase())) {
                book.parentElement.parentElement.remove();
            }
        }
    }

    search.addEventListener('submit', function (e) {
        e.preventDefault();

        searchBook();

    });

    if (storageExist()) {
        loadData();
    }




})