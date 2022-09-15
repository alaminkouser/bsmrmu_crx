"use strict";

function updateData() {
    window.document.getElementsByClassName("HEADER")[0].getElementsByClassName("SPOTLIGHT")[0].getElementsByTagName("ul")[0].innerHTML = "";
    const spotlight = JSON.parse(window.localStorage.getItem("bsmrmuNewTabData")).spotlight;
    for (let i = 0; i < spotlight.length; i++) {
        let list = window.document.getElementsByClassName("HEADER")[0].getElementsByClassName("SPOTLIGHT")[0].getElementsByTagName("ul")[0];
        let a = window.document.createElement("a");
        let newItem = document.createElement("li");
        a.textContent = spotlight[i][0];
        if (a.textContent.toLowerCase().includes("exam") || a.textContent.toLowerCase().includes("পরীক্ষা") || a.textContent.toLowerCase().includes("জরুরী")) {
            a.classList.add("HIGHLIGHT-TEXT-RED");
        }
        a.setAttribute("href", spotlight[i][1]);
        a.setAttribute("target", "_blank");
        newItem.appendChild(a);
        list.appendChild(newItem);
    }
}
if (window.localStorage.getItem("bsmrmuNewTabData") !== null) {
    updateData();
}
bsmrmuSetNewTabData();

function bsmrmuSetNewTabData() {
    const bsmrmuNewTabData = {
        "spotlight": [],
        "general_notice": [],
        "academic_notice": []
    }
    Promise.all([
        fetch("https://bsmrmu.edu.bd/").then(function (value) { return value.text() }).catch(function (_) { return false }),
        fetch("https://bsmrmu.edu.bd/notices/General%20Notice").then(function (value) { return value.text() }).catch(function (_) { return false }),
        fetch("https://bsmrmu.edu.bd/notices/Academic%20Notice").then(function (value) { return value.text() }).catch(function (_) { return false })
    ]).then(function (value) {
        if (!value.includes(false)) {
            const parser = new DOMParser();

            // spotlight
            const doc0 = parser.parseFromString(value[0], "text/html").getElementById("carouselExampleIndicators").getElementsByClassName("carousel-inner")[0].getElementsByTagName("a");
            for (let i = 0; i < doc0.length; i++) {
                bsmrmuNewTabData.spotlight.push([
                    doc0[i].innerText.trim(),
                    doc0[i].href
                ])
            }

            // general_notice
            const doc1 = parser.parseFromString(value[1], "text/html").getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
            for (let i = 0; i < doc1.length; i++) {
                bsmrmuNewTabData.general_notice.push([
                    doc1[i].getElementsByTagName("td")[1].innerText.trim(),
                    doc1[i].getElementsByTagName("td")[2].innerText.trim(),
                    doc1[i].getElementsByTagName("td")[3].innerText.trim(),
                    doc1[i].getElementsByTagName("td")[4].getElementsByTagName("a")[0].href
                ])
            }

            // general_notice
            const doc2 = parser.parseFromString(value[2], "text/html").getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
            for (let i = 0; i < doc2.length; i++) {
                bsmrmuNewTabData.academic_notice.push([
                    doc2[i].getElementsByTagName("td")[1].innerText.trim(),
                    doc2[i].getElementsByTagName("td")[2].innerText.trim(),
                    doc2[i].getElementsByTagName("td")[3].innerText.trim(),
                    doc2[i].getElementsByTagName("td")[4].getElementsByTagName("a")[0].href
                ])
            }
            console.log(bsmrmuNewTabData);
            window.localStorage.setItem("bsmrmuNewTabData", JSON.stringify(bsmrmuNewTabData));
            updateData();
        }
    }).catch(function () {
        console.error("function: bsmrmuSetNewTabData()");
    })
}