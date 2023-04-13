
import sdWorld from '../sdWorld.js';
import sdSound from '../sdSound.js';
import sdEntity from './sdEntity.js';
import sdEffect from './sdEffect.js';
import sdGun from './sdGun.js';
import sdWater from './sdWater.js';
import sdCom from './sdCom.js';
import sdBullet from './sdBullet.js';
import sdCharacter from './sdCharacter.js';

class sdFactions extends sdEntity
{
	static init_class()
	{
		sdFactions.FACTION_FALKOK = 1; // Falkoks
		sdFactions.FACTION_ERTHAL = 2; // Erthals
		sdFactions.FACTION_COUNCIL = 3; // Council
		sdFactions.FACTION_SARRORIAN = 4; // Sarrorian
		sdFactions.FACTION_VELOX = 5; // Velox
		sdFactions.FACTION_SETR = 6; // Setr
		sdFactions.FACTION_TZYRG = 7; // Tzyrg
		sdFactions.FACTION_KVT = 8;
		sdFactions.FACTION_SD = 9;
		sdWorld.entity_classes[ this.name ] = this; // Register for object spawn
	}

	// This class is used to simplify humanoid faction storage, faction creation and their humanoid properties - Booraz149
	// Just use sdFactions.SetHumanoidProperties( character_entity, faction = faction number ). Factions are stated inside static init_class() to keep it simple and comprehensible.

	static SetHumanoidProperties( character_entity, faction = -1 ) // This automatically generates a humanoid based off a faction we selected. Must specify character_entity.
	{
		let character_settings;
		if ( faction === sdFactions.FACTION_FALKOK ) // Falkoks
		{
			if ( Math.random() < 0.2 )
			{
				if ( Math.random() < 0.07 )
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_F_HEAVY_RIFLE }) );
					character_entity._ai_gun_slot = 2;
					character_entity.s = 120;
				}
				else
				{
					if ( Math.random() < 0.1 )
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_FALKOK_PSI_CUTTER }) );
						character_entity._ai_gun_slot = 4;
					}
					else
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_RAYGUN }) );
						character_entity._ai_gun_slot = 3;
					}
				}
			}
			else
			{ 
				if ( Math.random() < 0.6 )
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_F_MARKSMAN }) );
					character_entity._ai_gun_slot = 2;
				}
				else
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_FALKOK_RIFLE }) );
					character_entity._ai_gun_slot = 2;
				}
			}
			if ( character_entity._ai_gun_slot === 2 )
			character_settings = {"hero_name":"Falkok","color_bright":"#6b0000","color_dark":"#420000","color_bright3":"#6b0000","color_dark3":"#420000","color_visor":"#5577b9","color_suit":"#240000","color_suit2":"#2e0000","color_dark2":"#560101","color_shoes":"#000000","color_skin":"#240000","color_extra1":"#240000","helmet1":false,"helmet2":true,"body60":true,"legs60":true,"voice1":false,"voice2":false,"voice3":true,"voice4":false,"voice5":false,"voice6":true};
			if ( character_entity._ai_gun_slot === 3 || character_entity._ai_gun_slot === 4 ) // If Falkok spawns with Raygun or PSI-Cutter, change their looks Phoenix Falkok
			character_settings = {"hero_name":"Phoenix Falkok","color_bright":"#ffc800","color_dark":"#a37000","color_bright3":"#ffc800","color_dark3":"#a37000","color_visor":"#00234b","color_suit":"#ffc800","color_suit2":"#ffc800","color_dark2":"#a37000","color_shoes":"#ffc800","color_skin":"#a37000","color_extra1":"#00234b","helmet1":false,"helmet12":true,"body11":true,"legs37":true,"voice1":false,"voice2":false,"voice3":true,"voice4":false,"voice5":false,"voice6":true};
			if ( character_entity._ai_gun_slot === 2 && character_entity.s === 120 )
			character_settings = {"hero_name":"Heavy Falkok","color_bright":"#6b0000","color_dark":"#420000","color_bright3":"#6b0000","color_dark3":"#420000","color_visor":"#5577b9","color_suit":"#240000","color_suit2":"#2e0000","color_dark2":"#560101","color_shoes":"#000000","color_skin":"#240000","color_extra1":"#240000","helmet1":false,"helmet43":true,"body83":true,"legs16":true,"voice1":false,"voice2":false,"voice3":true,"voice4":false,"voice5":false,"voice6":true};
			if ( character_entity._ai_gun_slot === 2 && character_entity.s === 100 ) // If a regular falkok spawns
			{
				character_entity.matter = 170;
				character_entity.matter_max = 170;

				character_entity.hea = 250;
				character_entity.hmax = 250;

				character_entity.armor = 100;
				character_entity.armor_max = 100;
				character_entity._armor_absorb_perc = 0.1;
				character_entity._ai_level = Math.floor( Math.random() * 2 ); // Either 0 or 1
				character_entity._matter_regeneration = 1 + character_entity._ai_level; // At least some ammo regen
				character_entity._matter_regeneration_multiplier = 10; // Their matter regenerates 10 times faster than normal, unupgraded players
			}
			if ( character_entity._ai_gun_slot === 2 && character_entity.s === 120 )
			{
				character_entity.matter = 1080;
				character_entity.matter_max = 1080;

				character_entity.hea = 2420;
				character_entity.hmax = 2420;

				character_entity.armor = 1400;
				character_entity.armor_max = 1400;
				character_entity._armor_absorb_perc = 0.55;
				character_entity._matter_regeneration = 15;
				character_entity._matter_regeneration_multiplier = 20;
				character_entity._damage_mult = 1.5;
				character_entity._ai_level = 10;
				character_entity.armor_speed_reduction = 20;
				character_entity.stability_upgrade = 2;
			}
			if ( character_entity._ai_gun_slot === 3 || character_entity._ai_gun_slot === 4 ) // If a Phoenix Falkok spawns
			{
				character_entity.matter = 1400;
				character_entity.matter_max = 1400;
	
				character_entity.hea = 1150; // It is a stronger falkok after all, although revert changes if you want
				character_entity.hmax = 1150;
				character_entity.s = 110;

				character_entity.armor = 860;
				character_entity.armor_max = 860;
				character_entity._armor_absorb_perc = 0.3;
				character_entity._matter_regeneration = 20;
				character_entity._matter_regeneration_multiplier = 30;
				character_entity._damage_mult = 2;
				character_entity._ai_level = 15;
				character_entity._damage_mult = 2;
				character_entity.stability_upgrade = 3;
			}	
			character_entity._ai = { direction: ( character_entity.x > ( sdWorld.world_bounds.x1 + sdWorld.world_bounds.x2 ) / 2 ) ? -1 : 1 };
			character_entity._jetpack_allowed = true; // Jetpack
			character_entity._jetpack_fuel_multiplier = 0.25; // Less fuel usage when jetpacking
			character_entity._ai_team = 1; // AI team 1 is for Falkoks, preparation for future AI factions
		}

		if ( faction === sdFactions.FACTION_ERTHAL ) // Erthals
		{
			if ( Math.random() < 0.15 )
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_ERTHAL_ROCKET }) );
				character_entity._ai_gun_slot = 5;
			}
			else
			if ( Math.random() < 0.4 )
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_ERTHAL_BURST_RIFLE }) );
				character_entity._ai_gun_slot = 2;
			}
			else
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_ERTHAL_PLASMA_PISTOL }) );
				character_entity._ai_gun_slot = 1;
			}
				if ( character_entity._ai_gun_slot === 2 || character_entity._ai_gun_slot === 1 )
				character_settings = {"hero_name":"Erthal","color_bright":"#37a2ff","color_dark":"#000000","color_bright3":"#464646","color_dark3":"#000000","color_visor":"#1664a8","color_suit":"#464646","color_suit2":"#000000","color_dark2":"#464646","color_shoes":"#000000","color_skin":"#1665a8","color_extra1":"#464646","helmet1":false,"helmet4":true,"body3":true,"legs3":true,"voice1":false,"voice2":false,"voice3":true,"voice4":false,"voice5":false,"voice6":false,"voice7":true};
				if ( character_entity._ai_gun_slot === 5 )
				character_settings = {"hero_name":"Erthal Brutal Destroyer","color_bright":"#37a2ff","color_dark":"#000000","color_bright3":"#464646","color_dark3":"#000000","color_visor":"#1664a8","color_suit":"#464646","color_suit2":"#000000","color_dark2":"#464646","color_shoes":"#000000","color_skin":"#1665a8","color_extra1":"#464646","helmet1":false,"helmet122":true,"body91":true,"legs91":true,"voice1":false,"voice2":false,"voice3":true,"voice4":false,"voice5":false,"voice6":false,"voice7":true};
				if ( character_entity._ai_gun_slot === 2 || character_entity._ai_gun_slot === 1 )
				{
					character_entity.matter = 150;
					character_entity.matter_max = 150;

					character_entity.hea = 750;
					character_entity.hmax = 750;

					character_entity.armor = 500;
					character_entity.armor_max = 500;
					character_entity._armor_absorb_perc = 0.2; // 75% damage absorption, since armor will run out before health, they effectively have 750 health
					character_entity._ai_level = 4;
					character_entity._matter_regeneration = 1 + character_entity._ai_level; // At least some ammo regen
					character_entity._matter_regeneration_multiplier = 10; // Their matter regenerates 10 times faster than normal, unupgraded players
				}
				if ( character_entity._ai_gun_slot === 5 )
				{
					character_entity.matter = 2000;
					character_entity.matter_max = 2000;

					character_entity.hea = 4200;
					character_entity.hmax = 4200;

					character_entity.armor = 2000;
					character_entity.armor_max = 2000;
					character_entity._armor_absorb_perc = 0.75;
					character_entity._ai_level = 10;
					character_entity._matter_regeneration = 20;
					character_entity._matter_regeneration_multiplier = 40;
					character_entity._damage_mult = 3;
					character_entity.s = 140;
					character_entity.armor_speed_reduction = 30;
					character_entity.speed_up = true;
					character_entity._stability_recovery_multiplier = 1 + ( 3 / 15 );
					character_entity.stability_upgrade = 20;
				}

				character_entity._ai = { direction: ( character_entity.x > ( sdWorld.world_bounds.x1 + sdWorld.world_bounds.x2 ) / 2 ) ? -1 : 1 };

				character_entity._jetpack_allowed = true; // Jetpack
				character_entity._jetpack_fuel_multiplier = 0.25; // Less fuel usage when jetpacking
				character_entity._ai_team = 2; // AI team 2 is for Erthal
		}

		if ( faction === sdFactions.FACTION_COUNCIL )
		{
			if ( Math.random() < 0.3 )
			{
				if ( Math.random() < 0.2 )
				{
					if ( Math.random() < 0.1 )
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_COUNCIL_SNIPER }) );
						character_entity._ai_gun_slot = 4;
						character_entity.stability_upgrade = 10;
					}
					else
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_COUNCIL_BURST }) );
						character_entity._ai_gun_slot = 1;
						character_entity.stability_upgrade = 10;
					}
				}
				else
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_COUNCIL_SHOTGUN }) );
					character_entity._ai_gun_slot = 3;
					character_entity.stability_upgrade = 10;
				}
			}
			else
			if ( Math.random() < 0.5 )
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_COUNCIL_BURST_RAIL }) );
				character_entity._ai_gun_slot = 4;
				character_entity.stability_upgrade = 5;
			}
			else
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_COUNCIL_PISTOL }) );
				character_entity._ai_gun_slot = 1;
				character_entity.stability_upgrade = 5;
			}
			if ( character_entity.stability_upgrade < 6 )
			character_settings = {"hero_name":"Council Acolyte","color_bright":"#e1e100","color_dark":"#ffffff","color_bright3":"#ffff00","color_dark3":"#e1e1e1","color_visor":"#ffff00","color_suit":"#ffffff","color_suit2":"#e1e1e1","color_dark2":"#ffe100","color_shoes":"#e1e1e1","color_skin":"#ffffff","color_extra1":"#ffff00","helmet1":false,"helmet23":true,"body11":true,"legs8":true,"voice1":false,"voice2":false,"voice3":true,"voice4":false,"voice5":false,"voice6":false,"voice7":false,"voice8":true};

			if ( character_entity.stability_upgrade > 9 )
			character_settings = {"hero_name":"Council Vanguard","color_bright":"#e1e100","color_dark":"#ffffff","color_bright3":"#ffff00","color_dark3":"#e1e1e1","color_visor":"#ffff00","color_suit":"#ffffff","color_suit2":"#e1e1e1","color_dark2":"#ffe100","color_shoes":"#e1e1e1","color_skin":"#ffffff","color_extra1":"#ffff00","helmet1":false,"helmet96":true,"body68":true,"legs68":true,"voice1":false,"voice2":false,"voice3":true,"voice4":false,"voice5":false,"voice6":false,"voice7":false,"voice8":true};

			if ( character_entity.stability_upgrade < 6 )
			{
				character_entity.matter = 300;
				character_entity.matter_max = 300; // Let player leech matter off the bodies

				character_entity.hea = 1400;
				character_entity.hmax = 1400;

				character_entity.armor = 1500;
				character_entity.armor_max = 1500;
				character_entity._armor_absorb_perc = 0.4; // 87% damage absorption, since armor will run out before just a little before health
				character_entity._damage_mult = 1.5;
				character_entity._matter_regeneration = 10 + character_entity._ai_level; // At least some ammo regen
				character_entity._matter_regeneration_multiplier = 10; // Their matter regenerates 10 times faster than normal, unupgraded players
				character_entity._damage_mult = 1.5;
			}
			if ( character_entity.stability_upgrade > 9 )
			{
				character_entity.matter = 1400;
				character_entity.matter_max = 1400;

				character_entity.hea = 1750;
				character_entity.hmax = 1750;

				character_entity.armor = 2000;
				character_entity.armor_max = 2000;
				character_entity._armor_absorb_perc = 0.5;
				character_entity._damage_mult = 2;
				character_entity._matter_regeneration = 20;
				character_entity._matter_regeneration_multiplier = 20;
				character_entity._damage_mult = 2;

			}
			character_entity._ai = { direction: ( character_entity.x > ( sdWorld.world_bounds.x1 + sdWorld.world_bounds.x2 ) / 2 ) ? -1 : 1 };
			//character_entity._ai_enabled = sdCharacter.AI_MODEL_AGGRESSIVE;

			character_entity._ai_level = 10;
			character_entity.s = 110;

			character_entity._jetpack_allowed = true; // Jetpack
			character_entity._jetpack_fuel_multiplier = 0.25; // Less fuel usage when jetpacking
			character_entity._ai_team = 3; // AI team 3 is for the Council
			sdSound.PlaySound({ name:'council_teleport', x:character_entity.x, y:character_entity.y, pitch: 1, volume:1 });
			character_entity._ai.next_action = 5;

			sdWorld.SendEffect({ x:character_entity.x, y:character_entity.y, type:sdEffect.TYPE_TELEPORT, filter:'hue-rotate(' + ~~( 170 ) + 'deg)' });
		}

		if ( faction === sdFactions.FACTION_SARRORIAN ) // Sarrorians
		{
			if ( Math.random() < 0.4 )
			{
				if ( Math.random() < 0.2 )
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_SARRONIAN_FOCUS_BEAM }) );
					character_entity._ai_gun_slot = 8;
					character_entity.s = 120;
				}
				else
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_GAUSS_RIFLE }) );
					character_entity._ai_gun_slot = 8;
				}
			}
			else
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_ALIEN_ENERGY_RIFLE }) );
				character_entity._ai_gun_slot = 8;
			}
			if ( character_entity._ai_gun_slot === 8 )
			character_settings = {"hero_name":"Sarronian E2 Unit","color_bright":"#202020","color_dark":"#101010","color_bright3":"#000000","color_dark3":"#101010","color_visor":"#FFA000","color_suit":"#202020","color_suit2":"#101010","color_dark2":"#101010","color_shoes":"#000000","color_skin":"#FFFF00","color_extra1":"#00FF00","helmet1":false,"helmet77":true,"voice1":false,"voice2":false,"voice3":false,"voice4":false,"voice10":true,"body18":true, "legs36":true};
			if ( character_entity._ai_gun_slot === 8 && character_entity.s === 120 )
			character_settings = {"hero_name":"Sarronian K4 Unit","color_bright":"#202020","color_dark":"#101010","color_bright3":"#000000","color_dark3":"#101010","color_visor":"#FFA000","color_suit":"#202020","color_suit2":"#101010","color_dark2":"#101010","color_shoes":"#000000","color_skin":"#FFFF00","color_extra1":"#00FF00","helmet1":false,"helmet10":true,"voice1":false,"voice2":false,"voice3":false,"voice4":false,"voice10":true,"body38":true, "legs29":true};
			if ( character_entity._ai_gun_slot === 8 ) // If a regular Sarronian soldier
			{
				character_entity.matter = 250;
				character_entity.matter_max = 250;

				character_entity.hea = 350;
				character_entity.hmax = 350;

				character_entity.armor = 150;
				character_entity.armor_max = 150;
				character_entity._armor_absorb_perc = 0.2;

				character_entity._matter_regeneration = 10; // increased alongside matter regen multiplier to allow them to efficiently use the Gauss cannon.
				character_entity._matter_regeneration_multiplier = 25; // Their matter regenerates 25 times faster than normal, unupgraded players
			}
			if ( character_entity._ai_gun_slot === 8 && character_entity.s === 120 )
			{
				character_entity.matter = 1450;
				character_entity.matter_max = 1450;

				character_entity.hea = 1600;
				character_entity.hmax = 1600;

				character_entity.armor = 2050;
				character_entity.armor_max = 2050;
				character_entity._armor_absorb_perc = 0.55;

				character_entity._matter_regeneration = 20;
				character_entity._matter_regeneration_multiplier = 50;
				character_entity._recoil_mult = 0.5;
				character_entity.armor_speed_reduction = 30;
				character_entity.speed_up = true;
				character_entity._stability_recovery_multiplier = 1 + ( 3 / 10 );
				character_entity.stability_upgrade = 15;
				character_entity._damage_mult = 1.2;
			}

			character_entity._ai = { direction: ( character_entity.x > ( sdWorld.world_bounds.x1 + sdWorld.world_bounds.x2 ) / 2 ) ? -1 : 1 };
			character_entity._ai_level = Math.floor( 2 + Math.random() * 3 ); // AI Levels

			character_entity._jetpack_allowed = true; // Jetpack
			character_entity._jetpack_fuel_multiplier = 0.25; // Less fuel usage when jetpacking
			character_entity._ai_team = 4; // AI team 4 is for Sarronian faction
		}

		if ( faction === sdFactions.FACTION_VELOX ) // Velox
		{
			if ( Math.random() < 0.35 )
			{
				if ( Math.random() < 0.2 )
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_FMECH_MINIGUN }) );
					character_entity._ai_gun_slot = 2;
					character_entity.s = 120;
				}
				else
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_RAIL_CANNON }) );
					character_entity._ai_gun_slot = 4;
				}
			}
			else
			{
				if ( Math.random() < 0.8 )
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_VELOX_COMBAT_RIFLE }) );
					character_entity._ai_gun_slot = 2;
				}
				else
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_VELOX_PISTOL }) );
					character_entity._ai_gun_slot = 1;
				}
			}
			if ( character_entity._ai_gun_slot === 1 )
			character_settings = {"hero_name":"Velox Soldier","color_bright":"#c0c0c0","color_dark":"#a0a0a0","color_bright3":"#00ffff","color_dark3":"#202020","color_visor":"#00ffff","color_suit":"#c0c0c0","color_suit2":"#080808","color_dark2":"#000000","color_shoes":"#000000","color_skin":"#000000","helmet1":false,"helmet86":true,"voice1":false,"voice2":false,"voice3":false,"voice4":false,"voice5":false,"voice7":true,"body59":true, "legs59":true};
			if ( character_entity._ai_gun_slot === 2 && character_entity.s === 100 )
			character_settings = {"hero_name":"Velox Soldier","color_bright":"#c0c0c0","color_dark":"#a0a0a0","color_bright3":"#00ff44","color_dark3":"#202020","color_visor":"#00ff44","color_suit":"#c0c0c0","color_suit2":"#080808","color_dark2":"#000000","color_shoes":"#000000","color_skin":"#000000","helmet1":false,"helmet86":true,"voice1":false,"voice2":false,"voice3":false,"voice4":false,"voice5":false,"voice7":true,"body59":true, "legs59":true};
			if ( character_entity._ai_gun_slot === 4 )
			character_settings = {"hero_name":"Velox Devastator","color_bright":"#c0c0c0","color_dark":"#a0a0a0","color_bright3":"#ff0000","color_dark3":"#202020","color_visor":"#ff0000","color_suit":"#c0c0c0","color_suit2":"#080808","color_dark2":"#000000","color_shoes":"#000000","color_skin":"#000000","helmet1":false,"helmet86":true,"voice1":false,"voice2":false,"voice3":false,"voice4":false,"voice5":false,"voice7":true,"body59":true, "legs59":true};
			if ( character_entity._ai_gun_slot === 2 && character_entity.s === 120 )
			character_settings = {"hero_name":"Velox Berserker","color_bright":"#c0c0c0","color_dark":"#a0a0a0","color_bright3":"#96ffff","color_dark3":"#202020","color_visor":"#96ffff","color_suit":"#c0c0c0","color_suit2":"#080808","color_dark2":"#000000","color_shoes":"#000000","color_skin":"#000000","helmet1":false,"helmet86":true,"voice1":false,"voice2":false,"voice3":false,"voice4":false,"voice5":false,"voice7":true,"body59":true, "legs59":true};
			if ( character_entity._ai_gun_slot === 1 || 2 && character_entity.s === 100 ) // If a regular Velox soldier
			{
				character_entity.matter = 200;
				character_entity.matter_max = 200;

				character_entity.hea = 750;
				character_entity.hmax = 750;

				character_entity.armor = 500;
				character_entity.armor_max = 500;
				character_entity._armor_absorb_perc = 0.2;

				character_entity._matter_regeneration = 5; // At least some ammo regen
				character_entity._matter_regeneration_multiplier = 10; // Their matter regenerates 10 times faster than normal, unupgraded players
			}
			if ( character_entity._ai_gun_slot === 4 ) // Rail cannon Velox, harder to kill
			{
				character_entity.matter = 400;
				character_entity.matter_max = 400;

				character_entity.hea = 1200;
				character_entity.hmax = 1200;
				character_entity.s = 110; // tougher so bigger target
				character_entity.armor = 1750;
				character_entity.armor_max = 1750;
				character_entity._armor_absorb_perc = 0.45; // 97% damage absorption, since armor will run out before health, they effectively have 2000 health
				character_entity._damage_mult = 1.2;

				character_entity._matter_regeneration = 5;
				character_entity._matter_regeneration_multiplier = 10;
				character_entity._damage_mult = 2;
			}
			if ( character_entity._ai_gun_slot ===  2 && character_entity.s === 120 )
			{
				character_entity.matter = 900;
				character_entity.matter_max = 900;

				character_entity.hea = 1800;
				character_entity.hmax = 1800;

				character_entity.armor = 2000;
				character_entity.armor_max = 2000;
				character_entity._armor_absorb_perc = 0.65;
				character_entity._damage_mult = 1.5;
				character_entity._matter_regeneration = 25;
				character_entity._matter_regeneration_multiplier = 50;
				character_entity._recoil_mult = 0.7;
				character_entity.armor_speed_reduction = 25;
				character_entity.stability_upgrade = 2;
			}
			character_entity._ai = { direction: ( character_entity.x > ( sdWorld.world_bounds.x1 + sdWorld.world_bounds.x2 ) / 2 ) ? -1 : 1 };
			character_entity._ai_level = Math.floor( 2 + Math.random() * 3 ); // AI Levels

			character_entity._jetpack_allowed = true; // Jetpack
			character_entity._jetpack_fuel_multiplier = 0.25; // Less fuel usage when jetpacking
			character_entity._ai_team = 5; // AI team 5 is for Velox faction
		}

		if ( faction === sdFactions.FACTION_SETR ) // Setr
		{
			if ( Math.random() < 0.4 )
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_SETR_ROCKET }) );
				character_entity._ai_gun_slot = 5;
			}
			else
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_SETR_PLASMA_SHOTGUN }) );
				character_entity._ai_gun_slot = 3;
			}
			if ( character_entity._ai_gun_slot === 3 )
			character_settings = {"hero_name":"Setr Soldier","color_bright":"#0000c0","color_dark":"#404040","color_bright3":"#404040","color_dark3":"#202020","color_visor":"#c8c800","color_suit":"#000080","color_suit2":"#000080","color_dark2":"#404040","color_shoes":"#000000","color_skin":"#000000","helmet1":false,"helmet3":true,"voice1":false,"voice2":false,"voice3":false,"voice4":false,"voice5":false,"voice9":true,"body18":true, "legs22":true};
			if ( character_entity._ai_gun_slot === 5 )
			character_settings = {"hero_name":"Setr Grenadier","color_bright":"#0000c0","color_dark":"#404040","color_bright3":"#404040","color_dark3":"#202020","color_visor":"#c8c800","color_suit":"#000080","color_suit2":"#000080","color_dark2":"#404040","color_shoes":"#000000","color_skin":"#000000","helmet1":false,"helmet61":true,"voice1":false,"voice2":false,"voice3":false,"voice4":false,"voice5":false,"voice9":true,"body19":true, "legs51":true};
			if ( character_entity._ai_gun_slot === 3 ) // If a regular Setr soldier
			{
				character_entity.matter = 150;
				character_entity.matter_max = 150;

				character_entity.hea = 560;
				character_entity.hmax = 560;

				character_entity.armor = 350;
				character_entity.armor_max = 350;
				character_entity._armor_absorb_perc = 0.1; // 70% damage absorption
				character_entity._matter_regeneration = 6; // At least some ammo regen
				character_entity._matter_regeneration_multiplier = 10; // Their matter regenerates 10 times faster than normal, unupgraded players
			}
			if ( character_entity._ai_gun_slot === 5 )
			{
				character_entity.matter = 750;
				character_entity.matter_max = 750;

				character_entity.hea = 1320;
				character_entity.hmax = 1320;

				character_entity.armor = 1500;
				character_entity.armor_max = 1500;
				character_entity._armor_absorb_perc = 0.5;
				character_entity.s = 110;
				character_entity._matter_regeneration = 10;
				character_entity._matter_regeneration_multiplier = 20;
				character_entity.stability_upgrade = 3;
				character_entity._damage_mult = 2;
			}

			character_entity._ai = { direction: ( character_entity.x > ( sdWorld.world_bounds.x1 + sdWorld.world_bounds.x2 ) / 2 ) ? -1 : 1 };
			character_entity._ai_level = Math.floor( 2 + Math.random() * 3 ); // AI Levels

			character_entity._jetpack_allowed = true; // Jetpack
			character_entity._jetpack_fuel_multiplier = 0.25; // Less fuel usage when jetpacking
			character_entity._ai_team = 7; // AI team 7 is for Setr faction
		}

		if ( faction === sdFactions.FACTION_TZYRG ) // Tzyrg
		{
			if ( Math.random() < 0.2 )
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_TZYRG_RIFLE }) );
				character_entity._ai_gun_slot = 2;
				character_entity.s = 110;
			}
			else
			if ( Math.random() < 0.4 )
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_TZYRG_MARKSMAN }) );
				character_entity._ai_gun_slot = 4;
				character_entity.s = 110;
			}
			else
			{
				sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_TZYRG_SHOTGUN }) );
				character_entity._ai_gun_slot = 3;
			}
			if ( character_entity._ai_gun_slot === 3 )
			character_settings = {"hero_name":"Tzyrg","color_bright":"#404040","color_dark":"#202020","color_bright3":"#303030","color_dark3":"#202020","color_visor":"#FF0000","color_suit":"#404040","color_suit2":"#383838","color_dark2":"#202020","color_shoes":"#000000","color_skin":"#101010","color_extra1":"#000000","helmet1":false,"helmet69":true,"voice1":false,"voice10":true,"body34":true,"legs36":true};
			if ( character_entity._ai_gun_slot === 2 || character_entity._ai_gun_slot === 4 )
			character_settings = {"hero_name":"Tzyrg Elite","color_bright":"#404040","color_dark":"#202020","color_bright3":"#303030","color_dark3":"#202020","color_visor":"#FF0000","color_suit":"#404040","color_suit2":"#383838","color_dark2":"#202020","color_shoes":"#000000","color_skin":"#101010","color_extra1":"#202020","helmet1":false,"helmet29":true,"voice1":false,"voice10":true,"body36":true,"legs83":true};

			if ( character_entity._ai_gun_slot === 3 ) // If a regular Tzyrg
			{
				character_entity.matter = 100;
				character_entity.matter_max = 100;

				character_entity.hea = 200;
				character_entity.hmax = 200;

				character_entity.armor = 150;
				character_entity.armor_max = 150;
				character_entity._armor_absorb_perc = 0.1; // 70% damage absorption
				character_entity._matter_regeneration = 5; // At least some ammo regen
				character_entity._matter_regeneration_multiplier = 10; // Their matter regenerates 10 times faster than normal, unupgraded players
			}
			if ( character_entity._ai_gun_slot === 2 || character_entity._ai_gun_slot === 4 )
			{
				character_entity.matter = 1000;
				character_entity.matter_max = 1000;

				character_entity.hea = 1500;
				character_entity.hmax = 1500;

				character_entity.armor = 800;
				character_entity.armor_max = 800;
				character_entity._armor_absorb_perc = 0.4;
				character_entity._matter_regeneration = 15;
				character_entity._matter_regeneration_multiplier = 30;
				character_entity.stability_upgrade = 1;
				character_entity._damage_mult = 1.4;
			}
			character_entity._ai = { direction: ( character_entity.x > ( sdWorld.world_bounds.x1 + sdWorld.world_bounds.x2 ) / 2 ) ? -1 : 1 };
			character_entity._ai_level = Math.floor( 1 + Math.random() * 2 ); // AI Levels

			character_entity._jetpack_allowed = true; // Jetpack
			character_entity._jetpack_fuel_multiplier = 0.25; // Less fuel usage when jetpacking
			character_entity._ai_team = 8; // AI team 8 is for Tzyrg faction
		}

		if ( faction === sdFactions.FACTION_KVT )
		{
			if ( Math.random() < 0.5 )
			{
				if ( Math.random() < 0.2 )
				{
					sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_IRON_BULL_HANDCANNON }) );
					character_entity._ai_gun_slot = 1;
				}
				else
				{
					if ( Math.random() < 0.3 )
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_MINIGUN }) );
						character_entity._ai_gun_slot = 2;
						character_entity.stability_upgrade = 1;
					}
					else
					if ( Math.random() < 0.4 )
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_KIVORTEC_AVRS_P09 }) );
						character_entity._ai_gun_slot = 4;
					}
					else
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_PHASERCANNON_P03 }) );
						character_entity._ai_gun_slot = 8;
					}
				}
			}
			else
			{ 
				if ( Math.random() < 0.9 )
				{
					if ( Math.random() < 0.6 )
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_MISSLE_LAUNCHER_P07 }) );
						character_entity._ai_gun_slot = 5;
					}
					else
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_MMG_THE_RIPPER_T3 }) );
						character_entity._ai_gun_slot = 2;
					}
				}
				else
				{
					if ( Math.random() < 0.7 )
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_MMG_THE_RIPPER_T2 }) );
						character_entity._ai_gun_slot = 2;
					}
					else
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_KVT_ASSAULT_RIFLE }) );
						character_entity._ai_gun_slot = 2;
					}
				}
			}
			if ( character_entity._ai_gun_slot === 2 || character_entity.stability_upgrade < 1 )
			character_settings = {"hero_name":"KVT Assault","color_bright":"#1a1a1a","color_dark":"#2b2b2b","color_bright3":"#141414","color_dark3":"#2b2b2b","color_visor":"#0fd8fc","color_suit":"#1a1a1a","color_suit2":"#1a1a1a","color_dark2":"#2b2b2b","color_shoes":"#141414","color_skin":"#141414","color_extra1":"#0fd8fc","helmet1":false,"helmet44":true,"body5":true,"legs79":true,"voice1":true,"voice3":false};
			if ( character_entity._ai_gun_slot === 8 || character_entity._ai_gun_slot === 4 )
			character_settings = {"hero_name":"KVT Marksman","color_bright":"#1a1a1a","color_dark":"#2b2b2b","color_bright3":"#141414","color_dark3":"#2b2b2b","color_visor":"#0fd8fc","color_suit":"#1a1a1a","color_suit2":"#1a1a1a","color_dark2":"#2b2b2b","color_shoes":"#141414","color_skin":"#141414","color_extra1":"#0fd8fc","helmet1":false,"helmet30":true,"body84":true,"legs20":true,"voice1":true,"voice3":false};
			if ( character_entity._ai_gun_slot === 5 || character_entity.stability_upgrade === 1 )
			character_settings = {"hero_name":"KVT Rocketman","color_bright":"#1a1a1a","color_dark":"#2b2b2b","color_bright3":"#141414","color_dark3":"#2b2b2b","color_visor":"#0fd8fc","color_suit":"#1a1a1a","color_suit2":"#1a1a1a","color_dark2":"#2b2b2b","color_shoes":"#141414","color_skin":"#141414","color_extra1":"#0fd8fc","helmet1":false,"helmet47":true,"body76":true,"legs67":true,"voice1":true,"voice3":false};
			if ( character_entity._ai_gun_slot === 1 )
			character_settings = {"hero_name":"KVT Captain","color_bright":"#1a1a1a","color_dark":"#2b2b2b","color_bright3":"#141414","color_dark3":"#2b2b2b","color_visor":"#0fd8fc","color_suit":"#1a1a1a","color_suit2":"#1a1a1a","color_dark2":"#2b2b2b","color_shoes":"#141414","color_skin":"#141414","color_extra1":"#0fd8fc","helmet1":false,"helmet51":true,"body51":true,"legs33":true,"voice1":true,"voice3":false};
			if ( character_entity._ai_gun_slot === 2 || character_entity.stability_upgrade < 1 )
			{
				character_entity.matter = 400;
				character_entity.matter_max = 400;
				character_entity.hea = 500;
				character_entity.hmax = 500;
				character_entity.armor = 450;
				character_entity.armor_max = 450;
				character_entity._armor_absorb_perc = 0.3;
			}
			if ( character_entity._ai_gun_slot === 5 || character_entity.stability_upgrade === 1 )
			{
				character_entity.matter = 900;
				character_entity.matter_max = 900;
				character_entity.hea = 750;
				character_entity.hmax = 750;
				character_entity.armor = 600;
				character_entity.armor_max = 600;
				character_entity._armor_absorb_perc = 0.65;
				character_entity.stability_upgrade = 1;
				character_entity._damage_mult = 1.5;
				character_entity.s = 110;
			}
			if ( character_entity._ai_gun_slot === 8 || character_entity._ai_gun_slot === 4 )
			{
				character_entity.matter = 600;
				character_entity.matter_max = 600;
				character_entity.hea = 400;
				character_entity.hmax = 400;
				character_entity.armor = 300;
				character_entity.armor_max = 300;
				character_entity._armor_absorb_perc = 0.2;
				character_entity.speed_up = true;
			}
			if ( character_entity._ai_gun_slot === 1 )
			{
				character_entity.matter = 350;
				character_entity.matter_max = 350;
				character_entity.hea = 600;
				character_entity.hmax = 600;
				character_entity.armor = 500;
				character_entity.armor_max = 500;
				character_entity._armor_absorb_perc = 0.4;
			}
			character_entity._ai = { direction: ( character_entity.x > ( sdWorld.world_bounds.x1 + sdWorld.world_bounds.x2 ) / 2 ) ? -1 : 1 };
			character_entity._ai_level = 7;
			character_entity._matter_regeneration = 7;
			character_entity._jetpack_allowed = true;
			character_entity._jetpack_fuel_multiplier = 0.25;
			character_entity._ai_team = 0;
			character_entity._matter_regeneration_multiplier = 12;
		}

		if ( faction === sdFactions.FACTION_SD )
		{
			if ( Math.random() < 0.6 ) // Random gun given to Star Defender
			{
				if ( Math.random() < 0.4 )
				{
					if ( Math.random() < 0.2 )
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_SNIPER }) );
						character_entity._ai_gun_slot = 4;
					}
					else
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_ROCKET }) );
						character_entity._ai_gun_slot = 5;
					}
				}
				else
				{
					if ( Math.random() < 0.3 )
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_SPARK }) );
						character_entity._ai_gun_slot = 8;
					}
					else
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_DMR }) );
						character_entity._ai_gun_slot = 4;
					}
				}
			}
			else
			{ 
				if ( Math.random() < 0.5 )
				{
					if ( Math.random() < 0.3 )
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_LMG }) );
						character_entity._ai_gun_slot = 2;
					}
					else
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_SHOTGUN }) );
						character_entity._ai_gun_slot = 3;
					}
				}
				else
				{
					if ( Math.random() < 0.4 )
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_SMG }) );
						character_entity._ai_gun_slot = 1;
					}
					else
					{
						sdEntity.entities.push( new sdGun({ x:character_entity.x, y:character_entity.y, class:sdGun.CLASS_RIFLE }) );
						character_entity._ai_gun_slot = 2;
					}
				}
			}
			character_settings = {"hero_name":"Star Defender","color_bright":"#c0c0c0","color_dark":"#808080","color_bright3":"#c0c0c0","color_dark3":"#808080","color_visor":"#ff0000","color_suit":"#000080","color_suit2":"#000080","color_dark2":"#808080","color_shoes":"#000000","color_skin":"#808000","helmet1":true,"helmet2":false,"voice1":false,"voice2":false,"voice3":true,"voice4":false,"voice5":false,"voice6":false};
			character_entity.matter = 185;
			character_entity.matter_max = 185;

			character_entity.hea = 250;
			character_entity.hmax = 250;

			character_entity.armor = 500;
			character_entity.armor_max = 500;
			character_entity._armor_absorb_perc = 0.6;
			character_entity.armor_speed_reduction = 10;

			character_entity._ai = { direction: ( character_entity.x > ( sdWorld.world_bounds.x1 + sdWorld.world_bounds.x2 ) / 2 ) ? -1 : 1 };
			character_entity._ai_level = 5;
			character_entity._jetpack_allowed = true;
			character_entity._jetpack_fuel_multiplier = 0.25;
			character_entity._matter_regeneration = 5;
			character_entity._matter_regeneration_multiplier = 4;
			character_entity._ai_team = 0;
		}

		character_entity.sd_filter = sdWorld.ConvertPlayerDescriptionToSDFilter_v2( character_settings );
		character_entity._voice = sdWorld.ConvertPlayerDescriptionToVoice( character_settings );
		character_entity.helmet = sdWorld.ConvertPlayerDescriptionToHelmet( character_settings );
		character_entity.body = sdWorld.ConvertPlayerDescriptionToBody( character_settings );
		character_entity.legs = sdWorld.ConvertPlayerDescriptionToLegs( character_settings );
		character_entity.title = character_settings.hero_name;
	}
}
//sdFactions.init_class();

export default sdFactions;