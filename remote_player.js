function init()
{
	var player = document.getElementById('RemotePlayer');
	player.width = 1280;
	player.height = 720;
	player.ComSetupConnect(0, "127.0.0.1", 17860, "test", "test", undefined, undefined, undefined, undefined, 0);
	//player.ComOpenPlayer();
	player.ComEmbedPlayer(1);
}