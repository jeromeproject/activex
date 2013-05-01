// document.cookie = "name=oeschger";
// document.cookie = "favorite_food=tripe";
// alert(document.cookie);
// displays: name=oeschger;favorite_food=tripe

function add_cookie(name, value)
{
	var expire = new Date();
	expire.setYear(expire.getYear()+10);
	var cookie = name + "=" +value + ";expires=" + expire.toGMTString();
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

function db_add(name, value)
{
	add_cookie(name, value);
}

function db_del(name)
{
	del_cookie(name);
}
