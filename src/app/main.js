var express = require('express');
var app = express();
app.use(express.static(__dirname));
var bodyParser = require('body-parser');

var port = 8081;
if(process.argv.length > 2) {
	//HTTP port can be specified as application parameter. Otherwise, port 8081 is used.
	var inputPort = process.argv[2];
	if(inputPort > 8000 && inputPort < 65536){
		port = inputPort;
	}
	else {
		console.log("Invalid port value, default 8081 used instead.");
	}
}

var server = app.listen(port, function () {
	console.log("Resolution Engine listening on port "+port);
})

//required to parse JSON requests
app.use(bodyParser.urlencoded({
    extended: true
}));

//REST service
//input: application requirements, list of couples blueprint, method
//output: list of tuples score, method, blueprint UUID
app.post('/api/rankBlueprints', function (req, res) {

    var requirements = req.body.requirements;
    var list = req.body.list;
    var resultSet = [];
    //TODO invocazione webservice DUE per calcolo data utility (Paci - Cappiello)
    for (var listitem in list) {
        var blueprint = list[listitem].blueprint;
        var methodName = list[listitem].method;
        var methods = blueprint.DATA_MANAGEMENT.methods;
        var generalMetrics = blueprint.DATA_MANAGEMENT.generalMetrics;
        for (var method in methods) {
            if (methods[method].name === methodName) {
                var dataUtilityScore = computeNodeScore(requirements.goalTrees.dataUtility.goals,
                    requirements.goalTrees.dataUtility.treeStructure, methods[method].metrics.dataUtility, generalMetrics.dataUtility);
                var securityScore = computeNodeScore(requirements.goalTrees.security.goals,
                    requirements.goalTrees.security.treeStructure, methods[method].metrics.security, generalMetrics.security);
                var privacyScore = computeNodeScore(requirements.goalTrees.privacy.goals,
                    requirements.goalTrees.privacy.treeStructure, methods[method].metrics.privacy, generalMetrics.privacy);
                var globalScore = computeGlobalScore(dataUtilityScore, securityScore, privacyScore);
                if (globalScore > 0) {
                    var item = {
                        score: globalScore, method: methodName, blueprint: blueprint.UUID
                    };
                    resultSet.push(item);
                }
            }
        }
    }
    res.end(resultSet.toString());
})

function computeNodeScore(goalList, node, metrics, generalMetrics) {
	console.log("checkNode, node:");
    console.log(node);
	    var scoreboard = [];
        var ret = 0;
		for (var child in node.children) {
			//recursively invoke function for each child nodes
            ret = computeNodeScore(blueprint, goalList, node.children[child]);
			//when current node type is AND, the first child node that is not satisfied makes the current node also not satisfied
            if (ret === 0 && node.type === 'AND') {
                return 0;
            } else {
                scoreboard.push(ret);
            }
        }
        for (var leaf in node.leaves) {
            //recursively invoke function for each child nodes
            ret = assessGoal(goalList, node.leaves[leaf], metrics, generalMetrics);
            //when current node type is AND, the first child node that is not satisfied makes the current node also not satisfied
            if (ret === 0 && node.type === 'AND') {
                return 0;
            } else {
                scoreboard.push(ret);
            }
        }
        //return result to parent node
        return scoreboard.reduce(function (a, b) {
            return a + b;
        }, 0) / scoreboard.length;
}

function assessGoal(goalList, goalName, metrics, generalMetrics) {
    //look for a goal whose name is identical to goalName
    for (var goal in goalList) {
        if (goalList[goal].id === goalName) {
            //verify if all metrics belonging to that goal are fulfilled
            for (var goalMetric in goalList[goal].metrics) {
                //look for blueprint metrics compatible with the one indicated in the goal
                var compatibleMetrics = [];
                for (var metric in metrics) {
                    if (metrics[metric].type === goalList[goal].metrics[goalMetric].type) {
                        compatibleMetrics.push(metrics[metric]);
                    }
                }
                //a compatible metric was not found
                if (compatibleMetrics.length === 0) {
                    //look into general metrics
                    for (metric in generalMetrics) {
                        if (generalMetrics[metric].type === goalList[goal].metrics[goalMetric].type) {
                            compatibleMetrics.push(generalMetrics[metric]);
                        }
                    }
                }
                //if the metric was not fulfilled (or not found), also the whole goal is not
                if (!assessMetric(goalList[goal].metrics[goalMetric], compatibleMetrics)) {
                    return 0;
                }
            }
            //if we reached the end of the cycle, then the goal is fulfilled
            //thus, return the weight
            return goalList[goal].weight;
        }
    }
    //application requirements are malformed
    return 0;
}

function assessMetric(goalMetric, blueprintMetrics) {
    for (var goalProperty in goalMetric.properties) {
        var fulfilled = false;
        for (var metric in blueprintMetrics) {
            for (var blueprintProperty in blueprintMetrics[metric].properties) {
                if (goalMetric.properties[property].name === blueprintMetrics[metric].properties[blueprintProperty].name) {
                    if (assessProperty(goalMetric.properties[goalProperty], blueprintMetrics[metric].properties[blueprintProperty])) {
                        fulfilled = true;
                    }
                }
            }
        }
        if (!fulfilled) {
            return false;
        }
    }
    return true;
}

function assessProperty(goalProperty, blueprintProperty) {
    //minimum threshold was specified for goal property
    if (goalProperty.minimum !== undefined) {
        //minimum threshold was specified for blueprint property
        if (blueprintProperty.minimum !== undefined) {
            //verify if property is not within threshold
            if (goalProperty.minimum > blueprintProperty.minimum) {
                //goal metric is not fulfilled
                return false
            }
        //no minimum threshold was specified for the blueprint property
        } else {
            //goal property is not fulfilled
            return false
        }
    }
    //maximum threshold was specified for goal property
    if (goalProperty.maximum !== undefined) {
        //maximum threshold was specified for blueprint property
        if (blueprintProperty.maximum !== undefined) {
            //verify if property is not within threshold
            if (goalProperty.maximum < blueprintProperty.maximum) {
                //goal property is not fulfilled
                return false
            }
        //no maximum threshold was specified for the blueprint property
        } else {
            //goal property is not fulfilled
            return false
        }
    }
    //a specific value was specified for goal property
    if (goalProperty.value !== undefined) {
        //a specific value was specified for blueprint property
        if (blueprintProperty.value !== undefined) {
            //verify if both values are the same
            if (goalProperty.value !== blueprintProperty.value) {
                //goal property is not fulfilled
                return false
            }
        //no specific value was specified for the blueprint property
        } else {
            //goal property is not fulfilled
            return false
        }
    }
    //all checks were passed, property was fulfilled
    return true;
}

function computeGlobalScore(dataUtilityScore, securityScore, privacyScore) {
    if (securityScore > 0 && privacyScore > 0) {
        return dataUtilityScore;
    } else {
        return 0;
    }
}

