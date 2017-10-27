var User = React.createClass ({
    getInitialState() {
        return { isEditable: false, email: this.props.user.email, password: '', role: this.props.user.role };
    },
    handleEmailChange(event) {
        this.setState( {email: event.target.value});
    },
    handlePasswordChange(event) {
        this.setState( {password: event.target.value });
    },
    handleEdit() {
        console.log("Edit clicked");
        this.setState( { isEditable: true });
    },
    handleEditCancel() {
        console.log("Edit Cancelled");
        this.setState( { isEditable: false } );
    },
    handleRoleChange(event) {
        console.log("role changed" + event.target.value);
        this.setState( { role: event.target.value } );
        event.preventDefault();
    },
    handleSubmit(event) {
        console.log("Submit clicked");
        if(this.state.password != '')
            user_info = { "user": {
                "email" : this.state.email, 
                "password": this.state.password, 
                "password_confirmation": this.state.password, 
                "role": this.state.role 
            }};
        else 
            user_info = { "user": {
                "email" : this.state.email, 
                "role": this.state.role 
            }};
        $.ajax({
            url: APIURL + "users/" + this.props.user.id,
            type: 'PATCH',
            contentType: "application/json",
            headers: {
                "Authorization": this.props.auth_token
            },
            data: JSON.stringify(user_info),
            success: (response) => {
                console.log("Updated Okay");
                console.log(response);
                this.props.handleUpdate();
                this.setState( { isEditable: false });
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
        if(this.state.isEditable == false) {
            if(this.props.showUser == false) {
                return (
                    <div>
                        <div className="col-xs-3 padding-4px"> { this.props.user.email } </div>
                        <div className="col-xs-3 padding-4px"> ********* </div>
                        <div className="col-xs-3 padding-4px"> { this.props.user.role } </div>
                        <div className="col-xs-3 padding-4px">
                            <div className="col-xs-4"> 
                                <button onClick={this.handleEdit} className="btn"><i className="glyphicon glyphicon-pencil"></i></button>
                            </div>
                            <div className="col-xs-4">
                                <button onClick={this.props.handleDelete} className="btn btn-danger"><i className="glyphicon glyphicon-trash"></i></button>
                            </div>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div>
                        <div className="col-xs-3 padding-4px"> { this.props.user.email } </div>
                        <div className="col-xs-3 padding-4px"> ********* </div>
                        <div className="col-xs-3 padding-4px"> { this.props.user.role } </div>
                        <div className="col-xs-3 padding-4px">
                            <div className="col-xs-4">
                                <button onClick={this.props.handleShowUser} className="btn"><i className="glyphicon glyphicon-folder-open"></i></button>
                            </div>
                            <div className="col-xs-4"> 
                                <button onClick={this.handleEdit} className="btn"><i className="glyphicon glyphicon-pencil"></i></button>
                            </div>
                            <div className="col-xs-4">
                                <button onClick={this.props.handleDelete} className="btn btn-danger"><i className="glyphicon glyphicon-trash"></i></button>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        else {
            return (
                <div>
                    <form onSubmit = {this.handleSubmit}>
                        <div className="col-xs-3 padding-4px"><input className="form-control" onChange={this.handleEmailChange} defaultValue={this.props.user.email} type="email" placeholder="Email" required /> </div>
                        <div className="col-xs-3 padding-4px"><input className="form-control" onChange={this.handlePasswordChange} pattern=".{6,}" title="6 characters Minimum" type="password" placeholder="Password" /> </div>
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
                                <input type="submit" value="Update" className="btn btn-primary"/>
                            </div>
                            <div className="col-xs-6">
                                <button onClick={this.handleEditCancel} className="btn">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            )
        }
    }
});