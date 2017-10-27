var Deposit = React.createClass ({
    getInitialState() {
        return { 
            isEditable: false, 
            bank_name: this.props.deposit.bank_name, 
            account_number: this.props.deposit.account_number, 
            initial_amount: this.props.deposit.initial_amount, 
            interest_percentage: this.props.deposit.interest_percentage, 
            taxes_percentage: this.props.deposit.taxes_percentage, 
            start_date: this.props.deposit.start_date, 
            end_date: this.props.deposit.end_date 
        };
    },
    handleBankNameChange(event) {
        this.setState( {bank_name: event.target.value});
    },
    handleAccountNumberChange(event) {
        this.setState( {account_number: event.target.value });
    },
    handleInitialAmountChange(event) {
        this.setState( {initial_amount: event.target.value });
    },
    handleInterestPercentageChange(event) {
        this.setState( {interest_percentage: event.target.value });
    },
    handleTaxesPercentageChange(event) {
        this.setState( {taxes_percentage: event.target.value });
    },
    handleStartDateChange(event) {
        this.setState( {start_date: event.target.value});
    },
    handleEndDateChange(event) {
        this.setState( {end_date: event.target.value});
    },
    handleEdit() {
        console.log("Edit clicked");
        this.setState( { isEditable: true });
    },
    handleEditCancel() {
        console.log("Edit Cancelled");
        this.setState( { isEditable: false } );
    },
    handleSubmit(event) {
        console.log("Submit clicked");
        console.log(this.state.start_date);
        console.log(this.state.end_date);
        if(this.state.end_date != null && this.state.end_date != '' && this.state.start_date >= this.state.end_date) {
            alert("End date must be greater than Start date. Check again.");
        }
        else {
            deposit_info = { "deposit": 
                {
                    "bank_name" : this.state.bank_name,
                    "account_number" : this.state.account_number,
                    "initial_amount" : this.state.initial_amount,
                    "start_date" : this.state.start_date,
                    "end_date" : this.state.end_date,
                    "interest_percentage" : this.state.interest_percentage,
                    "taxes_percentage" : this.state.taxes_percentage
                }
            };
            $.ajax({
                url: APIURL + "users/" + this.props.current_user.id + "/deposits/" + this.props.deposit.id,
                type: 'PATCH',
                contentType: "application/json",
                headers: {
                    "Authorization": this.props.current_user.auth_token
                },
                data: JSON.stringify(deposit_info),
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
        }
        event.preventDefault();
    },
    render() {
        if(this.state.isEditable == false) {
            return (
                <div>
                    <div className="col-xs-1 padding-4px"> { this.props.deposit.bank_name } </div>
                    <div className="col-xs-2 padding-4px"> { this.props.deposit.account_number} </div>
                    <div className="col-xs-1 padding-4px"> { this.props.deposit.initial_amount} </div>
                    <div className="col-xs-2 padding-4px"> { this.props.deposit.start_date} </div>
                    <div className="col-xs-2 padding-4px"> { this.props.deposit.end_date} </div>
                    <div className="col-xs-1 padding-4px"> { this.props.deposit.interest_percentage} </div>
                    <div className="col-xs-1 padding-4px"> { this.props.deposit.taxes_percentage} </div>

                    <div className="col-xs-2 padding-4px">
                        <div className="col-xs-6"> 
                            <button onClick={this.handleEdit} className="btn"><i className="glyphicon glyphicon-pencil"></i></button>
                        </div>
                        <div className="col-xs-6">
                            <button onClick={this.props.handleDelete} className="btn btn-danger"><i className="glyphicon glyphicon-trash"></i></button>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <form onSubmit = {this.handleSubmit}>
                        <div className="col-xs-1 padding-4px"> <input className="form-control" onChange={ this.handleBankNameChange } defaultValue={ this.props.deposit.bank_name } type="text" required /> </div>
                        <div className="col-xs-2 padding-4px"> <input className="form-control" onChange={ this.handleAccountNumberChange } defaultValue={ this.props.deposit.account_number} type="text" required/> </div>
                        <div className="col-xs-1 padding-4px"> <input className="form-control" onChange={ this.handleInitialAmountChange } defaultValue={ this.props.deposit.initial_amount} min="0" type="number" step="0.01" required/> </div>
                        <div className="col-xs-2 padding-4px"> 
                            <input className="form-control" onChange={ this.handleStartDateChange } defaultValue={ this.props.deposit.start_date} min="1900-01-01" max = "2099-12-31" type="date" required/> 
                        </div>
                        <div className="col-xs-2 padding-4px"> 
                            <input className="form-control" onChange={ this.handleEndDateChange } defaultValue={ this.props.deposit.end_date} min="1900-01-01" max = "2099-12-31" type="date"/> 
                        </div>
                        <div className="col-xs-1 padding-4px"> <input className="form-control" onChange={ this.handleInterestPercentageChange } defaultValue={ this.props.deposit.interest_percentage} type="number" min="-99.99" max="99.99" step="0.01" required/> </div>
                        <div className="col-xs-1 padding-4px"> <input className="form-control" onChange={ this.handleTaxesPercentageChange } defaultValue={ this.props.deposit.taxes_percentage} type="number" min="0" max="99.99" step="0.01" required/> </div>

                        <div className="col-xs-2 padding-4px">
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