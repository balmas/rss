(function(){
	var installLinks = {
	  chrome: {
	  	link: 'https://chrome.google.com/webstore/detail/alpheios-reading-tools/apkmkeppocbbebomnhdmhfenfifkhjfd',
	  	detectFn: detectChrome
	  },
	  firefox: {
	  	link: 'https://addons.mozilla.org/en-US/firefox/addon/alpheios-reading-tools/',
	  	detectFn: detectFirefox
	  }
	}

	var installButtonId = 'install-button';
	var installInfoId = 'install-info-unsupported';
	var installInfoMobileId = 'install-info-unsupported-mobile';

	function detectFirefox() {
	  return typeof InstallTrigger !== 'undefined';
	}

	function detectChrome() {
	  return !!window.chrome && !!window.chrome.webstore;
	}

	function detectMobile() {
	    ///<summary>Detecting whether the browser is a mobile browser or desktop browser</summary>
	    ///<returns>A boolean value indicating whether the browser is a mobile browser or not</returns>

	    if (sessionStorage.desktop) // desktop storage
	        return false;
	    else if (localStorage.mobile) // mobile storage
	        return true;

	    // alternative
	    var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile'];
	    for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

	    // nothing found.. assume desktop
	    return false;
	}

	function updateInstallLink(link) {
	  var defined = false
	  var currentLink
	  Object.keys(installLinks).forEach(function(browser){
	    if (!defined && installLinks[browser].detectFn() === true) {
	      currentLink = installLinks[browser].link;
	      defined = true
	    }
	  })

	  if (defined && currentLink) {
	  	link.setAttribute('href', currentLink);
	  	return true;
	  }
	  return false;
	}

	function hideInstallLink(link) {
	  link.classList.add("hidden");
	}

	function showInstallLink(link) {
	  link.classList.remove("hidden");
	}

	function hideInstallInfoUnsupported(info) {
 	  info.classList.add("hidden");
	}

	function showInstallInfoUnsupported(info) {
 	  info.classList.remove("hidden");
	}

	function showInstallInfoUnsupported(info) {
 	  info.classList.remove("hidden");
	}

	function showInfoForMobile(link, info) {
	  hideInstallLink(link);
	  showInstallInfoUnsupportedMobile(info);
	}

	function showInfoForSupportedBrowser(link, info) {
	  showInstallLink(link);
	  hideInstallInfoUnsupported(info);
	}

	function showInfoForUnSupportedBrowser(link, info) {
	  hideInstallLink(link);
	  showInstallInfoUnsupported(info);
	}

	document.addEventListener('DOMContentLoaded', function(){
	  var installLink = document.getElementById(installButtonId);
	  var installInfo = document.getElementById(installInfoId);

	  if (installLink === null) { return }

	  if (detectMobile()) {
	     installInfo = document.getElementById(installInfoMobileId);
	  	 showInfoForMobile(installLink, installInfo)
	  } else {
	  	if (updateInstallLink(installLink)) {
	  	  showInfoForSupportedBrowser(installLink, installInfo)
	  	} else {
	  	  showInfoForUnSupportedBrowser(installLink, installInfo)
	  	}
	  }
	})
}());
