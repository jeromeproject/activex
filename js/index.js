function update_content(src)
{
	var iframe = document.getElementById('content');
	iframe.src = src;
}

function set_liveview(channel)
{
	src = "remote_viewer.html?channel="+channel;
	update_content(src);
}

function set_playback(channel)
{
	src = "remote_player.html?channel="+channel;
	update_content(src);
}

function init()
{
}