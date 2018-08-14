$(() => {

    const app = Sammy('#main', function () {

        this.use('Handlebars', 'hbs');

        this.before('', function () {
            this.loggedIn = sessionStorage.getItem('userId');
            this.username = sessionStorage.getItem('username');

        });

        function renderMainPage(context, page, templates) {
            let obj= {
                header: 'templates/common/header.hbs',
                navigation: 'templates/common/navigation.hbs',
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


        async function renderPage(context, username, query) {

            messages.showLoading();
            let counter = await utils.counter(username)
                .catch((reason) => {
                    messages.handleError(reason);
                    messages.hideLoading();
                });

            context.chirpsCount = counter[0].length;
            if(counter[1][0].subscriptions){
                context.followingCount = counter[1][0].subscriptions.length;
            }else{
                context.followingCount = 0;
            }
            context.followersCount = counter[2].length;

            let result = await models
                .chirpsService.getQuery(query)
                .catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });
            result.forEach(ch =>{
                ch.isAuthor = isAuthor(ch);
                ch.time = utils.calcTime(ch._kmd.ect);
            });

            //todo time
            context.chirps = result;
            renderMainPage(context, 'templates/items/profilePage.hbs',
                {
                    createForm: 'templates/items/createForm.hbs',
                    userStats: 'templates/items/userStats.hbs',
                    singleChirp: 'templates/items/singleItem.hbs'
                }).then(() => {
                    messages.hideLoading();
            })

        }

        this.get('index.html', function(){
            if(!sessionStorage.getItem('userId')){
                this.redirect('#/login');
            }else {
                this.redirect('#/home');
            }
        });

        this.get('#/login', function(){
            renderMainPage(this, 'templates/login/loginPage.hbs',
                {
                    loginForm: 'templates/login/loginForm.hbs',
                }).then((res) => {

            });
        });

        this.get('#/register', function(){
            renderMainPage(this, 'templates/register/registerPage.hbs',
                {
                    registerForm: 'templates/register/registerForm.hbs',
                }).then((res) => {

            });
        });

        this.get('#/home', async function(){
            let subs = sessionStorage.getItem('subs');
            let username = sessionStorage.getItem('username');
            this.isMyProfile = true;

            renderPage(this, username, `?query={"author":{"$in": ${subs}}}&sort={"_kmd.ect": 1}`)
                .catch((reason) => {
                    messages.hideLoading();
                    console.log(reason)
                })
        });

        this.get('#/myChirps', async function(){
            let username = sessionStorage.getItem('username');
            this.isMyProfile = true;

            renderPage(this, username, `?query={"author":"${username}"}&sort={"_kmd.ect": 1}`)
                .catch((reason) => {
                    messages.hideLoading();
                    console.log(reason)
                })
        });

        this.get('#/allUsers', async function(){

            let result = await auth.listAll();
            let promises = [];
            result.forEach(u => {
                promises.push(auth.getQuery(`?query={"subscriptions":"${u.username}"}`))
            });
            let followers = await Promise.all(promises)
            result.forEach((u, i) =>{
                u.followersCount = followers[i].length;
            });
            this.users = result.filter(u => u.username !== sessionStorage.getItem('username'));
            let following =
            renderMainPage(this, 'templates/users/discover.hbs',
                {
                    singleUser: 'templates/users/singleUser.hbs',
                }).then((res) => {

            });
        });

        this.get('#/profile/:username', async function(){
            let username = this.params['username'];
            this.isMyProfile = false;
            this.username = username;
            let subs = JSON.parse(sessionStorage.getItem('subs'));
            this.following = subs.includes(this.params['username']);


            renderPage(this, username, `?query={"author":"${username}"}&sort={"_kmd.ect": 1}`)
                .catch((reason) => {
                    messages.hideLoading();
                    console.log(reason)
                })
        });

        this.get('#/unfollow/:username', async function(){
            let username = this.params['username'];
            let subs = JSON.parse(sessionStorage.getItem('subs'))
                .filter(u => u !== username);
            messages.showLoading();
            auth.edit({subscriptions: subs})
                .then((res) => {
                    auth.saveSession(res);
                    messages.hideLoading();
                    this.redirect('#/profile/' + username);
                    messages.showInfo(`Unsubscribted to ${username}`)
                })
                .catch((reason) => {
                    messages.hideLoading();
                    console.log(reason)
                });
        });

        this.get('#/follow/:username', async function(){
            let username = this.params['username'];
            let subs = JSON.parse(sessionStorage.getItem('subs'));
            subs.push(username);
            messages.showLoading();
            auth.edit({subscriptions: subs})
                .then((res) => {
                    auth.saveSession(res);
                    messages.hideLoading();
                    this.redirect('#/profile/' + username);
                    messages.showInfo(`Subscribed to ${username}`)
                })
                .catch((reason) => {
                    messages.hideLoading();
                    console.log(reason)
                });
        });

        this.get('#/delete/:id', function(){
            messages.showLoading();
            models.chirpsService.remove(this.params['id'])
                .then(() => {
                    messages.hideLoading();
                    messages.showInfo('Chirp deleted.');
                    this.redirect('#/myChirps');

                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });
        });

        this.post('register', function () {

            let username = this.params['username'];
            let password = this.params['password'];
            let repeatPassword = this.params['repeatPass'];

            if(!validator.register(username, password, repeatPassword)){
                return;
            }
            messages.showLoading();

            auth.register(username, password, repeatPassword)
                .then((res) => {
                    messages.hideLoading();
                    auth.saveSession(res);
                    this.redirect('#/home');
                    messages.showInfo('User registration successful');
                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            })
        });

        this.post('login', function () {

            let username = this.params['username'];
            let password = this.params['password'];

            if(!validator.login(username, password)){
                return;
            }
            messages.showLoading();

            auth.login(username, password)
                .then((res) => {
                    messages.hideLoading();
                    auth.saveSession(res);
                    this.redirect('#/home')
                    messages.showInfo('Login successful');
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

            let text = this.params['text'];
            let author = sessionStorage.getItem('username');

            // if(!validator.post(url, title)){
            //     return;
            // }
            let obj = {text, author};
            this.$element('#bbtnSubmitChirp').attr('disabled', 'disabled');
            messages.showLoading();

            models.chirpsService.createItem(obj)
                .then((res) => {
                    messages.hideLoading();
                    messages.showInfo('Post created');
                    this.redirect('#/myChirps');
                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });
        });

        function isAuthor(obj) {
            return obj.author === sessionStorage.getItem('username');
        }

    });

    app.run();
});