var jenkins = jenkins || {};
jenkins.conf = function () {
    var default_url = "http://ci.jenkins-ci.org/",
        default_pollIntervall = 10;

    function setPollIntervall(minutes) {
            var pollIntervall = parseInt(minutes);
            if (0 < pollIntervall && pollIntervall < (24 * 60)) { 
                localStorage.pollIntervall = pollIntervall;
            }
    }

    function setJenkinsURL(url) {
        var slash = '/';
        if (slash !== url.substr( url.length  - slash.length, slash.length ) ) {
            url = url + slash;
        }
        localStorage.jenkinsUrl = url;
    }

    function get(name, defaultValue) {
        return function() {
            if (localStorage[name]) {
                return localStorage[name];
            }
            return defaultValue;
        }
    }

	function setIconSize(size) {
		localStorage.iconSize = size;
	}

	function setSuccessColor(color) {
		localStorage.successColor = color;
	}

    return {
        pollIntervall : get('pollIntervall', default_pollIntervall),
        jenkinsURL : get('jenkinsUrl', default_url), 
		iconSize: get('iconSize', "medium"),
		successColor: get('successColor', "blue"),
        set : function (values) {
            setPollIntervall(values.pollIntervall);
            setJenkinsURL(values.jenkinsURL);
			setIconSize(values.iconSize);
			setSuccessColor(values.successColor);
        },
        apiURL : function() {
            return this.jenkinsURL() + "api/json/";
        }
    }
}();

