let validator = (() => {

    function login(username, password) {
        if(username.length < 5){
            messages.showError('Username must be at least 5 characters long');
            return false;
        }
        if(password.length < 1){
            messages.showError('Passwords must be not empty');
            return false;
        }

        return true;
    }

    function register(username, password, repeatPassword) {
        if(username.length < 5){
            messages.showError('Username must be at least 5 characters long');
            return false;
        }
        if(password.length < 1){
            messages.showError('Passwords must be not empty');
            return false;
        }
        if(password !== repeatPassword){
            messages.showError('Passwords does not match');
            return false;
        }

        return true;
    }

    function entry(name, quantity, price) {
        console.log(typeof quantity);
        if(name.length < 1){
            messages.showError('Name must be not empty');
            return false;
        }
        if(quantity.length < 1 || isNaN(Number(quantity))){
            messages.showError('Quantity must be a number');
            return false;
        }
        if(price.length < 1 || isNaN(Number(price))){
            messages.showError('Price must be a number');
            return false;
        }

        return true;


    }

    return {
        login,
        register,
        entry
    }
})();