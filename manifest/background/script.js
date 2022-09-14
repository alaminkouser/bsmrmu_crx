"use strict";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (sender.tab.url === "chrome://newtab/" && request === null) {
            bsmrmuSetNewTabData();
            sendResponse(true);
        };
    }
);

function bsmrmuSetNewTabData() {
    Promise.all([
        fetch("https://bsmrmu.edu.bd/").then(function(value) {return value.text()}),
        fetch("https://bsmrmu.edu.bd/notices/General%20Notice").then(function(value) {return value.text()}),
        fetch("https://bsmrmu.edu.bd/notices/Academic%20Notice").then(function(value) {return value.text()})
    ]).then(function(value) {
        chrome.runtime.sendMessage(value, function(_) {});
    }).catch(function() {
        chrome.runtime.sendMessage(false, function(_) {});
    })
}