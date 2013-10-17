<?php
/**
 * Export to PHP Array plugin for PHPMyAdmin
 * @version 0.2b
 */

//
// Database `kantia`
//

// `kantia`.`spell`
$spell = array(
  array('spell_id' => '1','name' => 'Alarm','json_variables' => '{
	"name": "Alarm",
	"stamMIN": 1,
	"strainBASE": 4,
	"strainEPOT": 2,
	"strainAOE": 0,
	"strainTARG": 2,
	"strainRANGE": 0,
	"strainDUR": 0,
	"diffBASE": 20,
	"diffEPOT": 20,
	"diffAOE": 0,
	"diffTARG": 20,
	"diffRANGE": 0,
	"diffDUR": 0,
	"damageDiceType": "d6",

	"totalTAV": 0,
	"totalStrain": 0,
	"power":0 ,
	"staging": 0,
	"damageDice": 0,
	"surge": 0,
	"drain": 0,

	"txtDamage": "",
	"txtStaging": "",
	"txtResist": "",
	"txtDrain": "",
	"txtSurge": "",
	"txtAoE": "",
	"txtRange": "",

	"EPOT": 1,
	"targets": 1,
	"overpower": 0,
	"attribute": 10,
	"spellRank": 4,
	"disciplineRank": 4,
}','json_calc' => 'v.totalTAV = v.diffBASE + (v.EPOT * v.diffEPOT);
v.totalStrain = v.strainBASE + (v.EPOT * v.strainEPOT) + (v.targets * v.strainTARG);
v.txtAoE = v.power * 3;
v.txtRange = v.power;
v.txtSurge = v.totalStrain * 0.1;','json_form' => '[
	[ {"map": "EPOT", "label": "EPOT", "hCol": 2}, {"map": "targets", "label": "Mental Targets"}],
	[ {"map": "overpower", "label": "Overpower", "fCol":2}, { "map": "karma", "label": "Karma:"}]
]','json_report' => '[
	[ {"text": "Name:", "class": "header"} , "$name" ],
	[ {"text": "Total Strain:", "class": "header"}, "$totalStrain", {"text": "Total TAV:"}, "$totalTAV" ],
	[ { "text": "Drain: ", "class": "header"}, { "text": "$txtDrain", "cols": 3} ],
	[ { "text": "Surge: ", "class": "header"}, { "text": [ "$txtSurge", " at end of duration" ] } ]
]'),
  array('spell_id' => '2','name' => 'Annoint the Wounded','json_variables' => '','json_calc' => '','json_form' => '','json_report' => ''),
  array('spell_id' => '3','name' => 'Brilliant Lance','json_variables' => '','json_calc' => '','json_form' => '','json_report' => '')
);
