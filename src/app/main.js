/**
 * Data Utility Resolution Engine (DURE) module
 * Code written by Giovanni Meroni (giovanni.meroni@polimi.it)
 *
 * Copyright 2018-19 Politecnico di Milano
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
var dqHandler = require("./dqHandler");
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

//REST service (deprecated)
//input: application requirements, list of couples blueprint, method
//output: list of tuples blueprint UUID, method, score, pruned requirements
app.post('/api/filterBlueprints', function (req, res) {
    return res.json(filter(req.body.applicationRequirements, req.body.candidates, ranker.API_V1));
});

//REST service (new endpoint)
//input: application requirements, list of couples blueprint, method
//output: list of tuples blueprint UUID, method, score, pruned requirements
app.post('/v1/filterBlueprints', function (req, res) {
    return res.json(filter(req.body.applicationRequirements, req.body.candidates, ranker.API_V2));
});

//alternative REST service (request sent as form data, for testing purposes)
//input: application requirements, list of couples blueprint, method
//output: list of tuples blueprint UUID, method, score, pruned requirements
app.post('/v1/filterBlueprintsAlt', function (req, res) {
    var requirements = JSON.parse(req.body.applicationRequirements);
    var list = JSON.parse(req.body.candidates);
    return res.json(filter(requirements, list, ranker.API_V1));
})

//alternative REST service (request sent as form data, for testing purposes)
//input: application requirements, list of couples blueprint, method
//output: list of tuples blueprint UUID, method, score, pruned requirements
app.post('/v2/filterBlueprintsAlt', function (req, res) {
    var requirements = JSON.parse(req.body.applicationRequirements);
    var list = JSON.parse(req.body.candidates);
    return res.json(filter(requirements, list, ranker.API_V2));
})

function filter(requirements, list, apiVersion) {
    ranker.setApiLevel(apiVersion);
    treePruner.setApiLevel(apiVersion);
    var resultSet = [];

    if (requirements.attributes != undefined) {
		//identify best value for each attribute (considering all blueprints)
        var optimumDUValues = ranker.computeOptimumDU(requirements.attributes.dataUtility, list);
        if (apiVersion == ranker.API_V2) {
            requirements = dqHandler.rebalanceGoalTree(requirements);
        }
	}
    for (var listitem in list) {
        var blueprint = list[listitem].blueprint;
        var methodNames = list[listitem].methodNames;

        if (apiVersion == ranker.API_V2) {
            blueprint = dqHandler.computePDU(requirements, blueprint);
        }

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

                    console.log(dataUtilityScore);

                    var globalScore = ranker.computeGlobalScore(dataUtilityScore, securityScore, privacyScore);

                    if (globalScore > 0) {
                        //replace attributes with application requirements
                        blueprint.DATA_MANAGEMENT[method].attributes = requirements.attributes;
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
};

function compare(a, b) {
    if (a.score > b.score)
        return -1;
    if (a.score < b.score)
        return 1;
    return 0;
}
