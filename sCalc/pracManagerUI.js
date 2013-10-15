pracMan.pracManagerUI = function(aPracManSVC, dispBox) {
	this.Manager = aPracManSVC;
	this.dispBox = document.getElementById(dispBox);

	this.elements = {}; // holds references to other UI objects.
	this.subUIs = {};
		
	this.form = this.initializeForm();
	this.initializeInterface();
	this.defineManagerFunctionMenu();

	
	this.elements.editorTabs = {};
	this.elements.editorPanels = {};
	this.defineTabsAndPanels("Editor", pracMan.panelTabsDef, pracMan.CSSname + "_TDcontent");

	this.subUIs.sessionsPanel = new pracMan.panelSessionsUI(this, this.Manager, this.elements.editorPanels["editSessions"]);
	this.subUIs.scalesPanel = new pracMan.panelScalesUI(this, this.Manager, this.elements.editorPanels["editScales"]);
//	this.subUIs.repertoirePanel = new pracMan.panelRepertoireUI(this, this.Manager, this.elements.editorPanels["editRepertoire"]);
//	this.subUIs.etudesPanel = new pracMan.panelRepertoireUI(this, this.Manager, this.elements.editorPanels["editEtudes"]);
//	this.subUIs.exercisesPanel = new pracMan.panelExercisesUI(this, this.Manager, this.elements.editorPanels["editExercises"]);
//	this.subUIs.scalesPanel = new pracMan.panelScalseUI(this, this.Manager, this.elements.editorPanels["editScales"]);

	this.panelUIs = {};

	this.panelUIs.sessionsPanel = this.subUIs.sessionsPanel;
	this.panelUIs.scalesPanel = this.subUIs.scalesPanel;
//	this.panelUIs.repertoirePanel = this.subUIs.repertoirePanel;
//	this.panelUIs.etudesPanel = this.subUIs.etudesPanel;
//	this.panelUIs.exercisesPanel = this.subUIs.exercisesPanel;
//	this.panelUIs.scalesPanel = this.subUIs.scalesPanel;


	this.activePanel = this.subUIs.sessionsPanel;
	this.activePopup = undefined;
	
	// not sure if this is useful
	for (var ui in this.subUIs) {
		this[ui + "UI"] = this.subUIs[ui];
	}
}

	pracMan.pracManagerUI.prototype.updateDisplay = function() {
		if (pracMan.debug) pracMan.log("[CALL] pracMan.pracManagerUI.prototype.updateDisplay = function()");
		if (this.Manager.activeChar) {
			for (var ui in this.panelUIs) {
				this.subUIs[ui].updateDisplay();
			}
		} 
		else {
			if (pracMan.debug) pracMan.log("[ERROR] pracMan.pracManagerUI.prototype.updateDisplay = function() - No active character found.");
		}
	}

	/* the entire point of most of this is to programatically define the interface so this code can be dropped into almost any webpage */
	pracMan.pracManagerUI.prototype.initializeForm = function () {
		if (pracMan.debug) pracMan.log("[CALL] pracMan.pracManagerUI.prototype.initializeForm = function()");
		
		var f = document.getElementById(pracMan.formname);
		if ( !f ) {
			f = document.createElement("form");
			f.setAttribute("id", pracMan.formname);
			f.setAttribute("name", pracMan.formname);
			f.setAttribute("onsubmit", "return false;");
			f.setAttribute("method", "post");
			this.dispBox.appendChild(f);
		} 
		else {
			if (pracMan.debug) pracMan.log("[WARNING] pracMan.pracManagerUI.prototype.initializeForm = function(): form " + pracMan.formname + " already exists.");	
		}
		
		return f;
	}


	pracMan.pracManagerUI.prototype.initializeInterface = function() {
		if (pracMan.debug) pracMan.log("[CALL] pracMan.pracManagerUI.prototype.initializeInterface = function()");
		if (!this.initialized) {
			this.defineFormShape();
			this.initialized = 1;
		}
		else {
			if (pracMan.debug) pracMan.log("[WARNING]: pracMan.pracManagerUI.prototype.initializeInterface = function():  Interface alrady exists");
		}
	}



	pracMan.pracManagerUI.prototype.defineFormShape = function() {
		if (pracMan.debug) pracMan.log("[CALL] pracMan.pracManagerUI.prototype.defineFormShape = function()");
	
		// yeah, I'm using a table to hold non-tabular data. Big whoop, wanna' fight 'bout it?
		var table = document.createElement("table");
		var row = document.createElement("tr");
		var col1 = document.createElement("td");
		var col2 = document.createElement("td");

		this.elements.menuCol = col1;
		this.elements.contentCol = col2;

		table.setAttribute("id", pracMan.CSSname + "_TABLEskeleton");
		col1.setAttribute("valign", "top");
		col2.setAttribute("valign", "top");
		col1.setAttribute("id", pracMan.CSSname + "_TDsideMenus");
		col2.setAttribute("id", pracMan.CSSname + "_TDcontent");

		row.appendChild(col1);
		row.appendChild(col2);
		table.appendChild(row);
		this.form.appendChild(table);
	}

	pracMan.pracManagerUI.prototype.defineManagerFunctionMenu = function() {
		if (pracMan.debug) pracMan.log("[CALL] pracMan.pracManagerUI.prototype.defineManagerFunctionMenu = function()");

		var div;
		div = document.createElement("div");
		div.setAttribute("class", pracMan.CSSname + "leftMenu");

		var btnSave;
		btnSave = document.createElement("input");
		btnSave.setAttribute("type", "button");
		btnSave.setAttribute("value", "Save Manager Data");
		btnSave.setAttribute("onclick", "pracMan.Manager.saveManagerData()");

		var btnLoad;
		btnLoad = document.createElement("input");
		btnLoad.setAttribute("type", "button");
		btnLoad.setAttribute("value", "Load Manager Data");
		btnLoad.setAttribute("onclick", "pracMan.Manager.loadManagerData()");

		div.appendChild(btnSave);
		div.appendChild(btnLoad);
		this.elements.menuCol.appendChild(div);
	}



	pracMan.pracManagerUI.prototype.defineTabsAndPanels = function(groupName, panelTabsArray, containerId) {
		if (pracMan.debug) pracMan.log("[CALL] pracMan.pracManagerUI.prototype.defineFormShape = function()");
		this.defineTabSet (groupName, panelTabsArray, containerId);
		this.definePanelSet (groupName, panelTabsArray, containerId);
	}



	pracMan.pracManagerUI.prototype.defineTabSet = function(groupName, ptArray, containerId) {
		if(pracMan.debug) pracMan.log("[CALL]: pracMan.pracManagerUI.prototype.defineTabs = function()");		
		var ul = document.createElement("ul");
		ul.setAttribute("id", pracMan.CSSname + groupName + "TabSet");
		ul.setAttribute("class", pracMan.CSSname + "TabSet");
		for (var i = 0; i < ptArray.length ; i++) {
			this.defineTab(ptArray[i].id, ptArray[i].label, ul, groupName);
		}
		ul.childNodes[0].className = ul.childNodes[0].className + ' activeTab'; 


		var container = document.getElementById(containerId);
		if (container) {
			container.appendChild(ul);
			if(pracMan.debug) pracMan.log("[FINISH]: pracMan.pracManagerUI.prototype.defineTabSet = function()");		
		}
		else {
			if(pracMan.debug) pracMan.log("[ERROR]: pracMan.pracManagerUI.prototype.defineTabSet = function(): " + containerId + " does not exist.");		
		}
	}


	pracMan.pracManagerUI.prototype.defineTab = function(tabId, label, tabSet, groupName) {
		if(pracMan.debug) pracMan.log("[CALL]: pracMan.pracManagerINT.prototype.defineTab = function(" + tabId + ")");		
		var li = document.createElement("li");
		li.setAttribute("id", pracMan.CSSname + tabId + "Tab");
		li.setAttribute("class", pracMan.CSSname + "NavTab");
		
		var a = document.createElement("a");
		a.setAttribute("id", pracMan.CSSname + tabId + "TabLink");
		a.setAttribute("onclick", "pracMan.switchTabs('" + tabSet.id + "', '" 
													+ pracMan.CSSname + groupName + "PanelSet', '" 
													+ li.id + "', '" + pracMan.CSSname + tabId +"Panel' ); this.JSUI.updateDisplay();");
		a.innerHTML = label;
		li.appendChild(a);

		if (tabSet) {
			tabSet.appendChild(li);
		}
		return li;
	}


	pracMan.pracManagerUI.prototype.definePanelSet = function (groupName, ptArray, containerId) {
		if(pracMan.debug) pracMan.log("[CALL]: pracMan.pracManagerUI.prototype.defineTabs = function()");		
		var div = document.createElement("div");
		div.setAttribute("id", pracMan.CSSname + groupName + "PanelSet");
		div.setAttribute("class", pracMan.CSSname + "PanelSet");
		
		for (var i = 0; i < ptArray.length ; i++) {
			this.elements.editorPanels[ ptArray[i].id ] = this.definePanel(ptArray[i].id + "Panel", ptArray[i].label, div);
			if (i == 0) div.firstChild.style.display = 'block';
		}

		var container = document.getElementById(containerId);
		if (container) {
			container.appendChild(div);
			if(pracMan.debug) pracMan.log("[FINISH]: pracMan.pracManagerUI.prototype.definePanelSet = function()");		
		}
		else {
			if(pracMan.debug) pracMan.log("[ERROR]: pracMan.pracManagerUI.prototype.definePanelSet = function(): " + containerId + " does not exist.");		
		}
	}


	pracMan.pracManagerUI.prototype.definePanel= function(panelId, label, panelSet) {
		if(pracMan.debug) pracMan.log("CALL: pracMan.pracManagerUI.prototype.definePanel = function(" + panelId + ")");		
		var div = document.createElement("div");
		div.setAttribute("id", pracMan.CSSname + panelId);
		div.setAttribute("class", pracMan.CSSname + "panel");
		div.style.display = 'none';
		
		var h4 = document.createElement("h4");
		h4.innerHTML =  label;		
		div.appendChild(h4);
		if (panelSet) {
			panelSet.appendChild(div);
		}
		return div;
	}