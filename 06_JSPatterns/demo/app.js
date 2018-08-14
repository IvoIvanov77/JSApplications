$(() => {

    Sammy('#main',function () {

        this.use('Handlebars', 'hbs');



        $.get('data.json').then(loadProducts);


        function loadProducts(res) {
            // console.log(JSON.stringify(res));
            localStorage.setItem('products', JSON.stringify(res));

        }

        function displayHomePage(context, page) {
            context.loadPartials({
                header : 'templates/header.hbs',
                footer: 'templates/footer.hbs',
                page : page
            }).then(function () {
                this.partial('templates/main_page.hbs')
            })
        }

        this.get('index.html', function(){
            this.username = localStorage.getItem('username');
            if(!this.username){
                this.username = 'Guest';
            }


            displayHomePage(this, 'templates/home.hbs');
        });

        this.get('#/about', function(){
            displayHomePage(this, 'templates/about.hbs');
        });

        this.get('#/contact', function(){
            displayHomePage(this, 'templates/contact.hbs');
        });

        this.get('#/login', function(){
            displayHomePage(this, 'templates/login_form.hbs');
        });

        this.get('#/products', function(){
            this.products = JSON.parse(localStorage.getItem('products'));
            displayHomePage(this, 'templates/products.hbs');
        });

        this.get('#/details/:productId', function(){
            // console.log(this.params.productId);
            // this.id = this.params.productId;
            this.product = JSON.parse(localStorage.getItem('products'))
                .filter(p => p.id === this.params.productId)[0];
            displayHomePage(this, 'templates/details.hbs');
        });

        this.post('#/login', function(){
            localStorage.setItem('username', this.params.name);
            this.redirect('#/index.html');

        });

    }).run();

    // app.run();
});

