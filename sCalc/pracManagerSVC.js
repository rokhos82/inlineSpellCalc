pracMan.pracManagerSVC = function(aManDAT, aDispBoxId) {
	this.mandat = aManDAT;
	this.UI = new pracMan.pracManagerUI (this, aDispBoxId);
	
	this.callStack = null;
	
	pracMan.Manager = this;

	this.jsCLASSNAME = "pracMan.pracManagerSVC";	
};



	pracMan.pracManagerSVC.prototype.refreshData = function (channel, param, trigger) {
		pracMan.log("[START] pracMan.pracManagerSVC.prototype.refreshData = function ( " + channel + ", " + param + ", " + trigger + ")");

		if (!this.callStack) {
			this.callStack = new pracMan.calculationStack(channel, param, trigger);
		}

		if ( this.callStack.checkAgainstStackCalls(channel, param) ) {
			if (pracMan.debug) pracMan.log("[ERROR] pracMan.pracManagerSVC.prototype.refreshData = function ( " + channel + ", " + param + "): Callstack collision. Dude... that sucks. Hope you have insurance.");
			return;
		}

		var tok = this.callStack.addNewCall(channel, param);		

		if (pracMan.calculationFlow[channel]) {
			for (var i=0; i<pracMan.calculationFlow[channel].length; i++) {
				var func = this.fetchDataUpdateMethod(pracMan.calculationFlow[channel][i]);
				var command = "";
				var pathArray = pracMan.calculationFlow[channel][i].split(".");
				command = pathArray[pathArray.length-1];
				if (func[command]) {
					func[command](param);	
					pracMan.log ("[EXECUTE] " + pracMan.calculationFlow[channel][i] );
				}
				else {
					if (pracMan.debug) pracMan.log("[ERROR] pracMan.pracManagerSVC.prototype.refreshData = function ( " + channel + ", " + param + "): Channel does not exist on Active Character. Abort update.");				
				}
			}
		}
		else {
			if (pracMan.debug) pracMan.log("[ERROR] pracMan.pracManagerSVC.prototype.refreshData = function ( " + channel + ", " + param + "): Channel does not exist in pracMan.calculationFlow. Abort update.");				
		}
		
		if (tok == this.callStack.token) {
			// ok, we know the original call has come home.  Kill the stack!
			this.flushCallStack();
			this.UI.activePanel.updateDisplay();
			if (pracMan.debug) pracMan.log("[FINISH] pracMan.pracManagerSVC.prototype.refreshData = function ( " + channel + ", " + param + ")");
		}		
	}


	pracMan.pracManagerSVC.prototype.flushCallStack = function() {
		pracMan.log("[CALL] pracMan.pracManagerSVC.prototype.flushCallStack = function ()");

		this.callStack = null;
	}


	pracMan.pracManagerSVC.prototype.fetchDataUpdateMethod = function(objectMap) {
		pracMan.log("[CALL] pracMan.pracManagerSVC.prototype.fetchDataUpdateMethod = function ( " + objectMap + ")");
		var pathArray = objectMap.split(".");
		var func = false;
		
		if (pathArray.length > 0) {
			var i = pathArray.length;
			pathArray.reverse();
			var func = this.getUpdateFunction(this.activeChar, pathArray, i);
			return func;
		}
	}
	
	pracMan.pracManagerSVC.prototype.getUpdateFunction = function(obj, pathArray, index) {
		if (pracMan.debug) pracMan.log("[CALL] pracMan.pracManagerSVC.prototype.getUpdateFunction = function ( obj, [" + pathArray + "], " + index + ")");
		index--;
		if (index == 0) {
			return obj;
		}
		else if (obj[pathArray[index]]) {
			var func = obj[pathArray[index]];
			return this.getUpdateFunction(func, pathArray, index);
		}
		else {
			if (pracMan.debug) pracMan.log("[ERROR] pracMan.pracManagerSVC.prototype.getUpdateFunction = function ( obj, [" + pathArray + "], " + index + "): Path does not exist on object.");
			return false;
		}
	}
	

	
	
	
	
	pracMan.pracManagerSVC.prototype.saveManagerData = function() {
		if (pracMan.debug) pracMan.log("[CALL] pracMan.pracManagerSVC.prototype.saveManagerData = function()");
		if(JSON && localStorage) {
			localStorage.setItem(pracMan.storageName,JSON.stringify(this.mandat));
		} 
		else {
			alert("[ERROR] (pracMan.pracManagerSVC.prototype.saveManagerData): JSON or localStorage is not available.");
		}
	}
	
	pracMan.pracManagerSVC.prototype.loadManagerData = function() {
		if (pracMan.debug) pracMan.log("[CALL] pracMan.pracManagerSVC.prototype.loadManagerData = function()");
			
		if(JSON && localStorage) {
			if(localStorage.getItem(pracMan.storageName)) {
				this.mandat = JSON.parse(localStorage.getItem(pracMan.storageName));
				if (this.mandat.version && this.mandat.version != pracMan.version) {
					alert("You are loading data from a different version of the character manager!  That's kind of a \"not good\" thing and means some features are not present or simply will not work!  Really, the best thing you can do is rebuild your characters from scratch.");
				}
				this.refreshMenus();
			}
		} 
		else {
			alert("ERROR (SA.spellAdminSVC.prototype.loadMangerData: JSON or localStorage is not available.");
		}
	}
	

	/****************************
	Holding onto this code incase it is necessary.
	******************************/	
	pracMan.pracManagerSVC.prototype.refreshMenus = function () {
		if (this.mandat.charGroups) {
			for (var grp in this.mandat.charGroups) {
				this.setActiveCharGroup(this.mandat.charGroups[grp].name);
				for (var ch in this.mandat.charGroups[grp].characters) {
					this.setActiveChar(this.mandat.charGroups[grp].characters[ch].name);
					break;
				}
				break;
			}
		}
	}