function update_content(src)
{
	var iframe = document.getElementById('content');
	iframe.src = src;
}

function set_liveview(type, channel)
{
	src = "remote_viewer.html?type="+type+"&channel="+channel;
	update_content(src);
}

function set_playback(channel)
{
	src = "remote_player.html?channel="+channel;
	update_content(src);
}

function get_server_info()
{
	var address = document.getElementById('address').innerHTML;
	var port = document.getElementById('port').innerHTML;
	var user = document.getElementById('user').innerHTML;
	var passwd = document.getElementById('passwd').innerHTML;
	var ret = viewer.SaGetRemoteStationInfo(address+":"+port, user, passwd);
	if(ret.length > 0)
		document.getElementById('server_st').innerHTML = "1";
	else
		document.getElementById('server_st').innerHTML = "0";
}

function init()
{
	window.setInterval("get_server_info()", 5000);
}