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

    function car(title, description, brand, fuelType, model, year, price, url) {

        if(title.length < 1 || title.length > 33){
            messages.showError('Invalid title(must be between 1 and 33 characters long)');
            return false;
        }

        if(description.length < 30 || description.length > 450){
            messages.showError('Invalid description(must be between 30 and 450 characters long)');
            return false;
        }

        if(brand.length < 1 || brand.length > 11){
            messages.showError('Invalid brand(must be between 1 and 11 characters long)');
            return false;
        }

        if(fuelType.length < 1 || fuelType.length > 11){
            messages.showError('Invalid fuel type(must be between 1 and 11 characters long)');
            return false;
        }

        if(model.length < 4 || model.length > 11){
            messages.showError('Invalid model(must  be between 4 and 11 characters long)');
            return false;
        }

        if(year.length !== 4){
            messages.showError('Invalid year(must be 4 characters long)');
            return false;
        }

        if(price.length < 0 || (+price) > 1000000){
            messages.showError('Invalid price(must be bellow 1000000$)');
            return false;
        }

        if(!url.startsWith('http')){
            messages.showError('Invalid url(must starts with "http")');
            return false;
        }

        return true;


    }

    return {
        login,
        register,
        car
    }
})();