function update_content(channel)
{
	var iframe = document.getElementById('content');
	iframe.src = "remote_viewer.html?channel="+channel;
	
	var tip = document.getElementById('current_channel');
	tip.innerHTML = "Current channel = " + channel;
}