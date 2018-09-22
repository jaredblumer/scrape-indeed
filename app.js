var request = require('request');
var cheerio = require('cheerio');

var base = 'https://www.indeed.com';
var url = 'https://www.indeed.com/jobs?as_and=javascript&as_phr=&as_any=&as_not=&as_ttl=&as_cmp=&jt=all&st=&as_src=&salary=&radius=25&l=Pittsburgh,+PA&fromage=any&limit=50&sort=&psf=advsrch';

request(url, function(error, response, body) {
  var links = [];
  var $ = cheerio.load(body);
  $('a[data-tn-element="jobTitle"]').each(function(i, elem) {
    links.push(base + elem.attribs.href);
  });
  console.log(links);
})
