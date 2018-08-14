$(() => {

    const app = Sammy('#container', function () {

        this.use('Handlebars', 'hbs');

        this.before('', function () {
            this.loggedIn = sessionStorage.getItem('userId');
            this.username = sessionStorage.getItem('username');

        });

        function renderMainPage(context, page, templates) {
            let obj= {
                loggedInHeader: 'templates/common/loggedInHeader.hbs',
                questHeader: 'templates/common/questHeader.hbs',
                footer: 'templates/common/footer.hbs',
                page: page
            };
            for (let key in templates) {
                obj[key] = templates[key];
            }
            return context.loadPartials(obj)
                .then(function () {
                    this.partial('templates/main_page.hbs')
                })
        }

        this.get('index.html', function(){
            if(!sessionStorage.getItem('userId')){
                this.redirect('#/login');
            }else {
                this.redirect('#/listFlights')
            }
        });

        this.get('#/login', function(){
            renderMainPage(this, 'templates/login/loginPage.hbs',
                {
                    loginForm: 'templates/login/loginForm.hbs'
                }).then((res) => {

            });
        });

        this.get('#/register', function(){
            messages.showLoading();
            renderMainPage(this, 'templates/register/registerPage.hbs',
                {
                    registerForm: 'templates/register/registerForm.hbs'
                })
                .then((res) => {
                    messages.hideLoading();
                });
        });

        this.get('#/listFlights', async function(){
            messages.showLoading();
            let result = await modelService.getQuery('?query={"is_public":"true"}')
                .catch((reason) => {
                            messages.hideLoading();
                            messages.handleError(reason);
                });
            result.forEach((flight) => {
                flight.destination = flight.destination.toUpperCase();
                let time = new Date(flight.departure_time)
                flight.day = time.toLocaleString("en-us", { day: "2-digit" });
                flight.month = time.toLocaleString("en-us", { month: "long" });

            });
            this.publicFlights = result;
            renderMainPage(this, 'templates/items/showItems.hbs',
                {
                    singleItem: 'templates/items/singleItem.hbs'
                })
                .then(() => {
                    messages.hideLoading();

                });
        });

        this.get('#/addFlight', function(){

            renderMainPage(this, 'templates/createItem/createPage.hbs',
                {
                    createForm: 'templates/createItem/createForm.hbs'
                })

        });

        this.get('#/details/:id', async function(){
            messages.showLoading();
            let obj = await modelService.loadDetails(this.params['id'])
                .catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });
            this.flight = obj;
            let date = new Date(obj.departure_time);
            this.day = date.toLocaleString("en-us", { day: "2-digit" });
            this.month = date.toLocaleString("en-us", { month: "long" });
            this.hour = ("0" + date.getHours()).slice(-2);
            this.minute = ("0" + date.getMinutes()).slice(-2);
            this.isAuthor = obj._acl.creator === sessionStorage.getItem('userId');

            renderMainPage(this, 'templates/items/details.hbs')
                .then((res) => {
                    messages.hideLoading();
                });
        });

        this.get('#/edit/:id', async function(){

            messages.showLoading();
            let obj = await modelService.loadDetails(this.params['id'])
                .catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });
            messages.hideLoading();
            let flag = await isAuthor(obj);

            if(flag){
                await renderMainPage(this, 'templates/editItem/editPage.hbs',
                    {
                        editForm: 'templates/editItem/editForm.hbs'
                    });
                this.flight = obj;
                let date = new Date(obj.departure_time);
                this.day = date.toLocaleString("en-us", { day: "2-digit" });
                this.month = ("0" + (date.getMonth() + 1)).slice(-2);
                this.year = date.getFullYear();
                this.hour = ("0" + date.getHours()).slice(-2);
                this.minute = ("0" + date.getMinutes()).slice(-2);
                this.isPublic = obj.is_public === 'true';


            }else {
                this.redirect('#/listFlights');
            }

        });

        this.get('#/myFlights', async function(){
            messages.showLoading();
            let result = await modelService.getQuery(`?query={"_acl.creator":"${sessionStorage.getItem('userId')}"}`)
                .catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });
            result.forEach((flight) => {
                flight.destination = flight.destination.toUpperCase();
                let time = new Date(flight.departure_time);
                flight.day = time.toLocaleString("en-us", { day: "2-digit" });
                flight.month = time.toLocaleString("en-us", { month: "long" });
                flight.hour = ("0" + time.getHours()).slice(-2);
                flight.minute = ("0" + time.getMinutes()).slice(-2);

            });
            this.myFlights = result;
            renderMainPage(this, 'templates/MyItems/viewMyItems.hbs',
                {
                    singleFlight: 'templates/MyItems/singleMyItem.hbs'
                })
                .then((res) => {
                messages.hideLoading();
            });
        });

        this.get('#/delete/:id', function(){
            messages.showLoading();
            modelService.remove(this.params['id'])
                .then(() => {
                    messages.hideLoading();
                    messages.showInfo('Flight deleted.');
                    this.redirect('#/myFlights');

                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });
        });

        this.post('register', function () {

            let username = this.params['username'];
            let password = this.params['pass'];
            let repeatPassword = this.params['checkPass'];

            if(!validator.register(username, password, repeatPassword)){
                return;
            }
            messages.showLoading();

            auth.register(username, password, repeatPassword)
                .then((res) => {
                    messages.hideLoading();
                    auth.saveSession(res);
                    this.redirect('#/listFlights')
                    messages.showInfo('User registration successful');
                }).catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
            })
        });

        this.post('login', function () {

            let username = this.params['username'];
            let password = this.params['pass'];


            if(!validator.login(username, password)){
                return;
            }
            messages.showLoading();

            auth.login(username, password)
                .then((res) => {
                    messages.hideLoading();
                    auth.saveSession(res);
                    this.redirect('#/listFlights')
                    messages.showInfo('User login successful');
                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            })
        });

        this.get('#/logout', function(){
            messages.showLoading();
            auth.logout()
                .then(() => {
                    messages.hideLoading();
                    sessionStorage.clear();
                    this.redirect('#/login');
                    messages.showInfo('Logout successful');

                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });
        });


        this.post('create', function () {

            let destination = this.params['destination'];
            let origin = this.params['origin'];
            let departureDate = this.params['departureDate'];
            let departureTime = this.params['departureTime'];
            let seats = this.params['seats'];
            let cost = this.params['cost'];
            let image = this.params['img'];
            let isPublic = this.params['public'];

            if(!validator.entry(destination, origin, seats, cost)){
                return;
            }

            let departure_time = new Date(departureDate + '/' + departureTime);
            let is_public = isPublic === 'on';

            let obj = {destination, origin, departure_time, seats, cost, image, is_public};
            this.$element('#addItemBtn').attr('disabled', 'disabled');
            messages.showLoading();

            modelService.createItem(obj)
                .then((res) => {
                    messages.hideLoading();
                    messages.showInfo('Created flight.');
                    this.redirect('#/listFlights');
                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });


        });

        this.post('#/edit/:id', function () {

            let destination = this.params['destination'];
            let origin = this.params['origin'];
            let departureDate = this.params['departureDate'];
            let departureTime = this.params['departureTime'];
            let seats = this.params['seats'];
            let cost = this.params['cost'];
            let image = this.params['img'];
            let isPublic = this.params['public'];

            if(!validator.entry(destination, origin, seats, cost)){
                return;
            }

            let departure_time = new Date(departureDate + '/' + departureTime);
            let is_public = isPublic === 'on';

            let obj = {destination, origin, departure_time, seats, cost, image, is_public};

            messages.showLoading();

            modelService.edit(this.params['id'], obj)
                .then((res) => {
                    messages.hideLoading();
                    messages.showInfo('Successfully edited flight.');
                    this.redirect(`#/details/${this.params['id']}`);
                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });
        });

        /**
         * @return {boolean}
         */
        function isAuthor(obj) {
            return obj._acl.creator === sessionStorage.getItem('userId');

        }
    });

    app.run();
});