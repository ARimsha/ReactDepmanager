var LogIn = React.createClass ({
    getInitialState() {
        return { isLogIn: true, email: '', password: '', password_confirm: ''}
    },
    handleSubmit(event) {
        console.log('submitted');
        console.log('email:' + this.state.email);
        console.log('password: ' + this.state.password);
        console.log('password_confirm: ' + this.state.password_confirm);
        //"email" : "kyle@depmanager.com", "password" : "12345678"
        if (this.state.isLogIn == true) { // Log In
            user_info = { "session" : {"email" : this.state.email, "password": this.state.password} };
            $.ajax({
                url: APIURL + "sessions",
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify(user_info),
                success: (response) => {
                    console.log("send ok");
                    console.log(response);
                    console.log(response.auth_token);

                    this.props.handleLogin(response);
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    //alert("Error: Status code " + xhr.status + " " + thrownError + ", Please check again");
                    var error_message = JSON.parse(xhr.responseText).errors;
                    alert("Error: " + JSON.stringify(error_message));
                }
            });
        }
        else { // Sign Up
            if(this.state.password != this.state.password_confirm) {
                alert("Passwords don't match. Please try again");
            }
            else {
                user_info = { "user": {"email" : this.state.email, "password": this.state.password, "password_confirmation": this.state.password_confirm, "role": "regular"} };
                $.ajax({
                    url: APIURL + "users",
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify(user_info),
                    success: (response) => {
                        console.log("sign up okay");
                        console.log(response);

                        this.props.handleLogin(response);
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        //alert("Error: Status code " + xhr.status + " " + thrownError + ", Please check again");
                        var error_message = JSON.parse(xhr.responseText).errors;
                        alert("Error: " + JSON.stringify(error_message));
                    }
                });
            }
        }
        event.preventDefault();
    },
    handleLogInClick(event) {
        this.setState( { isLogIn: true });
        event.preventDefault();
    },
    handleSignUpClick(event) {
        this.setState( { isLogIn: false });
        event.preventDefault();
    },
    handleEmailChange(event) {
        this.setState( {email: event.target.value});
    },
    handlePasswordChange(event) {
        this.setState( {password: event.target.value });
    },
    handlePasswordConfirmChange(event) {
        this.setState( {password_confirm: event.target.value });
    },
    render() {
        if( this.state.isLogIn == true ) {
            return (
                <div className = "container padding-top-30px">
                    <div className = "row col-md-12 col-sm-12"> 
                        <div className = "panel panel-default">
                            <div className = "panel-heading">
                                <h3 className = "panel-title"> { this.state.isLogIn? "Log In" : "Sign Up" } </h3>
                            </div>

                            <div className = "panel-body">
                                <form onSubmit = {this.handleSubmit}>
                                    <label> Email </label> <br/>
                                    <input id="email" onChange={this.handleEmailChange} type="email" placeholder="Email" required /> <br/><br/>

                                    <label> Password </label> <br/>
                                    <input id="password" onChange={this.handlePasswordChange} type="password" placeholder="Password" required /><br/><br/>

                                    <input type="submit" value="Log In" className="btn btn-primary"/><br/><br/>
                                    <a href="#" onClick={this.handleSignUpClick}>
                                        Or Sign Up
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className = "container padding-top-30px">
                    <div className = "row col-md-12 col-sm-12"> 
                        <div className = "panel panel-default">
                            <div className = "panel-heading">
                                <h3 className = "panel-title"> { this.state.isLogIn? "Log In" : "Sign Up" } </h3>
                            </div>

                            <div className = "panel-body">
                                <form onSubmit = {this.handleSubmit}>
                                    <label> Email </label> <br/>
                                    <input id="email" onChange={this.handleEmailChange} type="email" placeholder="Email" required /> <br/><br/>

                                    <label> Password </label> <br/>
                                    <input id="password" onChange={this.handlePasswordChange} pattern=".{6,}" title="6 characters Minimum" type="password" placeholder="Password" required /><br/><br/>

                                    <label> Password Confirmation </label> <br/>
                                    <input id="password_confirmation" onChange={this.handlePasswordConfirmChange} pattern=".{6,}" title="6 characters Minimum" type="password" placeholder="Password Confirmation" required /><br/><br/>                                

                                    <input type="submit" value="Sign Up" className="btn btn-primary"/><br/><br/>
                                    <a href="#" onClick={this.handleLogInClick}>
                                        Or Log In
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
});