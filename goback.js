// setup 
var currentTabUrls = new Array();
var previousTabUrls = new Array();
var parent = chrome.contextMenus.create({"title": "Go Back in New Tab", "onclick": genericOnClick});

// initial load of all urls for tabs
chrome.tabs.getAllInWindow(window.id, function(tabList) {
	window.tabs = tabList;
	console.log(tabList);
	for(var i=0; i < tabList.length; i++) {
		console.log("tabList: " + tabList[i].id);
		console.log("tabList: " + tabList[i].url);
		currentTabUrls[tabList[i].id] =  tabList[i].url;
	}
	console.log('window refreshed -- windowId: ' + window.id + ' tab count:' + window.tabs.length);

});

/* 
	Listens to all tab urls. When a new page is loaded, 
	the url is put into the currentTabUrls array. If the currentTabUrl[index] 
	is not null, then we will copy the url to the previousTabUrl array. This 
	is so we have trackback info. 
*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == "loading") {
		console.log("listener tabId: " + tabId);
		console.log("listener status: " + changeInfo.status);
		console.log("listener url: " + changeInfo.url);
		
		if(currentTabUrls[tabId] != null)
			previousTabUrls[tabId] = currentTabUrls[tabId];
		
		currentTabUrls[tabId] = changeInfo.url;		
	}
	if(changeInfo.status == "complete") {
		console.log("page load complete");
	}
});

function genericOnClick(info, tab) {
	console.log("tab: " + JSON.stringify(tab.id));
	console.log("tab.url: " + JSON.stringify(tab.url));

	chrome.tabs.create({url: previousTabUrls[JSON.stringify(tab.id)]});
}
