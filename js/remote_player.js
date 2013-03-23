var g_PLAYER_INDEX = 0;
var g_player;
var g_filetree;
var g_parent_node;
var g_filename_list;

// player functions
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
	
	var speed = parseFloat(document.getElementById('speed').value);
	g_player.ComPlayback(g_PLAYER_INDEX, acts[action], speed, 0);
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
// end player functions

// page functions
function set_page_index(index)
{
	var pidx = document.getElementById('page_index');
	// page start with 1
	pidx.value = parseInt(index+1, 10);
	var max_page = g_parent_node.last_page+1;
	pidx.value += '/'+max_page;
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
	page_load_index(g_parent_node.last_page);
}

function page_load_index(index)
{
	// check index is in the range
	if(index == g_parent_node.page_index)
	{
		alert("Same page");
		return;
	}

	if(index < 0 || index > g_parent_node.last_page)
	{
		alert("No more page");
		return;
	}

	// remove all childs
	tree_destroy_from_node(g_filetree, g_parent_node);
	
	var start = index * g_parent_node.page_size;
	var end = start + g_parent_node.page_size - 1;
	
	// childs num < page size
	if(end >= g_parent_node.child_num)
		end = g_parent_node.child_num-1;
	
	var i;
	for(i=start; i<=end; i++)
	{
		tree_append_to_node(g_filetree, g_parent_node, g_filename_list[i]);
	}
	
	// update and show new index
	g_parent_node.page_index = index;
	set_page_index(g_parent_node.page_index);
}
// end page functions

function get_channel()
{
	var str = document.location.search;
	if(str.indexOf("?") >= 0)
	{
		var new_str = str.substring(str.indexOf("?")+1, str.length);
		return new_str.split("=", -1)[1];
	}
}

// for test
function big_array()
{
	for(var i =0; i<100; i++)
	{
		g_filename_list[i] = i;
	}
}

function get_filelist()
{
	var net_status = g_player.ComGetPlayerNetStatus(g_PLAYER_INDEX);
	if(net_status != 3)
		return;
	
	window.clearInterval(intervalID);
	
	// initial
	g_parent_node.page_index = -1;
	g_parent_node.last_page = -1;
	g_parent_node.child_num = 0;
	g_filename_list = [];
	
	var list = g_player.ComGetFileListVariant(g_PLAYER_INDEX);
	var s = new Array();
	s = list.split("\n");
	for(var i=0; i<s.length-1; i++)
	{
		var filename = g_player.ComGetFileName(g_PLAYER_INDEX, i, 0);
		if(filename.length != 0)
		{
			var tmp = filename.split('\\');
			g_filename_list[i] = tmp[tmp.length-1];
		}
	}
	
	//big_array();
	g_parent_node.child_num = g_filename_list.length;
	g_parent_node.last_page = parseInt(g_parent_node.child_num/g_parent_node.page_size, 10);
	page_load_index(0);
}

function check_filter_rule(id)
{
	var s_obj = document.getElementById('start_date');
	var s = s_obj.value.split("/");
	var s_t = s[0]*10000+s[1]*100+s[2];

	var e_obj = document.getElementById('end_date');
	var e = e_obj.value.split("/");
	var e_t = e[0]*10000+e[1]*100+e[2];

	if(id == s_obj.name)
	{
		if(s_t > e_t)
			e_obj.value = s_obj.value;
	}
	else if(id == e_obj.name)
	{
		if(e_t < s_t)
			s_obj.value = e_obj.value;
	}
}

function apply_filter()
{
	// format: yyyy/mm/dd
	var s = document.getElementById('start_date').value.split("/");
	var e = document.getElementById('end_date').value.split("/");
	set_filter(s[0], s[1], s[2], e[0], e[1], e[2]);
	tree_destroy_from_node(g_filetree, g_parent_node);
	g_player.ComReconnectAllPlayer(g_PLAYER_INDEX);
	get_filelist();
}

function set_filter(s_year, s_month, s_day, e_year, e_month, e_day)
{
	g_player.ComSetupFilter(g_PLAYER_INDEX, s_year, s_month, s_day, 0, 0, 0, e_year, e_month, e_day, 23, 59, 59);
}

function set_filter_today()
{
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth()+1;
	var day = today.getDate();
	set_filter(year, month, day, year, month, day);
	
	document.getElementById('start_date').value = year+"/"+month+"/"+day;
	document.getElementById('end_date').value = year+"/"+month+"/"+day;
}

var intervalID;
function init()
{
	g_filetree = get_tree("filetree");
	g_parent_node = g_filetree.getNodeByParam("name", "Filelist", null);
	g_player = document.getElementById('RemotePlayer');
	try
	{
		g_player.ComGetPlayerNetStatus(g_PLAYER_INDEX);
	}
	catch(e)
	{
		init_active_fail();
	}
	var channel = get_channel();
	if(channel >= MIN_CHANNEL && channel <= MAX_CHANNEL)
	{
		set_filter_today();
		var address = parent.document.getElementById('address').innerHTML;
		var port = parent.document.getElementById('port').innerHTML;
		var user = parent.document.getElementById('user').innerHTML;
		var passwd = parent.document.getElementById('passwd').innerHTML;
		g_player.ComSetupConnect(g_PLAYER_INDEX, address, port, user, passwd, undefined, undefined, undefined, undefined, channel);
		g_player.ComEmbedPlayer(0);
		intervalID = window.setInterval("get_filelist()", 500);
	}
	else
	{
		alert("channel out of range " + channel);
	}
}

function destroy()
{
	try
	{
		g_player.ComClosePlayer();
	}
	catch(e)
	{
		//init_active_fail();
	}
}
