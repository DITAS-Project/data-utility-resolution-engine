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
const dqMetrics = ["accuracy", "completeness", "consistency", "timeliness"];
const dqApplications = ["regression", "classification", "clustering", "associationrules"];
var exports = module.exports = {};

var config = require('./config.json');
var request = require('sync-request');
var dur_module_url = config.DUREndpoint;
var due_module_url = config.DUEEndpoint;

function invokeDUR(requestBody) {

	
    var res = request('POST', dur_module_url, {
        json: requestBody
    });

    var body = JSON.parse(res.body);
    console.log("body is " + res.body)
    console.log("data are " + body);
    console.log("length is " + body.length)

	console.log(body.completeness)
	return body;

} 

function invokeDUE(blueprint) {

    var args = {
        blueprint: blueprint
    };

    var res = request('POST', due_module_url, {
        json: args
    });

    var body = JSON.parse(res.body);
    console.log("body is " + res.body)
    console.log("data are " + body);
    console.log("length is " + body.length)

    return body;
}

function replaceWeight(node,attributes,weights){
	//recursively invoke method for child goals
	var targetNode = {};
    var leaves = [];
    var children = [];
	targetNode.type = node.type;
    for (var child in node.children) {
		ret = replaceWeight(node.children[child],attributes,weights);
		if (ret !== undefined) {
            if (ret.leaves === undefined) {
                //returned node is a leaf goal
                leaves.push(ret);
            } else {
                children.push(ret);
            }
        }
	}
	//check if leaf goals predicate on DQ metrics:
	var newLeaves = [];
	for (var leaf in node.leaves) {
		//find attribute corresponding to the one defined in leaf goal
		for (var goalAttribute in node.leaves[leaf].attributes){
			for (var attribute in attributes) {
				if (node.leaves[leaf].attributes[goalAttribute] == attributes[attribute].id) {
					//check if attribute contains DQ properties whose weight has to be changed
					if(weights !== undefined){
						for (var weight in weights) {
							if(attributes[attribute].properties[weight] != undefined){
								//property weight has to be changed
								node.leaves[leaf].weight = weights[weight];
							}
						}
					}
				}
			}
		}
		if (node.leaves[leaf].weight > 0 || node.leaves[leaf].weight == undefined) {
			leaves.push(node.leaves[leaf]);	
		}
	}
	
	if (leaves.length === 0 && children.length === 0) {
        //if current node has no child node and no leaf goal accepted, then discard it
        return undefined;
    } else if (leaves.length === 0 && children.length === 1) {
        return children[0];
    } else if (leaves.length === 1 && children.length === 0) {
        return leaves[0];
    } else {

        if (children.length > 0) {
            targetNode.children = children;
        }
        if (leaves.length > 0) {
            targetNode.leaves = leaves;
        }
        //return result to parent node
        return targetNode;
    }
}

exports.rebalanceGoalTree = function rebalanceGoalTree(requirements) {
    
	var weights = {};
	
	var requestBody = { "application": requirements.applicationType,
		"datautility": {}
	}
	
	for (var prop in dqMetrics) {
		requestBody.datautility[dqMetrics[prop]] = 0;
	}
	
    if (dqApplications.includes(requirements.applicationType)) {
		dureqs = requirements.attributes.dataUtility;
		for (var req in dureqs) {
			for (var prop in dqMetrics) {
				if (dureqs[req].properties[dqMetrics[prop]] != undefined) {
					requestBody.datautility[dqMetrics[prop]] = 1;
				}
			}
		}    
		console.log(requestBody);
		console.log(JSON.stringify(requirements.goalTrees.dataUtility));
	
		weights = invokeDUR(requestBody);
	
	}
	requirements.goalTrees.dataUtility = replaceWeight(requirements.goalTrees.dataUtility,requirements.attributes.dataUtility,weights);
	
	console.log(JSON.stringify(requirements.goalTrees.dataUtility));

    return requirements;
}

exports.computeInputPDU = function computeInputPDU(requirements, blueprint, methodNames) {
    var bpMethods = blueprint.INTERNAL_STRUCTURE.Methods_Input.Methods;
    var reqMethods = requirements.Methods_Input.Methods;
    var noMatch = true;
    for (var methodName in methodNames) {
        for (var bpMethod in bpMethods) {
            if (bpMethods[bpMethod].method_id === methodNames[methodName]) {
                for (var reqMethod in reqMethods) {
                    if (reqMethods[reqMethod].method_id === methodNames[methodName]) { //same method for both requirement and blueprint
                        for (var reqDS in reqMethods[reqMethod].dataSources) {
                            for (var bpDS in bpMethods[bpMethod].dataSources) {
                                if (bpMethods[bpMethod].dataSources[bpDS].dataSource_id === reqMethods[reqMethod].dataSources[reqDS].dataSource_id) { //same datasource for both requirement and blueprint
                                    for (var reqDB in reqMethods[reqMethod].dataSources[reqDS].database) {
                                        for (var bpDB in bpMethods[bpMethod].dataSources[bpDS].database) {
                                            if (bpMethods[bpMethod].dataSources[bpDS].database[bpDB].database_id === reqMethods[reqMethod].dataSources[reqDS].database[reqDB].database_id) { //same database for both requirement and blueprint
                                                for (var reqTable in reqMethods[reqMethod].dataSources[reqDS].database[reqDB].tables) {
                                                    for (var bpTable in bpMethods[bpMethod].dataSources[bpDS].database[bpDB].tables) {
                                                        if (bpMethods[bpMethod].dataSources[bpDS].database[bpDB].tables[bpTable].table_id === reqMethods[reqMethod].dataSources[reqDS].database[reqDB].tables[reqTable].table_id) { //same table for both requirement and blueprint
                                                            for (var reqColumn in reqMethods[reqMethod].dataSources[reqDS].database[reqDB].tables[reqTable].columns) {
                                                                for (var bpColumn in bpMethods[bpMethod].dataSources[bpDS].database[bpDB].tables[bpTable].columns) {
                                                                    if (bpMethods[bpMethod].dataSources[bpDS].database[bpDB].tables[bpTable].columns[bpColumn].column_id === reqMethods[reqMethod].dataSources[reqDS].database[reqDB].tables[reqTable].columns[reqColumn].column_id) { //same column for both requirement and blueprint
                                                                        bpMethods[bpMethod].dataSources[bpDS].database[bpDB].tables[bpTable].columns[bpColumn].computeDataUtility = true;
                                                                        noMatch = false;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    if (!noMatch) { //no column is required
        //invoke DUE webservice
        return invokeDUE(blueprint);
    }
    return blueprint;
}

exports.computeOutputPDU = function computeOutputPDU(requirements, blueprint) {
    var bpMethods = blueprint.INTERNAL_STRUCTURE.Testing_Output_Data;
    var reqMethods = requirements.methodsOutput.methods;
    var changed = false;
	console.log("******");
    console.log("output PDU invoked");
	console.log(bpMethods);
	
	for (var methodName in reqMethods) {
		console.log("analyzing " + methodName);
        for (var bpMethod in bpMethods) {
			console.log("analyzing " + bpMethod);
            if (bpMethods[bpMethod].method_id === reqMethods[methodName].method_id) { //requested method exists in blueprint
                console.log("found match");
				blueprint.INTERNAL_STRUCTURE.Testing_Output_Data[bpMethod].attributes = reqMethods[methodName].attributes;
                changed = true;
            }
        }
    }
    if (changed) { //only some output attributes are required
        //invoke DUE webservice
		//*** uncomment the following line once the DUE has been deployed ***
        //return invokeDUE(blueprint);
    }
    return blueprint;
}

function checkColumn(methodName, dsName, tableName, blueprint) {

}