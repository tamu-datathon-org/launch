const fetch = require('node-fetch');
const { JSDOM } = require("jsdom");

const getUsernameFromUrl = (devpostUrl) => {
    try {
        const url = new URL(devpostUrl);
        if (url.hostname !== "devpost.com")
            return "";
        const pathname = url.pathname.length <= 0 ? "" : url.pathname.substring(1);
        const [username,] = pathname.split("/");
        return username;
    } catch(e) {
        console.error(e);
        return "";
    }
}

const getUsersProjects = async (devpostUsername) => {
    const res = await fetch(`https://devpost.com/${devpostUsername}`);
    const projectPage = await res.text();

    const { document } = new JSDOM(projectPage).window;

    
    const projects = [];
    document.querySelectorAll(".link-to-software").forEach(entry => {
        const projectTitle = entry.querySelector("h5").innerHTML.trim().replace(/^\s|\n/g, "");
        const projectLink = entry.href;
        const numLikes = entry.querySelector("span.like-count").textContent.trim().replace(/^\s|\n/g, "");
        projects.push({
            projectTitle,
            projectLink,
            numLikes
        });
    });

    return projects;
}

const getUsersAttendedHackathons = async (devpostUsername) => {
    const res = await fetch(`https://devpost.com/${devpostUsername}/challenges`);
    const hackathonPage = await res.text();

    const { document } = new JSDOM(hackathonPage).window;

    
    const hackathons = [];
    document.querySelectorAll(".challenge-listing").forEach(entry => {
        const hackathonTitle = entry.querySelector("h2").textContent.trim();
        const hackathonLink = entry.querySelector("a").href;
        hackathons.push({
            hackathonTitle,
            hackathonLink
        });
    });

    return hackathons;
}

module.exports = {
    getUsernameFromUrl,
    getUsersAttendedHackathons,
    getUsersProjects
}