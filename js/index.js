var g_max_channel = 4;		// every js has this variable
var g_selected_channel_data = [{
				address: '0.0.0.0',
				port:17860,
				username:'Admin',
				passwd:'',
				name:'UNDEFINED',
				map:'1,2,3,4' }];

FIELD_SPLIT_CHAR = ":"
ROW_SPLIT_CHAR = "+"
MAP_CH_PREFIX = "map1_ch"

function set_elem_hide(elem_id)
{
	document.getElementById(elem_id).style.display = 'none';
}

function set_elem_show(elem_id)
{
	document.getElementById(elem_id).style.display = 'inline';
}

function update_content(src)
{
	var iframe = document.getElementById('content');
	iframe.src = src;
}

function set_liveview(node, type, channel)
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

function init_old_tree()
{
	if(document.cookie.length == 0)
		return;

	var cookies = document.cookie.split(';');
	var i;
	for(i=0; i<cookies.length; i++)
	{
		// cookie format 
		// ip:port=username,passwd,map1,map2,map3,map4;
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
		tree_add_server(ip, port, user, passwd, map);
	}
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
		// group=ip:port:username:passwd:map1,map2,map3,map4+ip:port:username:passwd:map1,map2,map3,map4+ip:port:username:passwd:map1,map2,map3,map4+ip:port:username:passwd:map1,map2,map3,map4
		var tmp = cookies[i].split('=');
		var group_name = tmp[0];
		group_node = tree_add_group(group_name);
		var rows = tmp[1].split(FIELD_SPLIT_CHAR);
		for(j = 0; j < rows.length; ++j)
		{
			var val = rows[j].split(FIELD_SPLIT_CHAR);
			var ip = val[0];
			var port = val[1];
			var user = val[2];
			var passwd = val[3];
			var map = val[4].split(',');
			tree_group_add_server(group_node, ip, port, user, passwd, map);
		}
	}
}

function init()
{
	var setting = 
	{
		callback: 
		{
			//beforeExpand:tree_disable_expand,
			//beforeCollapse:tree_disable_collapse
			//onCollapse: tree_update_node,
			//onExpand: tree_update_node
			onClick: show_node_information
		},
		data:
		{
			keep:
			{
				parent: true
			}
		},
		view:
		{
			showIcon:true
		}
	};

	var zNodes =
	[
	];

	$(document).ready(function(){
		$.fn.zTree.init($("#maintree"), setting, zNodes);
	});
	//window.setInterval("get_server_info()", 5000);
	add_mode();
	// init_tree();
	document.getElementById("dvr1_button").onclick= function() {
		set_elem_show('dvr1');
		set_elem_hide('dvr2');
		set_elem_hide('dvr3');
		set_elem_hide('dvr4');
	};
	document.getElementById("dvr2_button").onclick= function() {
		set_elem_show('dvr2');
		set_elem_hide('dvr1');
		set_elem_hide('dvr3');
		set_elem_hide('dvr4');
	};
	document.getElementById("dvr3_button").onclick= function() {
		set_elem_show('dvr3');
		set_elem_hide('dvr2');
		set_elem_hide('dvr1');
		set_elem_hide('dvr4');
	};
	document.getElementById("dvr4_button").onclick= function() {
		set_elem_show('dvr4');
		set_elem_hide('dvr2');
		set_elem_hide('dvr3');
		set_elem_hide('dvr1');
	};
}

function reload_iframe()
{
	content.location.reload();
}

// button control
function add_mode()
{
	set_elem_show('add');
	set_elem_hide('update');
	set_elem_hide('delete');
	set_elem_hide('cancel');
}

function update_mode()
{
	set_elem_hide('add');
	set_elem_show('update');
	set_elem_show('delete');
	set_elem_show('cancel');
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

function clear_map_ui(prefix, max_chn)
{
	var i;
	for(i=0; i<max_chn; i++)
	{
		var id = prefix+i;
		document.getElementById(id).value = "";
	}
}

function load_map_from_ui(prefix, max_chn)
{
	var map_array = new Array();
	var i;
	for(i=0; i<max_chn; i++)
	{
		var id = prefix+i;
		var value = document.getElementById(id).value;
		if(value == "")
			value = "0";
		// user input 1~n, we need 0~n-1
		map_array[i] = parseInt(value, 10)-1;
	}
	return map_array;
}

// input columne control
function clear_node_information()
{
/*
	document.getElementById('new_address').value = "";
	document.getElementById('new_port').value = "";
	document.getElementById('new_user').value = "";
	document.getElementById('new_passwd').value = "";
	clear_map_ui(MAP_CH_PREFIX, g_max_channel);
*/
}

function show_node_information(event, treeid, node)
{
/*
	var top_node = get_top_node(node);
	document.getElementById('new_address').value = top_node.address;
	document.getElementById('new_port').value = top_node.port;
	document.getElementById('new_user').value = top_node.username;
	document.getElementById('new_passwd').value = top_node.passwd;
	load_map_to_ui(top_node.map, g_max_channel);
*/
	update_mode();
}

function cancel()
{
/*	
	document.getElementById('new_address').value = "";
	document.getElementById('new_port').value = "";
	document.getElementById('new_user').value = "";
	document.getElementById('new_passwd').value = "";
	clear_map_ui(MAP_CH_PREFIX, g_max_channel);
*/
	add_mode();

}

function tree_add_server(new_address, new_port, new_user, new_passwd, new_map)
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
	db_add(name, value);	
	
	tree.addNodes(undefined, new_server, 0);
	clear_node_information();
	add_mode();
}

function tree_group_add_server(group_node, ip, port, user, passwd, map);
{	
	var parent_node = group_node;

	var new_dvr =
	[
		{
			is_top:true,
			address:ip,
			port:port,
			username:user,
			passwd:passwd,
			map:ip,
			name:map,
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
	tree.addNodes(parent_node[0], new_dvr, 0);

	clear_node_information();
	add_mode();
}

function tree_add_group(group)
{	
	var tree = get_tree('maintree');
	var node = tree.getNodesByParam('name', group)[0];
	if(node)
	{
		alert("This group name is already exists.");
		return;
	}

	var new_group =
	[{
		name:group,
		gvalue:value,
	}];

	clear_node_information();
	add_mode();
	return parent_node = tree.addNodes(undefined, new_group, 0);
}

function tree_add_new_group(group, value)
{	
	var tree = get_tree('maintree');
	var node = tree.getNodesByParam('name', group)[0];
	if(node)
	{
		alert("This group name is already exists.");
		return;
	}

	var new_group =
	[{
		name:group,
		gvalue:value,
	}];

	var parent_node = tree.addNodes(undefined, new_group, 0);

	var row = value.split(ROW_SPLIT_CHAR);
	
	for(i = 0; i < row.length; ++i)
	{
		//value += addr + FIELD_SPLIT_CHAR + port + FIELD_SPLIT_CHAR + user + FIELD_SPLIT_CHAR + passwd + FIELD_SPLIT_CHAR + views;
		//alert(row[i]);
		var col = row[i].split(FIELD_SPLIT_CHAR);
		var new_dvr =
		[
			{
				is_top:true,
				address: col[0],
				port:col[1],
				username:col[2],
				passwd:col[3],
				name:col[0],
				map:col[4],
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
		tree.addNodes(parent_node[0], new_dvr, 0);
	}
	db_add(group, value);
	
	clear_node_information();
	add_mode();
}

function add_server()
{
	var new_address = document.getElementById('new_address').value;
	var new_port = document.getElementById('new_port').value;
	var new_user = document.getElementById('new_user').value;
	var new_passwd = document.getElementById('new_passwd').value;
	var new_map = load_map_from_ui(MAP_CH_PREFIX, g_max_channel);
	if(new_address.length == 0 || new_port.length == 0 || new_user.length == 0)
	{
		alert("invalid parameter");
		return -1;
	}

	tree_add_server(new_address, new_port, new_user, new_passwd, new_map);
	return 0;
}

function add_new_group()
{
	var group = document.getElementById('new_group').value;
	var value = '';
	var maxdvr = 4;
	for(i = 1; i <= maxdvr ; ++i)
	{
		var addr = document.getElementById('new_address' + i).value;
		var port = document.getElementById('new_port' + i).value;
		var user = document.getElementById('new_user' + i).value;
		var passwd = document.getElementById('new_passwd' + i).value;
		var views = load_map_from_ui('map' + i + '_ch', g_max_channel);
		value += addr + FIELD_SPLIT_CHAR + port + FIELD_SPLIT_CHAR + user + FIELD_SPLIT_CHAR + passwd + FIELD_SPLIT_CHAR + views;
		if( i != maxdvr )
			value += ROW_SPLIT_CHAR;
		// alert(value);
	}
	tree_add_new_group(group, value);
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
	node.user = document.getElementById("new_user").value;
	node.passwd = document.getElementById("new_passwd").value;
	node.map = load_map_from_ui(MAP_CH_PREFIX, g_max_channel);

	db_add(get_cookie_name(node), get_cookie_value(node));

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
