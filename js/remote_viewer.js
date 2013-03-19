function get_channel()
{
	var str = document.location.search;
	if(str.indexOf("?") >= 0)
	{
		var new_str = str.substring(str.indexOf("?")+1, str.length);
		return new_str.split("=", -1)[1];
	}
}

function get_param(ip, port, username, password, channel)
{
	var param = "";
	//param += "View0_is_local=0\n"
	//param += "View0_enable_event_sound=0\n"
	param += "View0_Address="+ip+"\n"
	param += "View0_view_port_n="+port+"\n"
	param += "View0_lookup_from_ns=0\n"
	param += "View0_user_name="+username+"\n"
	param += "View0_password="+password+"\n"
	param += "View0_target_type=0\n"
	param += "View0_Channel="+channel+"\n"
	param += "View0_DataFormat=1\n"
	param += "View0_frame_rate=500\n"
	param += "View0_v_option=0\n"
	param += "View0_audio_buffer_time=0\n"
	param += "View0_auto_reconnect=0\n"
	return param;
}

function init()
{	
	var viewer = document.getElementById('RemoteViewer');
	viewer.width = 720;
	viewer.height = 480;
	var channel = get_channel();
	if(channel >= MIN_CHANNEL && channel <= MAX_CHANNEL)
	{
		var address = parent.document.getElementById('address').innerHTML;
		var port = parent.document.getElementById('port').innerHTML;
		var user = parent.document.getElementById('user').innerHTML;
		var passwd = parent.document.getElementById('passwd').innerHTML;
		var param = get_param(address, port, user, passwd, channel);
		if(viewer.ComSetSourceTextSetting(param) == "false")
		{
			alert("Set fail");
			return;
		}
		viewer.ComStartNetwork(0);
	}
	else
	{
		alert("wrong channel" + channel);
	}
}