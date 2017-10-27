var Admin = React.createClass({
    getInitialState() {
        return { users: [], showUserClicked: false, showUser: null }; // 0: show deposit, 1: show revenue report
    },
    getAllUsers() {
        $.ajax({
            url: APIURL + "users",
            type: 'GET',
            headers: {
                "Authorization": this.props.current_user.auth_token
            },
            success: (response) => {
                console.log("Get all users");
                console.log(response);
                this.setState( {users: response} );
            },
            error: function(xhr, ajaxOptions, thrownError) {
                //alert("Error: Status code " + xhr.status + " " + thrownError + ", Please check again");
                var error_message = JSON.parse(xhr.responseText).errors;
                alert("Error: " + JSON.stringify(error_message));
            }
        });
    },
    componentWillMount() {
        this.getAllUsers();
    },
    handleDeleteUser(id) { // delete user
        if(confirm("Are you sure?")) {
            console.log("Delete" + id);
            $.ajax({
                url: APIURL + "users/" + id,
                type: 'DELETE',
                headers: {
                    "Authorization": this.props.current_user.auth_token
                },
                success: (response) => {
                    console.log("Get all users again");
                    this.handleUpdate();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    //alert("Error: Status code " + xhr.status + " " + thrownError + ", Please check again");
                    var error_message = JSON.parse(xhr.responseText).errors;
                    alert("Error: " + JSON.stringify(error_message));
                }
            });
        }
    },
    handleShowUser(user) {
        console.log("Show User clicked" + user.id);
        this.setState( { showUserClicked: true, showUser: user} );
    },
    handleBackToUsers() {
        this.setState( { showUserClicked: false, showUser: null });
    },
    handleUpdate() {
        this.getAllUsers();
    },
    render() {
        if(this.state.showUserClicked == false) {
            var users = this.state.users.map( (item) => {
                return (
                    <div key={item.id} className="padding-4px">
                        <User showUser = { true } handleShowUser={this.handleShowUser.bind(this, item)} roles={ ["admin", "manager", "regular"] } auth_token={this.props.current_user.auth_token} user={item} handleDelete={this.handleDeleteUser.bind(this, item.id)} handleUpdate={this.handleUpdate}/>
                    </div>
                )
            });
            return (
                <div className="col-xs-12">
                    <div className="panel panel-default col-xs-12">
                        <div className="panel-heading row">
                            <div className="col-xs-3 padding-4px">Email</div>
                            <div className="col-xs-3 padding-4px">Password</div>
                            <div className="col-xs-3 padding-4px">Role</div>
                        </div>
                        <NewUser roles={ ["admin", "manager", "regular"] } handleCreate={this.handleUpdate} auth_token={this.props.current_user.auth_token}/> <br/>
                        { users }
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="col-xs-12">
                    <button onClick={this.handleBackToUsers} className="btn btn-info btn-lg">Back to users</button> <br/><br/>
                    <Regular current_user={this.state.showUser} />
                </div>
            )
        }
    }
});