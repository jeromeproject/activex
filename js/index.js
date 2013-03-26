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
	//window.setInterval("get_server_info()", 5000);
	add_mode();
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

function clear_node_information()
{
	document.getElementById('new_address').value = "";
	document.getElementById('new_port').value = "";
	document.getElementById('new_user').value = "";
	document.getElementById('new_passwd').value = "";
}

function show_node_information(event, treeid, node)
{
	var top_node = get_top_node(node);
	document.getElementById('new_address').value = top_node.address;
	document.getElementById('new_port').value = top_node.port;
	document.getElementById('new_user').value = top_node.username;
	document.getElementById('new_passwd').value = top_node.passwd;
	update_mode();
}

function cancel()
{	
	document.getElementById('new_address').value = "";
	document.getElementById('new_port').value = "";
	document.getElementById('new_user').value = "";
	document.getElementById('new_passwd').value = "";
	add_mode();
}

function add_server()
{
	var new_address = document.getElementById('new_address').value;
	var new_port = document.getElementById('new_port').value;
	var new_user = document.getElementById('new_user').value;
	var new_passwd = document.getElementById('new_passwd').value;
	if(new_address.length == 0 || new_port.length == 0 || new_user.length == 0 || new_passwd.length == 0)
	{
		alert("invalid parameter");
		return;
	}

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
	tree.addNodes(undefined, new_server, 0);
	clear_node_information();
	add_mode();
}

function update_server()
{
	var tree = get_tree('maintree');
	var node = tree_get_current_node(tree);
	node = get_top_node(node);
	node.address = document.getElementById("new_address").value;
	node.name = node.address;
	node.port = document.getElementById("new_port").value;
	node.username = document.getElementById("new_user").value;
	node.passwd = document.getElementById("new_passwd").value;
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
	tree.removeChildNodes(node);
	tree.removeNode(node);
	clear_node_information();
	add_mode();
}
