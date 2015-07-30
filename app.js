// Need ssl

var port = 2000;
var MY_SLACK_WEBHOOK = "https://hooks.slack.com/services/F0031EARUE/2342ddvv/adssf44addd";
var slack = require("slack-notify")(MY_SLACK_WEBHOOK_URL_KAREO);

var createHandler = require("github-webhook-handler");
var express = require("express");
var http = require("http");
var logger = require("morgan");
var _s = require("underscore.string");
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();

var state = "";

app.use(multer({}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger("dev"));

var server = http.createServer(app);
server.listen(port, function() {
    console.log("server is listening on " + port);
});

function slack_message(slack, username, icon_emoji, icon_url, txt, text_color, channel) {
    var obj = {};
    if (channel == null) {
        channel = "#general"
    }
    if (text_color == null) {
	text_color = "#7CD197"
    }
    if (icon_url) {
	obj = { "username": username, "icon_url": icon_url, "unfurl_links": 1, "channel": channel, "attachments": [{ "color": text_color, "text": txt }] }
    } else {
        obj = { "username": username, "icon_emoji": icon_emoji, "unfurl_links": 1, "channel": channel, "attachments": [{ "color": text_color, "text": txt }] }
    }
    console.log(" ");
    console.log(obj);
    slack.send(obj);
}

app.post('/travisci', function(req, res) {
    var payload = JSON.parse(req.body.payload);
    try {
        var txt = "Build " + "<" + payload.build_url + "| #" + payload.number + "> of " + payload.branch + ":" + payload.repository.name + " by " + payload.author_name + " " + payload.state + " in " + payload.duration;
        if (payload.state=="passed") { text_color="#7CD197" } else { text_color="#FF0000" }
        slack_message(slack, "Rock (Travis)", ":boot:", null, txt, text_color, null)
    } catch (e) {
        console.log("Exception caught", e);
    }
    res.end();
});

app.post('/pushchanges', function(req, res) {
    try {
        var branchName = _s.strRightBack(req.body.ref, "/");
        var fullNameRepository = req.body.repository.name;
        var removedFilesArray = req.body["head_commit"]["removed"];
        var addedFilesArray = req.body["head_commit"]["added"];
        var modifiedFilesArray = req.body["head_commit"]["modified"];
        var commits = req.body.commits.length;
        var txt = "[" + branchName + ":" + fullNameRepository + "] " + commits + " new commit(s)" + " by " + req.body.pusher.name +
            "\n<" + req.body.head_commit.url + "|" + req.body.head_commit.id.substr(0, 6) + "> - " + req.body.head_commit.message;
        var profile = req.body.sender.avatar_url || null;
        slack_message(slack, "Jimmy (GitHub)", ":speak_no_evil:", profile, txt, null, null);
    } catch (e) {
        console.log("Exception caught", e);
    }
    res.end();
});

app.post('/papertrail-search1', function(req, res) {
    try {
        var payload = JSON.parse(req.body.payload);
        events = payload.events
        var num_events = Object.keys(events).length
        var events_text = "";
        for(event in events) {
          events_text = events_text.concat(events[event].message);
        }
        if (num_events > 1) {
            var grammatically_correct_text = "matches"
        } else {
            var grammatically_correct_text = "match"
        }
        txt = "\"" + payload.saved_search.query + "\"" + " search found " + num_events + " " + grammatically_correct_text + " -- " + payload.saved_search.html_search_url + " " + events_text;
        slack_message(slack, "papertrail", ":papertrail:", null, txt, null, "#ops");
    } catch (e) {
        console.log("Exception caught", e);
    } res.end();
});

app.post('/papertrail-search2', function(req, res) {
    try {
        var payload = JSON.parse(req.body.payload);
        events = payload.events
        var num_events = Object.keys(events).length
        var events_text = "";
        for(event in events) {
          events_text = events_text.concat(events[event].message);
        }
        if (num_events > 1) {
            var grammatically_correct_text = "matches"
        } else {
            var grammatically_correct_text = "match"
        }
        txt = "\"" + payload.saved_search.query + "\"" + " search found " + num_events + " " + grammatically_correct_text + " -- " + payload.saved_search.html_search_url + " " + events_text;
        slack_message(slack, "papertrail", ":papertrail:", null, txt, null, "#marketing");
    } catch (e) {
        console.log("Exception caught", e);
    }
    res.end();
});

app.post('/pingdom', function(req, res) {
    try {
        console.log("pingdom stuff happened")
    } catch (e) {
        console.log("Exception caught", e);
    }
    res.end();
});

app.post('/bitbucket', function(req, res) {
    try {
        console.log("bitbucket stuff happened")
    } catch (e) {
        console.log("Exception caught", e);
    }
    res.end();
});
