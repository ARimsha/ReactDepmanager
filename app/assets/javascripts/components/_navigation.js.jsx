var Navigation = React.createClass ({
    handleLogOut(event) {
        this.props.handleLogOut();
        event.preventDefault();
    },
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header padding-12px u-full-width">
                        <div className="flex-div">
                            <h4>Deposit Manager</h4>
                            <div className="padding-12px">
                                <span className="padding-20px" >User: {this.props.current_user.email}</span>
                                <a href="#" onClick={this.handleLogOut} > Log Out</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
});