var sCalcPrefs = function(storageName) {
    this.storageName = storageName;
    this.spellKeys = {};
    this.savePossible = true;

    this.initialize();
};

    sCalcPrefs.prototype.initialize = function() {
        this.loadData();
    }

    sCalcPrefs.prototype.saveData = function() {
        if(this.savePossible && JSON && localStorage) {
            localStorage.setItem(storageName,JSON.stringify(this.spellKeys));
        }
        else {
            this.savePossible = false
            alert("[ERROR] (sCalcPrefs.prototype.saveData not possible. LocalStorage or JSON not available.");
        }
    }

    sCalcPrefs.prototype.loadData = function() {
        if(JSON && localStorage) {
            if( localStorage.getItem(this.storageName) ) {
                this.spellKeys = JSON.parse( localStorage.getItem(this.storageName) );
            }
        }
        else {
            alert("ERROR sCalcPrefs.prototype.loadManagerData: JSON or localStorage is not available.");
        }
    }