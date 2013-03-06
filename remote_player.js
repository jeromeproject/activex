var player_index = 0;
var player;
function get_filelist(channel)
{
	var list = player.ComGetFileListVariant(player_index);
	//alert(list);
	return [ "fileA", "fileB", "fileC" ];
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

function pause()
{
	set_player_action(RPP_Pause_PI);
}

function play()
{
	set_player_action(RPP_Play_PI);
}

function set_player_action(action)
{
	player.ComPlayback(player_index, action, 0, 0);
}

function set_play_file(event, treeId, treeNode)
{
	var file_index = 0;
	var ret = player.ComSelectFilevariant(player_index, file_index, 0);
	if(ret.length == 0)
	{
		alert("Set file error.");
	}
	else
	{
		play();
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
		player.ComSetupConnect(player_index, address, port, user, passwd, undefined, undefined, undefined, undefined, channel);
		//player.ComOpenPlayer();
		player.ComEmbedPlayer(player_index);
		
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
	else
	{
		alert("channel out of range " + channel);
	}
}