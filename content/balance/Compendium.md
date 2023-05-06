---
date: '2023-01-27'
authors: ["Chicken, Jundarer, Dsune"]
published: true
patch: "10.1"
title: Balance Druid 10.1 Compendium
showOnFrontpage: true
sidebarTitle: "Quicklinks"
sidebarContents:  |
  **[1. News](#news)**
 
  **[2. Rotation](#rotation)**
  <br>[Precasting](#precast)
  <br>[What is my Single Target rotation?](#st)
  <br>[What is my AoE priority?](#aoe)
  <br>[What is my filler priority inside CA?](#filler)
  <br>[How do we use Wild Mushrooms and how do they work?](#mushroom)
  <br>[How do we use Warrior of Elune](#woe)
  <br>[Which Eclipse do we enter](#eclipse)
 
  **[3. Talents](#talents)**
 
  **[4.Consumables](#consumables)**
  <br>[Potions](#potions)
  <br>[Food](#food)
  <br>[Phials](#phials)
  <br>[Runes](#runes)
 
  **[5. Gearing](#gearing)**
  <br>[Stats](#stats)
  <br>[Enchants](#enchants)
  <br>[Crest Upgrades](#crests)
  <br>[Embellishments](#embellishments)
  <br>[Tier Set](#tier-set)
  <br>[Trinkets](#trinkets)
  
  **[6. Miscellaneous](#misc)**
  <br>[Do our dots snapshot?](#snapshot)
  <br>[What is Astral damage?](#astral-damage)
  <br>[How do I use Owlkin Frenzy procs?](#owlkin-frenzy)
  <br>[Macros](#macros)
 
  **[7. Sims](#sims)**
 
---

<details>
<summary>Changelog</summary>
2023-05-01
<br>10.1 update


  
 
</details>
   
<div id="news">

# [1. News:](#news)

</div>

## [10.1 News](https://www.dreamgrove.gg/balance/compendium_news/)
In the above link you will find a summary of the changes in Patch 10.1 including new talents, fixes, and balance changes that have been implemented in the latest patch along with some thoughts about the effect on gameplay.

<div id="rotation">
 
# [2.Rotation:](#rotation)

</div>

<div id="precast">

## [Precasting](#precast)

</div>

**Precasting:**
- Cast {{< spell 190984 "Wrath" >}} twice
- Cast {{< spell 202347 "Stellar Flare" >}}
- Cast {{< spell 194153 "Starfire" >}} if {{< spell 202347 "Stellar Flare" >}} is not talented

You can precast from max range ~4 seconds before a boss is pulled.

<div id="st">

## [What is my Single Target rotation?](#st)

</div>

**Single Target priority list:**
- Keep up {{< spell 8921 "Moonfire" >}}, {{< spell 93402 "Sunfire" >}} and {{< spell 202347 "Stellar Flare" >}} and refresh within pandemic (30% of base duration) inside Eclipse and if they would expire otherwise outside Eclipse.
- Use {{< spell 190984 "Wrath" >}} to enter Lunar Eclipse if one of the following conditions are true:
    - You have 520 Astral Power or more towards {{< spell 393961 "Pulsar" >}}.
    - The cooldown of {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} has less than 5 seconds remaining.
- Use {{< spell 194153 "Starfire" >}} to enter Solar Eclipse.
- Use {{< spell 191034 "Starfall" >}} if you have 550 Astral Power or more towards {{< spell 393961 "Primordial Arcanic Pulsar" >}}, you have a {{< spell 393942 "Starweaver's Warp" >}} proc and you are not in {{< spell 102560 "Inc" >}} already.
- Use {{< spell 194223 "Celestial Alignment" >}} or {{< spell 102560 "Incarnation" >}} if you are not in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} already.
- Use {{< spell 202425 "Warrior of Elune" >}} if available.
- Use {{< spell 391528 "Convoke the Spirits" >}} when below 40 AP if you are inside {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}}, or if your next {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} window is 30 or more seconds away and your Eclipse will last for more than 4 seconds.
- Use {{< spell 400636 "Astral Communion" >}} if you will not overcap on AP.
- Use {{< spell 205636 "Force of Nature" >}} if you will not overcap on AP.
- Use {{< spell 211545 "Fury of Elune" >}} if you will not overcap on AP.
- Use {{< spell 191034 "Starfall" >}} if you have a {{< spell 393942 "Starweaver's Warp" >}} proc.
- Use {{< spell 78674 "Starsurge" >}} if {{< spell 202345 "Starlord" >}} has less than 3 stacks and if talented you can optimally refresh your {{< spell 393954 "Rattle the Stars" >}} buff.
- Use {{< spell 274281 "New-" >}}, {{< spell 202768 "Half-" >}} and {{< spell 202771 "Full Moon" >}} if you will not overcap on AP.
- Use {{< spell 78674 "Starsurge" >}} if one of the following conditions are true: 
    - You would overcap AP with the next cast.
    - You have a {{< spell 393944 "Starweaver's Weft" >}} proc.
    - Solar or Lunar Eclipse will end in the next 4 seconds and you have above 70 AP.
- Use {{< spell 88747 "Wild Mushroom" >}} on cooldown.
- Use {{< spell 194153 "Starfire" >}} if you are in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} and {{< spell 202425 "Warrior of Elune" >}} has 1 charge left.
- Use {{< spell 190984 "Wrath" >}} regardless of which Eclipse you are in.

<div id="aoe">

## [What is my AoE rotation?](#aoe)

</div>

**AoE priority list:**

- Use {{< spell 93402 "Sunfire" >}} if the targets will live for 6 or more seconds and you will hit all targets with it. Otherwise wait with this until they are gathered.
- Use {{< spell 8921 "Moonfire" >}} if the target(s) will live for 6 or more seconds and you will not overcap on AP.
- Use {{< spell 191034 "Starfall" >}} if you would overcap Astral Power with your next cast. 
- Use {{< spell 194153 "Starfire" >}} to enter Solar Eclipse if you are fighting 3 targets. 
- Use {{< spell 190984 "Wrath" >}} to enter Lunar Eclipse if {{< spell 194153 "Starfire" >}} will hit 4+ targets.
- Use {{< spell 202347 "Stellar Flare" >}} if the target will live for at least 8s+1s per target that {{< spell 194153 "Starfire" >}} can hit and you will not overcap on AP. This basically means that you should apply some Flares before using cooldowns until you would cap AP or have to start moving which is usually around 2-4 depending on how much AP you started with.
- Use {{< spell 194223 "CA" >}} or {{< spell 102560 "Inc" >}} if you are not in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} already.
- Use {{< spell 202425 "Warrior of Elune" >}} if available.
- Use {{< spell 88747 "Wild Mushroom" >}} if you will not overcap on AP. If you are using {{< spell 392999 "Fungal Growth" >}} and {{< spell 393956 "Waning Twilight" >}} make sure to not use it if the debuff is up already.
- Use {{< spell 211545 "Fury of Elune" >}} or {{< spell 202771 "Full Moon" >}} if you will not overcap on AP.
- Use {{< spell 191034 "Starfall" >}} if one of the following conditions are true:
    - You have a {{< spell 393942 "Starweaver's Warp" >}} proc.
    - {{< spell 202345 "Starlord" >}} is below 3 stacks.
- Use {{< spell 194153 "Starfire" >}} if you have an {{< spell 393760 "Umbral Embrace" >}} proc and you will not overcap on AP.
- Use {{< spell 78674 "Starsurge" >}} if you have a {{< spell 393944 "Starweaver's Weft" >}} proc and you are fighting less than 3 targets.
- Use {{< spell 202347 "Stellar Flare" >}} if the target will live for at least 8s+1s per target that {{< spell 194153 "Starfire" >}} can hit and you will not overcap on AP. Don't use this above 11 targets -1 per talent in Umbral Intensity or Astral Smolder.
- Use {{< spell 400636 "Astral Communion" >}} if you will not overcap on AP.
- Use {{< spell 391528 "Convoke the Spirits" >}} if {{< spell 194153 "Starfire" >}} would only hit 2 targets, otherwise only use {{< spell 391528 "Convoke" >}} for movement in AoE.
- Use {{< spell 274281 "New Moon" >}} and {{< spell 202768 "Half Moon" >}} if you will not overcap on AP.
- Use {{< spell 205636 "Force of Nature" >}} if you will not overcap on AP.
- Use {{< spell 78674 "Starsurge" >}} if you have a {{< spell 393944 "Starweaver's Weft" >}} proc and {{< spell 194153 "Starfire" >}} will hit less than 17 targets.
- Use {{< spell 194153 "Wrath" >}} if {{< spell 194153 "Starfire" >}} will hit 3 or less targets.
- Use {{< spell 194153 "Starfire" >}}.


<div id="filler">

## [What is my filler priority inside CA/Inc?](#filler)

</div>


Inside of {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} your fillers will be {{< spell 190984 "Wrath" >}} on 3 targets or less and {{< spell 194153 "Starfire" >}} on 4 or more targets.

 
 <div id="mushroom">

## [How do we use Wild Mushrooms and how do they work?](#mushroom)
 
</div>

{{< spell 88747 "Wild Mushroom" >}} deals damage in an explosion and then applies a DOT  called {{< spell 392999 "Fungal Growth" >}}(if talented). This DOT lasts for 8 seconds and deals 70% of the explosions damage over the course of its duration. {{< spell 88747 "Wild Mushroom" >}} has 3 charges, so if all 3 charges are used in quick succession and each apply a dot dealing 1000 damage, the total damage dealt by the DOT would be 3000 (1000 damage x 3 charges), and the duration of the DOT would be refreshed to 8 seconds.

This type of DOT is often called "Ignite" based on a Mage spell working this exact way. You dont lose/gain any Fungal Growth damage by staggering them or pressing them all at once.

On single target, it's best to use all 3 charges at once paired with any available buffs such as potion, trinkets, CA. {{< spell 88747 "Wild Mushroom" >}} is also an instant GCD, so it can be used for movement as needed.

In AoE scenarios, you can use the charges all at once for a quick burst of damage or stagger them to get {{< spell 393956 "Waning Twilight" >}} up.

In Mythic+, it's best to stagger the charges to get {{< spell 393956 "Waning Twilight" >}} up on all mobs before you've managed to apply {{< spell 202347 "Stellar Flare" >}}.
 

<div id="woe">

## [How do we use Warrior of Elune?](#woe)
 
 </div>
 
Warrior of Elune is an off-gcd ability, it makes your next 3 starfires instant and the 45s cooldown starts when all 3 charges have been consumed.
<br>Use the charges if any of the following conditions are true:
- To enter Solar Eclipse
- You have 1 charge left and you are in either {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} or in Lunar Eclipse.
- As a movement GCD in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} or Lunar Eclipse.


<div id="eclipse">

## [Which Eclipse do we enter?](#eclipse)
 
 </div>
 
 1-3 targets we enter Solar Eclipse and cast {{< spell 190984 "Wrath" >}}.
 <br>On any other target count we enter Lunar Eclipse and cast {{< spell 194153 "Starfire" >}}.
 
 
<div id="talents">

# [3.Talents:](#talents)

</div>

## Talents for different target counts
[Single target](https://mimiron.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFASSEBEJkkEJRKCtEHIRSUS0kcgQolUSCR0AoAAA?bgcolor=000000)
<br>[Two targets](https://mimiron.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFASSEBJRCSSkEp4AUScgkkElkQyBChWSJCRUAoAAA?bgcolor=000000)
<br>[M+ Talents Weaver](https://mimiron.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFASSEBEJkkEJRKCtEHIJJRJJkcgQolUiQEFAKAA?bgcolor=000000)
<br>[M+ Talents Rattle](https://mimiron.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFASSEBJRCSSkEp4AUScgkkElkQyBChWSJCR0AoAAA?bgcolor=000000)
<br>[Sustained AoE](https://mimiron.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFASSEBJRCSSkEp4AUScgkkEFJkcgk4AaJlIRAAKAA?bgcolor=000000)

## Raid Talents
TBD

## Dungeon Talents
The following are dungeon talent builds that will always serve you well but mind that there can be some variations based on your group comp or affixes.
  
TBD
  
### Dungeon Druid Tree Considerations
  
- Ursine Vigor, Well-Honed Instincts and Improved Stampeding Roar are the major competing talents. Ursine Vigor should be taken if you need it to survive certain abilities. Well-Honed Instincts is always on 1 point but a 2nd can be taken if you rarely/never use Bear Form. Improved Stampeding Roar is extremely useful in indoor dungeons and in spiteful weeks.
- Remove Corruption should be taken in Afflicted weeks and in every dungeon except Vortex Pinnacle, as we lose nothing relevant by taking it.
- Cyclone has basically no use other than stopping Bursting and can be replaced with anything else(which also won't have any use).
- Hibernate can be used for Incorporeal affix.
- For lower keys you can put 2 points into Feline Swiftness like [this](https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFASERQSkgkEJRKCtEHAAAAAAAAAA?bgcolor=000000). This skips Ursine Vigor and Typhoon.
- All other talents in the druid tree are more or less set.


<div id="consumables">

# [4.Consumables:](#consumables)

</div>


<div id="potions">

## [Potions](#Potions)

</div>


[Elemental Potion of Ultimate Power](https://www.wowhead.com/item=191383/elemental-potion-of-ultimate-power) for every situation. Potion of Elemental Power is only 0.4% worse if it turns out to be far cheaper.


<div id="food">

## [Food](#food)

</div>


[Grand Banquet of the Kalu'ak](https://www.wowhead.com/item=197794/grand-banquet-of-the-kaluak) in every situation, but [Sizzling Seafood Medley](https://www.wowhead.com/item=197784/sizzling-seafood-medley) is a cheaper close contender. 


<div id="phials">

## [Phials](#Phials)

</div>

**ST**

Pure damage wise with 100% uptime on all of the Phials and not counting in the downsides their hierarchy is as follows on ST:

- [Iced Phial of Corrupting Rage](https://www.wowhead.com/item=191329/iced-phial-of-corrupting-rage) This Phial would be our default if the tooltip was accurate, currently it procs at 100% instead of 400% as the tooltip says. Unless that is fixed you won't play it in any relevant raid content.
- [Phial of Static Empowerment](https://www.wowhead.com/item=191338/phial-of-static-empowerment), has ~55% of the value of Corrupting Rage Phial at 100% uptime.
- [Phial of Charged Isolation](https://www.wowhead.com/item=191332/phial-of-charged-isolation), has ~55% of the value of Corrupting Rage Phial at 100% uptime.
- [Phial of Elemental Chaos](https://www.wowhead.com/item=191359/phial-of-elemental-chaos), has the same value as Corrupting Rage at 60% uptime. 
- [Phial of Tepid Versatility](https://www.wowhead.com/item=191341/phial-of-tepid-versatility), same as the Elemental one, only that vers is more often better during progress than the random stats.
- [Phial of Glacial Fury](https://www.wowhead.com/item=191335/phial-of-glacial-fury), after nerfs this Phial should never be used.

**AoE**:

The priority is the same as it is on ST.


<div id="runes">

## [Runes](#Runes)

</div>

Generally you will want to use [Howling Rune](https://www.wowhead.com/item=194820/howling-rune), sim your character for the most accurate answer.


<div id="gearing">

# [5.Gearing:](#gearing)

</div>


<div id="stats">
 
## [Stat Priority:](#stats)

</div>

Sim yourself using [Raidbots Top Gear](https://www.raidbots.com/simbot/topgear). Do not follow any stat priorities.

<div id="enchants">

## [Enchants](#enchants)

</div>


Weapon - [Sophic Devotion](https://www.wowhead.com/item=200054/enchant-weapon-sophic-devotion?crafting-quality=6) or [Wafting Devotion](https://www.wowhead.com/beta/item=200058/enchant-weapon-wafting-devotion) sim between these two, it depends how much haste you have.
<br>Chest - [Waking Stats](https://www.wowhead.com/item=200030/enchant-chest-waking-stats?crafting-quality=6) Intellect
<br>Cloak - [Graceful Avoidance](https://www.wowhead.com/item=200031/enchant-cloak-graceful-avoidance) Avoidance + Reduced fall damage
<br>Legs - [Frozen Spellthread](https://www.wowhead.com/item=194013/frozen-spellthread?crafting-quality=6) Intellect + Stamina
<br>Wrist - [Devotion of Avoidance](https://www.wowhead.com/item=200021/enchant-bracer-devotion-of-avoidance?crafting-quality=6) Avoidance
<br>Boots - [Watchers Loam](https://www.wowhead.com/item=199936/enchant-boots-watchers-loam) Stamina
<br>Ring - [Devotion of Mastery](https://www.wowhead.com/item=200039/enchant-ring-devotion-of-mastery?crafting-quality=6) Mastery is our best stat but you should always sim your own character to determine what enchant to use in this slot.



<div id="crests">

## [Crests](#crests)

</div>


Week 0 = Patch week
<br>Week 1 = Raid week
<br>Week 2 = Second raid week
<br>Sparks will be available in the following weeks: Week 0, Week 2, Week 4...

- Use crests to upgrade 5 items in Week 1 and 2 up to ilvl 441. Refer to this [guide](https://i.imgur.com/4lxTN6Z.png).
- Upgrade crests in the following order: Weapon > Chest = Legs = Head > Shoulders = Gloves = Waist > Rings > Cloak = Wrist > Neck.
- Keep in mind that this order will heavily change depending on what you obtain from mythic+ and raid. Also, avoid upgrading tier slots until you have your 4-piece.


<div id="embellishments">

## [Embellishments](#embellishments)

</div>

**The [Spore Colony Shoulderpads](https://www.wowhead.com/ptr/item=204706/spore-colony-shoulderguards) was changed after they were first implemented in Simc, DO NOT craft them.**
<br>Initially the debuff on the target could keep stacking while the dot was active, that is no longer the case.

For Embellishments we craft [Slimy Expulsion Boots](https://www.wowhead.com/ptr/item=193451/slimy-expulsion-boots), this will be combined with [Toxified Armor Patch](https://www.wowhead.com/ptr/item=193552/toxified-armor-patch) which increases the effect of the boots by 100%.
<br>Do note that Toxified can only be added to a crafted leather piece.
<br>**During Week 0 you can wait with crafting your first [Spark of Shadowflame](https://www.wowhead.com/ptr/item=204440/spark-of-shadowflame) item.**

### [Slimy Expulsion Boots:](https://www.wowhead.com/ptr/item=193451/slimy-expulsion-boots)

**If you have one [Spark of Ingenuity](https://www.wowhead.com/ptr/item=190453/spark-of-ingenuity) but no sockets for it, follow these steps:**

- Craft [Life-bound Bindings](https://www.wowhead.com/item=193419/life-bound-bindings?bonus=8840:8836:8902:1537&class=11&crafted-stats=49:36&crafting-quality=8&ilvl=418&spec=102) with [Toxified Armor Patch](https://www.wowhead.com/ptr/item=193552/toxified-armor-patch) at 418 ilvl. These will upgrade to 421 ilvl when Week 0 begins.
- During Week 0, obtain your first [Spark of Shadowflame](https://www.wowhead.com/ptr/item=204440/spark-of-shadowflame) and craft [Slimy Expulsion Boots:](https://www.wowhead.com/ptr/item=193451/slimy-expulsion-boots) if you haven't already.
- In Week 1, you won't receive any [Spark of Shadowflame](https://www.wowhead.com/ptr/item=204440/spark-of-shadowflame), but you should upgrade (recraft) your Slimy Expulsion Boots to 447 ilvl.
- During Week 2, use your second [Spark of Shadowflame](https://www.wowhead.com/ptr/item=204440/spark-of-shadowflame) to craft a 447 ilvl [Life-bound Belt](https://www.wowhead.com/item=193407/life-bound-belt?bonus=8840:8836:8902:1537&class=11&crafted-stats=49:36&crafting-quality=8&ilvl=447&spec=102) with [Toxified Armor Patch](https://www.wowhead.com/ptr/item=193552/toxified-armor-patch). Here you will want to replace your Wrists with 441 crested Wrists from m+ or raid.

**If you have one [Spark of Ingenuity](https://www.wowhead.com/ptr/item=190453/spark-of-ingenuity) and one socket for it, follow these steps:**

- Craft [Life-bound Bindings](https://www.wowhead.com/item=193419/life-bound-bindings?bonus=8840:8836:8902:1537&class=11&crafted-stats=49:36&crafting-quality=8&ilvl=418&spec=102) with [Toxified Armor Patch](https://www.wowhead.com/ptr/item=193552/toxified-armor-patch) at 418 ilvl and socket this piece. They will upgrade to 421 ilvl when Week 0 begins.
- During Week 0, obtain your first [Spark of Shadowflame](https://www.wowhead.com/ptr/item=204440/spark-of-shadowflame) and craft Slimy Expulsion Boots if you haven't already.
- In Week 1, you won't receive any [Spark of Shadowflame](https://www.wowhead.com/ptr/item=204440/spark-of-shadowflame), but you should upgrade (recraft) your Slimy Expulsion Boots to 447 ilvl.
- During Week 2, use your second [Spark of Shadowflame](https://www.wowhead.com/ptr/item=204440/spark-of-shadowflame) to craft a 447 ilvl [Primal Molten Spellblade](https://www.wowhead.com/item=190506/primal-molten-spellblade?bonus=8840:8836:8902:1537&class=11&crafted-stats=49:36&crafting-quality=8&ilvl=447&spec=102). With this, you'll want to Crest a M+ Offhand up to 441 ilvl.
- Keep your 421 Wrists until Week 4 of the raid.

If you loot a Mythic weapon or vault a weapon before you craft your second [Spark of Shadowflame](https://www.wowhead.com/ptr/item=204440/spark-of-shadowflame), use the first method (belt your second spark).
<br>If you loot socketed Wrists from M+ before you craft your second [Spark of Shadowflame](https://www.wowhead.com/ptr/item=204440/spark-of-shadowflame), use the first method (belt your second spark).


<div id="tier-set">

## [Tier Set](#tier-set)

T29 2PC: 2.6% DPS ST, 3.5% AoE 
<br>T29 2PC+4PC: 4% DPS ST, 5.5% AoE
<br>
<br>2PC+2PC: 6.7% DPS ST, 9.1% AoE
<br>
<br>T30 2PC: 4% DPS ST, 5.6% AoE
<br>T30 2PC+4PC: 10.1% DPS ST, 11.6% AoE
 
<br> This means that you won't break T29 4PC until you can equip 2PC+2PC or you looted a high itemlevel piece in two/three tierslots. (depending on how many of the T29 tierpieces you have)

</div>



<div id="trinkets">

## [Trinkets](#trinkets)

</div>

Obviously, just like before please use the Top Gear or Droptimizer options in [Raidbots](https://raidbots.com) in order to decide what trinkets to farm/use, but the following list should give you a good idea of some of the trinkets you will want to look out for. The list below assumes 441 ilvl on all of the trinkets, as you can upgrade everything with crests.

R1-9 = Raid boss number 1-9
<br>HTD = Healer Tank DPS
<br>D = Dungeon

### ST

- [Neltharion's Call to Suffering](https://www.wowhead.com/ptr/item=204211/neltharions-call-to-suffering) (R8)
- [Igneous Flowstone](https://www.wowhead.com/ptr/item=203996/igneous-flowstone) (R7)
- [Ominous Chromatic Essence](https://www.wowhead.com/ptr/item=203729/ominous-chromatic-essence) (R3) - (mastery, 4 other)
- [Vessel of Searing Shadow](https://www.wowhead.com/ptr/item=202615/vessel-of-searing-shadow) (R2) - mostly st
- [Screaming Black Dragonscale](https://www.wowhead.com/ptr/item=202612/screaming-black-dragonscale)(R1)
- [Spoils of Neltharus](https://www.wowhead.com/ptr/item=193773/spoils-of-neltharus) (D) - +burst
- [Whispering Incarnate Icon](https://www.wowhead.com/ptr/item=194301/whispering-incarnate-icon) - (HTD)
- [Idol of Pure Decay](https://www.wowhead.com/ptr/item=193660/idol-of-pure-decay) (D) - pure st
- [Irideus Fragment](https://www.wowhead.com/ptr/item=193743/irideus-fragment) (D) - +burst
- [Ominous Chromatic Essence](https://www.wowhead.com/ptr/item=203729/ominous-chromatic-essence) (R3) - (mastery, 0 other)
- [Whispering Incarnate Icon](https://www.wowhead.com/ptr/item=194301/whispering-incarnate-icon) (DPS)

### AoE

- [Neltharion's Call to Suffering](https://www.wowhead.com/ptr/item=204211/neltharions-call-to-suffering) (R8)
- [Igneous Flowstone](https://www.wowhead.com/ptr/item=203996/igneous-flowstone) (R7)
- [Ominous Chromatic Essence](https://www.wowhead.com/ptr/item=203729/ominous-chromatic-essence) (R3) - (mastery, 4 other)
- [Spoils of Neltharus](https://www.wowhead.com/ptr/item=193773/spoils-of-neltharus) (D) - +burst
- [Screaming Black Dragonscale](https://www.wowhead.com/ptr/item=202612/screaming-black-dragonscale) (R1)
- [Ominous Chromatic Essence](https://www.wowhead.com/ptr/item=203729/ominous-chromatic-essence) (R3) - (mastery, 0 other)
- [Irideus Fragment](https://www.wowhead.com/ptr/item=193743/irideus-fragment) (D) - +burst
- [Vessel of Searing Shadow](https://www.wowhead.com/ptr/item=202615/vessel-of-searing-shadow) (R2) - mostly st
- [Whispering Incarnate Icon](https://www.wowhead.com/ptr/item=194301/whispering-incarnate-icon) - (HTD)
- [Idol of Pure Decay](https://www.wowhead.com/ptr/item=193660/idol-of-pure-decay) (D) - pure st




<div id="misc">

# [6. Miscellaneous:](#misc)

</div>


<div id="snapshot">

## [Do our dots snapshot?](#snapshot)

</div>

No, all of our periodic damage (like {{< spell 8921 "Moonfire" >}}, {{< spell 93402 "Sunfire" >}}, {{< spell 202347 "Stellar Flare " >}}) does NOT snapshot, everything is dynamic. That means any dots gain/lose the damage bonus upon entering/leaving the Eclipse that buffs them and whenever any other stat/damage increases are applied/expire.




<div id="owlkin-frenzy">

## [How do I use Owlkin Frenzy procs?](#owlkin-frenzy)

</div>

When Lunar Eclipse is active use {{< spell 157228 "Owlkin Frenzy" >}} procs as soon as possible. When ONLY Solar Eclipse(should currently never be the case) is active, use it when fighting 3+ targets or when you need to move. Otherwise let it expire.





<div id="astral-damage">
 
## [What is Astral damage?](#astral-damage)

</div>

Astral damage is Arcane and Nature damage at the same time meaning that these spells benefit from effects that buff either spell school and get increased by both type of boosts multiplicatively. Mind that class buffs only affect class spells so if a trinket does nature or arcane damage they are not affected by our buffs to these spell classes.


<div id="macros">

## [Macros](#macros)

</div>

**Orbital Strike macro:**

```
#showtooltip
/cast [@cursor] Celestial Alignment
```

<div id="sims">

# [7. Sims:](#sims)

</div>

[Embells 1T](https://www.dreamgrove.gg/balance/sims/embells_1T_10.1.html)
<br>[Embells 6T](https://www.dreamgrove.gg/balance/sims/embells_6T_10.1.html)
<br>[Phials 1T](https://www.dreamgrove.gg/balance/sims/phial_1T_10.1.html)
<br>[Phials 4T](https://www.dreamgrove.gg/balance/sims/phial_4T_10.1.html)
<br>[Runes](https://www.dreamgrove.gg/balance/sims/runes_1T_10.1.html)
<br>[Pulsar proccing](https://www.dreamgrove.gg/balance/sims/pulsar_proc_10.1.html)
<br>[WoE usage](https://www.dreamgrove.gg/balance/sims/woe_usage_10.1.html)
<br>[Which Eclipse to enter 2T Rattle](https://www.dreamgrove.gg/balance/sims/eclipse_2T_rattle_10.1.html)
<br>[Which Eclipse to enter 2T Weaver](https://www.dreamgrove.gg/balance/sims/eclipse_2T_weaver_10.1.html)
<br>[Racials 1T](https://www.dreamgrove.gg/balance/sims/racials_1T_10.1.html)
<br>[Racials 6T](https://www.dreamgrove.gg/balance/sims/racials_6T_10.1.html)
<br>[Solar vs Lunar with WoE](https://www.dreamgrove.gg/balance/sims/solar_vs_lunar_woe.html)
<br>[Solar vs Lunar with WoE with less haste](https://www.dreamgrove.gg/balance/sims/solar_vs_lunar_woe_3k_haste.html)
<br>[Item strings for simming](https://www.dreamgrove.gg/balance/sims/items.txt)
 
<script>const whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true};</script>
<script src="https://wow.zamimg.com/js/tooltips.js"></script>
