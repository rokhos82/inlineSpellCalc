var sCalc = function(targ, v, f, c, r) {
	this.displayBox = document.getElementById(targ);
	this.elems = {};

	this.variables = v;
	this.formStruc = f;
	this.calculator = c;
	this.report = r;

	this.initialize();

}

	sCalc.prototype.initialize = function() {
		this.v = JSON.parse(this.variables);
		this.f = JSON.parse(this.formStruc);
		this.r = JSON.parse(this.report);

		this.buildForm();
		this.buildReport();
		this.buildCalculator();
	}

	sCalc.prototype.buildCalculator = function() {
	}

	sCalc.prototype.calculate = function() {
		eval ("var v = this.v; " + this.calculator);
	}

	sCalc.prototype.buildForm = function() {
		var formBox = createSuperElement("div", ["class", "spellCalcForm"], ["innerHTML", "Form Box"]);
		this.elems.formBox = formBox;

		appendChildren(this.displayBox,formBox);

		if (usefulTypeOf(this.f) === "[object Array]") {
			var formTable = createSuperElement("table", ["class", "spellCalcForm"]);
			appendChildren(formBox, formTable);
			for(var i = 0; i < this.f.length; i++) {
				this.buildFormRow(this.f[i], formTable)
			}
		}
	}

	sCalc.prototype.buildFormRow = function(rdef, table) {
		var tr;
		var td;

		tr = createSuperElement("tr");
		td = createSuperElement("td",["innerHTML", "Row " + usefulTypeOf(rdef)] );
		appendChildren(tr,td);

		if (usefulTypeOf(rdef) === "[object Array]" ) {
			for (var j = 0; j < rdef.length; j++) {
//				td = createSuperElement("td", ["innerHTML", "L1." + j + usefulTypeOf(rdef[j]) ]);
			//	appendChildren(tr,td);
				this.buildFormCell(rdef[j], tr);
			}
		}



		appendChildren(table, tr);
	}

	sCalc.prototype.buildFormCell = function(cellDef, row) {
		var tdH;
		var tdI;
		var inp;

		if (usefulTypeOf(cellDef) === "[object Object]" ) {
			tdH = createSuperElement("td", ["innerHTML",cellDef.label], ["class","spellCalcHead"], ["colspan", (cellDef.hCol) ? cellDef.hCol : 1]);
			tdI = createSuperElement("td", ["colspan", (cellDef.fCol) ? cellDef.fCol : 1]);
			inp = createSuperElement("input", 
				["size",2], ["maxlength",4], 
				["value", (this.v[cellDef.map]) ? this.v[cellDef.map] : 0 ],
				["onchange", "this.SCobj.update(this);"]);
			inp.inpDef = cellDef;
			inp.SCobj = this;
			appendChildren(tdI,inp);

			appendChildren(row, tdH,tdI);
		}
	}

	sCalc.prototype.update = function(inputObj) {
		if (inputObj.inpDef.inpType === "text") {
			this.v[inputObj.inpDef.map] = inputObj.value;

			this.calculate();
		} else {
			if ( isNaN(inputObj.value) ) {
				inputObj.value = this.v[inputObj.inpDef.map];
			}
			else {
				this.v[inputObj.inpDef.map] = parseInt(inputObj.value,10);
			}
			this.calculate();
		}
	}














	sCalc.prototype.buildReport = function() {
		var repBox = createSuperElement("div", ["class", "spellCalcRep"], ["innerHTML","Report Box"])
		this.elems.repBox = repBox;

		appendChildren(this.displayBox,repBox);
	}
/*
var sCalc = {
	"version": "20131014a",
	"formname": "sCalcInterface",
	"CSSname": "sCalc",
	"displayBox": "sCalc",
	"Manager": "Manager", // used to target the Manager object in dynamically generated onClick, onChange, and other objects.
	"debug":  true,
	"traceLog": "",
	"logCalls": 0,
	"storageName": "chronSpellCalc"
}; 

*/


	sCalc.prototype.log = function(msg) {
		this.logCalls++;
		this.traceLog = sCalc.logCalls.toString() + ": " + msg + "\n" + this.traceLog;
	}

	sCalc.prototype.clearLog = function() {
		this.traceLog = "";
	}
	
	sCalc.prototype.eval = function(cmd) {
		this.log(cmd);
		try {
			eval(cmd);
		} 
		catch (exception) {
			this.log(exception);
		}
	}
	


	

	/*
	Service cleanup functions
	*/
	sCalc.prototype.destroy = function() {
		if (sCalc.debug) sCalc.log("[DESTROY]" + this.jsCLASSNAME + " " + this.jsOBJNAME);
		this.destroyFlag = 1;
		for (var svc in this) {
			if (this[svc].destroy && typeof this[svc].destroy == "function" && !this[svc].destroyFlag) {
				this[svc].destroy();
				delete this[svc];
			}
		}	
	}

	sCalc.prototype.extend = function(child, parent) {
		var f = function() {};
		f.prototype = parent.prototype
		child.prototype = new f();
	}

	sCalc.prototype.shallowMerge = function(p, c) {
		if (typeof c === "object") {
			for (var i in p) {
				if (typeof p[i] !== "object") {
					c[i] = p[i];
				}
			}
		}
	}

	sCalc.prototype.deepCopy = function(p, c) {
		var c = c || {};
		for (var i in p) {
			if (p[i] === null) {
				c[i] = p[i];
			}
			else if (typeof p[i] === 'object') {
				c[i] = (p[i].constructor === Array) ? [] : {}; // array or object
				sCalc.deepCopy(p[i], c[i]);
			} else {
				c[i] = p[i];
			}
		}
		return c;
	}
	
	
	
function addSlashes(str) {
str=str.replace(/\\/g,'\\\\');
str=str.replace(/\'/g,'\\\'');
str=str.replace(/\"/g,'\\"');
str=str.replace(/\0/g,'\\0');
return str;
}
function stripSlashes(str) {
str=str.replace(/\\'/g,'\'');
str=str.replace(/\\"/g,'"');
str=str.replace(/\\0/g,'\0');
str=str.replace(/\\\\/g,'\\');
return str;
}	
function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}
function ltrim(stringToTrim) {
	return stringToTrim.replace(/^\s+/,"");
}
function rtrim(stringToTrim) {
	return stringToTrim.replace(/\s+$/,"");
}

function appendChildren() {
	if (arguments[0] && arguments[0].appendChild) {
		var n = undefined;
		for (i = 1; i < arguments.length; i++) {
			if (arguments[i] === "\n") {
				n = document.createElement("br");
				arguments[0].appendChild(n);
				n = undefined;
			}
			else if (typeof arguments[i] == "string" || typeof arguments[i] == "number") {
				n = document.createTextNode(arguments[i]);
				arguments[0].appendChild(n);
				n = undefined;
			} else {
				arguments[0].appendChild(arguments[i]);
			}
		}
	}
}

function createSuperElement () {
	if (typeof arguments[0] === "string") {
		var el = document.createElement(arguments[0]);
		for (var i = 1; i < arguments.length; i++) {
			if (arguments[i].constructor == Array && arguments[i].length > 1) {
				if (arguments[i][0] == "innerHTML") {
					el.innerHTML = arguments[i][1];
				}
				else {
					el.setAttribute(arguments[i][0], arguments[i][1]);				
				}
			}
		}
		return el;
	}
}

function usefulTypeOf (obj) {
	return Object.prototype.toString.call(obj);
}