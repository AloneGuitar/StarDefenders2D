
import sdWorld from '../sdWorld.js';
import sdSound from '../sdSound.js';
import sdEntity from './sdEntity.js';
import sdEffect from './sdEffect.js';
import sdGun from './sdGun.js';
import sdWater from './sdWater.js';
import sdCom from './sdCom.js';
import sdBullet from './sdBullet.js';
import sdCube from './sdCube.js';
import sdLost from './sdLost.js';
import sdCrystal from './sdCrystal.js';
import sdCharacter from './sdCharacter.js';
import sdDrone from './sdDrone.js';
import sdFactions from './sdFactions.js';

// This is an entity which spawns humanoids and drones of specific factions inside generated outposts.

class sdFactionSpawner extends sdEntity
{
	static init_class()
	{
		sdFactionSpawner.img_falkok_spawner = sdWorld.CreateImageFromFile( 'falkok_teleporter' );
		sdFactionSpawner.img_falkok_spawner2 = sdWorld.CreateImageFromFile( 'falkok_teleporter2' );
		sdFactionSpawner.img_falkok_spawner3 = sdWorld.CreateImageFromFile( 'falkok_teleporter3' );
		sdFactionSpawner.img_falkok_spawner4 = sdWorld.CreateImageFromFile( 'falkok_teleporter4' );
		sdFactionSpawner.img_falkok_spawner5 = sdWorld.CreateImageFromFile( 'falkok_teleporter5' );
		sdFactionSpawner.img_falkok_spawner6 = sdWorld.CreateImageFromFile( 'falkok_teleporter6' );
		sdFactionSpawner.img_falkok_spawner7 = sdWorld.CreateImageFromFile( 'falkok_teleporter7' );
		sdFactionSpawner.img_falkok_spawner8 = sdWorld.CreateImageFromFile( 'falkok_teleporter8' );
		sdFactionSpawner.img_falkok_spawner9 = sdWorld.CreateImageFromFile( 'falkok_teleporter9' );

		sdFactionSpawner.falkok_spawners = 0;
		sdFactionSpawner.sarrorian_spawners = 0;
		sdFactionSpawner.council_spawners = 0;
		sdFactionSpawner.tzyrg_spawners = 0;
		sdFactionSpawner.velox_spawners = 0;
		sdFactionSpawner.setr_spawners = 0;
		sdFactionSpawner.erthal_spawners = 0;
		sdFactionSpawner.kvt_spawners = 0;
		sdFactionSpawner.sd_spawners = 0;
		sdFactionSpawner.shurg_spawners = 0;

		sdFactionSpawner.FALKOK_SPAWNER = 1;
		sdFactionSpawner.SARRORIAN_SPAWNER = 4;
		sdFactionSpawner.COUNCIL_SPAWNER = 3;
		sdFactionSpawner.TZYRG_SPAWNER = 8;
		sdFactionSpawner.VELOX_SPAWNER = 5;
		sdFactionSpawner.SETR_SPAWNER = 7;
		sdFactionSpawner.ERTHAL_SPAWNER = 2;
		sdFactionSpawner.KVT_SPAWNER = 11;
		sdFactionSpawner.SD_SPAWNER = 10;
		sdFactionSpawner.SHURG_SPAWNER = 9;
	
		sdWorld.entity_classes[ this.name ] = this; // Register for object spawn
	}
	get hitbox_x1() { return -20; }
	get hitbox_x2() { return 20; }
	get hitbox_y1() { return 12; }
	get hitbox_y2() { return 16; }
	
	get hard_collision() // For world geometry where players can walk
	{ return true; }
	
	constructor( params )
	{
		super( params );
		

		this._regen_timeout = 0;

		this.type = params.type || 1;

		this.hmax = 3000;
		this.hea = this.hmax;
		this._last_damage = 0; // Sound flood prevention
		this._next_spawn_in = 30 * 15; // TImer for spawning entities

		if ( this.type === sdFactionSpawner.FALKOK_SPAWNER )
		sdFactionSpawner.falkok_spawners++;
		if ( this.type === sdFactionSpawner.SARRORIAN_SPAWNER )
		sdFactionSpawner.sarrorian_spawners++;
		if ( this.type === sdFactionSpawner.VELOX_SPAWNER )
		sdFactionSpawner.velox_spawners++;
		if ( this.type === sdFactionSpawner.SETR_SPAWNER )
		sdFactionSpawner.setr_spawners++;
		if ( this.type === sdFactionSpawner.TZYRG_SPAWNER )
		sdFactionSpawner.tzyrg_spawners++;
		if ( this.type === sdFactionSpawner.ERTHAL_SPAWNER )
		sdFactionSpawner.erthal_spawners++;
		if ( this.type === sdFactionSpawner.KVT_SPAWNER )
		sdFactionSpawner.kvt_spawners++;
		if ( this.type === sdFactionSpawner.SD_SPAWNER )
		sdFactionSpawner.sd_spawners++;
		if ( this.type === sdFactionSpawner.SHURG_SPAWNER )
		sdFactionSpawner.shurg_spawners++;
	}

	get is_static() // Static world objects like walls, creation and destruction events are handled manually. Do this._update_version++ to update these
	{ return true; }

	Damage( dmg, initiator=null )
	{
		if ( !sdWorld.is_server )
		return;
	
		dmg = Math.abs( dmg );
		
		let was_alive = this.hea > 0;
		
		this.hea -= dmg;

		this._regen_timeout = 60;
		
		if ( this.hea <= 0 && was_alive )
		{
			this.remove();
		}
		
	}
	onThink( GSPEED ) // Class-specific, if needed
	{
		if ( !sdWorld.is_server )
		return;

		if ( this._regen_timeout > 0 )
		this._regen_timeout -= GSPEED;
		else
		this.hea = Math.min( this.hea + GSPEED, this.hmax );

		if ( this._next_spawn_in > 0 )
		this._next_spawn_in -= GSPEED;
		else
		if ( this.CanMoveWithoutOverlap( this.x, this.y - 8, 4 ) )
		{

			let ais = 0;
			for ( var i = 0; i < sdCharacter.characters.length; i++ )

			if ( sdCharacter.characters[ i ].hea > 0 )
			if ( !sdCharacter.characters[ i ]._is_being_removed )
			if ( sdCharacter.characters[ i ]._ai )
			if ( sdCharacter.characters[ i ]._ai_team === this.type )
			{
				ais++;
			}

			if ( this.type === sdFactionSpawner.FALKOK_SPAWNER && ais < sdWorld.entity_classes.sdWeather.only_instance._max_ai_count ) // Falkok spawner
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });
				this._next_spawn_in = 30 * 15;
				{
					let character_entity = new sdCharacter({ x:this.x, y:this.y - 8, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
					sdEntity.entities.push( character_entity );
					{
						{	
							{
								sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_FALKOK );
							}
						}
					}
				}
			}

			if ( this.type === sdFactionSpawner.SARRORIAN_SPAWNER && ais < sdWorld.entity_classes.sdWeather.only_instance._max_ai_count )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });
				this._next_spawn_in = 30 * 15;
				{
					let character_entity = new sdCharacter({ x:this.x, y:this.y - 8, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
					sdEntity.entities.push( character_entity );
					{
						{	
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
					}
				}
			}

			if ( this.type === sdFactionSpawner.VELOX_SPAWNER && ais < sdWorld.entity_classes.sdWeather.only_instance._max_ai_count )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });
				this._next_spawn_in = 30 * 15;
				{
					let character_entity = new sdCharacter({ x:this.x, y:this.y - 8, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
					sdEntity.entities.push( character_entity );
					{
						{	
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
					}
				}
			}

			if ( this.type === sdFactionSpawner.SETR_SPAWNER && ais < sdWorld.entity_classes.sdWeather.only_instance._max_ai_count )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });
				this._next_spawn_in = 30 * 15;
				{
					let character_entity = new sdCharacter({ x:this.x, y:this.y - 8, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
					sdEntity.entities.push( character_entity );
					{
						{	
							{
								sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_SETR );
							}
						}
					}
				}
			}

			if ( this.type === sdFactionSpawner.TZYRG_SPAWNER && ais < sdWorld.entity_classes.sdWeather.only_instance._max_ai_count )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });
				this._next_spawn_in = 30 * 15;
				{
					let character_entity = new sdCharacter({ x:this.x, y:this.y - 8, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
					sdEntity.entities.push( character_entity );
					{
						{	
							{
								sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_TZYRG );
							}
						}
					}
				}
			}
			if ( this.type === sdFactionSpawner.ERTHAL_SPAWNER && ais < sdWorld.entity_classes.sdWeather.only_instance._max_ai_count )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });
				this._next_spawn_in = 30 * 15;
				{
					let character_entity = new sdCharacter({ x:this.x, y:this.y - 8, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
					sdEntity.entities.push( character_entity );
					{
						{	
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
					}
				}
			}

			if ( this.type === sdFactionSpawner.SHURG_SPAWNER && ais < sdWorld.entity_classes.sdWeather.only_instance._max_ai_count )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });
				this._next_spawn_in = 30 * 15;
				{
					let character_entity = new sdCharacter({ x:this.x, y:this.y - 8, _ai_enabled:sdCharacter.AI_MODEL_FALKOK });
					sdEntity.entities.push( character_entity );
					{
						{	
							{
								sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_SHURG );
							}
						}
					}
				}
			}

			if ( this.type === sdFactionSpawner.KVT_SPAWNER && ais < sdWorld.entity_classes.sdWeather.only_instance._max_ai_count )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });
				this._next_spawn_in = 30 * 15;
				{
					let character_entity = new sdCharacter({ x:this.x, y:this.y - 8, _ai_enabled:sdCharacter.AI_MODEL_TEAMMATE });
					sdEntity.entities.push( character_entity );
					{
						{	
							{
								sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_KVT );
							}
						}
					}
				}
			}
			if ( this.type === sdFactionSpawner.SD_SPAWNER && ais < sdWorld.entity_classes.sdWeather.only_instance._max_ai_count )
			{
				sdSound.PlaySound({ name:'teleport', x:this.x, y:this.y, pitch: 1, volume:1 });
				sdWorld.SendEffect({ x:this.x, y:this.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });
				this._next_spawn_in = 30 * 15;
				{
					let character_entity = new sdCharacter({ x:this.x, y:this.y - 8, _ai_enabled:sdCharacter.AI_MODEL_TEAMMATE });
					sdEntity.entities.push( character_entity );
					{
						{	
							{
								sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_SD );
							}
						}
					}
				}
			}
		}
	}
	
	DrawHUD( ctx, attached ) // foreground layer
	{
		if ( this.type === sdFactionSpawner.FALKOK_SPAWNER )
		sdEntity.Tooltip( ctx, "Falkonian teleporter" );
		if ( this.type === sdFactionSpawner.SARRORIAN_SPAWNER )
		sdEntity.Tooltip( ctx, "Sarrorian teleporter" );
		if ( this.type === sdFactionSpawner.VELOX_SPAWNER )
		sdEntity.Tooltip( ctx, "Velox teleporter" );
		if ( this.type === sdFactionSpawner.SETR_SPAWNER )
		sdEntity.Tooltip( ctx, "Setr teleporter" );
		if ( this.type === sdFactionSpawner.TZYRG_SPAWNER )
		sdEntity.Tooltip( ctx, "Tzyrg teleporter" );
		if ( this.type === sdFactionSpawner.ERTHAL_SPAWNER )
		sdEntity.Tooltip( ctx, "Erthal teleporter" );
		if ( this.type === sdFactionSpawner.KVT_SPAWNER )
		sdEntity.Tooltip( ctx, "KVT teleporter" );
		if ( this.type === sdFactionSpawner.SD_SPAWNER )
		sdEntity.Tooltip( ctx, "Star Defender teleporter" );
		if ( this.type === sdFactionSpawner.SHURG_SPAWNER )
		sdEntity.Tooltip( ctx, "Shurg teleporter" );
	
	}
	Draw( ctx, attached )
	{
		ctx.apply_shading = false;
		//ctx.filter = this.filter;
		
		if ( this.type === sdFactionSpawner.FALKOK_SPAWNER ) // Falkok spawner
		{
			ctx.drawImageFilterCache( sdFactionSpawner.img_falkok_spawner, - 24, - 16, 48,32 );
		}
		if ( this.type === sdFactionSpawner.SARRORIAN_SPAWNER )
		{
			ctx.drawImageFilterCache( sdFactionSpawner.img_falkok_spawner2, - 24, - 16, 48,32 );
		}
		if ( this.type === sdFactionSpawner.VELOX_SPAWNER )
		{
			ctx.drawImageFilterCache( sdFactionSpawner.img_falkok_spawner3, - 24, - 16, 48,32 );
		}
		if ( this.type === sdFactionSpawner.SETR_SPAWNER )
		{
			ctx.drawImageFilterCache( sdFactionSpawner.img_falkok_spawner4, - 24, - 16, 48,32 );
		}
		if ( this.type === sdFactionSpawner.TZYRG_SPAWNER )
		{
			ctx.drawImageFilterCache( sdFactionSpawner.img_falkok_spawner5, - 24, - 16, 48,32 );
		}
		if ( this.type === sdFactionSpawner.ERTHAL_SPAWNER )
		{
			ctx.drawImageFilterCache( sdFactionSpawner.img_falkok_spawner6, - 24, - 16, 48,32 );
		}
		if ( this.type === sdFactionSpawner.KVT_SPAWNER )
		{
			ctx.drawImageFilterCache( sdFactionSpawner.img_falkok_spawner7, - 24, - 16, 48,32 );
		}
		if ( this.type === sdFactionSpawner.SD_SPAWNER )
		{
			ctx.drawImageFilterCache( sdFactionSpawner.img_falkok_spawner8, - 24, - 16, 48,32 );
		}
		if ( this.type === sdFactionSpawner.SHURG_SPAWNER )
		{
			ctx.drawImageFilterCache( sdFactionSpawner.img_falkok_spawner9, - 24, - 16, 48,32 );
		}

		ctx.globalAlpha = 1;
		ctx.filter = 'none';
	}
	/*onMovementInRange( from_entity )
	{
		//this._last_stand_on = from_entity;
	}*/
	onRemove() // Class-specific, if needed
	{
		if ( this.type === sdFactionSpawner.FALKOK_SPAWNER )
		sdFactionSpawner.falkok_spawners--;
		if ( this.type === sdFactionSpawner.SARRORIAN_SPAWNER )
		sdFactionSpawner.sarrorian_spawners--;
		if ( this.type === sdFactionSpawner.VELOX_SPAWNER )
		sdFactionSpawner.velox_spawners--;
		if ( this.type === sdFactionSpawner.SETR_SPAWNER )
		sdFactionSpawner.setr_spawners--;
		if ( this.type === sdFactionSpawner.TZYRG_SPAWNER )
		sdFactionSpawner.tzyrg_spawners--;
		if ( this.type === sdFactionSpawner.ERTHAL_SPAWNER )
		sdFactionSpawner.erthal_spawners--;
		if ( this.type === sdFactionSpawner.KVT_SPAWNER )
		sdFactionSpawner.kvt_spawners--;
		if ( this.type === sdFactionSpawner.SD_SPAWNER )
		sdFactionSpawner.sd_spawners--;
		if ( this.type === sdFactionSpawner.SHURG_SPAWNER )
		sdFactionSpawner.shurg_spawners--;

		sdWorld.BasicEntityBreakEffect( this, 10 );
	}
	MeasureMatterCost()
	{
		if ( this.type === 8 )
		return 18500; // Hack
		else
		if ( this.type === 1 )
		return 18750; // Hack
		else
		if ( this.type === 2 )
		return 19250; // Hack
		else
		if ( this.type === 7 )
		return 19500; // Hack
		else
		if ( this.type === 4 )
		return 19750; // Hack
		else
		if ( this.type === 5 )
		return 20000; // Hack
		else
		if ( this.type === 9 )
		return 19000; // Hack
		else
		if ( this.type === 11 )
		return 20250; // Hack
		else
		if ( this.type === 10 )
		return 19000; // Hack
	}
}
//sdFactionSpawner.init_class();

export default sdFactionSpawner;