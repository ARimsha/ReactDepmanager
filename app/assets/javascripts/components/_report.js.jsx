var Report = React.createClass( {
    getInitialState() {
        var today = new Date();
        var month_ago = new Date();
        month_ago.setTime( today.getTime() - 30 * 86400000);

        return { start_date: getStringFromDate(month_ago), end_date: getStringFromDate(today) }
    },
    calculateRevenue(deposit) {
        if (this.state.start_date != '' && this.state.end_date != '') {
            // Get Daily interest percentage
            var yearly_interest = deposit.interest_percentage / 100.0;
            console.log("Yearly intereset: " + yearly_interest);
            var daily_interest = Math.pow(1 + yearly_interest, 1.0 / 360) - 1;
            console.log(daily_interest);

            // Get 1 - tax value
            var tax = deposit.taxes_percentage / 100.0;
            if(daily_interest < 0)
                tax = 0;

            // Get max start date between state.start_date and deposit.start_date
            var bank_start_date = Date.parse(deposit.start_date);
            var revenue_start_date;
            if(this.state.start_date > deposit.start_date)
                revenue_start_date = Date.parse(this.state.start_date);
            else
                revenue_start_date = Date.parse(deposit.start_date);

            revenue_start_date = (revenue_start_date - bank_start_date) / 86400000;
            console.log("revenue start date: " + revenue_start_date + "::" + bank_start_date + "::" + revenue_start_date);

            var amount_at_report_start = deposit.initial_amount * Math.pow(1 + daily_interest * (1 - tax), revenue_start_date );
            // Get min end date between state.end_date and deposit.end_date
            var revenue_end_date;

            if(deposit.end_date != null && deposit.end_date != '') {
                if(this.state.end_date > deposit.end_date)
                    revenue_end_date = Date.parse(deposit.end_date);
                else
                    revenue_end_date = Date.parse(this.state.end_date);
            }
            else
                revenue_end_date = Date.parse(this.state.end_date);

            revenue_end_date = (revenue_end_date - bank_start_date) / 86400000;
            console.log("revenue end date: " + revenue_end_date + "::" + bank_start_date + "::" + revenue_end_date);
            var amount_at_report_end = deposit.initial_amount * Math.pow(1 + daily_interest * (1 - tax ), revenue_end_date );
            console.log("amount:: " + amount_at_report_start + "::" + amount_at_report_end);

            if(revenue_end_date < revenue_start_date)
                return 0;
            else
                return amount_at_report_end - amount_at_report_start;
        }
        else {
            return '';
        }
    },
    handleSubmit(event) {
        var form_start_date = document.getElementById("report_start_date").value;
        var form_end_date = document.getElementById("report_end_date").value;
        //check if date is valid
        var start_dateObj = new Date(form_start_date);
        var end_dateObj = new Date(form_end_date);
        if( isNaN(start_dateObj.getTime() ) || isNaN( end_dateObj.getTime() )) {
            alert("Invalid date. Try again.");
        }
        else if(start_dateObj > end_dateObj) {
            alert("End date should be equal or greater than start date. Try again.");
        }
        else {
            this.setState( { start_date: form_start_date, end_date: form_end_date} );
        }
        event.preventDefault();
    },
    handleStartDateChange(event) {
        console.log(event.target.value);
        this.setState( { start_date: event.target.value });
    },
    handleEndDateChange(event) {
        this.setState( { end_date: event.target.value });
    },
    render() {
        var gain = 0;
        var loss = 0;
        var deposits = this.props.deposits.map( (item) => {
            var revenue = this.calculateRevenue(item);
            var text_color = "black-text";
            var revenue_value = revenue;
            if(revenue != '') {
                revenue_value = revenue_value.toFixed(5);
                if(revenue > 0) {
                    text_color = "green-text";
                    gain += revenue;
                }
                else if(revenue < 0) {
                    text_color = "red-text";
                    loss += revenue;
                }
                else
                    text_color = "black-text";
            }

            return (
                <div key={item.id} className="padding-12px row">
                    <div className="col-xs-1 padding-4px">{item.bank_name}</div>
                    <div className="col-xs-2 padding-4px">{item.account_number}</div>
                    <div className="col-xs-1 padding-4px">{item.initial_amount}</div>
                    <div className="col-xs-2 padding-4px">{item.start_date}</div>
                    <div className="col-xs-2 padding-4px">{item.end_date}</div>
                    <div className="col-xs-1 padding-4px">{item.interest_percentage}</div>
                    <div className="col-xs-1 padding-4px">{item.taxes_percentage}</div>
                    <div className="col-xs-2 padding-4px">
                        <span className={text_color}>{ revenue_value }</span>
                    </div>
                </div>
            )
        });
        gain = gain.toFixed(5);
        loss = loss.toFixed(5);
        return (
            <div className="col-xs-12">
                <div className="row col-xs-12">
                    <form onSubmit={this.handleSubmit} className="col-xs-10 rounded-border padding-4px margin-right-12px">
                        <div className="col-xs-4 padding-4px">
                            <input id="report_start_date" className="form-control" defaultValue={ this.state.start_date } min="1900-01-01" max = "2099-12-31" type="date" required/>
                        </div>
                        <div className="col-xs-4 padding-4px">
                            <input id="report_end_date" className="form-control" defaultValue={ this.state.end_date } min="1900-01-01" max = "2099-12-31" type="date" required/>
                        </div>
                        <div className="col-xs-4 padding-4px">
                            <input type="submit" value="Generate revenue report" className="btn btn-primary col-xs-12"/>
                        </div>
                        <br/><br/>
                    </form>
                    <div className="col-xs-1 padding-4px">
                        <button className="btn btn-success btn-lg" onClick={this.props.handleViewDeposit}>Deposit List</button> <br/><br/>
                    </div>
                </div>

                <div className="panel panel-default col-xs-12">
                    <div className="panel-heading row">
                        <div className="col-xs-1 padding-4px">Bank Name</div>
                        <div className="col-xs-2 padding-4px">Account Number</div>
                        <div className="col-xs-1 padding-4px">Initial Amount</div>
                        <div className="col-xs-2 padding-4px">Start Date</div>
                        <div className="col-xs-2 padding-4px">End Date</div>
                        <div className="col-xs-1 padding-4px">Interest Percentage</div>
                        <div className="col-xs-1 padding-4px">Tax Percentage</div>
                        <div className="col-xs-2 padding-4px">Revenue</div>
                    </div>
                    { deposits }
                </div>
                <div className="row right-align padding-12px">
                    <h3>
                        <span className="green-text">Total gain: {gain}</span>,
                        <span className="red-text"> Total loss: {loss}</span>
                    </h3>
                </div>
            </div>
        )
    }
});