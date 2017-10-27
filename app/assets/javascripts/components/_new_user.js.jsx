var NewUser = React.createClass({
    getInitialState() {
        return { email: '', password: '', role: "regular" }
    },
    handleEmailChange(event) {
        this.setState( {email: event.target.value});
    },
    handlePasswordChange(event) {
        this.setState( {password: event.target.value });
    },
    handleRoleChange(event) {
        console.log("role changed" + event.target.value);
        this.setState( { role: event.target.value } );
        event.preventDefault();
    },
    handleSubmit(event) {
        user_info = { "user": {
            "email" : this.state.email, 
            "password": this.state.password, 
            "password_confirmation": this.state.password, 
            "role": this.state.role } };
        $.ajax({
            url: APIURL + "users",
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(user_info),
            success: (response) => {
                console.log("New user created");
                this.props.handleCreate();
                this.setState( { email: '', password: '', role: "regular" } );
            },
            error: function(xhr, ajaxOptions, thrownError) {
                //alert("Error: Status code " + xhr.status + " " + thrownError + ", Please check again");
                var error_message = JSON.parse(xhr.responseText).errors;
                alert("Error: " + JSON.stringify(error_message));
            }
        });
        event.preventDefault();
    },
    render() {
        return (
            <form onSubmit = {this.handleSubmit}>
                <div className="col-xs-3 padding-4px"> <input className="form-control" value={this.state.email} onChange={this.handleEmailChange} type="email" placeholder="Email" required /> </div>
                <div className="col-xs-3 padding-4px"><input className="form-control" value={this.state.password} onChange={this.handlePasswordChange} pattern=".{6,}" title="6 characters Minimum" type="password" placeholder="Password" required /> </div>
                <div className="col-xs-3 padding-4px">
                    <select className="form-control" value={this.state.role} onChange={this.handleRoleChange}>
                        { this.props.roles.map( (item) => {
                            return (
                                <option key={item} value={item}>{item}</option>
                            )
                        } )}
                    </select>
                </div>
                <div className="col-xs-3 padding-4px">
                    <div className="col-xs-6">
                        <input type="submit" value="Create a user" className="btn btn-primary"/>
                    </div>
                </div>
            </form>
        )
    }
});