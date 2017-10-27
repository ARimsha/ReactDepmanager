var NewDeposit = React.createClass({
    getInitialState() {
        return { 
            bank_name: '',
            account_number: '', 
            initial_amount: 0.00, 
            interest_percentage: 0.00,
            taxes_percentage: 0.00,
            start_date: '',
            end_date: ''
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
            console.log(deposit_info);
            $.ajax({
                url: APIURL + "users/" + this.props.current_user.id + "/deposits",
                type: 'POST',
                contentType: "application/json",
                headers: {
                    "Authorization": this.props.current_user.auth_token
                },
                data: JSON.stringify(deposit_info),
                success: (response) => {
                    console.log("Created Okay");
                    console.log(response);
                    this.props.handleCreate();
                    this.setState( { bank_name: '',
                    account_number: '', 
                    initial_amount: 0.00, 
                    interest_percentage: 0.00,
                    taxes_percentage: 0.00,
                    start_date: '',
                    end_date: '' });
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
        return (
            <form onSubmit = {this.handleSubmit}>
                <div className="col-xs-1 padding-4px"> <input className="form-control" onChange={ this.handleBankNameChange } value={ this.state.bank_name } type="text" required required/> </div>
                <div className="col-xs-2 padding-4px"> <input className="form-control" onChange={ this.handleAccountNumberChange } value={ this.state.account_number} type="text" required/> </div>
                <div className="col-xs-1 padding-4px"> <input className="form-control" onChange={ this.handleInitialAmountChange } value={ this.state.initial_amount} type="number" min="0" step="0.01" required/> </div>
                <div className="col-xs-2 padding-4px"> <input className="form-control" onChange={ this.handleStartDateChange } value={ this.state.start_date} min="1900-01-01" max = "2099-12-31" type="date" required/> </div>
                <div className="col-xs-2 padding-4px"> <input className="form-control" onChange={ this.handleEndDateChange } value={ this.state.end_date} min="1900-01-01" max = "2099-12-31" type="date"/> </div>
                <div className="col-xs-1 padding-4px"> <input className="form-control" onChange={ this.handleInterestPercentageChange } value={ this.state.interest_percentage} type="number" min="-99.99" max="99.99" step="0.01" required/> </div>
                <div className="col-xs-1 padding-4px"> <input className="form-control" onChange={ this.handleTaxesPercentageChange } value={ this.state.taxes_percentage} type="number" min="0" max="99.99" step="0.01" required/> </div>

                <div className="col-xs-2 padding-4px">
                    <div className="col-xs-6">
                        <input type="submit" value="Create a deposit" className="btn btn-primary"/>
                    </div>
                </div>
            </form>
        )
    }
});