function get_tree(tree_name)
{
	return $.fn.zTree.getZTreeObj(tree_name);
}

function tree_disable_collapse()
{
	return false;
}

function tree_disable_expand()
{
	return false;
}

function tree_get_current_node(tree)
{
	return tree.getSelectedNodes()[0];
}

var child_id = 0;
function tree_append_to_node(tree, parent_node, child_name)
{
	var child_node = {name:child_name, id:child_id++};
	node = tree.addNodes(parent_node, child_node);
}

function tree_destroy_from_node(tree, node)
{
	child_id = 0;
	tree.removeChildNodes(node);
}