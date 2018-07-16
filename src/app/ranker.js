var exports = module.exports = {};
var evaluator = require("./evaluator");

exports.computeGlobalScore = function computeGlobalScore(dataUtilityScore, securityScore, privacyScore) {
    if (securityScore > 0 && privacyScore > 0) {
        return dataUtilityScore;
    } else {
        return 0;
    }
}

exports.computeScore = function computeScore(requirements, node, attributes, category) {
    if (node !== undefined) {
        var score = computeNodeScore(requirements, node, attributes, category);
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

function computeNodeScore(requirements, node, attributes, category) {
    var score = 0;
    var ret = 0;
    for (var child in node.children) {
        //recursively invoke function for each child node
        ret = computeNodeScore(requirements, node.children[child], attributes, category);
        //when current node type is AND, the first child node that is not satisfied makes the current node also not satisfied
        if (ret === 0 && node.type === 'AND') {
            return 0;
        } else {
            score = score + ret;
        }
    }
    for (var leaf in node.leaves) {
        //recursively invoke function for each leaf goal
        ret = evaluator.assessGoal(requirements, node.leaves[leaf], attributes, category);
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