var exports = module.exports = {};
var evaluator = require("./evaluator");

exports.pruneGoalTree = function pruneGoalTree(goalList, sourceNode, metrics, generalMetrics) {
    console.log("checkNode, node:");
    console.log(sourceNode);
    var ret = 0;
    var targetNode = {};
    targetNode.type = sourceNode.type;
    targetNode.leaves = [];
    targetNode.children = [];

    for (var child in sourceNode.children) {
        //recursively invoke function for each child node
        ret = pruneGoalTree(goalList, sourceNode.children[child], metrics, generalMetrics);
        // if a child node is accepted, then add it to the pruned tree
        if (ret !== undefined) {
            targetNode.children.push(ret);
        } else {
            //when current node type is AND, the first child node that is discarded makes the current node also discarded
            if (sourceNode.type === 'AND') {
                return undefined;
            }
        }
    }
    for (var leaf in sourceNode.leaves) {
        //recursively invoke function for each leaf goal
        ret = evaluator.assessGoal(goalList, sourceNode.leaves[leaf], metrics, generalMetrics);
        // if a leaf goal is accepted, then add it to the pruned tree
        if (ret !== 0) {
            targetNode.leaves.push(sourceNode.leaves[leaf]);
        } else {
            //when current node type is AND, the first leaf goal that is discarded makes the current node also discarded
            if (sourceNode.type === 'AND') {
                return undefined;
            }
        }
    }
    if (targetNode.leaves.length === 0 && targetNode.children.length === 0) {
        //if current node has no child node and no leaf goal accepted, then discard it
        return undefined;
    } else {
        //return result to parent node
        return targetNode;
    }
}
