var Manager = React.createClass ({
    getInitialState() {
        return { users: [] };
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
                var filtered_users = response.filter( (item) => {
                    if(item.role == "admin" || item.role == "manager")
                        return 0;
                    return 1;
                });
                this.setState( {users: filtered_users} );
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
    handleEdit(id) {
        console.log("Edit" + id);
    },
    handleDelete(id) {
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
                    this.getAllUsers();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    //alert("Error: Status code " + xhr.status + " " + thrownError + ", Please check again");
                    var error_message = JSON.parse(xhr.responseText).errors;
                    alert("Error: " + JSON.stringify(error_message));
                }
            });
        }
    },
    handleUpdate() {
        this.getAllUsers();
    },
    render() {
        var users = this.state.users.map( (item) => {
            return (
                <div key={item.id} className="padding-4px">
                    <User showUser = { false } roles={ ["regular"] } auth_token={this.props.current_user.auth_token} user={item} handleDelete={this.handleDelete.bind(this, item.id)} handleUpdate={this.handleUpdate}/>
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
                    <NewUser roles={ ["regular"] } handleCreate={this.handleUpdate} auth_token={this.props.current_user.auth_token}/> <br/>
                    { users }
                </div>
            </div>
        )
    }
});