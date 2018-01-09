let fs = require('fs');
const timeStamp = require('./time.js').timeStamp;
const http = require('http');
const WebApp = require('./webapp');
const displayAllComments = require("./feedback.js").displayAllComments;
const writeComments = require("./feedback.js").writeComments;
const writeAllFeedBack = require("./feedback.js").writeAllFeedBack;


let registered_users = [{
  userName: 'bhanutv',
  name: 'Bhanu Teja Verma'
}, {
  userName: 'harshab',
  name: 'Harsha Vardhana'
}];

let toString = o => JSON.stringify(o, null, 2);

const setContentType = function(filePath) {
  let lastIndexOfDot = filePath.lastIndexOf(".");
  let contentType = filePath.substr(lastIndexOfDot);
  let type = {
    "/": "text/html",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".pdf": "text/pdf",
    ".ico": "image/ico"
  };
  return type[contentType];
};

let logRequest = (req, res) => {
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toString(req.headers)}`,
    `COOKIES=> ${toString(req.cookies)}`,
    `BODY=> ${toString(req.body)}`, ''
  ].join('\n');
  fs.appendFile('request.log', text, () => {});
};

let loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u => u.sessionid == sessionid);
  if (sessionid && user) {
    req.user = user;
  }
};

let redirectLoggedInUserToHome = (req, res) => {
  if (req.urlIsOneOf(['/login']) && req.user) res.redirect('guestBook.html');
};

let redirectLoggedOutUserToLogin = (req, res) => {
  if (req.urlIsOneOf(['/logout']) && !req.user) res.redirect('/login');
};

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);

app.get('/login', (req, res) => {
  if (req.cookies.logInFailed) res.write('<p>logIn Failed</p>');
  res.write('<form method="POST"> <input name="userName"><input name="place"> <input type="submit"></form>');
  res.end();
  return;
});

const createCookies = function(user,res){
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.sessionid = sessionid;
};

app.post('/login', (req, res) => {
  let user = registered_users.find(u => u.userName == req.body.userName);
  if (!user) {
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestBook.html');
});

app.get('/guestBook.html', (req, res) => {
  displayAllComments(req, res)
});

app.post('/guestBook.html', (req, res) => {
  console.log(req.body);
  let user = registered_users.find(u => u.userName == req.body.Name);
  if (!user) {
    res.redirect('/login');
    return;
  }
  writeComments(req,res);
  fs.readFile("./public/guestBook.html", "utf8", (err, data) => {
    res.write(data.replace("CommentStore", writeAllFeedBack()));
    res.end()
    return;
  });
  // res.redirect('/guestBook.html');
});

app.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', [`loginFailed=false,Expires=${new Date(1).toUTCString()}`, `sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login');
});

app.postuse((req, res) => {
  let filePath = req.url
  if(req.url == "/"){
    filePath = "/index.html";
  }
  res.setHeader('Content-type', setContentType(filePath));
  fs.readFile(`./public${filePath}`, (err, data) => {
    if (err) return responseError(res);
    res.write(data);
    res.end();
  });
});

const responseError = function(req, res) {
  res.statusCode = 404;
  res.write('file not found');
  res.end();
};

const PORT = 5000;
let server = http.createServer(app);
server.on('error', e => console.error('**error**', e.message));
server.listen(PORT, (e) => console.log(`server listening at ${PORT}`));
