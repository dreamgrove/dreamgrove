---
date: '2023-05-09'
authors: ["Chicken, Jundarer, Dsune"]
published: true
patch: "10.1.5"
title: Balance Druid 10.1.5 Compendium
showOnFrontpage: true
sidebarTitle: "Quicklinks"
sidebarContents:  |
  **[1. News](#news)**
 
  **[2. Rotation](#rotation)**
  <br>[Precasting](#precast)
  <br>[Single Target priority](#st)
  <br>[AoE priority](#aoe)
  <br>[Filler Priority Inside CA/Inc](#filler)
  <br>[Eclipses and Fillers Outside CA/Inc](#eclipse)
  <br>[How to Use Warrior of Elune](#woe)
  <br>[How to use Wild Mushrooms and how they work](#mushroom)
 
  **[3. Talents](#talents)**
 
  **[4.Consumables](#consumables)**
  <br>[Potions](#potions)
  <br>[Food](#food)
  <br>[Phials](#phials)
  <br>[Runes](#runes)
 
  **[5. Gearing](#gearing)**
  <br>[Stats](#stats)
  <br>[Enchants](#enchants)
  <br>[Embellishments](#embellishments)
  <br>[Tier Set](#tier-set)
  <br>[Trinkets](#trinkets)
  
  **[6. Miscellaneous](#misc)**
  <br>[Do our dots snapshot?](#snapshot)
  <br>[What is Astral damage?](#astral-damage)
  <br>[How do I use Owlkin Frenzy procs?](#owlkin-frenzy)
  <br>[Macros](#macros)
  <br>[Useful WeakAura(s)](#wa)
  <br>[Cancelaura Macros](#cancel)
  
  **[7. Sims](#sims)**
 
---

<div style="background-color: #f0f0f0; padding: 10px; text-align: center;">
  <a href="URL1" style="margin: 0 15px; text-decoration: none; color: #333;">Home</a> |
  <a href="URL2" style="margin: 0 15px; text-decoration: none; color: #333;">About</a> |
  <a href="URL3" style="margin: 0 15px; text-decoration: none; color: #333;">Contact</a>
</div>


[Changelog](https://github.com/dreamgrove/dreamgrove/commits/master/content/balance/Compendium.md)

<div id="news">

# [1. News:](#news)

</div>

## [10.1.5 News](https://www.dreamgrove.gg/balance/compendium_news/)
In the above link, you will find a summary of the changes in Patch 10.1.5 including new talents, fixes, and balance changes that have been implemented in the latest patch along with some thoughts about the effect on gameplay.

<div id="rotation">
 
# [2.Rotation:](#rotation)

</div>

<div id="precast">

## [Precasting](#precast)

</div>

**Precasting:**
- Cast {{< spell 190984 "Wrath" >}} twice
- Cast {{< spell 202347 "Stellar Flare" >}}
- Cast {{< spell 194153 "Starfire" >}} if {{< spell 202347 "Stellar Flare" >}} is not talented. If you have to stand close enough so that Starfire will finish casting long after the boss is pulled, cast another {{< spell 190984 "Wrath" >}} instead.

You can precast from max range about 4 seconds before a boss is pulled.

**What is a priority list?**

When reading the priority lists below, you should not think about these as steps to follow in a specific order. At any given point in combat, you should cast the first thing in the list that you are able to cast. As such, you will note that there are some spells included in the priority lists below that are not chosen as talents in the recommended build. This is not a mistake, but simply indicates the priority of that spell IF you happened to take it for whatever reason. The presence of a spell in a priority list does not mean that you should be talenting into or using that spell, these lines are simply there for completeness. If the length of these lists feels daunting, one might recommend copying them to a separate document and removing lines that do not apply to you, thus making the list a bit more compact.

<div id="st">

## [Single Target priority](#st)

</div>

**Single Target priority list:**
- Keep up {{< spell 8921 "Moonfire" >}}, {{< spell 93402 "Sunfire" >}} and {{< spell 202347 "Stellar Flare" >}} and refresh within pandemic (30% of base duration) inside Eclipse and if they would expire otherwise outside Eclipse.
- Use {{< spell 190984 "Wrath" >}} to enter Lunar Eclipse if one of the following conditions are met:
    - You have 520 Astral Power or more towards {{< spell 393961 "Pulsar" >}}.
    - The cooldown of {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} has less than 5 seconds remaining.
- Use {{< spell 202425 "Warrior of Elune" >}} if your eclipse is about to end and you will enter Solar Eclipse next.
- Use {{< spell 194153 "Starfire" >}} to enter Solar Eclipse.
- Use {{< spell 191034 "Starfall" >}} if you have 550 Astral Power or more towards {{< spell 393961 "Primordial Arcanic Pulsar" >}}, you have a {{< spell 393942 "Starweaver's Warp" >}} proc and you are not in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} already.
- Use {{< spell 194223 "Celestial Alignment" >}} or {{< spell 102560 "Incarnation" >}} if you are not in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} already.
- Use {{< spell 391528 "Convoke the Spirits" >}} when below 40 AP if you are inside {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}}, or if your next <br>{{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} window is 30 or more seconds away and your Eclipse will last for more than 4 seconds.
- Use {{< spell 400636 "Astral Communion" >}} if you will not overcap on AP.
- Use {{< spell 205636 "Force of Nature" >}} if you will not overcap on AP.
- Use {{< spell 211545 "Fury of Elune" >}} if you are in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}}, will proc {{< spell 393961 "Primordial Arcanic Pulsar" >}} with your next GCD or are at less than 280 {{< spell 393961 "Primordial Arcanic Pulsar" >}} stacks.
- Use {{< spell 191034 "Starfall" >}} if you have a {{< spell 393942 "Starweaver's Warp" >}} proc.
- Use {{< spell 78674 "Starsurge" >}} if {{< spell 202345 "Starlord" >}} has less than 3 stacks and if talented you can optimally refresh the {{< spell 393954 "Rattle the Stars" >}} buff.
- Use {{< spell 274281 "New -" >}}{{< spell 202768 "Half-" >}} and {{< spell 202771 "Full Moon" >}} if all of the following conditions is met:
  - You will not overcap on AP.
  - You can finish the cast before your current eclipse ends.
  - You are in CA/Inc or you're about to cap on charges and Pulsar has 520 or fewer stacks and the cooldown of CA/Inc is longer than 10 seconds. 
- Use your macro to cancel Starlord as referenced [here](#cancel). This is not necessary if you do not want to use a cancelaura macro, but does represent a minor gain.
- Use {{< spell 78674 "Starsurge" >}} if one of the following conditions is met: 
    - You would overcap AP with the next cast.
    - You have a {{< spell 393944 "Starweaver's Weft" >}} proc.
    - Solar or Lunar Eclipse will end in the next 4 seconds and you have above 70 AP.
- Use {{< spell 88747 "Wild Mushroom" >}} on cooldown.
- Use {{< spell 190984 "Wrath" >}} regardless of which Eclipse you are in.

<div id="aoe">

## [AoE priority](#aoe)

</div>

**AoE priority list(2+ targets):**

**Special Note: when NOT using the talents {{< spell 327541 "Aetherial Kindling" >}} and {{< spell 393940 "Starweaver" >}}, use Starsurge as a filler on 2 targets still.**
- Use {{< spell 93402 "Sunfire" >}} if the targets will live for 6 or more seconds and you will hit all targets with it. Otherwise, wait with this until they are gathered.
- Use {{< spell 8921 "Moonfire" >}} if the target(s) will live for 6 or more seconds and you will not overcap on AP.
- Use your macro to cancel Starlord as referenced [here](#cancel). This is not necessary if you do not want to use a cancelaura macro, but does represent a minor gain.
- Use {{< spell 191034 "Starfall" >}} if you would overcap Astral Power with your next cast. 
- Use {{< spell 202425 "Warrior of Elune" >}} if available.
- Use {{< spell 194153 "Starfire" >}} to enter Solar Eclipse if you are fighting 2 targets.
- Use {{< spell 190984 "Wrath" >}} to enter Lunar Eclipse if you are fighting 3+ targets.
- Use {{< spell 202347 "Stellar Flare" >}} if the target will live for at least 8s+1s per target that {{< spell 194153 "Starfire" >}} can hit and you will not overcap on AP. This means that you should apply some Flares before using cooldowns until you would cap AP or have to start moving, usually around 2-4 depending on starting AP
- Use {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} if you are not in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} already.
- Use {{< spell 88747 "Wild Mushroom" >}} if you will not overcap on AP. If using {{< spell 392999 "Fungal Growth" >}} and {{< spell 393956 "Waning Twilight" >}}, avoid using it if the debuff is already up.
- Use {{< spell 211545 "Fury of Elune" >}} if you are in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}}, will proc {{< spell 393961 "Primordial Arcanic Pulsar" >}} with your next GCD or are at less than 280 {{< spell 393961 "Primordial Arcanic Pulsar" >}} stacks.
- Use {{< spell 191034 "Starfall" >}} if one of the following conditions is met:
    - You have a {{< spell 393942 "Starweaver's Warp" >}} proc.
    - {{< spell 202345 "Starlord" >}} is below 3 stacks.
- Use {{< spell 202771 "Full Moon" >}} if all of the following conditions is met:
  - You will not overcap on AP.
  - You can finish the cast before your current eclipse ends.
  - You are in CA/Inc or you're about to cap on charges and Pulsar has 520 or fewer stacks and the cooldown of CA/Inc is longer than 10 seconds. 
- Use {{< spell 78674 "Starsurge" >}} if you have a {{< spell 393944 "Starweaver's Weft" >}} proc and you are fighting less than 3 targets.
- Use {{< spell 202347 "Stellar Flare" >}} if the target will live for at least 8s+1s per target that {{< spell 194153 "Starfire" >}} can hit and you will not overcap on AP. Don't use this above 11 targets -1 per talent in Umbral Intensity or Astral Smolder.
- Use {{< spell 400636 "Astral Communion" >}} if you will not overcap on AP.
- Use {{< spell 391528 "Convoke the Spirits" >}} if {{< spell 194153 "Starfire" >}} would only hit 2 targets, otherwise only use {{< spell 391528 "Convoke" >}} for movement in AoE.
- Use {{< spell 274281 "New Moon" >}} if you will not overcap on AP.
- Use {{< spell 202768 "Half Moon" >}} if you will not overcap on AP and you can finish the cast before your current eclipse ends.
- Use {{< spell 205636 "Force of Nature" >}} if you will not overcap on AP.
- Use {{< spell 78674 "Starsurge" >}} if you have a {{< spell 393944 "Starweaver's Weft" >}} proc and {{< spell 194153 "Starfire" >}} will hit less than 17 targets.
- Use {{< spell 194153 "Starfire" >}} if any of the below conditions are true:
   - You are in Lunar Eclipse.
   - You are in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} and {{< spell 194153 "Starfire" >}} will hit 4 or more targets.
- Use {{< spell 194153 "Wrath" >}} if any of the below conditions are true:
   - You are in Solar Eclipse.
   - You are in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} and {{< spell 194153 "Starfire" >}} will hit 3 or less targets.


<div id="filler">

## [Filler Priority Inside CA/Inc](#filler)

</div>

Inside of {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} your fillers will be {{< spell 190984 "Wrath" >}} on 3 targets or less and {{< spell 194153 "Starfire" >}} on 4 or more targets.
 

<div id="eclipse">

## [Eclipses and Fillers Outside CA/Inc](#eclipse)
 
 </div>

 With the change to [Nature's Grace](https://www.wowhead.com/spell=393958/natures-grace) there is no longer any benefit to first enter eclipse before you use {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} but rather if possible try to time it with exiting an eclipse.
 
 - On 1-2 targets, enter Solar Eclipse and cast  {{< spell 190984 "Wrath" >}}.
 - On 3 or more targets, enter Lunar Eclipse and cast {{< spell 194153 "Starfire" >}}.


<div id="woe">

## [How to Use Warrior of Elune](#woe)
 
 </div>
 
{{< spell 202425 "Warrior of Elune" >}} is an off-gcd ability, making your next 3 {{< spell 194153 "Starfires" >}} instant for 25 seconds. The ability has a 45s cooldown that starts once you've pressed it. 

<br>Use the charges to enter Solar Eclipse or as a movement GCD in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}}/Lunar Eclipse.
 
 <div id="mushroom">

## [How to use Wild Mushrooms and how they work](#mushroom)
 
</div>

{{< spell 88747 "Wild Mushroom" >}} deals damage in an explosion and then applies a DOT  called {{< spell 392999 "Fungal Growth" >}}(if talented). This DOT lasts for 8 seconds and deals 70% of the explosions damage over the course of its duration. {{< spell 88747 "Wild Mushroom" >}} has 3 charges, so if all 3 charges are used in quick succession and each apply a dot dealing 1000 damage, the total damage dealt by the DOT would be 3000 (1000 damage x 3 charges), and the duration of the DOT would be refreshed to 8 seconds.

This type of DOT is often called "Ignite" based on a Mage spell working this exact way. You don't lose/gain any Fungal Growth damage by staggering them or pressing them all at once.

On single target, it's best to use all 3 charges at once paired with any available buffs such as potion, trinkets and Inc. {{< spell 88747 "Wild Mushroom" >}} is also an instant GCD, so it can be used for movement as needed.

In AoE scenarios, you can use the charges all at once for a quick burst of damage or stagger them to get {{< spell 393956 "Waning Twilight" >}} up.


<div id="talents">

# [3.Talents:](#talents)

</div>

## Talents for different target counts
[Single target](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikIFhWiDkIJKJaSOQI0SaJhIaAUAAA?bgcolor=000000)
<br>[M+ Talents Weaver](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkAkkIJSBaJSSSiSSI5AhQLpEhIKAUoBQA?bgcolor=000000)
<br>[M+ Talents Rattle](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkAkkIJSBaJSSSiSSI5AhQLpEhIaAUoBQA?bgcolor=000000)
<br>[Sustained AoE](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkAkkIJSBaJSSSiiEiDkIRLRESCAUoBQA?bgcolor=000000)


## Raid Talents
[Pure single target(Kazzara, Amalgation no cleave, Rashok, Magmorax)](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikIFhWiDkIJKJaSOQI0SaJhIaAUAAA?bgcolor=000000)
<br>[Two target cleave(Experiments Mythic)](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikIFHgWiDkIJKJaSOQI0SKJhIaAUAAB?bgcolor=000000)
<br>[Amalgamation with cleave](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikIFhWiDkkkoEhkDECtkWSIiGAFAA?bgcolor=000000)
<br>[Sustained AoE with ST(Assault of the Zaqali, Zskarn)](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikIFHgWiDkkkokESOQI0SKRIiGAFAQA?bgcolor=000000)
<br>[Single target with burst AoE(Echo of Neltharion, Sarkareth)](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikIFHgWiDkkkokoJ5AhQLpEhIaAUAAB?bgcolor=000000)
<br>[Echo of Neltharion Mythic](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikcgUgWiDkkkokoJ5AhQLpEhIaAUAAB?bgcolor=000000)
<br>You can also use 2/2 Ursing Vigor when you don't need the Stampeding Roar CDR. The extra HP can be useful to survive bomb overlaps. Warrior of Elune can also be used for movement when you get a bomb.
<br>[Mythic Sarkareth](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikIFHgWiDkIJKJaSOQI0SKJhIaAUAAB?bgcolor=000000)
<br>From a progression perspective it is better to single target down the big add, if your guild is having trouble killing the adds you could swap Warrior of Elune to Starfall instead.

## Dungeon Talents
The following are dungeon talent builds that will always serve you well but mind that there can be some variations based on your group comp or affixes.
  
[Cookie cutter Rattle every dungeon build](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCQkkIikkAkESiUgWiDkkkokESOQI0SKRIiGAFAQA?bgcolor=000000)
<br>[Same build with Weaver for some dungeons](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCQkkIikkAkESiUgWiDkkkokESOQI0SKRIiCAFAQA?bgcolor=000000)
The difference between Rattle and Weaver for overall damage is generally very low. Rattle is better for both sustained single-target damage and sustained AoE damage. Weaver is better when you have a lot of packs where you want to focus a specific mob which happens relatively often. A prime example of this is Vortex Pinnacle but there are situations like that in nearly every dungeon. What the truly better talent is depends on your group comp(how much focus damage already exists) and route but neither will make or break your damage. In fact, sims show that the overall dps difference between them is within ~0.5% in basically every dungeon.

<br>[Cookie cutter with Hibernate for Incorporeal](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJJCSCQSikcgUgWiDkkkokESOQI0SKRIiGAFAQA?bgcolor=000000)
<br>[If you really need both hibernate and decurse](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCQkkkISSAkESiUgWiDkkkokESOQI0SKRIiGAFAQA?bgcolor=000000)
<br>[Lunar Shrapnel build for more AoE](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJJCSCQSikcgUgWiDkkkDokESOQI0SKRIJaAUAAB?bgcolor=000000)
### Dungeon Druid Tree Considerations
  
- Ursine Vigor, Well-Honed Instincts and Improved Stampeding Roar are the major competing talents. Ursine Vigor should be taken if you need it to survive certain abilities. Well-Honed Instincts is always on 1 point but a 2nd can be taken if you rarely/never use Bear Form. Improved Stampeding Roar is extremely useful in indoor dungeons and in spiteful weeks.
- Remove Corruption should be taken in Afflicted weeks and can be taken in every dungeon except Vortex Pinnacle if your group is lacking decurse/poison dispel.
- Cyclone has basically no use other than stopping Bursting and can be replaced with anything else(which also won't have any use).
- Hibernate can be used for the Incorporeal affix.
- For lower keys, you can put 1 point into Feline Swiftness like [this](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikIFHgWiDAAAAAAAAAQA?bgcolor=000000). This skips Ursine Vigor and Typhoon.
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


[Grand Banquet of the Kalu'ak](https://www.wowhead.com/item=197794/grand-banquet-of-the-kaluak), or [Deviously Deviled Eggs](https://www.wowhead.com/item=204072/deviously-deviled-eggs) giving the same buff with a cheaper individual price.


<div id="phials">

## [Phials](#Phials)

</div>

**ST**

Damage wise, with 100% uptime on all of the Phials and not counting in the downsides their hierarchy is as follows on ST:

- [Iced Phial of Corrupting Rage](https://www.wowhead.com/item=191329/iced-phial-of-corrupting-rage): Default phial unless the fight has too high damage intake or you are at risk of dying.
- [Phial of Static Empowerment](https://www.wowhead.com/item=191338/phial-of-static-empowerment): Has ~92% of the value of Corrupting Rage Phial at 100% uptime.
- [Phial of Charged Isolation](https://www.wowhead.com/item=191332/phial-of-charged-isolation): Has ~90% of the value of Corrupting Rage Phial at 100% uptime.
- [Phial of Elemental Chaos](https://www.wowhead.com/item=191359/phial-of-elemental-chaos): Has the same value as Corrupting Rage at 60% uptime. 
- [Phial of Tepid Versatility](https://www.wowhead.com/item=191341/phial-of-tepid-versatility): Same as the Elemental one, only that vers is more often better during progress than the random stats because of the DR it provides.
- [Phial of Glacial Fury](https://www.wowhead.com/item=191335/phial-of-glacial-fury): This Phial should never be used.

**AoE**:

The priority is the same as it is on ST.


<div id="runes">

## [Runes](#Runes)

</div>

Generally, you will want to use either [Howling Rune](https://www.wowhead.com/item=194820/howling-rune) or [Hissing Rune](https://www.wowhead.com/item=204973/hissing-rune), sim your character for the most accurate answer.


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


<div id="embellishments">

## [Embellishments](#embellishments)

</div>

For Embellishments we craft [Toxic Thorn Footwraps](https://www.wowhead.com/item=193452/toxic-thorn-footwraps), this will be combined with [Toxified Armor Patch](https://www.wowhead.com/item=193552/toxified-armor-patch) which increases the effect of the boots by 100%. The proc effect on Toxic Thorn Footwraps can also proc a heal when actively healing. There are some effects like [Vessel of Searing Shadow](https://www.wowhead.com/item=202615/vessel-of-searing-shadow) and [Frenzied Regeneration](https://www.wowhead.com/spell=22842/frenzied-regeneration) that proc the heal as well which slightly reduces its value. Another consideration is that the [Toxic Thorn Footwraps](https://www.wowhead.com/item=193452/toxic-thorn-footwraps) reduce your maximum HP by about 4.4k which will make you slightly squishier but nonetheless, they are the biggest dps upgrade by a fair margin.
<br>Do note that Toxified can only be added to a crafted leather piece.

**Crafting order**

- [Toxic Thorn Footwraps](https://www.wowhead.com/item=193452/toxic-thorn-footwraps)
- [Life-bound Belt](https://www.wowhead.com/item=193407/life-bound-belt?bonus=8840:8836:8902:1537&class=11&crafted-stats=49:36&crafting-quality=8&ilvl=447&spec=102) or [Life-bound Trousers](https://www.wowhead.com/item=193408/life-bound-trousers?bonus=8840:8836:8902:1537&class=11&crafted-stats=49:36&crafting-quality=8&ilvl=447&spec=102) with [Toxified Armor Patch](https://www.wowhead.com/item=193552/toxified-armor-patch)
- Sim yourself for all non-embellished crafts on [Raidbots](https://www.raidbots.com/simbot/droptimizer) 

<div id="tier-set">

## [Tier Set](#tier-set)

T30 2PC: 3.8% DPS ST, 5.5% AoE
<br>T30 2PC+4PC: 9.4% DPS ST, 11.3% AoE

</div>



<div id="trinkets">

## [Trinkets](#trinkets)

</div>

Please use Top Gear or Droptimizer on [Raidbots](https://raidbots.com) in order to decide what trinkets to farm/use, but the following list should give you a good idea of some of the trinkets you will want to look out for. The list below assumes 441 ilvl on all of the trinkets, as you can upgrade everything with crests.

R1-9 = Raid boss number 1-9
<br>HTD = Healer Tank DPS
<br>D = Dungeon

### ST

- [Mirror of Fractured Tomorrows](https://www.wowhead.com/ptr-2/item=207581/mirror-of-fractured-tomorrows?bonus=6652:8783:8784:9414:9415:1492:9334&class=11&ilvl=441&spec=102) (D)
- [Neltharion's Call to Suffering](https://www.wowhead.com/item=204211/neltharions-call-to-suffering) (R8)
- [Ominous Chromatic Essence](https://www.wowhead.com/item=203729/ominous-chromatic-essence) (R3) - (mastery, 4 other)
- [Spoils of Neltharus](https://www.wowhead.com/item=193773/spoils-of-neltharus) (D) - +burst
- [Vessel of Searing Shadow](https://www.wowhead.com/item=202615/vessel-of-searing-shadow) (R2) - high uptime on haste
- [Screaming Black Dragonscale](https://www.wowhead.com/item=202612/screaming-black-dragonscale)(R1)
- [Igneous Flowstone](https://www.wowhead.com/item=203996/igneous-flowstone) (R7)
- [Whispering Incarnate Icon](https://www.wowhead.com/item=194301/whispering-incarnate-icon) - (HTD)
- [Idol of Pure Decay](https://www.wowhead.com/item=193660/idol-of-pure-decay) (D) - pure st
- [Irideus Fragment](https://www.wowhead.com/item=193743/irideus-fragment) (D) - +burst
- [Ominous Chromatic Essence](https://www.wowhead.com/item=203729/ominous-chromatic-essence) (R3) - (mastery, 0 other)
- [Whispering Incarnate Icon](https://www.wowhead.com/item=194301/whispering-incarnate-icon) (DPS)

### AoE

- [Mirror of Fractured Tomorrows](https://www.wowhead.com/ptr-2/item=207581/mirror-of-fractured-tomorrows?bonus=6652:8783:8784:9414:9415:1492:9334&class=11&ilvl=441&spec=102) (D)
- [Neltharion's Call to Suffering](https://www.wowhead.com/item=204211/neltharions-call-to-suffering) (R8)
- [Ominous Chromatic Essence](https://www.wowhead.com/item=203729/ominous-chromatic-essence) (R3) - (mastery, 4 other)
- [Vessel of Searing Shadow](https://www.wowhead.com/item=202615/vessel-of-searing-shadow) (R2) - high uptime on haste
- [Spoils of Neltharus](https://www.wowhead.com/item=193773/spoils-of-neltharus) (D) - +burst
- [Screaming Black Dragonscale](https://www.wowhead.com/item=202612/screaming-black-dragonscale) (R1)
- [Whispering Incarnate Icon](https://www.wowhead.com/item=194301/whispering-incarnate-icon) - (HTD)
- [Ominous Chromatic Essence](https://www.wowhead.com/item=203729/ominous-chromatic-essence) (R3) - (mastery, 0 other)
- [Igneous Flowstone](https://www.wowhead.com/item=203996/igneous-flowstone) (R7)
- [Irideus Fragment](https://www.wowhead.com/item=193743/irideus-fragment) (D) - +burst
- [Idol of Pure Decay](https://www.wowhead.com/item=193660/idol-of-pure-decay) (D) - pure st




<div id="misc">

# [6. Miscellaneous:](#misc)

</div>


<div id="snapshot">

## [Do our dots snapshot?](#snapshot)

</div>

No, all of our periodic damage (like {{< spell 8921 "Moonfire" >}}, {{< spell 93402 "Sunfire" >}}, {{< spell 202347 "Stellar Flare " >}}) do NOT snapshot, everything is dynamic. That means any dots gain/lose the damage bonus upon entering/leaving the Eclipse that buffs them and whenever any other stat/damage increases are applied/expire.




<div id="owlkin-frenzy">

## [How do I use Owlkin Frenzy procs?](#owlkin-frenzy)

</div>

Use {{< spell 157228 "Owlkin Frenzy" >}} procs to enter Solar Eclipse, inside Lunar Eclipse or inside {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} if starfire will hit 3 or more targets.
<br>Keep in mind that {{< spell 202425 "Warrior of Elune" >}} charges are consumed before {{< spell 157228 "Owlkin Frenzy" >}} procs.





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
</div>

**Trinket macro:**

If you are using an on-use trinket that should go along with your cooldowns, use the following macro (/13 for top trinket slot, and /14 for bottom trinket slot) 
```
#showtooltip
/use 13
/use 14
/cast [@cursor] Celestial Alignment
```

<div id="wa">
 
## [Useful WeakAura(s)](#wa)
 
</div>

### **Casts until you can cast Starfire**
[Starfire Alerter](https://wago.io/rrtAyRQjF)
See the description of the WA for more details. This is not a required WA but will make it easier to not get into situations where you are wasting a Starfire cast inside Solar Eclipse.

<div id="cancel">
 
## [Cancelaura Macros](#cancel)
 
</div>

### **Cancelling Pulsar**

It can be a minor gain to cancel Pulsar **ONCE** in the opener in order to not proc pulsar in your first Incarnation. The value of when to cancel fully depends on your haste and whether you are Bloodlusting. It will likely have to be determined on a per-boss basis as well due to different timings and boss mechanics. Additionally it only really works if you are consistently doing the same thing. If forced downtime makes you not proc pulsar in Incarnation naturally it would be for nothing.
You can add these copies below your character in the advanced section of Raidbots to check what is optimal for your character in a 0 downtime scenario by using [this link](https://gist.github.com/Dsune0/09c4dbf51d381a93aa1158fd9a9da8e9).

```
#showtooltip
/cancelaura Primordial Arcanic Pulsar
```

### **Cancelling Starlord**

For the past few expansions, cancelling your Starlord aura has been something that has been deemed too insignificant to matter even for most min-maxing purposes. However, cancelling the Starlord aura at the proper time is now representing a minor but significant gain, which can be seen in the [sims section](#sims). Essentially, you should aim to cancel Starlord at any point in an Eclipse window where the buff is currently at less than two seconds, and you are about to use {{< spell 78674 "Starsurge" >}} to prevent overcapping.

```
#showtooltip
/cancelaura Starlord
```

<div id="sims">

# [7. Sims:](#sims)

</div>

[Embells 1T](https://www.dreamgrove.gg/balance/sims/embells_1T_10.1.html)
<br>[Embells 6T](https://www.dreamgrove.gg/balance/sims/embells_6T_10.1.html)
<br>[Phials 1T](https://www.dreamgrove.gg/balance/sims/phial_1T_10.1.html)
<br>[Phials 6T](https://www.dreamgrove.gg/balance/sims/phial_6T_10.1.html)
<br>[Runes 1T](https://www.dreamgrove.gg/balance/sims/runes_1T_10.1.html)
<br>[Runes 6T](https://www.dreamgrove.gg/balance/sims/runes_6T_10.1.html)
<br>[Racials 1T](https://www.dreamgrove.gg/balance/sims/racials_1T_10.1.html)
<br>[Racials 6T](https://www.dreamgrove.gg/balance/sims/racials_6T_10.1.html)
<br>[Tierset 1T](https://www.dreamgrove.gg/balance/sims/tierset_1T_10.1.html)
<br>[Tierset 6T](https://www.dreamgrove.gg/balance/sims/tierset_6T_10.1.html)

[Pulsar proc Starfall vs Starsurge](https://www.dreamgrove.gg/balance/sims/pulsar_proc_10.1.html)
<br>[WoE Usage](https://www.dreamgrove.gg/balance/sims/woe_usage_10.1.html)

[Which Eclipse to enter 1T Rattle](https://www.dreamgrove.gg/balance/sims/eclipse_rattle_1T_10.1.html)
<br>[Which Eclipse to enter 1T Weaver](https://www.dreamgrove.gg/balance/sims/eclipse_weaver_1T_10.1.html)
<br>[Which Eclipse to enter 2T Rattle](https://www.dreamgrove.gg/balance/sims/eclipse_rattle_2T_10.1.html)
<br>[Which Eclipse to enter 2T Weaver](https://www.dreamgrove.gg/balance/sims/eclipse_weaver_2T_10.1.html)
<br>[Which Eclipse to enter 3T Rattle](https://www.dreamgrove.gg/balance/sims/eclipse_rattle_3T_10.1.html)
<br>[Which Eclipse to enter 3T Weaver](https://www.dreamgrove.gg/balance/sims/eclipse_weaver_3T_10.1.html)
<br>[Which Eclipse to enter 4T Rattle](https://www.dreamgrove.gg/balance/sims/eclipse_rattle_4T_10.1.html)
<br>[Which Eclipse to enter 4T Weaver](https://www.dreamgrove.gg/balance/sims/eclipse_weaver_4T_10.1.html)
 
[Cancelling Pulsar in the opener](https://www.dreamgrove.gg/balance/sims/cancel_pulsar_1T_10.1.html)

[Cancelling Starlord](https://www.dreamgrove.gg/balance/sims/cancel_starlord_1T_10.1.html)

[Item strings/Bonus IDs for simming](https://www.dreamgrove.gg/balance/sims/items.txt)
 
<script>const whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true};</script>
<script src="https://wow.zamimg.com/js/tooltips.js"></script>
