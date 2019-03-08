const http = require("http");
const fn = require("./functions");
const url = require("url");

exports.http = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  // console.log(parsedUrl);
  switch (parsedUrl.pathname) {
    case "/":
    case "/index.html":
      fn.home(req, res);
      break;
    case "/about-us.html":
      fn.about(req, res);
      break;
    case "/services.html":
      fn.services(req, res);
      break;
    case "/contact.html":
      fn.contact(req, res);
      break;
    case "/contact":
      if(req.method === 'POST') {
        console.log('Accepted post requst');
        fn.contactFormSubmit(req, res);
      }
      break;
    default:
      fn.serveStaticAssets(req, res);
      break;
  }
});
