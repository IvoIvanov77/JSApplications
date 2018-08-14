$(() => {


    Sammy('#main',function () {

        this.use('Handlebars', 'hbs');

        $.get('contacts.json').then(loadProducts);


        function loadProducts(res) {
            sessionStorage.setItem('contacts', JSON.stringify(res));
        }

        function displayWelcomePage(context, page) {
            context.loadPartials({
                header : 'templates/header.hbs',
                footer: 'templates/footer.hbs',
                form : page
            }).then(function () {
                this.partial('templates/welcome_page.hbs')
            })
        }

        function displayContactsPage(context) {
            context.loadPartials({
                header : 'templates/header.hbs',
                footer: 'templates/footer.hbs',
                contactsList : 'templates/contacts_list.hbs',
                contactDetails: 'templates/contact_details.hbs',
                contactItem: 'templates/contact_list_item.hbs'
            }).then(function () {
                this.partial('templates/contacts_page.hbs')
            })
        }

        this.get('index.html', function(){
            displayWelcomePage(this, 'templates/login_form.hbs');
        });

        this.get('#/', function(){
            displayWelcomePage(this, 'templates/login_form.hbs');
        });

        this.get('#/register', function(){
            displayWelcomePage(this, 'templates/register_form.hbs');
        });

        this.post('#/login', function(){
            //todo
            this.redirect('#/contacts')
        });

        this.post('#/register', function(){
            //todo
            this.redirect('#/contacts')
        });

        this.get('#/contacts', function(){
            this.contacts = JSON.parse(sessionStorage.getItem('contacts'));
            displayContactsPage(this);
        });

        this.get('#/details/:id', function(){
            this.contacts = JSON.parse(sessionStorage.getItem('contacts'));
            this.contact = JSON.parse(sessionStorage.getItem('contacts'))[this.params.id];
            displayContactsPage(this);
        });


    }).run();



});