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

var exports = module.exports = {};

var evaluatorV1 = require("./evaluator");
var evaluatorV2 = require("./evaluatorV2");

const API_V1 = 1;
const API_V2 = 2;

exports.API_V1 = API_V1;
exports.API_V2 = API_V2;

var evaluator = evaluatorV1;

exports.setApiLevel = function setApiLevel(level) {
    if (level == API_V2) {
        evaluator = evaluatorV2;
    } else {
        evaluator = evaluatorV1;
    }
}

exports.getApiLevel = function getApiLevel() {
    if (evaluator == evaluatorV1) {
        return API_V1;
    } else if (evaluator == evaluatorV2) {
        return API_V2;
    } else {
        return undefined;
    }
}

exports.pruneGoalTree = function pruneGoalTree(constraints, sourceNode, attributes, optimum) {
    var ret = 0;
    var targetNode = {};
    var leaves = [];
    var children = [];
    if (sourceNode === undefined) {
        return targetNode;
    }
    targetNode.type = sourceNode.type;
    for (var child in sourceNode.children) {
        //recursively invoke function for each child node
        ret = pruneGoalTree(constraints, sourceNode.children[child], attributes, optimum);
        // if a child node is accepted, then add it to the pruned tree
        if (ret !== undefined) {
            if (ret.leaves === undefined) {
                //returned node is a leaf goal
                leaves.push(ret);
            } else {
                children.push(ret);
            }
        } else {
            //when current node type is AND, the first child node that is discarded makes the current node also discarded
            if (sourceNode.type === 'AND') {
                return undefined;
            }
        }
    }
    for (var leaf in sourceNode.leaves) {
        //recursively invoke function for each leaf goal
        ret = evaluator.assessGoal(constraints, sourceNode.leaves[leaf], attributes, optimum);
        // if a leaf goal is accepted, then add it to the pruned tree
        if (ret !== 0) {
            leaves.push(sourceNode.leaves[leaf]);
        } else {
            //when current node type is AND, the first leaf goal that is discarded makes the current node also discarded
            if (sourceNode.type === 'AND') {
                return undefined;
            }
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
