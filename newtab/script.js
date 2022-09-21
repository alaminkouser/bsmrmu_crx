"use strict";

function updateData() {
    window.document.getElementsByClassName("HEADER")[0].getElementsByClassName("SPOTLIGHT")[0].getElementsByTagName("ul")[0].innerHTML = "";
    window.document.getElementsByClassName("BODY")[0].getElementsByClassName("NOTICE")[0].getElementsByClassName("GENERAL")[0].getElementsByTagName("ul")[0].innerHTML = "";
    window.document.getElementsByClassName("BODY")[0].getElementsByClassName("NOTICE")[0].getElementsByClassName("ACADEMIC")[0].getElementsByTagName("ul")[0].innerHTML = "";

    try {
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

        const general_notice = JSON.parse(window.localStorage.getItem("bsmrmuNewTabData")).general_notice;
        for (let i = 0; i < general_notice.length; i++) {
            let list = window.document.getElementsByClassName("BODY")[0].getElementsByClassName("NOTICE")[0].getElementsByClassName("GENERAL")[0].getElementsByTagName("ul")[0];
            let a = window.document.createElement("a");
            let newItem = document.createElement("li");
            a.textContent = general_notice[i][0];
            if (a.textContent.toLowerCase().includes("exam") || a.textContent.toLowerCase().includes("পরীক্ষা") || a.textContent.toLowerCase().includes("জরুরী")) {
                a.classList.add("HIGHLIGHT-TEXT-RED");
            }
            a.setAttribute("href", general_notice[i][3]);
            a.setAttribute("target", "_blank");
            a.setAttribute("title", general_notice[i][1] + " " + general_notice[i][2]);
            newItem.appendChild(a);
            list.appendChild(newItem);
        }

        const academic_notice = JSON.parse(window.localStorage.getItem("bsmrmuNewTabData")).academic_notice;
        for (let i = 0; i < academic_notice.length; i++) {
            let list = window.document.getElementsByClassName("BODY")[0].getElementsByClassName("NOTICE")[0].getElementsByClassName("ACADEMIC")[0].getElementsByTagName("ul")[0];
            let a = window.document.createElement("a");
            let newItem = document.createElement("li");
            a.textContent = academic_notice[i][0];
            if (a.textContent.toLowerCase().includes("exam") || a.textContent.toLowerCase().includes("পরীক্ষা") || a.textContent.toLowerCase().includes("জরুরী")) {
                a.classList.add("HIGHLIGHT-TEXT-RED");
            }
            a.setAttribute("href", academic_notice[i][3]);
            a.setAttribute("target", "_blank");
            a.setAttribute("title", academic_notice[i][1] + " " + academic_notice[i][2]);
            newItem.appendChild(a);
            list.appendChild(newItem);
        }
    } catch (_) {
        message("SOMETHING WENT WRONG! PLEASE UPDATE THE EXTENSION OR CHECK YOUR INTERNET CONNECTION.");
    }
}
if (window.localStorage.getItem("bsmrmuNewTabData") !== null) {
    updateData();
}
bsmrmuSetNewTabData();
setInterval(function () {
    bsmrmuSetNewTabData();
}, 300000);

function bsmrmuSetNewTabData() {
    snackbar("UPDATING");
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
            window.localStorage.setItem("bsmrmuNewTabData", JSON.stringify(bsmrmuNewTabData));
            updateData();
            message("");
        } else {
            message("SOMETHING WENT WRONG! PLEASE UPDATE THE EXTENSION OR CHECK YOUR INTERNET CONNECTION.");
        }
    }).catch(function () {
        message("SOMETHING WENT WRONG! PLEASE UPDATE THE EXTENSION OR CHECK YOUR INTERNET CONNECTION.");
    })
}

function message(text) {
    window.document.getElementsByClassName("MESSAGE")[0].innerText = text;
}

function snackbar(text) {
    let x = document.getElementsByClassName("SNACKBAR")[0];
    x.innerText = text;
    x.classList.remove("SNACKBARshow");
    x.classList.add("SNACKBARshow");
    setTimeout(function () { x.classList.remove("SNACKBARshow"); }, 3000);
}