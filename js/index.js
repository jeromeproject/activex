var g_max_channel = 4;		// every js has this variable
var g_max_dvr = 4;
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

function set_liveview(type, channel)
{
	src = "remote_viewer.html?groupdvr=false&type="+type+"&channel="+channel;
	update_content(src);
}

function set_liveview_16(type, channel)
{
	src = "remote_viewer16.html?groupdvr=true&type="+type+"&channel="+channel;
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
		// group=ip:port:username:passwd:map1,map2,map3,map4+ip:port:username:passwd:map1,map2,map3,map4+ip:port:username:passwd:map1,map2,map3,map4+ip:port:username:passwd:map1,map2,map3,map4
		var tmp = cookies[i].split('=');
		var group_name = tmp[0];
		group_node = tree_add_group(group_name);
		var rows = tmp[1].split(ROW_SPLIT_CHAR);
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
	init_tree();
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
	// set_elem_hide('cancel');
}

function update_mode()
{
	set_elem_hide('add');
	set_elem_show('update');
	set_elem_show('delete');
	set_elem_show('cancel');
}

// map value control
function load_map_to_ui(prefix, map_array, max_chn)
{
	var i;
	for(i=0; i<max_chn; i++)
	{
		var id = prefix+i;
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
		// alert(id);
		var value = document.getElementById(id).value;
		if(value == "")
			value = "0";
		// user input 1~n, we need 0~n-1
		map_array[i] = parseInt(value, 10)-1;
	}
	// alert(map_array);
	return map_array;
}

// input columne control
function clear_node_information()
{
	document.getElementById('new_group').value = "";
	for(i=1; i<=g_max_dvr; ++i)
	{
		document.getElementById('new_address'+i).value = "";
		document.getElementById('new_port'+i).value = "";
		document.getElementById('new_user'+i).value = "";
		document.getElementById('new_passwd'+i).value = "";
		clear_map_ui('map'+i+'_ch', g_max_channel);
	}
}

function show_node_information(event, treeid, node)
{
	var group_node = tree_get_group_node(node);
	document.getElementById('new_group').value = group_node.name;
	var group_child_nodes = group_node.children

	for(i=1, x=1; i<group_child_nodes.length; ++i, ++x) {
		var dvr_node = group_child_nodes[i];	// the first node is for all in one
		document.getElementById('new_address'+x).value = dvr_node.address;
		document.getElementById('new_port'+x).value = dvr_node.port;
		document.getElementById('new_user'+x).value = dvr_node.username;
		document.getElementById('new_passwd'+x).value = dvr_node.passwd;
		load_map_to_ui('map'+x+'_ch', dvr_node.map, g_max_channel);
	}
	update_mode();
}

function cancel()
{
	clear_node_information();
	add_mode();

}

function tree_group_add_server(group_node, ip, port, user, passwd, map)
{	
	var tree = get_tree('maintree');
	var parent_node = group_node;

	var new_dvr =
	[
		{
			is_dvr:true,
			address:ip,
			port:port,
			username:user,
			passwd:passwd,
			map:map,
			name:ip, //+':'+port+'('+map+')',
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
		return undefined;
	}

	var new_group =
	[{
		name:group,
		is_group:true,
		gvalue:'',
		children: [
		{ 
			name:"LiveView All in one", 
			click:"set_liveview_16('3', '0')"
		}]
	}];
	return parent_node = tree.addNodes(undefined, new_group, 0);
}

function tree_add_new_group(group, value)
{	
	var tree = get_tree('maintree');

	var parent_node = tree_add_group(group);
	if(parent_node == undefined)
		return false;

	var row = value.split(ROW_SPLIT_CHAR);
	
	for(i = 0; i < row.length; ++i)
	{
		//value += addr + FIELD_SPLIT_CHAR + port + FIELD_SPLIT_CHAR + user + FIELD_SPLIT_CHAR + passwd + FIELD_SPLIT_CHAR + views;
		//alert(row[i]);
		var col = row[i].split(FIELD_SPLIT_CHAR);
		var new_dvr =
		[
			{
				is_dvr:true,
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
	// tree.updateNode(node, true);
	}
	
	clear_node_information();
	return true;
}

function add_new_group()
{
	var tree = get_tree('maintree');
	var group = document.getElementById('new_group').value;
	var value = '';
	for(i = 1; i <= g_max_dvr ; ++i)
	{
		var addr = document.getElementById('new_address' + i).value;
		var port = document.getElementById('new_port' + i).value;
		var user = document.getElementById('new_user' + i).value;
		var passwd = document.getElementById('new_passwd' + i).value;
		var views = load_map_from_ui('map' + i + '_ch', g_max_channel);
		value += addr + FIELD_SPLIT_CHAR + port + FIELD_SPLIT_CHAR + user + FIELD_SPLIT_CHAR + passwd + FIELD_SPLIT_CHAR + views;
		if( i != g_max_dvr )
			value += ROW_SPLIT_CHAR;
		// alert(value);
	}
	if(tree_add_new_group(group, value))
	{
		db_add(group, value);
		add_mode();
	}
}

function update_server()
{
	var tree = get_tree('maintree');
	var node = tree_get_current_node(tree);
	var group_node = tree_get_group_node(node);

	if(group_node.is_group)
	{
		db_del(group_node.name);
		group_node.name = document.getElementById('new_group').value;
		var value = '';
		var group_child_nodes = group_node.children;
		for(i=1, x=1; i<=group_child_nodes.length; ++i, ++x)
		{
			var dvr_node = group_node.children[i]; // the first node is for all in one, so we ignore it
			dvr_node.name = document.getElementById('new_address' + x).value;
			dvr_node.address = document.getElementById('new_address' + x).value;
			dvr_node.port = document.getElementById('new_port' + x).value;
			dvr_node.username = document.getElementById('new_user' + x).value;
			dvr_node.passwd = document.getElementById('new_passwd' + x).value;
			dvr_node.map = load_map_from_ui('map' + x + '_ch', g_max_channel);
			value += dvr_node.address + FIELD_SPLIT_CHAR + dvr_node.port + FIELD_SPLIT_CHAR + dvr_node.username + FIELD_SPLIT_CHAR + dvr_node.passwd + FIELD_SPLIT_CHAR + dvr_node.map;
			if( x != g_max_dvr )
				value += ROW_SPLIT_CHAR;
			// alert(value);
			tree.updateNode(dvr_node);
		}
		db_add(group_node.name, value);
		tree.updateNode(group_node);
		tree.reAsyncChildNodes(group_node, "refresh");
		clear_node_information();
		add_mode();
		reload_iframe();
	}
}

function delete_server()
{	
	var tree = get_tree('maintree');
	var node = tree_get_current_node(tree);
	if(node.is_group)
	{
		db_del(node.name);
		tree.removeChildNodes(node);
		tree.removeNode(node);
		clear_node_information();
		add_mode();
		update_content('tip_page.html');
	}
}
