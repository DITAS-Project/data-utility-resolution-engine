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
var dur_module_url = config.DUREndpoint;
var due_module_url = config.DUEEndpoint;

function invokeDUR(goalRequirement, blueprintAttribute) {

    var args = {
        requirement: goalRequirement,
        blueprintAttributes: [blueprintAttribute]
    };

    var res = request('POST', dur_module_url, {
        json: args
    });

    var body = JSON.parse(res.body);
    console.log("body is " + res.body)
    console.log("data are " + body);
    console.log("length is " + body.length)

    if (body.length > 0) {
        return 1;
    } else {
        return 0;
    }

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

exports.rebalanceGoalTree = function rebalanceGoalTree(requirements) {
    //TODO ripesatura goal tree + invocazione webservice DUR per calcolo pesi

    if (requirements.applicationType in dqApplications) {
        //
    }

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
    var reqMethods = requirements.methodsOutput.Methods;
    var changed = false;
    for (var methodName in reqMethods) {
        for (var bpMethod in bpMethods) {
            if (bpMethods[bpMethod].method_id === reqMethods[methodName].method_id) { //requested method exists in blueprint
                bpMethods[bpMethod].attributes = reqMethods[methodName].attributes;
                changed = true;
            }
        }
    }
    if (changed) { //only some output attributes are required
        //invoke DUE webservice
        return invokeDUE(blueprint);
    }
    return blueprint;
}

function checkColumn(methodName, dsName, tableName, blueprint) {

}