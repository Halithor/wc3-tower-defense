import {Quest} from 'w3lib/src/index';

export class Quests {
  constructor() {
    const damageInfo = new Quest();
    damageInfo.discovered = true;
    damageInfo.enabled = true;
    damageInfo.required = false;
    damageInfo.setTitle('Damage System');
    damageInfo.setIcon(
      'ReplaceableTextures\\CommandButtons\\BTNSteelMelee.blp'
    );
    damageInfo.setDescription(
      `This quest explains the details of the damage systems in this tower defense. The towers have standard Warcraft style damage types, but the custom types in this game have a more dramatic effect. There also is no standard "Spell Damage", but instead spells deal regular damage of a given type.
      
When triggering effects, towers have 4 sources of dealing damage:
- |cff6699FFAttacks:|r Damage from the tower's attacks, including AoE and multishot.
- |cff6699FFSpells:|r Damage from the tower's spells. Some mods deal this damage.
- |cff6699FFEffects:|r Damage from various effects; on-hit, damage over time, etc.
- |cff6699FFFinal:|r Damage caused by 'whenever this tower deals damage', to prevent cascading damage.
Most effects will specific the damage sources they are triggered by.

|cff6699ffBase Damage|r, |cff6699ffBase Attack Speed|r, and other |cff6699ffBase|r statistics are calculated before any other modifiers are applied. Things that increase the |cff6699FFBase|r stats of a tower are rare, mostly from tower upgrades.
`
    );
  }
}
