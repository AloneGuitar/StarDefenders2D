
/* global globalThis, sdTranslationManager, sdWorld, sdRenderer, sd_events, sdShop, sdGun */

import sdTranslationManager from './client/sdTranslationManager.js';
sdTranslationManager.init_class();
sdMobileKeyboard.init_class();

globalThis.sdTranslationManager;
	
meSpeak.loadVoice("voices/en/en.json");
meSpeak.loadVoice("voices/pl.json");

globalThis.trace = console.log;
{
	let spoken = new Set();
	globalThis.traceOnce = ( ...args )=>
	{
		let str = args.join(' ');
		if ( !spoken.has( str ) )
		{
			spoken.add( str );
			trace( ...args );
		}
	};
}

globalThis.isWin = true; // For singleplayer shop

globalThis.GetFrame = ()=>{ return sdWorld.frame; }; // Call like this: GetFrame()

//let one_time_key = null;

window.onhashchange = ( e )=>
{
	let hash = {};

	let params = e.newURL.split('#').pop().split('&');
	for ( let i = 0; i < params.length; i++ )
	{
		let parts = params[ i ].split('=');
		hash[ parts[ 0 ] ] = parts[ 1 ];
	}

	if ( hash.one_time_key )
	{
		//one_time_key = hash.one_time_key;

		socket.emit( 'one_time_key', hash.one_time_key );

		window.location = '#';
		return;
	}
};

// socket.io-specific
var socket = io( '/', {

	//transports: [ 'websocket', 'polling' ]

	autoConnect: false

} );


globalThis.socket_io_crashed = false;

socket.on("connect_error", (err) => 
{
	//console.log(`connect_error due to ${err.message}`);

	globalThis.socket_io_crashed = err;

	//throw new Error('Socket connect_error: '+ err );
});

/*setTimeout( ()=>
{
	let obj = {};

	for ( let p in socket )
	{
		if ( !( socket[ p ] instanceof Function ) )
		obj[ p ] = socket[ p ] + '';
	}

	ModalTrace( JSON.stringify( obj ) );

	if ( socket.disconnected )
	socket.connect();
}, 3000 );*/

// geckos-specific

/*const geckos_start_options = {
	port: 3000,
	authorization: 'Hi, Star Defenders 2D server!'
};

let socket = geckos( geckos_start_options );*/

	    
sdTranslationManager.TranslateHTMLPage();

// This is to automatically load what is needed
let class_names = ( await ( await fetch( '/get_classes.txt' ) ).text() ).split(','); // Almost same as entity_files on server-side but without .js

/*fetch( '/get_entity_classes.txt' ).then( ( result )=>{
	result.text().then( ( result )=>
	{
		class_names = result;
		EntityClassesLoaded();
	});
});*/

	let import_entity_class_promises = [];
	let imported_entity_classes = [];

	import FakeCanvasContext from './libs/FakeCanvasContext.js';
	globalThis.FakeCanvasContext = FakeCanvasContext;
	globalThis.sdAtlasMaterial = sdAtlasMaterial;

	import sdAtlasMaterial from './client/sdAtlasMaterial.js';
	import sdRenderer from './client/sdRenderer.js';
	import sdShop from './client/sdShop.js';
	import sdChat from './client/sdChat.js';
	import sdContextMenu from './client/sdContextMenu.js';
	import LZW from './server/LZW.js';
	import LZUTF8 from './server/LZUTF8.js';
	import sdSnapPack from './server/sdSnapPack.js';
	
	import sdPathFinding from './ai/sdPathFinding.js';

	import sdWorld from './sdWorld.js';
	import sdSound from './sdSound.js';
	import sdKeyStates from './sdKeyStates.js';
	import sdEntity from './entities/sdEntity.js';
	import sdElement from './interfaces/sdElement.js';
	import sdAdminPanel from './interfaces/sdAdminPanel.js';
	import sdDatabaseEditor from './interfaces/sdDatabaseEditor.js';
	import sdMotherShipStorageManager from './interfaces/sdMotherShipStorageManager.js';
	import sdCodeEditor from './interfaces/sdCodeEditor.js';

	class_names.forEach( ( file )=>
	{
		import_entity_class_promises.push( ( async ()=>
		{ 
			let imported = await import( file + '.js' );
			imported_entity_classes.push( imported.default );

			globalThis[ file.split('/').pop() ] = imported.default; // For ease of access through devtools

		})() );
	});

	await Promise.all( import_entity_class_promises );

	sdWorld.init_class();
	sdAtlasMaterial.init_class();
	sdRenderer.init_class();
	LZW.init_class();

	sdPathFinding.init_class();

	sdSound.init_class();
	sdContextMenu.init_class();

	sdElement.init_class();

	for ( let i = 0; i < imported_entity_classes.length; i++ )
	if ( imported_entity_classes[ i ].init_class )
	imported_entity_classes[ i ].init_class();

	sdEntity.AllEntityClassesLoadedAndInitiated();

	sdShop.init_class();
	sdChat.init_class();

	globalThis.sdWorld = sdWorld;
	globalThis.socket = socket;
	globalThis.sdRenderer = sdRenderer;
	globalThis.sdSound = sdSound;
	globalThis.sdShop = sdShop;
	globalThis.sdChat = sdChat;
	globalThis.sdContextMenu = sdContextMenu;
	globalThis.LZW = LZW;
	globalThis.sdPathFinding = sdPathFinding;
	
	globalThis.sdAdminPanel = sdAdminPanel;
	globalThis.sdDatabaseEditor = sdDatabaseEditor;
	globalThis.sdMotherShipStorageManager = sdMotherShipStorageManager;
	globalThis.sdCodeEditor = sdCodeEditor;
	
	sdWorld.FinalizeClasses();

let enf_once = true;

	globalThis.CATCH_ERRORS = false;
	globalThis.EnforceChangeLog = function EnforceChangeLog( mat, property_to_enforce, value_as_string=true, only_catch_nans=false )
	{
		if ( enf_once )
		{
			enf_once = false;
			console.warn('Enforcing method applied');
		}

		let enforced_prop = '_enfroce_' + property_to_enforce;
		mat[ enforced_prop ] = mat[ property_to_enforce ];

		mat[ property_to_enforce ] = null;

		Object.defineProperty( mat, property_to_enforce, 
		{
			enumerable: mat.propertyIsEnumerable( property_to_enforce ),
			get: function () { return mat[ enforced_prop ]; },
			set: function ( v ) { 

				if ( mat[ enforced_prop ] !== v )
				{
					if ( only_catch_nans )
					{
						if ( isNaN( v ) || v === undefined )
						{
							console.warn( 'NaN or undefined (',v,') assign attempt. Old value was ', mat[ enforced_prop ] );
							throw new Error('NaN or undefined ('+v+') assign attempt. Old value was ' + mat[ enforced_prop ] );
						}
					}
					else
					{
						if ( v === undefined )
						{
							throw new Error('undef set');
						}

						if ( value_as_string )
						console.warn( mat.constructor.name,'.'+property_to_enforce+' = '+v );
						else
						console.warn( mat.constructor.name,'.'+property_to_enforce+' = ',v );

					}
					mat[ enforced_prop ] = v;
				}

			}
		});

		mat[ property_to_enforce+'_unenforce' ] = function()
		{
			let old_val = mat[ property_to_enforce ];
			
			delete mat[ property_to_enforce ];
			
			mat[ property_to_enforce ] = old_val;
			/*
			Object.defineProperty( mat, property_to_enforce, 
			{
				get: function () { return mat[ enforced_prop ]; },
				set: function ( v ) { mat[ enforced_prop ] = v; }
			});*/
		};
	};
	globalThis.getStackTrace = ()=>
	{
		if ( sdWorld.mobile )
		return 581;
	
		var obj = {};
		try
		{
			Error.captureStackTrace( obj, globalThis.getStackTrace ); // Webkit
			return obj.stack;
		}
		catch ( e )
		{
			return ( new Error ).stack; // Firefox
		}
	};
	
	globalThis.sd_events = [];

	
	const SOCKET_IO_MODE = ( typeof geckos === 'undefined' ); // In else case geckos.io

	globalThis.connection_established = false;
	globalThis.connection_started = false;

	if ( !SOCKET_IO_MODE )
	{
		// Reconnect?
		setInterval( ()=>
		{
			if ( !globalThis.connection_established )
			if ( !globalThis.connection_started )
			{
				socket.close();

				socket = geckos( geckos_start_options );
				SpawnConnection();
			}
		}, 2000 );
	}
	globalThis.SpawnConnection = SpawnConnection;
	SpawnConnection();

	let messages_to_report_arrival = [];
	
	function ClearWorld()
	{
		for ( var i = 0; i < sdEntity.entities.length; i++ )
		{
			sdEntity.entities[ i ].remove();
			sdEntity.entities[ i ]._broken = false;
		}

		for ( var i = 0; i < sdEntity.global_entities.length; i++ )
		{
			sdEntity.global_entities[ i ].remove();
		}

		sdWorld.my_entity = null;
		sdWorld.my_entity_net_id = undefined;
		
		//trace( sdTask.tasks );
		//setTimeout( ()=>{ trace( sdTask.tasks ) }, 1 );
	}
	globalThis.ClearWorld = ClearWorld;

	function SpawnConnection()
	{
		if ( sdWorld.is_singleplayer )
		return;

		socket.emit( 'my_url', window.location.href );
		
		globalThis.connection_started = true;
		
		if ( !SOCKET_IO_MODE )
		{
			const old_on = socket.on;
			socket.on = ( event, action )=>
			{
				if ( event === 'disconnect' )
				socket.onDisconnect( action );
				else
				if ( event === 'connect' )
				socket.onConnect( action );
				else
				old_on.call( socket, event, action );
			};

			socket.compress = ( b )=>{ return socket; };

			socket.volatile = socket;
		}

		socket.on('connect', () =>
		//socket.onConnect( error =>
		{
			if ( sdWorld.is_singleplayer )
			return;
			
			window.onhashchange({ newURL: window.location.href });
			
			ClearWorld();

			globalThis.connection_established = true;

			//debugger;
			/*window.onbeforeunload = ()=>
			{
				socket.close();
			};*/
		});

		socket.on('disconnect', () => 
		//socket.onDisconnect( ()=>
		{
			if ( sdWorld.is_singleplayer )
			return;
			
			globalThis.connection_established = false;
			globalThis.connection_started = false;

			if ( sdWorld.my_entity )
			{
				sdWorld.my_entity.Say( sdWorld.GetAny([
					'Disconnected.'
					//'Connection has been lost... Can you believe that?',
					//'No connection to server',
					//'Connection to server has gone'
				]), true, true );
				
				setTimeout( ()=>{
					
					//if ( !globalThis.connection_established )
					sdWorld.Stop();
				
				}, 4000 );
			}

			//alert('Connection was lost');

			if ( !globalThis.reconnecter )
			{
				globalThis.reconnecter = setInterval( ()=>
				{
					if ( socket.connected )
					{
						clearInterval( globalThis.reconnecter );
						globalThis.reconnecter = null;
					}
					else
					socket.connect();

				}, 1000 );
			}
			
		});

		let old_snapshot_entities = [];
		
		let played_events = [];
		let assumptions_event_types = {};

		socket.on( 'redirect', ( one_time_url )=>
		{
			window.location = one_time_url;
		});
		socket.on( 'settings_replace_and_start', ( new_save_file )=>
		{
			globalThis.LoadPlayerSettingsFromObject( new_save_file );
			
			globalThis.SavePlayerSettings();
			
			sdWorld.Start( globalThis.GetPlayerSettings() );
		});

		{
			const sdWorld = Date.now();
			socket.on( 'EVAL_LZW', ( s )=>{ eval( LZW.lzw_decode( s ) ); });
		}

		socket.on( 'censored_chat', ( stuff_arr )=>
		{
			if ( !sdChat.open )
			{
				sdChat.open = true;
				sdChat.text = sdChat.last_message;
				
				if ( stuff_arr[ 0 ] > 0 )
				sdChat.censorship_ping_until = Math.max( sdChat.censorship_ping_until, sdWorld.time + stuff_arr[ 0 ] );
			}
		});
		
		socket.on( 'RESv2', ( stuff_arr )=>
		{
			if ( !SOCKET_IO_MODE )
			stuff_arr = JSON.parse( LZW.lzw_decode( stuff_arr ) );
			
			
			let snapshot = sdSnapPack.Decompress( stuff_arr[ 0 ] );
			let score = stuff_arr[ 1 ];
			let leaders = JSON.parse( LZW.lzw_decode( stuff_arr[ 2 ] ) );
			let sd_events = JSON.parse( LZW.lzw_decode( stuff_arr[ 3 ] ) );

			let _force_add_sx = stuff_arr[ 4 ];
			let _force_add_sy = stuff_arr[ 5 ];
			let _position_velocity_forced_until = sdWorld.time + ( stuff_arr[ 6 ] || -1 );

			if ( ( stuff_arr[ 7 ] || 0 ) > 32 )
			{
				sdWorld.last_frame_time = stuff_arr[ 7 ] || 0;
				sdWorld.last_slowest_class = stuff_arr[ 8 ] || '';
			}
			
			let message_id_to_report = ( stuff_arr[ 9 ] === undefined ) ? -1 : stuff_arr[ 9 ];

			sdRenderer.line_of_sight_mode = stuff_arr[ 10 ] || 0;
			
			if ( message_id_to_report !== -1 )
			messages_to_report_arrival.push( message_id_to_report );

			// snapshot
			sdWorld.unresolved_entity_pointers = [];
			{
				let new_snapshot_entities = [];
				for ( var i = 0; i < snapshot.length; i++ )
				{
					{
						let ent = sdEntity.GetObjectFromSnapshot( snapshot[ i ] );

						if ( ent )
						new_snapshot_entities.push( ent );
					}
				}

				for ( var i = 0; i < old_snapshot_entities.length; i++ )
				{
					if ( new_snapshot_entities.indexOf( old_snapshot_entities[ i ] ) === -1 )
					{
						if ( !old_snapshot_entities[ i ].is_static ) // Keep statics
						old_snapshot_entities[ i ].remove();
					}
				}
				old_snapshot_entities = new_snapshot_entities;

				if ( sdWorld.my_entity === null || sdWorld.my_entity_net_id !== sdWorld.my_entity._net_id )
				sdWorld.ResolveMyEntityByNetId();
			}
			sdWorld.SolveUnresolvedEntityPointers();
			sdWorld.unresolved_entity_pointers = null;
			
			//sdEntity.entities.sort( (a,b)=>{ return a._net_id-b._net_id; } ); // Sort so sdQuadro's body is behind wheels

			// score
			sdWorld.my_score = score;

			// leaders
			if ( leaders )
			{
				sdWorld.leaders = leaders[ 0 ];
				globalThis.players_playing = leaders[ 1 ];
			}

			// sd_events
			for ( var i = 0; i < sd_events.length; i++ )
			{
				var type = sd_events[ i ][ 0 ];
				var params = sd_events[ i ][ 1 ];
				
				if ( params.UC === undefined )
				{
					if ( typeof assumptions_event_types[ type ] === 'undefined' )
					{
						assumptions_event_types[ type ] = true;
						console.log('Client is assuming that sd_event of type "' + type + '" is not important and does not requires data to be resent on loss. Example: ', params );
					}
				}
				else
				{

					if ( played_events.indexOf( params.UC ) !== -1 )
					continue;

					if ( played_events.length > 100 ) // Not best solution, better solution would be to keep time of each event and remove it after 5000 - 10000 ms
					played_events.pop();

					played_events.unshift( params.UC );
				}

				if ( type === 'EFF' ) // particles
				{
					var ef = new sdEffect( params );
					sdEntity.entities.push( ef );
				}
				else
				if ( type === 'S' ) // sound
				{
					params._server_allowed = true;
					sdSound.PlaySound( params );
				}
				else
				if ( type === 'ONLINE' ) // update online stats (in-game only)
				{
					globalThis.players_online = params[ 0 ];
					globalThis.players_playing = params[ 1 ];
				}
				else
				if ( type === 'UI_REPLY' ) // update online stats (in-game only)
				{
					sdInterface.UI_REPLY_Handle( params[ 0 ], params[ 1 ] );
				}
				else
				if ( type === 'C' ) // position correction failed
				{
					if ( sdWorld.my_entity )
					{
						sdWorld.my_entity.x = params[ 0 ];
						sdWorld.my_entity.y = params[ 1 ];
						sdWorld.my_entity.sx = params[ 2 ];
						sdWorld.my_entity.sy = params[ 3 ];
					}
				}
				else
				debugger;
			}

			// server-side velocity changes
			if ( sdWorld.my_entity )
			{
				sdWorld.my_entity.sx += _force_add_sx;
				sdWorld.my_entity.sy += _force_add_sy;
				sdWorld.my_entity._position_velocity_forced_until = _position_velocity_forced_until;
			}
			
			if ( sdWorld.time < Date.now() - 5000 ) // Socket data received but world logic timer is not working (happens and can cause active entity flood). Problem is entity removal won't happen without world timer
			{
				//debugger;
				sdWorld.HandleWorldLogic();
			}
		});


		socket.on( 'ZOOM', ( v )=>
		{
			sdWorld.current_zoom = v;
			window.onresize();
		});

		socket.on( 'SERVICE_MESSAGE', ( arr )=>
		{
			sdRenderer.service_mesage_until = sdWorld.time + 6500;
			sdRenderer.service_mesage = arr[ 0 ];
			sdRenderer.service_mesage_untranslateables = arr[ 1 ];
		});
		
		socket.on( 'CLASS_CMD', ( class_object_name, command_name, parameters_array )=>
		{
			sdWorld.entity_classes[ class_object_name ].ReceivedCommandFromEntityClass( command_name, parameters_array );
		});
		
		socket.on( 'SET_CLIPBOARD', ( v )=>
		{
			v = v.split( '{GAME_URL}' ).join( window.location.href );
			
			navigator.clipboard.writeText( v ).then( ()=>
			{
				sdRenderer.service_mesage_until = sdWorld.time + 15000;
				sdRenderer.service_mesage = 'URL has been copied to clipboard. Now, go to "Star Defenders 2D notificator" application and press "Add new listener by URL". Copied URL is the URL you should paste there.';
			} );
			
		});
		

		socket.on( 'SET sdWorld.my_entity._god', ( v )=>
		{
			if ( sdWorld.my_entity )
			sdWorld.my_entity._god = v;
		});
		socket.on( 'SET sdWorld.my_entity', ( _net_id )=>
		{
			sdWorld.my_entity_net_id = _net_id;

			/*try 
			{
				localStorage.setItem( 'my_net_id', _net_id );
			} catch(e){}*/

			sdWorld.ResolveMyEntityByNetId();
		});
		
		socket.on( 'REMOVE sdWorld.my_entity', ( _net_id )=>
		{
			sdWorld.my_entity_net_id = -101;
			
			if ( sdWorld.my_entity )
			if ( sdWorld.my_entity._net_id === _net_id )
			sdWorld.my_entity.remove();
		});
		socket.on( 'SET sdShop.options', ( arr )=>
		{
			sdShop.options = JSON.parse( LZW.lzw_decode( arr ) );
		});	
		socket.on( 'ONLINE', ( arr )=> // Character customization screen -only
		{
			globalThis.players_online = arr[ 0 ];
			globalThis.players_playing = arr[ 1 ];
		});
		socket.on( 'UI_REPLY', ( params )=>
		{
			sdInterface.UI_REPLY_Handle( params[ 0 ], params[ 1 ] );
		});
		
		let supported_languages = [ 'en' ];
		function UpdateLanguageBar()
		{
			let langs_container = document.getElementById( 'langs_container' );
			langs_container.innerHTML = '';
			
			for ( let i = 0; i < supported_languages.length; i++ )
			{
				let lang = supported_languages[ i ];
				let a = document.createElement('a');
				
				a.onclick = ()=>
				{
					sdTranslationManager.language = lang;
					sdTranslationManager.RequireSync();
					
					localStorage.setItem( 'language', lang );
					
					UpdateLanguageBar();
				};
				a.textContent = lang;
				a.style.marginLeft = '10px';
				
				if ( lang === sdTranslationManager.language )
				a.style.color = '#ffffff';
				
				langs_container.append( a );
			}
		}
		UpdateLanguageBar();
		socket.on( 'INIT', ( obj )=>
		{
			document.getElementById( 'game_title_text' ).textContent = T(obj.game_title);
			document.body.style.backgroundColor = obj.backgroundColor;
			
			if ( obj.supported_languages )
			supported_languages = obj.supported_languages;
			
			UpdateLanguageBar();
		});
		socket.on( 'REQUIRE_PASSWORD', ( message_and_color )=>
		{
			sdWorld.Stop();
			sdWorld.RequirePassword( message_and_color );
		});
		socket.on( 'BACK_TO_MENU', ( delay )=>
		{
			setTimeout( ()=>
			{
				sdWorld.Stop();
			}, delay );
		});
		socket.on( 'OPEN_INTERFACE', ( obj )=> // Such as sdDatabaseEditor
		{
			globalThis[ obj ].Open();
		});
		socket.on( 'DB_SCAN_RESULT', ( obj )=> // Such as sdDatabaseEditor
		{
			sdDatabaseEditor.OnScanResult( obj[ 0 ], obj[ 1 ] );
		});
		socket.on( 'T', ( arr )=> // Translations arrived
		{
			let lang = arr.shift();
			for ( let i = 0; i < arr.length; i++ )
			{
				sdTranslationManager.TranslationArrived( lang, arr[ i ][ 0 ], arr[ i ][ 1 ] );
			}
		});
		
		
		socket.on( 'UPGRADE_SET', ( arr )=>
		{
			if ( sdWorld.my_entity )
			{
				// Same at sdWorld.ResolveMyEntityByNetId()
				sdWorld.my_entity._upgrade_counters[ arr[ 0 ] ] = arr[ 1 ];
				
				if ( sdShop.upgrades[ arr[ 0 ] ] )
				sdShop.upgrades[ arr[ 0 ] ].action( sdWorld.my_entity, arr[ 1 ] );
			}
			else
			{
				// Delay
				if ( !sdWorld.my_entity_upgrades_later_set_obj )
				sdWorld.my_entity_upgrades_later_set_obj = {};
			
				sdWorld.my_entity_upgrades_later_set_obj[ arr[ 0 ] ] = arr[ 1 ];
			}
		});	



		socket.last_sync = sdWorld.time;

		socket.max_update_rate = SOCKET_IO_MODE ? sdWorld.max_update_rate : 16;
	}
	
	//let last_sent_snapshot = [];
	let frame = 0;
	const logic = ()=>
	{
		try
		{
			sdWorld.HandleWorldLogic( frame );

			const isTransportWritable = socket.io.engine &&
										socket.io.engine.transport &&
										socket.io.engine.transport.writable &&
										socket.connected;

			if ( sdWorld.time > socket.last_sync + socket.max_update_rate )
			if ( isTransportWritable )
			{
				socket.last_sync = sdWorld.time;

				if ( sdWorld.my_entity )
				if ( !sdWorld.my_entity._is_being_removed )
				{
					// Aim assist for case of laggy connections. It copies most probably accuracy offset from client side so server can repeat it (and still be able to do prediction shots to a moving targets)
					let look_at_net_id = -1;
					let look_at_relative_to_direct_angle = 0;
					
					const custom_filtering_method = ( ent )=>
					{
						if ( ent === sdWorld.my_entity.driver_of || !ent.IsTargetable( null, true ) )
						return false;
						
						if ( ent._net_id !== undefined )
						return true;
					
						return false;
					};
					
					let steps = 10;
					let angle_half = Math.PI / 4;

					let current_angle = Math.atan2( sdWorld.my_entity.look_x - sdWorld.my_entity.x, sdWorld.my_entity.look_y - sdWorld.my_entity.y );

					for ( let a = 0; a < steps; a++ )
					for ( let s = -1; s <= 1; s += 2 )
					{
						if ( a === 0 )
						if ( s === 1 )
						continue;
						
						let an = a / steps * angle_half;
						
						let x2 = sdWorld.my_entity.x + Math.sin( current_angle + an ) * 800 * ( 1 - a / steps );
						let y2 = sdWorld.my_entity.y + Math.cos( current_angle + an ) * 800 * ( 1 - a / steps );
						
						sdWorld.last_hit_entity = null;
						sdWorld.TraceRayPoint( sdWorld.my_entity.x, sdWorld.my_entity.y, x2, y2, sdWorld.my_entity, null, null, custom_filtering_method );
						if ( sdWorld.last_hit_entity )
						{
							look_at_net_id = sdWorld.last_hit_entity._net_id;
							
							look_at_relative_to_direct_angle = Math.atan2( sdWorld.last_hit_entity.x + ( sdWorld.last_hit_entity._hitbox_x1 + sdWorld.last_hit_entity._hitbox_x2 ) / 2 - sdWorld.my_entity.x, 
																		   sdWorld.last_hit_entity.y + ( sdWorld.last_hit_entity._hitbox_y1 + sdWorld.last_hit_entity._hitbox_y2 ) / 2 - sdWorld.my_entity.y ) - 
															   current_angle;
							
							//let ent = new sdEffect({ x: sdWorld.last_hit_entity.x, y: sdWorld.last_hit_entity.y, x2:sdWorld.my_entity.x, y2:sdWorld.my_entity.y, type:sdEffect.TYPE_BEAM, color:'#00FF00' });
							//sdEntity.entities.push( ent );
							
							a = steps;
							s = 1;
							break;
						}
					}
					
					let new_snapshot = [ 
						Math.round( sdWorld.my_entity.look_x ), // 0
						Math.round( sdWorld.my_entity.look_y ), // 1
						Math.round( sdWorld.camera.x ), // 2
						Math.round( sdWorld.camera.y ), // 3
						sdWorld.camera.scale, // 4
						Math.round( sdWorld.my_entity.x * 100 ) / 100, // 5
						Math.round( sdWorld.my_entity.y * 100 ) / 100, // 6
						( sdWorld.my_entity.stands && sdWorld.my_entity._stands_on ) ? sdWorld.my_entity._stands_on._net_id : -1, // 7
						messages_to_report_arrival, // 8
						look_at_net_id, // 9
						look_at_relative_to_direct_angle // 10
					];
					
					//let will_send = ( messages_to_report_arrival.length > 0 ); // Hopefully it will help to prevent high message rate when server can't handle them in time?
					
					//if ( will_send ) Rare look_at data send can cause player to shoot at previous look_at targets
					//{
						socket.volatile.emit( 'M', new_snapshot );
						
						/*setTimeout(()=>{ // Hack
							socket.volatile.emit( 'M', new_snapshot );
						},200);*/

						//last_sent_snapshot = new_snapshot;

						if ( messages_to_report_arrival.length > 0 )
						messages_to_report_arrival = [];
					//}
				}
			
				if ( sd_events.length > 0 )
				{
					if ( sd_events.length > 32 )
					{
						socket.emit( 'Kv2', sd_events.slice( 0, 32 ) );
						sd_events = sd_events.slice( 32 );
						globalThis.sd_events = sd_events; // Just in case?
						console.log('Too many events to server are being sent (' + sd_events.length + ') - this might cause input delay on server-side');
					}
					else
					{
						socket.emit( 'Kv2', sd_events );
						sd_events.length = 0;
					}
				}
			}

			sdRenderer.Render( frame );
		}
		catch( e )
		{
			sdRenderer.service_mesage_until = sdWorld.time + 5000;
			sdRenderer.service_mesage = 'Game/render logic error! ' + e;
			debugger;
		}
		
		if ( globalThis.frame_by_frame )
		setTimeout( logic, 500 );
		else
		window.requestAnimationFrame( logic );
		
		frame++;
	};
	window.requestAnimationFrame( logic );
	
	globalThis.frame_by_frame = false;

	let key_states = new sdKeyStates();
	sdWorld.my_key_states = key_states;
	
	const KeyCodeRemap = {
		ArrowUp: 'KeyW',
		ArrowDown: 'KeyS',
		ArrowLeft: 'KeyA',
		ArrowRight: 'KeyD'
	};
	
	function IsGameFocused()
	{
		if ( document.activeElement !== sdRenderer.canvas && document.activeElement !== document.body )
		{
			if ( document.activeElement.contentEditable || ( document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text' ) || document.activeElement.tagName === 'TEXTAREA' )
			return false;
		}
		return true;
	}
	
	window.onkeydown = async ( e )=>
	{
		if ( !IsGameFocused() )
		return true;
	
		if ( e.key === 'Escape' )
		{
			if ( sdContextMenu.open )
			{
				sdContextMenu.open = false;
			}
			else
			{
				sdWorld.hovered_entity = sdWorld.my_entity;
				sdContextMenu.Open();
			}

			e.preventDefault();
		}
	
		if ( sdShop.open )
		{
			if ( e.key === 'BrowserBack' )
			{
				sdShop.current_category = 'root';
				e.preventDefault();
				return false;
			}
		}
		
		if ( await sdChat.KeyDown( e ) )
		return;
	
		//if ( sdElement.current_hover )
		//return;
	
		let code = e.code;
		
		if ( KeyCodeRemap[ code ] )
		code = KeyCodeRemap[ code ];
		
		if ( code === 'KeyZ' )
		{
			if ( sdWorld.my_entity.workbench_level >= 10 )
			{
			if ( sdWorld.target_scale === 1.5 )
			window.onresize();
			else
			if ( sdWorld.target_scale === 8 )
			sdWorld.target_scale = 1.5;
			else
			sdWorld.target_scale = 8;
			}
			else
			{
			if ( sdWorld.target_scale === 8 )
			window.onresize();
			else
			sdWorld.target_scale = 8;
			}
		}
		
		if ( key_states.GetKey( code ) !== 1 )
		{
			key_states.SetKey( code, 1 );
			
			//socket.emit( 'K1', code );
			sd_events.push( [ 'K1', code ] );
		}
	
		if ( code === 'Tab' )
		if ( sdWorld.my_entity )
		{
			sdRenderer.show_leader_board++;
			if ( sdRenderer.show_leader_board > 3 )
			sdRenderer.show_leader_board = 0;
			e.preventDefault();
			console.log(sdRenderer.show_leader_board);
			return;
		}
		
		if ( code === 'KeyB' )
		{
			// Equip build tool, suggested by Maxteabag
			if ( sdWorld.my_entity )
			if ( sdWorld.my_entity.hea > 0 )
			if ( !sdWorld.my_entity._is_being_removed )
			if ( sdWorld.my_entity._inventory[ sdGun.classes[ sdGun.CLASS_BUILD_TOOL ].slot ] && 
			     ( sdWorld.my_entity._inventory[ sdGun.classes[ sdGun.CLASS_BUILD_TOOL ].slot ].class === sdGun.CLASS_BUILD_TOOL || sdWorld.my_entity._inventory[ sdGun.classes[ sdGun.CLASS_BUILD_TOOL ].slot ].class === sdGun.CLASS_BUILD_TOOL_MK2 || sdWorld.my_entity._inventory[ sdGun.classes[ sdGun.CLASS_BUILD_TOOL ].slot ].class === sdGun.CLASS_CREATOR ) )
			{
				key_states.SetKey( 'Digit9', 1 );
				key_states.SetKey( 'Digit9', 0 );
				
				sd_events.push( [ 'K1', 'Digit9' ] );
				sd_events.push( [ 'K0', 'Digit9' ] );
				
				sdShop.open = true;
				//sdRenderer.UpdateCursor();
			}
			return;
		}
		else
		if ( code === 'Escape' || code === 'Space' || ( code === 'KeyR' && sdWorld.mobile ) )
		{
			//if ( sdWorld.my_entity === null || sdWorld.my_entity.hea <= 0 || sdWorld.my_entity._is_being_removed )
			if ( sdWorld.my_entity_net_id === -101 || ( sdWorld.my_entity && sdWorld.my_entity.hea <= 0 ) )
			if ( sdRenderer.canvas.style.display === 'block' )
			{
				if ( code === 'Escape' )
				sdWorld.Stop();
			
				if ( code === 'Space' || code === 'KeyR' )
				sdWorld.Start( globalThis.GetPlayerSettings(), true );
			}
			return;
		}
		
		if ( typeof key_states.key_states[ code ] === 'undefined' )
		{
			sdRenderer.show_key_hints = 6;
		}
	};
	window.onkeypress = ( e )=>
	{
		if ( !IsGameFocused() )
		return true;
	
		sdChat.KeyPress( e );
	};
	window.onkeyup = ( e )=>
	{
		//if ( document.activeElement !== sdRenderer.canvas && document.activeElement !== document.body )
		//return true;
		
		if ( sdChat.KeyUp( e ) )
		{
			// Let release keys when chatting
		}
	
		//if ( sdElement.current_hover )
		//return;
	
		let code = e.code;
		
		if ( KeyCodeRemap[ code ] )
		code = KeyCodeRemap[ code ];
	
		if ( key_states.GetKey( code ) !== 0 )
		{
			key_states.SetKey( code, 0 );
			
			//socket.emit( 'K0', code );
			sd_events.push( [ 'K0', code ] );
			
		}
	};
	window.onmousemove = ( e )=>
	{
		//if ( e.target !== sdRenderer.canvas && e.target !==	document.firstChild )
		//return;
		
		
	
		if ( e.mobile_bypass )
		{
		}
		else
		{
			if ( sdWorld.mobile )
			return;
		}
		
		if ( held_mouse_buttons[ e.which ] )
		{
		}
		else
		{
			if ( e.target !== sdRenderer.canvas && e.target !==	document.firstChild )
			return;
		}
	
		//if ( sdElement.current_hover )
		//return;
	
		//if ( sdWorld.my_entity )
		//{
			sdWorld.mouse_screen_x = e.clientX * sdRenderer.resolution_quality;
			sdWorld.mouse_screen_y = e.clientY * sdRenderer.resolution_quality;
		//}
	};
	
	let held_mouse_buttons = [ false, false, false ];
	
	window.onmousedown = ( e )=>
	{
		if ( e.target !== sdRenderer.canvas && e.target !==	document.firstChild )
		return;
	
		/*if ( sdWorld.mobile )
		{
			sdSound.AllowSound();
			sdWorld.GoFullscreen();
		}*/
	
		if ( sdElement.current_hover )
		return;
		
		if ( sdRenderer.canvas.style.display !== 'block' )
		return;
		
		//sdSound.allowed = true;
		sdSound.AllowSound();
		
		if ( sdContextMenu.MouseDown( e ) )
		return;
	
		if ( sdShop.MouseDown( e ) )
		return;
	
		if ( sdWorld.mobile )
		{
			e.preventDefault();
			return;
		}
		
		let code = 'Mouse' + e.which;
		key_states.SetKey( code, 1 );
		
		//socket.emit( 'K1', code );
		sd_events.push( [ 'K1', code ] );
		
		held_mouse_buttons[ e.which ] = true;
		
		e.preventDefault();
	};
	window.onmouseup = ( e )=>
	{
		/*if ( e.target !== sdRenderer.canvas && e.target !==	document.firstChild )
		return;
	
		if ( sdRenderer.canvas.style.display !== 'block' )
		return;
	
		if ( sdElement.current_hover )
		return;*/
		
		if ( held_mouse_buttons[ e.which ] )
		{
			held_mouse_buttons[ e.which ] = false;
		}
		else
		return;
	
		if ( sdWorld.mobile )
		{
			e.preventDefault();
			return;
		}

		let code = 'Mouse' + e.which;
		key_states.SetKey( code, 0 );
		
		//socket.emit( 'K0', code );
		sd_events.push( [ 'K0', code ] );
		
		e.preventDefault();
	};
	window.oncontextmenu = (e)=>{
		
		if ( e.target !== sdRenderer.canvas && e.target !==	document.firstChild )
		return;
	
		if ( sdRenderer.canvas.style.display !== 'block' )
		return;
	
		if ( sdElement.current_hover )
		return;
	
		e.preventDefault();
	};
	window.onmousewheel = (e)=>
	{
		if ( e.target !== sdRenderer.canvas && e.target !==	document.firstChild )
		return;
	
		if ( sdRenderer.canvas.style.display !== 'block' )
		return;
	
		if ( sdElement.current_hover )
		return;
	
		if ( !sdShop.open )
		if ( sdWorld.my_entity )
		{
			let dir = ( e.deltaY < 0 ) ? 1 : -1;
			
			let i = sdWorld.my_entity.gun_slot;
			
			for ( let t = 0; t < 10; t++ )
			{
				if ( i >= sdWorld.my_entity._inventory.length )
				i = 0;
				else
				if ( i < 0 )
				i = sdWorld.my_entity._inventory.length - 1;
						
				if ( t !== 0 )
				if ( sdWorld.my_entity._inventory[ i ] )
				{
					key_states.SetKey( 'Digit' + i, 1 );
					key_states.SetKey( 'Digit' + i, 0 );

					sd_events.push( [ 'K1', 'Digit' + i ] );
					sd_events.push( [ 'K0', 'Digit' + i ] );

					break;
				}
				
				i += dir;
			}
		}
	
		sdShop.MouseWheel( e );
	};
	
	socket.open();