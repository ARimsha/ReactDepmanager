const APIURL = "http://localhost:3000/api/v1/";

function getStringFromDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var str = '';

    str += year + '-';

    if(month > 9) str += month + '-';
    else str += '0' + month + '-';

    if(day > 9) str += day;
    else str += '0' + day;

    return str;
}