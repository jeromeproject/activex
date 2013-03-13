var g_PLAYER_INDEX = 0;
var g_player;
var g_filetree;
var g_parent_node;
var g_filename_list;

function pause()
{
	set_player_action("RPP_Pause_PI");
}

function play()
{
	set_player_action("RPP_Play_PI");
}

function playback()
{
	set_player_action("RPP_PlayBackward_PI");
}

function seekback()
{
	set_player_action("RPP_SeekBackward_PI");
}

function seekforward()
{
	set_player_action("RPP_SeekForward_PI");
}

function prevframe()
{
	set_player_action("RPP_PrevFrame_PI");
}

function nextframe()
{
	set_player_action("RPP_NextFrame_PI");
}

function seekbegin()
{
	set_player_action("RPP_SeekBegin_PI");
}

function seekend()
{
	set_player_action("RPP_SeekEnd_PI");
}

function set_player_action(action)
{
	// mapping to RPP_Command
	var acts = new Object();
	acts['RPP_Pause_PI'] = 12;
	acts['RPP_PlayBackward_PI'] = 13;
	acts['RPP_Play_PI'] = 14;
	acts['RPP_SeekBackward_PI'] = 15;
	acts['RPP_SeekForward_PI'] = 16;
	acts['RPP_PrevFrame_PI'] = 17;
	acts['RPP_NextFrame_PI'] = 18;
	acts['RPP_SeekBegin_PI'] = 19;
	acts['RPP_SeekEnd_PI'] = 20;
	// end mapping
	
	g_player.ComPlayback(g_PLAYER_INDEX, acts[action], 0, 0);
}

function set_play_file(event, treeId, treeNode)
{
	var file_index = treeNode.id;
	var ret = g_player.ComSelectFilevariant(g_PLAYER_INDEX, file_index, 0);
	if(ret.length == 0)
	{
		alert("Set file error. "+file_index);
	}
	else
	{
		play();
	}
}

function get_channel()
{
	var str = document.location.search;
	if(str.indexOf("?") >= 0)
	{
		var new_str = str.substring(str.indexOf("?")+1, str.length);
		return new_str.split("=", -1)[1];
	}
}

function set_page_index(index)
{
	var pidx = document.getElementById('page_index');
	// page start with 1
	pidx.value = parseInt(index+1, 10);
}

function page_load_first()
{
	page_load_index(0);
}

function page_load_prev()
{
	page_load_index(g_parent_node.page_index-1);
}

function page_load_next()
{
	page_load_index(g_parent_node.page_index+1);
}

function page_load_last()
{
	page_load_index( parseInt(g_parent_node.child_num/g_parent_node.page_size, 10) );
}

function page_load_index(index)
{
	// check index is in the range
	if(index < 0 || index == parseInt(g_parent_node.child_num/g_parent_node.page_size+1, 10))
	{
		alert("No more page");
		return;
	}
	
	if(index == g_parent_node.page_index)
	{
		alert("Same page");
		return;
	}

	// remove all childs
	tree_destroy_from_node(g_filetree, g_parent_node);
	
	var start = index * g_parent_node.page_size;
	var end = start + g_parent_node.page_size - 1;
	
	// childs num < page size
	if(end > g_parent_node.child_num)
		end = g_parent_node.child_num;
	
	var i;
	for(i=start; i<end; i++)
	{
		tree_append_to_node(g_filetree, g_parent_node, g_filename_list[i]);
	}
	
	// update and show new index
	g_parent_node.page_index = index;
	set_page_index(g_parent_node.page_index);
}

// for test
function big_array()
{
	for(var i =0; i<2000; i++)
	{
		g_filename_list[i] = i;
	}
}

function get_filelist()
{
	var list = g_player.ComGetFileListVariant(g_PLAYER_INDEX);
	var s = new Array();
	s = list.split("\n");
	for(var i=0; i<s.length-1; i++)
	{
		var filename = g_player.ComGetFileName(g_PLAYER_INDEX, i, 0);
		if(filename.length != 0)
			g_filename_list[i] = filename;
	}
	
	big_array();
	g_parent_node.child_num = g_filename_list.length;
	page_load_index(0);
}

function load_filelist(channel)
{
	var list = get_filelist(channel);
		
	var i;
	for(i=ary_index; i<list.length; i++)
	{
		if(i % g_parent_node.page_size == 0 && i != 0)
		{
			ary_index = i;
 			break;
		}
			
		tree_append_to_node(g_filetree, g_parent_node, list[i]);
	}
}

function init()
{
	g_filetree = get_tree("filetree");
	g_parent_node = g_filetree.getNodeByParam("name", "Filelist", null);
	g_filename_list = new Array();
	g_player = document.getElementById('RemotePlayer');
	g_player.width = 720;
	g_player.height = 480;
	var channel = get_channel();
	if(channel >= MIN_CHANNEL && channel <= MAX_CHANNEL)
	{
		// load activex
		var address = parent.document.getElementById('address').innerHTML;
		var port = parent.document.getElementById('port').innerHTML;
		var user = parent.document.getElementById('user').innerHTML;
		var passwd = parent.document.getElementById('passwd').innerHTML;
		g_player.ComSetupConnect(g_PLAYER_INDEX, address, port, user, passwd, undefined, undefined, undefined, undefined, channel);
		//g_player.ComOpenPlayer();
		g_player.ComEmbedPlayer(0);
		//fixme: need sleep a while to get file list
		//window.setTimeout("load_filelist("+channel+");", 1000);
		window.setTimeout("get_filelist();", 1000);
	}
	else
	{
		alert("channel out of range " + channel);
	}
}