const moment = require('moment');

module.exports = {
    truncate: function (str, length) {
        if (str.length > length) {
            const newStr = str.substring(0, length - 3); // Cuts off three extra characters for "..."
            return `${newStr}...`;
        }
        return str;
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, ' ')
    },
    formatDate: function (date, format) {
        return moment(date).format(format);
    }
}