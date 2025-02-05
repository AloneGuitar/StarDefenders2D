/*

	TODO: Turrets could change their behavior whenever they are connected to lost particle containers? Maube even freezing barrels too

*/

import sdWorld from '../sdWorld.js';
import sdEntity from './sdEntity.js';
import sdCom from './sdCom.js';
import sdBullet from './sdBullet.js';
import sdSound from '../sdSound.js';

import sdCharacter from './sdCharacter.js';
//import sdPlayerDrone from './sdPlayerDrone.js';
import sdVirus from './sdVirus.js';
import sdQuickie from './sdQuickie.js';
import sdOctopus from './sdOctopus.js';
import sdCube from './sdCube.js';
import sdBomb from './sdBomb.js';
import sdGun from './sdGun.js';
import sdEffect from './sdEffect.js';
import sdAsp from './sdAsp.js';
import sdSandWorm from './sdSandWorm.js';
import sdSlug from './sdSlug.js';
import sdGrub from './sdGrub.js';
import sdEnemyMech from './sdEnemyMech.js';
import sdDrone from './sdDrone.js';
import sdBlock from './sdBlock.js';
import sdBadDog from './sdBadDog.js';
import sdShark from './sdShark.js';
import sdSpider from './sdSpider.js';
import sdTutel from './sdTutel.js';
import sdFaceCrab from './sdFaceCrab.js';
import sdSetrDestroyer from './sdSetrDestroyer.js';
import sdBiter from './sdBiter.js';
import sdAbomination from './sdAbomination.js';
import sdMimic from './sdMimic.js';
import sdGuanako from './sdGuanako.js';


class sdTurret extends sdEntity
{
	static init_class()
	{
		sdTurret.img_no_matter = sdWorld.CreateImageFromFile( 'turret_no_matter' );
		
		sdTurret.img_turret = sdWorld.CreateImageFromFile( 'turret' );
		sdTurret.img_turret_fire = sdWorld.CreateImageFromFile( 'turret_fire' );
		
		sdTurret.img_turret2 = sdWorld.CreateImageFromFile( 'turret2' );
		sdTurret.img_turret2_fire = sdWorld.CreateImageFromFile( 'turret2_fire' );

		sdTurret.img_turret3 = sdWorld.CreateImageFromFile( 'turret3' );
		sdTurret.img_turret3_fire = sdWorld.CreateImageFromFile( 'turret3_fire' );

		sdTurret.img_turret4 = sdWorld.CreateImageFromFile( 'turret4' );
		sdTurret.img_turret4_fire = sdWorld.CreateImageFromFile( 'turret4_fire' );

		sdTurret.img_turret5 = sdWorld.CreateImageFromFile( 'turret5' );
		sdTurret.img_turret5_fire = sdWorld.CreateImageFromFile( 'turret5_fire' );
		
		sdTurret.targetable_classes = new WeakSet( [ 
			sdCharacter, 
			sdVirus, 
			sdQuickie, 
			sdOctopus, 
			sdCube, 
			//sdBomb, 
			sdAsp, 
			sdSandWorm, 
			sdSlug, 
			sdGrub, 
			sdGuanako, 
			sdEnemyMech, 
			sdDrone, 
			sdBadDog, 
			sdShark, 
			sdSpider, 
			sdTutel,
			sdFaceCrab,
			sdSetrDestroyer,
			sdWorld.entity_classes.sdOverlord,
			sdWorld.entity_classes.sdPlayerDrone,
			sdWorld.entity_classes.sdAmphid,
			sdWorld.entity_classes.sdPlayerOverlord,
			sdBiter,
			sdAbomination,
			sdMimic
		] ); // Module random load order that causes error prevention
		
		sdTurret.KIND_LASER = 0;
		sdTurret.KIND_ROCKET = 1;
		sdTurret.KIND_RAPID_LASER = 2;
		sdTurret.KIND_SNIPER = 3;
		sdTurret.KIND_FREEZER = 4;

		sdTurret.matter_capacity = 40; // Was 20, but new cable logic makes entities with 20 or less matter to be ignored

		sdWorld.entity_classes[ this.name ] = this; // Register for object spawn
	}
	get hitbox_x1() { return -this.GetSize(); }
	get hitbox_x2() { return this.GetSize(); }
	get hitbox_y1() { return -this.GetSize(); }
	get hitbox_y2() { return this.GetSize(); }
	
	get hard_collision()
	{ return true; }
	
	get is_static() // Static world objects like walls, creation and destruction events are handled manually. Do this._update_version++ to update these
	{ return true; }
	
	get title()
	{
		var prefix = ' ( level ' + this.lvl + ', '+ ~~(this.matter)+' / '+this._matter_max+' )';
		if ( this.type === 0 )
		{
			if ( this.kind === sdTurret.KIND_LASER )
			return T('Automatic laser turret') + prefix;
			if ( this.kind === sdTurret.KIND_ROCKET )
			return T('Automatic missile turret') + prefix;
			if ( this.kind === sdTurret.KIND_RAPID_LASER )
			return T('Automatic rapid laser turret') + prefix;
			if ( this.kind === sdTurret.KIND_SNIPER )
			return T('Automatic sniper turret') + prefix;
			if ( this.kind === sdTurret.KIND_FREEZER )
			return T('Automatic freezing turret') + prefix;
		}
		if ( this.type === 1 ) // AI faction base / outpost turrets.
		{
			if ( this.kind === sdTurret.KIND_LASER )
			return T('Automatic laser turret');
			if ( this.kind === sdTurret.KIND_ROCKET )
			return T('Automatic missile turret');
			if ( this.kind === sdTurret.KIND_RAPID_LASER )
			return T('Automatic rapid laser turret');
			if ( this.kind === sdTurret.KIND_SNIPER )
			return T('Automatic sniper turret');
			if ( this.kind === sdTurret.KIND_FREEZER )
			return T('Automatic freezing turret');
		}
	
		return 'Automatic turret' + prefix;
	}
	
	//IsEarlyThreat() // Used during entity build & placement logic - basically turrets, barrels, bombs should have IsEarlyThreat as true or else players would be able to spawn turrets through closed doors & walls. Coms considered as threat as well because their spawn can cause damage to other players
	//{ return true; }
	
	Damage( dmg, initiator=null )
	{
		if ( !sdWorld.is_server )
		return;
	
		if ( this._hea > 0 )
		{
			dmg = Math.abs( dmg );

			if ( initiator )
			if ( initiator.is( sdTurret ) )
			{
				if ( this.GetComWiredCache() === initiator.GetComWiredCache() )
				{
					dmg *= 0.1; // Make same base turrets less probably to break each other
				}
			}

			this._hea -= dmg;
			
			this._regen_timeout = 60;

			if ( this._hea <= 0 )
			this.remove();
		}
	}
	constructor( params )
	{
		super( params );
		
		this.kind = params.kind || 0;
		this.type = params.type || 0; // 0 = default SD turrets which need com nodes to work, 1 = faction base turrets which work without com nodes and matter source, target anything but their own faction.
		this._ai_team = params._ai_team || 0; // AI Team, used in faction base / outpost turrets to determine friend from foe
		
		//this._is_cable_priority = true;
		
		this._hmax = ( ( this.kind === sdTurret.KIND_RAPID_LASER || this.kind === sdTurret.KIND_SNIPER || this.kind === sdTurret.KIND_FREEZER ) ? 200 : 100 ) * 4;
		this._hea = this._hmax;
		this._regen_timeout = 0;
		
		this._owner = params.owner || null;
		
		this.an = 0;
		
		this._seek_timer = Math.random() * 15;
		this.fire_timer = 0;
		this._target = null;
		
		this._considered_target = null; // What target is being considered. Used for filtering to allow attacking through unknown walls

		this.disabled = false; // If hit by EMP, set the turret in sleep mode but allow hp regen
		this._disabled_timeout = 0; // Countdown timer when disabled
		
		//this._coms_near_cache = [];

		this.matter = 0;
		this._matter_max = sdTurret.matter_capacity;

		this.lvl = 0;
		this._time_amplification = 0;

		this.SetMethod( 'ShootPossibilityFilter', this.ShootPossibilityFilter ); // Here it used for "this" binding so method can be passed to collision logic
	}
	onSnapshotApplied() // To override
	{
		this._matter_max = sdTurret.matter_capacity;
	}
	GetShootCost()
	{
		var dmg = 1;
		
		var dmg_mult = 1 + this.lvl / 3;
		
		var count = 1;
		
		var is_rail = false;
		
		var explosion_radius = 0;
		
		if ( this.kind === sdTurret.KIND_LASER || this.kind === sdTurret.KIND_RAPID_LASER )
		dmg = 15;
	
		if ( this.kind === sdTurret.KIND_SNIPER )
		dmg = 85;
	
		if ( this.kind === sdTurret.KIND_ROCKET )
		{
			dmg = sdGun.classes[ sdGun.CLASS_ROCKET ].projectile_properties._damage;
			explosion_radius = sdGun.classes[ sdGun.CLASS_ROCKET ].projectile_properties.explosion_radius;
		}
			
		//return m * 0.1;

		if ( this.type === 1 ) // Faction base / outpost turrets
		return 0;
		
		return ( Math.abs( dmg * dmg_mult ) * count + 
				( is_rail ? 30 : 0 ) + 
				( explosion_radius > 0 ? 20 : 0 ) ) * sdWorld.damage_to_matter;
	}
	
	onMatterChanged( by=null ) // Something like sdRescueTeleport will leave hiberstate if this happens
	{
		this.SetHiberState( sdEntity.HIBERSTATE_ACTIVE );
	}
	onThink( GSPEED ) // Class-specific, if needed
	{
		GSPEED = sdGun.HandleTimeAmplification( this, GSPEED );
		let can_hibernate = false;
		
		if ( this._disabled_timeout > 0 )
		this._disabled_timeout -= GSPEED;
		else
		if ( this.disabled )
		this.disabled = false;
		if ( this._regen_timeout > 0 )
		this._regen_timeout -= GSPEED;
		else
		if ( this._hea < this._hmax )
		this._hea = Math.min( this._hea + GSPEED, this._hmax );
		else
		{
			can_hibernate = true;
		}

		if ( this.fire_timer > 0 )
		this.fire_timer = Math.max( 0, this.fire_timer - GSPEED );

		if ( sdWorld.is_server )
		{
			if ( this.matter > this.GetShootCost() || this.type === 1 )
			{
				can_hibernate = false;
				
				if ( this._seek_timer <= 0 && this.disabled === false )
				{
					this._seek_timer = 10 + Math.random() * 10;

					this._target = null;

					let com_near = this.GetComWiredCache();

					if ( ( com_near && this.type === 0 ) )
					{
						function RuleAllowedByNodes( c )
						{
							if ( com_near.subscribers.indexOf( c ) !== -1 )
							return false;

							return true;
						}

						const targetable_classes = sdTurret.targetable_classes;
						
						const range = this.GetTurretRange();
						
						const from_x = this.x - range;
						const to_x = this.x + range;
						const from_y = this.y - range;
						const to_y = this.y + range;

						{
							//var arr = sdWorld.RequireHashPosition( x, y ).arr;
							var arr = sdEntity.active_entities; // In many cases it is faster than running through 3D array, especially if we don't need hibernated targets

							for ( var i2 = 0; i2 < arr.length; i2++ )
							{
								var e = arr[ i2 ];

								if ( sdWorld.inDist2D_Boolean( e.x, e.y, this.x, this.y, range ) ) // Faster than class check
								if ( targetable_classes.has( e.constructor ) )
								if ( 
										( e.hea || e._hea ) > 0 && 
										( !e.is( sdSandWorm ) || e.death_anim === 0 ) && 
										( !e.is( sdMimic ) || e.morph < 100 ) && 
										( e._frozen < 10 || this.kind !== sdTurret.KIND_FREEZER ) 
									)
								if ( !e.is( sdBadDog ) || !e.owned )
								if ( e.IsPlayerClass() || e.IsVisible( this ) || ( e.driver_of && !e.driver_of._is_being_removed && e.driver_of.IsVisible( this ) ) )
								{
									var is_char = e.IsPlayerClass();

									if ( ( is_char && e.IsHostileAI() ) || ( ( !is_char || ( RuleAllowedByNodes( e._net_id ) && RuleAllowedByNodes( e.biometry ) ) ) && RuleAllowedByNodes( e.GetClass() ) ) )
									{
										if ( is_char && is_char._god && !e.IsVisible() )
										{
										}
										else
										{
											this._considered_target = e;

											if ( sdWorld.CheckLineOfSight( this.x, this.y, e.x, e.y, this, null, [ 'sdBlock', 'sdDoor', 'sdMatterContainer', 'sdMatterAmplifier', 'sdCommandCentre', 'sdCrystalCombiner', 'sdTurret', 'sdCrystal', 'sdRescueTeleport' ], this.ShootPossibilityFilter ) )
											{
												this._target = e;
												break;
											}
										}
									}
								}
							}
						}
						
						//this._debug1 = ents_looked_through;
					}
					else
					if ( this.type === 1 )
					{

						//let class_cache = {};
						function RuleAllowedByNodes( c )
						{
							return true;
						}


						const targetable_classes = sdTurret.targetable_classes;
						
						const range = this.GetTurretRange();
						
						const from_x = this.x - range;
						const to_x = this.x + range;
						const from_y = this.y - range;
						const to_y = this.y + range;
						
						//let ents_looked_through = 0;
						
						/*
						
							Console code to measure stuff

							var counters = [];
							for ( var i = 0; i < sdWorld.entity_classes.sdEntity.active_entities.length; i++ )
							if ( sdWorld.entity_classes.sdEntity.active_entities[ i ].GetClass() === 'sdTurret' )
							{
								var e = sdWorld.entity_classes.sdEntity.active_entities[ i ];
								counters.push( [ e.kind, e.lvl, e._debug1 ] );
							}
							counters;

						*/
					   

						{
							//var arr = sdWorld.RequireHashPosition( x, y ).arr;
							var arr = sdEntity.active_entities; // In many cases it is faster than running through 3D array, especially if we don't need hibernated targets

							//ents_looked_through += arr.length;
								
							for ( var i2 = 0; i2 < arr.length; i2++ )
							{
								var e = arr[ i2 ];
								
								/*if ( targetable_classes.has( e.constructor ) )
								counterA++;
							
								if ( e._hiberstate === sdEntity.HIBERSTATE_ACTIVE )
								counterB++;*/
								
								/*if ( targetable_classes.has( e.constructor ) )
								counterA++;
							
								if ( sdWorld.inDist2D_Boolean( e.x, e.y, this.x, this.y, range ) )
								counterB++;*/
								
								if ( sdWorld.inDist2D_Boolean( e.x, e.y, this.x, this.y, range ) ) // Faster than class check
								//if ( e._hiberstate === sdEntity.HIBERSTATE_ACTIVE ) // Don't target dead bodies or anything else that is hibernated, actually a big optimization and is faster than class constructor checking for some reason by a lot
								if ( targetable_classes.has( e.constructor ) )
								//if ( e.is( sdCharacter ) || e.is( sdVirus ) || e.is( sdQuickie ) || e.is( sdOctopus ) || e.is( sdCube ) || e.is( sdBomb ) )
								if ( 
										( e.hea || e._hea ) > 0 && 
										( !e.is( sdSandWorm ) || e.death_anim === 0 ) && 
										( !e.is( sdMimic ) || e.morph < 100 ) && 
										( e._frozen < 10 || this.kind !== sdTurret.KIND_FREEZER ) 
									)
								{
									//var is_char = e.is( sdCharacter );
									var is_char = e.IsPlayerClass();

									if ( ( e.is( sdCharacter ) && e._ai_team === this._ai_team ) || ( e.is( sdDrone ) && e._ai_team === this._ai_team ) )
									{
									}
									else
									{
										if ( sdWorld.CheckLineOfSight( this.x, this.y, e.x, e.y, this, null, [ 'sdBlock', 'sdDoor', 'sdMatterContainer', 'sdMatterAmplifier', 'sdCommandCentre', 'sdCrystalCombiner', 'sdTurret', 'sdCrystal' ], this.ShootPossibilityFilter ) )
										{
											this._target = e;
											break;
										}
									}
								}
							}
						}
						
						//this._debug1 = ents_looked_through;
					}
					else
					{
						can_hibernate = true;
					}
					
				}
				else
				this._seek_timer -= GSPEED;

				if ( this._target !== null && this.disabled === false )
				{
					let di = sdWorld.Dist2D( this.x, this.y, this._target.x, this._target.y );

					let vel = ( this.kind === sdTurret.KIND_SNIPER ) ? 30 : 15;

					if ( this.kind === sdTurret.KIND_ROCKET )
					vel = sdGun.classes[ sdGun.CLASS_ROCKET ].projectile_velocity;

					this.an = Math.atan2( this._target.y + this._target.sy * di / vel - this.y, this._target.x + this._target.sx * di / vel - this.x ) * 100;

					if ( this.fire_timer <= 0 )
					{
						this.matter -= this.GetShootCost();
						this.WakeUpMatterSources();
						
						if ( this.kind === sdTurret.KIND_LASER || this.kind === sdTurret.KIND_RAPID_LASER )
						sdSound.PlaySound({ name:'turret', x:this.x, y:this.y, volume:0.5, pitch: 1 / ( 1 + this.lvl / 5 ) });
					
						if ( this.kind === sdTurret.KIND_SNIPER )
						sdSound.PlaySound({ name:'gun_sniper', x:this.x, y:this.y, volume:0.5, pitch: 1 / ( 1 + this.lvl / 5 ) });
					
						if ( this.kind === sdTurret.KIND_ROCKET )
						sdSound.PlaySound({ name:sdGun.classes[ sdGun.CLASS_ROCKET ].sound, x:this.x, y:this.y, volume:0.5, pitch: 1 / ( 1 + this.lvl / 5 ) });
					
						if ( this.kind === sdTurret.KIND_FREEZER )
						sdSound.PlaySound({ name:'gun_spark', x:this.x, y:this.y, volume:0.5, pitch: 1 / ( 1 + this.lvl / 5 ) });

						let bullet_obj = new sdBullet({ x: this.x, y: this.y });

						bullet_obj._owner = this;

						bullet_obj.sx = Math.cos( this.an / 100 );
						bullet_obj.sy = Math.sin( this.an / 100 );
						
						bullet_obj._armor_penetration_level = 3; // Prevent damaging world in arena but also prevent damage to workbench

						//bullet_obj.x += bullet_obj.sx * 5;
						//bullet_obj.y += bullet_obj.sy * 5;

						bullet_obj.sx *= vel;
						bullet_obj.sy *= vel;

						this.fire_timer = this.GetReloadTime();

						if ( this.kind === sdTurret.KIND_LASER || this.kind === sdTurret.KIND_RAPID_LASER )
						{
							bullet_obj._damage = 15;
							bullet_obj.color = '#ff0000';
						}

						if ( this.kind === sdTurret.KIND_SNIPER )
						{
							bullet_obj._damage = 85;
							bullet_obj.color = '#ff00ff';
							bullet_obj.penetrating = true;
						}
						if ( this.kind === sdTurret.KIND_ROCKET )
						{
							bullet_obj._damage = sdGun.classes[ sdGun.CLASS_ROCKET ].projectile_properties._damage;

							bullet_obj.explosion_radius = sdGun.classes[ sdGun.CLASS_ROCKET ].projectile_properties.explosion_radius;
							bullet_obj.model = sdGun.classes[ sdGun.CLASS_ROCKET ].projectile_properties.model;

							bullet_obj.color = sdGun.classes[ sdGun.CLASS_ROCKET ].projectile_properties.color;

							bullet_obj.ac = sdGun.classes[ sdGun.CLASS_ROCKET ].projectile_properties.ac;

							if ( bullet_obj.ac > 0 )
							{
								bullet_obj.acx = Math.cos( this.an / 100 );
								bullet_obj.acy = Math.sin( this.an / 100 );
							}
						}
						if ( this.kind === sdTurret.KIND_FREEZER )
						{
							bullet_obj._damage = 1;

							bullet_obj.model = 'ball';
							
							bullet_obj._temperature_addition = -50;

							//bullet_obj.color = sdGun.classes[ sdGun.CLASS_ROCKET ].projectile_properties.color;

							//bullet_obj.ac = sdGun.classes[ sdGun.CLASS_ROCKET ].projectile_properties.ac;

							/*if ( bullet_obj.ac > 0 )
							{
								bullet_obj.acx = Math.cos( this.an / 100 );
								bullet_obj.acy = Math.sin( this.an / 100 );
							}*/
						}
						
						bullet_obj._damage *= 1 + this.lvl / 3;
						bullet_obj._temperature_addition *= 1 + this.lvl / 3;

						sdEntity.entities.push( bullet_obj );
					}

					this._update_version++;
				}
				else
				{
					if ( this.fire_timer > 0 )
					{
						this.fire_timer = Math.max( 0, this.fire_timer - GSPEED );
						this._update_version++;
						
						can_hibernate = false;
					}
				}
			}
		}
		
		if ( sdWorld.is_server )
		if ( can_hibernate && this.fire_timer <= 0 )
		this.SetHiberState( sdEntity.HIBERSTATE_HIBERNATED );
	}
	ShootPossibilityFilter( ent )
	{
		if ( this._com_near_cache )
		if ( this._com_near_cache.through_walls )
		if ( this._considered_target.IsPlayerClass() )
		if ( !ent._shielded || ent._shielded._is_being_removed )
		return false;
		
		if ( ent.is( sdBlock ) )
		if ( ( ent.material === sdBlock.MATERIAL_TRAPSHIELD && sdBullet.IsTrapShieldIgonred( this, ent ) ) || ent.texture_id === sdBlock.TEXTURE_ID_CAGE )
		return false;
		
		return true;
	}
	GetReloadTime()
	{
		if ( this.kind === sdTurret.KIND_LASER )
		return 10;
		if ( this.kind === sdTurret.KIND_ROCKET )
		return sdGun.classes[ sdGun.CLASS_ROCKET ].reload_time;
		if ( this.kind === sdTurret.KIND_RAPID_LASER )
		return 5; // Twice as fast than regular laser
		if ( this.kind === sdTurret.KIND_SNIPER )
		return sdGun.classes[ sdGun.CLASS_SNIPER ].reload_time;
		if ( this.kind === sdTurret.KIND_FREEZER )
		return 30;
	}
	GetSize()
	{
		if ( this.kind === sdTurret.KIND_LASER )
		return 3;
		if ( this.kind === sdTurret.KIND_ROCKET || this.kind === sdTurret.KIND_FREEZER )
		return 6;
		if ( this.kind === sdTurret.KIND_RAPID_LASER || this.kind === sdTurret.KIND_SNIPER )
		return 4;
	}
	GetTurretRange()
	{
		//if ( this.kind === sdTurret.KIND_RAPID_LASER || this.kind === sdTurret.KIND_SNIPER )
		if ( this.kind === sdTurret.KIND_SNIPER )
		return 450;
		else
		return 300 + this.lvl * 50; // 450 when upgraded
	}
	DrawHUD( ctx, attached ) // foreground layer
	{
		sdEntity.TooltipUntranslated( ctx, this.title );

		//this.DrawConnections( ctx );
	}
	Draw( ctx, attached )
	{
		var not_firing_now = ( this.fire_timer < this.GetReloadTime() - 2.5 );
		
		let com_near = this.GetComWiredCache();
		
		if ( !sdShop.isDrawing )
		if ( this.disabled || this.matter < this.GetShootCost() || ( !com_near && this.type === 0 ) )
		{
			ctx.filter = 'brightness(0.1)';
			not_firing_now = true;
		}
		
		ctx.rotate( this.an / 100 );
		
		if ( !not_firing_now )
		ctx.apply_shading = false;
		
		if ( this.kind === sdTurret.KIND_LASER )
		ctx.drawImageFilterCache( not_firing_now ? sdTurret.img_turret : sdTurret.img_turret_fire, -16, -16, 32,32 );
	
		if ( this.kind === sdTurret.KIND_ROCKET )
		ctx.drawImageFilterCache( not_firing_now ? sdTurret.img_turret2 : sdTurret.img_turret2_fire, -16, -16, 32,32 );

		if ( this.kind === sdTurret.KIND_RAPID_LASER )
		ctx.drawImageFilterCache( not_firing_now ? sdTurret.img_turret3 : sdTurret.img_turret3_fire, -16, -16, 32,32 );

		if ( this.kind === sdTurret.KIND_SNIPER )
		ctx.drawImageFilterCache( not_firing_now ? sdTurret.img_turret4 : sdTurret.img_turret4_fire, -16, -16, 32,32 );
	
		if ( this.kind === sdTurret.KIND_FREEZER )
		ctx.drawImageFilterCache( not_firing_now ? sdTurret.img_turret5 : sdTurret.img_turret5_fire, -16, -16, 32,32 );
	
		ctx.filter = 'none';
		
		if ( !sdShop.isDrawing )
		if ( sdWorld.time % 4000 < 2000 )
		if ( this.matter < this.GetShootCost() || !com_near )
		ctx.drawImageFilterCache( sdTurret.img_no_matter, -16, -16, 32,32 );
	}
	MeasureMatterCost()
	{
		if ( this.kind === sdTurret.KIND_LASER )
		return ~~( 100 * sdWorld.damage_to_matter + 150 * ( this.type + 1 ) );
		
		if ( this.kind === sdTurret.KIND_ROCKET )
		return ~~( 100 * sdWorld.damage_to_matter + 300 * ( this.type + 1 ) );

		if ( this.kind === sdTurret.KIND_RAPID_LASER )
		return ~~( 100 * sdWorld.damage_to_matter + 450 * ( this.type + 1 ) );

		if ( this.kind === sdTurret.KIND_SNIPER )
		return ~~( 100 * sdWorld.damage_to_matter + 600 * ( this.type + 1 ) );

		if ( this.kind === sdTurret.KIND_FREEZER )
		return ~~( 100 * sdWorld.damage_to_matter + 600 * ( this.type + 1 ) );
	}
	onRemove()
	{
		if ( this._broken )
		sdWorld.BasicEntityBreakEffect( this, 3 );
	}
	RequireSpawnAlign()
	{ return false; }
	
	
	ExecuteContextCommand( command_name, parameters_array, exectuter_character, executer_socket ) // New way of right click execution. command_name and parameters_array can be anything! Pay attention to typeof checks to avoid cheating & hacking here. Check if current entity still exists as well (this._is_being_removed). exectuter_character can be null, socket can't be null
	{
		if ( !this._is_being_removed )
		//if ( this._hea > 0 )
		if ( exectuter_character )
		if ( exectuter_character.hea > 0 )
		{
			if ( sdWorld.inDist2D_Boolean( this.x, this.y, exectuter_character.x, exectuter_character.y, 128 ) )
			{
				if ( command_name === 'UPGRADE' || command_name === 'UPGRADE_MAX' )
				{
					let upgrades_to_do = ( command_name === 'UPGRADE_MAX' ) ? 5 : 1;
					
					let upgraded = false;
					
					while ( upgrades_to_do > 0 )
					{
						upgrades_to_do--;
						
						if ( this.lvl < 5 )
						{
							if ( exectuter_character.matter >= 100 )
							{
								upgraded = true;

								this.lvl += 1;
								exectuter_character.matter -= 100;

								this._update_version++;
							}
							else
							{
								executer_socket.SDServiceMessage( 'Not enough matter' );
								break;
							}
						}
						else
						{
							break;
						}
					}
					
					if ( upgraded )
					sdSound.PlaySound({ name:'gun_buildtool', x:this.x, y:this.y, volume:0.5 });
					else
					executer_socket.SDServiceMessage( 'Turret is at maximum level' );
				}
			}
			else
			executer_socket.SDServiceMessage( 'Turret is too far' );
		}
	}
	PopulateContextOptions( exectuter_character ) // This method only executed on client-side and should tell game what should be sent to server + show some captions. Use sdWorld.my_entity to reference current player
	{
		if ( !this._is_being_removed )
		//if ( this._hea > 0 )
		if ( exectuter_character )
		if ( exectuter_character.hea > 0 )
		if ( sdWorld.inDist2D_Boolean( this.x, this.y, exectuter_character.x, exectuter_character.y, 128 ) )
		{
			if ( this.lvl < 5 )
			{
				this.AddContextOption( 'Upgrade damage to level 5 ('+ (5-this.lvl)*100 +' matter)', 'UPGRADE_MAX', [] );
				this.AddContextOption( 'Upgrade damage (100 matter)', 'UPGRADE', [] );
			}
			else
			this.AddContextOption( '- no upgrades available -', 'UPGRADE', [] );
		}
	}
}
//sdTurret.init_class();

export default sdTurret;