import sdShop from '../client/sdShop.js';

import sdWorld from '../sdWorld.js';
import sdSound from '../sdSound.js';
import sdEntity from './sdEntity.js';
import sdEffect from './sdEffect.js';
import sdCharacter from './sdCharacter.js';
import sdGun from './sdGun.js';
import sdQuickie from './sdQuickie.js';
import sdAsp from './sdAsp.js';
import sdCrystal from './sdCrystal.js';
import sdBG from './sdBG.js';
import sdBlock from './sdBlock.js';
import sdCube from './sdCube.js';
import sdJunk from './sdJunk.js';
import sdLost from './sdLost.js';
import sdStorage from './sdStorage.js';
import sdAsteroid from './sdAsteroid.js';
import sdBeamProjector from './sdBeamProjector.js';
import sdBaseShieldingUnit from './sdBaseShieldingUnit.js';
import sdWeather from './sdWeather.js';
import sdFactions from './sdFactions.js';

import sdTask from './sdTask.js';


import sdRenderer from '../client/sdRenderer.js';


class sdRift extends sdEntity
{
	static init_class()
	{
		sdRift.img_rift_anim = sdWorld.CreateImageFromFile( 'rift_anim' );
		sdRift.portals = 0;
		sdWorld.entity_classes[ this.name ] = this; // Register for object spawn
	}
	get hitbox_x1() { return -7; }
	get hitbox_x2() { return 7; }
	get hitbox_y1() { return -15; }
	get hitbox_y2() { return 15; }

	get hard_collision()
	{ return false; }
	
	
	get is_static() // Static world objects like walls, creation and destruction events are handled manually. Do this._update_version++ to update these
	{ return false; }
	
	Damage( dmg, initiator=null ) // Not that much useful since it cannot be damaged by anything but matter it contains.
	{
		if ( !sdWorld.is_server )
		return;
	}
	constructor( params )
	{
		super( params );
		
		this.hmax = this.type === 5 ? 36000 : 2560; // a 2560 matter crystal is enough for a rift to be removed over time
		this.hea = this.hmax;
		this._regen_timeout = 0;
		//this._cooldown = 0;
		this.matter_crystal_max = 5120; // a 5K crystal is max what it can be fed with
		this.matter_crystal = 0; // Named differently to prevent matter absorption from entities that emit matter
		this._spawn_timer = params._spawn_timer || 30 * 60; // Either defined by spawn or 60 seconds
		this._spawn_timer_cd = this._spawn_timer; // Countdown/cooldown for spawn timer
		this._teleport_timer = 30 * 60 * 10; // Time for the portal to switch location
		this._time_until_teleport = this._teleport_timer;
		this.type = params.type || 1; // Default is the weakest variation of the rift ( Note: params.type as 0 will be defaulted to 1, implement typeof check here if 0 value is needed )
		this._rotate_timer = 10; // Timer for rotation sprite index
		this.frame = 0; // Rotation sprite index
		this.scale = 1; // Portal scaling when it's about to be destroyed/removed
		this.teleport_alpha = 0; // Alpha/transparency ( divided by 60 in draw code ) when portal is about to change location

		//this._pull_entities = []; // For dimensional tear

		/*if ( this.type === 1 )
		this.filter = 'hue-rotate(' + 75 + 'deg)';
		if ( this.type === 2 )
		this.filter = 'none';*/

		if ( this.type !== 5 ) // Council portals don't count towards other portal types so they don't prevent spawning of those other portals
		sdRift.portals++;
	}
	GetFilterColor()
	{
		/*if ( this.type === 1 )
		this.filter = 'hue-rotate(' + 75 + 'deg)';
		if ( this.type === 2 )
		this.filter = 'none';*/
	
		if ( this.type === 1 )
		return 'hue-rotate(' + 75 + 'deg)';
	
		if ( this.type === 2 )
		return 'none';

		if ( this.type === 3 )
		return 'hue-rotate(' + 180 + 'deg)';

		if ( this.type === 4 )
		return 'saturate(0.1) brightness(0.4)';

		if ( this.type === 5 )
		return 'brightness(2) saturate(0.1)';
	}
	MeasureMatterCost()
	{
		return 0; // Hack
	}
	onThink( GSPEED ) // Class-specific, if needed
	{
		if ( sdWorld.is_server )
		{
			if ( this._rotate_timer > 0 ) // Sprite animation handling
			this._rotate_timer -= GSPEED;
			else
			{
				this.frame++;
				
				if ( this.frame > 6 )
				this.frame = 0;
			
				this._rotate_timer = 10 * this.scale;
			}

			if ( this.type === 4 ) // Black portal / Black hole attack
			{
				/*this._pull_entities = [];
				let ents = sdWorld.GetAnythingNear( this.x, this.y, 192 );
				for ( let i = 0; i < ents.length; i++ )
				this._pull_entities.push( ents[ i ] );*/
				
				let range = 192;

				let pull_entities = this.GetAnythingNearCache( this.x, this.y, 192 );

				//Set task for players to remove the dimensional tear
				for ( let i = 0; i < sdWorld.sockets.length; i++ ) // Let players know that it needs to be closed
				{
					sdTask.MakeSureCharacterHasTask({ 
						similarity_hash:'DESTROY-'+this._net_id, 
						executer: sdWorld.sockets[ i ].character,
						target: this,
						mission: sdTask.MISSION_DESTROY_ENTITY,
						difficulty: 0.167 * sdTask.GetTaskDifficultyScaler(),		
						title: 'Close the dimensional tear',
						description: 'A dimensional tear appeared on this planet. It should be closed down before it destroys large chunks of the planet. We can close it using an Anti-crystal.'
					});
				}

				if ( pull_entities.length > 0 )
				for ( let i = 0; i < pull_entities.length; i++ )
				{
					let e = pull_entities[ i ];
					if ( !e._is_being_removed )
					{
						let xx = e.x + ( e._hitbox_x1 + e._hitbox_x2 ) / 2;
						let yy = e.y + ( e._hitbox_y1 + e._hitbox_y2 ) / 2;
						if ( sdWorld.CheckLineOfSight( this.x, this.y, xx, yy, e.IsBGEntity() !== 0 ? this : e ) ) // Ignored entity has effect on which layer raycast would be happening, so as fallback it will ignore portal
						{
							let dx = ( xx - this.x );
							let dy = ( yy - this.y );

							let di = sdWorld.Dist2D_Vector( dx, dy );

							if ( di < 1 )
							continue;

							let strength_damage_scale = Math.max( 0, Math.min( 1, 1 - di / range ) ) / 4;

							let strength = strength_damage_scale * 10 * GSPEED / di;

							let can_move = false;

							if ( typeof e.sx !== 'undefined' )
							if ( typeof e.sy !== 'undefined' )
							{
								can_move = true;

								e.sx -= dx * strength;
								e.sy -= dy * strength;
							}

							if ( e.is( sdBaseShieldingUnit ) )
							if ( e.enabled )
							{
								can_move = false;
							}

							e.PhysWakeUp();

							if ( e.is( sdCharacter ) )
							if ( !e._god )
							{
								e.stability = Math.max( -1, e.stability - strength );

								if ( e.gun_slot !== 9 )
								if ( sdWorld.Dist2D_Vector( e.sx, e.sy ) > 10 )
								e.DropWeapon( e.gun_slot );
							}

							if ( e.IsPlayerClass() )
							e.ApplyServerSidePositionAndVelocity( true, dx * strength, dy * strength );

							if ( e.is( sdBG ) )
							{
								if ( Math.random() < 0.01 )
								e.DamageWithEffect( 16 * strength_damage_scale );
							}
							else
							if ( e.is( sdGun ) )
							{
								if ( di < 20 )
								if ( !e._held_by )
								//if ( e.class === sdGun.CLASS_CRYSTAL_SHARD || e.class === sdGun.CLASS_SCORE_SHARD )
								e.remove();
							}
							else
							if ( !e.is( sdCrystal ) || !e.is_anticrystal ) // Otherwise anticrystals get removed without touching the rift // EG: Not sure if we want to damage other kinds of crystals though
							if ( typeof e._hea !== 'undefined' || typeof e.hea !== 'undefined' )
							{
								//if ( e.is( sdBlock ) )

								if ( di < 20 || !can_move )
								{
									e.DamageWithEffect( 8 * strength_damage_scale );

									if ( !e._is_being_removed )
									if ( ( e._hea || e.hea ) <= 0 )
									if ( e._hitbox_x2 - e._hitbox_x1 < 32 )
									if ( e._hitbox_y2 - e._hitbox_y1 < 32 )
									{
										e.remove();

										if ( e.is( sdStorage ) )
										{
											// Make it drop crystals
										}
										else
										e._broken = false;
									}
								}
							}
						}
					}
				}
			}
			
			if ( this._spawn_timer_cd > 0 ) // Spawn entity timer
			this._spawn_timer_cd -= GSPEED;
			if ( this._regen_timeout > 0 )
			this._regen_timeout -= GSPEED;
			else
			{
				if ( this.hea < this.hmax && this.type !== 5 && this.type !== 4 ) // Council portal fades away on it's own, dimensional tear too // Almost Copy [ 1 / 2 ]
				{
					this.hea = Math.min( this.hea + GSPEED, this.hmax );
				}
			}
			if ( this._spawn_timer_cd <= 0 ) // Spawn an entity
			if ( this.CanMoveWithoutOverlap( this.x, this.y, 0 ) )
			if ( this.type !== 4 ) // Black portals / Black holes do not spawn things
			{
				sdSound.PlaySound({ name:'rift_spawn1', x:this.x, y:this.y, volume:2 });
				
				// Delaying to match sound
				setTimeout( ()=>
				{

					if ( this.type === 1 ) // Quickies and Asps
					{
						let spawn_type = Math.random();
						if ( spawn_type < 0.333 )
						{
							if ( sdAsp.asps_tot < 25 ) // Same amount as in sdWeather
							{
								let asp = new sdAsp({ 
									x:this.x,
									y:this.y,
									_tier: 2
								});
								asp.filter = 'invert(1) sepia(1) saturate(100) hue-rotate(270deg) opacity(0.45)';
								sdEntity.entities.push( asp );
								sdWorld.UpdateHashPosition( asp, false ); // Prevent intersection with other ones
							}
						}
						else
						if ( sdQuickie.quickies_tot < 25 )
						{
							let quickie = new sdQuickie({ 
								x:this.x,
								y:this.y,
								_tier:2
							});
							//let quickie_filter = {};
							//let quickie_filter = sdWorld.CreateSDFilter();
								//sdWorld.ReplaceColorInSDFilter_v2( quickie_filter, '#000000', '#ff00ff' ) // Pink, stronger quickies
							//quickie.sd_filter = quickie_filter;
							quickie.filter = 'invert(1) sepia(1) saturate(100) hue-rotate(270deg) opacity(0.45)';
							sdEntity.entities.push( quickie );
							sdWorld.UpdateHashPosition( quickie, false ); // Prevent intersection with other ones
						}
					}
					if ( this.type === 2 ) // Cube portal
					{
						if ( sdCube.alive_cube_counter < sdCube.GetMaxAllowedCubesOfKind( 0 ) ) // 20
						{
							let cube = new sdCube({ 
								x:this.x,
								y:this.y,
								kind: sdCube.GetRandomKind()/*( ( sdCube.alive_huge_cube_counter < sdWorld.GetPlayingPlayersCount() ) && ( sdCube.alive_cube_counter >= 2 && Math.random() < 0.1 ) ) ?
										 1 : ( sdCube.alive_white_cube_counter < 1 && ( sdCube.alive_cube_counter >= 2 && Math.random() < 0.04 ) ) ? 
										 2 : ( sdCube.alive_pink_cube_counter < 2 && ( sdCube.alive_cube_counter >= 1 && Math.random() < 0.14 ) ) ? 3 : 0*/ // _kind = 1 -> is_huge = true , _kind = 2 -> is_white = true , _kind = 3 -> is_pink = true
							});
							cube.sy += ( 10 - ( Math.random() * 20 ) );
							cube.sx += ( 10 - ( Math.random() * 20 ) );

							sdEntity.entities.push( cube );

							if ( !cube.CanMoveWithoutOverlap( cube.x, cube.y, 0 ) )
							{
								cube.remove();
							}
							else
							sdWorld.UpdateHashPosition( cube, false ); // Prevent inersection with other ones
						}
					}
					if ( this.type === 3 ) // Asteroid portal, always creates asteroids which explode on impact
					{
						{
							let asteroid = new sdAsteroid({ 
								x:this.x,
								y:this.y
							});
							asteroid._type = 0;
							asteroid.sy += ( 10 - ( Math.random() * 20 ) );
							asteroid.sx += ( 10 - ( Math.random() * 20 ) );

							sdEntity.entities.push( asteroid );

							/*if ( !asteroid.CanMoveWithoutOverlap( cube.x, cube.y, 0 ) )
							{
								asteroid.remove();
							}
							else
							sdWorld.UpdateHashPosition( asteroid, false ); // Prevent inersection with other ones*/
						}
					}
				}, 1223 );

					if ( this.type === 5 )
					{
						let ais = 0;
						for ( var i = 0; i < sdCharacter.characters.length; i++ )
						{
							if ( sdCharacter.characters[ i ].hea > 0 )
							if ( !sdCharacter.characters[ i ]._is_being_removed )
							if ( sdCharacter.characters[ i ]._ai_team === 3 )
							{
								ais++;
								//console.log( 'AI count:' + ais );
							}
						}
						{
		
							let councils = 0;
							let councils_tot = 1;

							let left_side = ( Math.random() < 0.5 );

							while ( councils < councils_tot && ais < 6 )
							{

								let character_entity = new sdCharacter({ x:0, y:0, _ai_enabled:sdCharacter.AI_MODEL_AGGRESSIVE });

								sdEntity.entities.push( character_entity );
								character_entity.s = 110;
								{
								let x,y;
								{
									x = this.x
									y = this.y;
									{
										character_entity.x = x;
										character_entity.y = y;
										sdFactions.SetHumanoidProperties( character_entity, sdFactions.FACTION_COUNCIL );

										const logic = ()=>
										{
											if ( character_entity.hea <= 0 )
											if ( !character_entity._is_being_removed )
											{
												sdSound.PlaySound({ name:'teleport', x:character_entity.x, y:character_entity.y, volume:0.5 });
												sdWorld.SendEffect({ x:character_entity.x, y:character_entity.y, type:sdEffect.TYPE_TELEPORT, hue:170/*, filter:'hue-rotate(' + ~~( 170 ) + 'deg)'*/ });
												character_entity.remove();
											}
							
										};
										setInterval( logic, 1000 );
	
										break;
								}
							}
						}
						councils++;
						ais++;
						}
					}
				}

				//this._spawn_timer_cd = ( this.type === 3 ? 0.25 : 1 ) * this._spawn_timer * Math.max( 0.1, this.hea / this.hmax ); // Reset spawn timer countdown, depending on HP left off the portal
				this._spawn_timer_cd = ( this.type === 5 ? 0.5 : this.type === 3 ? 0.25 : 1 ) * this._spawn_timer * Math.max( 0.1, Math.pow( Math.random(), 0.5 ) ); // Reset spawn timer countdown, but randomly while prioritizing longer spawns to prevent farming or not feeding any crystals to portal for too long
			}
			
			if ( this.matter_crystal > 0 ) // Has the rift drained any matter?
			{
				this.hea = Math.max( this.hea - 1, 0 );
				this.matter_crystal--;
			}

			if ( this.type === 5 || this.type === 4 ) // Council portal fades away on it's own, dimensional tear too // Almost Copy [ 2 / 2 ]
			this.hea = Math.max( this.hea - GSPEED, 0 );

			if ( this._time_until_teleport > 0 )
			{
				this._time_until_teleport -= GSPEED;
				this.teleport_alpha = Math.min( this.teleport_alpha + GSPEED, 60 );
			}
			else
			if ( this._time_until_teleport <= 0 )
			this.teleport_alpha = Math.max( this.teleport_alpha - GSPEED, 0 );
			if ( this.teleport_alpha <= 0 && this._time_until_teleport <= 0 ) // Relocate the portal
			{
				sdWeather.SetRandomSpawnLocation( this );
				/*
				let x,y,i;
				let tr = 1000;
				do
				{
					tr--;
					x = sdWorld.world_bounds.x1 + Math.random() * ( sdWorld.world_bounds.x2 - sdWorld.world_bounds.x1 );
					y = sdWorld.world_bounds.y1 + Math.random() * ( sdWorld.world_bounds.y2 - sdWorld.world_bounds.y1 );

					if ( this.CanMoveWithoutOverlap( x, y, 0 ) )
					if ( !this.CanMoveWithoutOverlap( x, y + 24, 0 ) )
					if ( sdWorld.last_hit_entity )
					if ( sdWorld.last_hit_entity.GetClass() === 'sdBlock' && sdWorld.last_hit_entity.material === sdBlock.MATERIAL_GROUND && sdWorld.last_hit_entity._natural )
					if ( !sdWorld.CheckWallExistsBox( 
						x + this._hitbox_x1 - 16, 
						y + this._hitbox_y1 - 16, 
						x + this._hitbox_x2 + 16, 
						y + this._hitbox_y2 + 16, null, null, [ 'sdWater' ], null ) )
					{
						this.x = x;
						this.y = y;
					}
				}  while( tr > 0 );*/
				this._time_until_teleport = this._teleport_timer;
			}

			if ( this.hea <= 0 )
			{
				this.scale -= 0.0025 / GSPEED;
			}
			if ( this.scale <= 0 )
			{
				let r = Math.random();

				if ( r < ( 0.23 + ( 0.05 * this.type ) ) && this.type !== 5 )
				{
					let x = this.x;
					let y = this.y;
					//let sx = this.sx;
					//let sy = this.sy;

					setTimeout(()=>{ // Hacky, without this gun does not appear to be pickable or interactable...

					let gun;
					gun = new sdGun({ x:x, y:y, class:sdGun.CLASS_BUILDTOOL_UPG });
					gun.extra = 1;

					//gun.sx = sx;
					//gun.sy = sy;
					sdEntity.entities.push( gun );

					}, 500 );
				}
				this.remove();
				return;
			}
		}
	}
	onMovementInRange( from_entity )
	{
		if ( !sdWorld.is_server )
		return;

		if ( this.teleport_alpha < 55 ) // Prevent crystal feeding if it's spawning or dissapearing
		return;

		if ( this.type === 5 ) // No feeding for council portals
		return;

		/*if ( this.type === 4 ) // Black portal deals damage / vacuums stuff inside
		{
			from_entity.DamageWithEffect( 0.25 );
			if ( typeof from_entity.sx !== 'undefined' )
			from_entity.sx -= ( from_entity.x - this.x ) / 40;
			if ( typeof from_entity.sy !== 'undefined' )
			from_entity.sy -= ( from_entity.y - this.y ) / 40;
		}*/

		if ( from_entity.is( sdCrystal ) )
		if ( from_entity.held_by === null ) // Prevent crystals which are stored in a crate
		{
			if ( !from_entity._is_being_removed ) // One per sdRift, also prevent occasional sound flood
			{
				sdSound.PlaySound({ name:'rift_feed3', x:this.x, y:this.y, volume:2 });
				if ( this.type !== 4 ) // Black portal needs anticrystal to be shut down
				{
					this.matter_crystal = Math.min( this.matter_crystal_max, this.matter_crystal + from_entity.matter_max ); // Drain the crystal for it's max value and destroy it
					this._regen_timeout = 30 * 60 * 20; // 20 minutes until it starts regenerating if it didn't drain matter
				}
				else
				{
					if ( from_entity.type !== sdCrystal.TYPE_CRYSTAL_BIG && from_entity.type !== sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
					{
						if ( from_entity.matter_max === sdCrystal.anticrystal_value )
						{
							this.matter_crystal = Math.min( this.matter_crystal_max, this.matter_crystal + from_entity.matter_max ); // Drain the crystal for it's max value and destroy it
							this._regen_timeout = 30 * 60 * 20; // 20 minutes until it starts regenerating if it didn't drain matter
						}
					}
					else
					if ( from_entity.matter_max === sdCrystal.anticrystal_value * 4 )
					{
						this.matter_crystal = Math.min( this.matter_crystal_max, this.matter_crystal + from_entity.matter_max ); // Drain the crystal for it's max value and destroy it
						this._regen_timeout = 30 * 60 * 20; // 20 minutes until it starts regenerating if it didn't drain matter
					}
				}
				//this._update_version++;
				from_entity.remove();
			}
		}

		if ( from_entity.is( sdLost ) )
		{
			if ( !from_entity._is_being_removed ) // One per sdRift, also prevent occasional sound flood
			{
				sdSound.PlaySound({ name:'rift_feed3', x:this.x, y:this.y, volume:2 });

				this.matter_crystal = Math.min( this.matter_crystal_max, this.matter_crystal + from_entity._matter_max ); // Lost entities are drained from it's matter capacity.
				this._regen_timeout = 30 * 60 * 20; // 20 minutes until it starts regenerating if it didn't drain matter
				//this._update_version++;
				from_entity.remove();
			}
		}

		if ( from_entity.is( sdJunk ) )
		if ( from_entity.type === 1 ) // Is it an alien battery?
		if ( this.type !== 2 && this.type !== 4 ) // The portal is not a "cube" one?
		{
			this.type = 2;
			//this.GetFilterColor();
			this._regen_timeout = 30 * 60 * 20; // 20 minutes until it starts regenerating
			//this._update_version++;

			sdWorld.SendEffect({ 
				x:this.x, 
				y:this.y, 
				radius:30,
				damage_scale: 0.01, // Just a decoration effect
				type:sdEffect.TYPE_EXPLOSION, 
				owner:this,
				color:'#33FFFF' 
			});

			from_entity.remove();
		}

		if ( from_entity.is( sdBeamProjector ) )
		{
			this.type = 5;
			//this.GetFilterColor();
			this._regen_timeout = 30 * 60 * 20; // 20 minutes until it starts regenerating
			//this._update_version++;

			sdWorld.SendEffect({ 
				x:this.x, 
				y:this.y, 
				radius:30,
				damage_scale: 0.01, // Just a decoration effect
				type:sdEffect.TYPE_EXPLOSION, 
				owner:this,
				color:'#33FFFF' 
			});

			from_entity.remove();
		}
	}
	get title()
	{
		//if ( this.matter_crystal < this.hea)
		return 'Dimensional portal';
	}
	Draw( ctx, attached )
	{
		ctx.apply_shading = false;
		
		let frame = this.frame;
		
		ctx.filter = this.GetFilterColor(); // this.filter;
		
		if ( !sdShop.isDrawing )
		{
			ctx.globalAlpha = this.teleport_alpha / 60;
			ctx.scale( 0.75 * this.scale + ( 0.25 * this.hea / this.hmax ), 0.75 * this.scale + ( 0.25 * this.hea / this.hmax ) );
		}
		ctx.drawImageFilterCache( sdRift.img_rift_anim, frame * 32, 0, 32, 32, - 16, - 16, 32,32 );
		ctx.globalAlpha = 1;
		ctx.filter = 'none';
	}
	DrawHUD( ctx, attached ) // foreground layer
	{
		if ( this.matter_crystal < this.hea )
		sdEntity.Tooltip( ctx, "Dimensional portal", 0, 0 );
		else
		sdEntity.Tooltip( ctx, "Dimensional portal (overcharged)", 0, 0 ); // Lets players know it has enough matter to destroy itself
	}
	
	onRemove() // Class-specific, if needed
	{
		if ( this.type !== 5 ) // Council portals don't count towards other portal types so they don't prevent spawning of those other portals
		sdRift.portals--;
		//this.onRemoveAsFakeEntity();

		if ( this._broken )
		sdWorld.SendEffect({ 
			x:this.x, 
			y:this.y, 
			radius:30,
			damage_scale: 0.01, // Just a decoration effect
			type:sdEffect.TYPE_EXPLOSION, 
			owner:this,
			color:'#FFFFFF' 
		});
	}
	onRemoveAsFakeEntity()
	{
	}
}
//sdRift.init_class();

export default sdRift;