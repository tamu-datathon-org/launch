const express = require("express");
const httpProxy = require("http-proxy");
const dotenv = require('dotenv');
dotenv.config();
const proxy = new httpProxy();

proxy.on("error", (err, req, res) => {
    console.error(err);
    res.status(500).send("Couldn't connect");
});

const app = express();
const port = process.env.PROXY_PORT || 4000;
const appPort = process.env.PORT || 3000;

const proxyToLocalhost = (req, res) => {
    try {
        const path = req.originalUrl.split("/").slice(1);
        let url = req.originalUrl;
        if (path[0] == "apply") {
            url = path.length >= 1 ? path.join("/") : "";
        }
        req.originalUrl = url;
        //req.headers["host"] = "tamudatathon.com";
        const target = `http://localhost:${appPort}/${url || ""}`;
        const config = {
            target,
            prependPath: true,
            ignorePath: true,
            xfwd: true,
            secure: false,
            cookieDomainRewrite: { "localhost:3000": `localhost:${port}` },
        };
        proxy.web(req, res, config);
    } catch (e) {
        console.error(e);
        res.status(500).send();
    }
};

app.all("/apply", proxyToLocalhost);
app.all("/apply/*", proxyToLocalhost);

app.all("*", (req, res) => {
    try {
        req.headers["host"] = "galaxy.tamudatathon.now.sh";
        proxy.web(req, res, {
            target: `https://galaxy.tamudatathon.now.sh`,
            changeOrigin: true,
            cookieDomainRewrite: { "tamudatathon.com": `localhost:${port}` },
        });
    } catch (e) {
        console.error(e);
        res.status(500).send();
    }
});

app.listen(port, () => {
    console.log(`[Proxy Server] listening on http://localhost:${port}/`);
});