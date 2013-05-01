var g_max_channel = 4;		// every js has this variable
var g_type;  // 0: seperate to 4 windows, 1: single window, 2: parent-child
var g_max_channel_num = [g_max_channel, g_max_channel, g_max_channel, g_max_channel];	// showing sets of camera status in different view
var g_selected_channel_data; //set by parent

// get input parameters from url after '?'
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

function gen_connection_str(ip, port, username, password, channel)
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

function change_channel(e)
{
	if(g_type == '0')
		return;
	else
	{
		var idx = parseInt(e.value, 10);
		switch(g_type)
		{
			case '1':
				init_single(idx);
				break;
			case '2':
				init_parent_child(idx);
				break;
			case '3':
				init_seperate16();
				break;
		}
	}	
}

function adjust_size()
{
	var window_w = document.body.offsetWidth;
	var window_h = document.body.offsetHeight*0.9;
	var width = (window_w>MAX_WIDTH)? MAX_WIDTH: (window_w<MIN_WIDTH)? MIN_WIDTH: window_w;
	var height = (window_h>MAX_HEIGHT)? MAX_HEIGHT: (window_h<MIN_HEIGHT)? MIN_HEIGHT: window_h;
	var exit = 0;
	var i;
	for(i=0; i<g_max_channel*4; i++)
	{
		var id = "RemoteViewer"+i;
		var obj = document.getElementById(id);
		switch(g_type)
		{
			case '0': // 2x2
				obj.width = parseInt(width>>1, 10);
				obj.height = parseInt(height>>1, 10);
				if(i == 3)
					exit = 1;
				break;
			case '1':
				obj.width = width;
				obj.height = height;
				exit = 1;
				break;
			case '2': // parent-childs
				var w;
				var h;
				if(id == "RemoteViewer0")
				{
					w = parseInt(width*0.8, 10);
					h = parseInt(height*0.8, 10);
				}
				else
				{
					w = width - parseInt(width*0.8, 10);
					h = parseInt(height*0.25, 10);
				}
				obj.width = w;
				obj.height = h;
				if(i == 3)
					exit = 1;
				break;
			case '3': // 4x4
				obj.width = parseInt(width>>2, 10);
				obj.height = parseInt(height>>2, 10);
				break;
		}

		if(exit)
			break;
	}
}

function load_ui(html)
{
	var viewarea = document.getElementById('viewarea');
	viewarea.innerHTML = html;
	adjust_size();
}

function gen_seperate4_html()
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
	for( i = 4; i < g_max_channel; ++i)
		html += "<OBJECT ID='RemoteViewer" + i +"' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=1 height=1></OBJECT>";
	return html;
}

function init_seperate4()
{
	g_type = '0';
	load_ui(gen_seperate4_html());
	init_viewer(g_max_channel_num[g_type]);
}

function gen_seperate16_html()
{	
	var html = 
		"<table>\
			<tr>\
				<td>\
					<OBJECT ID='RemoteViewer0' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer1' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer2' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer3' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
			</tr>\
			<tr>\
				<td>\
					<OBJECT ID='RemoteViewer4' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer5' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer6' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer7' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
			</tr>\
			<tr>\
				<td>\
					<OBJECT ID='RemoteViewer8' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer9' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer10' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer11' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
			</tr>\
			<tr>\
				<td>\
					<OBJECT ID='RemoteViewer12' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer13' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer14' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
				<td>\
					<OBJECT ID='RemoteViewer15' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=540 height=360></OBJECT>\
				</td>\
			</tr>\
		</table>\
		";
	return html;
}

function init_seperate16()
{
	g_type = '3';
	load_ui(gen_seperate16_html());
	init_viewer(g_max_channel_num[g_type]);
}

function gen_single_html(channel)
{
	var html = "<OBJECT ID='RemoteViewer0' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=0 height=0></OBJECT>";
	html += "<OBJECT ID='RemoteViewer1' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=0 height=0></OBJECT>";
	html += "<OBJECT ID='RemoteViewer2' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=0 height=0></OBJECT>";
	html += "<OBJECT ID='RemoteViewer3' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=0 height=0></OBJECT>";
	for( i = 4; i < g_max_channel; ++i)
		html += "<OBJECT ID='RemoteViewer" + i +"' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=1 height=1></OBJECT>";
	return html;
}

function init_single(channel)
{
	g_type = '1';
	if(typeof channel == "undefined")
		channel = parseInt(document.getElementById('channel').value, 10);

	load_ui(gen_single_html(channel));
	init_viewer(g_max_channel_num[g_type], channel);
}

function gen_parent_child_html()
{
	var html = "<table>";
			html += "<tr>";
				html += "<td>";
					html += "<OBJECT ID='RemoteViewer0' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=720 height=480></OBJECT>";
				html += "</td>";
				html += "<td>";
					html += "<table>";
						html += "<tr><td>";
							html += "<OBJECT ID='RemoteViewer1' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=240 height=160></OBJECT>";
						html += "</td></tr>";
						html += "<tr><td>";
							html += "<OBJECT ID='RemoteViewer2' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=240 height=160></OBJECT>";
						html += "</td></tr>";
						html += "<tr><td>";
							html += "<OBJECT ID='RemoteViewer3' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=240 height=160></OBJECT>";
						html += "</td></tr>";
					html += "</table>";
				html += "</td>";
			html += "</tr>";
	html += "</table>";
	for( i = 4; i < g_max_channel; ++i)
		html += "<OBJECT ID='RemoteViewer" + i +"' CLASSID='CLSID:E10658C9-3989-49B3-A2E3-FD9CBD8F42B3' codebase='ocx/RemoteViewer.ocx' width=1 height=1></OBJECT>";
	return html;
}

function init_parent_child(major_channel)
{
	g_type = '2';
	if(typeof major_channel == "undefined")
		major_channel = parseInt(document.getElementById('channel').value, 10);
		
	load_ui(gen_parent_child_html());
	init_viewer(g_max_channel_num[g_type], major_channel);
}

function init_viewer(max_channel, open_channel)
{
	destroy();
	//var channel_map = [0, 1, 2, 3];
	var tree = get_tree_from_parent("maintree");
	var group_node = tree_get_group_node(tree_get_current_node(tree));
	var group_child_nodes = group_node.children;

	for(j=1, x=1; j<group_child_nodes.length; ++j, ++x) {
		var dvr_node = group_child_nodes[j];	// the first node is for all in one
		// [address, port, user, passwd, map]
		var address = dvr_node.address;
		var port = dvr_node.port;
		var user = dvr_node.username;
		var passwd = dvr_node.passwd;
		var channel_map = dvr_node.map;	//g_max_channel
		// alert(address);
		// alert(port);
		// alert(user);
		// alert(passwd);
		if(address == '' || port == '')
			continue;
		var i;
		for(i=0; i<max_channel; i++)
		{
			if(channel_map[i] == -1)
			{
				//alert("-1 channel");
				continue;
			}
			var param = gen_connection_str(address, port, user, passwd, channel_map[i]);		
			var id = "RemoteViewer"+(max_channel*(x-1) + i);
			var viewer = document.getElementById(id);

			if(viewer.ComSetSourceTextSetting(param) == "false")
			{
				alert("Set fail");
			}
			viewer.ComStartNetwork(0);
		}
	}

}

function set_connection_icon(idx, status)
{
	var on_id = "ch"+idx+"_on";
	var off_id = "ch"+idx+"_off";

	if(status == "1")
	{
		document.getElementById(on_id).style.display = "inline";
		document.getElementById(off_id).style.display = "none";
	}
	else
	{
		document.getElementById(on_id).style.display = "none";
		document.getElementById(off_id).style.display = "inline";
	}
}

function get_connection_info()
{
	//document.getElementById('framerate_st').innerHTML = "";
	var status;
	var fps;
	var i;
	for(i=0; i<16; i++)
	{
		var id = "RemoteViewer"+i;
		var viewer = document.getElementById(id);
		status = viewer.ComViewGeneralCommand(11, 0, 0, 0);
		fps = viewer.ComViewGeneralCommand(23, 0, 0, 0);
		
		set_connection_icon(i, status);
		//document.getElementById('framerate_st').innerHTML += fps/1000+" ";
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
			init_parent_child(channel);
			break;
		case '3':
			init_seperate16();
			break;
	}
	window.setInterval("get_connection_info()", 2000);
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
