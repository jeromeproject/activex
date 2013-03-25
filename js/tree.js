function get_tree_from_parent(tree_name)
{
	return parent.$.fn.zTree.getZTreeObj(tree_name);
}

function get_tree(tree_name)
{
	return $.fn.zTree.getZTreeObj(tree_name);
}

function get_top_node(node)
{
	while(typeof node.is_top == "undefined")
	{
		node = node.getParentNode();
	}
	return node;
}

function get_server_info_with_select(tree)
{
	var node = tree.getSelectedNodes()[0];
	node = get_top_node(node);
	//while(typeof node.is_top == "undefined")
	//{
		//node = node.getParentNode();
	//}
	var info = new Array();
	info[0] = node.address;
	info[1] = node.port;
	info[2] = node.username;
	info[3] = node.passwd;
	return info;
}

function show_node_information(event, treeid, node)
{
	var top_node = get_top_node(node);
	document.getElementById('new_address').value = top_node.address;
	document.getElementById('new_port').value = top_node.port;
	document.getElementById('new_user').value = top_node.username;
	document.getElementById('new_passwd').value = top_node.passwd;
	document.getElementById('add').innerHTML = "Update";
	document.getElementById('add').onClick = "alert('abc')";
	document.getElementById('cancel').style.display = "block";
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

