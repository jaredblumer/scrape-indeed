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


// Collect all search result pages and return as array
function initialize() {
  return new Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      if (error) {
          reject(error);
      } else {
        var $ = cheerio.load(body);
        // Parse number of jobs
        countArr = $('#searchCount').text().trim().split(' ');
        jobCount = countArr[3];
        console.log("Total Number of Links:", jobCount);
        // Generate Indeed search result pages in resulting array
        var indeedPages = [];
        var startNum = 0;
        while(jobCount > 0) {
          var url = 'https://www.indeed.com/jobs?q=javascript&l=Pittsburgh%2C+PA&limit=50&radius=25';
          url += '&start=' + startNum;
          indeedPages.push(url);
          startNum += 50;
          jobCount -= 50;
        }
        console.log("Indeed Search Result Pages:", indeedPages);
        resolve(indeedPages);
      }
    });
  });
}

var errHandler = function(error) {
  console.error(error);
};

function requestPage(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      if (error) {
        reject(error);
      } else {

        var $ = cheerio.load(body);
        $('a[data-tn-element="jobTitle"]').each(function(i, elem) {
          links.push(base + elem.attribs.href);
        });
        console.log("Links Collected:", links.length);

        return resolve(links);
      }
    });
  });
}

function allPages(indeedPages) {
  var promises = [];
  indeedPages.forEach(function(item) {
    promises.push(requestPage(item));
  });
  Promise.all(promises).then(function() {
    console.log(links);
  });
}

function main() {
 var initalizePromise = initialize().then(allPages, errHandler);

}

main();

//
// // Parse job description and call search function
// function parse(parseURL) {
//   var jobDescription = "";
//   request(parseURL, function(error, response, body) {
//     var $ = cheerio.load(body);
//     var text = $('.jobsearch-JobComponent-description').contents().each(
//       function(i, elem) {
//         jobDescription += $(this).text();
//       }
//     );
//     searchForSkills(jobDescription);
//   });
// }
//
// // Iterate through skills array and add found skills to results object
// function searchForSkills(jobDescription) {
//   // console.log(jobDescription);
//   skills.skillsArr.forEach(function(element) {
//     var expr = new RegExp(element, 'i');
//     if(expr.test(jobDescription)) {
//       if(results[element]) {
//         results[element] += 1;
//       }
//       else {
//         results[element] = 1;
//       }
//     }
//   });
//   console.log(results);
// }
