/**
 * Function that returns the link for top languages from username
 * @param {string} username Github handle
 */
const getTopLanguagesLink = (username) => {
    if (!username) {
        throw new Error('"username" is not defined even though it should be');
    }

    return `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}`;
};

/**
 * Function that returns DATA for top languages (HTML)
 * @param {string} username Github handle
 */
// const getTopLanguagesData = async (username) => {
//     const dataURL = getTopLanguagesLink(username);

//     const result = await fetch(dataURL);

//     if (result) {
//         return result;
//     } else {
//         throw new Error('Invalid data response - fetching top languages data');
//     }
// };

/**
 * Function that returns link for stats information for repositories
 * @param {string} username Github handle
 */
const getStatsCardLink = (username) => {
    if (!username) {
        throw new Error('"username" is not defined even though it should be');
    }

    return `https://github-readme-stats.vercel.app/api?username=${username}`;
};

/**
 * Function that returns DATA for top languages (HTML)
 * @param {string} username Github handle
 */
// const getStatsCardData = async (username) => {
//     const dataURL = getStatsCardLink(username);

//     const result = await fetch(dataURL);

//     if (result) {
//         return result;
//     } else {
//         throw new Error('Invalid data response - fetching Stats data');
//     }
// };

const showGithubRepos = async (githubLink) => {
    // -------------------------------------
    // set image previews to github previews
    // -------------------------------------

    // set to default first
    $('#github-stats-card').attr('src', "#");
    $('#github-languages-card').attr('src', "#");
    const GithubURL = new URL(githubLink);

    // parse username from URL
    const pathArray = GithubURL.pathname.split('/').filter(e => e.length > 0);
    if (pathArray.length == 0) {
        throw new Error(`Invalid path submitted to form: ${githubLink}`);
    }
    const username = pathArray[0];

    // get links from username
    const StatsLink        = getStatsCardLink(username);
    const TopLanguagesLink = getTopLanguagesLink(username);

    // set both img "attr" src values
    $('#github-stats-card').attr('src', StatsLink);
    $('#github-languages-card').attr('src', TopLanguagesLink);

    // ==================================================
    // make request to get github data once modal clicked
    // ==================================================

    const resp = await fetch(`/apply/hello/github/${username}/repos`);
    const data = await resp.json();

    // only get first five repos
    const arr = data.slice(0,5);

    arr.forEach((elem) => {
        $("#github-repos-list").prepend(
            `<li>
                <a href="${elem.html_url}">${elem.name}</a>
            </li>`
        );
    });
};

$(async function() {
    $('#addModal').on('show.bs.modal', (event) => {
        const tableRow = $(event.relatedTarget);
        const userID = tableRow.attr('data-id');
        
        // get all data from tableRow & inject into the modal
        // TODO: add hidden fields to table like github link
        //       for rendering in the modal
        const dataUrl = `/apply/app/${userID}`;
        fetch(dataUrl)
            .then(resp => resp.json()) 
            .then((app) => {
                // set modal information
                $("#appInfoModal").text(`${app.firstName} ${app.lastName}`);
                $("#modal-school").text(app.school)
                $("#modal-tech-experience").text(app.techExperience);
                $("#modal-resume-url").attr("href", `/apply/resume/${app.resumeId}`);
                $("#modal-linkedin-url").attr("href", app.linkedInURL || "#");
                $("#modal-devpost-url").attr("href", app.devpostURL || "#");
                $("#modal-kaggle-url").attr("href", app.kaggleURL || "#");
                $("#modal-github-url").attr("href", app.githubURL || "#");

                showGithubRepos(app.githubURL);
            })
            .catch((err) => {
                console.log(err);
            });
    });
});