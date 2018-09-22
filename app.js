var request = require('request');
var cheerio = require('cheerio');

var skills = require('./skills.js');

var base = 'https://www.indeed.com';
var url = 'https://www.indeed.com/jobs?as_and=javascript&as_phr=&as_any=&as_not=&as_ttl=&as_cmp=&jt=all&st=&as_src=&salary=&radius=25&l=Pittsburgh,+PA&fromage=any&limit=50&sort=&psf=advsrch';
var testURL = 'https://www.indeed.com/cmp/Heartland-ECSI/jobs/Software-Engineer-a8e3494356155b53?vjs=3';

// request(url, function(error, response, body) {
//   var links = [];
//   var $ = cheerio.load(body);
//   $('a[data-tn-element="jobTitle"]').each(function(i, elem) {
//     links.push(base + elem.attribs.href);
//   });
//   console.log(links);
// });

function parse() {
  var jobDescription = "";
  request(testURL, function(error, response, body) {
    var $ = cheerio.load(body);
    var text = $('.jobsearch-JobComponent-description').contents().each(
      function(i, elem) {
        jobDescription += $(this).text();
      }
    );
    console.log(jobDescription);
  });
}

parse();
