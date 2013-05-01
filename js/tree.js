function get_tree_from_parent(tree_name)
{
	return parent.$.fn.zTree.getZTreeObj(tree_name);
}

function get_tree(tree_name)
{
	return $.fn.zTree.getZTreeObj(tree_name);
}

function tree_get_dvr_node(node)
{
	while(typeof node.is_dvr == "undefined")
	{
		node = node.getParentNode();
	}
	return node;
}

function tree_get_group_node(node)
{
	while(typeof node.is_group == "undefined")
	{
		node = node.getParentNode();
	}
	return node;
}

function get_server_info_with_select(tree)
{
	var node = tree_get_current_node(tree);
	node = tree_get_dvr_node(node);
	return node;
	// var info = new Array();
	// info[0] = node.address;
	// info[1] = node.port;
	// info[2] = node.username;
	// info[3] = node.passwd;
	// info[4] = node.map;
	// return info;
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

// for file list
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

