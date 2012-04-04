jenkins.options = function(conf) {
    var jenkinsUrlTextbox, pollIntervallTextbox, saveButton, saveStatus, iconSize;

    function showSaveStatus(show) {
        saveStatus.style.display = show ? '' : "none";
        saveButton.disabled = show;
    }

    function display() {
        jenkinsUrlTextbox.value = conf.jenkinsURL();
        pollIntervallTextbox.value = conf.pollIntervall();
		document.getElementById(conf.iconSize()).checked = true;
		document.getElementById(conf.successColor()).checked = true;
        saveButton.disabled = true;
		var checks = document.getElementById('checks');
		checks.innerHTML = "";
		var checkedArray = conf.ignoreList().split(",");
		checks.appendChild(getListOfJobs(checkedArray));
    }

	function getIconSize() {
		if (document.optionForm.small.checked) {
			return document.optionForm.small.value;
		} if (document.optionForm.medium.checked) {
			return document.optionForm.medium.value;
		} if (document.optionForm.large.checked) {
			return document.optionForm.large.value;
		}
	}
	
	function getSuccessColor() {
		if (document.optionForm.blue.checked) {
			return document.optionForm.blue.value;
		} if (document.optionForm.green.checked) {
			return document.optionForm.green.value;
		}
	}

    return { 
        save : function () {
            conf.set({ 
                jenkinsURL : jenkinsUrlTextbox.value,
                pollIntervall: pollIntervallTextbox.value,
				iconSize: getIconSize(),
				successColor: getSuccessColor()
            });
            showSaveStatus(true);
            display();
            chrome.extension.getBackgroundPage().jenkins.init();
        },

        markDirty : function () {
            showSaveStatus(false);
        },


        init : function () {
            jenkinsUrlTextbox = document.getElementById("jenkins-url");
            pollIntervallTextbox = document.getElementById("poll-intervall");
            saveButton = document.getElementById("save-button");
            saveStatus = document.getElementById("save-status");
            display();
        }
    };
}(jenkins.conf);

