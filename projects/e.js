var project_url = "https://micro.mu/projects";

function getURLVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function prettyDate(time){
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
                return date.toDateString();
			
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}

function render(ul, v) {
    var stars = v.stars
    if (v.stars > 1000) {
      stars = (v.stars / 1000.0).toFixed(1) + "k";
    }
    if (v.lang == "Go") {
	    ul.append('<li class="list-inline-item"><img src="https://micro.mu/images/go.png" style="height: 14px; width: auto; margin-bottom: 2px;" /></li>');
    } else {
	    ul.append('<li class="list-inline-item"><i class="fa fa-language" aria-hidden="true"></i> '+v.lang+'</li>');
    }
    ul.append('<li class="list-inline-item"><i class="fa fa-star" aria-hidden="true"></i> '+stars+'</li>');
    ul.append('<li class="list-inline-item"><i class="fa fa-code-fork" aria-hidden="true"></i> '+v.forks+'</li>');
    if (v.type.length > 0) {
	ul.append('<li class="list-inline-item"><i class="fa fa-file-o" aria-hidden="true"></i> '+v.type+'</li>');
    }
}

function loadPinned() {
    var url = project_url + "/api/browse?s=stars";

    $.ajax({url: url, 'type': "GET", dataType: 'json', success: function(data) {
        if (data.repos == undefined) {
            return;
        }

        if (data.repos.length > 0) {
            $(".pinned").empty();
        }

        var re = $(".pinned")
	var rw = $('<div class="row"></div>');
	rw.appendTo(re);

        $.each(data.repos, function(i, v) {
	    if (i >= 6) {
                return;
            };

            var li = $('<li/>');
            var a = $('<a/>');
            var p = $('<p/>');
            var p2 = $('<p/>');
            var ul = $('<ul/>');
	    var div = $('<div/>');

            // set div
            div.addClass("repo");
            div.addClass("rounded");

            // set link
            a.attr("href", v.url);
            a.text(v.name);
            // set desc
	    if (v.desc.length > 75) {
		v.desc = v.desc.substr(0, 75);
		v.desc = v.desc.substr(0, Math.min(v.desc.length, v.desc.lastIndexOf(" ")))
		v.desc = v.desc + "...";
	    }
            p.text(v.desc);
	    p.addClass("desc");
            // set cruft
            ul.addClass("list-inline");
            ul.addClass("info");
            var stars = v.stars;
	    render(ul, v);
            var d = new Date(v.updated * 1000);
            a.appendTo(div);
	    p.appendTo(div);
            ul.appendTo(div);

            li.addClass("col-md");
            li.addClass("p2");
            li.addClass("list-inline-item");
            li.addClass("pinned-item");
            li.html(div);

	    if (i == 3) {
		rw = $('<div class="row"></div>');
		rw.appendTo(re);
	    };

            li.appendTo(rw);
        });
    }});
}

function loadRecent() {
    var url = project_url + "/api/recent";

    $.ajax({url: url, 'type': "GET", dataType: 'json', success: function(data) {
        if (data.repos == undefined) {
            return;
        }

        if (data.repos.length > 0) {
            $(".recent").empty();
        }

        var re = $(".recent");

        $.each(data.repos, function(i, v) {
            var li = $('<li/>');
            var a = $('<a/>');
            var p = $('<p/>');
            var p2 = $('<p/>');
            var ul = $('<ul/>');
	    var div = $('<div/>');

            // set div
            div.addClass("repo");
            // set link
            a.attr("href", v.url);
            a.text(v.name);
            // set desc
            p.text(v.desc);
	    p.addClass("desc");
            // set cruft
            ul.addClass("list-inline");
            ul.addClass("desc");
	    render(ul, v);
            var d = new Date(v.updated * 1000);
            ul.append('<li class="list-inline-item">Updated '+prettyDate(d.toISOString())+'</li>');

            a.appendTo(div);
	    p.appendTo(div);
            ul.appendTo(p2);
            p2.appendTo(div);

            li.html(div);
            li.appendTo(re);
        });
    }});
}

function loadResults() {
    var url = window.location.href.replace(/search.html/, "api/search");

    $.ajax({url: url, 'type': "GET", dataType: 'json', success: function(data) {
        if (data.repos == undefined) {
            return;
        }

        if (data.repos.length > 0) {
            $(".results").empty();
        }

        var re = $(".results");

        $.each(data.repos, function(i, v) {
            var li = $('<li/>');
            var a = $('<a/>');
            var p = $('<p/>');
            var p2 = $('<p/>');
            var ul = $('<ul/>');
	    var div = $('<div/>');

            // set div
            div.addClass("repo");
            // set link
            a.attr("href", v.url);
            a.text(v.name);
            // set desc
            p.text(v.desc);
	    p.addClass("desc");
            // set cruft
            ul.addClass("list-inline");
            ul.addClass("desc");
	    render(ul, v);
            var d = new Date(v.updated * 1000);
            ul.append('<li class="list-inline-item">Updated '+prettyDate(d.toISOString())+'</li>');

            a.appendTo(div);
	    p.appendTo(div);
            ul.appendTo(p2);
            p2.appendTo(div);

            li.html(div);
            li.appendTo(re);
        });
    }});
}

function loadListener() {
    $(".search").submit(function(ev) {
        ev.preventDefault();
	var q = $("#search").val();
        if (q.length == 0) {
            return;
        }
        if (window.location.pathname == "/projects/search.html") {
            window.location.search = "?q=" + q;
	} else {
            window.location = window.location.href + "/search.html?q=" + q;
        }
    });

    if (window.location.pathname == "/projects/search.html") {
        var vars = getURLVars();
        var q = vars["q"];
        $("#search").val(q);
        loadResults();
    };
}

$(document).ready(function() {
    loadPinned();
    loadRecent();
    loadListener();
});
