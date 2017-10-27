var Regular = React.createClass({
    getInitialState() {
        return { deposits: [], showMode: 0, bank_name: '', min_amount: '', max_amount: '', from_date: '', to_date: '' }; // 0: show deposit, 1: show report
    },
    getAllDeposits() {
        $.ajax({
            url: APIURL + "deposits",
            type: 'GET',
            headers: {
                "Authorization": this.props.current_user.auth_token
            },
            success: (response) => {
                console.log("Get all deposits");
                console.log(response);
                this.setState( {deposits: response} );
            },
            error: function(xhr, ajaxOptions, thrownError) {
                //alert("Error: Status code " + xhr.status + " " + thrownError + ", Please check again");
                var error_message = JSON.parse(xhr.responseText).errors;
                alert("Error: " + JSON.stringify(error_message));
            }
        });
    },
    getFilteredDeposits() {
        $.ajax({
            url: APIURL + "deposits",
            type: 'GET',
            headers: {
                "Authorization": this.props.current_user.auth_token
            },
            data: {
                bank_name: this.state.bank_name,
                min_amount: this.state.min_amount,
                max_amount: this.state.max_amount,
                from_date: this.state.from_date,
                to_date: this.state.to_date
            },
            success: (response) => {
                console.log("Get all deposits");
                console.log(response);
                this.setState( {deposits: response} );
            },
            error: function(xhr, ajaxOptions, thrownError) {
                //alert("Error: Status code " + xhr.status + " " + thrownError + ", Please check again");
                var error_message = JSON.parse(xhr.responseText).errors;
                alert("Error: " + JSON.stringify(error_message));
            }
        });
    },
    componentWillMount() {
        this.getAllDeposits();
    },
    handleDelete(id) {
        if(confirm("Are you sure?")) {
            console.log("Delete" + id);
            $.ajax({
                url: APIURL + "users/" + this.props.current_user.id + "/deposits/" + id,
                type: 'DELETE',
                headers: {
                    "Authorization": this.props.current_user.auth_token
                },
                success: (response) => {
                    console.log("Get all deposits again");
                    this.getAllDeposits();
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
        this.getFilteredDeposits();
    },
    handleViewReport() {
        this.setState( { showMode: 1 } );
    },
    handleViewDeposit() {
        this.setState( { showMode: 0 } );
    },
    handleSubmit(event) {
        if (this.state.min_amount != '' && this.state.max_amount != '' && parseFloat(this.state.min_amount) > parseFloat(this.state.max_amount)) {
            alert("Max_amount should be equal to or greater than the min_amount.");
        }
        else if(this.state.from_date != '' && this.state.to_date != '' && this.state.from_date > this.state.to_date) {
            alert("To_date should be equal to or greater than the from_date.");
        }
        else {
            this.getFilteredDeposits();
        }
        event.preventDefault();
    },
    handleBankNameChange(event) {
        this.setState( { bank_name: event.target.value });
    },
    handleMinAmountChange(event) {
        this.setState( { min_amount: event.target.value });
    },
    handleMaxAmountChange(event) {
        this.setState( { max_amount: event.target.value });
    },
    handleFromDateChange(event) {
        this.setState( { from_date: event.target.value });
    },
    handleToDateChange(event) {
        this.setState( { to_date: event.target.value });
    },
    render() {
        if(this.state.showMode == 0) {
            var deposits = this.state.deposits.map( (item) => {
                return (
                    <div key={item.id} className="padding-4px">
                        <Deposit current_user={this.props.current_user} deposit={item} handleDelete={this.handleDelete.bind(this, item.id)} handleUpdate={this.handleUpdate}/>
                    </div>
                )
            });
            return (
                <div className="col-xs-12">
                    <div className="col-xs-12">
                        <div className="row">
                            <form onSubmit = {this.handleSubmit} className="col-xs-10 padding-4px rounded-border">
                                <div className="col-xs-2 padding-4px"> Bank Name <input className="form-control" onChange={ this.handleBankNameChange } defaultValue={ this.state.bank_name } type="text"/> </div>
                                <div className="col-xs-2 padding-4px"> Min Amount <input className="form-control" onChange={ this.handleMinAmountChange } defaultValue={ this.state.min_amount} type="number" min="0" step="0.01" /> </div>
                                <div className="col-xs-2 padding-4px"> Max Amount <input className="form-control" onChange={ this.handleMaxAmountChange } defaultValue={ this.state.max_amount} type="number" min="0" step="0.01" /> </div>
                                <div className="col-xs-2 padding-4px"> From Date <input className="form-control" onChange={ this.handleFromDateChange } defaultValue={ this.state.from_date} min="1900-01-01" max = "2099-12-31" type="date" /> </div>
                                <div className="col-xs-2 padding-4px"> To Date <input className="form-control" onChange={ this.handleToDateChange } defaultValue={ this.state.to_date} min="1900-01-01" max = "2099-12-31" type="date"/> </div>
                                <div className="col-xs-2 padding-4px">
                                    <br/>                                   
                                    <input type="submit" value="Filter" className="btn btn-primary col-xs-12"/>
                                </div>
                            </form>
                            <div className="col-xs-2">
                                <br/>
                                <button className="btn btn-success btn-lg" onClick={this.handleViewReport}>View Report</button><br/><br/>
                            </div>
                        </div>
                    </div>
                    <br/> <br/> <br/> <br/>

                    <div className="panel panel-default col-xs-12">
                        <div className="panel-heading row">
                            <div className="col-xs-1 padding-4px">Bank Name</div>
                            <div className="col-xs-2 padding-4px">Account Number</div>
                            <div className="col-xs-1 padding-4px">Initial Amount</div>
                            <div className="col-xs-2 padding-4px">Start Date</div>
                            <div className="col-xs-2 padding-4px">End Date</div>
                            <div className="col-xs-1 padding-4px">Interest Percentage</div>
                            <div className="col-xs-1 padding-4px">Tax Percentage</div>
                        </div>
                        <NewDeposit current_user={this.props.current_user} handleCreate={this.handleUpdate}/> <br/>
                        { deposits }
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="col-xs-12">
                    <Report handleViewDeposit={this.handleViewDeposit} deposits={this.state.deposits}/>
                </div>
            )
        }
    }
});