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

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

//REST service
//input: application requirements, list of couples blueprint, method
//output: list of tuples blueprint UUID, method, score, pruned requirements
app.post('/api/filterBlueprints', function (req, res) {
    console.log(req.body);
    return res.json(filter(req.body.applicationRequirements, req.body.candidates));
});

//alternative REST service (request sent as form data, for testing purposes)
//input: application requirements, list of couples blueprint, method
//output: list of tuples blueprint UUID, method, score, pruned requirements
app.post('/api/filterBlueprintsAlt', function (req, res) {
    console.log(req.body.applicationRequirements);
    var requirements = JSON.parse(req.body.applicationRequirements);
    var list = JSON.parse(req.body.candidates);
    return res.json(filter(requirements, list));
})

function filter(requirements, list) {
    var resultSet = [];
    //console.log(req);
    //TODO ripesatura goal tree + invocazione webservice DUR per calcolo pesi

    //identify best value for each attribute (considering all blueprints)
    var optimumDUValues = ranker.computeOptimumDU(requirements.attributes.dataUtility, list);
    console.log(optimumDUValues);

    for (var listitem in list) {
        var blueprint = list[listitem].blueprint;
        var methodNames = list[listitem].methodNames;
        //TODO invocazione webservice DUE per calcolo data utility (Paci - Cappiello) (localhost:50000)
        console.log(methodNames);
        var methods = blueprint.DATA_MANAGEMENT;
        for (var methodName in methodNames) {
            console.log(methodNames[methodName]);
            for (var method in methods) {
                console.log(methods[method].method_id);
                if (methods[method].method_id === methodNames[methodName]) {
                    console.log(optimumDUValues);
                    //compute data utility score
                    var dataUtilityScore = ranker.computeScore(requirements.attributes.dataUtility,
                        requirements.goalTrees.dataUtility, methods[method].attributes.dataUtility, optimumDUValues);
                    //compute security score
                    var securityScore = ranker.computeScore(requirements.attributes.security,
                        requirements.goalTrees.security, methods[method].attributes.security, undefined);
                    //compute privacy score
                    var privacyScore = ranker.computeScore(requirements.attributes.privacy,
                        requirements.goalTrees.privacy, methods[method].attributes.privacy, undefined);
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
                            requirements.goalTrees.dataUtility, methods[method].attributes.dataUtility, optimumDUValues);
                        methods[method].attributes.dataUtility = requirements.attributes.dataUtility;
                        trees.goalTrees.security = treePruner.pruneGoalTree(requirements.attributes.security,
                            requirements.goalTrees.security, methods[method].attributes.security, undefined);
                        methods[method].attributes.security = requirements.attributes.security;
                        trees.goalTrees.privacy = treePruner.pruneGoalTree(requirements.attributes.privacy,
                            requirements.goalTrees.privacy, methods[method].attributes.privacy, undefined);
                        methods[method].attributes.privacy = requirements.attributes.privacy;
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
    return resultSet;
};

