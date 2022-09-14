"use strict";

function main() {
    const spotlight = JSON.parse(window.localStorage.getItem("bsmrmuNewTabData")).spotlight;
    for (let i = 0; i < spotlight.length; i++) {
        let list = window.document.getElementsByClassName("HEADER")[0].getElementsByClassName("SPOTLIGHT")[0].getElementsByTagName("ol")[0];
        let a = window.document.createElement("a");
        let newItem = document.createElement("li");
        a.textContent = spotlight[i][0];
        a.setAttribute("href", spotlight[i][1]);
        a.setAttribute("target", "_blank");
        newItem.appendChild(a);
        list.appendChild(newItem);
    }
}
main();

chrome.runtime.sendMessage(null, function (response) {
    console.log(response);
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (sender.tab === undefined && request.length === 3) {
            sendResponse(true);
            bsmrmuParseAndSetNewTabData(request);
        };
    }
);

function bsmrmuParseAndSetNewTabData(data) {
    const bsmrmuNewTabData = {
        "spotlight": [],
    }
    const parser = new DOMParser();
    const doc0 = parser.parseFromString(data[0], "text/html").getElementById("carouselExampleIndicators").getElementsByClassName("carousel-inner")[0].getElementsByTagName("a");
    for (let i = 0; i < doc0.length; i++) {
        bsmrmuNewTabData.spotlight.push([
            doc0[i].innerText.trim(),
            doc0[i].href
        ])
    }
    window.localStorage.setItem("bsmrmuNewTabData", JSON.stringify(bsmrmuNewTabData));
}