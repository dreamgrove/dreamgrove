---
date: '2022-10-25'
authors: ["Chicken, Jundarer, Dsune"]
published: yes
patch: "10.0"
title: Balance Druid 10.0 Compendium
showOnFrontpage: true
sidebarTitle: "Quicklinks"
sidebarContents:  |
  [1. News](#news)
 
  [2. Rotation](#rotation)
  <br>[What is my Single Target rotation?](#st)
  <br>[What is my AoE priority?](#aoe)
  <br>[What is my filler priority inside CA?](#filler)
  <br>[Why do we proc pulsar with starfall?](#pulsar)
 
  [3. Talents](#talents)
 
  [4.Consumables](#consumables)
  <br>[Potions](#potions)
  <br>[Food](#food)
  <br>[Phials](#phials)
  <br>[Runes](#runes)
 
  [5. Gearing](#gearing)
  <br>[Stats](#stats)
  <br>[Enchants](#enchants)
  <br>[Embellishments](#embellishments)
  <br>[Tier Set](#tier-set)
  <br>[Trinkets](#trinkets)
  <br>[Gearing Advice](#gearing-advice)
  
  [6. Miscellaneous](#misc)
  <br>[Do our dots snapshot?](#snapshot)
  <br>[What is Astral damage?](#astral-damage)
  <br>[How do I use Owlkin Frenzy procs?](#owlkin-frenzy)
  <br>[Macros](#macros)
 
  [7. Utility](#utility)
 
---
<script>const whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true};</script>
<script src="https://wow.zamimg.com/js/tooltips.js"></script>

<details>
<summary>Changelog</summary>
  
  + 2022-11-26:
  <br>Added: The document
  
 
</details>
   
<div id="news">

# [1. News:](#news)

</div>

## 10.0.5 Updates

### Summary of the changes

10.0.5 is around the corner and brings a number of updates to our class and spec tree (you can check the update out [here](https://www.wowhead.com/ptr/talent-calc/druid/balance) or on PTR). The class tree changes have no major impact but we can get Remove Corruption, Cyclone or Hibernate easier and a 5s CDR on Typhoon in the form of a new talent, Incessant Tempest. Forestwalk (the Regrowth buffing talent) will unlikely see play as we currently use Bear Form->Frenzied to survive and is generally pretty underwhelming for its positioning in the tree. The changes to the Balance tree and spec have a much larger impact:

- Circle has been reworked into Cosmic Rapidity which has the same effect except our dots no longer last shorter. This means far less redotting in all scenarios.
- Solar Beam now always has to be picked, meaning it is more or less baseline. No more excuses why you didn't kick.
- Lunar Eclipse now increases the AoE damage of Starfire instead of its crit chance. The implication of this is a very large stacked AoE buff but also more reliance on being able to cast Starfire which is often not a given. This also heavily increases the value of all our filler talents in stacked AoE scenarios.
- A lot of talent position shuffling which forces us into different build paths.

Playstyle wise these changes are positive as the short dot duration has been one of the biggest complaints about the spec, similarly to Solar Beam costing DPS. <br>
In terms of tuning, the Lunar Eclipse changes shift our damage profile in AoE scenarios by pushing far more damage into Starfire. ~~While this is currently "just" a large buff, it will inevitably be nerfed in some form and leave us more reliant on hard casting Starfire for better or worse.~~ It has been nerfed :)


### New talent builds

The following builds are what currently sims highest for the given scenarios but may not be perfect yet. Take with a grain of salt.
Pure Single Target aka Terros:<br>
https://www.wowhead.com/ptr/talent-calc/druid/balance/DAQEBEBBBkkIFRRTGVBCAQMVUFQSFSoZkFQCFQ
With the new tree we can skip Starfall if there is a fight such as Terros which allows it. The result of this is picking Force of Nature and Starweaver not working anymore which results in this build.

Sustained 4 targets aka Council:<br>
https://www.wowhead.com/ptr/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCEQMVQUWaFSgZgBQBR
This is the result of the previously mentioned Lunar Eclipse change. In this build we take all our filler Talents to allow Starfire to shine, even skipping Mushrooms. Compared to the previously optimal build for Council, this build is a ~~14%~~ 6% dps increase meaning we will gap everyone else by a ~~large~~ fairly large margin on that boss. Unfortunately this build gives up more or less all our single target dps so the uses of it are very limited. It remains to be seen if it will find play in more scenarios.

Possible dungeon build and mixed target boss fights:<br>
https://www.wowhead.com/ptr/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCFQMVQUUSFSoZkFQCQQ
This build basically maximizes the talents that are either must pick in ST/AoE or buff both. Starweaver in M+ is also looking to be a viable pick outside of very heavy AoE dungeons as it is better on both bosses and packs that have mobs with a larger hp pool. Wild Mushroom is still our best burst AoE talent so it will still be taken for bosses where it is required(for example Dathea), for lower M+ dungeons and whenever the average pull is too big to consistently flare. Additionally Mushrooms are a movement global we are sorely lacking so they will still see play in a lot of dungeons and bosses. A build with them would look like this: https://www.wowhead.com/ptr/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCFQMVQUUSFSpVkRQCUQ
Nonetheless they have lost a lot of relative value as they replace a Starfire cast.

### Other minor rotational changes
- We now Starfire during CA/Inc on 2+ targets instead of 4+.
- Stellar Flare is no longer worth casting on 11 targets minus 1 per point in Astral Smolder or Umbral Intensity. This means that with both Astral Smolder and Umbral Intensity at 2/2 we stop using Stellar Flare on 7 targets. Additionally it now requires the target to live 8s+1 per target Starfire can hit.
- Not a change but worth noting: Nothing changes about us entering Lunar Eclipse and filling with Wrath outside 2+ 2pc stacks or Umbral Embrace on ST.


<div id="rotation">

# [2.Rotation:](#rotation)

</div>

<div id="st">

## [What is my Single Target rotation?](#st)

</div>

**Single Target priority list:**

- Keep up {{< spell 8921 "Moonfire" >}}, {{< spell 93402 "Sunfire" >}} and {{< spell 202347 "Stellar Flare" >}} and refresh within pandemic (30% of base duration) inside Eclipse and if they would expire otherwise outside Eclipse.
- Use {{< spell 190984 "Wrath" >}} to get into Lunar Eclipse. This also applies to before cooldowns if you have T29 4PC equipped.
- Use {{< spell 78674 "Starsurge" >}} if you have a Touch the Cosmos(T29 4PC) proc.
- Use {{< spell 194223 "Celestial Alignment" >}} or {{< spell 102560 "Incarnation" >}} if talented.
- Use {{< spell 191034 "Starfall" >}} if you have 550 Astral Power towards {{< spell 393961 "Primordial Arcanic Pulsar" >}} and you are not in {{< spell 194223 "CA" >}} or {{< spell 102560 "Inc" >}}.
- Use Warrior of Elune if available.
- Use Convoke the Spirits when below 40 AP if you are inside a {{< spell 194223 "CA" >}} or {{< spell 102560 "Inc" >}} window, or if your next {{< spell 194223 "CA" >}} or {{< spell 102560 "Inc" >}} window is 30 or more seconds away.
- Use Astral Communion if you will not overcap on AP.
- Use Force of Nature if you will not overcap on AP.
- Use {{< spell 211545 "Fury of Elune" >}} if you will not overcap on AP.
- Use {{< spell 191034 "Starfall" >}} if you have a Starweaver's Warp proc.
- Use {{< spell 78674 "Starsurge" >}} if Starlord has less than 3 stacks and if talented you can optimally refresh your Rattle the Stars buff.
- Use New-, Half- and Full Moon if you will not overcap on AP.
- Use {{< spell 78674 "Starsurge" >}} if one of the following conditions are true: 
    - You would overcap AP with the next cast.
    - You have a Starweaver's Weft proc.
    - Solar or Lunar Eclipse will end in the next 4 seconds and you have above 70 AP.
- Use Wild Mushroom on cooldown.
- Use {{< spell 190984 "Wrath" >}} if you are in CA/Inc.
- Use {{< spell 194153 "Starfire" >}} if you have an Umbral Embrace proc or are at 2+ 2pc stacks and you are in Lunar Eclipse. Either Embrace or 2pc can be ignored for the same gain (~0.5% dps).
- Use {{< spell 190984 "Wrath" >}} You should always be in Lunar Eclipse but casting Wrath is still a DPS increase.


<div id="aoe">

## [What is my AoE rotation?](#aoe)

</div>

**AoE priority list:**

- Use {{< spell 93402 "Sunfire" >}} if the targets will live for 6 or more seconds, you will not overcap on AP and will hit all targets with it. Otherwise wait with this until they are gathered.
- Use {{< spell 8921 "Moonfire" >}} if the target(s) will live for 6 or more seconds and you will not overcap on AP.
- Use {{< spell 190984 "Wrath" >}} to enter Lunar Eclipse.
- Use {{< spell 191034 "Starfall" >}} T29 4PC equipped, have the free spender buff and you are about to use {{< spell 194223 "Celestial Alignment" >}} or {{< spell 102560 "Incarnation" >}}.
- Use {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}}.
- Use Warrior of Elune if available.
- Use Wild Mushrooms if you will not overcap on AP. If you are using Fungal Growth and Waning Twilight make sure to not use it if the debuff is up already.
- Use {{< spell 211545 "Fury of Elune" >}} or Full Moon if you will not overcap on AP.
- Use Full Moon if you will overcap on charges and you will not overcap on AP.
- Use Stellar Flare if the target will live for at least 8s+1s per target that Starfire can hit and you will not overcap on AP.
- Use {{< spell 194153 "Starfire" >}} if you have 3x T29 2piece stacks or an Umbral Embrace proc and you will not overcap on AP.
- Use {{< spell 191034 "Starfall" >}} if one of the following conditions are true:
    - You would overcap AP otherwise.
    - You have a Starweaver's Warp proc.
    - Starlord is below 3 stacks.
- Use Astral Communion if you will not overcap on AP.
- Use Convoke the Spirits if Starfire would only hit 2 targets, otherwise only use Convoke for movement in AoE.
- Use New Moon and Half Moon if you will not overcap on AP.
- Use {{< spell 78674 "Starsurge" >}} if you have a Starweaver's Weft proc.
- Use {{< spell 194153 "Wrath" >}} if Starfire will only hit one target during CA/Inc.
- Use {{< spell 194153 "Starfire" >}}.



<div id="filler">

## [What is my filler priority inside CA/Inc?](#filler)

</div>


Inside of {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} your fillers will be {{< spell 190984 "Wrath" >}} on Single Target and {{< spell 194153 "Starfire" >}} on 2 or more targets.


<div id="pulsar">

## [Why do we proc pulsar with starfall?](#pulsar)

The reason we proc {{< spell 393961 "Primordial Arcanic Pulsar" >}} in single target situations with Starfall (if CA/INC is not already active) is due to the buffs gained upon entering CA such as {{< spell 394050 "BoAT" >}} and {{< spell 194223 "Celestial Alignment" >}}.
  
The damage dealt by Starfall updates dynamically during its duration and can benefit from those buffs (with the exception of the initial tick). Starsurge on the other hand is executed before these buffs apply and will not benefit from them.
  
<div id="talents">

# [3.Talents:](#talents)

</div>

**DRAGONFLIGHT TALENTS:**

[Erranog](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVQUUSFSoZkFQCQA)
<br>[Council](https://www.wowhead.com/talent-calc/druid/balance/DAQFBUBBBgkIFRRTGFBCAQMVQUWaFSgZgBQBQ)
<br>[Terros sweaty build](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVUFQSFSoZkFQCFU)
<br>[Terros chill build](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVQVQSFSoZkFQCRQ)
<br>[Sennarth no pad](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVQUUSFSoZkFQCQA)
<br>[Sennarth with pad](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVQUUSFSpVkRQCQA)
<br>[Dathea](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVQUUSFSpVkRQCUA)
<br>[Kurog](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVQUUSFSoZkFQCQA)
<br>[Broodkeeper ethical build](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVQUUSFSpVkRQCUA)
<br>[Broodkeeper pad build](https://www.wowhead.com/talent-calc/druid/balance/DAQFBEBBBgkIFRRTGVBCAQLVUUWaFSgZgBBU)
<br>[Raszageth](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVQUUSFSpVkRQCUA)
  
<br>[M+ Build 1 Rattle](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVQUUSFSpVkRQCUA)
<br>[M+ Build 2 Weaver](https://www.wowhead.com/talent-calc/druid/balance/DAQEBEBBBgkYFRRTGVBCAQMVQUVSFSoZkBQCQA)
<br>[M+ Build 3 Fort AA](https://www.wowhead.com/talent-calc/druid/balance/DAQFBUBBBgkIFRRTGFBCAQMVUUWaFSgVgBQCUA)
  
DRUID TREE DEVIATIONS:

- ALWAYS take Nature’s Vigil in raid and M+ unless the content is a joke.



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

- [Phial of Static Empowerment](https://www.wowhead.com/item=191338/phial-of-static-empowerment)
- [Phial of Charged Isolation](https://www.wowhead.com/item=191332/phial-of-charged-isolation)
- [Iced Phial of Corrupting Rage](https://www.wowhead.com/item=191329/iced-phial-of-corrupting-rage), has ~80% of the value of Static/Isolation Phials at max value.
- [Phial of Elemental Chaos](https://www.wowhead.com/item=191359/phial-of-elemental-chaos), has ~55% of the value of Static/Isolation Phials at max value. This means if you can't get more than 55% uptime on those you should use this Phial.
- [Phial of Tepid Versatility](https://www.wowhead.com/item=191341/phial-of-tepid-versatility), same as the Elemental one, only that vers is more often better during progress than the random stats. Should be the default phial in most situations.
- [Phial of Glacial Fury](https://www.wowhead.com/item=191335/phial-of-glacial-fury), after nerfs this Phial should never be used.

**AoE**:

The priority is the same as it is on ST.


<div id="runes">

## [Runes](#Runes)

</div>

[Howling Rune](https://www.wowhead.com/item=194820/howling-rune) Use in all situations.


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


Weapon - [Sophic Devotion](https://www.wowhead.com/item=200054/enchant-weapon-sophic-devotion?crafting-quality=6) Main stat proc, use in all situations
<br>Chest - [Waking Stats](https://www.wowhead.com/item=200030/enchant-chest-waking-stats?crafting-quality=6) Intellect
<br>Cloak - [Graceful Avoidance](https://www.wowhead.com/spell=389403/graceful-avoidance) Avoidance + Reduced fall damage
<br>Legs - [Frozen Spellthread](https://www.wowhead.com/item=194013/frozen-spellthread?crafting-quality=6) Intellect + Stamina
<br>Wrist - [Devotion of Avoidance](https://www.wowhead.com/item=200021/enchant-bracer-devotion-of-avoidance?crafting-quality=6) Avoidance
<br>Boots - [Watchers Loam](https://www.wowhead.com/item=199936/enchant-boots-watchers-loam) Stamina
<br>Ring - [Devotion of Mastery](https://www.wowhead.com/item=200039/enchant-ring-devotion-of-mastery?crafting-quality=6) Mastery is our best stat but you should always sim your own character to determine what enchant to use in this slot.



<div id="embellishments">

## [Embellishments](#embellishments)

</div>

**ST:**
The best embellishments raw damage wise at full uptime are [Elemental Lariat](https://www.wowhead.com/spell=375323/elemental-lariat) and [Slimy Expulsion Boots](https://www.wowhead.com/item=193451/slimy-expulsion-boots). 
<br>[Potion Absorption Inhibitor](https://www.wowhead.com/spell=371700/potion-absorption-inhibitor) should usually be taken instead of Slimy Expulsion Boots since swapping Embellishments, at least early on, is not an option easily.
<br>Another option is [Blue Silken Lining](https://www.wowhead.com/spell=387335/blue-silken-lining) at very high uptime, which should can be considered when you are sure you will rarely fall below 90%. In raid this is never the case and the same goes for most dungeons.

**AOE:**
The best embellishments  are [Elemental Lariat](https://www.wowhead.com/spell=375323/elemental-lariat) and [Potion Absorption Inhibitor](https://www.wowhead.com/spell=371700/potion-absorption-inhibitor) in nearly all situations. 
<br>As for single target [Blue Silken Lining](https://www.wowhead.com/spell=387335/blue-silken-lining) is an option if it gets very high uptime but this is essentially never the case.

**TLDR:** 
[Elemental Lariat](https://www.wowhead.com/spell=375323/elemental-lariat) (always use) > [Slimy Expulsion Boots](https://www.wowhead.com/item=193451/slimy-expulsion-boots) (ST) = [Potion Absorption Inhibitor](https://www.wowhead.com/spell=371700/potion-absorption-inhibitor) (AoE)

**What to craft:**
Before you make your decision on what to craft you should clear as much of the raid as possible. All crafted pieces should be crafted with mastery/haste.
<br>Your first craft should be [Elemental Lariat](https://www.wowhead.com/item=193001/elemental-lariat?bonus=8960:8782:8793&ilvl=418&spec=102), it performs really well in all situations, after that you can choose to craft either of the following depending on your gear:
<br>[Signet of Titanic Insight](https://www.wowhead.com/item=192999/signet-of-titanic-insight) Ring crafted by jewelcrafting
<br>[Primal Molten Spellblade](https://www.wowhead.com/item=190506/primal-molten-spellblade) 1H dagger crafted by blacksmithing
<br>[Life-Bound Boots](https://www.wowhead.com/item=193398/life-bound-boots) Boots crafted by leatherworking



<div id="tier-set">

## [Tier Set](#tier-set)

2PC: 2% DPS ST, 2.5% AoE 
<br>4PC: 12% DPS ST, 12.5% AoE
<br>2+4PC: 14% DPS ST, 15% AoE
<br>TLDR: Loot or bench

How to use the 4PC procs can be found in the [Rotation](#rotation) section. ({{< spell 78674 "Starsurge" >}} ST, {{< spell 191034 "Starfall" >}} AoE)

</div>



<div id="trinkets">

## [Trinkets](#trinkets)

</div>

Obviously, just like before please use the Top Gear or Droptimizer options in Raidbots in order to decide what trinkets to farm/use, but the following list should give you a good idea of some of the trinkets you will want to look out for.

On Single Target you will want to use [Furious Ragefeather](https://www.wowhead.com/item=193677/furious-ragefeather?bonus=7974&class=11&ilvl=415&spec=102) and one of the following trinkets:

[Whispering Incarnate Icon](https://www.wowhead.com/item=194301/whispering-incarnate-icon?bonus=7935&class=11&ilvl=421&spec=102) - The Primal Council (Raid)
<br>[Spiteful Storm](https://www.wowhead.com/item=194309/spiteful-storm?bonus=7979&class=11&ilvl=424&spec=102) - Raszageth (Raid)
<br>[Desperate Invoker's Codex](https://www.wowhead.com/item=194310/desperate-invokers-codex?bonus=7935) - Raszageth (Raid), Inflicts a great amount of damage to yourself and should not be considered in a progression environment.
<br>[Conjured Chillglobe](https://www.wowhead.com/item=194300/conjured-chillglobe?bonus=7935&class=11&ilvl=415&spec=102) - The Primal COuncil (Raid)
<br>[Eye of Skovald](https://www.wowhead.com/item=133641/eye-of-skovald?bonus=1795&ilvl=415&spec=102) - Halls of Valor
<br>[Darkmoon Deck: Inferno](https://www.wowhead.com/item=198086/darkmoon-deck-inferno?class=11&ilvl=418&spec=102) - Inscription / AH
<br>[Windscar Whetstone](https://www.wowhead.com/item=137486/windscar-whetstone?bonus=6652:8811:8812:6808:4786:3294&ilvl=415&spec=102) - Court of Stars, good on-use ST trinket, mind that the damage it does is shared amongst enemies hit.
  
On **AoE** you will want to use [Whispering Incarnate Icon](https://www.wowhead.com/item=194301/whispering-incarnate-icon?bonus=7935&class=11&ilvl=421&spec=102) and one of the following trinkets:

[Alacritous Alchemist Stone](https://www.wowhead.com/item=191492/alacritous-alchemist-stone?ilvl=418&spec=102) - Alchemy / AH
<br>[Infernal Writ](https://www.wowhead.com/item=137485/infernal-writ?bonus=1795&class=11&ilvl=415&spec=102) - Court of Stars
<br>[Furious Ragefeather](https://www.wowhead.com/item=193677/furious-ragefeather?bonus=7974&class=11&ilvl=415&spec=102) - Nokund Offensive 
<br>[Idol of the Earth Warder](https://www.wowhead.com/item=193006/idol-of-the-earth-warder?class=11&ilvl=418&spec=102) - Jewelcrafting / AH !! This trinket is only good if you have a lot of sockets in your gear !!
<br>[Darkmoon Deck: Inferno](https://www.wowhead.com/item=198086/darkmoon-deck-inferno?class=11&ilvl=418&spec=102) - Inscription / AH
<br>[Voidmender's Shadowgem](https://www.wowhead.com/item=110007/voidmenders-shadowgem?bonus=6652:8811:8812:6808:4786:3300&class=11&ilvl=415&spec=102) - Shadowmoon Burial Grounds
<br>[Ruby Whelp Shell](https://www.wowhead.com/item=193757/ruby-whelp-shell?bonus=6652:8783:8784:7936:7937:6808:4786:1637&class=11&ilvl=415&spec=102) - Ruby Life Pools, can be used if no other good alternative, you would want to train the haste proc.
<br>[Emerald Coach's Whistle](https://www.wowhead.com/item=193718/emerald-coachs-whistle?bonus=6652:8783:8784:7936:7937:6808:4786:1637&class=11&ilvl=415&spec=102) - Algethar Academy, mastery buff that procs both for you and the person you link with, likely the best dps increase for your group since both players benefit from the buff(requires resto lootspec to drop, procs from all of our spells).
<br>[Iceblood Deathsnare](https://www.wowhead.com/item=194304/iceblood-deathsnare?bonus=6652:8783:8784:7936:7937:4800:4786:1498&class=11&ilvl=415&spec=102) Sennarth(Raid), good on sustained AoE


<div id="gearing-advice">

## [Gearing Advice](#gearing-advice)

</div>

In general try to hit ilvl > mastery gear. If it has mastery it is most likely good, it does NOT need haste or anything else. For stuff that does not have mastery just sim in between dungeons.

**Dungeons to Spam:**

Nokhud Offensive - In general insane loot, really good trinket, a lot of mastery gear. If you are pugging keys and are able to target try to run this dungeon.
<br>Halls of Valor - This dungeon is really heavy on mastery gear and the trinkets are also pretty good. Do not reroll this dungeon.
<br>Algeth'Ar Academy - Good for weapon hunting, it has a low drop pool so you can get it relatively fast.
<br>Court of Stars - Although the loot pool is diluted, Signet of Melandrus is around 400 agility for Feral if you will at all play that. Infernal Writ is also a really solid trinket. 
<br>Temple of the Jade Serpent - Although the loot pool is diluted, there are some decent pieces and a really good main hand. Do not go out of your way to spam this, but do not reroll this either.

**Dungeons to Reroll:**

<br>Shadowmoon Burial Grounds - Unless the loot table gets purged a lot on live try to reroll this dungeon as you can not target most of the loot and mainstat jewelry is worse than normal ones.
<br>Ruby Life Pools - Good for weapon if you do not have one yet, otherwise skip unless someone in your group needs this or you need score.
<br>Azure Vault - Mostly garbage loot, skip unless someone in your group needs this or you need score.



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

  
<div id="utility">

# [7. Utility](#utility)

</div>
 
 
## Balance Druid Utility:

{{< spell 29166 "Innervate" >}} - The targeted healer has no mana costs for 10sec - use on yulon monk > disc > everything else (also works with Resto Aff HotW)

{{< spell 22812 "Barkskin" >}} - 20% DR on 60sec CD (reduced by {{< spell 265144 "Symbol of Hope" >}}), usable while stunned, frozen, incapacitated, feared or asleep. Also prevents your casts from being pushed back.

{{< spell 61391 "Typhoon" >}} - AoE Knockback on 30s CD, can be used for purely displacing, interrupting or in tandem with Ursol's Vortex (read below). Keep in mind that knockbacks also have DR.

{{< spell 33786 "Cyclone" >}} - Stasis/Banish on enemy for 6sec, 25y. Can be used if an add needs to not die (bolstering)

{{< spell 2908 "Soothe" >}} - Enrage dispell on an enemy, 10s CD (CD incurs even if nothing is dispelled)

{{< spell 2782 "Remove Corruption" >}} - Curse and Poison dispell on a friendly Target, 8s CD (CD does not incur if nothing is dispelled)

{{< spell 339 "Entangling Roots" >}} - 30sec root, 40y range - can affect only one target (independent of mass entanglement)

{{< spell 2637 "Hibernate" >}} - 40sec Sleep/Incapacitate on enemy Beasts and Dragonkins, 35y (can also be used to interrupt casts)

{{< spell 106898 "Stampeding Roar" >}} - Raid wide movement speed increase (60%) for 8 sec. Force shifts into Bear form if not in either Bear Form or Cat Form. Has an unhasted 1.5s gcd due to not being forgotten to be put on a certain whitelist by Blizzard.

{{< spell 1850 "Dash" >}} - Self 60% movement speed increase while in Cat Form 10s duration. (force shifts into cat form)

{{< spell 99 "Incapacitating Roar" >}} - 3 sec AoE Incapacitate, 30s CD - mainly used to interrupt unkickable casts or channels

{{< spell 102793 "Ursol's Vortex" >}} - AoE 50% Slow + grips mobs inside it if they try to leave (once), 60s CD - mainly used for tank kiting, can be used in tandem with Typhoon to create a budget gorefiend's grasp

{{< spell 22570 "Maim" >}} - Stun based on how many CPs you have (1sec per CP) - not used in 99.999% of cases

{{< spell 5211 "Mighty Bash" >}} - Melee range 4s stun usable in any form, 60s CD

{{< spell 102359 "Mass Entanglement" >}} - 30s Root that hits everything around your target (you can have both entangling roots and mass entangle at the same time), 30s CD

{{< spell 108291 "Heart of the Wild" >}} - Grants a specific buff depending on your affinity
  + {{< spell 108293 "Guardian" >}} - 20% stam, 2 frenzied regens, ironfur stackable - buff only while in bear form (45% stam, 220% armor total + frenzied). Extremely strong defensive cooldown.
  + {{< spell 108294 "Restoration" >}} - healing increased by 30% mana cost reduction by 50% - can use Innervate on yourself.
  + {{< spell 108292 "Feral" >}} - never use this

{{< spell 8936 "Regrowth" >}} - direct heal + hot, castable in Moonkin Form

{{< spell 774 "Rejuvenation" >}} - hot (instant) 12s dur, force shifts into Human Form

{{< spell 48438 "Wild Growth" >}} - Smart heal that hits 5 targets within 30y of your current target (ramps down, ~35k healing per cast), force shifts into Human Form

{{< spell 18562 "Swiftmend" >}} - Big heal that consumes a HoT and force shifts into Human Form. This means it can only be used on targets that have a Regrowth, Rejuvenation or Wild Growth HoT.

{{< spell 22842 "Frenzied Regeneration" >}} - 24% max HP heal over time. If you leave Bear form the effect disappears.

{{< spell 3025 "Cat Form" >}} - Stance, 30% movement speed, going into or out of cat form removes slows and roots.

{{< spell 783 "Travel Form" >}} - Stance, 40% movement speed while in combat, 100% movement speed while out of combat, going into or out of travel form removes slows and roots. Keep note which fights/areas you can use this on as it’s a flat better version of Cat Form outside Dash.

{{< spell 5487 "Bear Form" >}} - Stance, 25% stamina 220% armor, stamina can be used to tank mechanics since you will be losing a smaller % of hp inside it leaving you with higher hp when you go out of it. Going into or out of bear form removes slows and roots.

{{< spell 164862 "Flap" >}} - Slow fall effect that has to be channeled. Keeps horizontal velocity, costs 1 GCD. Can be used after Wild Charge to extend the jump and travel more distance.

{{< spell 102401 "Wild Charge" >}} - 15s CD, off GCD
  + Moonkin - Disengage / bound backwards away from your current location - can be extended by jumping before and/or using Flap after it.
  + Human - Fly to an ally's position - can be used on a separate keybind with a cancelform mouseover wild charge macro.
  + Cat - Leaps behind an enemy target and slows it.
  + Bear - Charges to your target and briefly roots it.
  + Travel - leap forward (longer than moonkin form)

{{< spell 37846 "Force of Nature" >}} - Taunts everything in a radius near the initial placement of the trees. 60s CD. The trees will start targeting whatever your target was upon placing them.

{{< spell 78675 "Solar Beam" >}} - ST interrupt on main target with 5s lockout that places an AoE silence ring on the ground that lasts 8s. The silence ring does not work on some mobs but the actual interrupt does, be careful with this.
