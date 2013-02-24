function get_channel()
{
	var str = document.location.search;
	if(str.indexOf("?") >= 0)
	{
		var new_str = str.substring(str.indexOf("?")+1, str.length);
		return new_str.split("=", -1)[1];
	}
}

function init()
{
	var player = document.getElementById('RemotePlayer');
	player.width = 720;
	player.height = 480;
	var channel = get_channel();
	if(channel >= MIN_CHANNEL && channel <= MAX_CHANNEL)
	{
		var address = parent.document.getElementById('address').innerHTML;
		var port = parent.document.getElementById('port').innerHTML;
		var user = parent.document.getElementById('user').innerHTML;
		var passwd = parent.document.getElementById('passwd').innerHTML;
		player.ComSetupConnect(0, address, port, user, passwd, undefined, undefined, undefined, undefined, channel);
		//player.ComOpenPlayer();
		player.ComEmbedPlayer(0);
	}
	else
	{
		alert("channel out of range " + channel);
	}
}