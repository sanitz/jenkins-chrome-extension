var hudson = hudson || {};

hudson.status = function(conf) {
    
    function showUrl(evt) {
        var url = evt.currentTarget.href,
            hudson = chrome.extension.getBackgroundPage().hudson;
        hudson.open(url);
        window.close();
    }

    function link(url, name) {
        if (name == undefined) {
            name = url;
        }
        var link = document.createElement('a');
        link.innerText = name;
        link.href = url;
        link.addEventListener("click", showUrl);
        return link;
    }

    function asIcon(result) {
        var icon = document.createElement('img'),
            name = result.color,
			extension = ".png";
        if (name === 'aborted' || name === 'disabled') {
            name = 'grey';
        }
		if (name == 'blue') {
			name = conf.successColor();
		}
		if (name == 'blue_anime') {
			name = conf.successColor() + "_anime";
		}
		if (name.search("anime") >= 0) {
			extension = ".gif";
		}
		var size = conf.iconSize();
        icon.src = "images/" + size + "/" + name + extension;
        return icon;
    }

    function createList(jobs) {
        var list = document.createElement('table');
        jobs.forEach(function(r) {
            var tr = document.createElement('tr'), 
                tdIcon = document.createElement('td'),
                tdName = document.createElement('td');
            tr.className = "feedList";
            tdIcon.appendChild(asIcon(r));
            tdName.appendChild(link(r.url, r.name));
			tdName.className = conf.iconSize();
            tr.appendChild(tdIcon);
            tr.appendChild(tdName);
            list.appendChild(tr);
        });
        return list;
    }

    function timeSince(d) {
        var now = new Date(),
            minutes = Math.round((now.getTime() - d.getTime()) / (1000 * 60));
        return d.toLocaleTimeString() +  " (" + minutes + " minutes ago)";
    }

    return { show : function () {
        var hudson = chrome.extension.getBackgroundPage().hudson, 
            options = document.getElementById('options'), 
            lastUpdate = document.createElement('div'), 
            content = document.getElementById('content'),
            heading = document.getElementById('heading'),
            url = document.createElement('div');
        
        heading.innerText = "Jenkins Status ";
        url.className = 'url';
        url.appendChild(link(hudson.conf.hudsonURL()));
        content.appendChild(url);
        if (hudson.results.error) {
            var err = document.createElement('div');
            err.className = 'error';
            err.innerText = hudson.results.error
            content.appendChild(err);
        } else {
            var list = createList(hudson.results.hudson.jobs);
            content.appendChild(list);
        }
        
        lastUpdate.innerText = "Last Update: " + timeSince(hudson.results.lastUpdate);
        options.appendChild(lastUpdate);
        options.appendChild(link(chrome.extension.getURL('options.html'), 'Options'));
    }}
}(hudson.conf);

window.onload = function() {
	hudson.status.show();
};
