var fs = require("fs");
var events = require("events");
var eventEmitter = new events.EventEmitter();
const pug = require("pug");
var path = require("path");
const { parse } = require('querystring');

//Create an event handler:
var myEventHandler = (i = 0) => console.log(i);

//Assign the event handler to an event:
eventEmitter.on("scream", myEventHandler);

const pugRender = (res, filePath) => {
  const html = pug.compileFile("./pug/" + filePath);
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(html());
  return res.end();
}

exports.home = (req, res) => {
  pugRender(res, "index.pug");
};

exports.about = (req, res) => {
  pugRender(res, "about-us.pug");
};

exports.contact = (req, res) => {
  pugRender(res, "contact.pug");
};

exports.services = (req, res) => {
  pugRender(res, "services.pug");
};

/**
 * @description This function serves the static assets required for the website pug files.
 * @summary Most of the code in this function was taken from here: https://stackoverflow.com/a/29046869/7224159
 */
exports.serveStaticAssets = (req, response) => {
  // Compile the source code
  var filePath = "./pug/" + req.url;

  var extname = path.extname(filePath);
  var contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".wav":
      contentType = "audio/wav";
      break;
  }

  fs.readFile(filePath, function(error, content) {
    if (error) {
      if (error.code == "ENOENT") {
        response.writeHead(404, { "Content-Type": contentType });
        response.end(content);
      } else {
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
        response.end();
      }
    } else {
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });
};

/**
 * @description This function extracts the form data from the request object
 * This function is isolated because it can be reused everywhere for urlencoded form submit
 * @summary This function was taken from this url: https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190
 */
function collectRequestData(request, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if(request.headers['content-type'] === FORM_URLENCODED) {
      let body = '';
      request.on('data', chunk => {
          body += chunk.toString();
      });
      request.on('end', () => {
          callback(parse(body));
      });
  }
  else {
      callback(null);
  }
}

/**
 * @description This function handles the contact form submitted data. After processing the data, it redirects the user to homepage
 * @summary The redirection code was taken from here: https://stackoverflow.com/a/4062281/7224159
 */
exports.contactFormSubmit = (req, res) => {
  collectRequestData(req, result => {
    console.log(result);
    sendEmail(result);
    res.writeHead(302, {
      'Location': '/'
    });
    res.end();
  });
}

const sendEmail = (data) => {
  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  var mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: process.env.RECEPIENT,
    subject: `Enquiry from ${data.email}`,
    text: `Subject: ${data.subject} \nMessage: ${data.message}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}