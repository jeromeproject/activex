function init()
{
	var old_address = parent.document.getElementById('address').innerHTML;
	var old_port = parent.document.getElementById('port').innerHTML;
	var old_user = parent.document.getElementById('user').innerHTML;
	var old_passwd = parent.document.getElementById('passwd').innerHTML;
	
	document.getElementById('new_address').value = old_address;
	document.getElementById('new_port').value = old_port;
	document.getElementById('new_user').value = old_user;
	document.getElementById('new_passwd').value = old_passwd;
}

function save()
{
	var new_address = document.getElementById('new_address').value;
	var new_port = document.getElementById('new_port').value;
	var new_user = document.getElementById('new_user').value;
	var new_passwd = document.getElementById('new_passwd').value;
	
	parent.document.getElementById('address').innerHTML = new_address;
	parent.document.getElementById('port').innerHTML = new_port;
	parent.document.getElementById('user').innerHTML = new_user;
	parent.document.getElementById('passwd').innerHTML = new_passwd;
}