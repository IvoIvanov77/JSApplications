$(() => {
    const app = Sammy('#main', function () {

        this.use('Handlebars', 'hbs');

        this.before('', function () {
            this.loggedIn = sessionStorage.getItem('userId');
            this.username = sessionStorage.getItem('username');
            this.hasTeam = sessionStorage.getItem('teamId');
            this.teamId = sessionStorage.getItem('teamId');

        });

        function renderSinglePage(context, page) {
            context.loadPartials({
                header : 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs'
            }).then(function () {
                this.partial(page)
            })
        }

        function renderPageWithPartial(context, formName, formTemplate, pageTemplate) {
            let obj= { header : 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs'};
            obj[formName] = formTemplate;
            context.loadPartials(obj)
                .then(function () {
                this.partial(pageTemplate)
            })
        }

        this.get('index.html', function(){
            this.redirect('#/home')
        });

        this.get('#/home', function(){
            renderSinglePage(this, 'templates/home/home.hbs');
        });

        this.get('#/about', function(){
            renderSinglePage(this, 'templates/about/about.hbs');
        });

        this.get('#/login', function(){
            renderPageWithPartial(this, 'loginForm',
                'templates/login/loginForm.hbs', 'templates/login/loginPage.hbs')
        });

        this.get('#/register', function(){
            renderPageWithPartial(this, 'registerForm',
                'templates/register/registerForm.hbs', 'templates/register/registerPage.hbs')
        })

        this.get('#/logout', function(){
           auth.logout()
               .then(() => {
                   sessionStorage.clear();
                   this.redirect('#/login')
               })
        });

        this.get('#/catalog', function(){
            teamsService.loadTeams().then((res) =>{
                this.teams = res;
                renderPageWithPartial(this, 'team',
                    'templates/catalog/team.hbs', 'templates/catalog/TeamCatalog.hbs')
            });

        });

        this.get('#/create', function(){
            if(this.hasTeam){
                auth.showError('You already have project');
                this.redirect('#/home');
                return;
            }
            renderPageWithPartial(this, 'createForm',
                'templates/create/createForm.hbs', 'templates/create/createPage.hbs')
        });

        this.get('#/catalog/:teamId', function(context){
            teamsService.loadTeamDetails(this.params.teamId)
                .then((res) => {
                this.name = res.name;
                this.comment = res.comment;
                this.teamId = this.params.teamId;
                this.isAuthor = res._acl.creator === sessionStorage.getItem('userId');
                this.isOnTeam = sessionStorage.getItem('teamId') === res._id;
                teamsService.loadMembers(this.params.teamId)
                    .then((res) => {
                        console.log(res);
                        this.members = res;
                        context.loadPartials({
                            header : 'templates/common/header.hbs',
                            footer: 'templates/common/footer.hbs',
                            teamMember: 'templates/catalog/teamMember.hbs',
                            teamControls: 'templates/catalog/teamControls.hbs',
                        }).then(function () {
                            this.partial('templates/catalog/details.hbs',)
                        })
                    });


            });

        });

        this.get('#/join/:teamId', function () {
            if(this.hasTeam){
                auth.showError('You already have project');
                this.app.refresh();
                // this.redirect('#/home');
                return;
            }
            teamsService.joinTeam(this.params.teamId)
                .then((res) => {
                    auth.saveSession(res);
                    this.redirect('#/catalog/' + this.params.teamId);
                    auth.showInfo('success');
                });
        });

        this.get('#/leave', function () {
            teamsService.leaveTeam()
                .then(() => {
                    this.redirect('#/catalog');
                    auth.showInfo('success');
                })
        });

        this.get('#/edit/:teamId', function () {
            if(sessionStorage.getItem('teamId') !== this.params.teamId){
                auth.showError('You are not creator to this team');
                this.redirect('#/home');
                return;
            }
            renderPageWithPartial(this, 'editForm',
                'templates/edit/editForm.hbs', 'templates/edit/editPage.hbs')
        });



        this.post('#/register', function(){
            let username = this.params['username'];
            let password = this.params['password'];
            let confirmPassword = this.params['repeatPassword'];
            auth.register(username, password, confirmPassword)
                .then((res) => {
                    auth.saveSession(res);
                    this.redirect('#/home')
                })
                .catch(auth.handleError);
        });

        this.post('#/login', function(){
            let username = this.params['username'];
            let password = this.params['password'];
            auth.login(username, password)
                .then((res) => {
                    auth.saveSession(res);
                    this.redirect('#/home')
                })
                .catch(auth.handleError);
        });

        this.post('#/create', function(){
            let name = this.params['name'];
            let comment = this.params['comment'];
            teamsService.createTeam(name, comment)
                .then((res) => {
                    sessionStorage.setItem('teamId', res._id);
                    let user = {
                        teamId: res._id
                    };
                    auth.edit(user)
                        .then(() => {
                        this.redirect('#/catalog')
                    }).catch(auth.handleError)

                })
                .catch(auth.handleError);
        });

        this.post('#/edit/:teamId', function(){
            let name = this.params['name'];
            let comment = this.params['comment'];
            teamsService.edit(this.params.teamId, name, comment)
                .then(() => {
                    auth.showInfo('success');
                    this.redirect('#/catalog/' + this.params.teamId);
                })
        });


    });

    app.run();
});