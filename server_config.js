class sdServerConfigShort
{
	// This file should contain one object (for example class like this one), it will be interpreted using basic eval method and automatically assigned to global variable sdWorld.server_config
			
	// If this all looks scary and you are using NetBeans - use "Ctrl + -" and "Ctrl + *" to hide big methods.
	
	static game_title = 'Lore of Star Susanoos';
	
	static allowed_s2s_protocol_ips = [
		'127.0.0.1',
		'::1',
		'::ffff:127.0.0.1'
	];
	
	static database_server = null; // Example: 'https://www.gevanni.com:3000'; // Remote database_server must allow current server's IP in list above. Set as null if this server should have its' own database
		
	static notify_about_failed_s2s_attempts = true;
	
	static log_s2s_messages = false;
	
	static enable_bounds_move = false;
		
	static apply_censorship = true; // Censorship file is not included
		
	// Check file sdServerConfig.js for more stuff to alter in server logic
	
	static supported_languages = [ 'en', 'ua', 'hr' ];
}