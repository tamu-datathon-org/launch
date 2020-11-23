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

    $("#github-repos-list").empty();
    arr.forEach((elem) => {
        $("#github-repos-list").prepend(
            `<li>
                <a href="${elem.html_url}" target="_blank">${elem.name}</a>
            </li>`
        );
    });
};

$('tr').on('dblclick', function () {
    $('#addModal').modal('show');
});

$(async function() {
    $('#addModal').on('show.bs.modal', (event) => {
        // $('#addModal').find(".modal-body").hide();
        const tableRow = $(event.relatedTarget);
        const userID = tableRow.attr('data-id');
        
        // get all data from tableRow & inject into the modal
        // TODO: add hidden fields to table like github link
        //       for rendering in the modal
        const dataUrl = `/apply/application/${userID}`;
        fetch(dataUrl)
            .then(resp => resp.json()) 
            .then(async (app) => {
                if (!app.resumeId)
                    $("#modal-resume-url").hide();
                else
                    $("#modal-resume-url").show();
                if (!app.techExperience)
                    $("#modal-tech-experience").hide();
                else
                    $("#modal-tech-experience").show();
                if (!app.linkedInURL)
                    $("#modal-linkedin-url").hide();
                else
                    $("#modal-linkedin-url").show();
                if (!app.devpostURL)
                    $("#modal-devpost-url").hide();
                else
                    $("#modal-devpost-url").show();
                if (!app.kaggleURL)
                    $("#modal-kaggle-url").hide();
                else
                    $("#modal-kaggle-url").show();
                if (!app.githubURL)
                    $("#modal-github-url").hide();
                else
                    $("#modal-github-url").show();
                // set modal information
                $("#appInfoModal").text(`${app.firstName} ${app.lastName}`);
                $("#modal-school").text(app.school)
                $("#modal-tech-experience").text(app.techExperience);
                $("#modal-resume-url").attr("href", `/apply/resume/${app.resumeId}`);
                $("#modal-linkedin-url").attr("href", app.linkedInURL || "#");
                $("#modal-linkedin-url").text(app.linkedInURL || "-none-");
                $("#modal-devpost-url").attr("href", app.devpostURL || "#");
                $("#modal-devpost-url").text(app.devpostURL || "-none-");
                $("#modal-kaggle-url").attr("href", app.kaggleURL || "#");
                $("#modal-kaggle-url").text(app.kaggleURL || "-none-");
                $("#modal-github-url").attr("href", app.githubURL || "#");
                $("#modal-github-url").text(app.githubURL || "-none-");

                if (app.githubURL) {
                    $('#github-stats-card').show();
                    $('#github-languages-card').show();
                    await showGithubRepos(app.githubURL);
                } else {
                    $("#github-repos-list").empty();
                    $('#github-stats-card').hide();
                    $('#github-languages-card').hide();
                }

                $('#addModal').find(".modal-body").show();

            })
            .catch((err) => {
                console.log(err);
            });
    });
});