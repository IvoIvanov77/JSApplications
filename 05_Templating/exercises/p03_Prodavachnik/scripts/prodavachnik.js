$(() => {

    const app = Sammy('#main', function () {

        this.use('Handlebars', 'hbs');

        this.before('', function () {
            this.loggedIn = sessionStorage.getItem('userId');
            this.username = sessionStorage.getItem('username');

        });

        function renderPageWithPartial(context, formName, formTemplate, pageTemplate) {
            let obj= {
                header: 'templates/header.hbs',
                loadingBox:  'templates/loadingBox.hbs',
                footer: 'templates/footer.hbs'
            };
            obj[formName] = formTemplate;
            return context.loadPartials(obj)
                .then(function () {
                    this.partial(pageTemplate)
                })
        }

        this.get('index.html', function(){
            this.redirect('#/home')

        });

        this.get('#/home', function(){

            let obj= {
                header: 'templates/header.hbs',
                loadingBox:  'templates/loadingBox.hbs',
                footer: 'templates/footer.hbs'
            };

            return this.loadPartials(obj)
                .then(function () {
                    this.partial('templates/home.hbs');
                });

        });

        this.get('#/login', function(){
            renderPageWithPartial(this, 'loginForm',
                'templates/login/loginForm.hbs', 'templates/login/loginPage.hbs');
        });

        this.get('#/register', function(){
            renderPageWithPartial(this, 'registerForm',
                'templates/register/registerForm.hbs', 'templates/register/registerPage.hbs')
        });

        this.get('#/advertisements',function(){
            messages.show();
            modelService.loadItems()
                .then((res) => {
                    this.adds = res;
                    this.adds.forEach(add => {
                        if(add._acl.creator === sessionStorage.getItem('userId')){
                            add.isAuthor = true;
                        }
                    });
                    renderPageWithPartial(this, 'singleAdd',
                        'templates/adds/singleAdd.hbs', 'templates/adds/showAdds.hbs')
            });

        });

        this.get('#/createAdvertisement', function(){
            renderPageWithPartial(this, 'createForm',
                'templates/createAdd/createForm.hbs', 'templates/createAdd/createPage.hbs')
        });


        this.post('/#login', function () {
            messages.show();
            let username = this.params.username;
            let password = this.params.passwd;
            auth.login(username, password)
                .then((res) => {
                    auth.saveSession(res);
                    messages.showInfo('login success');
                    this.redirect('#/home');
                }).catch((reason) => {
                    messages.handleError(reason)
            })
        });

        this.post('/#register', function () {
            messages.show();
            let username = this.params.username;
            let password = this.params.passwd;
            auth.register(username, password)
                .then((res) => {
                    auth.saveSession(res);
                    messages.showInfo('register success');
                    this.redirect('#/home');
                }).catch((reason) => {
                messages.handleError(reason)
            });
        });

        this.post('/#create', function () {
            messages.show();
            let obj = {
                title: this.params['title'],
                author: sessionStorage.getItem('username'),
                description: this.params['description'],
                date: this.params['datePublished'],
                price: this.params['price'],
            };

            modelService.createItem(obj)
                .then(() => {
                    messages.showInfo('create success');
                    this.redirect('#/advertisements');
                }).catch((reason) => {
                messages.handleError(reason)
            })

        });

        this.get('#/logout', function(){
            messages.show();
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    messages.showInfo('logout success');
                    this.redirect('#/login');

                }).catch((reason) => {
                messages.handleError(reason)
            })
        });

        this.get('#/delete/:id', function(){
            messages.show();
            modelService.remove(this.params.id).then(() => {
                messages.showInfo('delete success');
                this.redirect('#/advertisements')
            }).catch((reason) => {
                messages.handleError(reason)
            });

        });

        this.get('#/edit/:id', function(){
            modelService.loadDetails(this.params.id)
                .then((res) =>{
                    this.item = res;
                    console.log(this.item);
                    renderPageWithPartial(this, 'editForm',
                        'templates/editAdd/editForm.hbs', 'templates/editAdd/editPage.hbs')

            });
        });

        this.post('#/edit', function () {
            messages.show();
            let obj = {
                title: this.params['title'],
                author: sessionStorage.getItem('username'),
                description: this.params['description'],
                date: this.params['datePublished'],
                price: this.params['price'],
            };
            modelService.edit(this.params['id'], obj)
                .then(() => {
                    messages.showInfo('edit success');
                    this.redirect('#/advertisements');
                }).catch((reason) => {
                messages.handleError(reason)
            })
        })

    });

    app.run();
});