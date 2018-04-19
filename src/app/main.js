/*
 * Data Utility Resolution Engine (DURE) module
 * Code written by Giovanni Meroni (giovanni.meroni@polimi.it)
*/

var express = require('express');
var app = express();
app.use(express.static(__dirname));
var bodyParser = require('body-parser');
var ranker = require("./ranker");
var treePruner = require("./treePruner");

var port = 8080;
if(process.argv.length > 2) {
	//HTTP port can be specified as application parameter. Otherwise, port 8080 is used.
	var inputPort = process.argv[2];
	if(inputPort > 8000 && inputPort < 65536){
		port = inputPort;
	}
	else {
		console.log("Invalid port value, default 8080 used instead.");
	}
}

var server = app.listen(port, function () {
	console.log("Resolution Engine listening on port "+port);
})

//required to parse JSON requests
app.use(bodyParser.json({ type: 'application/json' }));

//REST service
//input: application requirements, list of couples blueprint, method
//output: list of tuples blueprint UUID, method, score, pruned requirements
app.post('/api/rankBlueprints', function (req, res) {
    var requirements = req.body.applicationRequirements;
    var list = req.body.candidates;
    var resultSet = [];
    //console.log(req);
    //TODO invocazione webservice DUE per calcolo data utility (Paci - Cappiello) (localhost:50000)
    for (var listitem in list) {
        var blueprint = list[listitem].blueprint;
        var methodName = list[listitem].methodName;
        var methods = blueprint.DATA_MANAGEMENT.methods;
        var generalMetrics = blueprint.DATA_MANAGEMENT.generalMetrics;
        for (var method in methods) {
            if (methods[method].name === methodName) {
                //compute data utility score
                var dataUtilityScore = ranker.computeScore(requirements.goalTrees.dataUtility.goals,
                    requirements.goalTrees.dataUtility.treeStructure, methods[method].metrics.dataUtility, generalMetrics.dataUtility);
                //compute security score
                var securityScore = ranker.computeScore(requirements.goalTrees.security.goals,
                    requirements.goalTrees.security.treeStructure, methods[method].metrics.security, generalMetrics.security);
                //compute privacy score
                var privacyScore = ranker.computeScore(requirements.goalTrees.privacy.goals,
                    requirements.goalTrees.privacy.treeStructure, methods[method].metrics.privacy, generalMetrics.privacy);
                //compute global score
                console.log("score ok");
                console.log(dataUtilityScore);
                console.log(securityScore);
                console.log(privacyScore);

                var globalScore = ranker.computeGlobalScore(dataUtilityScore, securityScore, privacyScore);
                if (globalScore > 0) {
                    console.log("score great");
                    //prune requirements goal tree
                    var prunedRequirements = JSON.parse(JSON.stringify(requirements));
                    prunedRequirements.goalTrees.dataUtility.treeStructure = treePruner.pruneGoalTree(requirements.goalTrees.dataUtility.goals,
                        requirements.goalTrees.dataUtility.treeStructure, methods[method].metrics.dataUtility, generalMetrics.dataUtility);
                    prunedRequirements.goalTrees.security.treeStructure = treePruner.pruneGoalTree(requirements.goalTrees.security.goals,
                        requirements.goalTrees.security.treeStructure, methods[method].metrics.security, generalMetrics.security);
                    prunedRequirements.goalTrees.privacy.treeStructure = treePruner.pruneGoalTree(requirements.goalTrees.privacy.goals,
                        requirements.goalTrees.privacy.treeStructure, methods[method].metrics.privacy, generalMetrics.privacy);

                    //return blueprint with rank and pruned goal trees
                    var item = {
                        blueprintUUID: blueprint.UUID,
                        methodName: methodName,
                        score: globalScore,
                        fulfilledRequirements: prunedRequirements
                    };
                    resultSet.push(item);
                }
            }
        }
    }
    return res.json(resultSet);
})



