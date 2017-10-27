# Savings Deposit Manager


## Requirements

* User must be able to create an account and log in. (If a mobile application, this means that more users can use the app from the same phone).
* When logged in, a user can see, edit and delete saving deposits he entered.
* Implement at least three roles with different permission levels: a regular user would only be able to CRUD on their owned records, a user manager would be able to CRUD users, and an admin would be able to CRUD all records and users.
* A saving deposit is identified by a bank name, account number, an initial amount saved (currency in USD), start date, end date, interest percentage per year and taxes percentage.
* The interest could be positive or negative. The taxes are only applied over profit.
* User can filter saving deposits by the amount (minimum and maximum), bank name and date.
* User can generate a revenue report for a given period, that will show the gains and losses from interest and taxes for each deposit. The amount should be green or red if respectively it represents a gain or loss. The report should show the sum of profits and losses at the bottom for that period.
* The computation of profit/loss is done on a daily basis. Consider that a year is 360 days.
* REST API. Make it possible to perform all user actions via the API, including authentication (If a mobile application and you don’t know how to create your own backend you can use Firebase.com or similar services to create the API).
* In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
* All actions need to be done client side using AJAX, refreshing the page is not acceptable. (If a mobile app, disregard this).
* Minimal UI/UX design is needed. You will not be marked on graphic design. However, do try to keep it as tidy as possible.
* Bonus: unit and e2e tests.