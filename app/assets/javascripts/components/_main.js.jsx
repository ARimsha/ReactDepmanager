var Main = React.createClass ({
    getInitialState() {
        return { current_user: undefined }
    },
    componentWillMount() {
        if( window.sessionStorage.getItem("current_user") ) {
            console.log("ok");
            user_info = JSON.parse(window.sessionStorage.getItem("current_user"));
            this.setState( { current_user: user_info} );
        }
        else {
            console.log("not ok");
            this.setState( { current_user: undefined });
        }
    },
    handleLogin(user_info) {
        this.setState( { current_user : user_info } );
        window.sessionStorage.setItem("current_user", JSON.stringify(user_info));
        console.log(user_info);
    },
    handleLogOut() {
        if( this.state.current_user != undefined ) {
            user_info = { "session" : {"email" : this.state.email, "password": this.state.password} };
            $.ajax({
                url: APIURL + "sessions/" + this.state.current_user.auth_token,
                type: 'DELETE',
                success: (response) => {
                    console.log("Signed out successfully");
                    window.sessionStorage.removeItem("current_user");
                    this.setState( { current_user: undefined } );
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    //alert("Error: Status code " + xhr.status + " " + thrownError + ", Please check again");
                    var error_message = JSON.parse(xhr.responseText).errors;
                    alert("Error: " + JSON.stringify(error_message));
                }
            });
        }
    },
    render() {
        if( this.state.current_user == undefined ) {
            return (
                <div className = "container">
                    <div className = "row">
                        <LogIn handleLogin={this.handleLogin}/>
                    </div>
                </div>
            )
        }
        else {
            switch(this.state.current_user.role) { 
                case "regular":
                    return (
                        <div>
                            <Navigation handleLogOut = {this.handleLogOut} current_user={this.state.current_user}/>
                            <div className = "container-fluid">
                                <div className = "row">
                                    <Regular current_user={this.state.current_user} />
                                </div>
                            </div>
                        </div>
                    );
                case "manager":
                    return (
                        <div>
                            <Navigation handleLogOut = {this.handleLogOut} current_user={this.state.current_user}/>
                            <div className="container">
                                <div className = "row">
                                    <Manager current_user={this.state.current_user}/>
                                </div>
                            </div>
                        </div>
                    );
                case "admin":
                    return (
                        <div>
                            <Navigation handleLogOut = {this.handleLogOut} current_user={this.state.current_user}/>
                            <div className = "container-fluid">
                                <div className = "row">
                                    <Admin current_user={this.state.current_user} />
                                </div>
                            </div>
                        </div>
                    );
            }
        }
    }
});