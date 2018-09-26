// Require dependencies
var request = require('request');
var cheerio = require('cheerio');

// Require skills module for skills.skillsArr
var skills = require('./skills.js');

// URLs
var base = 'https://www.indeed.com';
var url = 'https://www.indeed.com/jobs?q=javascript&l=Pittsburgh%2C+PA&limit=50&radius=25';

// Object containing skills totals
var results = {};
// Array of job description links
var links = [];
var countArr = [];
var jobCount;
var startNum = 0;

// Collect all job links
request(url, function(error, response, body) {
  var $ = cheerio.load(body);
  // Parse number of jobs
  countArr = $('#searchCount').text().trim().split(' ');
  jobCount = countArr[3];
  // Collect links
  $('a[data-tn-element="jobTitle"]').each(function(i, elem) {
    links.push(base + elem.attribs.href);
  });
  // Decrement remaining jobs and request new pages
  jobCount -= 50;
  while(jobCount > 0) {
    url = 'https://www.indeed.com/jobs?q=javascript&l=Pittsburgh%2C+PA&limit=50&radius=25';
    startNum += 50;
    url += '&start=' + startNum;
    collectLinks(url);
    jobCount -= 50;
  }
});

function collectLinks(url) {
  request(url, function(error, response, body) {
    var $ = cheerio.load(body);
    $('a[data-tn-element="jobTitle"]').each(function(i, elem) {
      links.push(base + elem.attribs.href);
    });
    console.log(links);
  })
}

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
  // console.log(jobDescription);
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
