const Comments = function () {
  this.allComments = [];
}

Comments.prototype.addComment = function (comment) {
  // comment.Date = new Date().toLocaleString();
  this.allComments.unshift(comment);
};

Comments.prototype.toHtml = function (comment) {
  console.log(comment);
  return `<p>${comment.Date}</p>
  <p>${comment.name}</p>
  <p>${comment.comment}</p>
  ______________________________`
};

Comments.prototype.mapping = function () {
  return this.allComments.map(this.toHtml);
};

module.exports = Comments;
