var exports = module.exports = {};
var evaluator = require("./evaluator");

exports.computeGlobalScore = function computeGlobalScore(dataUtilityScore, securityScore, privacyScore) {
    if (securityScore > 0 && privacyScore > 0) {
        return dataUtilityScore;
    } else {
        return 0;
    }
}

exports.computeScore = function computeScore(goalList, node, metrics, generalMetrics) {
    var score = computeNodeScore(goalList, node, metrics, generalMetrics);
    var maxScore = getNodeWeight(goalList, node);
    return score / maxScore;
}

function getNodeWeight(goalList, node) {
    var weight = 0;
    for (var child in node.children) {
        //recursively invoke function for each child node
        weight = weight + getNodeWeight(goalList, node.children[child]);
    }
    for (var leaf in node.leaves) {
        //look for a goal whose name is identical to goalName
        for (var goal in goalList) {
            if (goalList[goal].id === node.leaves[leaf]) {
                if (goalList[goal].weight !== undefined) {
                    weight = weight + goalList[goal].weight;
                } else {
                    weight = weight + 1;
                }
            }
        }
    }
    //return result to parent node
    return weight;
}

function computeNodeScore(goalList, node, metrics, generalMetrics) {
    var score = 0;
    var ret = 0;
    for (var child in node.children) {
        //recursively invoke function for each child node
        ret = computeNodeScore(goalList, node.children[child], metrics, generalMetrics);
        //when current node type is AND, the first child node that is not satisfied makes the current node also not satisfied
        if (ret === 0 && node.type === 'AND') {
            return 0;
        } else {
            score = score + ret;
        }
    }
    for (var leaf in node.leaves) {
        //recursively invoke function for each leaf goal
        ret = evaluator.assessGoal(goalList, node.leaves[leaf], metrics, generalMetrics);
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