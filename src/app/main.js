/**
 * Data Utility Resolution Engine (DURE) module
 * Code written by Giovanni Meroni (giovanni.meroni@polimi.it)
 *
 * Copyright 2018 Politecnico di Milano
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * This is being developed for the DITAS Project: https://www.ditas-project.eu/
 */

var express = require('express');
var app = express();
app.use(express.static(__dirname));
var bodyParser = require('body-parser');
var ranker = require("./ranker");
var treePruner = require("./treePruner");
var config = require('./config.json');

var port = 8080;
if (process.argv.length > 2) {
    //HTTP port can be specified as application parameter. Otherwise, port 8080 is used.
    var inputPort = process.argv[2];
    if (inputPort > 8000 && inputPort < 65536) {
        port = inputPort;
    }
    else {
        console.log("Invalid port value, default 8080 used instead.");
    }
} else {
    port = config.Port;
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
    return res.json(filter(req.body.applicationRequirements, req.body.candidates));
});

//alternative REST service (request sent as form data, for testing purposes)
//input: application requirements, list of couples blueprint, method
//output: list of tuples blueprint UUID, method, score, pruned requirements
app.post('/api/filterBlueprintsAlt', function (req, res) {
    var requirements = JSON.parse(req.body.applicationRequirements);
    var list = JSON.parse(req.body.candidates);
    return res.json(filter(requirements, list));
})

function filter(requirements, list) {
    var resultSet = [];
    //TODO ripesatura goal tree + invocazione webservice DUR per calcolo pesi
	if(requirements.attributes!=undefined) {
		//identify best value for each attribute (considering all blueprints)
		var optimumDUValues = ranker.computeOptimumDU(requirements.attributes.dataUtility, list);
	}
    for (var listitem in list) {
        var blueprint = list[listitem].blueprint;
        var methodNames = list[listitem].methodNames;
        //TODO invocazione webservice DUE per calcolo data utility (Paci - Cappiello) (localhost:50000)
        var methods = blueprint.DATA_MANAGEMENT;
        for (var methodName in methodNames) {
            for (var method in methods) {
                if (methods[method].method_id === methodNames[methodName]) {
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
                
                    var globalScore = ranker.computeGlobalScore(dataUtilityScore, securityScore, privacyScore);

                    if (globalScore > 0) {
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
    return resultSet.sort(compare);
    //return resultSet;
};

function compare(a, b) {
    if (a.score > b.score)
        return -1;
    if (a.score < b.score)
        return 1;
    return 0;
}
