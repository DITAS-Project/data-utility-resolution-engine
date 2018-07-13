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
//app.use(bodyParser.json({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded());

//REST service
//input: application requirements, list of couples blueprint, method
//output: list of tuples blueprint UUID, method, score, pruned requirements
app.post('/api/filterBlueprints', function (req, res) {
    var requirements = JSON.parse(req.body.applicationRequirements);
    var list = JSON.parse(req.body.candidates);
    var resultSet = [];
    //console.log(req);
    //TODO invocazione webservice DUE per calcolo data utility (Paci - Cappiello) (localhost:50000)
    for (var listitem in list) {
        var blueprint = list[listitem].blueprint;
        var methodNames = list[listitem].methodNames;
        console.log(methodNames);
        var methods = blueprint.DATA_MANAGEMENT;
        for (var methodName in methodNames) {
            console.log(methodNames[methodName]);
            for (var method in methods) {
                console.log(methods[method].method_id);
                if (methods[method].method_id === methodNames[methodName]) {
                    
                    //compute data utility score
                    var dataUtilityScore = ranker.computeScore(requirements.attributes.dataUtility,
                        requirements.goalTrees.dataUtility, methods[method].attributes.dataUtility, "dataUtility");
                    //compute security score
                    var securityScore = ranker.computeScore(requirements.attributes.security,
                        requirements.goalTrees.security, methods[method].attributes.security, "security");
                    //compute privacy score
                    var privacyScore = ranker.computeScore(requirements.attributes.privacy,
                        requirements.goalTrees.privacy, methods[method].attributes.privacy, "privacy");
                    //compute global score
                    console.log("score ok");
                    console.log(dataUtilityScore);
                    console.log(securityScore);
                    console.log(privacyScore);

                    var globalScore = ranker.computeGlobalScore(dataUtilityScore, securityScore, privacyScore);
                    
                    if (globalScore > 0) {
                        console.log("score great");
                        //prune requirements goal tree
                        var trees = {};
                        trees.method_id = methodNames[methodName];
                        trees.goalTrees = {};
                        trees.goalTrees.dataUtility = treePruner.pruneGoalTree(requirements.attributes.dataUtility,
                            requirements.goalTrees.dataUtility, methods[method].attributes.dataUtility, "dataUtility");
                        trees.goalTrees.security = treePruner.pruneGoalTree(requirements.attributes.security,
                            requirements.goalTrees.security, methods[method].attributes.security, "security");
                        trees.goalTrees.privacy = treePruner.pruneGoalTree(requirements.attributes.privacy,
                            requirements.goalTrees.privacy, methods[method].attributes.privacy, "privacy");
                        blueprint.ABSTRACT_PROPERTIES = [trees];
                        //return blueprint with rank and pruned goal trees
                        var item = {
                            blueprint: blueprint,
                            score: globalScore,
                            methodNames: [methodNames[methodName]]
                        };
                        resultSet.push(item);
                    }
                }
            }
        }
    }
    return res.json(resultSet);
})



