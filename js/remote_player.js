var g_PLAYER_INDEX = 0;
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
	var speed = parseFloat(document.getElementById('speed_value').value);
	// alert(speed);
	RemotePlayer.ComPlayback(g_PLAYER_INDEX, acts[action], speed, 0);
}

function set_play_file(event, treeId, treeNode)
{
	var file_index = treeNode.id;
	var ret = RemotePlayer.ComSelectFilevariant(g_PLAYER_INDEX, file_index, 0);
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
	var net_status = RemotePlayer.ComGetPlayerNetStatus(g_PLAYER_INDEX);
	// wait connection is ready or retry
	if(net_status != 3)
		return;

	window.clearInterval(intervalID);
	
	// initial
	g_parent_node.page_index = -1;
	g_parent_node.last_page = -1;
	g_parent_node.child_num = 0;
	g_filename_list = [];
	
	var list = RemotePlayer.ComGetFileListVariant(g_PLAYER_INDEX);
	// alert(list);
	var s = new Array();
	s = list.split("\n");
	for(var i=0; i<s.length-1; i++)
	{
		var filename = RemotePlayer.ComGetFileName(g_PLAYER_INDEX, i, 0);
		if(filename.length != 0)
		{
			// filename : C:\\xxxx\xxxx\ch_0000_2011010...
			var tmp = filename.split('\\');
			var filename_string = tmp[tmp.length-1].split('_');
			// let filelist format like YYYYMMDD_hhmmss
			g_filename_list[i] = filename_string[2] + "_" + filename_string[3];
		}
	}
	
	//big_array();
	// push child number and how many pages we need.
	g_parent_node.child_num = g_filename_list.length;
	g_parent_node.last_page = parseInt(g_parent_node.child_num/g_parent_node.page_size, 10);
	page_load_index(0);
}

function check_filter_rule(id)
{
	// auto swap date if out of bound
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
	// alert(document.getElementById('start_date'));
	var s = document.getElementById('start_date').value.split("/");
	var e = document.getElementById('end_date').value.split("/");
	set_filter(s[0], s[1], s[2], e[0], e[1], e[2]);
	tree_destroy_from_node(g_filetree, g_parent_node);
	RemotePlayer.ComReconnectAllPlayer(g_PLAYER_INDEX);
	get_filelist();
}

function set_filter(s_year, s_month, s_day, e_year, e_month, e_day)
{
	RemotePlayer.ComSetupFilter(g_PLAYER_INDEX, s_year, s_month, s_day, 0, 0, 0, e_year, e_month, e_day, 23, 59, 59);
}

function set_filter_today()
{
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth()+1;
	var day = today.getDate();
	set_filter(year, month, day, year, month, day);
	
	if(parseInt(month) < 10)
		month = "0"+month;

	if(parseInt(day) < 10)
		day = "0"+day;

	document.getElementById('start_date').value = year+"/"+month+"/"+day;
	document.getElementById('end_date').value = year+"/"+month+"/"+day;
}

var PIC_Command = new Object();
PIC_Command["PIC_MP_Reload"] = 0;
PIC_Command["PIC_MP_Snapshot"] = 1;
PIC_Command["PIC_MP_Save"] = 2;
PIC_Command["PIC_MP_Delete"] = 3;

function del_file()
{
	RemotePlayer.ComExecuteIntegratedCommand(PIC_Command["PIC_MP_Delete"], 0);
	//RemotePlayer.ComExecuteIntegratedCommand(PIC_Command["PIC_MP_Reload"], 0);
	
	// reinit filetree
	tree_destroy_from_node(g_filetree, g_parent_node);
	RemotePlayer.ComReconnectAllPlayer(g_PLAYER_INDEX);
	get_filelist();
}

function download_file()
{
	RemotePlayer.ComExecuteIntegratedCommand(PIC_Command["PIC_MP_Save"], 0);
}

var intervalID;
function init()
{
	g_filetree = get_tree("filetree");
	g_parent_node = g_filetree.getNodeByParam("name", "Filelist", null);
	try
	{
		RemotePlayer.ComGetPlayerNetStatus(g_PLAYER_INDEX);
	}
	catch(e)
	{
		init_active_fail();
		return;
	}

	var channel = get_channel();
	if(channel >= MIN_CHANNEL && channel <= MAX_CHANNEL)
	{
		set_filter_today();	
		var tree = get_tree_from_parent("maintree");
		var info = get_server_info_with_select(tree);
		var address = info.address;
		var port = info.port;
		var user = info.username;
		var passwd = info.passwd;
		var map = info.map;	//g_max_channel
		RemotePlayer.ComSetupConnect(g_PLAYER_INDEX, address, port, user, passwd, undefined, undefined, undefined, undefined, map[channel]);
		RemotePlayer.ComEmbedPlayer(0);
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
		RemotePlayer.ComClosePlayer();
	}
	catch(e)
	{
		//init_active_fail();
	}
}

//
var PIC_MP_Reload=0;    // 重新載入檔案列表
var PIC_MP_Snapshot=1;    // 將目前播放中的動態影片目前單張影像，儲存成檔案（會呼叫Snapshotter.exe）
var PIC_MP_Save=2;    // 開啟"儲存至"對話盒
var PIC_MP_Delete=3;    // 刪除目前播放中的檔案，並且會出現確認對話盒

function pb_delete()
{
	RemotePlayer.ComExecuteIntegratedCommand(PIC_MP_Delete, 0);
}

function pb_download()
{
	RemotePlayer.ComExecuteIntegratedCommand(PIC_MP_Save, 2);
}
