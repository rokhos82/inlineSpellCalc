pracMan.pracManagerDAT = function(version) {
	this.version = version;
	this.keySeed = 0;

	this.repertoire = new pracMan.repertoireCollectionDAT("repertoire");
	this.etudes = new pracMan.repertoireCollectionDAT("etudes");
	this.exercises = {};
	this.sessions = [];

	this.userDefined = {};

	this.userDefined.scales = {};
	this.userDefined.scalePatterns = {};
	this.userDefined.scaleModes = {};
	this.userDefined.exercisePatterns = {};

}