$(function () {
    const URL= 'https://phonebook-ivanov.firebaseio.com/';
    const PERSON = $('#person');
    const PHONE = $('#phone');
    const PHONE_BOOK = $('#phonebook');

    $('#btnLoad').on('click', loadContacts);
    $('#btnCreate').on('click', createContact);

    function loadContacts() {
        PHONE_BOOK.empty();
        $.get(URL + '.json')
            .then(displayContacts)
            .catch(displayError);
    }

    function displayContacts(contacts) {
        for (let key in contacts) {
            let contact = contacts[key];
            // console.log(contact);
            PHONE_BOOK.append(createLi(contact, key))
        }
    }

    function createLi(contact, key) {
        return $('<li>').text(`${contact.name}: ${contact.phone}`)
            .append($('<button>').text('Delete')
                .on('click', function () {
                    deleteContact(key);
                    $(this).parent().remove();
                }))
    }


    function displayError() {
        PHONE_BOOK.append($('<li>Error</li>'))
    }
    
    function createContact() {
        let newContact = {
            name : PERSON.val(),
            phone: PHONE.val()
        };

        function appendContact(res) {
            console.log(res.name)
            PHONE_BOOK.append(createLi(newContact, res.name));
        }

        $.post(URL + '.json', JSON.stringify(newContact))
            .then(appendContact)
            .catch(displayError)
        PERSON.val('');
        PHONE.val('');
    }

    function deleteContact(key) {
        $.ajax({
            method: 'DELETE',
            url: URL + `/${key}.json`
        })
            .catch(displayError);
    }

});