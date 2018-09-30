const moment = require("moment");
const ObjectID = require("mongodb").ObjectID;
module.exports = {
  truncate: function(str, length) {
    if (str.length > length) {
      const newStr = str.substring(0, length - 3); // Cuts off three extra characters for "..."
      return `${newStr}...`;
    }
    return str;
  },
  stripTags: function(input) {
    return input.replace(/<(?:.|\n)*?>/gm, " ");
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  formatDateRelative: function(date, format) {
    return moment(date, format).fromNow();
  },
  select: function(selected, options) {
    return options
      .fn(this)
      .replace(new RegExp(' value="' + selected + '"'), '$&selected="selected"')
      .replace(
        new RegExp(">" + selected + "</option>"),
        'selected="selected"$&'
      );
  },
  editIcon: function(journalUser, loggedUser, journalId, floating = true) {
    if (journalUser === loggedUser) {
      if (floating) {
        return `<a href="/journals/edit/${journalId}" class="btn-floating halfway-fab red accent-3"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="/journals/edit/${journalId}"<i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return "";
    }
  },
  deleteIcon: function(commentUser, loggedUser, journalId, commentId) {
    if (ObjectID(commentUser).toString() === loggedUser)
      return `<a href="/journals/${journalId}/comment/edit/${commentId}" class="comment-btn">Edit</a><form action="/journals/${journalId}/comment/${commentId}?_method=DELETE"method="POST"><input type="hidden" name="_method" value="Delete" /><input class="comment-btn" type="submit" value="Delete" /></form>`;
  }
};
