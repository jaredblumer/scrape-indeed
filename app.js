var request = require('request');
var cheerio = require('cheerio');

var skills = require('./skills.js');

var base = 'https://www.indeed.com';
var url = 'https://www.indeed.com/jobs?as_and=javascript&as_phr=&as_any=&as_not=&as_ttl=&as_cmp=&jt=all&st=&as_src=&salary=&radius=25&l=Pittsburgh,+PA&fromage=any&limit=50&sort=&psf=advsrch';

// Object containing skills totals
var results = {};
var links = [];

// Collect job links
request(url, function(error, response, body) {
  var $ = cheerio.load(body);
  $('a[data-tn-element="jobTitle"]').each(function(i, elem) {
    links.push(base + elem.attribs.href);
  });
  console.log(links);
  links.forEach(function(element) {
    parse(element);
  });
});


// Parse job description and call search function
function parse(parseURL) {
  var jobDescription = "";
  request(parseURL, function(error, response, body) {
    var $ = cheerio.load(body);
    var text = $('.jobsearch-JobComponent-description').contents().each(
      function(i, elem) {
        jobDescription += $(this).text();
      }
    );
    searchForSkills(jobDescription);
  });
}

// Iterate through skills array and add found skills to results object
function searchForSkills(jobDescription) {
  console.log(jobDescription);
  skills.skillsArr.forEach(function(element) {
    var expr = new RegExp(element, 'i');
    if(expr.test(jobDescription)) {
      if(results[element]) {
        results[element] += 1;
      }
      else {
        results[element] = 1;
      }
    }
  });
  console.log(results);
}
