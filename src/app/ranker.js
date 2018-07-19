var exports = module.exports = {};
var evaluator = require("./evaluator");

exports.computeOptimumDU = function computeOptimumDU(dataUtilityRequirements, blueprints) {
    var optimum = {};
    // determine best value for each requirement
    for (var requirement in dataUtilityRequirements) {
        //look for blueprints
        for (var listitem in blueprints) {
            var blueprint = blueprints[listitem].blueprint;
            var methodNames = blueprints[listitem].methodNames;
            var methods = blueprint.DATA_MANAGEMENT;
            //look for blueprint methods
            for (var methodName in methodNames) {
                for (var method in methods) {
                    //same method as the one selected
                    if (methods[method].method_id === methodNames[methodName]) {
                        var attributes = methods[method].attributes.dataUtility;
                        //look for attributes compatible with current requirement
                        for (var attribute in attributes) {
                            //determine best attribute
                            if (attributes[attribute].type === dataUtilityRequirements[requirement].type) {
                                optimum[dataUtilityRequirements[requirement].id] = evaluator.compareDUAttributes(dataUtilityRequirements[requirement], attributes[attribute], optimum[dataUtilityRequirements[requirement].id]);
                            }
                        }
                    }
                }
            }
        }
    }
    return optimum;
}

exports.computeGlobalScore = function computeGlobalScore(dataUtilityScore, securityScore, privacyScore) {
    if (securityScore > 0 && privacyScore > 0) {
        return dataUtilityScore;
    } else {
        return 0;
    }
}

exports.computeScore = function computeScore(requirements, node, attributes, optimum) {
    if (node !== undefined) {
        var score = computeNodeScore(requirements, node, attributes, optimum);
        var maxScore = getNodeWeight(node);
        return score / maxScore;
    } else {
        return 1;
    }
}

function getNodeWeight(node) {
    var weight = 0;
    for (var child in node.children) {
        //recursively invoke function for each child node
        weight = weight + getNodeWeight(node.children[child]);
    }
    for (var leaf in node.leaves) {
        if (node.leaves[leaf].weight !== undefined) {
            weight = weight + node.leaves[leaf].weight;
        } else {
            weight = weight + 1;
        }
    }
    //return result to parent node
    return weight;
}

function computeNodeScore(requirements, node, attributes, optimum) {
    var score = 0;
    var ret = 0;
    for (var child in node.children) {
        //recursively invoke function for each child node
        ret = computeNodeScore(requirements, node.children[child], attributes, optimum);
        //when current node type is AND, the first child node that is not satisfied makes the current node also not satisfied
        if (ret === 0 && node.type === 'AND') {
            return 0;
        } else {
            score = score + ret;
        }
    }
    for (var leaf in node.leaves) {
        //recursively invoke function for each leaf goal
        ret = evaluator.assessGoal(requirements, node.leaves[leaf], attributes, optimum);
        console.log("evaluator says " + ret);
        //when current node type is AND, the first leaf goal that is not satisfied makes the current node also not satisfied
        if (ret === 0 && node.type === 'AND') {
            return 0;
        } else {
            score = score + ret;
        }
    }
    //return result to parent node
    return score;
}