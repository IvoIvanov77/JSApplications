const REPO = {};
$(() => {

    const app = Sammy('#container', function () {

        this.use('Handlebars', 'hbs');

        this.before('', function () {
            this.loggedIn = sessionStorage.getItem('userId');
            this.username = sessionStorage.getItem('username');

        });

        this.get('index.html', function(){
            this.redirect('#/home')

        });

        this.get('#/welcome', render.homeScreen);


        this.get('#/home', function(){
            if(sessionStorage.getItem('userId')){
                this.redirect('#/getAll')
            }else{
                this.redirect('#/welcome')
            }
        });

        this.get('#/register', render.register);

        this.get('#/login', render.login);

        this.get('#/create', function (context) {
            if(sessionStorage.getItem('userId')){
                render.createListing(context);
            }else{
                context.redirect('#/welcome')
            }
        });

        this.get('#/getAll', REPO.getAllListings);

        this.get('#/getMy', REPO.getUserListings);

        this.get('#/edit/:id', REPO.getListingForEditing);

        this.get('#/details/:id', REPO.getListingForDetails);

        this.post('register', REPO.registerUser);

        this.post('login', REPO.loginUser);

        this.get('#/logout', REPO.logoutUser);

        this.post('#/createListing', REPO.createListing);

        this.get('#/delete/:id', REPO.deleteListing);

        this.post('/edit', REPO.editListing);

    });

    app.run();
});