
import sdWorld from '../sdWorld.js';
import sdSound from '../sdSound.js';
import sdEntity from './sdEntity.js';
import sdGun from './sdGun.js';
import sdStorage from './sdStorage.js';
import sdPlayerDrone from './sdPlayerDrone.js';
import sdMatterAmplifier from './sdMatterAmplifier.js';
import sdCube from './sdCube.js';
import sdCom from './sdCom.js';
import sdEffect from './sdEffect.js';
import sdGuanako from './sdGuanako.js';


class sdCrystal extends sdEntity
{
	static init_class()
	{
		sdCrystal.img_crystal = sdWorld.CreateImageFromFile( 'crystal' );
		sdCrystal.img_crystal_empty = sdWorld.CreateImageFromFile( 'crystal_empty' );
		
		sdCrystal.img_crystal_artificial = sdWorld.CreateImageFromFile( 'crystal_artificial' );
		sdCrystal.img_crystal_artificial_empty = sdWorld.CreateImageFromFile( 'crystal_artificial_empty' );

		sdCrystal.img_crystal_cluster = sdWorld.CreateImageFromFile( 'crystal_cluster' ); // Sprite by HastySnow / LazyRain
		sdCrystal.img_crystal_cluster_empty = sdWorld.CreateImageFromFile( 'crystal_cluster_empty' ); // Sprite by HastySnow / LazyRain

		sdCrystal.img_crystal_cluster2 = sdWorld.CreateImageFromFile( 'crystal_cluster2' ); // Sprite by Darkstar1
		sdCrystal.img_crystal_cluster2_empty = sdWorld.CreateImageFromFile( 'crystal_cluster2_empty' ); // Sprite by Darkstar1
		
		sdCrystal.img_crystal_crab = sdWorld.CreateImageFromFile( 'sdCrystalCrab' );
		
		sdCrystal.img_crystal_corrupted = sdWorld.CreateImageFromFile( 'crystal_corrupted' );
		
		sdCrystal.img_crystal_crab_big = sdWorld.CreateImageFromFile( 'sdCrystalCrabBig' ); // Sprite by Mrnat444

		sdCrystal.img_crystal_cluster3 = sdWorld.CreateImageFromFile( 'crystal_cluster3' );
		sdCrystal.img_crystal_cluster3_empty = sdWorld.CreateImageFromFile( 'crystal_cluster3_empty' );
		
		sdCrystal.anticrystal_value = 5120 * 16; // 10240;
		
		sdCrystal.TYPE_CRYSTAL = 1;
		sdCrystal.TYPE_CRYSTAL_BIG = 2;
		sdCrystal.TYPE_CRYSTAL_CRAB = 3;
		sdCrystal.TYPE_CRYSTAL_CORRUPTED = 4;
		sdCrystal.TYPE_CRYSTAL_ARTIFICIAL = 5;
		sdCrystal.TYPE_CRYSTAL_CRAB_BIG = 6;
		sdCrystal.TYPE_CRYSTAL_GIANT = 7;
		
		sdCrystal.max_seek_range = 500; // For big crystal crabs

		sdCrystal.recharges_until_depleated = 100;
		
		sdCrystal.hitpoints_artificial = 140;
		
		sdCrystal.lowest_matter_regen = 0; // 20;
		
		sdCrystal.ignored_classes_array = [ 'sdLifeBox' ];
		
		sdWorld.entity_classes[ this.name ] = this; // Register for object spawn
	}

	get hitbox_x1() { return this.type === sdCrystal.TYPE_CRYSTAL_BIG || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ? -14 : this.type === sdCrystal.TYPE_CRYSTAL_GIANT ? -28 : -4; }
	get hitbox_x2() { return this.type === sdCrystal.TYPE_CRYSTAL_BIG || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ? 14 : this.type === sdCrystal.TYPE_CRYSTAL_GIANT ? 28 : 5; }
	get hitbox_y1() { return this.type === sdCrystal.TYPE_CRYSTAL_BIG || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ? -14 : this.type === sdCrystal.TYPE_CRYSTAL_GIANT ? 0 : this.type === sdCrystal.TYPE_CRYSTAL_ARTIFICIAL ? -4 : -7; }
	get hitbox_y2() { return this.type === sdCrystal.TYPE_CRYSTAL_BIG || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ? 16 : this.type === sdCrystal.TYPE_CRYSTAL_GIANT ? 23 : 5; }
	
	get hard_collision() // For world geometry where players can walk
	//{ return this.held_by !== null ? false : true; }
	{ return true; }
	
	/* Causes client-side falling through unsynced ground, probably bad thing to do and it won't be complex entity after sdSnapPack is added
	get is_static() // Static world objects like walls, creation and destruction events are handled manually. Do this._update_version++ to update these
	{ return true; }*/
	
	IsTargetable( by_entity=null, ignore_safe_areas=false ) // Guns are not targetable when held, same for sdCharacters that are driving something
	{
		if ( this.held_by )
		if ( this.held_by.shielded )
		return false;
	
		return true;
	}
	
	get title()
	{
		if ( this.is_anticrystal )
		{
			if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
			return T('Anti-crystal crab');
			else
			return T('Anti-crystal');
		}
		
		if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
		return T('Crystal crab');
		if ( this.type === sdCrystal.TYPE_CRYSTAL_GIANT )
		return T('Giant Crystal');
		else
		return T('Crystal');
	}
	
	get is_natural()
	{ return ( this.type !== sdCrystal.TYPE_CRYSTAL_ARTIFICIAL ); }
	
	get is_big()
	{ return ( this.type === sdCrystal.TYPE_CRYSTAL_BIG || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ); }
	
	get is_crab()
	{ return ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ); }

	get is_giant()
	{ return ( this.type === sdCrystal.TYPE_CRYSTAL_GIANT ); }
	
	get is_anticrystal()
	{ return ( this.matter_max === sdCrystal.anticrystal_value && this.type !== 2 && this.type !== 6 && this.type !== 7 ) || ( this.matter_max === sdCrystal.anticrystal_value * 4 && ( this.type === 2 || this.type === 6 ) ) || ( this.matter_max === sdCrystal.anticrystal_value * 16 && this.type === 7 ); }
	
	get is_depleted()
	{ return ( this.matter_regen <= 33 ); }
	
	get is_very_depleted()
	{ return ( this.matter_regen <= 5 ); }
	
	get is_overcharged()
	{ return ( this.matter_regen > 133 ); }
	
	GetAutoConnectedEntityForMatterFlow()
	{
		return this.held_by;
	}
	constructor( params )
	{
		super( params );
		
		let is_really_deep = params.tag && params.tag.indexOf( 'really_deep' ) !== -1; // params.tag === 'deep' || params.tag === 'deep_crab';

		let is_deep = params.tag && params.tag.indexOf( 'deep' ) !== -1; // params.tag === 'deep' || params.tag === 'deep_crab';
		
		if ( params.tag )
		{
			if ( params.tag.indexOf( 'crab' ) !== -1 && params.type !== sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
			params.type = sdCrystal.TYPE_CRYSTAL_CRAB;
			else
			if ( params.tag.indexOf( 'corrupted' ) !== -1 )
			params.type = sdCrystal.TYPE_CRYSTAL_CORRUPTED;
		}
		
		this.sx = 0;
		this.sy = 0;
		this.type = params.type || 1;
		this.matter_max = ( this.type === sdCrystal.TYPE_CRYSTAL_BIG || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ) ? 160 : this.type === sdCrystal.TYPE_CRYSTAL_GIANT ? 640 : 40;

		this._time_amplification = 0;

		this.held_by = null; // For amplifiers
		
		let bad_luck = 1; // 1.45; // High value crystals are more rare if this value is high
		
		let r = 1 - Math.pow( Math.random(), bad_luck );
		
		if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
		{
			this._next_action = sdWorld.time + 2000;
			this.walk_direction = 0;
			this.side = -1;
			this.blink = 0;
			this._blink_until = 0;
			this._last_stand_when = 0;
			this.attack_anim = 0; // For big crystal crabs
		}

		if ( is_really_deep )
		r *= 0.25;

		if ( r < 0.0125 / 16 && is_really_deep )
		this.matter_max *= 4096;
		else
		if ( r < 0.0125 / 8 && is_deep ) // matter consuming crystal
		this.matter_max *= 2048;
		else
		if ( r < 0.0125 / 4 && is_deep ) // new 2022
		this.matter_max *= 1024;
		else
		if ( r < 0.0125 / 2 && is_deep ) // new 2022
		this.matter_max *= 512;
		else
		if ( r < 0.0125 && is_deep ) // new 2022
		this.matter_max *= 256;
		else
		if ( r < 0.025 && is_deep ) // glowing, new
		this.matter_max *= 128;
		else
		if ( r < 0.05 ) // Red, new
		this.matter_max *= 64;
		else
		if ( r < 0.1 ) // Pink variation, new (old red)
		this.matter_max *= 32;
		else
		if ( r < 0.2 )
		this.matter_max *= 16;
		else
		if ( r < 0.4 )
		this.matter_max *= 8;
		else
		if ( r < 0.6 )
		this.matter_max *= 4;
		else
		if ( r < 0.8 )
		this.matter_max *= 2;
		
		this._last_damage = 0; // Sound flood prevention

		this.matter_regen = params.matter_regen || 100; // Matter regeneration rate/percentage, depends on crystal and drains as crystal regenerates matter
		
		if ( typeof params.matter_max !== 'undefined' )
		this.matter_max = params.matter_max;
	
		if ( ( this.matter_max === sdCrystal.anticrystal_value && this.type === 1 ) || ( this.matter_max === sdCrystal.anticrystal_value * 4 && ( this.type === 2 || this.type === 6 ) ) )
		{
			this.matter = 0;
			this._hea = this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ? 800 : 600;
			this._damagable_in = 0;
		}
		else
		if ( this.matter_max === sdCrystal.anticrystal_value * 16 && this.type === 7 )
		{
			this.matter = 0;
			this._hea = 1000;
			this._damagable_in = 0;
		}
		else
		if ( this.type === sdCrystal.TYPE_CRYSTAL_GIANT )
		{
			this.matter = this.matter_max;
			this._hea = 1000;
			this._damagable_in = sdWorld.time + 1000;
		}
		else
		{
			this.matter = this.matter_max;
			this._hea = this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ? 600 : this.type === sdCrystal.TYPE_CRYSTAL_BIG ? 480 : 120;
			this._damagable_in = sdWorld.time + 1000; // Suggested by zimmermannliam, will only work for sdCharacter damage		
		}
		this._hmax = this._hea; // For repair logic
		
		// Crabs can be healed x2 from original health (from grass)
		if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
		this._hmax *= 2; 

		this._current_target = null; // For big crystal crabs
	}

	GetIgnoredEntityClasses() // Null or array, will be used during motion if one is done by CanMoveWithoutOverlap or ApplyVelocityAndCollisions
	{
		return sdCrystal.ignored_classes_array;
	}

	Damage( dmg, initiator=null )
	{
		if ( !sdWorld.is_server )
		return;
	
		if ( initiator )
		if ( initiator._is_being_removed )
		initiator = null;

		if ( initiator )
		if ( initiator.is( sdGuanako ) )
		return;
		
		if ( this.held_by )
		if ( typeof this.held_by.DropCrystal !== 'undefined' )
		{
			this.held_by.DropCrystal( this, true );
		}
	
		if ( initiator === null || initiator.IsPlayerClass() )
		if ( sdWorld.time < this._damagable_in )
		if ( !( initiator && initiator.IsPlayerClass() && initiator.power_ef > 0 ) )
		{
			sdSound.PlaySound({ name:'crystal2_short', x:this.x, y:this.y, pitch: 0.75 });
			return;
		}

		if ( initiator )
		if ( !initiator.is( sdCrystal ) )
		if ( !initiator.is( sdCube ) )
		if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
		{
			this._current_target = initiator;
			this._next_action = sdWorld.time;
		}
		
		dmg = Math.abs( dmg );
		
		let was_alive = ( this._hea > 0 );
		
		this._hea -= dmg;
		
		if ( this._hea <= 0 )
		{
			if ( was_alive )
			{
				sdSound.PlaySound({ name:'glass10', x:this.x, y:this.y, volume:0.5 });
				
				if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
				{
					sdSound.PlaySound({ name:'crystal_crab_death', x:this.x, y:this.y, pitch: this.type === 3 ? 1 : 0.5, volume:0.5 });
					
				}
				
				let replacement_entity = null;

				if ( this.type === sdCrystal.TYPE_CRYSTAL_GIANT )
				{
					let ent = new sdCrystal({x: this.x, y: this.y + 4, sx: this.sx, sy: this.sy, type:2 });

					ent.matter_max = this.matter_max / 4;
					ent.matter = this.matter / 4;

					sdEntity.entities.push( ent );
					sdWorld.UpdateHashPosition( ent, false );

					replacement_entity = ent;

					sdWorld.DropShards( this.x, this.y, this.sx, this.sy, 
						Math.ceil( Math.max( 5, this.matter / this.matter_max * 40 / sdWorld.crystal_shard_value * 0.5 ) ),
						this.matter_max / 640,
						11,
						undefined,
						undefined,
						replacement_entity
					);
				}
				else
				if ( this.type === sdCrystal.TYPE_CRYSTAL_BIG || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ) // Big crystals/big crystal crabs
				{
					let ent = new sdCrystal({x: this.x, y: this.y + 4, sx: this.sx, sy: this.sy, type:1 });

					ent.matter_max = this.matter_max / 4;
					ent.matter = this.matter / 4;

					sdEntity.entities.push( ent );
					sdWorld.UpdateHashPosition( ent, false ); // Optional, but will make it visible as early as possible
					
					replacement_entity = ent;
					
					
					sdWorld.DropShards( this.x, this.y, this.sx, this.sy, 
						Math.ceil( Math.max( 5, this.matter / this.matter_max * 40 / sdWorld.crystal_shard_value * 0.5 ) ),
						this.matter_max / 160,
						8,
						undefined,
						undefined,
						replacement_entity
					);
				}
				else
				sdWorld.DropShards( this.x, this.y, this.sx, this.sy, 
					Math.ceil( Math.max( 5, this.matter / this.matter_max * 40 / sdWorld.crystal_shard_value * 0.5 ) ),
					this.matter_max / 40,
					5,
					undefined,
					undefined,
					replacement_entity
				);
		
				let reward_amount = sdEntity.SCORE_REWARD_BROKEN_5K_CRYSTAL * this.matter_max / 5120;
				
				reward_amount *= this.matter_regen / 100;
				
				if ( this.is_crab )
				{
					reward_amount = Math.max( reward_amount, sdEntity.SCORE_REWARD_BROKEN_CRAB_CRYSTAL );
					
					if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
					reward_amount = Math.max( reward_amount, sdEntity.SCORE_REWARD_BROKEN_BIG_CRAB_CRYSTAL );
				}
				else
				if ( this.is_anticrystal )
				{
					reward_amount = 0;
				}
				else
				if ( this.is_giant )
				{
					reward_amount = 0;
				}

				if ( this.matter_regen >= 1200 )
				{
					reward_amount = 0;
				}

				if ( this.matter_max >= 5120 * 32 )
				{
					reward_amount = 0;
				}
				
				reward_amount = ~~( reward_amount );
		
				if ( reward_amount > 0 )
				{
					sdWorld.GiveScoreToPlayerEntity( reward_amount, replacement_entity || this, true, null );
				}

				this.remove();
			}
		}
		else
		{
			if ( sdWorld.time > this._last_damage + 50 )
			{
				this._last_damage = sdWorld.time;
				sdSound.PlaySound({ name:'crystal2_short', x:this.x, y:this.y, volume:1 });
				
				if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
				{
					sdSound.PlaySound({ name:'crystal_crab_death', x:this.x, y:this.y, pitch: this.type === 3 ? 1.5 : 0.8, volume:0.3 });
					
					this._blink_until = sdWorld.time + 1000;
				}
			}
		}
	}
	
	get mass() { return this.type === 2 || this.type === 6 ? 120 : this.type === 7 ? 500 : 30; }
	Impulse( x, y )
	{
		if ( this.held_by )
		return;
	
		this.sx += x / this.mass;
		this.sy += y / this.mass;
	}
	onThink( GSPEED ) // Class-specific, if needed
	{
		if ( this.is_anticrystal )
		GSPEED *= 0.25;

		let GSPEED_scaled = sdGun.HandleTimeAmplification( this, GSPEED );

		if ( this.held_by )
		{
			if ( this._hea < this._hmax )
			this._hea = Math.min( this._hmax, this._hea + GSPEED * 0.01 ); // Quite slow

			if ( sdWorld.server_config.base_degradation )
			if ( sdWorld.server_config.base_shielding_units_passive_drain_per_week_blue > 0 )
			if ( this.held_by.is( sdMatterAmplifier ) )
			this.matter_regen = sdWorld.MorphWithTimeScale( this.matter_regen, 0, 1 - sdWorld.server_config.base_shielding_units_passive_drain_per_week_blue, GSPEED * this.held_by.multiplier/8 / ( 30 * 60 * 60 * 24 * 7 ) ); // 20% per week on highest tier
		}
		else
		{
			this.sy += sdWorld.gravity * GSPEED;
		}
		
		if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
		{
			if ( sdWorld.is_server )
			{
				if ( this.attack_anim > 0 )
				this.attack_anim -= GSPEED;

				if ( this.matter > 5 )
				{
					if ( sdWorld.time > this._next_action )
					{
						if ( this._current_target ) // If big crystal crab
						{
							if ( this._current_target._is_being_removed || !this._current_target.IsTargetable() || !this._current_target.IsVisible( this ) || sdWorld.Dist2D( this.x, this.y, this._current_target.x, this._current_target.y ) > sdCrystal.max_seek_range + 32 || ( this._current_target.hea || this._current_target._hea || 0 ) <= 0 )
							this._current_target = null;
							else
							if ( !this.CanMoveWithoutOverlap( this.x, this.y, -3 ) )
							{
								this._next_action = sdWorld.time + ( this.matter_max === sdCrystal.anticrystal_value * 4 ? 1600 : 400 );

								this.side = ( this._current_target.x > this.x ) ? 1 : -1;

								this.walk_direction = this.side * 80;

								if ( Math.random() < 0.333 || ( this.sx === 0 && this.y + 50 > this._current_target.y ) )
								{
									this.sy -= 4;
									this.sx += this.side * 0.3;
								}
								this.PhysWakeUp();

								if ( 
					
								this.x + this._hitbox_x2 > this._current_target.x + this._current_target._hitbox_x1 - 5 &&
								this.x + this._hitbox_x1 < this._current_target.x + this._current_target._hitbox_x2 + 5 &&
								this.y + this._hitbox_y2 > this._current_target.y + this._current_target._hitbox_y1 - 5 &&
								this.y + this._hitbox_y1 < this._current_target.y + this._current_target._hitbox_y2 + 5
								
								)
								{
									let xx = this._current_target.x + ( this._current_target._hitbox_x1 + this._current_target._hitbox_x2 ) / 2;
									let yy = this._current_target.y + ( this._current_target._hitbox_y1 + this._current_target._hitbox_y2 ) / 2;
									
									if ( this._current_target.IsTargetable() )
									if ( sdWorld.CheckLineOfSight( this.x, this.y, this._current_target.x, this._current_target.y, null, null, sdCom.com_creature_attack_unignored_classes ) )
									{
										this._next_action += 400;

										this.attack_anim = 8;
										
										this._current_target.DamageWithEffect( 30, this );
					
										this._current_target.PlayDamageEffect( xx, yy );
										//sdWorld.SendEffect({ x:xx, y:yy, type:this._current_target.GetBleedEffect(), filter:this._current_target.GetBleedEffectFilter() });
										
										sdSound.PlaySound({ name:'crystal2_short', x:this.x, y:this.y, volume:1.3, pitch: 0.3 });
									}
									
								}
							}
						}
						else
						{
							this._next_action = sdWorld.time + 1500 + Math.random() * 6000;

							let r = Math.random();

							if ( r < 0.333 )
							this._blink_until = sdWorld.time + 200 + Math.random() * 200;
							else
							if ( r < 0.5 )
							{
								//this.side = Math.random() < 0.5 ? 1 : -1;
								this.sy -= ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ) ? 4 : 3;
								this.walk_direction = this.side * 60;
								this.PhysWakeUp();
							}
							else
							{
								this.walk_direction = -100 + Math.random() * 200;
								this.side = this.walk_direction > 0 ? 1 : -1;
							}
						}
					}
					this.blink = sdWorld.time < this._blink_until;
				}
				else
				this.blink = 1;
			}

			if ( !this.held_by )
			{
				if ( this.walk_direction !== 0 )
				{
					if ( sdWorld.time < this._last_stand_when + 50 )
					{
						this.sx += this.walk_direction * 0.01 * GSPEED;
					}

					this.PhysWakeUp();

					if ( this.walk_direction > 0 )
					this.walk_direction = Math.max( 0, this.walk_direction - GSPEED );
					else
					this.walk_direction = Math.min( 0, this.walk_direction + GSPEED );
				}

				sdWorld.last_hit_entity = null;

				this.ApplyVelocityAndCollisions( GSPEED, 0, this.sy >= 0 );

				if ( sdWorld.last_hit_entity )
				{
					this._last_stand_when = sdWorld.time;
				}
			}
		}
		else
		{
			if ( !this.held_by )
			this.ApplyVelocityAndCollisions( GSPEED, 0, true );
		}

		{
			if ( this.is_anticrystal )
			{
				if ( this.held_by === null || !this.held_by.shielded )
				{
					this.HungryMatterGlow( 0.01, 100, GSPEED_scaled );
					this.matter = Math.max( 0, this.matter - GSPEED_scaled * 0.01 * this.matter );
				}
			}
			else
			{
				let matter_before_regen = this.matter;

				if ( this.held_by && this.held_by.is( sdMatterAmplifier ) )
				this.matter = Math.min( this.matter_max, this.matter + GSPEED_scaled * 0.001 * this.matter_max / 80 * ( this.matter_regen / 100 ) * ( sdMatterAmplifier.relative_regen_amplification_to_crystals * ( this.held_by.multiplier ) ) );
				else
				this.matter = Math.min( this.matter_max, this.matter + GSPEED_scaled * 0.001 * this.matter_max / 80 * ( this.matter_regen / 100 ) );

				if ( sdWorld.server_config.base_degradation )
				this.matter_regen = Math.max( sdCrystal.lowest_matter_regen, this.matter_regen - ( this.matter - matter_before_regen ) / this.matter_max * 100 / sdCrystal.recharges_until_depleated ); // 30 full recharges

				this.MatterGlow( 0.01, 30, GSPEED_scaled );
			}
		}
	}
	
	onMovementInRange( from_entity )
	{
		if ( !sdWorld.is_server )
		return;
	
		// Easier crystal combining
		if ( from_entity )
		if ( from_entity.is( sdCrystal ) )
		if ( this.held_by )
		if ( from_entity.held_by !== this.held_by )
		{
			this.held_by.onMovementInRange( from_entity );
		}
	}
	DrawHUD( ctx, attached ) // foreground layer
	{
		{
			if ( this.is_anticrystal )
			sdEntity.TooltipUntranslated( ctx, this.title + " ( " + ~~(this.matter) + " / " + ~~(this.matter_max) + " )" );
			else
			{
				if ( sdWorld.my_entity.is( sdPlayerDrone ) ||
					( sdWorld.my_entity._inventory[ sdGun.classes[ sdGun.CLASS_CABLE_TOOL ].slot ] && 
					  sdWorld.my_entity._inventory[ sdGun.classes[ sdGun.CLASS_CABLE_TOOL ].slot ].class === sdGun.CLASS_CABLE_TOOL ) )
				sdEntity.TooltipUntranslated( ctx, this.title + " ( " + ~~(this.matter) + " / " + ~~(this.matter_max) + " ) (matter regeneration rate: " + ~~(this.matter_regen ) + "%)" );
				else
				{
					if ( this.is_depleted )
					sdEntity.TooltipUntranslated( ctx, this.title + " ( " + ~~(this.matter) + " / " + ~~(this.matter_max) + " ) (depleted)" );
					else
					sdEntity.TooltipUntranslated( ctx, this.title + " ( " + ~~(this.matter) + " / " + ~~(this.matter_max) + " )" );
				}
			}
		}
	}
	HookAttempt() // true for allow. this._current_target is sdBullet that is hook tracer
	{
		if ( !sdWorld.is_server )
		return false;
	
		if ( this.held_by )
		if ( typeof this.held_by.DropCrystal !== 'undefined' )
		{
			this.held_by.DropCrystal( this, true );
		}
		
		return true;
	}
	static DoNothing( filter )
	{
		return filter;
	}
	Draw( ctx, attached )
	{
		let filter_brightness_effect = sdCrystal.DoNothing;
		
		ctx.apply_shading = false;
		
		if ( attached )
		if ( this.held_by )
		if ( this.held_by.ModifyHeldCrystalFilter )
		filter_brightness_effect = ( f )=>{ return this.held_by.ModifyHeldCrystalFilter( f ) };
		
		const setFilter = ( crystal_hue_filter )=>
		{
			let f = crystal_hue_filter;

			if ( this.is_very_depleted )
			f += 'saturate(0.15) hue-rotate(-20deg)';
			else
			if ( this.is_depleted )
			f += 'saturate(0.5) hue-rotate(-20deg)';
			else
			if ( this.is_overcharged )
			f += 'saturate(2) brightness(1.5)';

			ctx.filter = filter_brightness_effect( f );
		};
		
		{
			if ( this.held_by === null || attached )
			{
				if ( this.type === sdCrystal.TYPE_CRYSTAL || this.type === sdCrystal.TYPE_CRYSTAL_CORRUPTED || this.type === sdCrystal.TYPE_CRYSTAL_ARTIFICIAL )
				{
					if ( this.type === sdCrystal.TYPE_CRYSTAL_ARTIFICIAL )
					ctx.drawImageFilterCache( sdCrystal.img_crystal_artificial_empty, - 16, - 16, 32, 32 );
					else
					ctx.drawImageFilterCache( sdCrystal.img_crystal_empty, - 16, - 16, 32, 32 );

					//ctx.filter = filter_brightness_effect( sdWorld.GetCrystalHue( this.matter_max ) );
					setFilter( sdWorld.GetCrystalHue( this.matter_max ) );

					if ( this.matter_max === sdCrystal.anticrystal_value )
					ctx.globalAlpha = 0.8 + Math.sin( sdWorld.time / 3000 ) * 0.1;
					else
					ctx.globalAlpha = this.matter / this.matter_max;

					if ( this.type === sdCrystal.TYPE_CRYSTAL_ARTIFICIAL )
					ctx.drawImageFilterCache( sdCrystal.img_crystal_artificial, - 16, - 16, 32, 32 );
					else
					ctx.drawImageFilterCache( sdCrystal.img_crystal, - 16, - 16, 32, 32 );

					ctx.globalAlpha = 1;
					ctx.filter = 'none';

					if ( this.type === sdCrystal.TYPE_CRYSTAL_CORRUPTED )
					{
						ctx.drawImageFilterCache( sdCrystal.img_crystal_corrupted, - 16, - 16, 32, 32 );
					}
				}
				else
				if ( this.type === sdCrystal.TYPE_CRYSTAL_BIG )
				{
					ctx.drawImageFilterCache( sdCrystal.img_crystal_cluster2_empty, - 24, - 24, 48, 48 );

					setFilter( sdWorld.GetCrystalHue( this.matter_max / 4 ) );

					if ( this.matter_max === sdCrystal.anticrystal_value * 4 )
					ctx.globalAlpha = 0.8 + Math.sin( sdWorld.time / 3000 ) * 0.1;
					else
					ctx.globalAlpha = this.matter / this.matter_max;

					ctx.drawImageFilterCache( sdCrystal.img_crystal_cluster2, - 24, - 24, 48, 48 );

					ctx.globalAlpha = 1;
					ctx.filter = 'none';
				}
				else
				if ( this.type === sdCrystal.TYPE_CRYSTAL_GIANT )
				{
					ctx.drawImageFilterCache( sdCrystal.img_crystal_cluster3_empty, - 48, - 48, 96, 96 );

					setFilter( sdWorld.GetCrystalHue( this.matter_max / 16 ) );

					if ( this.matter_max === sdCrystal.anticrystal_value * 16 )
					ctx.globalAlpha = 0.8 + Math.sin( sdWorld.time / 3000 ) * 0.1;
					else
					ctx.globalAlpha = this.matter / this.matter_max;

					ctx.drawImageFilterCache( sdCrystal.img_crystal_cluster3, - 48, - 48, 96, 96 );

					ctx.globalAlpha = 1;
					ctx.filter = 'none';
				}
				else
				if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB || this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG )
				{
					ctx.scale( -this.side, 1 );

					let frame = 0;

					if ( this.walk_direction !== 0 && this.attack_anim <= 0 )
					{
						frame = [ 0, 1, 0, 2 ][ ~~( Math.abs( this.walk_direction / 4 ) % 4 ) ];
					}
					else
					if ( this.blink )
					frame = 3;
					else
					if ( this.attack_anim > 0 )
					frame = 4;

					if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB )
					ctx.drawImageFilterCache( sdCrystal.img_crystal_crab, frame*32,32,32,32, - 16, - 16, 32,32 );
					else
					ctx.drawImageFilterCache( sdCrystal.img_crystal_crab_big, frame*48,48,48,48, - 24, - 24, 48,48 );

					//ctx.filter = filter_brightness_effect( sdWorld.GetCrystalHue( (this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ) ? this.matter_max / 4: this.matter_max, 0.75, 'aa' ) );
					setFilter( sdWorld.GetCrystalHue( (this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG ) ? this.matter_max / 4: this.matter_max, 0.75, 'aa' ) );

					if ( ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB && this.matter_max === sdCrystal.anticrystal_value ) || ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB_BIG && this.matter_max === sdCrystal.anticrystal_value * 4 ) )
					ctx.globalAlpha = 0.8 + Math.sin( sdWorld.time / 3000 ) * 0.1;
					else
					ctx.globalAlpha = this.matter / this.matter_max;

					if ( this.type === sdCrystal.TYPE_CRYSTAL_CRAB )
					ctx.drawImageFilterCache( sdCrystal.img_crystal_crab, frame*32,0,32,32, - 16, - 16, 32,32 );
					else
					ctx.drawImageFilterCache( sdCrystal.img_crystal_crab_big, frame*48,0,48,48, - 24, - 24, 48,48 );

					ctx.globalAlpha = 1;
					ctx.filter = 'none';
				}

			}
			
			//ctx.translate( 0, -16 );
		}
		
		//ctx.apply_shading = true;
	}
	onBeforeRemove() // Class-specific, if needed
	{
		if ( this.held_by )
		if ( typeof this.held_by.DropCrystal !== 'undefined' )
		{
			this.held_by.DropCrystal( this );
		}
	}
	MeasureMatterCost()
	{
		return 140 + this.matter;
	}
	
}
//sdCrystal.init_class();

export default sdCrystal;