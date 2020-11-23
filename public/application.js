// ==============================
// code originally from admin.ejs
// ==============================

$('tr').on('dblclick', async () => {
    $('#addModal').modal('show');

    // -------------------------------------
    // set image previews to github previews
    // -------------------------------------
    const githubLink = $('#github-link-modal').attr('href');
    // use function from ./partial/scripts (application.js)

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
});
