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

    // Destination and origin station should be non-empty strings. Number of seats and cost
    // per seat should be positive numbers.

        function entry(destination, origin, seats, cost) {

        if(destination.length < 1){
            messages.showError('Destination must be not empty');
            return false;
        }
        if(origin.length < 1 ){
            messages.showError('Origin must be not empty');
            return false;
        }
        if(Number(seats) < 1 || isNaN(Number(seats))){
            messages.showError('Seats must be a positive number');
            return false;
        }

        if(Number(cost) <= 0 || isNaN(Number(cost))){
            messages.showError('Cost must be a positive number');
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