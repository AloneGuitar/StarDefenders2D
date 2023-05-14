
import sdWorld from '../sdWorld.js';
import sdSound from '../sdSound.js';
import sdEntity from './sdEntity.js';
import sdEffect from './sdEffect.js';
import sdGun from './sdGun.js';
import sdWater from './sdWater.js';
import sdCom from './sdCom.js';
import sdTask from './sdTask.js';
import sdBullet from './sdBullet.js';
import sdCharacter from './sdCharacter.js';
import sdFactions from './sdFactions.js';
import sdStatusEffect from './sdStatusEffect.js';

class sdFactionTools extends sdEntity
{
	static init_class()
	{
		sdFactionTools.img_character_spawner = sdWorld.CreateImageFromFile( 'helmets/helmet_falkok' );
		sdFactionTools.img_character_spawner2 = sdWorld.CreateImageFromFile( 'helmets/helmet_dino' );
		sdFactionTools.img_character_spawner3 = sdWorld.CreateImageFromFile( 'helmets/helmet_council' );
		sdFactionTools.img_character_spawner4 = sdWorld.CreateImageFromFile( 'helmets/helmet_mythic' );
		sdFactionTools.img_character_spawner5 = sdWorld.CreateImageFromFile( 'helmets/helmet_velox' );
		sdFactionTools.img_character_spawner6 = sdWorld.CreateImageFromFile( 'helmets/helmet_eyes' );
		sdFactionTools.img_character_spawner7 = sdWorld.CreateImageFromFile( 'helmets/helmet_skeleton' );
		sdFactionTools.img_character_spawner8 = sdWorld.CreateImageFromFile( 'helmets/helmet_oxide' );
		sdFactionTools.img_character_spawner9 = sdWorld.CreateImageFromFile( 'helmets/helmet_cs' );
		sdFactionTools.img_character_spawner10 = sdWorld.CreateImageFromFile( 'helmets/helmet_star_defender' );
		sdFactionTools.img_character_spawner11 = sdWorld.CreateImageFromFile( 'helmets/helmet_omega' );
		sdFactionTools.img_character_spawner12 = sdWorld.CreateImageFromFile( 'helmets/helmet_forge' );
		sdFactionTools.img_character_spawner13 = sdWorld.CreateImageFromFile( 'helmets/helmet_blackguard' );

		sdFactionTools.FACTIONTOOL_FALKOK = 1; // Falkoks
		sdFactionTools.FACTIONTOOL_ERTHAL = 2; // Erthals
		sdFactionTools.FACTIONTOOL_COUNCIL = 3; // Council
		sdFactionTools.FACTIONTOOL_SARRORIAN = 4; // Sarrorian
		sdFactionTools.FACTIONTOOL_VELOX = 5; // Velox
		sdFactionTools.FACTIONTOOL_SETR = 6; // Setr
		sdFactionTools.FACTIONTOOL_TZYRG = 7; // Tzyrg
		sdFactionTools.FACTIONTOOL_SHURG = 8; // Shurg
		sdFactionTools.FACTIONTOOL_KVT = 9;
		sdFactionTools.FACTIONTOOL_SD = 10;
		sdFactionTools.FACTIONTOOL_SWORD_BOT = 11;
		sdFactionTools.FACTIONTOOL_TIME_SHIFTER = 12;
		sdFactionTools.FACTIONTOOL_SSO = 13;

		sdWorld.entity_classes[ this.name ] = this; // Register for object spawn
	}
	get hitbox_x1() { return 0; }
	get hitbox_x2() { return 0; }
	get hitbox_y1() { return 0; }
	get hitbox_y2() { return 0; }

	constructor( params )
	{
		super( params );

		this.type = params.type || 1;

		this.hmax = 100;
		this.hea = this.hmax;
	}
	Draw( ctx, attached )
	{
		ctx.apply_shading = false;
		//ctx.filter = this.filter;
		
		if ( this.type === sdFactionTools.FACTIONTOOL_FALKOK ) // Falkok spawner
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner, - 16, - 16, 32,32 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_SARRORIAN )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner4, - 16, - 16, 32,32 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_VELOX )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner5, - 16, - 16, 32,32 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_SETR )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner6, - 16, - 16, 32,32 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_TZYRG )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner7, - 16, - 16, 32,32 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_ERTHAL )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner2, - 32, - 32, 64,64 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_KVT )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner9, - 16, - 16, 32,32 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_SD )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner10, - 16, - 48, 32,96 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_SHURG )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner8, - 16, - 16, 32,32 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_COUNCIL )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner3, - 16, - 16, 32,32 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_SWORD_BOT )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner11, - 16, - 16, 32,32 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_TIME_SHIFTER )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner12, - 16, - 16, 32,32 );
		}
		if ( this.type === sdFactionTools.FACTIONTOOL_SSO )
		{
			ctx.drawImageFilterCache( sdFactionTools.img_character_spawner13, - 16, - 16, 32,32 );
		}

		ctx.globalAlpha = 1;
		ctx.filter = 'none';
	}
	onThink( GSPEED ) // Class-specific, if needed
	{
		if ( !sdWorld.is_server )
		return;

		this.hea -= GSPEED;

		if ( this.hea < 95 )
		{
			if ( this.type === sdFactionTools.FACTIONTOOL_FALKOK ) // Falkok spawner
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_FALKOK );
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_SARRORIAN )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_SARRORIAN );

								const logic = ()=>
								{
								if ( character_entity.hea <= 800 && character_entity.s === 120 )
								if ( !character_entity._is_being_removed )
								{
									character_entity.stability_upgrade = 25;
									character_entity._damage_mult = 2.5;
								}
								};
								setInterval( logic, 0 );
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_VELOX )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_VELOX );

								const logic = ()=>
								{
								if ( character_entity.hea <= 700 && character_entity.s === 110 )
								if ( !character_entity._is_being_removed )
								{
									character_entity.stability_upgrade = 25;
									character_entity._damage_mult = 4;
								}
								};
								setInterval( logic, 0 );
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_SETR )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_SETR );
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_TZYRG )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_TZYRG );
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_ERTHAL )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_ERTHAL );

								const logic = ()=>
								{
								if ( character_entity.hea <= 2400 && character_entity.s === 140 )
								if ( !character_entity._is_being_removed )
								{
									character_entity.iron_fist = true;
									character_entity.s = 150;
									character_entity._damage_mult = 3.5;
								}
								};
								setInterval( logic, 0 );
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_SHURG )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_SHURG );
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_KVT )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_TEAMMATE });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_KVT );
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_SD )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_TEAMMATE });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_SD );
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_COUNCIL )
			{
				sdSound.PlaySound({ name:'council_teleport', x:this.x, y:this.y, volume:0.5 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_AGGRESSIVE });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_COUNCIL );

					const logic = ()=>
					{
					if ( character_entity.hea <= 0 )
					if ( !character_entity._is_being_removed )
					{
						sdSound.PlaySound({ name:'council_teleport', x:character_entity.x, y:character_entity.y, volume:0.5 });
						sdWorld.SendEffect({ x:character_entity.x, y:character_entity.y, type:sdEffect.TYPE_TELEPORT, hue:170 });
						character_entity.remove();
					}
					};
					setInterval( logic, 1000 );
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_SWORD_BOT )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_AGGRESSIVE });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_SWORD_BOT );

							if ( Math.random() < 0.5 )
							{
								const logic = ()=>
								{
									if ( character_entity.hea <= 10000  && character_entity.s === 250 )
									if ( !character_entity._is_being_removed )
									{
									character_entity.hea = 50000;
									character_entity.hmax = 50000;
									character_entity.matter = 60000;
									character_entity.matter_max = 60000;
									character_entity.s = 300;
									character_entity._damage_mult = 5;
									character_entity._jetpack_power = 10;
									character_entity.iron_fist = true;
									character_entity.iron_body = 2;

									let character_settings;
									character_settings = {"hero_name":"Blood Hunter","color_bright":"#404040","color_dark":"#303030","color_bright3":"#202020","color_dark3":"#101010","color_visor":"#FF0000","color_suit":"#404040","color_suit2":"#303030","color_dark2":"#202020","color_shoes":"#101010","color_skin":"#101010","color_extra1":"#FF0000","helmet1":false,"helmet40":true,"body1":false,"legs1":false,"body86":true,"legs66":true,"voice1":false,"voice2":false,"voice10":true};

									character_entity.sd_filter = sdWorld.ConvertPlayerDescriptionToSDFilter_v2( character_settings );
									character_entity._voice = sdWorld.ConvertPlayerDescriptionToVoice( character_settings );
									character_entity.helmet = sdWorld.ConvertPlayerDescriptionToHelmet( character_settings );
									character_entity.body = sdWorld.ConvertPlayerDescriptionToBody( character_settings );
									character_entity.legs = sdWorld.ConvertPlayerDescriptionToLegs( character_settings );
									character_entity.title = character_settings.hero_name;

									let gun;
									gun = new sdGun({ x:character_entity.x, y:character_entity.y - 16, class:sdGun.CLASS_FALKONIAN_SWORD });
									sdEntity.entities.push( gun );
									}
								};
								setInterval( logic, 0 );

								const logic2 = ()=>
								{
									if ( character_entity.hea <= 0  && character_entity.s === 300 )
									if ( !character_entity._is_being_removed )
									{
										sdWorld.SendEffect({ 
										x:character_entity.x, 
										y:character_entity.y, 
										radius:150,
										damage_scale: 150,
										type:sdEffect.TYPE_EXPLOSION, 
										owner:character_entity,
										color:'#FF0000'});

									character_entity.remove();
									}
								};
								setInterval( logic2, 2000 );
							}
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_TIME_SHIFTER )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_AGGRESSIVE });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_TIME_SHIFTER );

			for ( let i = 0; i < sdWorld.sockets.length; i++ )
			{
				if ( !sdCharacter.characters[ i ]._is_being_removed )
				if ( sdWorld.sockets[ i ].character )
				if ( sdWorld.sockets[ i ].character.iron_fist )
				{
					if ( sdCharacter.characters[ i ]._ai_team === 10 && sdCharacter.characters[ i ].title === 'Time Shifter' )
					{
						let id = sdCharacter.characters[ i ]._net_id;
						for ( let j = 0; j < sdWorld.sockets.length; j++ )
						{
							sdTask.MakeSureCharacterHasTask({ 
							similarity_hash:'DESTROY-'+id, 
							executer: sdWorld.sockets[ j ].character,
							target: sdCharacter.characters[ i ],
							mission: sdTask.MISSION_DESTROY_ENTITY,
							difficulty: 0,
							title: 'Fight against the Time Shifter',
							description: 'Beat the Time Shifter and fight as a warrior, after beaten, you will get one of Time Shifter Blade.'
							});
						}
					}
					sdTask.MakeSureCharacterHasTask({ 
					similarity_hash:'DESTROY-'+character_entity._net_id, 
					executer: sdWorld.sockets[ i ].character,
					target: character_entity,
					mission: sdTask.MISSION_DESTROY_ENTITY,
					difficulty: 0,
					title: 'Fight against the Time Shifter',
					description: 'Beat the Time Shifter and fight as a warrior, after beaten, you will get one of Time Shifter Blade.'
					});
				}
			}
				}
			}
			else
			if ( this.type === sdFactionTools.FACTIONTOOL_SSO )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT });

				let character_entity = new sdCharacter({ x:this.x, y:this.y, _ai_enabled:sdCharacter.AI_MODEL_AGGRESSIVE });
				sdEntity.entities.push( character_entity );
				{
					sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_SSO );

			for ( let i = 0; i < sdWorld.sockets.length; i++ )
			{
				if ( !sdCharacter.characters[ i ]._is_being_removed )
				if ( sdWorld.sockets[ i ].character )
				{
					if ( sdCharacter.characters[ i ]._ai_team === 6 && sdCharacter.characters[ i ].title === 'Star Susanoo' )
					{
						let id = sdCharacter.characters[ i ]._net_id;
						for ( let j = 0; j < sdWorld.sockets.length; j++ )
						{
							sdTask.MakeSureCharacterHasTask({ 
							similarity_hash:'DESTROY-'+id, 
							executer: sdWorld.sockets[ j ].character,
							target: sdCharacter.characters[ i ],
							mission: sdTask.MISSION_DESTROY_ENTITY,
							difficulty: 2,
							title: 'Star Susanoo?',
							description: 'Be careful! Star Susanoos are overpowered! Try to upgrade yourself when you are ready for searching the overpowered one.'
							});
						}
					}
					sdTask.MakeSureCharacterHasTask({ 
					similarity_hash:'DESTROY-'+character_entity._net_id, 
					executer: sdWorld.sockets[ i ].character,
					target: character_entity,
					mission: sdTask.MISSION_DESTROY_ENTITY,
					difficulty: 2,
					title: 'Star Susanoo?',
					description: 'Be careful! Star Susanoos are overpowered! Try to upgrade yourself when you are ready for searching the overpowered one.'
					});
				}
			}
					const logic = ()=>
					{
						if ( !character_entity._is_being_removed )
						if ( character_entity.hea <= 40000 && character_entity.s === 150 )
						{
							let character_settings;
							character_settings = { "hero_name":"Death Charger", // Name
							"color_bright":"#c0c0c0", // Helmet bright color
							"color_dark":"#808080", // Helmet dark color
							"color_visor":"#320000", // Visor color
							"color_bright3":"#c0c0c0", // Jetpack (bright shade) color
							"color_dark3":"#808080", // Jetpack and armor plates (dark shade) color
							"color_suit":"#e1e1e1", // Upper suit color
							"color_suit2":"#808080", // Lower suit color
							"color_dark2":"#808080", // Lower suit plates color
							"color_shoes":"#808080", // Shoes color
							"color_skin":"#808080", // Gloves and neck color
							"color_extra1":"#320000", // Extra 1 color
							"helmet102":true,
							"body66":true,
							"legs68":true,
							"voice14":true };
							character_entity.helmet = sdWorld.ConvertPlayerDescriptionToHelmet( character_settings );
							character_entity.body = sdWorld.ConvertPlayerDescriptionToBody( character_settings );
							character_entity.legs = sdWorld.ConvertPlayerDescriptionToLegs( character_settings );
							character_entity.iron_fist = true;
							character_entity.matter = 900000;
							character_entity.matter_max = 900000;
							character_entity.hea = 150000;
							character_entity.hmax = 150000;
							character_entity.s = 170;
							character_entity._damage_mult = 6;
							character_entity._jetpack_power = 10;
						}
					};
					setInterval( logic, 0 );
				}
			}

			this.remove();
		}
	}
}

export default sdFactionTools;