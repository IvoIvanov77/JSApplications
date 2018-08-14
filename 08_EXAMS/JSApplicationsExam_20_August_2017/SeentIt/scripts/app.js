$(() => {

    const app = Sammy('#container', function () {

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

        this.get('index.html', function(){
            if(!sessionStorage.getItem('userId')){
                this.redirect('#/login');
            }else {
                this.redirect('#/catalog')
            }
        });

        this.get('#/login', function(){
            renderMainPage(this, 'templates/welcome/welcomePage.hbs',
                {
                    loginForm: 'templates/welcome/loginForm.hbs',
                    registerForm: 'templates/welcome/registerForm.hbs',
                    about: 'templates/welcome/about.hbs',
                }).then((res) => {

            });
        });

        this.get('#/catalog', async function(){       
		
			messages.showLoading();

            let result = await models.postService.loadItems()
                .catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });
            let counter = 0;
            result.forEach((post) => {
                post.count = ++ counter;
                post.isAuthor = isAuthor(post);
                post.time = utils.calcTime(post._kmd.ect);

            });
            this.allPosts = result;
            renderMainPage(this, 'templates/items/showItems.hbs',
                {
                    singlePost: 'templates/items/singleItem.hbs',
                    noPosts: 'templates/items/noItems.hbs'
                })
                .then(() => {
                    messages.hideLoading();

                });
        });

        this.get('#/create', function(){

            renderMainPage(this, 'templates/createItem/createPage.hbs',
                {
                    createForm: 'templates/createItem/createForm.hbs'
                })

        });

        this.get('#/edit/:id', async function(){

            messages.showLoading();
            let obj = await models.postService.loadDetails(this.params['id'])
                .catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });
            messages.hideLoading();

            if(isAuthor(obj)){
                this.post = obj;
                this.description = obj.description ? obj.description : 'No description';
                renderMainPage(this, 'templates/editItem/editPage.hbs',
                    {
                        editForm: 'templates/editItem/editForm.hbs'
                    });
            }else {
                messages.showError('You can not edit this post')
            }
        });

        this.get('#/my_posts', async function(){

            messages.showLoading();

            let result = await models.postService
                .getQuery(`?query={"author":"${sessionStorage.getItem('username')}"}&sort={"_kmd.ect": -1}`)
                .catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });
            let counter = 0;
            result.forEach((post) => {
                post.count = ++ counter;
                post.isAuthor = isAuthor(post);
                post.time = utils.calcTime(post._kmd.ect);
            });
            this.myPosts = result;
            renderMainPage(this, 'templates/items/myItems.hbs',
                {
                    singlePost: 'templates/items/singleItem.hbs',
                    noPosts: 'templates/items/noItems.hbs'
                })
                .then(() => {
                    messages.hideLoading();

                });
        });

        this.get('#/comments/:id', async function(){

            messages.showLoading();
            let id = this.params['id'];

            let postDetails = await models.postService
                .loadDetails(id)
                .catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });

            this.post = postDetails;
            this.isAuthor = isAuthor(postDetails);
            this.postTime = utils.calcTime(postDetails._kmd.ect);

            let comments = await models
                .commentService.getQuery(`?query={"postId":"${id}"}&sort={"_kmd.ect": -1}`);

            comments.forEach((comment) => {
                comment.isAuthor = isAuthor(comment);
                comment.commentTime = utils.calcTime(comment._kmd.ect);
            });

            this.comments = comments;

            renderMainPage(this, 'templates/comments/commentsPage.hbs',
                {
                    singlePost: 'templates/comments/postContent.hbs',
                    addCommentForm: 'templates/comments/addCommentForm.hbs',
                    singleComment: 'templates/comments/singleComment.hbs',
                    noComments: 'templates/comments/noComments.hbs'
                })
                .then(() => {
                    messages.hideLoading();

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
                    this.redirect('#/catalog');
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
                    this.redirect('#/catalog')
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

        this.post('create_post', function () {

            let url = this.params['url'];
            let title = this.params['title'];
            let imageUrl = this.params['image'];
            let description = this.params['comment'];
            let author = sessionStorage.getItem('username');

            if(!validator.post(url, title)){
                return;
            }
            let obj = {url, title, imageUrl, description, author};
            this.$element('#btnSubmitPost').attr('disabled', 'disabled');
            messages.showLoading();

            models.postService.createItem(obj)
                .then((res) => {
                    messages.hideLoading();
                    messages.showInfo('Post created');
                    this.redirect('#/catalog');
                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });
        });

        this.post('#/edit/:id', function () {

            let url = this.params['url'];
            let title = this.params['title'];
            let imageUrl = this.params['image'];
            let description = this.params['description'];
            let author = sessionStorage.getItem('username');

            if(!validator.post(url, title)){
                return;
            }

            this.$element('#btnEditPost').attr('disabled', 'disabled');
            let obj = {url, title, imageUrl, description, author};

            messages.showLoading();

            models.postService.edit(this.params['id'], obj)
                .then((res) => {
                    messages.hideLoading();
                    messages.showInfo(`Post ${res.title} updated.`);
                    this.redirect('#/catalog');
                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });
        });

        this.post('#/add_comment/:id', function () {

            let content = this.params['content'];
            let author = sessionStorage.getItem('username');
            let postId = this.params['id'];

            this.$element('#btnPostComment').attr('disabled', 'disabled');
            let obj = {content, postId, author};

            messages.showLoading();

            models.commentService.createItem(obj)
                .then((res) => {
                    messages.hideLoading();
                    messages.showInfo('Comment created');
                    this.redirect('#/comments/' + this.params['id']);
                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });
        });

        this.get('#/delete/:id', function(){
            messages.showLoading();
            models.postService.remove(this.params['id'])
                .then(() => {
                    messages.hideLoading();
                    messages.showInfo('Post deleted.');
                    this.redirect('#/catalog');

                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });
        });

        this.get('#/delete_comment/:postId/:commentId', function(){
            messages.showLoading();
            models.commentService.remove(this.params['commentId'])
                .then((res) => {
                    messages.hideLoading();
                    messages.showInfo('Comment deleted.');
                    this.redirect('#/comments/' + this.params['postId']);

                }).catch((reason) => {
                messages.hideLoading();
                messages.handleError(reason);
            });
        });


        function isAuthor(obj) {
            return obj._acl.creator === sessionStorage.getItem('userId');

        }
    });



    app.run();
});