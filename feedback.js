let http = require("http");
let fs = require("fs");
let querystring = require("querystring");

const getAllFeedBack = function() {
  let allFeedBack = fs.readFileSync('./data/allFeedback.json', "utf8");
  allFeedBack = JSON.parse(allFeedBack);
  return allFeedBack;
}

const parsingJsonFile = function (data) {
  return JSON.parse(data);
};

const toHtmlView = function(nameAndComment) {
  return `<p>${nameAndComment.Date}</p>
  <p>${nameAndComment.Name}</p>
  <p>${nameAndComment.commentBox}</p>
  ______________________________`
};

const writeAllFeedBack = function() {
  let allFeedBack = getAllFeedBack();
  let allNamesAndComments = allFeedBack.map(toHtmlView);
  return allNamesAndComments.join("");
};

const writeComments = function(req, res) {
  console.log("nice wow");
  req.on('data', function(data) {
    let feedback = (querystring.parse(data.toString()));
    let date = new Date();
    feedback.Date = date.toLocaleString();
    let allFeedBack = getAllFeedBack();
    allFeedBack.unshift(feedback);
    let feedbacks = JSON.stringify(allFeedBack, null, 2);
    fs.writeFile("./data/allFeedback.json", feedbacks, "utf8", (err) => {});
  });
}

const displayAllComments = function(req, res) {
  fs.readFile("./public/guestBook.html", "utf8", (err, data) => {
    res.write(data.replace("CommentStore", writeAllFeedBack()));
    res.end()
    return;
  });
};
exports.writeAllFeedBack = writeAllFeedBack;
exports.writeComments = writeComments;
exports.displayAllComments = displayAllComments;
