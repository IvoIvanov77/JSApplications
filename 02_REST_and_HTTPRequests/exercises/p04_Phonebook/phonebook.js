function attachEvents(){
    const URL = 'https://phonebook-nakov.firebaseio.com/phonebook';
    const PHONE_BOOK = $('#phonebook');
    const LOAD_BTN = $('#btnLoad');
    const CREATE_BTN = $('#btnCreate');
    const NAME = $('#person');
    const PHONE_NUMBER = $('#phone');

    LOAD_BTN.on('click', loadContacts);
    CREATE_BTN.on('click', createContact);

    function createContact() {
        let contact = {
            person : NAME.val(),
            phone : PHONE_NUMBER.val()
        };
        $.post(URL + '.json', JSON.stringify(contact))
            .then(() =>{
                loadContacts();
                NAME.val('');
                PHONE_NUMBER.val('')
            })
    }

    function loadContacts() {
        $.get(URL + '.json')
            .then(displayContacts)
            .catch(error);
    }

    function error() {
        PHONE_BOOK.append('<li>Error</li>')
    }

    function displayContacts(res) {
        PHONE_BOOK.empty();
        function deleteContact(key) {
            $.ajax(
                {
                    url : URL + '/' + key + '.json',
                    method : 'delete'
                }).then(loadContacts)
        }

        function createLi(contact, key) {
           PHONE_BOOK
               .append($('<li>').text(`${contact.person}: ${contact.phone}`)
                   .append($('<button>').text('Delete').on('click', () => deleteContact(key))))
        }

        for (let key in res) {
            let contact = res[key];
            createLi(contact, key);
        }
    }
}


