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
var dur_module_url = config.DUREndpoint; //"http://31.171.247.162:50008/filter";

function invokeDUR(goalRequirement, blueprintAttribute) {

    var args = {
        requirement: goalRequirement,
        blueprintAttributes: [blueprintAttribute]
    };

    var res = request('POST', pse_module_url, {
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

exports.rebalanceGoalTree = function rebalanceGoalTree(requirements) {
    //TODO ripesatura goal tree + invocazione webservice DUR per calcolo pesi

    if (requirements.applicationType in dqApplications) {

    }

    return requirements;
}

exports.computePDU = function computePDU(requirements, blueprint) {
    //TODO invocazione webservice DUE per calcolo data utility (Paci - Cappiello) (localhost:50000)
    var tables = requirements.functionalRequirements.schema
    return blueprint;
}

function checkColumn(methodName, dsName, tableName, blueprint) {

}