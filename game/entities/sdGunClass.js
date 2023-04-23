
import sdWorld from '../sdWorld.js';
import sdSound from '../sdSound.js';
import sdEffect from './sdEffect.js';
import sdCharacter from './sdCharacter.js';
import sdBlock from './sdBlock.js';
import sdGun from './sdGun.js';
import sdLost from './sdLost.js';
import sdCable from './sdCable.js';
import sdEntity from './sdEntity.js';
import sdNode from './sdNode.js';
import sdBullet from './sdBullet.js';
import sdPortal from './sdPortal.js';
import sdJunk from './sdJunk.js';
import sdOverlord from './sdOverlord.js';
import sdCom from './sdCom.js';
import sdWater from './sdWater.js';
import sdBloodDecal from './sdBloodDecal.js';
import sdBG from './sdBG.js';
import sdCube from './sdCube.js';
import sdCrystal from './sdCrystal.js';
import sdStatusEffect from './sdStatusEffect.js';

/*

	Spritesheet suggestion:

	level1_idle		| level2_idle	| level3_idle	| level4_idle 
	attack1			| attack1		| attack1		| attack1 
	attack2			| attack2		| attack2		| attack2 
	attack3			| attack3		| attack3		| attack3 
	reload1			| reload1		| reload1		| reload1 
	reload2			| reload2		| reload2		| reload2 
	reload3			| reload3		| reload3		| reload3 
	reload4			| reload4		| reload4		| reload4 
	attachment1		| attachment2	| attachment3	| attachment4

*/

class sdGunClass
{
	static init_class()
	{
		function AddRecolorsFromColorAndCost( arr, from_color, cost, prefix='', category='' )
		{
			/*let colors = [
				'cyan', '#00fff6',
				'yellow', '#ffff00',
				'white', '#dddddd',
				'bright white', '#ffffff',
				'pink', '#ff00ff',
				'red', '#fb6464',
				'full red', '#ff0000',
				'deep red', '#880000',
				'green', '#31ff6b',
				'full green', '#00ff00',
				'deep green', '#008800',
				'blue', '#213eec',
				'full blue', '#0000ff',
				'deep blue', '#000088',
				'dark', '#434447',
				'grey', '#888888',
				'black', '#000000',
				'bright-pink', '#ffa2e1'
			];
			
			for ( let i = 0; i < colors.length; i += 2 )
			arr.push(
			{ 
				title: 'Make ' + ( prefix ? prefix + ' ' : '' ) + colors[ i ],
				title: 'Make ' + ( prefix ? prefix + ' ' : '' ) + colors[ i ],
				cost: cost,
				category: category,
				hint_color: colors[ i + 1 ],
				action: ( gun, initiator=null )=>
				{ 
					if ( !gun.sd_filter )
					gun.sd_filter = sdWorld.CreateSDFilter();
				
					sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, from_color, colors[ i + 1 ] );
				}
			});*/

			arr.push(
			{ 
				title: 'Customize ' + ( prefix ? prefix + ' ' : '' ) + 'color',
				cost: cost,
				category: category,
				//hint_color: '#ff0000', // Should be guessed from gun
				color_picker_for: from_color,
				action: ( gun, initiator=null, hex_color=null )=> // action method is called with 3rd parameter only because .color_picker_for is causing sdWeaponBench to send extra parameters at .AddColorPickerContextOption . It does not send first parameter from "parameters_array" which is passed to .ExecuteContextCommand as it contains just upgrade ID, which is pointless here (yes, it converts array into function arguments)
				{ 
					if ( typeof hex_color === 'string' && hex_color.length === 7 ) // ReplaceColorInSDFilter_v2 does the type check but just in case
					{
						if ( !gun.sd_filter )
						gun.sd_filter = sdWorld.CreateSDFilter();

						// Pass custom hex colors to this function

						sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, from_color, hex_color );
						//sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, from_color, '#00ff00' );
					}
				}
			});
			
			for ( let i = 0; i < arr.length; i++ )
			if ( arr[ i ].title === 'Remove colors' )
			if ( arr[ i ].category === category )
			{
				arr.splice( i, 1 );
				i--;
				continue;
			}

			arr.push(
			{ 
				title: 'Remove colors',
				cost: cost,
				category: category,
				action: ( gun, initiator=null )=>
				{ 
					gun.sd_filter = null;
				}
			});
			
			return arr;
		}
		function AppendBasicCubeGunRecolorUpgrades( arr )
		{
			AddRecolorsFromColorAndCost( arr, '#00fff6', 100 );
			
			return arr;
		}
		function AddShotgunAmmoTypes( arr )
		{
			arr.push(
			{ 
				title: 'Convert ammo type to slug pellets',
				cost: 100,
				action: ( gun, initiator=null )=>
				{ 
					gun._spread = 0; // Perhaps it should take properties from sdGunClass, although it's the same?
				}
			});

			arr.push(
			{ 
				title: 'Add incediary ammo to shotgun',
				cost: 200,
				action: ( gun, initiator=null )=>
				{ 
					gun._temperature_addition = 800; // Perhaps it should take properties from sdGunClass, although it's the same?
				}
			});

			arr.push(
			{ 
				title: 'Add freezing ammo to shotgun',
				cost: 200,
				action: ( gun, initiator=null )=>
				{ 
					gun._temperature_addition = -400; // Perhaps it should take properties from sdGunClass, although it's the same?
				}
			});
			
			arr.push(
			{ 
				title: 'Revert projectile type to default',
				cost: 0,
				action: ( gun, initiator=null )=>
				{ 
					gun._spread = sdGun.classes[ gun.class ].spread; // Perhaps it should take properties from sdGunClass, although it's the same?
					gun._temperature_addition = 0; // Remove Dragon's breath aswell
				}
			});
			
			return arr;
		}

		let ID_BASE = 0;
		let ID_STOCK = 1;
		let ID_MAGAZINE = 2;
		let ID_BARREL = 3;
		let ID_UNDERBARREL = 4;
		let ID_MUZZLE = 5;
		let ID_SCOPE = 6;
		let ID_DAMAGE_MULT = 7;
		let ID_FIRE_RATE = 8;
		let ID_RECOIL_SCALE = 9;
		let ID_HAS_EXPLOSION = 10;
		let ID_TEMPERATURE_APPLIED = 11;
		let ID_HAS_SHOTGUN_EFFECT = 12;
		let ID_HAS_RAIL_EFFECT = 13;
		let ID_SLOT = 14;
		let ID_TITLE = 15;
		let ID_PROJECTILE_COLOR = 16;
		let ID_DAMAGE_VALUE = 17; // For non custom-guns so it can display damage properly.
		
		function UpdateCusomizableGunProperties( gun )
		{
			gun._count = gun.extra[ ID_HAS_SHOTGUN_EFFECT ] ? 5 : 1;
			gun._spread = gun.extra[ ID_HAS_SHOTGUN_EFFECT ] ? 0.2 : ( 0.1 * gun.extra[ ID_RECOIL_SCALE ] );
			gun._reload_time = ( gun.extra[ ID_HAS_RAIL_EFFECT ] ? 2 : 1 ) * ( gun.extra[ ID_HAS_SHOTGUN_EFFECT ] ? 5 : 1 ) * ( sdGun.classes[ gun.class ].reload_time / sdGun.classes[ gun.class ].parts_magazine[ gun.extra[ ID_MAGAZINE ] ].rate ) * gun.extra[ ID_FIRE_RATE ];
			
			gun._temperature_addition = gun.extra[ ID_TEMPERATURE_APPLIED ];
			
			if ( gun.extra[ ID_HAS_SHOTGUN_EFFECT ] )
			gun.extra[ ID_SLOT ] = 3;
			else
			if ( gun.extra[ ID_HAS_RAIL_EFFECT ] )
			gun.extra[ ID_SLOT ] = 4;
			else
			if ( gun.extra[ ID_HAS_EXPLOSION ] )
			gun.extra[ ID_SLOT ] = 5;
			else
			gun.extra[ ID_SLOT ] = 2;
		
			gun.ammo_left = Math.min( gun.ammo_left, gun.GetAmmoCapacity() );
		}
		
		function AddGunEditorUpgrades( custom_rifle_upgrades=[] )
		{
			function AddCustomizationUpgrade( custom_rifle_upgrades, id, class_prop )
			{
				custom_rifle_upgrades.push(
						{
							title: 'Change ' + class_prop.split( 'parts_' ).join( '' ), 
							cost: 0, 
							//represents_category: '',
							category: 'customize_parts',
							action: ( gun, initiator=null )=> 
							{
								if ( sdGun.classes[ gun.class ][ class_prop ].length > 0 )
								{
									gun.extra[ id ] = ( ( gun.extra[ id ] || 0 ) + 1 ) % sdGun.classes[ gun.class ][ class_prop ].length; 
									UpdateCusomizableGunProperties( gun );
								}
								else
								{
									if ( initiator )
									if ( initiator._socket )
									initiator._socket.SDServiceMessage( 'Gun class does not support '+class_prop.split( 'parts_' ).join( '' )+' altering.' );
								}
							} 
						} 
				);
		
				return custom_rifle_upgrades;
			}

			AddCustomizationUpgrade( custom_rifle_upgrades, ID_BASE, 'parts_base' );
			AddCustomizationUpgrade( custom_rifle_upgrades, ID_STOCK, 'parts_stock' );
			AddCustomizationUpgrade( custom_rifle_upgrades, ID_MAGAZINE, 'parts_magazine' );
			AddCustomizationUpgrade( custom_rifle_upgrades, ID_BARREL, 'parts_barrel' );
			AddCustomizationUpgrade( custom_rifle_upgrades, ID_UNDERBARREL, 'parts_underbarrel' );
			AddCustomizationUpgrade( custom_rifle_upgrades, ID_MUZZLE, 'parts_muzzle' );
			AddCustomizationUpgrade( custom_rifle_upgrades, ID_SCOPE, 'parts_scope' );
			
			custom_rifle_upgrades.push(
				{
					title: 'Customize parts...', 
					represents_category: 'customize_parts'
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Customize colors...', 
					represents_category: 'customize_colors'
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Customize properties...', 
					represents_category: 'customize_properties'
				} 
			);
			/*custom_rifle_upgrades.push(
				{
					title: 'Customize main color...', 
					represents_category: 'customize_colors_main',
					category: 'customize_colors'
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Customize dark color...', 
					represents_category: 'customize_colors_dark',
					category: 'customize_colors'
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Customize bright color...', 
					represents_category: 'customize_colors_bright',
					category: 'customize_colors'
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Customize energy color...', 
					represents_category: 'customize_colors_energy',
					category: 'customize_colors'
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Customize laser color...', 
					represents_category: 'customize_colors_laser',
					category: 'customize_colors'
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Customize bullets color...', 
					represents_category: 'customize_colors_bullets',
					category: 'customize_colors'
				} 
			);*/
	
			custom_rifle_upgrades.push(
				{
					title: 'Randomize projectile color', 
					cost: 0, 
					category: 'customize_colors',
					action: ( gun, initiator=null )=> 
					{ 
						gun.extra[ ID_PROJECTILE_COLOR ] = '#';
						let str = '0123456789abcdef';
						for ( let i = 0; i < 6; i++ )
						gun.extra[ ID_PROJECTILE_COLOR ] += str.charAt( ~~( Math.random() * str.length ) );
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Randomize fire sound', 
					cost: 0, 
					category: 'customize_colors',
					action: ( gun, initiator=null )=> 
					{
						let options = [];
						for ( let i = 0; i < sdGun.classes.length; i++ )
						{
							if ( sdGun.classes[ i ] )
							if ( sdGun.classes[ i ].sound )
							if ( options.indexOf( sdGun.classes[ i ].sound ) === -1 )
							{
								options.push( sdGun.classes[ i ].sound );
							}
						}
						if ( options.length > 0 )
						{
							gun._sound = options[ ~~( Math.random() * options.length ) ];
						}
						gun._sound_pitch = 0.5 + Math.pow( Math.random(), 2 ) * 2;
					} 
				} 
			);
			/*AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#000000', 0, '', 'customize_colors_main' );
			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#404040', 0, '', 'customize_colors_dark' );
			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#808080', 0, '', 'customize_colors_bright' );
			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#6ca2d0', 0, '', 'customize_colors_energy' );
			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#ff0000', 0, '', 'customize_colors_laser' );
			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#9d822f', 0, '', 'customize_colors_bullets' );*/

			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#000000', 0, 'main', 'customize_colors' );
			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#404040', 0, 'dark', 'customize_colors' );
			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#808080', 0, 'bright', 'customize_colors' );
			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#6ca2d0', 0, 'energy', 'customize_colors' );
			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#ff0000', 0, 'laset', 'customize_colors' );
			AddRecolorsFromColorAndCost( custom_rifle_upgrades, '#9d822f', 0, 'magazine', 'customize_colors' );
			
			custom_rifle_upgrades.push(
				{
					title: 'Increase damage', 
					cost: 500, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( initiator.matter_max > 14000 )
						{ 
							if ( gun.extra[ ID_DAMAGE_MULT ] < 5 )
							{
								gun.extra[ ID_DAMAGE_MULT ] += 0.05; // 5%
								UpdateCusomizableGunProperties( gun );

								if ( initiator )
								if ( initiator._socket )
								if ( gun.extra[ ID_DAMAGE_MULT ] > 3 )
								initiator._socket.SDServiceMessage( 'Super Power!' );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						}
						else
						{ 
							if ( gun.extra[ ID_DAMAGE_MULT ] < 3 )
							{
								gun.extra[ ID_DAMAGE_MULT ] += 0.05; // 5%
								UpdateCusomizableGunProperties( gun );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						}
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Decrease damage', 
					cost: 0, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( gun.extra[ ID_DAMAGE_MULT ] > 0 )
						{
							gun.extra[ ID_DAMAGE_MULT ] = Math.max( 0, gun.extra[ ID_DAMAGE_MULT ] - 0.05 ); // 5%
							//gun.extra[ ID_RECOIL_SCALE ] *= 1.05; // 5%
							UpdateCusomizableGunProperties( gun );
						}
						else
						{
							if ( initiator )
							if ( initiator._socket )
							initiator._socket.SDServiceMessage( 'Limit has been reached.' );
						}
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Increase projectile temperature', 
					cost: 250, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( initiator.matter_max > 14000 )
						{ 
							if ( gun.extra[ ID_TEMPERATURE_APPLIED ] < 2000 )
							{
								gun.extra[ ID_TEMPERATURE_APPLIED ] += 20;
								UpdateCusomizableGunProperties( gun );

								if ( initiator )
								if ( initiator._socket )
								if ( gun.extra[ ID_TEMPERATURE_APPLIED ] > 750 )
								initiator._socket.SDServiceMessage( 'Super Power!' );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						} 
						else
						{ 
							if ( gun.extra[ ID_TEMPERATURE_APPLIED ] < 750 )
							{
								gun.extra[ ID_TEMPERATURE_APPLIED ] += 20;
								UpdateCusomizableGunProperties( gun );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						} 
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Decrease projectile temperature', 
					cost: 0, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( initiator.matter_max > 14000 )
						{ 
							if ( gun.extra[ ID_TEMPERATURE_APPLIED ] > -800 )
							{
								gun.extra[ ID_TEMPERATURE_APPLIED ] -= 20;
								UpdateCusomizableGunProperties( gun );

								if ( initiator )
								if ( initiator._socket )
								if ( gun.extra[ ID_TEMPERATURE_APPLIED ] < -420 )
								initiator._socket.SDServiceMessage( 'Super Power!' );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						}
						else
						{ 
							if ( gun.extra[ ID_TEMPERATURE_APPLIED ] > -420 )
							{
								gun.extra[ ID_TEMPERATURE_APPLIED ] -= 20;
								UpdateCusomizableGunProperties( gun );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						}
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Increase fire rate', 
					cost: 0, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( initiator.matter_max > 14000 )
						{ 
							gun.extra[ ID_FIRE_RATE ] = Math.max( 0.3, gun.extra[ ID_FIRE_RATE ] - 0.1 );
							UpdateCusomizableGunProperties( gun );

							if ( initiator )
							if ( initiator._socket )
							if ( gun.extra[ ID_FIRE_RATE ] < 0.5 );
							initiator._socket.SDServiceMessage( 'Super Power!' );
						} 
						else
						{ 
							gun.extra[ ID_FIRE_RATE ] = Math.max( 0.5, gun.extra[ ID_FIRE_RATE ] - 0.1 );
							UpdateCusomizableGunProperties( gun );
						} 
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Decrease fire rate', 
					cost: 0, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						gun.extra[ ID_FIRE_RATE ] = Math.min( 10, gun.extra[ ID_FIRE_RATE ] + 0.1 );
						UpdateCusomizableGunProperties( gun );
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Improve recoil control', 
					cost: 250, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						gun.extra[ ID_RECOIL_SCALE ] *= 0.95; // 5%
						UpdateCusomizableGunProperties( gun );
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Worsen recoil control', 
					cost: 0, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						gun.extra[ ID_RECOIL_SCALE ] = Math.min( 1.5, gun.extra[ ID_RECOIL_SCALE ] * 1.05 ); // Limit recoil decreasing so it doesn't crash server
						UpdateCusomizableGunProperties( gun );
					} 
				} 
			);
	
			custom_rifle_upgrades.push(
				{
					title: 'Toggle rail mode', 
					cost: 500, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						gun.extra[ ID_HAS_RAIL_EFFECT ] = 1 - gun.extra[ ID_HAS_RAIL_EFFECT ];
						UpdateCusomizableGunProperties( gun );
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Toggle explosive mode', 
					cost: 500, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						gun.extra[ ID_HAS_EXPLOSION ] = 1 - gun.extra[ ID_HAS_EXPLOSION ];
						UpdateCusomizableGunProperties( gun );
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Toggle shotgun mode', 
					cost: 100, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						gun.extra[ ID_HAS_SHOTGUN_EFFECT ] = 1 - gun.extra[ ID_HAS_SHOTGUN_EFFECT ];
						UpdateCusomizableGunProperties( gun );
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Toggle biometry lock', 
					cost: 500, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( initiator )
						{
							if ( gun.biometry_lock === -1 )
							gun.biometry_lock = initiator.biometry;
							else
							gun.biometry_lock = -1;
						}
						UpdateCusomizableGunProperties( gun );
					} 
				} 
			);
	
			return custom_rifle_upgrades;
		}


		// Function below for regular non custom guns

		function AddGunDefaultUpgrades( custom_rifle_upgrades=[] )
		{
			custom_rifle_upgrades.push(
				{
					title: 'Customize properties...', 
					represents_category: 'customize_properties'
				} 
			);

			custom_rifle_upgrades.push(
				{
					title: 'Increase damage', 
					cost: 500, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( initiator.matter_max > 14000 )
						{ 
							if ( gun.extra[ ID_DAMAGE_MULT ] < 4 )
							{
								gun.extra[ ID_DAMAGE_MULT ] += 0.05; // 5%

								if ( initiator )
								if ( initiator._socket )
								if ( gun.extra[ ID_DAMAGE_MULT ] > 2 )
								initiator._socket.SDServiceMessage( 'Super Power!' );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						}
						else
						{ 
							if ( gun.extra[ ID_DAMAGE_MULT ] < 2 )
							{
								gun.extra[ ID_DAMAGE_MULT ] += 0.05; // 5%
								//UpdateCusomizableGunProperties( gun );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						}
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Decrease damage', 
					cost: 0, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( gun.extra[ ID_DAMAGE_MULT ] > 0 )
						{
							gun.extra[ ID_DAMAGE_MULT ] = Math.max( 0, gun.extra[ ID_DAMAGE_MULT ] - 0.05 ); // 5%
							//gun.extra[ ID_RECOIL_SCALE ] *= 1.05; // 5%
							//UpdateCusomizableGunProperties( gun );
						}
						else
						{
							if ( initiator )
							if ( initiator._socket )
							initiator._socket.SDServiceMessage( 'Limit has been reached.' );
						}
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Increase projectile temperature', 
					cost: 250, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( initiator.matter_max > 14000 )
						{ 
							if ( gun.extra[ ID_TEMPERATURE_APPLIED ] < 1000 )
							{
								gun.extra[ ID_TEMPERATURE_APPLIED ] += 20;
								gun._temperature_addition = gun.extra[ ID_TEMPERATURE_APPLIED ];

								if ( initiator )
								if ( initiator._socket )
								if ( gun.extra[ ID_TEMPERATURE_APPLIED ] > 500 )
								initiator._socket.SDServiceMessage( 'Super Power!' );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						} 
						else
						{ 
							if ( gun.extra[ ID_TEMPERATURE_APPLIED ] < 500 )
							{
								gun.extra[ ID_TEMPERATURE_APPLIED ] += 20;
								gun._temperature_addition = gun.extra[ ID_TEMPERATURE_APPLIED ];
								//UpdateCusomizableGunProperties( gun );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						} 
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Decrease projectile temperature', 
					cost: 0, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( initiator.matter_max > 14000 )
						{ 
							if ( gun.extra[ ID_TEMPERATURE_APPLIED ] > -500 )
							{
								gun.extra[ ID_TEMPERATURE_APPLIED ] -= 20;
								gun._temperature_addition = gun.extra[ ID_TEMPERATURE_APPLIED ];

								if ( initiator )
								if ( initiator._socket )
								if ( gun.extra[ ID_TEMPERATURE_APPLIED ] < -140 )
								initiator._socket.SDServiceMessage( 'Super Power!' );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						}
						else
						{ 
							if ( gun.extra[ ID_TEMPERATURE_APPLIED ] > -140 )
							{
								gun.extra[ ID_TEMPERATURE_APPLIED ] -= 20;
								gun._temperature_addition = gun.extra[ ID_TEMPERATURE_APPLIED ];
								//UpdateCusomizableGunProperties( gun );
							}
							else
							{
								if ( initiator )
								if ( initiator._socket )
								initiator._socket.SDServiceMessage( 'Limit has been reached.' );
							}
						}
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Increase fire rate', 
					cost: 0, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						if ( initiator.matter_max > 14000 )
						{ 
							gun.extra[ ID_FIRE_RATE ] = Math.max( 0.3, gun.extra[ ID_FIRE_RATE ] - 0.1 );
							gun._reload_time = sdGun.classes[ gun.class ].reload_time * gun.extra[ ID_FIRE_RATE ];

							if ( initiator )
							if ( initiator._socket )
							if ( gun.extra[ ID_FIRE_RATE ] < 0.5 );
							initiator._socket.SDServiceMessage( 'Super Power!' );
						} 
						else
						{ 
							gun.extra[ ID_FIRE_RATE ] = Math.max( 0.5, gun.extra[ ID_FIRE_RATE ] - 0.1 );
							gun._reload_time = sdGun.classes[ gun.class ].reload_time * gun.extra[ ID_FIRE_RATE ];
						} 
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Decrease fire rate', 
					cost: 0, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						gun.extra[ ID_FIRE_RATE ] = Math.min( 10, gun.extra[ ID_FIRE_RATE ] + 0.1 );
						gun._reload_time = sdGun.classes[ gun.class ].reload_time * gun.extra[ ID_FIRE_RATE ];
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Improve recoil control', 
					cost: 250, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						gun.extra[ ID_RECOIL_SCALE ] *= 0.95; // 5%
						//UpdateCusomizableGunProperties( gun );
					} 
				} 
			);
			custom_rifle_upgrades.push(
				{
					title: 'Worsen recoil control', 
					cost: 0, 
					category: 'customize_properties',
					action: ( gun, initiator=null )=> 
					{ 
						gun.extra[ ID_RECOIL_SCALE ] = Math.min( 1.5, gun.extra[ ID_RECOIL_SCALE ] * 1.05 ); // Limit recoil decreasing so it doesn't crash server
						//UpdateCusomizableGunProperties( gun );
					} 
				} 
			);
			return custom_rifle_upgrades;
		}
		/*
		
			Uses defined indices in order to optimize performance AND to keep gun classes compatible across different snapshots.
		
			Will also check for Index problems and tell you if any of changes that are done will cause server to crash eventually (cases like missing indices between few existing indices and index intersection)
		
			Variables prefixed as sdGun.CLASS_* are the indices, here they are assigned during gun class object creation and specify index at sdGun.classes array where bug class object will exist.
		
			You can execute this:
				sdWorld.entity_classes.sdGun.classes
			in devTools console in order to see how it will be stored in the end.
			
			Sure we could insert classes by doing something like sdGun.classes.push({ ... }); but that would not store index of class in array for later quick spawning of new guns.
			We could also do something like sdGun.classes[ sdGun.classes.length ] = { ... }; but that would not give us consistency across different versions of the game and also it seems 
				like sometimes whoever adds new classes seems to be addin them in the middle of the list. Don't do that - add them at the very end.
		
			Once sdGun-s are saved to snapshots only their ID is saved. It means that if IDs will be changed - it is quite possible to convert existing sdGun.CLASS_TRIPLE_RAIL into sdGun.FISTS which isn't event 
				a spawnable gun (only projectile properties are copied from it).
		
			Now press "Ctrl + Shift + -" if you are in NetBeans and go do the impressive!
		
		*/

		sdGun.classes[ sdGun.CLASS_PISTOL = 0 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'pistol' ),
			sound: 'gun_pistol',
			title: 'Pistol',
			slot: 1,
			reload_time: 3,
			muzzle_x: 4,
			ammo_capacity: 12,
			spread: 0.01,
			count: 1,
			fire_type: 2,
			projectile_velocity_dynamic: ( gun )=> { return Math.min( 64, sdGun.default_projectile_velocity ) },
			projectile_properties: { _damage: 1 }, // Set the damage value in onMade function ( gun.extra_ID_DAMAGE_VALUE )
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5, _knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 20; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddRecolorsFromColorAndCost( [], '#171717', 15, 'Down' ), '#010101', 15, 'Up' ) )
			//upgrades: AddGunDefaultUpgrades(AddRecolorsFromColorAndCost( [], '#808080', 5 ))
		};
		
		sdGun.classes[ sdGun.CLASS_RIFLE = 1 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'rifle' ),
			sound: 'gun_rifle',
			title: 'Assault rifle',
			slot: 2,
			reload_time: 3,
			muzzle_x: 7,
			ammo_capacity: 30,
			spread: 0.01, // 0.03
			count: 1,
			projectile_velocity_dynamic: ( gun )=> { return Math.min( 64, sdGun.default_projectile_velocity ) },
			projectile_properties: { _damage: 1 }, // Set the damage value in onMade function ( gun.extra_ID_DAMAGE_VALUE )
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5, _knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 25; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#ff0000', 15 ) )
		};
		
		sdGun.classes[ sdGun.CLASS_SHOTGUN = 2 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shotgun' ),
			sound: 'gun_shotgun',
			title: 'Shotgun',
			slot: 3,
			reload_time: 20,
			muzzle_x: 9,
			ammo_capacity: 8,
			count: 5,
			spread: 0.1,
			matter_cost: 40,
			projectile_velocity_dynamic: ( gun )=> { return Math.min( 64, sdGun.default_projectile_velocity ) },
			projectile_properties: { _damage: 1 }, // Set the damage value in onMade function ( gun.extra_ID_DAMAGE_VALUE )
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = {};
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 20; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades:AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddShotgunAmmoTypes([]), '#808080', 5 ) )
		};
		
		sdGun.classes[ sdGun.CLASS_RAILGUN = 3 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'railgun' ),
			sound: 'gun_railgun',
			title: 'Railgun',
			slot: 4,
			reload_time: 30,
			muzzle_x: 9,
			ammo_capacity: -1,
			count: 1,
			matter_cost: 50,
			projectile_properties: { _damage:1 }, // Set properties inside projectile_properties_dynamic
			projectile_velocity_dynamic: ( gun )=> { return Math.min( 64, sdGun.default_projectile_velocity ) },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, _rail_circled: true, color: '#62c8f2' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 70; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#62c8f2', 20 ) )
		};
		
		sdGun.classes[ sdGun.CLASS_ROCKET = 4 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'rocket' ),
			sound: 'gun_rocket',
			title: 'Rocket launcher',
			slot: 5,
			reload_time: 30,
			muzzle_x: 7,
			ammo_capacity: -1,
			spread: 0.05,
			projectile_velocity: 14,
			count: 1,
			matter_cost: 60,
			projectile_properties: { explosion_radius: 19, model: 'rocket_proj', _damage: 19 * 3, color:sdEffect.default_explosion_color, ac:1, _vehicle_mult:sdGun.default_vehicle_mult_bonus, _dirt_mult: 2 },// Set properties inside projectile_properties_dynamic
			projectile_velocity_dynamic: ( gun )=> { return Math.min( 64, sdGun.default_projectile_velocity ) },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { explosion_radius: 19, model: 'rocket_proj', color:sdEffect.default_explosion_color, ac:1, _vehicle_mult:sdGun.default_vehicle_mult_bonus, _dirt_mult: 2 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 19 * 3; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#808000', 20 ) )
		};
		
		sdGun.classes[ sdGun.CLASS_MEDIKIT = 5 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'medikit' ),
			sound: 'gun_defibrillator',
			title: 'Defibrillator',
			slot: 6,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			projectile_properties: { _damage: 1 },
			projectile_velocity_dynamic: ( gun )=> { return Math.min( 64, sdGun.default_projectile_velocity ) },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 2, color: 'transparent' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( gun._held_by )
				if ( gun._held_by.IsPlayerClass() )
				if ( gun._held_by.hea < gun._held_by.hmax )
				{
					gun._held_by.DamageWithEffect( gun.extra[ ID_DAMAGE_VALUE ] * gun.extra[ ID_DAMAGE_MULT ], null ); // Heal self if HP isn't max. However this healing is unaffected by damage mult and power pack
				}
				return true;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = -20; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};
		
		sdGun.classes[ sdGun.CLASS_SPARK = 6 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'spark' ),
			sound: 'gun_spark',
			title: 'Spark',
			slot: 8,
			reload_time: 7,
			muzzle_x: 7,
			ammo_capacity: 16,
			count: 1,
			matter_cost: 60,
			projectile_velocity: 16,
			projectile_properties: { _damage: 1 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { explosion_radius: 10, model: 'ball', color:'#00ffff', _dirt_mult: 1 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 5; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#62c8f2', 20 ) )
			//upgrades: AddGunDefaultUpgrades()
		};
		
		sdGun.classes[ sdGun.CLASS_BUILD_TOOL = 7 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'buildtool' ),
			sound: 'gun_buildtool',
			title: 'Build tool',
			slot: 9,
			reload_time: 15,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			is_build_gun: true,
			allow_aim_assist: false,
			projectile_properties: { _damage: 0 },
		};
		
		sdGun.classes[ sdGun.CLASS_CRYSTAL_SHARD = 8 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'crystal_shard' ),
			title: 'Crystal shard',
			hea: 5,
			no_tilt: true,
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			spawnable: false,
			ignore_slot: true,
			apply_shading: false,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as matter
			{ 
				// 2 was too bad for case of randomly breaking crystals when digging
				if ( character.matter + gun.extra <= character.matter_max )
				{
					character.matter += gun.extra;
					gun.remove(); 
				}
				else
				if ( character.matter < character.matter_max - 1 )
				{
					gun.extra -= character.matter_max - character.matter;
					character.matter = character.matter_max;
					
					if ( gun.extra < 1 )
					gun.remove(); 
				}

				return false; 
			},
			onMade: ( gun )=>
			{
				const normal_ttl_seconds = 9;
				
				gun.ttl = 30 * normal_ttl_seconds * ( 0.7 + Math.random() * 0.3 ); // was 7 seconds, now 9
			}
		};
		
		sdGun.classes[ sdGun.CLASS_GRENADE_LAUNCHER = 9 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'grenade_launcher' ),
			sound: 'gun_grenade_launcher',
			title: 'Grenade launcher',
			slot: 5,
			reload_time: 20,
			muzzle_x: 7,
			ammo_capacity: -1,
			spread: 0.05,
			count: 1,
			projectile_velocity: 7,
			matter_cost: 60,
			projectile_properties: { damage:1 },
			projectile_velocity_dynamic: ( gun )=> { return 7 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { explosion_radius: 13, time_left: 30 * 3, model: 'grenade', color:sdEffect.default_explosion_color, is_grenade: true, _dirt_mult: 2 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 13 * 2; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#ff0000', 20 ) )
			//upgrades: AddGunDefaultUpgrades()
		};
		
		sdGun.classes[ sdGun.CLASS_NEEDLE = 10 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'needle' ),
			sound: 'gun_needle',
			sound_volume: 0.4,
			title: 'Needle',
			slot: 4,
			reload_time: 12,
			muzzle_x: null, // It is supposed to be supressed
			ammo_capacity: 10,
			count: 1,
			projectile_velocity: sdGun.default_projectile_velocity * 1.5,
			matter_cost: 60,
			projectile_properties: { _damage: 50, /*_knock_scale:0.01 * 8, */penetrating:true, _dirt_mult: -0.5 },
			projectile_velocity_dynamic: ( gun )=> { return sdGun.default_projectile_velocity * 1.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { penetrating:true, _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 50; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#ffb33c', 20 ) )
			//upgrades: AddGunDefaultUpgrades()
		};
		
		sdGun.classes[ sdGun.CLASS_SWORD = 11 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'sword' ),
			//sound: 'gun_medikit',
			title: 'Sword',
			sound: 'sword_attack2',
			image_no_matter: sdWorld.CreateImageFromFile( 'sword_disabled' ),
			slot: 0,
			reload_time: 8,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: true,
			projectile_velocity: 16 * 1.5,
			projectile_properties: { time_left: 1, _damage: 35, color: 'transparent', _knock_scale:0.025 * 8 },
			projectile_velocity_dynamic: ( gun )=> { return 16 * 1.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 1, color: 'transparent', _knock_scale:0.025 * 8 };
				//obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 35; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#ff0000', 20 ) )
		};
		
		sdGun.classes[ sdGun.CLASS_STIMPACK = 12 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'stimpack' ),
			sound: 'gun_defibrillator',
			title: 'Stimpack',
			sound_pitch: 0.5,
			slot: 7,
			reload_time: 30 * 2,
			muzzle_x: null,
			ammo_capacity: -1,
			category: 'Other',
			count: 1,
			matter_cost: 300,
			projectile_velocity: 16,
			min_build_tool_level: 39,
			min_workbench_level: 7,
			GetAmmoCost: ()=>
			{
				return 0;
			},
			projectile_properties: { time_left: 2, _damage: 1, color: 'transparent', _return_damage_to_owner:true, _custom_target_reaction:( bullet, target_entity )=>
				{
					if ( target_entity.IsPlayerClass() )
					{
						target_entity.AnnounceTooManyEffectsIfNeeded();
						target_entity.stim_ef = 30 * 30;
						
						if ( bullet._owner._inventory[ sdGun.classes[ sdGun.CLASS_STIMPACK ].slot ] )
						bullet._owner._inventory[ sdGun.classes[ sdGun.CLASS_STIMPACK ].slot ].remove();
					}
				}
			}
		};
		
		sdGun.classes[ sdGun.CLASS_FALKOK_RIFLE = 13 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'f_rifle' ),
			sound: 'gun_f_rifle',
			title: 'Assault Rifle C-01r',
			slot: 2,
			reload_time: 3,
			muzzle_x: 7,
			ammo_capacity: 35,
			spread: 0.02,
			count: 1,
			projectile_properties: { _damage: 25, color:'#afdfff', _dirt_mult: -0.5 },
			matter_cost: 40,
			min_build_tool_level: 4,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color:'#afdfff', _dirt_mult: -0.5, _knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 25; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddRecolorsFromColorAndCost( [], '#ff0000', 15, 'Pointer' ), '#007bcc', 15, 'Circles' ) )
		};
		
		sdGun.classes[ sdGun.CLASS_TRIPLE_RAIL = 14 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'triple_rail' ),
			sound: 'cube_attack',
			title: 'Cube-gun',
			slot: 4,
			reload_time: 3,
			muzzle_x: 7,
			ammo_capacity: -1,// 10, // 3
			count: 1,
			projectile_properties: { _rail: true, _damage: 15, color: '#62c8f2'/*, _knock_scale:0.01 * 8*/ }, // 70
			min_build_tool_level: 25,
			min_workbench_level: 7,
			matter_cost: 160,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#62c8f2', _knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 15; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades:
			AddGunDefaultUpgrades( AppendBasicCubeGunRecolorUpgrades( 
				[
					{ 
						title: 'Upgrade to v2',
						cost: 300,
						action: ( gun, initiator=null )=>{ gun.class = sdGun.CLASS_TRIPLE_RAIL2;
										gun.extra[ ID_DAMAGE_VALUE ] = 15 * 1.2 }
					}
				]
			) )
		};
		
		sdGun.classes[ sdGun.CLASS_FISTS = 15 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'sword' ),
			//sound: 'gun_medikit',
			title: 'Fists',
			image_no_matter: sdWorld.CreateImageFromFile( 'sword_disabled' ),
			slot: 0,
			reload_time: 8,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			projectile_velocity: 16 * 1.2,
			spawnable: false,
			projectile_properties: { time_left: 1, _damage: 15, color: 'transparent', _soft:true, _knock_scale:0.4, _custom_target_reaction:( bullet, target_entity )=>
				{
					//debugger;
					//if ( sdCom.com_creature_attack_unignored_classes.indexOf( target_entity.GetClass() ) !== -1 )
					if ( target_entity.GetClass() !== 'sdCharacter' )
					if ( target_entity.is_static || target_entity.GetBleedEffect() === sdEffect.TYPE_WALL_HIT )
					if ( target_entity.GetClass() !== 'sdBlock' || target_entity.material !== sdBlock.MATERIAL_GROUND )
					//if ( target_entity.material !== ''
					{
						if ( !bullet._owner._is_being_removed )
						bullet._owner.DamageWithEffect( 5 );
					}
				},
				_custom_target_reaction_protected:( bullet, target_entity )=>
				{
					if ( !bullet._owner._is_being_removed )
					bullet._owner.DamageWithEffect( 5 );
				}
			}
		};
		
		sdGun.classes[ sdGun.CLASS_SABER = 16 ] = { // Original weapon idea & pull request by Booraz149 ( https://github.com/Booraz149 ), image editing & sound effects by Eric Gurt
			image: sdWorld.CreateImageFromFile( 'sword2b' ),
			sound: 'saber_attack',
			sound_volume: 1.5,
			title: 'Saber',
			image_no_matter: sdWorld.CreateImageFromFile( 'sword2b_disabled' ),
			slot: 0,
			reload_time: 10,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: true,
			matter_cost: 90, // Was 200, but I don't feel like this weapon is overpowered enough to have high cost like stimpack does /EG
			min_build_tool_level: 2, // Was available from start before, however MK2 shovel needs this aswell
			projectile_velocity: 20 * 1.5,
			projectile_properties: { time_left: 1, _damage: 60, color: 'transparent', _knock_scale:0.025 * 8, 
				_custom_target_reaction:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5 });
				},
				_custom_target_reaction_protected:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5 });
				}
			},
			projectile_velocity_dynamic: ( gun )=> { return 20 * 1.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 1, color: 'transparent', _knock_scale:0.025 * 8, 
				_custom_target_reaction:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5 });
				},
				_custom_target_reaction_protected:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5 });
				}
				};
				//obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 60; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( 
						AddRecolorsFromColorAndCost( AddRecolorsFromColorAndCost( [], '#ffffff', 30 ), '#0000ff', 30 ) )
		};
		
		sdGun.classes[ sdGun.CLASS_RAIL_PISTOL = 17 ] = { // Original weapon idea, image & pull request by Booraz149 ( https://github.com/Booraz149 )
			image: sdWorld.CreateImageFromFile( 'rail_pistol' ),
			sound: 'cube_attack',
			sound_pitch: 0.9,
			title: 'Cube-pistol',
			slot: 1,
			reload_time: 6,
			muzzle_x: 4,
			ammo_capacity: -1,
			count: 1,
			fire_type: 2,
			projectile_properties: { _rail: true, _damage: 25, color: '#62c8f2'/*, _knock_scale:0.01 * 8*/ },
			min_build_tool_level: 23,
			min_workbench_level: 7,
			matter_cost: 145,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#62c8f2', _knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 25; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades:
			AddGunDefaultUpgrades( AppendBasicCubeGunRecolorUpgrades( 
				[
					{ 
						title: 'Upgrade to v2',
						cost: 300,
						action: ( gun, initiator=null )=>{ gun.class = sdGun.CLASS_RAIL_PISTOL2;
										gun.extra[ ID_DAMAGE_VALUE ] = 15 * 1.2 }
					}
				]
			) )
		};
		
		sdGun.classes[ sdGun.CLASS_RAYGUN = 18 ] = { // Original sprite and weapon balancing by The_Commander 
			image: sdWorld.CreateImageFromFile( 'raygun_c01y' ),
			image0: [ sdWorld.CreateImageFromFile( 'raygun_c01y0' ), sdWorld.CreateImageFromFile( 'raygun_c01y0b' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'raygun_c01y1' ), sdWorld.CreateImageFromFile( 'raygun_c01y1b' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'raygun_c01y2' ), sdWorld.CreateImageFromFile( 'raygun_c01y2b' ) ],
			has_images: true,
			sound: 'gun_raygun',
			title: 'Raygun C01y',
			slot: 3,
			reload_time: 60, // Might be inaccurate - not checked
			muzzle_x: 9,
			ammo_capacity: -1,
			count: 3,
			projectile_velocity: 14 * 2,
			spread: 0.11, // 0.15,
			projectile_properties: { _damage: 40, color: '#DDDDDD', penetrating: true }, // I nerfed it's damage from 45 to 40 but that's up to balancing decisions - Booraz149
			min_workbench_level: 3,
			min_build_tool_level: 5,
			matter_cost: 150,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color: '#DDDDDD', penetrating: true, _knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 40; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddRecolorsFromColorAndCost( AddShotgunAmmoTypes([]), '#ff0000', 15, 'Pointer' ), '#007bcc', 15, 'Energy' ) )
			//upgrades: AddGunDefaultUpgrades( AddShotgunAmmoTypes( [] ) )
		};

		sdGun.classes[ sdGun.CLASS_FALKOK_PSI_CUTTER = 19 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'f_psicutter' ),
			sound: 'gun_psicutter',
			sound_volume: 1.5,
			title: 'Falkonian PSI-cutter',
			slot: 4,
			reload_time: 60,
			muzzle_x: 11,
			ammo_capacity: -1,
			spread: 0.01,
			count: 1,
			projectile_velocity: 10 * 2,  // Slower bullet velocity than sniper but ricochet projectiles
			projectile_properties: { _damage: 82, color:'#00ffff', model: 'f_psicutter_proj'/*, _knock_scale:0.01 * 8*/, penetrating: false, _bouncy: true },
			min_workbench_level: 3,
			matter_cost: 180,
			min_build_tool_level: 5,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color:'#00ffff', model: 'f_psicutter_proj', penetrating: false, _bouncy: true ,_knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 82; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#2cffe6', 20 ) )
			//upgrades: AddGunDefaultUpgrades()
		};
		
		sdGun.classes[ sdGun.CLASS_RAIL_SHOTGUN = 20 ] = { // Image by LazyRain
			image: sdWorld.CreateImageFromFile( 'rail_shotgun' ),
			sound: 'cube_attack',
			sound_pitch: 0.4,
			sound_volume: 2,
			title: 'Cube-shotgun',
			slot: 3,
			reload_time: 20,
			muzzle_x: 6,
			ammo_capacity: -1,
			spread: 0.15,
			count: 5,
			projectile_properties: { _rail: true, _damage: 20, color: '#62c8f2'/*, _knock_scale:0.01 * 8*/ },
			min_build_tool_level: 27,
			min_workbench_level: 7,
			matter_cost: 170,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#62c8f2', _knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 20; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AppendBasicCubeGunRecolorUpgrades( [
					{ 
						title: 'Upgrade to v2',
						cost: 300,
						action: ( gun, initiator=null )=>{ gun.class = sdGun.CLASS_RAIL_SHOTGUN2;
										gun.extra[ ID_DAMAGE_VALUE ] = 15 * 1.2 }
					}
				] ) )
		};		
		
		sdGun.classes[ sdGun.CLASS_RAIL_CANNON = 21 ] = { // sprite by Booraz149
			image: sdWorld.CreateImageFromFile( 'rail_cannon' ),
			sound: 'gun_railgun',
			sound_pitch: 0.5,
			title: 'Velox Rail Cannon',
			slot: 4,
			reload_time: 20,
			muzzle_x: 7,
			ammo_capacity: -1,
			count: 1,
			projectile_properties: { _rail: true, _rail_circled: true, _damage: 62, color: '#FF0000'/*, _knock_scale:0.01 * 8*/ },
			matter_cost: 270,
			min_build_tool_level: 18,
			min_workbench_level: 6,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, _rail_circled: true, _damage: 62, color: '#FF0000' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 62; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#bf1d00', 30 ) )
		};
		
		sdGun.classes[ sdGun.CLASS_CUBE_SHARD = 22 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'cube_shard2' ),
			title: 'Cube shard',
			no_tilt: true,
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			category: 'Other',
			projectile_properties: { _damage: 0 },
			matter_cost: 7500,
			min_build_tool_level: 80,
			min_workbench_level: 24,
			ignore_slot: true,
			apply_shading: false,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup
			{ 
				// 20 more levels, 20 * 45 more matter, 4 * 45 matter per shard
				
				//if ( character._upgrade_counters[ 'upgrade_energy' ] )
				//if ( character._upgrade_counters[ 'upgrade_energy' ] < 60 )
				if ( character._matter_capacity_boosters < character._matter_capacity_boosters_max ) // 20 * 45 )
				{
					character._matter_capacity_boosters = Math.min( character._matter_capacity_boosters + 4 * 45, character._matter_capacity_boosters_max );
					character.onScoreChange();
					
					//character._upgrade_counters[ 'upgrade_energy' ] = Math.min( 60, character._upgrade_counters[ 'upgrade_energy' ] + 4 );
					//character.matter_max = Math.round( 50 + character._upgrade_counters[ 'upgrade_energy' ] * 45 );
					
					
					if ( Math.random() > 0.5 )
					character.Say( "I can use this Cube shard to store matter inside it" );
					else
					character.Say( "Cube shard! These store matter pretty well" );
					gun.remove(); 
				}

				return false; 
			},
			upgrades: AppendBasicCubeGunRecolorUpgrades( [] )
		};

		sdGun.classes[ sdGun.CLASS_PISTOL_MK2 = 23 ] = { // sprite by Booraz149
			image: sdWorld.CreateImageFromFile( 'pistol_mk2' ),
			sound: 'gun_pistol',
			sound_pitch: 0.7,
			title: 'Pistol MK2',
			slot: 1,
			reload_time: 4.5,
			muzzle_x: 7,
			ammo_capacity: 8,
			spread: 0.01,
			count: 1,
			matter_cost: 90,
			min_build_tool_level: 1,
			fire_type: 2,
			projectile_properties: { _damage: 35, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5 }; // Default value for _knock_scale
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 35; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#808080', 5 ) )
			//upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_LMG = 24 ] = { // sprite by LazyRain
			image: sdWorld.CreateImageFromFile( 'lmg' ),
			sound: 'gun_pistol',
			sound_pitch: 0.85,
			sound_volume: 1.2,
			title: 'Light Machine Gun',
			slot: 2,
			reload_time: 3.2,
			muzzle_x: 10,
			ammo_capacity: 50,
			spread: 0.02,
			count: 1,
			matter_cost: 90,
			min_build_tool_level: 4,
			projectile_properties: { _damage: 29, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5 }; // Default value for _knock_scale
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 29; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#d50000', 15 ) )
			//upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_BUILDTOOL_UPG = 25 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'buildtool_upgrade2' ),
			image0: sdWorld.CreateImageFromFile( 'buildtool_upgrade' ),
			image1: sdWorld.CreateImageFromFile( 'buildtool_upgrade3' ),
			title: 'Build tool upgrade',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			spawnable: false,
			ignore_slot: true,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup
			{ 
				if ( !character._ai )
				{
					if ( gun.extra === -123 )
					{
						character.Say( "Score" );
						//character._score += 1000000;
						character.GiveScore( sdEntity.SCORE_REWARD_ADMIN_CRATE, gun );
						gun.remove(); 

						if ( character._socket )
						sdSound.PlaySound({ name:'reload', x:character.x, y:character.y, volume:0.25, pitch:0.5 }, [ character._socket ] );
					}
					else
					if ( gun.extra === 0 )
					{
						if ( Math.random() > 0.5 )
						character.Say( "This will be useful" );
						else
						character.Say( "This is definitely gonna help me");
					
						character.GiveScore( sdEntity.SCORE_REWARD_TEDIOUS_TASK, gun );
						
						gun.remove(); 

						if ( character._socket )
						sdSound.PlaySound({ name:'reload', x:character.x, y:character.y, volume:0.25, pitch:0.5 }, [ character._socket ] );
					}
					else
					if ( gun.extra === 1 )
					{
						if ( Math.random() > 0.5 )
						character.Say( "This will be useful" );
						else
						character.Say( "This is definitely gonna help me");
					
						character.GiveScore( sdEntity.SCORE_REWARD_TEDIOUS_TASK, gun );
						
						gun.remove(); 

						if ( character._socket )
						sdSound.PlaySound({ name:'reload', x:character.x, y:character.y, volume:0.25, pitch:0.5 }, [ character._socket ] );
					}
					else
					if ( gun.extra === 2 )
					{
						if ( Math.random() > 0.5 )
						character.Say( "This will be useful" );
						else
						character.Say( "This is definitely gonna help me");
					
						character.GiveScore( sdEntity.SCORE_REWARD_TEDIOUS_TASK, gun );
						
						gun.remove(); 

						if ( character._socket )
						sdSound.PlaySound({ name:'reload', x:character.x, y:character.y, volume:0.25, pitch:0.5 }, [ character._socket ] );
					}
					
					/*if ( character._acquired_bt_mech === false && gun.extra === 0 ) // Has the player found this upgrade before?
					{
						character.build_tool_level++;
						character._acquired_bt_mech = true;
						if ( Math.random() > 0.5 )
						character.Say( "I can use this to expand my building arsenal" );
						else
						character.Say( "This is definitely gonna help me build new stuff");
						gun.remove(); 

						if ( character._socket )
						sdSound.PlaySound({ name:'reload', x:character.x, y:character.y, volume:0.25, pitch:0.5 }, [ character._socket ] );
					}

					if ( character._acquired_bt_rift === false && gun.extra === 1 ) // Has the player found this upgrade before?
					{
						character.build_tool_level++;
						character._acquired_bt_rift = true;
						if ( Math.random() > 0.5 )
						character.Say( "I can use this to expand my building arsenal" );
						else
						character.Say( "This is definitely gonna help me build new stuff");
						gun.remove(); 

						if ( character._socket )
						sdSound.PlaySound({ name:'reload', x:character.x, y:character.y, volume:0.25, pitch:0.5 }, [ character._socket ] );
					}

					if ( character._acquired_bt_projector === false && gun.extra === 2 ) // Has the player found this upgrade before?
					{
						character.build_tool_level++;
						character._acquired_bt_projector = true;
						if ( Math.random() > 0.5 )
						character.Say( "I can use this to expand my building arsenal" );
						else
						character.Say( "This is definitely gonna help me build new stuff");
						gun.remove(); 

						if ( character._socket )
						sdSound.PlaySound({ name:'reload', x:character.x, y:character.y, volume:0.25, pitch:0.5 }, [ character._socket ] );
					}*/
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL1_LIGHT_ARMOR = 26 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_light' ),
			title: 'SD-01 Light Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 150,
			min_workbench_level: 1,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as armor
			{ 
				if ( character.armor_max < 130 )
				{
					if ( character.ApplyArmor({ armor: 130, _armor_absorb_perc: 0.3, armor_speed_reduction: 0 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 130 )
				{
					character.armor += 130;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 130 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL1_MEDIUM_ARMOR = 27 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_medium' ),
			title: 'SD-01 Duty Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 250,
			min_workbench_level: 1,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as matter
			{ 
				if ( character.armor_max < 190 )
				{
					if ( character.ApplyArmor({ armor: 190, _armor_absorb_perc: 0.4, armor_speed_reduction: 5 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 190 )
				{
					character.armor += 190;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 190 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL1_HEAVY_ARMOR = 28 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_heavy' ),
			title: 'SD-01 Combat Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 350,
			min_workbench_level: 1,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as matter
			{ 
				if ( character.armor_max < 250 )
				{
					if ( character.ApplyArmor({ armor: 250, _armor_absorb_perc: 0.5, armor_speed_reduction: 10 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 250 )
				{
					character.armor += 250;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 250 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_SHOTGUN_MK2 = 29 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shotgun_mk2' ),
			sound: 'gun_shotgun',
			title: 'Shotgun MK2',
			slot: 3,
			reload_time: 6,
			muzzle_x: 9,
			ammo_capacity: 15,
			count: 3,
			spread: 0.1,
			matter_cost: 90,
			burst: 3, // Burst fire count
			burst_reload: 30, // Burst fire reload, needed when giving burst fire
			min_build_tool_level: 6,
			projectile_properties: { _damage: 25 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 25; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades:AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddShotgunAmmoTypes([]), '#ff0000', 5 ) )
			//upgrades: AddGunDefaultUpgrades( AddShotgunAmmoTypes( [] ) )
		};

		sdGun.classes[ sdGun.CLASS_LASER_DRILL = 30 ] = { // Sprite made by Silk1 / AdibAdrian
			image: sdWorld.CreateImageFromFile( 'laser_drill' ),
			sound: 'saber_attack',
			sound_pitch: 0.6,
			sound_volume: 1,
			title: 'Laser Drill',
			slot: 0,
			reload_time: 5,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: false,
			matter_cost: 300,
			projectile_velocity: 1 * 1.5,
			min_workbench_level: 2,
			projectile_properties: { _rail: true, _damage: 32, color: '#ffb300', _knock_scale:0.1, _dirt_mult: 2 }, // Dirt mult was 2 but buffed to 5 since damage upgrade is gone for now
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#ffb300', _dirt_mult: 2 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 32; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#ff6f00', 20 ) )
			//upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_SMG = 31 ] = { // Sprite made by LazyRain
			image: sdWorld.CreateImageFromFile( 'smg' ),
			sound: 'gun_pistol',
			title: 'SMG',
			slot: 1,
			reload_time: 3,
			muzzle_x: 5,
			ammo_capacity: 24,
			spread: 0.1,
			count: 1,
			burst: 3, // Burst fire count
			burst_reload: 10, // Burst fire reload, needed when giving burst fire
			min_build_tool_level: 7,
			matter_cost: 45,
			projectile_properties: { _damage: 18, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 18; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_SMG_MK2 = 32 ] = { // Sprite made by LazyRain
			image: sdWorld.CreateImageFromFile( 'smg_mk2' ),
			sound: 'gun_pistol',
			title: 'SMG MK2',
			slot: 1,
			reload_time: 3,
			muzzle_x: 6,
			ammo_capacity: 30,
			spread: 0.1,
			count: 1,
			min_build_tool_level: 12,
			matter_cost: 90,
			projectile_properties: { _damage: 20, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 20; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_ROCKET_MK2 = 33 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'rocket_mk2' ),
			sound: 'gun_rocket',
			title: 'Rocket launcher MK2',
			slot: 5,
			reload_time: 30,
			muzzle_x: 7,
			ammo_capacity: -1,
			spread: 0.05,
			projectile_velocity: 14,
			count: 1,
			min_build_tool_level: 18,
			matter_cost: 90,
			projectile_properties: { time_left: 60, explosion_radius: 19, model: 'rocket_proj', _damage: 19 * 3, color:sdEffect.default_explosion_color, ac:0.4, _homing: true, _homing_mult: 0.02, _vehicle_mult:sdGun.default_vehicle_mult_bonus, _dirt_mult: 2 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 60, explosion_radius: 19, model: 'rocket_proj', color:sdEffect.default_explosion_color, ac:0.4, _homing: true, _homing_mult: 0.02, _vehicle_mult:sdGun.default_vehicle_mult_bonus, _dirt_mult: 2 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 19*3; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddRecolorsFromColorAndCost( [], '#808000', 15, 'Pointer' ), '#ff0000', 15, 'Circles' ) )
			//upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_HEALING_RAY = 34 ] = { // Sprite made by LazyRain
			image: sdWorld.CreateImageFromFile( 'cube_healing_ray' ),
			sound: 'cube_attack',
			title: 'Cube-Medgun',
			slot: 6,
			reload_time: 15,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			projectile_velocity: 1 * 3.5,
			min_build_tool_level: 57,
			matter_cost: 3000,
			min_workbench_level: 25,
			projectile_properties: { _rail: true, _damage: -15, color: '#ff00ff' },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#ff00ff' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = -15; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( gun._held_by )
				if ( gun._held_by.IsPlayerClass() )
				if ( gun._held_by.hea < gun._held_by.hmax )
				{
					gun._held_by.DamageWithEffect( gun.extra[ ID_DAMAGE_VALUE ] * gun.extra[ ID_DAMAGE_MULT ], null ); // Heal self if HP isn't max. However this healing is unaffected by damage mult and power pack
				}
				return true;
			},
			upgrades:
			AddGunDefaultUpgrades( AppendBasicCubeGunRecolorUpgrades( 
				[
					{ 
						title: 'Upgrade to v2',
						cost: 300,
						action: ( gun, initiator=null )=>{ gun.class = sdGun.CLASS_HEALING_RAY2;
										gun.extra[ ID_DAMAGE_VALUE ] = -15 * 1.2 }
					}
				]
			) )
		};

		sdGun.classes[ sdGun.CLASS_SHOVEL = 35 ] = { // Sprite made by Silk
			image: sdWorld.CreateImageFromFile( 'shovel' ),
			//sound: 'gun_medikit',
			title: 'Shovel',
			sound: 'sword_attack2',
			image_no_matter: sdWorld.CreateImageFromFile( 'shovel' ),
			slot: 0,
			reload_time: 9,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: false,
			projectile_velocity: 16 * 1.5,
			projectile_properties: { time_left: 1, _damage: 19, color: 'transparent', _knock_scale:0.025 * 8, _dirt_mult: 2 }, // 3X ( 1 + 2 ) damage against dirt blocks
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 1, color: 'transparent', _knock_scale:0.025 * 8, _dirt_mult: 2 };
				obj._knock_scale = 0.025 * 8;
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 19; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#ff0000', 5 ) )
			//upgrades: AddGunDefaultUpgrades()
		};


		sdGun.classes[ sdGun.CLASS_SHOVEL_MK2 = 36 ] = { // Sprite made by LazyRain
			image: sdWorld.CreateImageFromFile( 'shovel_mk2' ),
			//sound: 'gun_medikit',
			title: 'Shovel MK2',
			sound: 'sword_attack2',
			sound_pitch: 1.5,
			image_no_matter: sdWorld.CreateImageFromFile( 'shovel_mk2' ),
			slot: 0,
			reload_time: 11,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: false,
			min_build_tool_level: 4,
			matter_cost: 90,
			projectile_velocity: 20 * 1.5,
			projectile_properties: { time_left: 1, _damage: 30, color: 'transparent', _dirt_mult: 2 , _knock_scale:0.025 * 8, 
				_custom_target_reaction:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5, pitch: 1.5 });
				},
				_custom_target_reaction_protected:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5, pitch: 1.5 });
				}
			},
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 1, color: 'transparent', _dirt_mult: 2 , _knock_scale:0.025 * 8, 
					_custom_target_reaction:( bullet, target_entity )=>
					{
						sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5, pitch: 1.5 });
					},
					_custom_target_reaction_protected:( bullet, target_entity )=>
					{
						sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5, pitch: 1.5 });
					}
				};
				obj._knock_scale = 0.025 * 8;
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 30; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#0000ff', 5 ) )
			//upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_DECONSTRUCTOR_HAMMER = 37 ] = { // Sprite by LazyRain
			image: sdWorld.CreateImageFromFile( 'deconstructor_hammer' ),
			//sound: 'gun_medikit',
			title: 'Deconstructor Hammer',
			sound: 'sword_attack2',
			image_no_matter: sdWorld.CreateImageFromFile( 'deconstructor_hammer' ),
			slot: 0,
			reload_time: 8,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: true,
			projectile_velocity: 16 * 1.5,
			matter_cost: 920,
			min_workbench_level: 4,
			min_build_tool_level: 2,
			projectile_properties: { time_left: 1, _damage: 35, color: 'transparent', _knock_scale:0.025 * 8, _reinforced_level: 1 }
		};

		sdGun.classes[ sdGun.CLASS_ADMIN_REMOVER = 38 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shark' ),
			sound: 'gun_defibrillator',
			title: 'Admin tool for removing',
			sound_pitch: 2,
			slot: 4,
			reload_time: 5,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: Infinity,
			projectile_velocity: 16,
			spawnable: false,
			projectile_properties: { _rail: true, time_left: 30, _damage: 1, color: '#ffffff', _reinforced_level:Infinity, _armor_penetration_level:Infinity, _admin_picker:true, _custom_target_reaction:( bullet, target_entity )=>
				{
					if ( bullet._owner )
					{
						if ( bullet._owner._god )
						{
							if ( target_entity.GetClass() === 'sdDeepSleep' )
							{
								// Never remove these
							}
							else
							{
								target_entity.DamageWithEffect( Infinity, bullet._owner, false, false );
								target_entity.remove();
							}
						}
						else
						if ( bullet._owner.IsPlayerClass() )
						{
							// Remove if used by non-admin
							if ( bullet._owner._inventory[ bullet._owner.gun_slot ] )
							if ( sdGun.classes[ bullet._owner._inventory[ bullet._owner.gun_slot ].class ].projectile_properties._admin_picker )
							bullet._owner._inventory[ bullet._owner.gun_slot ].remove();
						}
					}
				}
			},
			onMade: ( gun )=>
			{
				let remover_sd_filter = sdWorld.CreateSDFilter();
				sdWorld.ReplaceColorInSDFilter_v2( remover_sd_filter, '#abcbf4', '#ff9292' );
				
				gun.sd_filter = remover_sd_filter;
			}
		};

		sdGun.classes[ sdGun.CLASS_LOST_CONVERTER = 39 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'cube_bng' ),
			image_charging: sdWorld.CreateImageFromFile( 'cube_bng_charging' ),
			//sound: 'supercharge_combined2',
			title: 'Cube overcharge cannon',
			//sound_pitch: 0.5,
			slot: 5,
			reload_time: 5,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			projectile_velocity: 16,
			category: 'Other',
			matter_cost: 22650,
			min_workbench_level: 32,
			min_build_tool_level: 90,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				if ( shoot_from_scenario )
				return 0;
			
				if ( gun._held_by._auto_shoot_in > 0 )
				return 0;
				
				return 900;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( !shoot_from_scenario )
				{
					if ( gun._held_by )
					if ( gun._held_by._auto_shoot_in <= 0 )
					{
						//gun._held_by._auto_shoot_in = 15;
						//return; // hack
						
						gun._held_by._auto_shoot_in = 2200 / 1000 * 30;

						//sdSound.PlaySound({ name: 'supercharge_combined2', x:gun.x, y:gun.y, volume: 1.5 });
						sdSound.PlaySound({ name: 'supercharge_combined2_part1', x:gun.x, y:gun.y, volume: 1.5 });
					}
					return false;
				}
				else
				{
					sdSound.PlaySound({ name: 'supercharge_combined2_part2', x:gun.x, y:gun.y, volume: 1.5 });
					
					if ( gun._held_by.matter >= 900 )
					if ( gun._held_by._key_states.GetKey( 'Mouse1' ) )
					{
						gun._held_by._auto_shoot_in = 15;
						gun._held_by.matter -= 900;
					}
				}
				return true;
			},
			projectile_properties: { 
				//explosion_radius: 10, 
				model: 'ball_charged', 
				_damage: 0, /*color:'#ffff66',*/ 
				time_left: 30, 
				_hittable_by_bullets: false,
				_custom_detonation_logic:( bullet )=>
				{
					if ( bullet._owner )
					{
						sdWorld.SendEffect({ 
							x:bullet.x, 
							y:bullet.y, 
							radius:30,
							damage_scale: 0, // Just a decoration effect
							type:sdEffect.TYPE_EXPLOSION, 
							owner:this,
							color:'#ffff66' 
						});

						let nears = sdWorld.GetAnythingNear( bullet.x, bullet.y, 32 );

						for ( let i = 0; i < nears.length; i++ )
						{
							// Prevent yellow cubes from commiting not living
							if ( nears[ i ].is( sdCube ) && bullet._owner === nears[ i ] )
							{
							}
							else
							sdLost.ApplyAffection( nears[ i ], 300, bullet );
						}
					}
				}
			},
			upgrades: AppendBasicCubeGunRecolorUpgrades( [] )
		};
		
		const cable_reaction_method = ( bullet, target_entity )=>
		{
			if ( sdCable.attacheable_entities.indexOf( target_entity.GetClass() ) !== -1 )
			{
				if ( sdCable.one_cable_entities.indexOf( target_entity.GetClass() ) !== -1 && sdCable.GetConnectedEntities( target_entity, sdCable.TYPE_ANY ).length > 0 )
				{
					//bullet._owner.Say( ( target_entity.title || target_entity.GetClass() ) + ' has only one socket' );
					bullet._owner.Say( 'There is only one socket' );
				}
				else
				{
					if ( bullet._owner._current_built_entity && !bullet._owner._current_built_entity._is_being_removed )
					{
						if ( sdCable.one_cable_entities.indexOf( bullet._owner._current_built_entity.p.GetClass() ) !== -1 && sdCable.one_cable_entities.indexOf( target_entity.GetClass() ) !== -1 )
						{
							bullet._owner.Say( 'It seems pointless to connect devices when both have just one socket' );
						}
						else
						if ( sdCable.GetConnectedEntities( target_entity ).indexOf( bullet._owner._current_built_entity.p ) !== -1 )
						{
							bullet._owner.Say( ( bullet._owner._current_built_entity.p.title || bullet._owner._current_built_entity.p.GetClass() ) + ' and ' + 
									( target_entity.title || target_entity.GetClass() ) + ' are already connected' );
						}
						else
						if ( target_entity === bullet._owner._current_built_entity.p )
						{
							//bullet._owner.Say( 'Connecting cable end to same ' + ( target_entity.title || target_entity.GetClass() ) + ' does not make sense' );
							bullet._owner.Say( 'Connecting cable to same thing does not make sense' );
						}
						else
						{
							//bullet._owner._current_built_entity.SetChild( target_entity );
							bullet._owner._current_built_entity.c = target_entity;
							if ( target_entity.is( sdNode ) )
							{
								bullet._owner._current_built_entity.d[ 2 ] = 0;
								bullet._owner._current_built_entity.d[ 3 ] = 0;
							}
							else
							{
								bullet._owner._current_built_entity.d[ 2 ] = bullet.x - target_entity.x;
								bullet._owner._current_built_entity.d[ 3 ] = bullet.y - target_entity.y;
							}

							//bullet._owner.Say( 'End connected to ' + ( target_entity.title || target_entity.GetClass() ) );

							bullet._owner._current_built_entity._update_version++;

							bullet._owner._current_built_entity = null;
						}
					}
					else
					{
						let ent = new sdCable({ 
							x: bullet.x, 
							y: bullet.y, 
							parent: target_entity,
							child: bullet._owner,
							offsets: target_entity.is( sdNode ) ? [ 0,0, 0,0 ] : [ bullet.x - target_entity.x, bullet.y - target_entity.y, 0,0 ],
							type: sdCable.TYPE_MATTER
						});

						bullet._owner._current_built_entity = ent;
						//bullet._owner.Say( 'Start connected to ' + ( target_entity.title || target_entity.GetClass() ) );

						sdEntity.entities.push( ent );
					}
				}
				
				// Allow connection to sdJunk barrels/containers and insta-repair them as they will likely start losing health
				if ( target_entity.is( sdJunk ) )
				if ( target_entity.hea > target_entity.hmax - 5 )
				target_entity.hea = target_entity.hmax;
			}
			else
			{
				bullet._owner.Say( 'Cable can not be attached there' );
				//bullet._owner.Say( 'Cable can not be attached to ' + ( target_entity.title || target_entity.GetClass() ) );
			}
		};
		sdGun.classes[ sdGun.CLASS_CABLE_TOOL = 40 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'cable_tool' ),
			sound: 'gun_defibrillator',
			title: 'Cable management tool',
			sound_pitch: 0.25,
			slot: 7,
			reload_time: 15,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: 300,
			projectile_velocity: 16,
			projectile_properties: { time_left: 2, _damage: 1, color: 'transparent', 
				_custom_target_reaction_protected: cable_reaction_method,
				_custom_target_reaction: cable_reaction_method
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				setTimeout( ()=>
				{
					if ( sdWorld.is_server )
					if ( gun._held_by )
					if ( ( gun._held_by._discovered[ 'first-cable' ] || 0 ) < 3 )
					{
						let line_id = ( gun._held_by._discovered[ 'first-cable' ] || 0 );

						let lines = [
							'This is a cable management tool',
							'Cable management tool can be used on some of base equipment',
							'Cables can be cut with a right click'
						];

						//if ( line_id < 3 )
						if ( sdCable.GetConnectedEntities( gun._held_by ).length === 0 )
						{
							gun._held_by.Say( lines[ line_id ] );

							line_id++;
							gun._held_by._discovered[ 'first-cable' ] = line_id;
						}

					}

				}, 50 );
			}
		};
		
		
		sdGun.classes[ sdGun.CLASS_POWER_PACK = 41 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'powerpack' ),
			sound: 'gun_defibrillator',
			title: 'Power pack',
			sound_pitch: 0.5,
			slot: 7,
			reload_time: 30 * 3,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			category: 'Other',
			min_build_tool_level: 56,
			min_workbench_level: 18,
			matter_cost: 400, // More DPS relative to stimpack
			projectile_velocity: 16,
			GetAmmoCost: ()=>
			{
				return 0; //100 / 2 * 2.5;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( gun._held_by )
				if ( gun._held_by.IsPlayerClass() )
				{
					gun._held_by.AnnounceTooManyEffectsIfNeeded();
					gun._held_by.power_ef = 30 * 30;
					gun._held_by.DamageWithEffect( 40 );
					
					if ( gun._held_by._inventory[ sdGun.classes[ sdGun.CLASS_POWER_PACK ].slot ] )
					gun._held_by._inventory[ sdGun.classes[ sdGun.CLASS_POWER_PACK ].slot ].remove();
				}
				return true;
			},
			projectile_properties: {}
		};
		
		sdGun.classes[ sdGun.CLASS_TIME_PACK = 42 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'timepack' ),
			sound: 'gun_defibrillator',
			title: 'Time pack',
			sound_pitch: 0.5,
			slot: 7,
			reload_time: 30 * 3,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			min_build_tool_level: 7,
			matter_cost: 500, // More DPS relative to stimpack
			projectile_velocity: 16,
			GetAmmoCost: ()=>
			{
				return 750;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( gun._held_by )
				if ( gun._held_by.IsPlayerClass() )
				{
					gun._held_by.AnnounceTooManyEffectsIfNeeded();
					gun._held_by.time_ef = 30 * 30;
					//gun._held_by.DamageWithEffect( 40 );
					
					//if ( gun._held_by._inventory[ sdGun.classes[ sdGun.CLASS_TIME_PACK ].slot ] )
					//gun._held_by._inventory[ sdGun.classes[ sdGun.CLASS_TIME_PACK ].slot ].remove();
				}
				return true;
			},
			projectile_properties: {}
		};
		
		sdGun.classes[ sdGun.CLASS_LVL2_LIGHT_ARMOR = 43 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_light_lvl2' ),
			title: 'SD-02 Light Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 275,
			min_workbench_level: 2,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as matter
			{ 
				if ( character.armor_max < 190 )
				{
					if ( character.ApplyArmor({ armor: 190, _armor_absorb_perc: 0.35, armor_speed_reduction: 0 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 190 )
				{
					character.armor += 190;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 190 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL2_MEDIUM_ARMOR = 44 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_medium_lvl2' ),
			title: 'SD-02 Duty Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 375,
			min_workbench_level: 2,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as matter
			{ 
				if ( character.armor_max < 280 )
				{
					if ( character.ApplyArmor({ armor: 280, _armor_absorb_perc: 0.45, armor_speed_reduction: 5 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 280 )
				{
					character.armor += 280;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 280 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL2_HEAVY_ARMOR = 45 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_heavy_lvl2' ),
			title: 'SD-02 Combat Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 475,
			min_workbench_level: 2,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as matter
			{ 
				if ( character.armor_max < 370 )
				{
					if ( character.ApplyArmor({ armor: 370, _armor_absorb_perc: 0.55, armor_speed_reduction: 10 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 370 )
				{
					character.armor += 370;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 370 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_F_MARKSMAN = 46 ] =  // sprite made by Ghost581
		{
			image: sdWorld.CreateImageFromFile( 'f_marksman' ),
			sound: 'gun_f_rifle',
			sound_pitch: 2.4,
			title: 'Falkonian Marksman Rifle',
			slot: 2,
			reload_time: 18,
			muzzle_x: 10,
			ammo_capacity: 18,
			count: 1,
			min_build_tool_level: 4,
			matter_cost: 70,
			projectile_velocity: sdGun.default_projectile_velocity * 1.6,
			projectile_properties: { _damage: 64, color: '#92D0EC', _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color: '#92D0EC', _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 64; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#0093bc', 15 ) )
			//upgrades: AddGunDefaultUpgrades()
		};
		
		sdGun.classes[ sdGun.CLASS_MMG_THE_RIPPER_T2 = 47 ] = // sprite by Ghost581
		{
			image: sdWorld.CreateImageFromFile( 'mmg_the_ripper_t2' ),
			sound: 'gun_the_ripper2',
			//sound_pitch: 0.7,
			sound_pitch: 1.6,
			//sound_volume: 1.75,
			title: 'KVT MMG P04 "The Ripper"',
			slot: 2,
			reload_time: 4,
			muzzle_x: 9,
			ammo_capacity: 48,
			spread: 0.03,
			count: 1,
			matter_cost: 140,
			min_build_tool_level: 8,
			min_workbench_level: 3,
			projectile_properties: { _damage: 42, color: '#FFEB00', _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color: '#FFEB00', _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 42; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_MMG_THE_RIPPER_T3 = 48 ] = // sprite by Ghost581
		{
			image: sdWorld.CreateImageFromFile( 'mmg_the_ripper_t3' ),
			sound: 'gun_the_ripper2',
			//sound_pitch: 1.6,
			sound_pitch: 0.7,
			//sound_volume: 1.65,
			title: 'KVT MMG "The Ripper" MK2',
			slot: 2,
			reload_time: 4.2,
			muzzle_x: 9,
			ammo_capacity: 56,
			spread: 0.02,
			count: 1,
			matter_cost: 190,
			min_build_tool_level: 9,
			min_workbench_level: 3,
			projectile_properties: { _damage: 48, color: '#FFEB00', _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color: '#FFEB00', _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 48; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_PHASERCANNON_P03 = 49 ] = // sprite by Ghost581
		{
			image: sdWorld.CreateImageFromFile( 'phasercannon_p03' ),
			image0: [ sdWorld.CreateImageFromFile( 'phasercannon_p03_reload1' ), sdWorld.CreateImageFromFile( 'phasercannon_p03_reload2' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'phasercannon_p03_reload1' ), sdWorld.CreateImageFromFile( 'phasercannon_p03_reload2' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'phasercannon_p03_reload1' ), sdWorld.CreateImageFromFile( 'phasercannon_p03_reload2' ) ],
			has_images: true,
			sound: 'gun_railgun_malicestorm_terrorphaser4',
			title: 'KVT Railcannon P03 "Stormbringer"',
			sound_pitch: 1.6, // re-added cause weapon sounds better with the sound pitch. - Ghost581
			sound_volume: 1.5,
            slot: 8,
            reload_time: 60,
            muzzle_x: null,
            ammo_capacity: -1,
            count: 1,
            matter_cost: 270,
            projectile_properties: { _rail: true, _damage: 98, color: '#62c8f2', explosion_radius: 20 },
            min_build_tool_level: 18,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = {  _rail: true, color: '#62c8f2', explosion_radius: 20 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 98; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_ADMIN_TELEPORTER = 50 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shark' ),
			sound: 'gun_defibrillator',
			title: 'Admin tool for teleporting',
			sound_pitch: 2,
			slot: 8,
			reload_time: 10,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: Infinity,
			projectile_velocity: 16,
			spawnable: false,
			allow_aim_assist: false,
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( sdWorld.is_server )
				if ( gun._held_by )
				if ( gun._held_by.IsPlayerClass() )
				if ( gun._held_by._god )
				{
					gun._held_by.x = gun._held_by.look_x;
					gun._held_by.y = gun._held_by.look_y;
					gun._held_by.sx = 0;
					gun._held_by.sy = 0;
					gun._held_by.ApplyServerSidePositionAndVelocity( true, 0, 0 );
				}
				return true;
			},
			projectile_properties: { _rail: true, time_left: 0, _damage: 1, color: '#ffffff', _admin_picker:true }
		};

		sdGun.classes[ sdGun.CLASS_POWER_STIMPACK = 51 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'power_stimpack' ),
			sound: 'gun_defibrillator',
			title: 'Power-Stimpack',
			sound_pitch: 0.5,
			slot: 7,
			reload_time: 30 * 10,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			matter_cost: 4800,
			category: 'Other',
			min_workbench_level: 25,
			min_build_tool_level: 76,
			projectile_velocity: 16,
			GetAmmoCost: ()=>
			{
				return 0 ; //( 100 / 2 * 2.5 + 100 ) * 2;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( gun._held_by )
				if ( gun._held_by.IsPlayerClass() )
				{
					gun._held_by.AnnounceTooManyEffectsIfNeeded();
					gun._held_by.stim_ef = 30 * 30;
					gun._held_by.power_ef = 30 * 30;
					gun._held_by.DamageWithEffect( 40, null, false, false ); // Don't damage armor
					
					if ( gun._held_by._inventory[ sdGun.classes[ sdGun.CLASS_POWER_STIMPACK ].slot ] )
					gun._held_by._inventory[ sdGun.classes[ sdGun.CLASS_POWER_STIMPACK ].slot ].remove();
				}
				return true;
			},
			projectile_properties: {}
		};

		sdGun.classes[ sdGun.CLASS_LVL1_ARMOR_REGEN = 52 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_repair_module_lvl1' ),
			title: 'SD-11 Armor Repair Module',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 125,
			min_workbench_level: 3,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup
			{ 
				if ( character.armor > 0 )
				{
					character._armor_repair_amount = 250;
					gun.remove(); 
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL2_ARMOR_REGEN = 53 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_repair_module_lvl2' ),
			title: 'SD-12 Armor Repair Module',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 250,
			min_workbench_level: 4,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup
			{ 
				if ( character.armor > 0 )
				{
					character._armor_repair_amount = 500;
					gun.remove(); 
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL3_ARMOR_REGEN = 54 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_repair_module_lvl3' ),
			title: 'SD-13 Armor Repair Module',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 375,
			min_workbench_level: 7,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup
			{ 
				if ( character.armor > 0 )
				{
					character._armor_repair_amount = 750;
					gun.remove(); 
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL3_LIGHT_ARMOR = 55 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_light_lvl3' ),
			title: 'SD-03 Light Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 400,
			min_workbench_level: 6,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as matter
			{ 
				if ( character.armor_max < 300 )
				{
					if ( character.ApplyArmor({ armor: 300, _armor_absorb_perc: 0.4, armor_speed_reduction: 0 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 300 )
				{
					character.armor += 300;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 300 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false;
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL3_MEDIUM_ARMOR = 56 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_medium_lvl3' ),
			title: 'SD-03 Duty Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 500,
			min_workbench_level: 6,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as matter
			{ 
				if ( character.armor_max < 400 )
				{
					if ( character.ApplyArmor({ armor: 400, _armor_absorb_perc: 0.5, armor_speed_reduction: 5 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 400 )
				{
					character.armor += 400;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 400 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL3_HEAVY_ARMOR = 57 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_heavy_lvl3' ),
			title: 'SD-03 Combat Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 600,
			min_workbench_level: 6,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as matter
			{ 
				if ( character.armor_max < 500 )
				{
					if ( character.ApplyArmor({ armor: 500, _armor_absorb_perc: 0.6, armor_speed_reduction: 10 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 500 )
				{
					character.armor += 500;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 500 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};
		
		sdGun.classes[ sdGun.CLASS_EMERGENCY_INSTRUCTOR = 58 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'emergency_instructor' ),
			sound: 'gun_defibrillator',
			title: 'Council Spawner',
			sound_pitch: 0.5,
			slot: 7,
			reload_time: 30 * 3,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			matter_cost: 200, // More DPS relative to stimpack
			category: 'Other',
			projectile_velocity: 16,
			min_build_tool_level: 30,
			min_workbench_level: 18,
			GetAmmoCost: ()=>
			{
				return 300;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				let owner = gun._held_by;
				
				setTimeout(()=> // Out of loop spawn
				{
					if ( sdWorld.is_server )
					if ( owner )
					//if ( owner.is( sdCharacter ) )
					{
						let instructor_settings = {"hero_name":"Council Acolyte","color_bright":"#e1e100","color_dark":"#ffffff","color_bright3":"#ffff00","color_dark3":"#e1e1e1","color_visor":"#ffff00","color_suit":"#ffffff","color_suit2":"#e1e1e1","color_dark2":"#ffe100","color_shoes":"#e1e1e1","color_skin":"#ffffff","color_extra1":"#ffff00","helmet1":false,"helmet23":true,"body11":true,"legs8":true,"voice1":false,"voice2":false,"voice3":true,"voice4":false,"voice5":false,"voice6":false,"voice7":false,"voice8":true};

						let ent = new sdCharacter({ x: owner.x + 16 * owner._side, y: owner.y,
							_ai_enabled: sdCharacter.AI_MODEL_TEAMMATE, 
							_ai_gun_slot: 4,
							_ai_level: 10,
							_ai_team: owner.cc_id + 4141,
							sd_filter: sdWorld.ConvertPlayerDescriptionToSDFilter_v2( instructor_settings ), 
							_voice: sdWorld.ConvertPlayerDescriptionToVoice( instructor_settings ), 
							title: instructor_settings.hero_name,
							cc_id: owner.cc_id,
							_owner: owner
						});
						ent.s = 110;
						ent.matter = 600;
						ent.matter_max = 600;
						ent.hmax = 1400;
						ent.hea = 1400;
						ent.gun_slot = 4;
						ent.helmet = sdWorld.ConvertPlayerDescriptionToHelmet( instructor_settings );
						ent.body = sdWorld.ConvertPlayerDescriptionToBody( instructor_settings );
						ent.legs = sdWorld.ConvertPlayerDescriptionToLegs( instructor_settings );
						ent._matter_regeneration = 20;
						//ent._damage_mult = 1 + 3 / 3 * 1;
						sdEntity.entities.push( ent );

						let ent2 = new sdGun({ x: ent.x, y: ent.y,
							class: sdGun.CLASS_COUNCIL_BURST_RAIL
						});
						sdEntity.entities.push( ent2 );

						sdSound.PlaySound({ name:'teleport', x:ent.x, y:ent.y, volume:0.5 });
						
						let side_set = false;
						const logic = ()=>
						{
							if ( ent._ai )
							{
								if ( !side_set )
								{
									ent._ai.direction = owner._side;
									side_set = false;
								}
								if ( ent.x > owner.x + 200 )
								ent._ai.direction = -1;
							
								if ( ent.x < owner.x - 200 )
								ent._ai.direction = 1;
							}
						};
						
						const MasterDamaged = ( victim, dmg, enemy )=>
						{
							if ( enemy && enemy.IsTargetable( ent ) )
							if ( dmg > 0 )
							if ( ent._ai )
							{
								if ( !ent._ai.target || Math.random() > 0.5 )
								ent._ai.target = enemy;
							}
						};
						
						owner.addEventListener( 'DAMAGE', MasterDamaged );
						
						setInterval( logic, 1000 );
						
						setTimeout(()=>
						{
							if ( ent.hea > 0 )
							if ( !ent._is_being_removed )
							{
								ent.Say( [ 
									'Was nice seeing you', 
									'I can\'t stay any longer', 
									'Thanks for the invite, ' + owner.title, 
									'Glad I didn\'t die here lol',
									'Until next time',
									'You can call be later',
									'My time is almost out',
									( ent._inventory[ 4 ] === ent2 ) ? 'You can take my gun' : 'I\'ll miss my gun',
									'Time for me to go'
								][ ~~( Math.random() * 9 ) ], false, false, false );
							}
						}, 60000 - 4000 );
						setTimeout(()=>
						{
							clearInterval( logic );
							
							owner.removeEventListener( 'DAMAGE', MasterDamaged );
							
							if ( !ent._is_being_removed )
							sdSound.PlaySound({ name:'teleport', x:ent.x, y:ent.y, volume:0.5 });

							ent.DropWeapons();
							ent.remove();
							//ent2.remove();

							ent._broken = false;
							//ent2._broken = false;

						}, 60000 );
					}
				}, 1 );
				
				return true;
			},
			projectile_properties: {}
		};
		
		sdGun.classes[ sdGun.CLASS_POPCORN = 59 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'popcorn' ),
			image_no_matter: sdWorld.CreateImageFromFile( 'popcorn_disabled' ),
			title: 'Popcorn',
			slot: 7,
			reload_time: 30,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			matter_cost: 10,
			projectile_velocity: 16,
			spawnable: true,
			category: 'Other',
			is_sword: true,
			GetAmmoCost: ()=>
			{
				return 0;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				sdSound.PlaySound({ name:'popcorn', x:gun.x, y:gun.y, volume:0.3 + Math.random() * 0.2, pitch:1 + Math.sin( gun._net_id ) * 0.2 });
				
				return true;
			},
			onThrownSwordReaction: ( gun, hit_entity, hit_entity_is_protected )=>
			{
				sdSound.PlaySound({ name:'block4', x:gun.x, y:gun.y, volume: 0.05, pitch:1 });
			
				for ( let i = 0; i < 6; i++ )
				{
					let a = Math.random() * 2 * Math.PI;
					let s = Math.random() * 4;

					let k = Math.random();

					let x = gun.x;
					let y = gun.y;

					sdWorld.SendEffect({ x: x, y: y, type:sdEffect.TYPE_POPCORN, sx: gun.sx*k + Math.sin(a)*s, sy: gun.sy*k + Math.cos(a)*s });
				}
			},
			projectile_properties: { _damage: 0 }
		};

		sdGun.classes[ sdGun.CLASS_ERTHAL_BURST_RIFLE = 60 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'erthal_burst_rifle' ),
			image0: [ sdWorld.CreateImageFromFile( 'erthal_burst_rifle0' ), sdWorld.CreateImageFromFile( 'erthal_burst_rifle0b' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'erthal_burst_rifle1' ), sdWorld.CreateImageFromFile( 'erthal_burst_rifle1b' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'erthal_burst_rifle2' ), sdWorld.CreateImageFromFile( 'erthal_burst_rifle2b' ) ],
			has_images: true,
			sound: 'spider_attackC',
			sound_pitch: 6,
			title: 'Erthal Burst Rifle',
			slot: 2,
			reload_time: 2,
			muzzle_x: 8,
			ammo_capacity: 36,
			count: 1,
			spread: 0.01,
			min_workbench_level: 5,
			min_build_tool_level: 14,
			matter_cost: 340,
			burst: 6, // Burst fire count
			burst_reload: 24, // Burst fire reload, needed when giving burst fire
			projectile_velocity: 18,
			projectile_properties: { _damage: 38,  color: '#00aaff', _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color: '#00aaff', _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 38; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#00aaff', 15, 'energy color' ) )
		};

		sdGun.classes[ sdGun.CLASS_ERTHAL_PLASMA_PISTOL = 61 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'erthal_plasma_pistol' ),
			sound: 'spider_attackC',
			sound_pitch: 3,
			title: 'Erthal Plasma Pistol',
			slot: 1,
			reload_time: 2.7,
			muzzle_x: 9,
			ammo_capacity: 8,
			count: 1,
			min_workbench_level: 6,
			min_build_tool_level: 16,
			matter_cost: 420,
			projectile_velocity: 16,
			fire_type: 2,
			projectile_properties: { explosion_radius: 7, model: 'ball', _damage: 12, color:'#00aaff', _dirt_mult: 1 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { explosion_radius: 7, model: 'ball', color:'#00aaff', _dirt_mult: 1 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 12; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#37a3ff', 15, 'energy color' ) )
		};
		
		sdGun.classes[ sdGun.CLASS_FMECH_MINIGUN = 62 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'fmech_lmg2' ),
			image_charging: sdWorld.CreateImageFromFile( 'fmech_lmg2' ),
			//sound: 'supercharge_combined2',
			title: 'Velox Flying Mech Minigun',
			//sound_pitch: 0.5,
			slot: 2,
			reload_time: 0,
			muzzle_x: 10,
			ammo_capacity: -1,
			count: 1,
			projectile_velocity: 16,
			min_build_tool_level: 87,
			matter_cost: 17200,
			min_workbench_level: 30,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				if ( shoot_from_scenario )
				return 0;
			
				if ( gun._held_by._auto_shoot_in > 0 )
				return 0;
				
				return 4;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( !shoot_from_scenario )
				{
					if ( gun._held_by )
					if ( gun._held_by._auto_shoot_in <= 0 )
					{
						//gun._held_by._auto_shoot_in = 15;
						//return; // hack
						gun._held_by._auto_shoot_in = 800 / 1000 * 30 / ( 1 + gun._combo / 60 );


						//sdSound.PlaySound({ name: 'supercharge_combined2', x:gun.x, y:gun.y, volume: 1.5 });
						sdSound.PlaySound({ name: 'enemy_mech_charge', x:gun.x, y:gun.y, volume: 1.5 });
					}
					return false;
				}
				else
				{
					//sdSound.PlaySound({ name: 'gun_pistol', x:gun.x, y:gun.y });
					sdSound.PlaySound({ name:'enemy_mech_attack4', x:gun.x, y:gun.y, volume:1.5, pitch: 1 });
					
					if ( gun._held_by.matter >= 4 )
					if ( gun._held_by._key_states.GetKey( 'Mouse1' ) )
					{
						gun._held_by._auto_shoot_in = ( gun._held_by.stim_ef > 0 ) ? ( gun.extra[ ID_FIRE_RATE ] / ( 1 + gun._combo / 90 ) ) : ( 2 * gun.extra[ ID_FIRE_RATE ] / ( 1 + gun._combo / 90 ) ); // Faster rate of fire when shooting more
						gun._held_by.matter -= 4;
						gun._combo_timer = 30;
						if ( gun._combo < 60 )
						gun._combo++; // Speed up rate of fire, the longer it shoots
					}
				}
				return true;
			},
			projectile_properties: { _damage: 30, _dirt_mult: -0.5 }, // Combined with fire rate
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 30; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#a5e0ff', 20 ) )
			//upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_SNIPER = 63 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'sniper' ),
			image0: [ sdWorld.CreateImageFromFile( 'sniper0' ), sdWorld.CreateImageFromFile( 'sniper0b' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'sniper1' ), sdWorld.CreateImageFromFile( 'sniper1b' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'sniper2' ), sdWorld.CreateImageFromFile( 'sniper2b' ) ],
			has_images: true,
			sound: 'gun_sniper',
			title: 'Sniper rifle',
			slot: 4,
			reload_time: 90,
			muzzle_x: 11,
			ammo_capacity: -1,
			count: 1,
			projectile_velocity: sdGun.default_projectile_velocity * 2,
			matter_cost: 120,
			min_build_tool_level: 9,
			projectile_properties: { _damage: 105, /*_knock_scale:0.01 * 8, */penetrating:true, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { penetrating:true, _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 105; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#85ffcc', 30 ) )
		};
    
		sdGun.classes[ sdGun.CLASS_DMR = 64 ] =  // sprite made by The Commander
		{
			image: sdWorld.CreateImageFromFile( 'dmr' ),
			sound: 'gun_dmr',
			sound_volume: 2.4,
			sound_pitch: 1.3,
			title: 'DMR',
			slot: 4,
			reload_time: 10.4,
			muzzle_x: 10,
			ammo_capacity: 8,
			count: 1,
			matter_cost: 160,
			min_build_tool_level: 8,
			fire_type: 2,
			projectile_velocity: sdGun.default_projectile_velocity * 1.7,
			projectile_properties: { _damage: 62, color: '#33ffff', penetrating: true, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color: '#33ffff', penetrating:true, _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 62; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#00ffff', 15 ) )
			//upgrades: AddGunDefaultUpgrades()
		};
    
		sdGun.classes[ sdGun.CLASS_VELOX_PISTOL = 65 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'burst_pistol3' ),
			image0: [ sdWorld.CreateImageFromFile( 'burst_pistol_reload3' ), sdWorld.CreateImageFromFile( 'burst_pistol3' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'burst_pistol_reload3' ), sdWorld.CreateImageFromFile( 'burst_pistol3' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'burst_pistol_reload3' ), sdWorld.CreateImageFromFile( 'burst_pistol3' ) ],
			sound: 'gun_f_rifle',
			sound_pitch: 1.5,
			title: 'Velox Burst Pistol',
			slot: 1,
			reload_time: 2,
			muzzle_x: 5,
			ammo_capacity: 12,
			count: 1,
			spread: 0.01,
			min_build_tool_level: 7,
			matter_cost: 110,
			burst: 3,
			burst_reload: 35,
			projectile_properties: { _damage: 33, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 33; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#01ffff', 15 ) )
			//upgrades: AddGunDefaultUpgrades()
		};
    
		sdGun.classes[ sdGun.CLASS_GAUSS_RIFLE = 66 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'gauss_rifle' ),
			image_charging: sdWorld.CreateImageFromFile( 'gauss_rifle_charging' ),
			image0: [ sdWorld.CreateImageFromFile( 'gauss_rifle0' ), sdWorld.CreateImageFromFile( 'gauss_rifle1' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'gauss_rifle2' ), sdWorld.CreateImageFromFile( 'gauss_rifle3' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'gauss_rifle4' ), sdWorld.CreateImageFromFile( 'gauss_rifle5' ) ],
			has_images: true,
			title: 'Sarronian Gauss Cannon',
			slot: 8,
			reload_time: 30 * 3, // 225,
			muzzle_x: 9,
			ammo_capacity: -1,
			count: 1,
			matter_cost: 1000,
			projectile_velocity: sdGun.default_projectile_velocity * 2,
			min_workbench_level: 6,
			min_build_tool_level: 5,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				if ( shoot_from_scenario )
				return 0;
			
				if ( gun._held_by._auto_shoot_in > 0 )
				return 0;
				
				return 50;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( !shoot_from_scenario )
				{
					if ( gun._held_by )
					if ( gun._held_by._auto_shoot_in <= 0 )
					{
						
						gun._held_by._auto_shoot_in = 1500 / 1000 * 30;

						sdSound.PlaySound({ name: 'supercharge_combined2_part1', x:gun.x, y:gun.y, volume: 1.5, pitch: 0.5 });
					}
					return false;
				}
				else
				{
					sdSound.PlaySound({ name: 'gun_railgun_malicestorm_terrorphaser4', x:gun.x, y:gun.y, volume: 1.5, pitch: 2 });
					
				}
			},
			projectile_properties: { explosion_radius: 24, model: 'gauss_rifle_proj', _damage: 128, color:sdEffect.default_explosion_color },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { explosion_radius: 24, model: 'gauss_rifle_proj', color:sdEffect.default_explosion_color };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 128; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#00ff00', 15, 'main energy color' ) )
		};
		
		sdGun.classes[ sdGun.CLASS_VELOX_COMBAT_RIFLE = 67 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'combat_rifle' ),
			sound: 'gun_the_ripper2',
			sound_pitch: 2,
			title: 'Velox Combat Rifle',
			slot: 2,
			reload_time: 1.5,
			muzzle_x: 10,
			ammo_capacity: 30,
			burst: 3,
			burst_reload: 16,
			count: 1,
			min_build_tool_level: 4,
			matter_cost: 165,
			projectile_velocity: sdGun.default_projectile_velocity * 1.3,
			projectile_properties: { _damage: 40, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 40; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#00ff00', 15 ) )
			//upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_MISSLE_LAUNCHER_P07 = 68 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'missile_launcher_p07' ),
			sound: 'gun_missile_launcher_p07',
			title: 'KVT Missile Launcher P07 "Hydra"',
			sound_volume: 2.4,
			slot: 5,
			reload_time: 6,
			muzzle_x: null,
			ammo_capacity: 6,
			spread: 0.06,
			projectile_velocity: 18,
			count: 1,
			burst: 2,
			burst_reload: 26, 
			min_build_tool_level: 9,
			min_workbench_level: 2,
			matter_cost: 240,
			projectile_properties: { time_left: 180, explosion_radius: 12, model: 'mini_missile_p241', _damage: 34, color:sdEffect.default_explosion_color, ac:0.01, _homing: true, _homing_mult: 0.3, _vehicle_mult:sdGun.default_vehicle_mult_bonus, _dirt_mult: 2 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 180, explosion_radius: 12, model: 'mini_missile_p241', color:sdEffect.default_explosion_color, ac:0.01, _homing: true, _homing_mult: 0.3, _vehicle_mult:sdGun.default_vehicle_mult_bonus, _dirt_mult: 2 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 38; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};
		
		sdGun.classes[ sdGun.CLASS_F_HEAVY_RIFLE = 69 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'f_heavy_rifle' ),
			image_charging: sdWorld.CreateImageFromFile( 'f_heavy_rifle' ),
			title: 'Falkonian Heavy Rifle',
			slot: 2,
			reload_time: 0,
			muzzle_x: 12,
			ammo_capacity: -1,
			count: 1,
			spread: 0.05,
			min_build_tool_level: 55,
			matter_cost: 6700,
			min_workbench_level: 20,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				if ( shoot_from_scenario )
				return 0;
			
				if ( gun._held_by._auto_shoot_in > 0 )
				return 0;
				
				return 3;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( !shoot_from_scenario )
				{
					if ( gun._held_by )
					if ( gun._held_by._auto_shoot_in <= 0 )
					{
						
						gun._held_by._auto_shoot_in = 1000 / 1000 * 30;

						sdSound.PlaySound({ name: 'supercharge_combined2_part1', x:gun.x, y:gun.y, volume: 1.5, pitch: 3 });
					}
					return false;
				}
				else
				{
					sdSound.PlaySound({ name: 'saber_hit2', x:gun.x, y:gun.y, volume: 2, pitch: 3 });
					
					if ( gun._held_by.matter >= 2 )
					if ( gun._held_by._key_states.GetKey( 'Mouse1' ) )
					{
						gun._held_by._auto_shoot_in = ( gun._held_by.stim_ef > 0 ) ? gun.extra[ ID_FIRE_RATE ] : 2 * gun.extra[ ID_FIRE_RATE ];
						gun._held_by.matter -= 2; // Was 3. It is not that strong to drain matter that fast
					}
				}
				return true;
			},
			projectile_properties: { _damage: 28, color:'#afdfff', _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color:'#afdfff', _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 28; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#00a6d0', 20 ) )
			//upgrades: AddGunDefaultUpgrades()
		};
		
		sdGun.classes[ sdGun.CLASS_ZAPPER = 70 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'zapper' ),
			image0: [ sdWorld.CreateImageFromFile( 'zapper0' ), sdWorld.CreateImageFromFile( 'zapper1' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'zapper2' ), sdWorld.CreateImageFromFile( 'zapper2' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'zapper0' ), sdWorld.CreateImageFromFile( 'zapper1' ) ],
			has_images: true,
			title: 'Zapper',
			sound: 'cube_attack',
			sound_volume: 0.5,
			sound_pitch: 1.5,
			image_no_matter: sdWorld.CreateImageFromFile( 'zapper_disabled' ),
			slot: 0,
			reload_time: 10,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: true,
			min_build_tool_level: 48,
			matter_cost: 5740,
			min_workbench_level: 19,
			projectile_velocity: 37,
			GetAmmoCost: ()=>
			{
				return 4;
			},
			projectile_properties: { model:'transparent_proj', time_left: 1, _damage: 90, color: '#ffffff', _knock_scale:0.025 * 8, 
				_custom_target_reaction:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'cube_attack', x:bullet.x, y:bullet.y, volume:0.5, pitch: 2 });
				},
				_custom_target_reaction_protected:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'cube_attack', x:bullet.x, y:bullet.y, volume:0.5, pitch: 2 });
				}
			},
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { model:'transparent_proj', time_left: 1, color: '#ffffff', _knock_scale:0.025 * 8, 
					_custom_target_reaction:( bullet, target_entity )=>
					{
						sdSound.PlaySound({ name:'cube_attack', x:bullet.x, y:bullet.y, volume:0.5, pitch: 2 });
					},
					_custom_target_reaction_protected:( bullet, target_entity )=>
					{
						sdSound.PlaySound({ name:'cube_attack', x:bullet.x, y:bullet.y, volume:0.5, pitch: 2 });
					}
				};
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 90; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddRecolorsFromColorAndCost( 
				AddRecolorsFromColorAndCost( 
					AddGunDefaultUpgrades(), 
					'#d3d3d3', 100, 'Inner', '' ), 
				'#ffffff', 100, 'Outer', '' )
		};

		sdGun.classes[ sdGun.CLASS_COUNCIL_PISTOL = 71 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'council_pistol2' ),
			sound: 'cube_attack',
			sound_pitch: 1.5,
			title: 'Council Pistol',
			slot: 1,
			reload_time: 10,
			muzzle_x: 7,
			ammo_capacity: -1,
			spread: 0.01,
			count: 1,
			min_build_tool_level: 87,
			matter_cost: 6400,
			min_workbench_level: 32,
			//fire_type: 2,
			projectile_velocity: sdGun.default_projectile_velocity * 1.5,
			projectile_properties: { _damage: 30, color:'ffff00' },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color:'ffff00' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 30; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_COUNCIL_BURST_RAIL = 72 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'council_gun' ),
			sound: 'cube_attack',
			sound_pitch: 1.5,
			title: 'Council Burst Rail',
			slot: 4,
			reload_time: 3,
			muzzle_x: 7,
			ammo_capacity: -1,// 10, // 3
			burst: 3,
			burst_reload: 45,
			count: 1,
			projectile_properties: { _rail: true, _damage: 28, color: '#ffff00'/*, _knock_scale:0.01 * 8*/ }, // 84 when all 3 bursts land
			min_build_tool_level: 87,
			matter_cost: 6600,
			min_workbench_level: 32,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#ffff00' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 28; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_METAL_SHARD = 73 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'metal_shard' ),
			sound: 'gun_defibrillator',
			title: 'Metal shard',
			sound_pitch: 1,
			slot: 7,
			reload_time: 30,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			category: 'Other',
			min_build_tool_level: 41,
			matter_cost: 520,
			min_workbench_level: 18,
			projectile_velocity: 16,
			/*GetAmmoCost: ()=>
			{
				return 100;
			},*/
			projectile_properties: { time_left: 2, _damage: 1, color: 'transparent', _custom_target_reaction:( bullet, target_entity )=>
				{
					if ( target_entity.GetClass() === 'sdBlock' || target_entity.GetClass() === 'sdDoor' )
					{
						if ( target_entity.GetClass() === 'sdBlock' )
						if ( target_entity.material === sdBlock.MATERIAL_WALL || target_entity.material === sdBlock.MATERIAL_REINFORCED_WALL_LVL1 || target_entity.material === sdBlock.MATERIAL_REINFORCED_WALL_LVL2 )
						{
							if ( target_entity._reinforced_level < target_entity._max_reinforced_level )
							{
							target_entity._reinforced_level += 0.5;
							target_entity.HandleReinforceUpdate();
							bullet.remove(); // Need this for some reason, otherwise it doubles the reinforced level for some reason ( +1 instead of +0.5 )
						
							if ( bullet._owner._inventory[ sdGun.classes[ sdGun.CLASS_METAL_SHARD ].slot ] )
							bullet._owner._inventory[ sdGun.classes[ sdGun.CLASS_METAL_SHARD ].slot ].remove();
							}
							else
							bullet._owner.Say( 'This wall cannot be reinforced further' );
						}
						if ( target_entity.GetClass() === 'sdDoor' )
						{
							if ( target_entity._reinforced_level < target_entity._max_reinforced_level )
							{
							target_entity._reinforced_level += 0.5;
							target_entity.HandleReinforceUpdate();
							bullet.remove(); // Need this for some reason, otherwise it doubles the reinforced level for some reason ( +1 instead of +0.5 )
						
							if ( bullet._owner._inventory[ sdGun.classes[ sdGun.CLASS_METAL_SHARD ].slot ] )
							bullet._owner._inventory[ sdGun.classes[ sdGun.CLASS_METAL_SHARD ].slot ].remove();
							}
							else
							bullet._owner.Say( 'This door cannot be reinforced further' );
						}
					}
					else
					bullet._owner.Say( 'I can use this to fortify walls and doors' );
				}
			}
		};

		sdGun.classes[ sdGun.CLASS_GRENADE_LAUNCHER_MK2 = 74 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'grenade_launcher_mk2' ), // Sprite by LazyRain
			sound: 'gun_grenade_launcher',
			title: 'Grenade launcher MK2',
			slot: 5,
			reload_time: 9,
			muzzle_x: 7,
			ammo_capacity: 6,
			spread: 0.05,
			count: 1,
			projectile_velocity: 9,
			fire_type: 2, // Semi auto
			matter_cost: 90,
			min_build_tool_level: 13,
			projectile_properties: { explosion_radius: 16, time_left: 30 * 3, model: 'grenade', _damage: 16 * 2, color:sdEffect.default_explosion_color, is_grenade: true, _dirt_mult: 2 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { explosion_radius: 16, time_left: 30 * 3, model: 'grenade', color:sdEffect.default_explosion_color, is_grenade: true, _dirt_mult: 2 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 16 * 2; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};
		
		sdGun.classes[ sdGun.CLASS_TRIPLE_RAIL2 = 75 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'triple_rail2' ),
			sound: 'cube_attack',
			sound_pitch: 0.8,
			title: 'Cube-gun v2',
			slot: 4,
			reload_time: 3,
			muzzle_x: 7,
			ammo_capacity: -1,// 10, // 3
			count: 1,
			projectile_properties: { _rail: true, _damage: 15 * 1.2, color: '#62c8f2'/*, _knock_scale:0.01 * 8*/ }, // 70
			spawnable: false,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#62c8f2'};
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 15 * 1.2; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AppendBasicCubeGunRecolorUpgrades( [] ) )
		};
		
		sdGun.classes[ sdGun.CLASS_RAIL_SHOTGUN2 = 76 ] = { // Image by LazyRain
			image: sdWorld.CreateImageFromFile( 'rail_shotgun2' ),
			sound: 'cube_attack',
			sound_pitch: 0.4 * 0.8,
			sound_volume: 2,
			title: 'Cube-shotgun v2',
			slot: 3,
			reload_time: 20,
			muzzle_x: 6,
			ammo_capacity: -1,
			spread: 0.15,
			count: 5,
			projectile_properties: { _rail: true, _damage: 20 * 1.2, color: '#62c8f2'/*, _knock_scale:0.01 * 8*/ },
			spawnable: false,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#62c8f2' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 20 * 1.2; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AppendBasicCubeGunRecolorUpgrades( [] ) )
		};

		sdGun.classes[ sdGun.CLASS_KIVORTEC_AVRS_P09 = 77 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'kivortec_avrs_p09' ),
			image0: [ sdWorld.CreateImageFromFile( 'kivortec_avrs_p09_reload1' ), sdWorld.CreateImageFromFile( 'kivortec_avrs_p09_reload2' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'kivortec_avrs_p09_reload1' ), sdWorld.CreateImageFromFile( 'kivortec_avrs_p09_reload2' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'kivortec_avrs_p09_reload1' ), sdWorld.CreateImageFromFile( 'kivortec_avrs_p09_reload2' ) ],
			has_images: true,
			sound: 'gun_railgun_malicestorm_terrorphaser4',
			sound_pitch: 0.7,
			title: 'KVT-AVRS P09',
			slot: 4,
			reload_time: 30 * 3,//140,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: 320,
			min_build_tool_level: 18,
			projectile_properties: { explosion_radius: 16, _rail: true, _damage: 125, _vehicle_mult: sdGun.default_vehicle_mult_bonus, color: '#91bfd7' }, // 3x more damage against vehicles
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { explosion_radius: 16, _rail: true, _vehicle_mult: sdGun.default_vehicle_mult_bonus, color: '#91bfd7' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 125; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#69ade1', 20 ) )
			//upgrades: AddGunDefaultUpgrades()
		};
		
		sdGun.classes[ sdGun.CLASS_ALIEN_ENERGY_RIFLE = 78 ] = 
		{
			image: sdWorld.CreateImageFromFile ( 'alien_energygun' ),
			sound: 'gun_spark',
			sound_pitch: 0.5,
			title: 'Sarronian Energy Rifle',
			slot: 8,
			reload_time: 45,
			muzzle_x: 7,
			ammo_capacity: -1,
			count: 1,
			min_build_tool_level: 12,
			matter_cost: 310,
			min_workbench_level: 2,
			projectile_properties: { model: 'ball_orange', color: '#ffc080', _damage: 32, explosion_radius: 12 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { model: 'ball_orange', color: '#ffc080', explosion_radius: 12 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 32; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddRecolorsFromColorAndCost( [], '#ff8000', 15, 'pointer' ), '#00ff00', 15, 'main energy color' ) )
		};


		sdGun.classes[ sdGun.CLASS_WYRMHIDE = 79 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'wyrmhide' ),
			title: 'Wyrmhide',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			matter_cost: 220,
			min_workbench_level: 1,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as armor
			{ 
				if ( character.armor_max < 190 )
				{
					if ( character.ApplyArmor({ armor: 190, _armor_absorb_perc: 0.5, armor_speed_reduction: 5 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 190 )
				{
					character.armor += 190;
					gun.remove();
				}

				return false; 
			} 
		};
		
		
		sdGun.classes[ sdGun.CLASS_SNOWBALL = 80 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'snowball' ),
			sound: 'sword_attack2',
			title: 'Snowball',
			slot: 7,
			reload_time: 15,
			muzzle_x: null,
			ammo_capacity: -1,
			spread: 0.05,
			count: 1,
			projectile_velocity: 8,
			spawnable: true,
			category: 'Other',
			matter_cost: 10,
			projectile_properties: { time_left: 30 * 3, model: 'snowball', _damage: 0, color:sdEffect.default_explosion_color, is_grenade: true,
				_custom_target_reaction: ( bullet, target_entity )=>
				{
					bullet.remove();
					
					if ( target_entity.IsPlayerClass() )
					{
						target_entity.DamageWithEffect( 1 );
						target_entity.DamageWithEffect( -1 );
					}
					
					for ( let i = 0; i < 6; i++ )
					{
						let a = Math.random() * 2 * Math.PI;
						let s = Math.random() * 4;

						let k = Math.random();

						let x = bullet.x;
						let y = bullet.y;

						sdWorld.SendEffect({ x: x, y: y, type:sdEffect.TYPE_POPCORN, sx: bullet.sx*k + Math.sin(a)*s, sy: bullet.sy*k + Math.cos(a)*s });
					}
				},
				_custom_target_reaction_protected: ( bullet, target_entity )=>
				{
					bullet.remove();
					
					if ( target_entity.IsPlayerClass() )
					{
						target_entity.DamageWithEffect( 1 );
						target_entity.DamageWithEffect( -1 );
					}
					
					for ( let i = 0; i < 6; i++ )
					{
						let a = Math.random() * 2 * Math.PI;
						let s = Math.random() * 4;

						let k = Math.random();

						let x = bullet.x;
						let y = bullet.y;

						sdWorld.SendEffect({ x: x, y: y, type:sdEffect.TYPE_POPCORN, sx: bullet.sx*k + Math.sin(a)*s, sy: bullet.sy*k + Math.cos(a)*s });
					}
				}
			}
		};
		
		
		sdGun.classes[ sdGun.CLASS_PORTAL = 81 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'portalgun' ),
			sound: 'gun_portal4',
			sound_volume: 4,
			title: 'ASHPD',
			slot: 7,
			reload_time: 15,
			muzzle_x: 7,
			ammo_capacity: -1,//16,
			count: 1,
			matter_cost: 500,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				return 30;
			},
			projectile_velocity: 16,
			projectile_properties: { model: 'ball', _damage: 0, color:'#00ffff',
				_custom_target_reaction_protected: ( bullet, target_entity )=>
				{
					if ( target_entity.is( sdBlock ) && target_entity.texture_id === sdBlock.TEXTURE_ID_PORTAL )
					{
						let portals_by_owner = [];
						
						for ( let i = 0; i < sdPortal.portals.length; i++ )
						{
							if ( sdPortal.portals[ i ]._owner === bullet._owner )
							portals_by_owner.push( sdPortal.portals[ i ] );
						}
						
						let options = [];
						
						for ( let x = 8; x < target_entity._hitbox_x2; x += 16 )
						{
							if ( bullet.y <= target_entity.y )
							options.push({
								x: x,
								y: 0,
								orientation: 0
							});
							if ( bullet.y >= target_entity.y + target_entity._hitbox_y2 )
							options.push({
								x: x,
								y: target_entity._hitbox_y2,
								orientation: 0
							});
						}
						
						for ( let y = 16; y <= target_entity._hitbox_y2 - 16; y += 16 )
						{
							if ( bullet.x <= target_entity.x )
							options.push({
								x: 0,
								y: y,
								orientation: 1
							});
							if ( bullet.x >= target_entity.x + target_entity._hitbox_x2 )
							options.push({
								x: target_entity._hitbox_x2,
								y: y,
								orientation: 1
							});
						}
						
						let best_di = Infinity;
						let best_i = -1;
						
						for ( let i = 0; i < options.length; i++ )
						{
							let di;
							
							//di = sdWorld.Dist2D( options[ i ].x, options[ i ].y, bullet.x - target_entity.x, bullet.y - target_entity.y );
							
							let lx = bullet.x - target_entity.x;
							let ly = bullet.y - target_entity.y;
							
							if ( options[ i ].orientation === 0 )
							{
								di = sdWorld.Dist2D( Math.max( options[ i ].x - 8, Math.min( lx, options[ i ].x + 8 ) ), options[ i ].y, lx, ly );
							}
							else
							di = sdWorld.Dist2D( options[ i ].x, Math.max( options[ i ].y - 16, Math.min( ly, options[ i ].y + 16 ) ), lx, ly );
							
							if ( di < best_di )
							{
								best_i = i;
								best_di = di;
							}
						}
						
						if ( best_i !== -1 )
						{
							let allow = true;

							for ( let p = 0; p < portals_by_owner.length; p++ )
							if ( portals_by_owner[ p ].attachment === target_entity )
							if ( portals_by_owner[ p ].attachment_x === options[ best_i ].x )
							if ( portals_by_owner[ p ].attachment_y === options[ best_i ].y )
							{
								allow = false;
								break;
							}

							if ( allow )
							{
								while ( portals_by_owner.length > 1 )
								portals_by_owner.shift().remove();

								let portal = new sdPortal({
									attachment: target_entity,
									owner: bullet._owner,
									attachment_x: options[ best_i ].x,
									attachment_y: options[ best_i ].y,
									orientation: options[ best_i ].orientation
								});
								sdEntity.entities.push( portal );

								if ( portals_by_owner.length > 0 )
								{
									portal._output = portals_by_owner[ 0 ];
									portals_by_owner[ 0 ]._output = portal;
								}
							}
						}
					}
				}
			}
		};
		
		sdGun.classes[ sdGun.CLASS_OVERLORD_BLASTER = 82 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'overlord_blaster' ),
			sound: 'overlord_cannon4',
			title: 'Overlord\'s blaster',
			slot: 8,
			reload_time: 5,
			//muzzle_x: 11,
			image_firing: sdWorld.CreateImageFromFile( 'overlord_blaster_fire' ),
			ammo_capacity: -1,
			count: 1,
			min_build_tool_level: 62,
			matter_cost: 7200,
			min_workbench_level: 24,
			projectile_velocity: 12,
			projectile_properties: {explosion_radius: 9, model: 'blaster_proj', _damage: 0, color:'#ff00aa',},
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { model: 'blaster_proj', color: '#ff00aa', explosion_radius: 9 };
				obj._knock_scale = 0.01 * 2 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 40; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},

			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#e459aa', 20 ) )
		};

		sdGun.classes[ sdGun.CLASS_TOPS_DMR = 83 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'tops_dmr' ),
			sound: 'gun_dmr',
			sound_volume: 2.5,
			sound_pitch: 0.8,
			title: 'Task Ops DMR',
			slot: 4,
			reload_time: 9,
			muzzle_x: 12,
			ammo_capacity: 20,
			count: 1,
			fire_type: 2,
			min_build_tool_level: 28,
			matter_cost: 550,
			min_workbench_level: 8,
			projectile_velocity: sdGun.default_projectile_velocity * 1.7,
			projectile_properties: { _damage: 72, color: '#33ffff', penetrating: true, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { penetrating: true, _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 72; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#ff0000', 15 ) )
		};
		sdGun.classes[ sdGun.CLASS_TOPS_SHOTGUN = 84 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'tops_shotgun' ),
			sound: 'gun_shotgun',
			sound_pitch: 1.2,
			sound_volume: 1.5,
			title: 'Task Ops Shotgun',
			slot: 3,
			reload_time: 8,
			muzzle_x: 10,
			ammo_capacity: 20,
			count: 3,
			spread: 0.13,
			min_build_tool_level: 27,
			matter_cost: 520,
			min_workbench_level: 7,
			projectile_properties: { _damage: 25 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ];
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 25; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddShotgunAmmoTypes([]), '#ff0000', 15 ) )
		};
		
		// ID ranges 85...88 (including) are reserved by Basilix
		
		let spear_targer_reaction = ( bullet, target_entity )=>
		{
			let dmg_scale = 1;
			
			if ( bullet._owner )
			if ( bullet._owner.power_ef > 0 )
			dmg_scale *= 2.5;
			
			if ( target_entity.is( sdLost ) )
			{
				target_entity.DamageWithEffect( 33 * dmg_scale, bullet._owner );
			}
			else
			{
				sdWorld.SendEffect({ 
					x: bullet.x, 
					y: bullet.y, 
					radius: 16,
					damage_scale: 0, // Just a decoration effect
					type: sdEffect.TYPE_EXPLOSION, 
					owner: this,
					color: '#aaaaaa'
				});

				sdLost.ApplyAffection( target_entity, 33 * dmg_scale, bullet, sdLost.FILTER_WHITE );
			}
		};
		sdGun.classes[ sdGun.CLASS_CUBE_SPEAR = 89 ] = 
        { 
			image: sdWorld.CreateImageFromFile( 'cube_spear2' ),
			image_charging: sdWorld.CreateImageFromFile( 'cube_spear2_charging' ),
			image_no_matter: sdWorld.CreateImageFromFile( 'cube_spear2' ),
			sound: 'saber_attack',
			sound_volume: 1.5,
			title: 'Cube Empty Speargun',
			slot: 0,
			reload_time: 5,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 5,
			spread: 0.4,
			is_sword: true,
			projectile_velocity: 20,
			category: 'Other',
			matter_cost: 21500,
			min_workbench_level: 32,
			min_build_tool_level: 90,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				if ( shoot_from_scenario )
				return 0;
			
				if ( gun._held_by._auto_shoot_in > 0 )
				return 0;
			
				/*let dmg_scale = 1;

				if ( gun._held_by )
				if ( gun._held_by.power_ef > 0 )
				dmg_scale *= 2.5;*/
				
				return 250;// * dmg_scale;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( !shoot_from_scenario )
				{
					if ( gun._held_by )
					if ( gun._held_by._auto_shoot_in <= 0 )
					{
						gun._held_by._auto_shoot_in = 2200 / 1000 * 30 / 2;


						//sdSound.PlaySound({ name: 'supercharge_combined2_part1', x:gun.x, y:gun.y, volume: 1.5, pitch: 2 });
						sdSound.PlaySound({ name: 'armor_pickup', x:gun.x, y:gun.y, volume: 1.5, pitch: 0.25 });
					}
					return false;
				}
				else
				{
					sdSound.PlaySound({ name: 'supercharge_combined2_part2', x:gun.x, y:gun.y, volume: 1.5, pitch: 2 });
					
					if ( gun._held_by.matter >= 250 )
					if ( gun._held_by._key_states.GetKey( 'Mouse1' ) )
					{
						//if ( gun._held_by.stim_ef > 0 )
						gun._held_by._auto_shoot_in = 7.5;
						//else
						//gun._held_by._auto_shoot_in = 15;


						/*let dmg_scale = 1;

						if ( gun._held_by )
						if ( gun._held_by.power_ef > 0 )
						dmg_scale *= 2.5;*/

						gun._held_by.matter -= 250;// * dmg_scale;
					}
				}
				return true;
			},
			projectile_properties: { 
                _rail: true,
				color:'#aaaaaa',
				_damage: 0, time_left: 30,
				_custom_target_reaction_protected:spear_targer_reaction,
				_custom_target_reaction:spear_targer_reaction
			},
			upgrades: AppendBasicCubeGunRecolorUpgrades( [] )
		};

		sdGun.classes[ sdGun.CLASS_COMBAT_INSTRUCTOR = 90 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'emergency_instructor' ),
			sound: 'gun_defibrillator',
			title: 'Council Captain',
			sound_pitch: 0.5,
			slot: 7,
			reload_time: 30 * 3,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_velocity: 16,
			category: 'Other',
			min_build_tool_level: 75,
			matter_cost: 8000,
			min_workbench_level: 24,
			GetAmmoCost: ()=>
			{
				return 400;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				let owner = gun._held_by;
				
				setTimeout(()=> // Out of loop spawn
				{
					if ( sdWorld.is_server )
					if ( owner )
					//if ( owner.is( sdCharacter ) )
					{
						let instructor_settings = {"hero_name":"Council Vanguard","color_bright":"#e1e100","color_dark":"#ffffff","color_bright3":"#ffff00","color_dark3":"#e1e1e1","color_visor":"#ffff00","color_suit":"#ffffff","color_suit2":"#e1e1e1","color_dark2":"#ffe100","color_shoes":"#e1e1e1","color_skin":"#ffffff","color_extra1":"#ffff00","helmet1":false,"body1":false,"legs1":false,"helmet96":true,"body68":true,"legs68":true,"voice1":false,"voice2":false,"voice3":true,"voice4":false,"voice5":false,"voice6":false,"voice7":false,"voice8":true};

						let ent = new sdCharacter({ x: owner.x + 16 * owner._side, y: owner.y,
							_ai_enabled: sdCharacter.AI_MODEL_TEAMMATE, 
							_ai_gun_slot: 3,
							_ai_level: 10,
							_ai_team: owner.cc_id + 4141,
							sd_filter: sdWorld.ConvertPlayerDescriptionToSDFilter_v2( instructor_settings ), 
							_voice: sdWorld.ConvertPlayerDescriptionToVoice( instructor_settings ), 
							title: instructor_settings.hero_name,
							cc_id: owner.cc_id,
							_owner: owner
						});
						ent.s = 110;
						ent.hmax = 1750;
						ent.hea = 1750;
						ent.matter = 600;
						ent.matter_max = 600;
						ent.helmet = sdWorld.ConvertPlayerDescriptionToHelmet( instructor_settings );
						ent.body = sdWorld.ConvertPlayerDescriptionToBody( instructor_settings );
						ent.legs = sdWorld.ConvertPlayerDescriptionToLegs( instructor_settings );
						ent.gun_slot = 3;
						ent._jetpack_allowed = true;
						ent.ApplyArmor({ armor: 1500, _armor_absorb_perc: 0.87, armor_speed_reduction: 10 }) // Level 2 heavy armor
						ent._matter_regeneration = 20;
						ent._matter_regeneration_multiplier = 10;
						//ent._damage_mult = 1 + 3 / 3 * 1;
						sdEntity.entities.push( ent );

						let ent2 = new sdGun({ x: ent.x, y: ent.y,
							class: sdGun.CLASS_COUNCIL_SHOTGUN
						}); // Even with LMG it seems weak compared to power-stimpack
						sdEntity.entities.push( ent2 );

						sdSound.PlaySound({ name:'teleport', x:ent.x, y:ent.y, volume:0.5 });
						
						let side_set = false;
						const logic = ()=>
						{
							if ( ent._ai )
							{
								if ( !side_set )
								{
									ent._ai.direction = owner._side;
									side_set = false;
								}
								if ( ent.x > owner.x + 100 )
								ent._ai.direction = -1;
							
								if ( ent.x < owner.x - 100 )
								ent._ai.direction = 1;
							} // Stay close to player
						};
						
						const MasterDamaged = ( victim, dmg, enemy )=>
						{
							if ( enemy && enemy.IsTargetable( ent ) )
							if ( dmg > 0 )
							if ( ent._ai )
							{
								if ( !ent._ai.target || Math.random() > 0.5 )
								ent._ai.target = enemy;
							}
						};
						
						owner.addEventListener( 'DAMAGE', MasterDamaged );
						
						setInterval( logic, 1000 );
						
						setTimeout(()=>
						{
							if ( ent.hea > 0 )
							if ( !ent._is_being_removed )
							{
								ent.Say( [ 
									'Was nice seeing you', 
									'I can\'t stay any longer', 
									'Thanks for the invite, ' + owner.title, 
									'Glad I didn\'t die here lol',
									'Until next time',
									'You can call be later',
									'My time is almost out',
									( ent._inventory[ 4 ] === ent2 ) ? 'You can take my council power' : 'I\'ll miss my council shotgun',
									'Time for me to go'
								][ ~~( Math.random() * 9 ) ], false, false, false );
							}
						}, 60000 - 4000 );
						setTimeout(()=>
						{
							clearInterval( logic );
							
							owner.removeEventListener( 'DAMAGE', MasterDamaged );
							
							if ( !ent._is_being_removed )
							sdSound.PlaySound({ name:'teleport', x:ent.x, y:ent.y, volume:0.5 });

							ent.DropWeapons();
							ent.remove();
							//ent2.remove();

							ent._broken = false;
							//ent2._broken = false;

						}, 60000 );
					}
				}, 1 );
				
				return true;
			},
			projectile_properties: {}
		};
		sdGun.classes[ sdGun.CLASS_SETR_PLASMA_SHOTGUN = 91 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'setr_plasma_shotgun' ),
			sound: 'gun_spark',
			sound_pitch: 1.5,
			sound_volume: 1.5,
			title: 'Setr Plasma Shotgun',
			slot: 3,
			reload_time: 23,
			muzzle_x: 7,
			ammo_capacity: 10,
			count: 4,
			spread: 0.13,
			min_build_tool_level: 14,
			matter_cost: 570,
			min_workbench_level: 6,
			projectile_velocity: 16,
			projectile_properties: { explosion_radius: 10, model: 'ball', _damage: 5, color:'#0000c8', _dirt_mult: 1 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { explosion_radius: 10, model: 'ball', color:'#0000c8', _dirt_mult: 1 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 5; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades:AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddShotgunAmmoTypes([]), '#0000c8', 20 ) )
			//upgrades: AddGunDefaultUpgrades( AddShotgunAmmoTypes( [] ) )
		};
		sdGun.classes[ sdGun.CLASS_SETR_ROCKET = 92 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'setr_homing_launcher' ),
			sound: 'gun_rocket',
			title: 'Setr Rocket Launcher',
			slot: 5,
			reload_time: 6,
			muzzle_x: 8,
			ammo_capacity: -1,
			burst: 3,
			burst_reload: 45,
			spread: 0.05,
			projectile_velocity: 14,
			count: 1,
			min_build_tool_level: 28,
			matter_cost: 5960,
			min_workbench_level: 22,
			projectile_properties: { time_left: 30, explosion_radius: 19, model: 'rocket_proj', _damage: 16 * 3, color:sdEffect.default_explosion_color, ac:0.4, _homing: true, _homing_mult: 0.02, _vehicle_mult:sdGun.default_vehicle_mult_bonus, _dirt_mult: 2 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 30, explosion_radius: 19, model: 'rocket_proj', color:sdEffect.default_explosion_color, ac:0.4, _homing: true, _homing_mult: 0.02, _vehicle_mult:sdGun.default_vehicle_mult_bonus, _dirt_mult: 2 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 16 * 3; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddRecolorsFromColorAndCost( [], '#ffff00', 15, 'pointer' ), '#0000c8', 15, 'Body' ) )
			//upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_CUBE_TELEPORTER = 93 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'cube_teleporter' ),
			sound: 'cube_teleport',
			title: 'Cube-Teleporter',
			sound_pitch: 0.5,
			slot: 7,
			reload_time: 30,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			projectile_velocity: 16,
			category: 'Other',
			min_build_tool_level: 80,
			matter_cost: 16500,
			min_workbench_level: 28,
			allow_aim_assist: false,
			projectile_properties: { _rail: true, time_left: 0, _damage: 1, color: '#ffffff'},
			GetAmmoCost: ()=>
			{
				return 0;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( sdWorld.is_server )
				if ( gun._held_by )
				if ( gun._held_by.IsPlayerClass() )
				if ( gun._held_by.matter >= 30 )
				if ( sdWorld.CheckLineOfSight( gun._held_by.x, gun._held_by.y, gun._held_by.look_x, gun._held_by.look_y, gun._held_by, null, sdCom.com_vision_blocking_classes ) )
				if ( gun._held_by.CanMoveWithoutOverlap( gun._held_by.look_x, gun._held_by.look_y, -8 ) )
				if ( sdWorld.inDist2D_Boolean( gun._held_by.x, gun._held_by.y, gun._held_by.look_x, gun._held_by.look_y, 600 ) )
				{
					gun._held_by.x = gun._held_by.look_x;
					gun._held_by.y = gun._held_by.look_y;
					gun._held_by.sx = 0;
					gun._held_by.sy = 0;
					gun._held_by.ApplyServerSidePositionAndVelocity( true, 0, 0 );
					gun._held_by.matter -= 30;
					return true;
				}
				return false;
			},
			upgrades: AddRecolorsFromColorAndCost( [], '#ffffff', 5 )
		};

		sdGun.classes[ sdGun.CLASS_RAYRIFLE = 94 ] =
		{
			image: sdWorld.CreateImageFromFile( 'rayrifle_tcorr' ),
			sound: 'gun_rayrifle',
			title: 'Ray Rifle TCoRR',
			slot: 2,
			reload_time: 2.8,
			muzzle_x: 7,
			ammo_capacity: 16,
			count: 1,
			spread: 0.01, // 0.03
			projectile_properties: { _damage: 34, color: '#afdfff', penetrating: true },
			min_build_tool_level: 16,
			matter_cost: 270,
			min_workbench_level: 3,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color: '#afdfff', penetrating: true };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 34; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddRecolorsFromColorAndCost( [], '#ff0000', 15, 'Pointer' ), '#16518a', 20, 'Energy' ) )
			//upgrades: AddGunDefaultUpgrades()
		};
		
		const liquid_carrier_base_color = '#518ad1';
		const liquid_carrier_empty = '#424242';
		// sdWater.reference_colors
		sdGun.classes[ sdGun.CLASS_LIQUID_CARRIER = 95 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'liquid_carrier' ),
			image_no_matter: sdWorld.CreateImageFromFile( 'liquid_carrier' ),
			sound: 'sword_attack2',
			title: 'Liquid carrier',
			slot: 7,
			reload_time: 15,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: 50,
			projectile_velocity: 16 * 1.5,
			spawnable: true,
			category: 'Other',
			is_sword: false,
			GetAmmoCost: ()=>
			{
				return 5;
			},
			onMade: ( gun )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				gun.sd_filter = sdWorld.CreateSDFilter();
				
				sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, liquid_carrier_base_color, liquid_carrier_empty );
			},
			projectile_properties: { time_left: 1, _damage: 1, color: 'transparent', 
				_knock_scale: 0,
				_custom_detonation_logic:( bullet )=>
				{
					let gun = bullet._gun;
					
					if ( bullet._gun._held_item_snapshot )
					{
						let water_ent = sdWater.GetWaterObjectAt( bullet.x, bullet.y );
						if ( !water_ent )
						{
							bullet._gun._held_item_snapshot.x = Math.floor( bullet.x / 16 ) * 16;
							bullet._gun._held_item_snapshot.y = Math.floor( bullet.y / 16 ) * 16;
							
							let safe_bound = 1;
							
							if ( !sdWorld.CheckWallExistsBox( 
								bullet._gun._held_item_snapshot.x + safe_bound, 
								bullet._gun._held_item_snapshot.y + safe_bound, 
								bullet._gun._held_item_snapshot.x + 16 - safe_bound, 
								bullet._gun._held_item_snapshot.y + 16 - safe_bound, bullet, bullet.GetIgnoredEntityClasses(), bullet.GetNonIgnoredEntityClasses(), null ) )
							{
								water_ent = new sdWater( bullet._gun._held_item_snapshot );
								sdEntity.entities.push( water_ent );
								sdWorld.UpdateHashPosition( water_ent, false );
								
								bullet._gun._held_item_snapshot = null;
								sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, liquid_carrier_base_color, liquid_carrier_empty );
								
								sdSound.PlaySound({ name:'water_entrance', x:gun.x, y:gun.y, volume: 0.1, pitch: 1 });
							}
						}
					}
					else
					{
						let water_ent = sdWater.GetWaterObjectAt( bullet.x, bullet.y );

						if ( water_ent )
						{
							bullet._gun._held_item_snapshot = water_ent.GetSnapshot( GetFrame(), true );
							
							delete bullet._gun._held_item_snapshot._net_id; // Erase this just so snapshot logic won't think that it is a some kind of object that should exist somewhere
							
							sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, liquid_carrier_base_color, sdWater.reference_colors[ water_ent.type ] || '#ffffff' );

							water_ent.AwakeSelfAndNear();
							
							water_ent.remove();
							
							sdSound.PlaySound({ name:'water_entrance', x:gun.x, y:gun.y, volume: 0.1, pitch: 1 });
						}
					}
				}
			}
		};

		sdGun.classes[ sdGun.CLASS_CUSTOM_RIFLE = 96 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'rifle_parts' ),
			
			image_offset_x: -2,
			image_offset_y: 0,
	
			sound: 'gun_rifle',
			
			//title: 'Rifle',
			title_dynamic: ( gun )=> { return gun.extra[ ID_TITLE ]; },
			
			//slot: 2,
			slot_dynamic: ( gun )=> { return gun.extra[ ID_SLOT ]; },
			
			reload_time: 3,
			muzzle_x: 7,
			matter_cost: 500,
			
			ammo_capacity: 30,
			ammo_capacity_dynamic: ( gun )=>
			{
				let capacity = sdGun.classes[ gun.class ].parts_magazine[ gun.extra[ ID_MAGAZINE ] ].capacity;
				
				if ( gun.extra[ ID_HAS_EXPLOSION ] )
				capacity /= 5;
				
				if ( gun.extra[ ID_HAS_SHOTGUN_EFFECT ] )
				capacity /= 2;
				
				if ( gun.extra[ ID_HAS_RAIL_EFFECT ] )
				capacity /= 2;
			
				return Math.ceil( capacity );
			},
			
			spread: 0,//0.02,
			//spread_dynamic: ( gun )=> { return 0.02 * gun.extra[ ID_RECOIL_SCALE ]; },
			
			//projectile_velocity: sdGun.default_projectile_velocity,
			projectile_velocity_dynamic: ( gun )=> { return Math.min( 64, sdGun.default_projectile_velocity * Math.pow( gun.extra[ ID_DAMAGE_MULT ], 0.25 ) ) },
			
			count: 1,
			projectile_properties: { _damage: 1 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _damage: 25, _dirt_mult: -0.5, _knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				
				if ( gun.extra[ ID_HAS_SHOTGUN_EFFECT ] )
				{
					obj._dirt_mult = 0;
					//obj._damage /= 5;
					obj._damage /= 2;
					obj._knock_scale /= 2;
				}
				if ( gun.extra[ ID_HAS_EXPLOSION ] )
				{
					obj._dirt_mult = 1;
					obj.explosion_radius = gun.extra[ ID_HAS_SHOTGUN_EFFECT ] ? 13 : 19;
					obj.model = 'ball';
				}
				if ( gun.extra[ ID_HAS_RAIL_EFFECT ] )
				{
					obj._dirt_mult = 0;
					obj._rail = true;
					obj._rail_circled = true;
				}
				
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ] * 0.4;
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			
			use_parts_rendering: true,
			
			parts_base: [
				// W is where stock would start, H is where magazine would start
				{ w:3, h:1, title:'Small' },
				{ w:5, h:2, title:'Bulky' },
				{ w:5, h:1, title:'Longer' },
				{ w:5, h:2, title:'Larger' },
				{ w:6, h:2, title:'Easily' }
			],
			parts_stock: [
				{ title:'Rifle' },
				{ title:'Longer' },
				{ title:'MP' },
				{ title:'Holey large' },
				{ title:'Marksman' }
			],
			parts_magazine: [
				{ title:'Small', capacity: 36, rate: 1 },
				{ title:'Box', capacity: 44, rate: 0.75 },
				{ title:'Assault', capacity: 52, rate: 0.75 },
				{ title:'Chain', capacity: 100, rate: 0.6 },
				{ title:'Boxed chain', capacity: 200, rate: 0.6 },
				{ title:'Heavy Box', capacity: 400, rate: 0.45 }
			],
			parts_barrel: [
				// W offsets muzzle, H offsets under barrel part
				{ w:2, h:0, title:'Tiny' },
				{ w:4, h:1, title:'Bulky' },
				{ w:5, h:1, title:'Sniperish' },
				{ w:5, h:1, title:'Shotgunish' },
				{ w:5, h:2, title:'Grenade launcherish' },
				{ w:5, h:2, title:'Energy' },
				{ w:5, h:2, title:'Energy 2' },
				{ w:5, h:2, title:'Energy 3' },
				{ w:5, h:2, title:'Lasers' },
				{ w:5, h:2, title:'Energy 4' },
				{ w:5, h:2, title:'Holey' }
			],
			parts_underbarrel: [
				{ title:'Dot' },
				{ title:'Some mount thing' },
				{ title:'Knife' },
				{ title:'Laser' },
				{ title:'Grenade launcher' },
				{ title:'Some mount thing 2' },
				{ title:'Forward dot' },
				{ title:'Plasma launcher' },
				{ title:'None' }
			],
			parts_muzzle: [
				// W is offset for muzzle flash, H is vertical offset
				{ w: 2, h: 0, title:'L' },
				{ w: 1, h: 0, title:'Dot' },
				{ w: 3, h: 0, title:'Bulky silencer' },
				{ w: 3, h: 1, title:'Small silencer' },
				{ w: 3, h: 0, title:'Larger L' },
				{ w: 3, h: 0, title:'Mountable' },
				{ w: 3, h: 0, title:'Bulky' },
				{ w: 2, h: 1, title:'Energy shooter' },
				{ w: 2, h: 1, title:'Energy shooter 2' },
				{ w: 3, h: 1, title:'Energy shooter 3' },
				{ w: 6, h: 0, title:'Energy shooter 3' }
			],
			parts_scope: [
				{ title:'Reflex' },
				{ title:'Merged scope' },
				{ title:'Tiny scope' },
				{ title:'Sniper scope' },
				{ title:'GRU Only' },
				{ title:'None' }
			],
			
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					
					let offset = 0;
					
					function rand()
					{
						return sdWorld.SeededRandomNumberGenerator.random( Math.floor( sdWorld.time / 500 ), offset++ );
					}

					gun.extra[ ID_BASE ] = ~~( rand() * sdGun.classes[ gun.class ].parts_base.length );
					gun.extra[ ID_STOCK ] = ~~( rand() * sdGun.classes[ gun.class ].parts_stock.length );
					gun.extra[ ID_MAGAZINE ] = ~~( rand() * sdGun.classes[ gun.class ].parts_magazine.length );
					gun.extra[ ID_BARREL ] = ~~( rand() * sdGun.classes[ gun.class ].parts_barrel.length );
					gun.extra[ ID_UNDERBARREL ] = ~~( rand() * sdGun.classes[ gun.class ].parts_underbarrel.length );
					gun.extra[ ID_MUZZLE ] = ~~( rand() * sdGun.classes[ gun.class ].parts_muzzle.length );
					gun.extra[ ID_SCOPE ] = ~~( rand() * sdGun.classes[ gun.class ].parts_scope.length );
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					gun.extra[ ID_HAS_EXPLOSION ] = 0;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_HAS_SHOTGUN_EFFECT ] = 0;
					gun.extra[ ID_HAS_RAIL_EFFECT ] = 0;
					gun.extra[ ID_SLOT ] = 2;
					
					if ( params.initiator && params.initiator.IsPlayerClass() && params.initiator._socket )
					{
						gun.extra[ ID_TITLE ] = params.initiator.title + '\'s rifle';
						gun.title_censored = ( typeof sdModeration !== 'undefined' && sdModeration.IsPhraseBad( params.initiator.title, params.initiator._socket ) ) ? 1 : 0;
					}
					else
					{
						gun.extra[ ID_TITLE ] = 'Rifle';
						gun.title_censored = 0;
					}
				
					gun.extra[ ID_PROJECTILE_COLOR ] = '#';
					let str = '0123456789abcdef';
					for ( let i = 0; i < 6; i++ )
					gun.extra[ ID_PROJECTILE_COLOR ] += str.charAt( ~~( Math.random() * str.length ) );

					UpdateCusomizableGunProperties( gun );
				}
			},
			
			upgrades: AddGunEditorUpgrades()
		};
		
		
		
		sdGun.classes[ sdGun.CLASS_SCORE_SHARD = 97 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'score' ),
			image_frames: 4,
			image_duration: 250,
			title: 'Score shard',
			hea: 400,
			no_tilt: true,
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			spawnable: false,
			ignore_slot: true,
			apply_shading: false,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup as matter
			{ 
				if ( !gun._is_being_removed )
				if ( character._socket ) // Prevent AI from picking these up
				{
					character.GiveScore( sdEntity.SCORE_REWARD_SCORE_SHARD * gun.extra, gun, false );

					if ( character._socket )
					sdSound.PlaySound({ name:'powerup_or_exp_pickup', x:character.x, y:character.y, volume:0.4, pitch:0.5 }, [ character._socket ] );
				
					gun.remove();
				}

				return false; 
			},
			onMade: ( gun )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				gun.ttl = 30 * 60 * 1; // 1 minute

				gun.extra = 1;
			},
			onThinkOwnerless: ( gun, GSPEED )=>
			{
				if ( gun.follow )
				if ( !gun.follow._is_being_removed )
				{
					const magnet_time = 30 * 60 * 1 - 2 * 30;
					if ( gun.ttl < magnet_time ) // Start following after 5 seconds
					{
						let dx = gun.follow.x + ( gun.follow._hitbox_x1 + gun.follow._hitbox_x2 ) / 2 - gun.x;
						let dy = gun.follow.y + ( gun.follow._hitbox_y1 + gun.follow._hitbox_y2 ) / 2 - gun.y;

						if ( sdWorld.inDist2D_Boolean( dx,dy,0,0, 64 ) )
						{
							dx += ( gun.follow.sx - gun.sx ) * 0.3;
							dy += ( gun.follow.sy - gun.sy ) * 0.3;
							
							let intens = Math.min( -( gun.ttl - magnet_time ) / ( 30 * 5 ), 1 );

							gun.sx += dx * 0.02 * GSPEED * intens;
							gun.sy += dy * 0.02 * GSPEED * intens;
						}
					}
				}
		
				return false; // False denies hibernation, true would allow
			}
		};

		sdGun.classes[ sdGun.CLASS_LVL4_ARMOR_REGEN = 98 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_repair_module_lvl4' ),
			title: 'Task Ops Armor Repair Module',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			min_build_tool_level: 25,
			matter_cost: 3300,
			min_workbench_level: 10,
			onPickupAttempt: ( character, gun )=> // Cancels pickup and removes itself if player can pickup
			{ 
				if ( character.armor > 0 )
				{
					character._armor_repair_amount = 1000;
					gun.remove(); 
				}

				return false; 
			} 
		};
		
		
		sdGun.classes[ sdGun.CLASS_ADMIN_DAMAGER = 99 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shark' ),
			sound: 'gun_defibrillator',
			title: 'Admin tool for damaging',
			sound_pitch: 2,
			slot: 2,
			reload_time: 2,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: Infinity,
			projectile_velocity: 16,
			spawnable: false,
			projectile_properties: { _rail: true, time_left: 30, _damage: 1, color: '#ffffff', _reinforced_level:Infinity, _armor_penetration_level:Infinity, _custom_target_reaction:( bullet, target_entity )=>
				{
					if ( bullet._owner )
					{
						if ( bullet._owner._god )
						{
							let dmg = Math.max( 50, Math.min( 300, target_entity.hea || target_entity._hea || 0 ) );
							target_entity.DamageWithEffect( dmg, bullet._owner, false, false );
						}
						else
						if ( bullet._owner.IsPlayerClass() )
						{
							// Remove if used by non-admin
							if ( bullet._owner._inventory[ bullet._owner.gun_slot ] )
							if ( sdGun.classes[ bullet._owner._inventory[ bullet._owner.gun_slot ].class ].projectile_properties._admin_picker )
							bullet._owner._inventory[ bullet._owner.gun_slot ].remove();
						}
					}
				}
			},
			onMade: ( gun )=>
			{
				let remover_sd_filter = sdWorld.CreateSDFilter();
				sdWorld.ReplaceColorInSDFilter_v2( remover_sd_filter, '#abcbf4', '#ffaa00' );
				
				gun.sd_filter = remover_sd_filter;
			}
		};
		
		const mop_base_color = '#ffffff';
		const mop_base_color_border = '#cbcbcb';
		// sdWater.reference_colors
		sdGun.classes[ sdGun.CLASS_MOP = 100 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'mop' ),
			image_no_matter: sdWorld.CreateImageFromFile( 'mop' ),
			sound: 'sword_attack2',
			title: 'Mop',
			slot: 7,
			reload_time: 10,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: 50,
			projectile_velocity: 16 * 1.5,
			spawnable: true,
			category: 'Other',
			is_sword: false,
			GetAmmoCost: ()=>
			{
				return 1;
			},
			onMade: ( gun )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				gun.sd_filter = sdWorld.CreateSDFilter();
				
				//sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, liquid_carrier_base_color, liquid_carrier_empty );
			},
			projectile_properties: { time_left: 0.75, _damage: 1, color: 'transparent', 
				_knock_scale: 0,
				_custom_detonation_logic:( bullet )=>
				{
					let gun = bullet._gun;
					
					if ( gun.extra <= 30 )
					{
						let blood_decal_ent = sdBloodDecal.GetBloodDecalObjectAt( bullet.x, bullet.y );

						if ( blood_decal_ent )
						{
							gun.extra++;

							sdSound.PlaySound({ name:'water_entrance', x:gun.x, y:gun.y, volume: 0.1, pitch: 1 });

							blood_decal_ent.intensity -= 50;
							if ( blood_decal_ent.intensity < 33 )
							{
								blood_decal_ent.remove();
							}
							else
							{
								blood_decal_ent._update_version++;
							}
							
							if ( blood_decal_ent._bg )
							if ( blood_decal_ent._bg.material !== sdBG.MATERIAL_GROUND )
							if ( gun._held_by )
							{
								if ( Math.random() < 0.666 ) // Lower score reward rate by 33%
								sdWorld.GiveScoreToPlayerEntity( sdEntity.SCORE_REWARD_SCORE_MOP, blood_decal_ent, true, gun._held_by );
							}
						}
					}
					
					let water_ent = sdWater.GetWaterObjectAt( bullet.x, bullet.y );
					if ( water_ent )
					{
						sdSound.PlaySound({ name:'water_entrance', x:gun.x, y:gun.y, volume: 0.1, pitch: 1 });
						
						while ( gun.extra > 0 && water_ent.type === sdWater.TYPE_WATER )
						{
							gun.extra--;
							if ( Math.random() < 0.01 )
							{
								water_ent.type = sdWater.TYPE_ACID;
								water_ent._update_version++;
							}
						}
					}
					
					if ( gun.extra > 30 )
					{
						sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, mop_base_color, '#8c6a00' );
						sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, mop_base_color_border, '#6f5400' );
					}
					else
					if ( gun.extra > 15 )
					{
						sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, mop_base_color, '#cfc22e' );
						sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, mop_base_color_border, '#a59a25' );
					}
					else
					{
						sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, mop_base_color, mop_base_color );
						sdWorld.ReplaceColorInSDFilter_v2( gun.sd_filter, mop_base_color_border, mop_base_color_border );
					}
				}
			}
		};

		sdGun.classes[ sdGun.CLASS_TELEPORT_SWORD = 101 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'time_shifter_sword' ),
			//sound: 'gun_medikit',
			title: 'Time shifter blade',
			sound: 'sword_attack2',
			image_no_matter: sdWorld.CreateImageFromFile( 'time_shifter_sword' ),
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: true,
			projectile_velocity: 16 * 1.5,
			min_build_tool_level: 90,
			matter_cost: 20000,
			min_workbench_level: 30,
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( sdWorld.is_server )
				if ( gun._held_by )
				if ( gun._held_by.IsPlayerClass() )
				if ( gun._held_by.matter >= 25 )
				if ( sdWorld.inDist2D_Boolean( gun._held_by.x, gun._held_by.y, gun._held_by.look_x, gun._held_by.look_y, 600 ) )
				{
					let damage_value = 100 + Math.min( 200, 10 * gun._combo ); // Damage increases with combo so it can be efficient against higher health enemies
					//let dx = gun._held_by.look_x - gun._held_by.x;

					//if (dx === 0 ) // Could result in endless for loop
					//dx = gun._held_by._side;

					let dx = gun._held_by.look_x - gun._held_by.x;
					let dy = gun._held_by.look_y - gun._held_by.y;

					let landed_hit = false; // If char damages something, it costs less matter and can be used faster again

					/*let last_x = gun._held_by.x; // Last location player can teleport to
					let last_y = gun._held_by.y; // Last location player can teleport to
					let rail_x = gun._held_by.x; // Rail visual effect location
					let rail_y = gun._held_by.y;*/
							
					let from_x = gun._held_by.x;
					let from_y = gun._held_by.y;
							
					let to_x = from_x;
					let to_y = from_y;

					let di = sdWorld.Dist2D_Vector( dx, dy );

					if ( di > 1 )
					{
						dx /= di;
						dy /= di;
					}
					else
					{
						return true;
					}
					
					let j = gun._held_by.y;


					//let hit_entities = []; // Array for entities that have been hit so they can't be hit multiple times
					let hit_entities = new Set(); // Array for entities that have been hit so they can't be hit multiple times
					
					let pending_solid_wall_hit = null;
					
					let Damage = ( e )=>
					{
						if ( !hit_entities.has( e ) )
						{
							hit_entities.add( e );
							
							if ( e.IsTargetable( gun._held_by ) )
							{
								e.DamageWithEffect( damage_value, gun._held_by );
								
								if ( !landed_hit )
								{
									landed_hit = true;
									sdSound.PlaySound({ name:'cube_teleport', x:e.x, y:e.y, volume:2, pitch: 1.5 });
								}
							}
						}
						
						return false;
					};
					
					let custom_filtering_method = ( e )=>
					{
						if ( sdCom.com_visibility_unignored_classes.indexOf( e.GetClass() ) !== -1 )
						pending_solid_wall_hit = e;
						//return true; Make sure it collects all other possible hits before stopping completely
					
						return false;
					};
					
					let step_size = 8;
					let i = 0;
					let max_i = 0;
					// First cycle - we find position where player will stop
					while ( i <= di )
					{
						pending_solid_wall_hit = null;
						
						let xx = from_x + dx * i;
						let yy = from_y + dy * i;
						gun._held_by.CanMoveWithoutOverlap( xx, yy, 2, custom_filtering_method );
						
						if ( gun._held_by.CanMoveWithoutOverlap( xx, yy, 2 ) )
						{
							to_x = xx;
							to_y = yy;
							max_i = i;
						}
						else
						{
							if ( sdWorld.last_hit_entity )
							Damage( sdWorld.last_hit_entity );
						}
						
						if ( pending_solid_wall_hit )
						{
							//Damage( pending_solid_wall_hit );
							break;
						}
						
						if ( i < di )
						{
							i += step_size;
							if ( i >= di )
							i = di;
						}
						else
						break;
					}
					// Second loop - we deal damage until that point
					i = 0;
					while ( i <= max_i )
					{
						let xx = from_x + dx * i;
						let yy = from_y + dy * i;
						
						gun._held_by.CanMoveWithoutOverlap( xx, yy, 2, Damage );
						
						if ( i < max_i )
						{
							i += step_size;
							if ( i >= max_i )
							i = max_i;
						}
						else
						break;
					}

					sdWorld.SendEffect({ x:gun._held_by.x, y:gun._held_by.y, x2:to_x, y2:to_y, type:sdEffect.TYPE_BEAM, color:'#CCCCCC' });
					gun._held_by.x = to_x;
					gun._held_by.y = to_y;
					gun._held_by.sx = dx * 2;
					gun._held_by.sy = dy * 2;
					gun._held_by.ApplyServerSidePositionAndVelocity( true, 0, 0 );

					if ( landed_hit === true )
					{
						gun._combo_timer = 45;
						gun._combo++;
					}
					else
					gun._combo = Math.max( 0, gun._combo - 1 );
					gun._held_by.matter -= landed_hit === true ? 6 : 25; // Keep in mind custom guns deal 250 damage for something like 7 matter per bullet
					gun._reload_time = 15 - Math.min( 7.5, gun._combo * 0.5 ); // Most efficient with timepack
					return true;			

				}
				return false;
			},
			projectile_properties: { _rail: true, time_left: 0, _damage: 1, color: 'transparent'},
			upgrades: AddRecolorsFromColorAndCost( [], '#dcdcdc', 20 )
		};

		sdGun.classes[ sdGun.CLASS_TZYRG_SHOTGUN = 102 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'tzyrg_shotgun' ),
	
			//sound: 'gun_shotgun',
			//sound_pitch: 1.25,
			
			sound: 'tzyrg_fire',
			sound_pitch: 0.8,
			sound_volume: 2,
			
			title: 'Tzyrg Shotgun',
			slot: 3,
			reload_time: 18,
			muzzle_x: 11,
			ammo_capacity: 12,
			count: 5,
			spread: 0.12,
			min_build_tool_level: 8,
			matter_cost: 120,
			projectile_velocity: 20,
			projectile_properties: { _damage: 20 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = {};
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 20; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades:AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( AddShotgunAmmoTypes([]), '#ff7c00', 20 ) )
			//upgrades: AddGunDefaultUpgrades( AddShotgunAmmoTypes( [] ) )
		};

		sdGun.classes[ sdGun.CLASS_COUNCIL_SHOTGUN = 103 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'council_shotgun' ),
			sound: 'cube_attack',
			sound_pitch: 1.2,
			sound_volume: 1.5,
			title: 'Council Shotgun',
			slot: 3,
			reload_time: 0,
			muzzle_x: 7,
			ammo_capacity: -1,
			spread: 0.03,
			count: 2,
			min_build_tool_level: 88,
			matter_cost: 6800,
			min_workbench_level: 32,
			//fire_type: 2,
			projectile_velocity: sdGun.default_projectile_velocity * 1.5,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				if ( shoot_from_scenario )
				return 0;
			
				if ( gun._held_by._auto_shoot_in > 0 )
				return 0;
				
				return 4;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( !shoot_from_scenario )
				{
					if ( gun._held_by )
					if ( gun._held_by._auto_shoot_in <= 0 )
					{
						//gun._held_by._auto_shoot_in = 15;
						//return; // hack
						gun._held_by._auto_shoot_in = 2;
					}
					return false;
				}
				else
				{
					//sdSound.PlaySound({ name: 'gun_pistol', x:gun.x, y:gun.y });
					sdSound.PlaySound({ name:'enemy_mech_attack4', x:gun.x, y:gun.y, volume:1.5, pitch: 2 });
					
					if ( gun._held_by.matter >= 4 )
					if ( gun._held_by._key_states.GetKey( 'Mouse1' ) )
					{
						gun._held_by._auto_shoot_in = ( ( gun._held_by.stim_ef > 0 ) ? ( 7 / ( 1 + gun._combo / 10 ) ) : ( 14 / ( 1 + gun._combo / 10 ) ) ) * gun.extra[ ID_FIRE_RATE ]; // Faster rate of fire when shooting more
						gun._held_by.matter -= 4;
						gun._combo_timer = 16;
						if ( gun._combo < 10 )
						gun._combo++; // Speed up rate of fire, the longer it shoots
					}
				}
				return true;
			},
			projectile_properties: { _damage: 30, color:'ffff00' },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { color:'ffff00' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 30; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddShotgunAmmoTypes( [] ) )
		};

		sdGun.classes[ sdGun.CLASS_KVT_ASSAULT_RIFLE = 104 ] = // sprite made by Ghost581
		{
			image: sdWorld.CreateImageFromFile( 'kvt_ar' ),
			sound: 'gun_the_ripper2',
			sound_pitch: 1.3,
			title: 'KVT Assault Rifle P54 "CER54"',
			slot: 2,
			reload_time: 2,
			muzzle_x: 7,
			ammo_capacity: 44,
			burst: 4,
			burst_reload: 18,
			count: 1,
			matter_cost: 290,
			min_build_tool_level: 22,
			projectile_velocity: sdGun.default_projectile_velocity * 1.1,
			projectile_properties: { _damage: 34, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5 }; // Default value for _knock_scale
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 34; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_IRON_BULL_HANDCANNON = 105 ] = // sprite made by LordBored
		{
			image: sdWorld.CreateImageFromFile( 'handcannon_iron_bull' ),
			sound: 'gun_the_ripper2',
			sound_pitch: 0.3,
			title: 'KVT Handcannon P36 "Iron Bull"',
			slot: 1,
			reload_time: 22,
			muzzle_x: 8,
			ammo_capacity: 6,
			spread: 0,
			count: 1,
			matter_cost: 140,
			min_build_tool_level: 8,
			fire_type: 1,
			projectile_properties: { _damage: 65, _dirt_mult: -0.5 },
			projectile_velocity: sdGun.default_projectile_velocity * 1.5,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5 }; // Default value for _knock_scale
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 65; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#8feafb', 20 ) )
			//upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_THROWABLE_GRENADE = 106 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'grenade_launcher' ),
			sound: 'gun_grenade_launcher',
			title: 'Hand grenade',
			slot: 5,
			reload_time: 20,
			muzzle_x: 7,
			ammo_capacity: -1,
			spread: 0.05,
			count: 1,
			spawnable: false,
			projectile_velocity: 5,
			projectile_properties: { 
				damage:1, 
				time_left: 30 * 3, 
				model: 'grenade2', 
				is_grenade: true,
				_custom_detonation_logic: ( bullet )=>
				{
					sdWorld.SendEffect({ 
						x:bullet.x, 
						y:bullet.y, 
						radius:30, // 70 was too much?
						damage_scale: 7, // 5 was too deadly on relatively far range
						type:sdEffect.TYPE_EXPLOSION, 
						owner:bullet._owner,
						can_hit_owner: true,
						color: sdEffect.default_explosion_color 
					});
				}
			},
		};

		sdGun.classes[ sdGun.CLASS_MINING_FOCUS_CUTTER = 107 ] = { // Sprite by Glek, edited by Ghost581
			image: sdWorld.CreateImageFromFile( 'mining_focus_cutter' ),
			sound: 'gun_psicutter_bounce',
			sound_pitch: 0.4,
			sound_volume: 1,
			title: 'Mining Focus Cutter',
			slot: 0,
			reload_time: 3.8,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: false,
			matter_cost: 360,
			projectile_velocity: 1 * 3,
			min_workbench_level: 2,
			min_build_tool_level: 12,
			projectile_properties: { _rail: true, _damage: 14, color: '#73ff57', _knock_scale:0.1, _dirt_mult: 3 },
			projectile_properties_dynamic: ( gun )=>{ 

				let obj = { _rail: true, color: '#73ff57', _dirt_mult: 3 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];

				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];

				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 14; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};

		sdGun.classes[ sdGun.CLASS_SARRONIAN_FOCUS_BEAM = 108 ] = // Sprite by Ghost581
		{
			image: sdWorld.CreateImageFromFile( 'sarronian_focus_beam' ),
			image_charging: sdWorld.CreateImageFromFile( 'sarronian_focus_beam2' ),
			//sound: 'supercharge_combined2',
			title: 'Sarronian Focus Beam',
			//sound_pitch: 0.5,
			slot: 8,
			reload_time: 0.3,
			muzzle_x: 7,
			ammo_capacity: -1,
			count: 1,
			min_build_tool_level: 83,
			matter_cost: 15200,
			min_workbench_level: 26,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				if ( shoot_from_scenario )
				return 0;

				if ( gun._held_by._auto_shoot_in > 0 )
				return 0;

				return 6;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( !shoot_from_scenario )
				{
					if ( gun._held_by )
					if ( gun._held_by._auto_shoot_in <= 0 )
					{
						//gun._held_by._auto_shoot_in = 15;
						//return; // hack
						gun._held_by._auto_shoot_in = 2000 / 1000 * 30 / ( 1 + gun._combo / 60 );


						//sdSound.PlaySound({ name: 'supercharge_combined2', x:gun.x, y:gun.y, volume: 1.5 });
						sdSound.PlaySound({ name: 'enemy_mech_charge', x:gun.x, y:gun.y, volume: 1.5, pitch: 0.3 });
					}
					return false;
				}
				else
				{
					//sdSound.PlaySound({ name: 'gun_pistol', x:gun.x, y:gun.y });
					sdSound.PlaySound({ name:'red_railgun', x:gun.x, y:gun.y, volume:0.7, pitch: 0.6 });

					if ( gun._held_by.matter >= 6 )
					if ( gun._held_by._key_states.GetKey( 'Mouse1' ) )
					{
						gun._held_by._auto_shoot_in = ( gun._held_by.stim_ef > 0 ) ? ( gun.extra[ ID_FIRE_RATE ] / ( 1 + gun._combo / 60 ) ) : ( 2 * gun.extra[ ID_FIRE_RATE ] / ( 1 + gun._combo / 60 ) ); // Faster rate of fire when shooting more
						gun._held_by.matter -= 6;
						gun._combo_timer = 90;
						if ( gun._combo < 45 )
						gun._combo++; // Speed up rate of fire, the longer it shoots
					}
				}
				return true;
			},
			projectile_properties: { _rail: true, _damage: 22, color: '#eb9d28', _dirt_mult: -0.2 }, // Combined with fire rate
			projectile_properties_dynamic: ( gun )=>{ 

				let obj = { _rail: true, color: '#eb9d28', _dirt_mult: -0.2 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];

				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];

				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 22; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#00ff00', 15, 'main energy color' ) )
		};
		sdGun.classes[ sdGun.CLASS_RAIL_PISTOL2 = 109 ] = { // Original weapon idea, image & pull request by Booraz149 ( https://github.com/Booraz149 )
			image: sdWorld.CreateImageFromFile( 'rail_pistol2' ),
			sound: 'cube_attack',
			sound_pitch: 0.9,
			title: 'Cube-pistol v2',
			slot: 1,
			reload_time: 6,
			muzzle_x: 4,
			ammo_capacity: -1,
			count: 1,
			fire_type: 2,
			projectile_properties: { _rail: true, _damage: 25, color: '#62c8f2'/*, _knock_scale:0.01 * 8*/ },
			spawnable: false,
			projectile_properties_dynamic: ( gun )=>{ 

				let obj = { _rail: true, color: '#62c8f2', _knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];

				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];

				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 25 * 1.2; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AppendBasicCubeGunRecolorUpgrades( [] ) )
		};
		sdGun.classes[ sdGun.CLASS_AREA_AMPLIFIER = 110 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'area_amplifier' ),
			sound_pitch: 4,
			sound: 'supercharge_combined2_part2',

			title: 'Area amplifier',
			slot: 7,
			reload_time: 15,
			muzzle_x: 8,
			ammo_capacity: -1,
			count: 1,
			category: 'Other',
			matter_cost: 10000,
			projectile_velocity: 10,
			min_build_tool_level: 60,
			min_workbench_level: 21,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				return 300;
			},

			projectile_properties: { 
				//explosion_radius: 10, 
				model: 'ball_circle', 
				_damage: 0, color:'#ffffff',
				time_left: 30, 
				_hittable_by_bullets: false,
				_custom_detonation_logic:( bullet )=>
				{
					if ( bullet._owner )
					{
						sdWorld.SendEffect({ 
							x:bullet.x, 
							y:bullet.y, 
							radius:30,
							damage_scale: 0, // Just a decoration effect
							type:sdEffect.TYPE_EXPLOSION, 
							owner:this,
							color:'#ffffff' 
						});

						let nears = sdWorld.GetAnythingNear( bullet.x, bullet.y, 32 );

						for ( let i = 0; i < nears.length; i++ )
						{
							let e = nears[ i ];

							if ( e !== bullet._gun )
							if ( typeof e._time_amplification !== 'undefined' )
							{
								let t = 0;

								if ( e.is( sdGun ) )
								t = 30 * 2;
								else
								t = 30 * 60;

								e.ApplyStatusEffect({ type: sdStatusEffect.TYPE_TIME_AMPLIFICATION, t: t });
							}
						}
					}
				}
			},
			upgrades: AddRecolorsFromColorAndCost( [], '#6199ff', 15, 'main energy color' )
		};

		const illusion_reaction = ( bullet, target_entity )=>
		{
			if ( target_entity )
			if ( bullet._owner )
			if ( !bullet._is_being_removed )
			{
				let owner = bullet._owner;

				bullet.remove();

				let ent2 = sdLost.CreateLostCopy( target_entity, target_entity.title || null, sdLost.FILTER_NONE );

				if ( target_entity.is( sdCrystal ) )
				{
					if ( target_entity.is_big )
					ent2.f = sdWorld.GetCrystalHue( target_entity.matter_max / 4 );
					else
					ent2.f = sdWorld.GetCrystalHue( target_entity.matter_max );

					ent2.t += ' ( ' + (~~(target_entity.matter)) + ' / ' + target_entity.matter_max + ' )';
				}

				if ( owner._side < 0 )
				ent2.x = owner.x + owner._hitbox_x1 - ent2._hitbox_x2;
				else
				ent2.x = owner.x + owner._hitbox_x2 - ent2._hitbox_x1;

				ent2.y = owner.y + owner._hitbox_y2 - ent2._hitbox_y2;

				ent2.s = false;
				ent2.m = 30;
			}
		};

		sdGun.classes[ sdGun.CLASS_ILLUSION_MAKER = 111 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'illusion_maker' ),
			sound_pitch: 6,
			sound: 'supercharge_combined2_part2',
			title: 'Illusion maker',
			slot: 7,
			reload_time: 90,
			muzzle_x: 8,
			ammo_capacity: -1,
			count: 1,
			category: 'Other',
			matter_cost: 5000,
			projectile_velocity: 10,
			min_build_tool_level: 55,
			min_workbench_level: 23,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				return 600;
			},

			projectile_properties: { 
				//explosion_radius: 10, 
				model: 'ball_circle', 
				_damage: 0, 
				color:'#ffffff',
				time_left: 10, 
				_hittable_by_bullets: false,
				_custom_target_reaction: illusion_reaction,
				_custom_target_reaction_protected: illusion_reaction
			},
			upgrades: AddRecolorsFromColorAndCost( [], '#ff0000', 15, 'main energy color' )
		};

		sdGun.classes[ sdGun.CLASS_SHURG_PISTOL = 112 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shurg_pistol' ),
			sound: 'tzyrg_fire',
			sound_pitch: 2,
			title: 'Shurg Pistol',
			slot: 1,
			reload_time: 7,
			muzzle_x: 6,
			ammo_capacity: 10,
			spread: 0.03,
			count: 2,
			fire_type: 1,
			matter_cost: 200,
			min_build_tool_level: 16,
			min_workbench_level: 2,
			projectile_velocity_dynamic: ( gun )=> { return Math.min( 64, sdGun.default_projectile_velocity ) },
			projectile_properties: { _damage: 1 }, // Set the damage value in onMade function ( gun.extra_ID_DAMAGE_VALUE )
			projectile_properties_dynamic: ( gun )=>{ 

				let obj = { _dirt_mult: -0.5, _knock_scale: 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ] }; // Default value for _knock_scale
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];

				obj.color = '#004400';

				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 24; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#008000', 15, 'main energy color' ) )
		};

		// Add new gun classes above this line //

		let index_to_const = [];
		for ( let s in sdGun )
		if ( s.indexOf( 'CLASS_' ) === 0 )
		{
			if ( typeof sdGun[ s ] !== 'number' )
			throw new Error( 'Check sdGunClass for a place where gun class index '+s+' is set - it has value '+sdGun[ s ]+' but should be a number in order to things work correctly' );
			if ( typeof sdGun.classes[ sdGun[ s ] ] !== 'object' )
			throw new Error( 'Check sdGunClass for a place where class '+s+' is defined. It looks like there is a non-object in sdGun.classes array at this slot' );
			if ( index_to_const[ sdGun[ s ] ] === undefined )
			index_to_const[ sdGun[ s ] ] = s;
			else
			throw new Error( 'Check sdGunClass for a place where index value is assigned - it looks like there is ID conflict for ID '+sdGun[ s ]+'. Both: '+s+' and '+index_to_const[ sdGun[ s ] ]+' point at the exact same ID. Not keeping IDs of different gun classes as unique will cause replacement of one class with another when it comes to spawning by ID.' );
		}
		for ( let i = 0; i < sdGun.classes.length; i++ )
		if ( typeof index_to_const[ i ] === 'undefined' )
		{
			sdGun.classes[ i ] = {
				image: sdWorld.CreateImageFromFile( 'present' ),
				sound: 'gun_defibrillator',
				title: 'Missing weapon',
				//slot: -1,
				reload_time: 25,
				muzzle_x: null,
				ammo_capacity: -1,
				count: 0,
				spawnable: false,
				//ignore_slot: true,
				projectile_properties: { time_left: 0, _damage: 0, color: 'transparent' }
			};
			//throw new Error( 'Check sdGunClass for a place where index values are assigned - there seems to be an ID number '+i+' skipped (assuming sdGun.classes.length is '+sdGun.classes.length+' and thus highest ID should be '+(sdGun.classes.length-1)+', with IDs starting at 0). Holes in ID list will cause server to crash when some parts of logic will try to loop through all classes. Currently defined IDs are following: ', index_to_const );
		}

		sdGun.classes[ sdGun.CLASS_LVL4_LIGHT_ARMOR = 1001 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_light_lvl4' ),
			title: 'Task Ops Light Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			min_build_tool_level: 20,
			matter_cost: 2200,
			min_workbench_level: 10,
			onPickupAttempt: ( character, gun )=> 
			{ 
				if ( character.armor_max < 600 )
				{
					if ( character.ApplyArmor({ armor: 600, _armor_absorb_perc: 0.45, armor_speed_reduction: 0 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 600 )
				{
					character.armor += 600;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 600 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};
		sdGun.classes[ sdGun.CLASS_LVL4_MEDIUM_ARMOR = 1002 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_medium_lvl4' ),
			title: 'Task Ops Duty Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			min_build_tool_level: 20,
			matter_cost: 2300,
			min_workbench_level: 10,
			onPickupAttempt: ( character, gun )=> 
			{ 
				if ( character.armor_max < 700 )
				{
					if ( character.ApplyArmor({ armor: 700, _armor_absorb_perc: 0.55, armor_speed_reduction: 5 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 700 )
				{
					character.armor += 700;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 700 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};
		sdGun.classes[ sdGun.CLASS_LVL4_HEAVY_ARMOR = 1003 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_heavy_lvl4' ),
			title: 'Task Ops Combat Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			min_build_tool_level: 20,
			matter_cost: 2400,
			min_workbench_level: 10,
			onPickupAttempt: ( character, gun )=> 
			{ 
				if ( character.armor_max < 800 )
				{
					if ( character.ApplyArmor({ armor: 800, _armor_absorb_perc: 0.65, armor_speed_reduction: 10 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 800 )
				{
					character.armor += 800;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 800 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};
		sdGun.classes[ sdGun.CLASS_LVL5_LIGHT_ARMOR = 1004 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_light_lvl5' ),
			title: 'Super Battle Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			min_build_tool_level: 90,
			matter_cost: 18000,
			min_workbench_level: 32,
			onPickupAttempt: ( character, gun )=> 
			{ 
				if ( character.armor_max < 2000 )
				{
					if ( character.ApplyArmor({ armor: 2000, _armor_absorb_perc: 0.8, armor_speed_reduction: 0 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 2000 )
				{
					character.armor += 2000;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 2000 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};
		sdGun.classes[ sdGun.CLASS_LVL5_MEDIUM_ARMOR = 1005 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_medium_lvl5' ),
			title: 'Blue Battle Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			min_build_tool_level: 90,
			matter_cost: 19000,
			min_workbench_level: 32,
			onPickupAttempt: ( character, gun )=> 
			{ 
				if ( character.armor_max < 3000 )
				{
					if ( character.ApplyArmor({ armor: 3000, _armor_absorb_perc: 0.85, armor_speed_reduction: 0 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 3000 )
				{
					character.armor += 3000;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 3000 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};
		sdGun.classes[ sdGun.CLASS_LVL5_HEAVY_ARMOR = 1006 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_heavy_lvl5' ),
			title: 'Ultra Instinct Type Battle Armor',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			min_build_tool_level: 90,
			matter_cost: 20000,
			min_workbench_level: 32,
			onPickupAttempt: ( character, gun )=> 
			{ 
				if ( character.armor_max < 4000 )
				{
					if ( character.ApplyArmor({ armor: 4000, _armor_absorb_perc: 0.9, armor_speed_reduction: 0 }) )
					gun.remove();
				}
				else
				if ( character.armor < character.armor_max - 4000 )
				{
					character.armor += 4000;
					gun.remove();
				}
				else
				if ( character.armor > character.armor_max - 4000 )
				{
					character.armor = character.armor_max;
					gun.remove();
				}

				return false; 
			} 
		};

		sdGun.classes[ sdGun.CLASS_LVL5_ARMOR_REGEN = 1007 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'armor_repair_module_lvl5' ),
			title: 'Ultra Instinct Armor Repair Module',
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			ignore_slot: true,
			min_build_tool_level: 90,
			matter_cost: 21050,
			min_workbench_level: 32,
			onPickupAttempt: ( character, gun )=> 
			{ 
				if ( character.armor > 0 )
				{
					character._armor_repair_amount = 4000;
					gun.remove(); 
				}

				return false; 
			} 
		};
		sdGun.classes[ sdGun.CLASS_COMBAT_PISTOL = 1008 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'pistol_combat' ),
			sound: 'gun_pistol',
			sound_pitch: 0.5,
			title: 'Combat Pistol',
			slot: 1,
			reload_time: 10,
			muzzle_x: 6,
			ammo_capacity: 7,
			count: 1,
			spread: 0.01,
			min_build_tool_level: 4,
			matter_cost: 100,
			projectile_velocity: sdGun.default_projectile_velocity * 1.5,
			projectile_properties: {_damage: 47, _dirt_mult: -0.5, penetrating: true },
			projectile_properties_dynamic: ( gun )=>
			{ 
				
				let obj = { _dirt_mult: -0.5, penetrating: true };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 47; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};
		sdGun.classes[ sdGun.CLASS_COUNCIL_BURST = 1009 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'council_pistol' ),
			sound: 'gun_f_rifle',
			sound_pitch: 0.35,
			title: 'Council Combat Pistol',
			slot: 1,
			reload_time: 4,
			muzzle_x: 7,
			ammo_capacity: -1,
			count: 1,
			spread: 0.01,
			projectile_velocity: 30,
			projectile_properties: { _rail: true, _damage: 34, color:'#ffff00'/*, _knock_scale:0.01 * 8*/  },
			min_build_tool_level: 87,
			matter_cost: 6500,
			min_workbench_level: 32,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#ffff00' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 34; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};
		sdGun.classes[ sdGun.CLASS_CUBE_CORE = 1010 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'cube_shard' ),
			title: 'Cube Core',
			no_tilt: true,
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			category: 'Other',
			projectile_properties: { _damage: 0 },
			matter_cost: 13700,
			min_workbench_level: 32,
			min_build_tool_level: 90,
			ignore_slot: true,
			apply_shading: false,
			onPickupAttempt: ( character, gun )=> 
			{ 
				if ( character._matter_capacity_boosters_max < 3600 )
				{
					character._matter_capacity_boosters_max += 360;
					character._energy_upgrade += 640;
					character.matter_max += 640;
					character.hmax += 400;
					character._max_level += 6;
					character._damage_mult += 0.2;
					character.onScoreChange();

					if ( character.s >= 111 )
					{
					character.s += 1;
					}

					if ( Math.random() > 0.5 )
					character.Say( "I need cube shards again!" );
					else
					character.Say( 'I will beat any cubes if I have cube cores.' );

					gun.remove();
				}

				return false;
			},
			upgrades: AppendBasicCubeGunRecolorUpgrades( [] )
		};
		sdGun.classes[ sdGun.CLASS_TZYRG_RIFLE = 1100 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'tzyrg_rifle' ),
			sound: 'tzyrg_fire',
			sound_pitch: 1.5,
			sound_volume: 1.5,
			title: 'Tzyrg Combat Rifle',
			slot: 2,
			reload_time: 1.5,
			muzzle_x: 10,
			ammo_capacity: 60,
			count: 1,
			matter_cost: 930,
			projectile_velocity: sdGun.default_projectile_velocity * 1.3,
			min_workbench_level: 20,
			min_build_tool_level: 56,
			projectile_properties: { _damage: 32, _dirt_mult: -0.5, color: '#ff0000', penetrating: true },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5, color: '#ff0000', penetrating: true };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 12; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#ff0000', 20 ) )
		};
		sdGun.classes[ sdGun.CLASS_TZYRG_MARKSMAN = 1101 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'tzyrg_sniper' ),
			sound: 'gun_dmr',
			sound_pitch: 2,
			sound_volume: 2.4,
			title: 'Tzyrg Marksman Rifle',
			slot: 4,
			reload_time: 20,
			muzzle_x: 14,
			ammo_capacity: 5,
			count: 1,
			spread: 0.01,
			projectile_velocity: 30,
			projectile_properties: { _rail: true, _damage: 60, color:'#ff0000'/*, _knock_scale:0.01 * 8*/  },
			min_build_tool_level: 55,
			matter_cost: 670,
			min_workbench_level: 11,
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#ff0000' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 60; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#ff0000', 20 ) )
		};
		sdGun.classes[ sdGun.CLASS_COUNCIL_SNIPER = 1102 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'council_sniper' ),
			sound: 'gun_sniper',
			sound_pitch: 0.5,
			title: 'Council Sniper Gauss Rifle',
			slot: 4,
			reload_time: 250,
			muzzle_x: 14,
			ammo_capacity: -1,
			count: 1,
			spread: 0.01,
			projectile_velocity: 30,
			projectile_properties: { _rail: true, _damage: 150, color:'#ffff00'/*, _knock_scale:0.01 * 8*/ , explosion_radius: 30 },
			min_build_tool_level: 90,
			matter_cost: 19800,
			min_workbench_level: 32,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				return 0;
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( gun._held_by )
				if ( gun._held_by.IsPlayerClass() )
				if ( gun._held_by.hea > 500 * gun.extra[ ID_DAMAGE_MULT ] + 50 )
				{
					gun._held_by.hea -= 500 * gun.extra[ ID_DAMAGE_MULT ];
					gun._held_by.DamageWithEffect( 1, null );
					gun._held_by.matter -= 3000;
				}
				else
				{
					gun._held_by.Say( 'Don\'t try to kill me, I...' );
					return false;
				}
				return true;
			},
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#ffff00', explosion_radius: 30, _rail_circled: true };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 150;
				}
			},
			upgrades: AddGunDefaultUpgrades()
		};
		sdGun.classes[ sdGun.CLASS_SPEAR = 1103 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'spear' ),
			title: 'Spear',
			sound: 'sword_attack2',
			sound_pitch: 0.5,
			slot: 0,
			reload_time: 12,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: true,
			image_no_matter: sdWorld.CreateImageFromFile( 'spear' ),
			matter_cost: 150,
			min_build_tool_level: 1,
			projectile_velocity: 16 * 1.5,
			projectile_properties: { time_left: 1.5, _damage: 45, color: 'transparent', _knock_scale:0.005 * 4 },
			projectile_velocity_dynamic: ( gun )=> { return 16 * 1.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 1.5, color: 'transparent', _knock_scale:0.005 * 4 };
				//obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 45; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#ff0000', 20 ) )
		};
		sdGun.classes[ sdGun.CLASS_SPEAR_MK2 = 1104 ] = {
			image: sdWorld.CreateImageFromFile( 'spear_mk2' ),
			sound: 'saber_attack',
			sound_pitch: 0.5,
			sound_volume: 1.5,
			title: 'Lightning Spear',
			slot: 0,
			reload_time: 10,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_sword: true,
			image_no_matter: sdWorld.CreateImageFromFile( 'spear_mk2' ),
			matter_cost: 200,
			min_build_tool_level: 2,
			projectile_velocity: 20 * 1.5,
			projectile_properties: { time_left: 1.5, _damage: 80, color: 'transparent', _knock_scale:0.005 * 4, 
				_custom_target_reaction:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5, pitch: 0.5 });
				},
				_custom_target_reaction_protected:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5, pitch: 0.5 });
				}
			},
			projectile_velocity_dynamic: ( gun )=> { return 20 * 1.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 1.5, color: 'transparent', _knock_scale:0.005 * 4, 
				_custom_target_reaction:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5, pitch: 0.5 });
				},
				_custom_target_reaction_protected:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'saber_hit2', x:bullet.x, y:bullet.y, volume:1.5, pitch: 0.5 });
				}
				};
				//obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ]; // Make sure guns have _knock_scale otherwise it breaks the game when fired
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 80; // Damage value of the projectile, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#0040ff', 30 ) )
		};
		sdGun.classes[ sdGun.CLASS_HEALING_RAY2 = 1105 ] = { 
			image: sdWorld.CreateImageFromFile( 'cube_healing_ray2' ),
			sound: 'cube_attack',
			title: 'Cube-Medgun v2',
			slot: 6,
			reload_time: 10,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			projectile_velocity: 1 * 3.5,
			spawnable: false,
			projectile_properties: { _rail: true, _damage: -18, color: '#ff00ff' },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _rail: true, color: '#ff00ff' };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},

			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = -18; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( gun._held_by )
				if ( gun._held_by.IsPlayerClass() )
				if ( gun._held_by.hea < gun._held_by.hmax )
				{
					gun._held_by.DamageWithEffect( gun.extra[ ID_DAMAGE_VALUE ] * gun.extra[ ID_DAMAGE_MULT ], null ); // Heal self if HP isn't max. However this healing is unaffected by damage mult and power pack
				}
				return true;
			},
			upgrades:AddGunDefaultUpgrades( AppendBasicCubeGunRecolorUpgrades([]) )
		};
		sdGun.classes[ sdGun.CLASS_GIANT_ZAPPER = 1106 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'gzapper' ),
			image0: [ sdWorld.CreateImageFromFile( 'gzapper0' ), sdWorld.CreateImageFromFile( 'gzapper1' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'gzapper2' ), sdWorld.CreateImageFromFile( 'gzapper2' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'gzapper0' ), sdWorld.CreateImageFromFile( 'gzapper1' ) ],
			has_images: true,
			title: 'Giant Zapper',
			sound: 'cube_attack',
			sound_volume: 1.5,
			sound_pitch: 0.25,
			image_no_matter: sdWorld.CreateImageFromFile( 'gzapper_disabled' ),
			slot: 0,
			reload_time: 20,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			is_giant: true,
			is_sword: true,
			min_build_tool_level: 90,
			matter_cost: 20100,
			min_workbench_level: 30,
			projectile_velocity: 37,
			GetAmmoCost: ()=>
			{
				return 32;
			},
			projectile_properties: { model:'transparent_proj', time_left: 1.5, _damage: 135, color: '#ffffff', _knock_scale:0.025 * 8, 
				_custom_target_reaction:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'cube_attack', x:bullet.x, y:bullet.y, volume:1.5, pitch: 0.75 });
				},
				_custom_target_reaction_protected:( bullet, target_entity )=>
				{
					sdSound.PlaySound({ name:'cube_attack', x:bullet.x, y:bullet.y, volume:1.5, pitch: 0.75 });
				}
			},
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { model:'transparent_proj', time_left: 1.5, color: '#ffffff', _knock_scale:0.025 * 8, 
					_custom_target_reaction:( bullet, target_entity )=>
					{
						sdSound.PlaySound({ name:'cube_attack', x:bullet.x, y:bullet.y, volume:1.5, pitch: 0.75 });
					},
					_custom_target_reaction_protected:( bullet, target_entity )=>
					{
						sdSound.PlaySound({ name:'cube_attack', x:bullet.x, y:bullet.y, volume:1.5, pitch: 0.75 });
					}
				};
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ]; // Damage value is set onMade
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				//obj.color = gun.extra[ ID_PROJECTILE_COLOR ];
				
				return obj;
			},
			onMade: ( gun, params )=> // Should not make new entities, assume gun might be instantly removed once made
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					//gun.extra[ ID_SLOT ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 135; // Damage value of the bullet, needs to be set here so it can be seen in weapon bench stats
					//UpdateCusomizableGunProperties( gun );
				}
			},
			upgrades: AddRecolorsFromColorAndCost( 
				AddRecolorsFromColorAndCost( 
					AddGunDefaultUpgrades(), 
					'#d3d3d3', 100, 'Inner', '' ), 
				'#ffffff', 100, 'Outer', '' )
		};
		sdGun.classes[ sdGun.CLASS_MINIGUN = 1107 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'Minigun' ),
			image_charging: sdWorld.CreateImageFromFile( 'Minigun' ),
			title: 'KVT Minigun P57"Infinity Ammo"',
			slot: 2,
			reload_time: 0,
			muzzle_x: 14,
			ammo_capacity: 500,
			spread: 0.025,
			projectile_velocity: 9.5 * 2,
			count: 1,
			min_build_tool_level: 56,
			matter_cost: 12130,
			min_workbench_level: 24,
			onShootAttempt: ( gun, shoot_from_scenario )=>
			{
				if ( !shoot_from_scenario )
				{
					if ( gun._held_by )
					if ( gun._held_by._auto_shoot_in <= 0 )
					{
						gun._held_by._auto_shoot_in = 500 / 1000 * 30;
						sdSound.PlaySound({ name: 'cube_alert2', x:gun.x, y:gun.y, volume: 1, pitch: 0.5 });
					}
					return false;
				}
				else
				{
					sdSound.PlaySound({ name: 'gun_pistol', x:gun.x, y:gun.y, volume: 0.5, pitch: 1.75 });
					if ( gun._held_by._key_states.GetKey( 'Mouse1' ) )
					{
						gun._held_by._auto_shoot_in = ( gun._held_by.stim_ef > 0 ) ? gun.extra[ ID_FIRE_RATE ] : 2 * gun.extra[ ID_FIRE_RATE ];
					}
				}
				return true;
			},
			projectile_properties: { _damage: 30, _dirt_mult: -0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { _dirt_mult: -0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ];
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];

				return obj;
			},
			onMade: ( gun, params )=>
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 30;
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#00ffff', 20 ) )
		};
		sdGun.classes[ sdGun.CLASS_BUILD_TOOL_MK2 = 1108 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'buildtool2' ),
			sound: 'gun_buildtool',
			sound_volume: 1.5,
			sound_pitch: 0.5,
			title: 'Build tool MK2',
			slot: 9,
			reload_time: 6,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			is_build_gun: true,
			allow_aim_assist: false,
			min_workbench_level: 25,
			min_build_tool_level: 61,
			matter_cost: 8150,
			projectile_properties: { _damage: 0, time_left: 0 },
			upgrades: AddRecolorsFromColorAndCost( [], '#ff0000', 15 )
		};
		sdGun.classes[ sdGun.CLASS_ERTHAL_ROCKET = 1109 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'erthal_rocket' ),
			image0: [ sdWorld.CreateImageFromFile( 'erthal_rocket0' ), sdWorld.CreateImageFromFile( 'erthal_rocket0b' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'erthal_rocket1' ), sdWorld.CreateImageFromFile( 'erthal_rocket1b' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'erthal_rocket2' ), sdWorld.CreateImageFromFile( 'erthal_rocket2b' ) ],
			has_images: true,
			sound: 'spider_attackC',
			sound_volume: 2,
			title: 'Erthal Tank Rocket',
			slot: 5,
			reload_time: 3,
			muzzle_x: 15,
			ammo_capacity: 3,
			spread: 0.01,
			projectile_velocity: 18,
			count: 1,
			burst: 3,
			burst_reload: 35,
			min_build_tool_level: 51,
			min_workbench_level: 22,
			matter_cost: 4040,
			projectile_properties: { time_left: 60, explosion_radius: 18, model: 'mini_rocket', _damage: 2, color: '#00aaff', ac:0.1, _homing: true, _homing_mult: 0.015, _vehicle_mult:sdGun.default_vehicle_mult_bonus, _dirt_mult: 0.5 },
			projectile_properties_dynamic: ( gun )=>{ 
				
				let obj = { time_left: 60, explosion_radius: 18, model: 'mini_rocket', color: '#00aaff', ac:0.1, _homing: true, _homing_mult: 0.015, _vehicle_mult:sdGun.default_vehicle_mult_bonus, _dirt_mult: 0.5 };
				obj._knock_scale = 0.01 * 8 * gun.extra[ ID_DAMAGE_MULT ];
				obj._damage = gun.extra[ ID_DAMAGE_VALUE ];
				obj._damage *= gun.extra[ ID_DAMAGE_MULT ];
				obj.explosion_radius *= gun.extra[ ID_DAMAGE_MULT ];
				obj._knock_scale *= gun.extra[ ID_RECOIL_SCALE ];
				
				return obj;
			},
			onMade: ( gun, params )=>
			{
				if ( !gun.extra )
				{
					gun.extra = [];
					gun.extra[ ID_DAMAGE_MULT ] = 1;
					gun.extra[ ID_FIRE_RATE ] = 1;
					gun.extra[ ID_TEMPERATURE_APPLIED ] = 0;
					gun.extra[ ID_RECOIL_SCALE ] = 1;
					gun.extra[ ID_DAMAGE_VALUE ] = 2;
				}
			},
			upgrades: AddGunDefaultUpgrades( AddRecolorsFromColorAndCost( [], '#37a3ff', 15, 'energy color' ) )
		};
		sdGun.classes[ sdGun.CLASS_PROJECTOR = 1110 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'projector' ),
			title: 'Projector Core',
			no_tilt: true,
			slot: 0,
			reload_time: 25,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 0,
			projectile_properties: { _damage: 0 },
			spawnable: false,
			ignore_slot: true,
			apply_shading: false,
			onPickupAttempt: ( character, gun )=> 
			{ 
				if ( character._energy_upgrade < 8690 && character._energy_upgrade >= 3690 )
				{
					character._energy_upgrade += 1000;
					character.matter_max += 1000;
					character.hmax += 200;
					character.onScoreChange();

					if ( character.s >= 111 )
					{
					character.s += 2;
					}

					if ( character._acquired_bt_projector === false && character._energy_upgrade >= 8690 )
					{
					character._acquired_bt_projector === true;

					if ( Math.random() > 0.5 )
					character.Say( "The last stand to the victory is Star Defender, not you!" );
					else
					character.Say( 'I will do my best, Councils.' );
					}

					sdSound.PlaySound({ name:'spider_celebrateC', x:character.x, y:character.y, volume:1 });
					gun.remove();
				}

				return false;
			},
		};
		sdGun.classes[ sdGun.CLASS_ADMIN_HEAL = 1111 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shark' ),
			sound: 'gun_defibrillator',
			title: 'Admin tool for healing',
			sound_pitch: 2,
			slot: 6,
			reload_time: 2,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: Infinity,
			projectile_velocity: 16,
			spawnable: false,
			projectile_properties: { _rail: true, time_left: 30, _damage: 1, color: '#ffffff', _reinforced_level:Infinity, _armor_penetration_level:Infinity, _admin_picker:true, _custom_target_reaction:( bullet, target_entity )=>
				{
					if ( bullet._owner )
					{
						if ( bullet._owner._god )
						{
							target_entity.DamageWithEffect( -300, bullet._owner, false, false );
						}
						else
						if ( bullet._owner.IsPlayerClass() )
						{
							// Remove if used by non-admin
							if ( bullet._owner._inventory[ bullet._owner.gun_slot ] )
							if ( sdGun.classes[ bullet._owner._inventory[ bullet._owner.gun_slot ].class ].projectile_properties._admin_picker )
							bullet._owner._inventory[ bullet._owner.gun_slot ].remove();
						}
					}
				}
			},
			onMade: ( gun )=>
			{
				let remover_sd_filter = sdWorld.CreateSDFilter();
				sdWorld.ReplaceColorInSDFilter_v2( remover_sd_filter, '#abcbf4', '#ff00ff' );
				
				gun.sd_filter = remover_sd_filter;
			}
		};
		sdGun.classes[ sdGun.CLASS_ADMIN_LOST = 1112 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shark' ),
			sound: 'gun_defibrillator',
			title: 'Admin tool for Lost',
			sound_pitch: 2,
			slot: 1,
			reload_time: 2,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: Infinity,
			projectile_velocity: 16,
			spawnable: false,
			projectile_properties: { _rail: true, time_left: 30, _damage: 1, color: '#ffff00', _reinforced_level:Infinity, _armor_penetration_level:Infinity, _admin_picker:true, _custom_target_reaction:( bullet, target_entity )=>
				{
					if ( bullet._owner )
					{
						if ( bullet._owner._god )
						{
							let nears = sdWorld.GetAnythingNear( bullet.x, bullet.y, 1 );
							for ( let i = 0; i < nears.length; i++ )
							{
								if ( bullet._owner === nears[ i ] )
								{
								}
								else
								sdLost.ApplyAffection( nears[ i ], 300000, bullet );
							}
						}
						else
						if ( bullet._owner.IsPlayerClass() )
						{
							// Remove if used by non-admin
							if ( bullet._owner._inventory[ bullet._owner.gun_slot ] )
							if ( sdGun.classes[ bullet._owner._inventory[ bullet._owner.gun_slot ].class ].projectile_properties._admin_picker )
							bullet._owner._inventory[ bullet._owner.gun_slot ].remove();
						}
					}
				}
			},
			onMade: ( gun )=>
			{
				let remover_sd_filter = sdWorld.CreateSDFilter();
				sdWorld.ReplaceColorInSDFilter_v2( remover_sd_filter, '#abcbf4', '#aaaa00' );
				
				gun.sd_filter = remover_sd_filter;
			}
		};
		sdGun.classes[ sdGun.CLASS_ADMIN_EMPTY = 1113 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shark' ),
			sound: 'gun_defibrillator',
			title: 'Admin tool for Empty',
			sound_pitch: 2,
			slot: 3,
			reload_time: 2,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: Infinity,
			projectile_velocity: 16,
			spawnable: false,
			projectile_properties: { _rail: true, time_left: 30, _damage: 1, color: '#ffffff', _reinforced_level:Infinity, _armor_penetration_level:Infinity, _admin_picker:true, _custom_target_reaction:( bullet, target_entity )=>
				{
					if ( bullet._owner )
					{
						if ( bullet._owner._god )
						{
							let nears = sdWorld.GetAnythingNear( bullet.x, bullet.y, 1 );
							for ( let i = 0; i < nears.length; i++ )
							{
								if ( bullet._owner === nears[ i ] )
								{
								}
								else
								sdLost.ApplyAffection( nears[ i ], 300000, bullet, sdLost.FILTER_WHITE );
							}
						}
						else
						if ( bullet._owner.IsPlayerClass() )
						{
							// Remove if used by non-admin
							if ( bullet._owner._inventory[ bullet._owner.gun_slot ] )
							if ( sdGun.classes[ bullet._owner._inventory[ bullet._owner.gun_slot ].class ].projectile_properties._admin_picker )
							bullet._owner._inventory[ bullet._owner.gun_slot ].remove();
						}
					}
				}
			},
			onMade: ( gun )=>
			{
				let remover_sd_filter = sdWorld.CreateSDFilter();
				sdWorld.ReplaceColorInSDFilter_v2( remover_sd_filter, '#abcbf4', '#777777' );
				
				gun.sd_filter = remover_sd_filter;
			}
		};
		sdGun.classes[ sdGun.CLASS_ADMIN_LOST2 = 1114 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shark' ),
			sound: 'gun_defibrillator',
			title: 'Admin tool for Lost Alt',
			sound_pitch: 2,
			slot: 1,
			reload_time: 5,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: Infinity,
			projectile_velocity: 16,
			spawnable: false,
			projectile_properties: { _rail: true, time_left: 30, _damage: 1, color: '#ffff00', _reinforced_level:Infinity, _armor_penetration_level:Infinity, _admin_picker:true, _custom_target_reaction:( bullet, target_entity )=>
				{
					if ( bullet._owner )
					{
						if ( bullet._owner._god )
						{
							let nears = sdWorld.GetAnythingNear( bullet.x, bullet.y, 256 );
							for ( let i = 0; i < nears.length; i++ )
							{
								if ( bullet._owner === nears[ i ] )
								{
								}
								else
								sdLost.ApplyAffection( nears[ i ], 300000, bullet );
							}
						}
						else
						if ( bullet._owner.IsPlayerClass() )
						{
							// Remove if used by non-admin
							if ( bullet._owner._inventory[ bullet._owner.gun_slot ] )
							if ( sdGun.classes[ bullet._owner._inventory[ bullet._owner.gun_slot ].class ].projectile_properties._admin_picker )
							bullet._owner._inventory[ bullet._owner.gun_slot ].remove();
						}
					}
				}
			},
			onMade: ( gun )=>
			{
				let remover_sd_filter = sdWorld.CreateSDFilter();
				sdWorld.ReplaceColorInSDFilter_v2( remover_sd_filter, '#abcbf4', '#ffff00' );
				
				gun.sd_filter = remover_sd_filter;
			}
		};
		sdGun.classes[ sdGun.CLASS_ADMIN_EMPTY2 = 1115 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shark' ),
			sound: 'gun_defibrillator',
			title: 'Admin tool for Empty Alt',
			sound_pitch: 2,
			slot: 3,
			reload_time: 5,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: Infinity,
			projectile_velocity: 16,
			spawnable: false,
			projectile_properties: { _rail: true, time_left: 30, _damage: 1, color: '#ffffff', _reinforced_level:Infinity, _armor_penetration_level:Infinity, _admin_picker:true, _custom_target_reaction:( bullet, target_entity )=>
				{
					if ( bullet._owner )
					{
						if ( bullet._owner._god )
						{
							let nears = sdWorld.GetAnythingNear( bullet.x, bullet.y, 256 );
							for ( let i = 0; i < nears.length; i++ )
							{
								if ( bullet._owner === nears[ i ] )
								{
								}
								else
								sdLost.ApplyAffection( nears[ i ], 300000, bullet, sdLost.FILTER_WHITE );
							}
						}
						else
						if ( bullet._owner.IsPlayerClass() )
						{
							// Remove if used by non-admin
							if ( bullet._owner._inventory[ bullet._owner.gun_slot ] )
							if ( sdGun.classes[ bullet._owner._inventory[ bullet._owner.gun_slot ].class ].projectile_properties._admin_picker )
							bullet._owner._inventory[ bullet._owner.gun_slot ].remove();
						}
					}
				}
			},
			onMade: ( gun )=>
			{
				let remover_sd_filter = sdWorld.CreateSDFilter();
				sdWorld.ReplaceColorInSDFilter_v2( remover_sd_filter, '#abcbf4', '#aaaaaa' );
				
				gun.sd_filter = remover_sd_filter;
			}
		};
		sdGun.classes[ sdGun.CLASS_IRONF = 1116 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'sword' ),
			title: 'Iron Fists',
			image_no_matter: sdWorld.CreateImageFromFile( 'sword_disabled' ),
			slot: 0,
			reload_time: 8,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			projectile_velocity: 16 * 1.2,
			spawnable: false,
			projectile_properties: { time_left: 1, _damage: 75, color: 'transparent', _knock_scale:0.6 }
		};
		const illusion_reaction2 = ( bullet, target_entity )=>
		{
			if ( target_entity )
			if ( bullet._owner )
			if ( !bullet._is_being_removed )
			{
				let owner = bullet._owner;

				bullet.remove();

				let ent2 = sdLost.CreateLostCopy( target_entity, target_entity.title || null, sdLost.FILTER_GOLDEN );

				if ( target_entity.is( sdCrystal ) )
				{
					if ( target_entity.is_big )
					ent2.f = sdWorld.GetCrystalHue( target_entity.matter_max / 4 );
					else
					ent2.f = sdWorld.GetCrystalHue( target_entity.matter_max );

					ent2.t += ' ( ' + (~~(target_entity.matter)) + ' / ' + target_entity.matter_max + ' )';
				}

				if ( owner._side < 0 )
				ent2.x = owner.x + owner._hitbox_x1 - ent2._hitbox_x2;
				else
				ent2.x = owner.x + owner._hitbox_x2 - ent2._hitbox_x1;

				ent2.y = owner.y + owner._hitbox_y2 - ent2._hitbox_y2;

				ent2.s = false;
				ent2.m = 30;
			}
		};

		sdGun.classes[ sdGun.CLASS_ILLUSION_MAKER2 = 1117 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'illusion_maker' ),
			sound_pitch: 6,
			sound: 'supercharge_combined2_part2',
			title: 'Illusion maker Golden',
			slot: 7,
			reload_time: 90,
			muzzle_x: 8,
			ammo_capacity: -1,
			count: 1,
			category: 'Other',
			matter_cost: 6000,
			projectile_velocity: 10,
			min_build_tool_level: 60,
			min_workbench_level: 30,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				return 600;
			},

			projectile_properties: { 
				model: 'ball_circle', 
				_damage: 0, 
				color:'#ffff00',
				time_left: 10, 
				_hittable_by_bullets: false,
				_custom_target_reaction: illusion_reaction2,
				_custom_target_reaction_protected: illusion_reaction2
			},
			upgrades: AddRecolorsFromColorAndCost( [], '#ff0000', 15, 'main energy color' )
		};
		const illusion_reaction3 = ( bullet, target_entity )=>
		{
			if ( target_entity )
			if ( bullet._owner )
			if ( !bullet._is_being_removed )
			{
				let owner = bullet._owner;

				bullet.remove();

				let ent2 = sdLost.CreateLostCopy( target_entity, target_entity.title || null, sdLost.FILTER_WHITE );

				if ( target_entity.is( sdCrystal ) )
				{
					if ( target_entity.is_big )
					ent2.f = sdWorld.GetCrystalHue( target_entity.matter_max / 4 );
					else
					ent2.f = sdWorld.GetCrystalHue( target_entity.matter_max );

					ent2.t += ' ( ' + (~~(target_entity.matter)) + ' / ' + target_entity.matter_max + ' )';
				}

				if ( owner._side < 0 )
				ent2.x = owner.x + owner._hitbox_x1 - ent2._hitbox_x2;
				else
				ent2.x = owner.x + owner._hitbox_x2 - ent2._hitbox_x1;

				ent2.y = owner.y + owner._hitbox_y2 - ent2._hitbox_y2;

				ent2.s = false;
				ent2.m = 30;
			}
		};

		sdGun.classes[ sdGun.CLASS_ILLUSION_MAKER3 = 1118 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'illusion_maker' ),
			sound_pitch: 6,
			sound: 'supercharge_combined2_part2',
			title: 'Illusion maker White',
			slot: 7,
			reload_time: 90,
			muzzle_x: 8,
			ammo_capacity: -1,
			count: 1,
			category: 'Other',
			matter_cost: 6000,
			projectile_velocity: 10,
			min_build_tool_level: 60,
			min_workbench_level: 30,
			GetAmmoCost: ( gun, shoot_from_scenario )=>
			{
				return 600;
			},

			projectile_properties: { 
				//explosion_radius: 10, 
				model: 'ball_circle', 
				_damage: 0, 
				color:'#ffffff',
				time_left: 10, 
				_hittable_by_bullets: false,
				_custom_target_reaction: illusion_reaction3,
				_custom_target_reaction_protected: illusion_reaction3
			},
			upgrades: AddRecolorsFromColorAndCost( [], '#ff0000', 15, 'main energy color' )
		};
		sdGun.classes[ sdGun.CLASS_ADMIN_MATTERS = 1119 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shark' ),
			sound: 'gun_defibrillator',
			title: 'Admin tool for Matters',
			sound_pitch: 2,
			slot: 5,
			reload_time: 2,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: Infinity,
			projectile_velocity: 16,
			spawnable: false,
			projectile_properties: { _rail: true, time_left: 30, _damage: 1, color: '#ffffff', _reinforced_level:Infinity, _armor_penetration_level:Infinity, _admin_picker:true, _custom_target_reaction:( bullet, target_entity )=>
				{
							if ( target_entity.GetClass() === 'sdCrystal' )
							{
								target_entity.matter_regen = 10000;
								target_entity.matter = target_entity.matter_max;
								target_entity._hmax = 800000;
								target_entity._hea = 800000;
							}
							else
							if ( target_entity.GetClass() === 'sdHover' )
							{
								target_entity.hmax = 800000;
								target_entity.hea = 800000;
								target_entity.matter_max = 800000;
								target_entity.matter = 800000;
							}
							else
							if ( target_entity.GetClass() === 'sdMatterContainer' )
							{
								target_entity._hmax = 800000;
								target_entity._hea = 800000;
								target_entity.matter_max = 5120 * 32;
								target_entity.matter = 5120 * 32;
							}
				}
			},
			onMade: ( gun )=>
			{
				let remover_sd_filter = sdWorld.CreateSDFilter();
				sdWorld.ReplaceColorInSDFilter_v2( remover_sd_filter, '#abcbf4', '#ffffff' );
				
				gun.sd_filter = remover_sd_filter;
			}
		};
		sdGun.classes[ sdGun.CLASS_ADMIN_GOD = 1120 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'shark' ),
			sound: 'gun_defibrillator',
			title: 'Admin tool for God Entity',
			sound_pitch: 2,
			slot: 6,
			reload_time: 2,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			matter_cost: Infinity,
			projectile_velocity: 16,
			spawnable: false,
			projectile_properties: { _rail: true, time_left: 30, _damage: 1, color: '#ffffff', _reinforced_level:Infinity, _armor_penetration_level:Infinity, _admin_picker:true, _custom_target_reaction:( bullet, target_entity )=>
				{
					if ( bullet._owner )
					{
						if ( bullet._owner._god && target_entity.GetClass() !== 'sdVirus' && target_entity.GetClass() !== 'sdTutel' )
						{
							if ( target_entity._hmax <= 100000 )
							{
								target_entity._hmax = 100000;
								if ( target_entity.hea <= 100000 )
								{
								target_entity.hea = 100000;
								}
								else
								if ( target_entity._hea <= 100000 )
								{
								target_entity._hea = 100000;
								}
							}
							else
							if ( target_entity.hmax <= 100000 )
							{
								target_entity.hmax = 100000;
								if ( target_entity.hea <= 100000 )
								{
								target_entity.hea = 100000;
								}
								else
								if ( target_entity._hea <= 100000 )
								{
								target_entity._hea = 100000;
								}
							}
							else
							if ( target_entity.hea <= target_entity.hmax )
							{
								target_entity.hea = target_entity.hmax;
							}
							else
							if ( target_entity.hea <= target_entity._hmax )
							{
								target_entity.hea = target_entity._hmax;
							}
							else
							if ( target_entity._hea <= target_entity.hmax )
							{
								target_entity._hea = target_entity.hmax;
							}
							else
							if ( target_entity._hea <= target_entity._hmax )
							{
								target_entity._hea = target_entity._hmax;
							}
						}
						else
						if ( bullet._owner._god && ( target_entity.GetClass() === 'sdVirus' || target_entity.GetClass() === 'sdTutel' ) )
						{
							target_entity.hmax = 3600;
							target_entity._hea = 3600;
						}
					}
				}
			},
			onMade: ( gun )=>
			{
				let remover_sd_filter = sdWorld.CreateSDFilter();
				sdWorld.ReplaceColorInSDFilter_v2( remover_sd_filter, '#abcbf4', '#770077' );
				
				gun.sd_filter = remover_sd_filter;
			}
		};
		sdGun.classes[ sdGun.CLASS_ABOMINATION = 1121 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'ab_gun' ),
			image0: [ sdWorld.CreateImageFromFile( 'ab_gun2' ), sdWorld.CreateImageFromFile( 'ab_gun2' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'ab_gun3' ), sdWorld.CreateImageFromFile( 'ab_gun3' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'ab_gun3' ), sdWorld.CreateImageFromFile( 'ab_gun3' ) ],
			has_images: true,
			sound: 'abomination_attack',
			sound_volume: 2,
			title: 'Abomination Tooth Pusher',
			slot: 8,
			reload_time: 8,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			burst: 8,
			burst_reload: 30,
			spread: 0.01,
			projectile_velocity: 30,
			projectile_properties: { time_left: 60, ac:0.1, _bouncy: true, _homing: true, _homing_mult: 0.05, model: 'ab_tooth', _damage: 20 },
			spawnable: false,
		};
		sdGun.classes[ sdGun.CLASS_ASPGUN = 1122 ] = 
		{
			image: sdWorld.CreateImageFromFile( 'aspgun' ),
			image0: [ sdWorld.CreateImageFromFile( 'aspgun2' ), sdWorld.CreateImageFromFile( 'aspgun2' ) ],
			image1: [ sdWorld.CreateImageFromFile( 'aspgun3' ), sdWorld.CreateImageFromFile( 'aspgun3' ) ],
			image2: [ sdWorld.CreateImageFromFile( 'aspgun3' ), sdWorld.CreateImageFromFile( 'aspgun3' ) ],
			has_images: true,
			sound: 'crystal2',
			sound_pitch: 2.8,
			sound_volume: 1,
			title: 'Asp Gun',
			slot: 8,
			reload_time: 30,
			muzzle_x: null,
			ammo_capacity: -1,
			count: 1,
			spread: 0.01,
			projectile_velocity: 30,
			projectile_properties: { model: 'ball_g', _damage: 15 },
			spawnable: false,
		};
	}
}

export default sdGunClass;