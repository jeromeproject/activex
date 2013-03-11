var PLAYER_INDEX = 0;
var player;

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
	
	player.ComPlayback(PLAYER_INDEX, acts[action], 0, 0);
}

function get_filelist(channel)
{
	var list = player.ComGetFileListVariant(PLAYER_INDEX);
	var filename_ary = new Array();
	var s = new Array();
	s = list.split("\n");
	for(var i=0; i<s.length-1; i++)
	{
		var filename = player.ComGetFileName(PLAYER_INDEX, i, 0);
		if(filename.length != 0)
			filename_ary[i] = filename;
	}
	return filename_ary;
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

function set_play_file(event, treeId, treeNode)
{
	var file_index = treeNode.id;
	var ret = player.ComSelectFilevariant(PLAYER_INDEX, file_index, 0);
	if(ret.length == 0)
	{
		alert("Set file error. "+file_index);
	}
	else
	{
		play();
	}
}

function load_filelist(channel)
{
	// load filelist
	var filetree = get_tree("filetree");
	var parent_node = filetree.getNodeByParam("name", "Filelist", null);
	var list = get_filelist(channel);
	var i;
	for(i=0; i<list.length; i++)
	{
		tree_append_to_node(filetree, parent_node, list[i]);
	}
}

function init()
{
	player = document.getElementById('RemotePlayer');
	player.width = 720;
	player.height = 480;
	var channel = get_channel();
	if(channel >= MIN_CHANNEL && channel <= MAX_CHANNEL)
	{
		// load activex
		var address = parent.document.getElementById('address').innerHTML;
		var port = parent.document.getElementById('port').innerHTML;
		var user = parent.document.getElementById('user').innerHTML;
		var passwd = parent.document.getElementById('passwd').innerHTML;
		player.ComSetupConnect(PLAYER_INDEX, address, port, user, passwd, undefined, undefined, undefined, undefined, channel);
		//player.ComOpenPlayer();
		player.ComEmbedPlayer(0);
		//fixme: need sleep a while to get file list
		window.setTimeout("load_filelist("+channel+");", 1000);
	}
	else
	{
		alert("channel out of range " + channel);
	}
}