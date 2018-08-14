$(() => {
    let details;
    let contacts;
    let data;
    
    async function loadFiles() {

        contacts = await $.get('templates/contacts.hbs');
        let contactsTemplate = Handlebars.compile(contacts);
        data = await $.get('data.json');

        details = await $.get('templates/details.hbs');

        let obj = {
            data: data
        };

        let table = contactsTemplate(obj);
        $('#list').append(table);
        attachEvents();
    }

    function loadDetails(index) {
        let detailTemplate = Handlebars.compile(details);
        let html = detailTemplate(data[index]);

        $('#details').empty().append(html);
    }

    function attachEvents(){
        $('.contact').on('click', function () {
            loadDetails($(this).attr('data-id'));
            $('.active').removeClass('active');
            $(this).addClass('active');
        })
    }

    loadFiles();
});