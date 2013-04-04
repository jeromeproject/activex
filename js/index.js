MAP_CH_PREFIX="map_ch"

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

function init_tree()
{
	if(document.cookie.length == 0)
		return;

	var cookies = document.cookie.split(';');
	var i;
	for(i=0; i<cookies.length; i++)
	{
		// cookie format 
		// ip:port=username,passwd,map1,map2,map3,map4
		var tmp = cookies[i].split('=');
		var ip = tmp[0].split(':')[0];
		var port = tmp[0].split(':')[1];
		var user = tmp[1].split(',')[0];
		var passwd = tmp[1].split(',')[1];
		var map = new Array();
		var j;
		for(j=0; j<tmp[1].split(',').length-2; j++)
		{
			map[j] = tmp[1].split(',')[j+2];
		}
		_add_server(ip, port, user, passwd, map);
	}
}

function init()
{
	//window.setInterval("get_server_info()", 5000);
	add_mode();
	init_tree();
}

function reload_iframe()
{
	content.location.reload();
}

function set_button_hide(btn_id)
{
	document.getElementById(btn_id).style.display = 'none';
}

function set_button_show(btn_id)
{
	document.getElementById(btn_id).style.display = 'inline';
}

// button control
function add_mode()
{
	set_button_show('add');
	set_button_hide('update');
	set_button_hide('delete');
	set_button_hide('cancel');
}

function update_mode()
{
	set_button_hide('add');
	set_button_show('update');
	set_button_show('delete');
	set_button_show('cancel');
}

// map value control
function load_map_to_ui(map_array, max_chn)
{
	var i;
	for(i=0; i<max_chn; i++)
	{
		var id = MAP_CH_PREFIX+i;
		document.getElementById(id).value = parseInt(map_array[i], 10)+1;
	}
}

function clear_map_ui(max_chn)
{
	var i;
	for(i=0; i<max_chn; i++)
	{
		var id = MAP_CH_PREFIX+i;
		document.getElementById(id).value = "";
	}
}

function load_map_from_ui(max_chn)
{
	var map_array = new Array();
	var i;
	for(i=0; i<max_chn; i++)
	{
		var id = MAP_CH_PREFIX+i;
		var value = document.getElementById(id).value;
		if(value == "")
			value = i+1;
		// user input 1~n, we need 0~n-1
		map_array[i] = parseInt(value, 10)-1;
	}
	return map_array;
}

// input columne control
function clear_node_information()
{
	document.getElementById('new_address').value = "";
	document.getElementById('new_port').value = "";
	document.getElementById('new_user').value = "";
	document.getElementById('new_passwd').value = "";
	clear_map_ui(4);
}

function show_node_information(event, treeid, node)
{
	var top_node = get_top_node(node);
	document.getElementById('new_address').value = top_node.address;
	document.getElementById('new_port').value = top_node.port;
	document.getElementById('new_user').value = top_node.username;
	document.getElementById('new_passwd').value = top_node.passwd;
	load_map_to_ui(top_node.map, 4);
	update_mode();
}

function cancel()
{	
	document.getElementById('new_address').value = "";
	document.getElementById('new_port').value = "";
	document.getElementById('new_user').value = "";
	document.getElementById('new_passwd').value = "";
	clear_map_ui(4);
	add_mode();
}

function add_cookie(name, value)
{
	var expire = new Date();
	expire.setYear(expire.getYear()+10);
	var cookie = name+"="+value+";expires="+expire.toGMTString();
	document.cookie = cookie;
}

function get_cookie(name)
{
        var start = document.cookie.indexOf( name + "=" );
        var len = start + name.length + 1;
        if( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) )
        {
                return null;
        }
        if( start == -1 )
        {
                return null;
        }
        var end = document.cookie.indexOf( ';', len );
        if( end == -1 )
        {
                end = document.cookie.length;
        }
        return unescape( document.cookie.substring( len, end ) );
}

function del_cookie(name)
{
        var exp = new Date();
        exp.setTime( exp.getTime() - 1 );
        var cval = get_cookie( name );
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
} 

function get_cookie_name(node)
{
	return node.address+":"+node.port;
}

function get_cookie_value(node)
{
	return node.user+","+node.passwd+","+node.map;
}

function _add_server(new_address, new_port, new_user, new_passwd, new_map)
{	
	var tree = get_tree('maintree');
	var node = tree.getNodesByParam('name', new_address)[0];
	if(node)
	{
		alert("This address is already exists.");
		return;
	}

	var new_server =
	[
		{
			is_top:true,
			address:new_address,
			port:new_port,
			username:new_user,
			passwd:new_passwd,
			name:new_address,
			map:new_map,
			children:
			[
				{ 
					name:"LiveView", 
					click:"set_liveview('0', '0')"
				},
				{ 
					name:"Playback",
					open:true,
					children: 
					[
						{ 
							name: "Channel1",
							click:"set_playback('0')"
						},
						{ 
							name: "Channel2",
							click:"set_playback('1')"
						},
						{ 
							name: "Channel3",
							click:"set_playback('2')"
						},
						{ 
							name: "Channel4",
							click:"set_playback('3')"
						}
					]
				},
			]
		}
	];

	// add cookie
	var name = new_address+":"+new_port;
	var value = new_user+","+new_passwd+","+new_map;
	add_cookie(name, value);	
	
	tree.addNodes(undefined, new_server, 0);
	clear_node_information();
	add_mode();
}

function add_server()
{
	var new_address = document.getElementById('new_address').value;
	var new_port = document.getElementById('new_port').value;
	var new_user = document.getElementById('new_user').value;
	var new_passwd = document.getElementById('new_passwd').value;
	var new_map = load_map_from_ui(4);
	if(new_address.length == 0 || new_port.length == 0 || new_user.length == 0)
	{
		alert("invalid parameter");
		return;
	}

	_add_server(new_address, new_port, new_user, new_passwd, new_map);
}

function update_server()
{
	var tree = get_tree('maintree');
	var node = tree_get_current_node(tree);
	node = get_top_node(node);

	del_cookie(get_cookie_name(node));

	node.address = document.getElementById("new_address").value;
	node.name = node.address;
	node.port = document.getElementById("new_port").value;
	node.username = document.getElementById("new_user").value;
	node.passwd = document.getElementById("new_passwd").value;
	node.map = load_map_from_ui(4);

	add_cookie(get_cookie_name(node), get_cookie_value(node));

	tree.updateNode(node, true);
	clear_node_information();
	add_mode();
	reload_iframe();	
}

function delete_server()
{	
	var tree = get_tree('maintree');
	var node = tree_get_current_node(tree);
	node = get_top_node(node);

	del_cookie(get_cookie_name(node));

	tree.removeChildNodes(node);
	tree.removeNode(node);
	clear_node_information();
	add_mode();
	update_content('tip_page.html');
}
