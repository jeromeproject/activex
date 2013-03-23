var g_type;  // 0: seperate to 4 windows, 1: single window, 2: parent and children
var g_max_channel_num = [4, 4, 4];

function get_input_params()
{
	var ret = new Array();
	var str = document.location.search;
	if(str.indexOf("?") >= 0)
	{
		var new_str = str.substring(str.indexOf("?")+1, str.length);
		var tmp = new_str.split("&");
		var i;
		for(i=0; i<tmp.length; i++)
		{
			var key = tmp[i].split("=")[0];
			var value = tmp[i].split("=")[1];
			if(key == "type")
				ret[0] = value;
			else if(key == "channel")
				ret[1] = value;
		}
		return ret;
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

function gen_seperate4()
{	
	var html = 
		"<table>\
			<tr>\
				<td>\
					<OBJECT ID='RemoteViewer0' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer1' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\				</td>\
				</td>\
			</tr>\
			<tr>\
				<td>\
					<OBJECT ID='RemoteViewer2' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer3' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
			</tr>\
		</table>\
		";
	return html;
}

function gen_single(channel)
{
	var html = "<OBJECT ID='RemoteViewer0' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=0 height=0></OBJECT>";
	html += "<OBJECT ID='RemoteViewer1' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=0 height=0></OBJECT>";
	html += "<OBJECT ID='RemoteViewer2' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=0 height=0></OBJECT>";
	html += "<OBJECT ID='RemoteViewer3' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=0 height=0></OBJECT>";
	return html;
}

function load_ui(html)
{
	var viewarea = document.getElementById('viewarea');
	viewarea.innerHTML = html;
}

function change_channel(e)
{
	if(g_type == '0')
		return;
	else
	{
		RemoteViewer0.ComStopNetwork();
		switch(g_type)
		{
			case '1':
				var idx = parseInt(e.value, 10);
				init_single(idx);
				break;
			case '2':
				break;
		}
	}	
}

function init_seperate4()
{
	g_type = '0';
	load_ui(gen_seperate4());
	init_viewer(g_max_channel_num[g_type]);
}

function init_single(channel)
{
	g_type = '1';
	if(typeof channel == "undefined")
		channel = parseInt(document.getElementById('channel').value, 10);

	load_ui(gen_single(channel));
	init_viewer(g_max_channel_num[g_type], channel);
}


function init_viewer(max_channel, open_channel)
{
	destroy();
	var address = parent.document.getElementById('address').innerHTML;
	var port = parent.document.getElementById('port').innerHTML;
	var user = parent.document.getElementById('user').innerHTML;
	var passwd = parent.document.getElementById('passwd').innerHTML;
		
	var i;
	for(i=0; i<max_channel; i++)
	{
		var param = get_param(address, port, user, passwd, i);
		var id = "RemoteViewer"+i;
		var viewer = document.getElementById(id);
		
		if(i == open_channel)
		{
			// only single mode enter here.
			// change viewer size and hide others
			viewer.width = 1024;
			viewer.height = 720;
		}
		
		if(viewer.ComSetSourceTextSetting(param) == "false")
		{
			alert("Set fail");
		}
		viewer.ComStartNetwork(0);
	}
}

function get_info()
{
	document.getElementById('channel_st').innerHTML = "";
	document.getElementById('framerate_st').innerHTML = "";
	var status;
	var fps;
	var i;
	for(i=0; i<g_max_channel_num[g_type]; i++)
	{
		var id = "RemoteViewer"+i;
		var viewer = document.getElementById(id);
		status = viewer.ComViewGeneralCommand(11, 0, 0, 0);
		fps = viewer.ComViewGeneralCommand(23, 0, 0, 0);
		
		document.getElementById('channel_st').innerHTML += status+" ";
		document.getElementById('framerate_st').innerHTML += fps+" ";
	}
}

function init()
{
	var tmp = get_input_params();
	g_type = tmp[0];
	var channel = parseInt(tmp[1], 10);
	switch(g_type)
	{
		case '0':
			init_seperate4();
			break;
		case '1':
			init_single(channel);
			break;
		case '2':
			// not ready
			//init_parent_and_children();
			break;
	}
	window.setInterval("get_info()", 1000);
}

function destroy()
{
	var i;
	for(i=0; i<g_max_channel_num[g_type]; i++)
	{
		var id = "RemoteViewer"+i;
		var viewer = document.getElementById(id);
		try
		{
			viewer.ComStopNetwork();
		}
		catch(e)
		{
			//init_active_fail();
		}
	}
}
