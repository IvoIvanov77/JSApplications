const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_Bk7jSyUfQ';
const APP_SECRET = 'ad0b62a2b067436a83b24fb7c2055876';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
// const BOOKS_PER_PAGE = 10;

function request(method, url, headers, data) {
    return $.ajax({
        method: method,
        url: BASE_URL + url,
        headers: headers,
        data: data
    })
}

function loginUser() {
    let user = {
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=passwd]').val()
    };
    request('POST', 'user/' + APP_KEY + '/login', AUTH_HEADERS, user)
        .then(function (res){
        signInUser(res, 'Login successful.')
        })
        .catch(handleAjaxError)
}

function registerUser() {
    let user = {
        username: $('#formRegister input[name=username]').val(),
        password: $('#formRegister input[name=passwd]').val()
    };

    request('POST', 'user/' + APP_KEY , AUTH_HEADERS, user)
        .then(function (res){
            signInUser(res, 'Login successful.')
        })
        .catch(handleAjaxError)

}

function listBooks() {
    $('#books').empty();
    showView("viewBooks");

    request('GET', 'appdata/' + APP_KEY + '/books', userAuthHeaders())
        .then(loadBooks)
        .catch(handleAjaxError)
}

function userAuthHeaders() {
    return {
        'Authorization': "Kinvey " +
        sessionStorage.getItem('authToken'),
    };
}

function createBook() {
    let book = {
        title: $('#formCreateBook input[name=title]').val(),
        author: $('#formCreateBook input[name=author]').val(),
        description: $('#formCreateBook textarea[name=description]').val()
    };

    request('POST', 'appdata/' + APP_KEY + '/books', userAuthHeaders(), book)
        .then(createBookSuccess)
        .catch(handleAjaxError)
}

function deleteBook(book) {
    request('DELETE', 'appdata/' + APP_KEY + '/books/' + book._id, userAuthHeaders())
        .then(deleteBookSuccess)
        .catch(handleAjaxError)
}

function loadBookForEdit(book) {
    request('GET', 'appdata/' + APP_KEY + '/books/' + book._id, userAuthHeaders())
        .then(loadBookForEditSuccess)
        .catch(handleAjaxError)
}

function editBook() {
    let id = $('#formEditBook input[name=id]').val();
    let book = {
        title: $('#formEditBook input[name=title]').val(),
        author: $('#formEditBook input[name=author]').val(),
        description: $('#formEditBook textarea[name=description]').val()
    };

    request('PUT', 'appdata/' + APP_KEY + '/books/' + id, userAuthHeaders(), book)
        .then(editBookSuccess)
        .catch(handleAjaxError)
}

function saveAuthInSession(userInfo) {
    sessionStorage.setItem('username', userInfo.username);
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
    sessionStorage.setItem('userId', userInfo._id);
}

function logoutUser() {
    sessionStorage.clear();
    showHomeView();
    showHideMenuLinks();
    showInfo('Logout successful.')
}

function signInUser(res, message) {
    saveAuthInSession(res);
    showHomeView();
    showHideMenuLinks();
    showInfo(message);
}

function loadBooks(books) {
    showInfo('Books loaded.');
    let booksElement = $('#books');
    if(books.length === 0){
        booksElement.text('No books in the library.')
    }else{
        let table = $('<table>')
            .append($('<tr>')
                .append($('<th>').text('Title'))
                .append($('<th>').text('Author'))
                .append($('<th>').text('Description'))
                .append($('<th>').text('Actions'))
            );
        books.forEach(book => addRow(book, table));
        booksElement.append(table);
    }

    function addRow(book, table){
        let links = [];
        if (book._acl.creator === sessionStorage['userId']) {
            let deleteLink = $('<a href="#">[Delete]</a>')
                .on('click', deleteBook.bind(this, book));
            let editLink = $('<a href="#">[Edit]</a>')
                .on('click', loadBookForEdit.bind(this, book));
            links = [deleteLink, ' ', editLink];
        }

        table
            .append($('<tr>')
                .append($('<td>').text(book.title))
                .append($('<td>').text(book.author))
                .append($('<td>').text(book.description))
                .append($('<td>').append(links))
            )
    }
}

function createBookSuccess(res) {
    listBooks();
    showInfo('Book created.');
}

function deleteBookSuccess(res) {
    listBooks();
    showInfo('Book deleted.');
}

function editBookSuccess(res) {
    listBooks();
    showInfo('Book edited.');
}

function loadBookForEditSuccess(book){
    $('#formEditBook input[name=id]').val(book._id);
    $('#formEditBook input[name=title]').val(book.title);
    $('#formEditBook input[name=author]').val(book.author);
    $('#formEditBook textarea[name=description]').val(book.description);
    showView('viewEditBook');
}

// function displayPaginationAndBooks(books) {
//     let pagination = $('#pagination-demo')
//     if(pagination.data("twbs-pagination")){
//         pagination.twbsPagination('destroy')
//     }
//     pagination.twbsPagination({
//         totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
//         visiblePages: 5,
//         next: 'Next',
//         prev: 'Prev',
//         onPageClick: function (event, page) {
//             // TODO remove old page books
//             let startBook = (page - 1) * BOOKS_PER_PAGE
//             let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length)
//             $(`a:contains(${page})`).addClass('active')
//             for (let i = startBook; i < endBook; i++) {
//                 // TODO add new page books
//             }
//         }
//     })
// }

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response)
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error."
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description
    showError(errorMsg)
}