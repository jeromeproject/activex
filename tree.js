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

function tree_append_to_node(tree, parent_node, child_name)
{
	var child_node = {name:child_name};
	node = tree.addNodes(parent_node, child_node);
}

function tree_destroy_from_node(tree, node)
{
	tree.removeChildNodes(node);
}

function tree_update_node(event, treeId, treeNode)
{
	var tree = get_tree(treeId);
	var cur_node = tree.getNodeByTId(treeNode.tId);
	if(cur_node.isParent && cur_node.getParentNode())
	{
		if(cur_node.open)
		{
			var list = get_filelist(0);
			var i;
			for(i=0; i<list.length; i++)
			{
				tree_append_to_node(tree, cur_node, list[i]);
			}
		}
		else
		{
			tree_destroy_from_node(tree, cur_node);
		}
	}
	else
	{
		// leaf node no need to update
	}
}