REPO.loginUser = function (context) {
        let username = context.params['username'];
        let password = context.params['password'];

        if(!validator.login(username, password)){
            return;
        }
        auth.login(username, password)
            .then((res) => {
                auth.saveSession(res);
                context.redirect('#/getAll');
                messages.showInfo('Login successful');
            }).catch(messages.handleError)
};

REPO.registerUser = function (context) {
    let username = context.params['username'];
    let password = context.params['password'];
    let repeatPassword = context.params['repeatPass'];
    if(!validator.register(username, password, repeatPassword)){
        return;
    }
    auth.register(username, password)
        .then((res) => {
            auth.saveSession(res);
            context.redirect('#/getAll');
            messages.showInfo('User registration successful');
        }).catch(messages.handleError)
};

REPO.logoutUser = function (context) {
    auth.logout()
        .then(() => {
            sessionStorage.clear();
            context.redirect('#/login');
            messages.showInfo('Logout successful');
        }).catch(messages.handleError)
};