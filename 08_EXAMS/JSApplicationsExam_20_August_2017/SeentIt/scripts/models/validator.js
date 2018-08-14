let validator = (() => {

    function login(username, password) {
        if(username.length < 3){
            messages.showError('A username should be at least 3 characters long');
            return false;
        }
        if(!/^[A-Za-z]+$/.test(username)){
            messages.showError('Username should contain only english alphabet letters');
            return false;
        }

        if(password.length < 6){
            messages.showError(' A password should be at least 6 characters long');
            return false;
        }
        if(!/^[A-Za-z1-9]+$/.test(password)){
            messages.showError('Passwords should contain only english alphabet letters and digits');
            return false;
        }

        return true;
    }

    // A username should be at least 3 characters long and should contain only english alphabet letters.
    // A user‘s password should be at least 6 characters long and should contain only english alphabet
    // letters and digits. Both passwords should match.

    function register(username, password, repeatPassword) {
        if(username.length < 3){
            messages.showError('A username should be at least 3 characters long');
            return false;
        }
        if(!/^[A-Za-z]+$/.test(username)){
            messages.showError('Username should contain only english alphabet letters');
            return false;
        }

        if(password.length < 6){
            messages.showError(' A password should be at least 6 characters long');
            return false;
        }
        if(!/^[A-Za-z1-9]+$/.test(password)){
            messages.showError('Passwords should contain only english alphabet letters and digits');
            return false;
        }
        if(password !== repeatPassword){
            messages.showError('Passwords does not match');
            return false;
        }

        return true;
    }


    function post(url, title) {

        if(title.length < 1){
                messages.showError('Title should be not empty');
                return false;
        }
        if(!url.startsWith('http')){
                messages.showError('URL should start with "http"');
                return false;
        }
        return true;
    }

    return {
        login,
        register,
        post
    }
})();