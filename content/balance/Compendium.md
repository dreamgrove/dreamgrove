---
date: '2023-05-09'
authors: ["Chicken, Jundarer, Dsune (Oi)"]
published: true
patch: "10.2"
title: Balance Druid 10.2 Compendium
showOnFrontpage: true
description: "Everything you need to know about Balance Druid"
showInRecent: true
sidebarTitle: "Quicklinks"
sidebarContents:  |
  **[1. News](#news)**
 
  **[2. Rotation](#rotation)**
  <br>[Precasting](#precast)
  <br>[Single Target priority](#st)
  <br>[AoE priority](#aoe)
  <br>[Eclipses and Fillers](#fillers)
  <br>[How to Use Warrior of Elune](#woe)
  <br>[Prestacking Pulsar](#prestack)
  <br>[How to use Owlkin Frenzy procs](#owlkin-frenzy)
 
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
  <br>[Trinkets](#trinkets)
 
  **[6. Miscellaneous](#misc)**
  <br>[Do our dots snapshot?](#snapshot)
  <br>[What is Astral damage?](#astral-damage)
  <br>[Macros](#macros)
  <br>[Useful WeakAura(s)](#wa)
  <br>[Cancelaura Macros](#cancel)
 
  **[7. Sims](#sims)**
 
---

[Changelog](https://github.com/dreamgrove/dreamgrove/commits/master/content/balance)

<div id="news">

# [1. News:](#news)

</div>

## 10.2 News
### Tier Set
#### {{< spell 424248 "2-piece" >}}:
> When Eclipse ends or when you enter combat, enter a {{< spell 424248 "Dreamstate" >}}, reducing the cast time of your next 2 {{< spell 194153 "Starfires" >}} or {{< spell 190984 "Wraths" >}} by 40% and increasing their damage by 100%.

~5.1% DPS increase from having no tier.

If the buff is up before you enter combat, your first {{< spell 194153 "Starfire" >}} /{{< spell 190984 "Wrath" >}} will be affected by the buff and your {{< spell 424248 "Dreamstate" >}} stacks will then reset back to 2 when you finish your cast.

Using {{< spell 194223 "Celestial Alignment" >}} /{{< spell 102560 "Incarnation" >}} will also grant you {{< spell 424248 "Dreamstate" >}}, however proccing {{< spell 393961 "Pulsar" >}} will not.

#### {{< spell 422863 "4-piece" >}}:
> {{< spell 78674 "Starsurge" >}} or {{< spell 191034 "Starfall" >}} increase your current Eclipse’s Arcane or Nature damage bonus by an additional 2%, up to 10%.

~9.1% DPS increase from having no tier.

Solar and Lunar eclipse naturally gives 15% increased Nature/Arcane damage, the 4-piece adds 2% per spender used in that eclipse up to a total of 25% increased.

In {{< spell 194223 "CA" >}} /{{< spell 102560 "Incarn" >}} this will be a maximum of 25% increased Arcane and 25% increased Nature damage, meaning any Astral school spell will deal damage = x*1.25\*1.25

The stacks reset when using {{< spell 194223 "CA" >}} /{{< spell 102560 "Incarn" >}}, you do however keep the stacks of your current eclipse when proccing {{< spell 393961 "Pulsar" >}}, i.e. you're in solar eclipse with 4 stacks, proc {{< spell 393961 "Pulsar" >}}, you will now have 5 stacks of increased Nature damage and 1 stack of increased Arcane damage.

Total DPS from set: ~14.9%

Tier sim (current ilvl ~448): https://mimiron.raidbots.com/simbot/report/1uANMpAkXv1grXNeTSN5e8

### Mastery Update
Mastery is now composed of 4 separate parts:
- A passive effect that always applies to Arcane & Astral spells
- A passive effect that always applies to Nature & Astral spells
- A dynamic effect that applies to Arcane & Astral spells on targets debuffed by Moonfire
- A dynamic effect that applies to Nature & Astral spells on targets debuffed by Sunfire

Each part is independent and multiplies with each other.

### List of changes

- Damage of all abilities increased by 2%.
- {{< spell 393958 "Nature's Grace" >}} now grants 10% Haste (was 15%).
- {{< spell 394046 "Power of Goldrinn" >}} damage increased by 20%. Moved to where Starlord was located in Fractures in Time.
- {{< spell 202345 "Starlord" >}} has moved to where {{< spell 394046   "Power of Goldrinn" >}} was located in Fractures in Time.
- {{< spell 393954 "Rattle the Stars" >}} has been redesigned – It is no longer a buff that stacks when you cast {{< spell 78674 "Starsurge" >}} or {{< spell 191034 "Starfall" >}} and is now a passive bonus that always reduces the cost of {{< spell 78674 "Starsurge" >}} and {{< spell 191034 "Starfall" >}} by 10% and increases their damage by 12%.
- ~~Orbital Strike has been redesigned – Call down a bombardment of celestial energy over the target area, blasting all enemies for Astral damage and applying Stellar Flare to them for 16 seconds. Generates 30 Astral Power. Orbital Strike still hits enemies in a 40 yard line and has a 90 second cooldown. Now a choice node with Wild Mushroom.~~ Reverted due to PvP
- {{< spell 392999 "Fungal Growth" >}} has been removed. Wild Mushrooms now includes the effects of {{< spell 81281 "Fungal Growth" >}}.
- {{< spell 88747 "Wild Mushroom's" >}} damage has been reduced by 20% and the {{< spell 81281 "Fungal Growth" >}} damage over time has been reduced to 60% of {{< spell 88747 "Wild Mushroom's" >}} damage (was 70%). {{<spell 81281 "Fungal Growth's">}} damage over time now deals damage over 10 seconds (was 8 seconds).
- {{< spell 393014 "Astral Invocation(Mastery)" >}} gives 2/3rds of its value at all times and the remaining value through {{< spell 8921 "Moonfire" >}} and {{< spell 93402 "Sunfire" >}} like now.
- The talent positions of {{< spell 327541 "Aetherial Kindling" >}} and {{< spell 415169 "Lunar Shrapnel" >}} were swapped.
- {{< spell 202342 "Shooting Stars" >}} damage increased by 15%.

Feedback post 10.2 changes: https://us.forums.blizzard.com/en/wow/t/feedback-druids/1666448/311

<br><div id="rotation">
 
# [2.Rotation:](#rotation)

</div>

<div id="precast">

## [Precasting](#precast)

</div>

**Precasting:**
- Cast {{< spell 190984 "Wrath" >}} twice
- Cast {{< spell 202347 "Stellar Flare" >}}
- Cast {{< spell 194153 "Starfire" >}} if {{< spell 202347 "Stellar Flare" >}} is not talented. If you have to stand close enough so that {{< spell 194153 "Starfire" >}} will finish casting long after the boss is pulled, cast another {{< spell 190984 "Wrath" >}} instead.

You can precast from max range about 4 seconds before a boss is pulled.

**What is a priority list?**

When reading the priority lists below, you should not think about these as steps to follow in a specific order. At any given point in combat, you should cast the first thing in the list that you are able to cast if the conditions apply.

<br><div id="st">

## [Single Target priority](#st)

</div>

**Select which talents you have talented to filter the priority list:**

{{< checkbox id="Stellar Flare" spell=202347 >}}Stellar Flare{{< /checkbox >}}
<br>{{< checkbox id="Warrior of Elune" spell=202425 checked=true radio="Warrior of Elune" >}}Warrior of Elune{{< /checkbox >}}
<br>{{< checkbox id="Starweaver" spell=393940 >}}Starweaver{{< /checkbox >}}
<br>{{< checkbox id="Convoke the Spirits" spell=391528 >}}Convoke the Spirits{{< /checkbox >}}
<br>{{< checkbox id="Astral Communion" spell=400636 >}}Astral Communion{{< /checkbox >}}
<br>{{< checkbox id="Force of Nature" spell=205636 radio="Warrior of Elune" >}}Force of Nature{{< /checkbox >}}
<br>{{< checkbox id="Fury of Elune" spell=202770 radio="New Moon">}}Fury of Elune{{< /checkbox >}}
<br>{{< checkbox id="New Moon" spell=274281 checked=true radio="New Moon">}}New Moon{{< /checkbox >}}
<br>{{< checkbox id="Wild Mushroom" spell=88747 >}}Wild Mushroom{{< /checkbox >}}
<br>{{< checkbox id="Cancelaura" spell=202345 >}}Cancelaura Starlord{{< /checkbox >}}
<br>{{< checkbox id="T31 2P" spell=424248 >}}T31 2P{{< /checkbox >}}


**Do note, while not exclusively mentioned in the priority list, if you are caught outside of eclipse and capping astral power it is better to spend to prevent further capping before entering eclipse.**
- Keep up {{< spell 8921 "Moonfire" >}} and {{< spell 93402 "Sunfire" >}}, refresh within pandemic (30% of base duration shown in the tooltip).
{{<cbtext id="Stellar Flare" type="appendListItem">}}- Keep up {{< spell 202347 "Stellar Flare" >}} and refresh within pandemic (30% of base duration shown in the tooltip) if you will not overcap on AP.{{</cbtext>}}
{{<cbtext id="T31 2P" type="appendListItem">}}- Use {{< spell 194153 "Starfire" >}} if you're in Lunar Eclipse, {{< spell 424248 "Dreamstate" >}} is up and you're about to enter {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}}.
- Use {{< spell 190984 "Wrath" >}} if you're in Solar Eclipse, {{< spell 424248 "Dreamstate" >}} is up and you're about to enter {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}}. {{</cbtext>}}
- Use {{< spell 194223 "Celestial Alignment" >}} /{{< spell 102560 "Incarnation" >}} if you are not in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} already.
{{<cbtext id="Convoke the Spirits" type="appendListItem">}}- Use {{< spell 391528 "Convoke the Spirits" >}} when below 40 AP, {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} will last for more than 4 seconds or your next {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} window is more than 30s away and your Eclipse will last for more than 4s.{{</cbtext>}}
{{<cbtext id="T31 2P" type="appendListItem">}}- Use {{< spell 190984 "Wrath" >}} to enter Lunar Eclipse if you do not have {{< spell 424248 "T31 2P" >}} equipped and one of the following conditions is true:{{</cbtext>}}
{{<cbtext id="T31 2P" type="addList">}}  - You have 520 or more stacks of {{< spell 393961 "Pulsar" >}}
  - The cooldown of {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} is less than 5 seconds.{{</cbtext>}}
{{<cbtext id="Warrior of Elune" type="appendListItem">}}- Use {{< spell 202425 "Warrior of Elune" >}} if your eclipse has less than 7 seconds left and you will enter Solar Eclipse next.{{</cbtext>}}
- Use {{< spell 194153 "Starfire" >}} to enter Solar Eclipse.
{{<cbtext id="Astral Communion" type="appendListItem">}}- Use {{< spell 400636 "Astral Communion" >}} if you will not overcap on AP.{{</cbtext>}}
{{<cbtext id="Force of Nature" type="appendListItem">}}- Use {{< spell 205636 "Force of Nature" >}} if you will not overcap on AP.{{</cbtext>}}
{{<cbtext id="Fury of Elune" type="appendListItem">}}- Use {{< spell 211545 "Fury of Elune" >}} if you are in {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}}, will proc {{< spell 393961 "Pulsar" >}} with your next GCD or are at less than 280 {{< spell 393961 "Pulsar" >}} stacks.{{</cbtext>}}
{{<cbtext id="Cancelaura" type="appendListItem">}}- Use your macro to cancel {{< spell 202345 "Starlord" >}} as referenced [here](#cancel) if conditions apply. Note that this is back to being an insignificant gain.{{</cbtext>}}
{{<cbtext id="Starweaver" type="appendListItem">}}- Use {{< spell 191034 "Starfall" >}} if you have a {{< spell 393942 "Starweaver's Warp" >}} proc.{{</cbtext>}}
- Use {{< spell 78674 "Starsurge" >}} if {{< spell 202345 "Starlord" >}} has less than 3 stacks or if you have more than 2 stacks of {{< spell 394048 "BoAT" >}}.
{{<cbtext id="New Moon" type="appendListItem">}}- Use {{< spell 274281 "New-" >}},{{< spell 202768 "Half-" >}} and {{< spell 274283 "Full Moon" >}} if all of the following conditions are met:{{</cbtext>}}
{{<cbtext id="New Moon" type="addList">}}  - You will not overcap on AP.
  - You can finish the cast before your current eclipse ends.
  - You are in {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} or you're about to cap on charges and {{< spell 393961 "Pulsar" >}} has 520 or fewer stacks and the cooldown of {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} is longer than 10 seconds. {{</cbtext>}}
{{<cbtext id="Cancelaura" type="appendListItem">}}- Use your macro to cancel {{< spell 202345 "Starlord" >}} as referenced [here](#cancel) if conditions apply. Note that this is back to being an insignificant gain.{{</cbtext>}}
- Use {{< spell 78674 "Starsurge" >}} if one of the following conditions is met:
  - You would overcap AP with the next cast.
  {{<cbtext id="Starweaver" type="appendListItem">}}- You have a {{< spell 393944 "Starweaver's Weft" >}} proc.{{</cbtext>}}
  - Solar or Lunar Eclipse will end in the next 4 seconds and you have more than 70 AP.
{{<cbtext id="Wild Mushroom" type="appendToList">}}- Use {{< spell 88747 "Wild Mushroom" >}}  as a movement GCD.{{</cbtext>}}
- Use {{< spell 190984 "Wrath" >}} regardless of which Eclipse you are in.

<br><div id="aoe">

## [AoE priority](#aoe)

</div>

**Select which talents you have talented to filter the priority list:**


{{< checkbox id="Stellar Flare-AoE" spell=202347 >}}Stellar Flare{{< /checkbox >}}
<br>{{< checkbox id="Warrior of Elune-AoE" spell=202425 radio="Force of Nature" >}}Warrior of Elune{{< /checkbox >}}
<br>{{< checkbox id="Starweaver-AoE" spell=393940 >}}Starweaver{{< /checkbox >}}
<br>{{< checkbox id="Convoke the Spirits-AoE" spell=391528 >}}Convoke the Spirits{{< /checkbox >}}
<br>{{< checkbox id="Astral Communion-AoE" spell=400636 >}}Astral Communion{{< /checkbox >}}
<br>{{< checkbox id="Force of Nature-AoE" spell=205636 radio="Force of Nature" >}}Force of Nature{{< /checkbox >}}
<br>{{< checkbox id="Fury of Elune-AoE" spell=202770 radio="Fury Of Elune" >}}Fury of Elune{{< /checkbox >}}
<br>{{< checkbox id="New Moon-AoE" spell=274281 checked=true radio="Fury Of Elune" >}}New Moon{{< /checkbox >}}
<br>{{< checkbox id="Wild Mushroom-AoE" spell=88747 checked=true >}}Wild Mushroom{{< /checkbox >}}
<br>{{< checkbox id="Cancelaura-AoE" spell=202345 >}}Cancelaura Starlord{{< /checkbox >}}
<br>{{< checkbox id="T31 2P-AoE" spell=424248 >}}T31 2P{{< /checkbox >}}

<br>**Special Note: when NOT using the talents {{< spell 327541 "Aetherial Kindling" >}} or {{< spell 393940 "Starweaver" >}}, use Starsurge as a spender on 2 targets still.**
<br>**AoE priority list(2+ targets):**
- Use {{< spell 93402 "Sunfire" >}} if the targets will live for 6 minus the number of targets divided by 2 or more seconds and you will hit all targets with it. Otherwise, wait with this until they are gathered.
- Use {{< spell 8921 "Moonfire" >}} if the targets will live for 6 or more seconds and you will not overcap on AP.
{{<cbtext id="Stellar Flare-AoE" type="appendListItem">}}- Use {{< spell 202347 "Stellar Flare" >}} if all of the following conditions is met:{{</cbtext>}}
{{<cbtext id="Stellar Flare-AoE" type="addList">}}- The target will live for at least 8s+1s per target that {{< spell 194153 "Starfire" >}} can hit
- You will not overcap on AP.
- You're about to use {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}}
- Your fighting less than 11 targets -1 per talent in Umbral Intensity or Astral Smolder.
{{</cbtext>}}
{{<cbtext id="Cancelaura-AoE" type="appendListItem">}}- Use your macro to cancel {{< spell 202345 "Starlord" >}} as referenced [here](#cancel) if conditions apply. Note that this is back to being an insignificant gain.{{</cbtext>}}
- Use {{< spell 191034 "Starfall" >}} if you would overcap Astral Power with your next cast.
{{<cbtext id="T31 2P-AoE" type="appendListItem">}}- Use {{< spell 194153 "Starfire" >}} if you're in Lunar Eclipse, {{< spell 424248 "Dreamstate" >}} is up and you're about to enter {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}}.
- Use {{< spell 190984 "Wrath" >}} if you're in Solar Eclipse, {{< spell 424248 "Dreamstate" >}} is up and you're about to enter {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}}.{{</cbtext>}}
- Use {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} if you are not in {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} already.
{{<cbtext id="Warrior of Elune-AoE" type="appendListItem">}}- Use {{< spell 202425 "Warrior of Elune" >}} if available.{{</cbtext>}}
- Use {{< spell 194153 "Starfire" >}} to enter Solar Eclipse if you are fighting 2 targets.
- Use {{< spell 190984 "Wrath" >}} to enter Lunar Eclipse if you are fighting 3+ targets.
{{<cbtext id="Wild Mushroom-AoE" type="appendListItem">}}- Use {{< spell 88747 "Wild Mushroom" >}} if you will not overcap on AP and {{< spell 393956 "Waning Twilight" >}} is not up on your targets.{{</cbtext>}}
{{<cbtext id="Fury of Elune-AoE" type="appendListItem">}}- Use {{< spell 211545 "Fury of Elune" >}} if you are in {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}}, will proc {{< spell 393961 "Pulsar" >}} with your next GCD or are at less than 280 {{< spell 393961 "Pulsar" >}} stacks.{{</cbtext>}}
{{<cbtext id="Cancelaura-AoE" type="appendListItem">}}- Use your macro to cancel {{< spell 202345 "Starlord" >}} as referenced [here](#cancel) if conditions apply. Note that this is back to being an insignificant gain.{{</cbtext>}}
- Use {{< spell 191034 "Starfall" >}} if one of the following conditions is met:
{{<cbtext id="Starweaver-AoE" type="addList">}}- You have a {{< spell 393942 "Starweaver's Warp" >}} proc.{{</cbtext>}}
  - {{< spell 202345 "Starlord" >}} is below 3 stacks.
{{<cbtext id="New Moon-AoE" type="appendToList">}}- Use {{< spell 274283 "Full Moon" >}} if all of the following conditions are met:
  - You will not overcap on AP.
  - You can finish the cast before your current eclipse ends.
  - You are in CA/Inc or you're about to cap on charges and Pulsar has 520 or fewer stacks and the cooldown of {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} is longer than 10 seconds. {{</cbtext>}}
{{<cbtext id="Starweaver-AoE" type="appendToList">}}- Use {{< spell 78674 "Starsurge" >}} if you have a {{< spell 393944 "Starweaver's Weft" >}} proc and you are fighting less than 3 targets.{{</cbtext>}}
{{<cbtext id="Stellar Flare-AoE" type="appendToList">}}- Use {{< spell 202347 "Stellar Flare" >}} if all of the following conditions are met:
  - The target will live for at least 8s+1s per target that {{< spell 194153 "Starfire" >}} can hit
  - You will not overcap on AP.
  - Your fighting less than 11 targets -1 per talent in Umbral Intensity or Astral Smolder.{{</cbtext>}}
{{<cbtext id="Astral Communion-AoE" type="appendToList">}}- Use {{< spell 400636 "Astral Communion" >}} if you will not overcap on AP.{{</cbtext>}}
{{<cbtext id="Convoke the Spirits-AoE" type="appendToList">}}- Use {{< spell 391528 "Convoke the Spirits" >}} if you are fighting less than 3 targets, otherwise only use {{< spell 391528 "Convoke" >}} for movement in AoE.{{</cbtext>}}
{{<cbtext id="New Moon-AoE" type="appendToList">}}- Use {{< spell 274281 "New Moon" >}} if you will not overcap on AP.{{</cbtext>}}
{{<cbtext id="New Moon-AoE" type="appendToList">}}- Use {{< spell 274282 "Half Moon" >}} if you will not overcap on AP and you can finish the cast before your current eclipse ends.{{</cbtext>}}
{{<cbtext id="Force of Nature-AoE" type="appendToList">}}- Use {{< spell 205636 "Force of Nature" >}} if you will not overcap on AP.{{</cbtext>}}
{{<cbtext id="Starweaver-AoE" type="appendToList">}}- Use {{< spell 78674 "Starsurge" >}} if you have a {{< spell 393944 "Starweaver's Weft" >}} proc and {{< spell 194153 "Starfire" >}} will hit less than 17 targets.{{</cbtext>}}
- Use {{< spell 194153 "Starfire" >}} if any of the below conditions are true:
  - You are in Lunar Eclipse.
  - You are in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} and {{< spell 194153 "Starfire" >}} will hit 4 or more targets.
- Use {{< spell 194153 "Wrath" >}} if any of the below conditions are true:
  - You are in Solar Eclipse.
  - You are in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} and {{< spell 194153 "Starfire" >}} will hit 3 or fewer targets.


<br><div id="fillers">

## [Eclipses and Fillers](#fillers)
 
 </div>

 Before casting {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} you should make sure to spend your stacks of {{< spell 424248 "Dreamstate" >}}.
 
 - On 1-2 targets, enter Solar Eclipse and cast  {{< spell 190984 "Wrath" >}}.
 - On 3 or more targets, enter Lunar Eclipse and cast {{< spell 194153 "Starfire" >}}.
 - On 1-3 targets inside {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} cast {{< spell 190984 "Wrath" >}}
 - On 4 or more targets inside {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} cast {{< spell 194153 "Starfire" >}}.

<br><div id="woe">

## [How to Use Warrior of Elune](#woe)
 
 </div>
 
{{< spell 202425 "Warrior of Elune" >}} is an off-gcd ability, making your next 3 {{< spell 194153 "Starfires" >}} instant for 25 seconds. The ability has a 45s cooldown that starts once you've pressed it.

{{< spell 202425 "Warrior of Elune" >}} can be used 7 seconds before an eclipse ends, this way you will have just enough time to spend your third charge before the buff runs out and the CD will start earlier, which can net you more uses throughout the fight.

Use the charges to enter Solar Eclipse or as a movement GCD in {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} /{{< spell 48518 "Lunar Eclipse" >}}. Using a Warrior of Elune Starfire in single target during {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} is NOT a damage increase if you do not need to move.

If Warrior of Elune is falling off during {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} and you still have a charge to spend, you can {{< spell 194153 "Starfire" >}} at 2+ targets.

Warrior of Elune can also be used during {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} /{{< spell 48518 "Lunar Eclipse" >}} when there are adds up, this will net you a lot of Astral Power which can be useful to target down a specific add or to provide more boss damage by utilizing the AP on Starsurges.


<br><div id="prestack">

## [Prestacking Pulsar](#prestack)

</div>

{{< spell 393961 "Pulsar" >}} can be pre-stacked before pulling a boss by spending Astral Power on trash as the buff does not reset when an encounter starts. **This represents a gain of ~1%.**

The optimal value for pre-stacking pulsar is somewhere between **240-360** pulsar, the variation comes from the amount of {{< spell 383197 "Orbit Breaker" >}} stacks you have as that will vary the amount of Astral Power you gain.

The goal for stacking it to these values is to refresh buffs like {{< spell 394048 "BoAT" >}} and {{< spell 343647 "Solstice" >}} after they've dropped off.

The other value to keep in mind is **560** {{< spell 393961 "Pulsar" >}}, it's a bit worse than 240-360 but still represents a gain.

With this value you would begin the encounter with the standard opener; however, instead of using {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}}, proc your pulsar and use your trinket and potion. When pulsar drops off, spend your {{< spell 424248 "Dreamstate" >}} stacks and then use {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} to have some of the benefit from {{< spell 393958 "Nature's Grace" >}} inside of it.

This will mostly be relevant during farm periods when you can one-shot a boss.

<br><div id="owlkin-frenzy">

## [How to use Owlkin Frenzy procs](#owlkin-frenzy)

</div>

Use {{< spell 157228 "Owlkin Frenzy" >}} procs to enter Solar Eclipse, inside Lunar Eclipse or inside {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} if Starfire will hit 3 or more targets.
<br>Keep in mind that {{< spell 202425 "Warrior of Elune" >}} charges are consumed before {{< spell 157228 "Owlkin Frenzy" >}} procs.


<br><div id="talents">

# [3. Talents:](#talents)

</div>

## Raid Talents
<div style="text-align: center;">

### Single Target
<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikcgUgWiDkIJlENxBChWSLJRENAKAQA?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>
</div>

You can also play [this build](https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikcgUgWiDkIJlENJJgWSLJRQDgCAE?bgcolor=000000), at lower itemlevels {{< spell 394065 "Denizen of the Dream" >}} might sim better for your character.
<br>As you aquire better gear, the build without {{< spell 394065 "Denizen of the Dream" >}} will become better because of a bug affecting their damage not scaling with base mastery.

<div style="text-align: center;">

### Mixed Targets
<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikIFolIJJJlkQcgQol0iQS0AoAAB?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>

</div>


## Mythic+ Talents

<div style="text-align: center;">

### Balanced build
<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCQkkIikkAkESiUgWiDkDkkUSCJJEaSLCJRDgCAE?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>
</div>  

The following are dungeon talent builds that will always serve you well but mind that there can be some variations based on your group comp or affixes. {{< spell 274281 "New Moon" >}} and {{< spell 211545 "Fury of Elune" >}} can be used interchangeably.

{{< spell 274281 "New Moon" >}} provides more single target damage and is easier to pair with pulsar.
<br>{{< spell 211545 "FoE" >}} is both easier to play and does more AoE, it will however often not align with {{< spell 393961 "Pulsar" >}}.

The below picture showcases which talents are "mandatory" and which talents you can opt-in to:

{{< figure src="/balance/talent-tree-mythic+.png" >}}


[Single target focused build](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCQkkIikkAkESiUgWiDkkkUSCJHIEaSLCJRDgCAE?bgcolor=000000)
<br>[Balanced build](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCQkkIikkAkESiUgWiDkDkkUSCJJEaSLCJRDgCAE?bgcolor=000000)
<br>[AoE focused build](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikcgUgWiDEJJlkQSCRaSJCJRDgCAE?bgcolor=000000)

<br>[Class tree with Hibernate for Incorporeal](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJJCSCBJJSiUgWiDkkkUSCJHIEaSJCJRDgCAE?bgcolor=000000)
<br>[If you really need both Hibernate and Remove Corruption](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCQkkkISSAkESiUgWiDkkkUSCJHIEaSJCJRDgCAE?bgcolor=000000)

- {{<spell 377842 "Ursine Vigor">}}, {{<spell 377847 "Well-Honed Instincts">}} and {{<spell 288826 "Improved Stampeding Roar">}} are the major competing talents. {{<spell 377842 "Ursine Vigor">}} should be taken if you need it to survive certain abilities. {{<spell 377847 "Well-Honed Instincts">}} is always on 1 point but a 2nd can be taken if you rarely/never use Bear Form. {{<spell 288826 "Improved Stampeding Roar">}} is extremely useful in indoor dungeons and in spiteful weeks.
- {{<spell 2782 "Remove Corruption">}} should be taken in Afflicted weeks.
- {{<spell 33786 "Cyclone">}} has basically no use other than stopping Bursting and can be replaced with anything else(which also won't have any use).
- {{<spell 2637 "Hibernate">}} can be used for the Incorporeal affix.
- For lower keys, you can put 1 point into {{<spell 131768 "Feline Swiftness">}} like [this](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikIFHgWiDEJJlkQSChmUiEJRDgCAE?bgcolor=000000). This skips {{<spell 377842 "Ursine Vigor">}} and {{<spell 132469 "Typhoon">}}. You can also drop any of the other bottom talents you don't need to get a 2nd point in {{<spell 131768 "Feline Swiftness">}} to get around even quicker for farming keys. 
- All other talents in the druid tree are more or less set.


<br><div id="consumables">

# [4.Consumables:](#consumables)

</div>


<div id="potions">

## [Potions](#Potions)

</div>


[Elemental Potion of Ultimate Power](https://www.wowhead.com/item=191383/elemental-potion-of-ultimate-power)
<br> Use this for every situation. Potion of Elemental Power is only minorly worse if you want to save gold.


<br><div id="food">

## [Food](#food)

</div>


[Grand Banquet of the Kalu'ak](https://www.wowhead.com/item=197794/grand-banquet-of-the-kaluak): Intellect buff
<br>[Deviously Deviled Eggs](https://www.wowhead.com/item=204072/deviously-deviled-eggs): Same buff as Banquet but with a cheaper individual price.
<br>[Sizzling Seafood Medley](https://www.wowhead.com/item=197784/sizzling-seafood-medley): Provides haste+mastery which can be more dps than the Intellect food.
<br>[Thousandbone Tongueslicer](https://www.wowhead.com/item=197786/thousandbone-tongueslicer): Provides crit+mastery which can be more dps than the Intellect food.

<br>The secondary food can be better as you acquire more gear, they provide more total stats than the main stat one. Sim your character to see what is best for you.




<br><div id="phials">

## [Phials](#Phials)

</div>

**ST & AoE**

Damage wise, with 100% uptime on all of the Phials and not counting in the downsides their hierarchy is as follows on ST:

- [Iced Phial of Corrupting Rage](https://www.wowhead.com/item=191329/iced-phial-of-corrupting-rage): Default phial unless the fight has too high damage intake or you are at risk of dying. Do not use this in progress fights unless you really need the damage.
- [Phial of Tepid Versatility](https://www.wowhead.com/item=191341/phial-of-tepid-versatility): Has the same value as Corrupting Rage at 60% uptime. Can be worth to play if the damage intake is high.
- [Phial of Elemental Chaos](https://www.wowhead.com/item=191359/phial-of-elemental-chaos): : Generally similar dps throughput as Tepid Versatility, but less defensive benefits.

<br><div id="runes">

## [Runes](#Runes)

</div>

[Hissing Rune](https://www.wowhead.com/item=204973/hissing-rune): Mastery rune<br>
Use this for every situation.

<br><div id="gearing">

# [5.Gearing:](#gearing)

</div>


<div id="stats">
 
## [Stat Priority:](#stats)

</div>

Sim yourself using [Raidbots Top Gear](https://www.raidbots.com/simbot/topgear). Do not follow any stat priorities.

<br><div id="enchants">

## [Enchants](#enchants)

</div>


Weapon - [Sophic Devotion](https://www.wowhead.com/item=200054/enchant-weapon-sophic-devotion?crafting-quality=6)/[Wafting Devotion](https://www.wowhead.com/beta/item=200058/enchant-weapon-wafting-devotion)
<br>Sim between these two options to determine which one is best for your character.
<br>Chest - [Waking Stats](https://www.wowhead.com/item=200030/enchant-chest-waking-stats?crafting-quality=6) Intellect
<br>Cloak - [Graceful Avoidance](https://www.wowhead.com/item=200031/enchant-cloak-graceful-avoidance) Avoidance + Reduced fall damage
<br>Legs - [Frozen Spellthread](https://www.wowhead.com/item=194013/frozen-spellthread?crafting-quality=6) Intellect + Stamina
<br>Wrist - [Devotion of Avoidance](https://www.wowhead.com/item=200021/enchant-bracer-devotion-of-avoidance?crafting-quality=6) Avoidance
<br>Boots - [Watchers Loam](https://www.wowhead.com/item=200020/enchant-boots-watchers-loam) Stamina
<br>Ring - [Devotion of Mastery](https://www.wowhead.com/item=200039/enchant-ring-devotion-of-mastery?crafting-quality=6) You should always sim your own character to determine what enchant to use in this slot.


<br><div id="embellishments">

## [Embellishments](#embellishments)

</div>

If you already have an item with https://www.wowhead.com/item=193555/toxified-armor-patch you should:
- Craft/Upgrade https://www.wowhead.com/item=193452/toxic-thorn-footwraps with your first spark to 486 itemlevel.
- Keep your https://www.wowhead.com/item=193555/toxified-armor-patch item equipped as this doubles the effect of your 486 itemlevel https://www.wowhead.com/item=193452/toxic-thorn-footwraps
- With your next spark you can do one of the following:
	- Craft/Upgrade a https://www.wowhead.com/item=193555/toxified-armor-patch item to 476 itemlevel with the Renown 20 Wyrm Crest and spend your Aspect Crests on other upgrades.
	- Craft/Upgrade a https://www.wowhead.com/item=193555/toxified-armor-patch item to 486 itemlevel with Aspect Crests.


<br>If you don't have an item with https://www.wowhead.com/item=193555/toxified-armor-patch and you don't have the possibility of crafting a Season 2 version of it you can do one of the following:
- Follow the above and craft https://www.wowhead.com/item=193452/toxic-thorn-footwraps first then https://www.wowhead.com/item=193555/toxified-armor-patch after.
- Craft https://www.wowhead.com/item=204710/shadowflame-tempered-armor-patch or https://www.wowhead.com/item=208189/verdant-conduit.
	- https://www.wowhead.com/item=204710/shadowflame-tempered-armor-patch has slightly higher single target damage, but also deals a small amount of self-damage.
	- https://www.wowhead.com/item=208189/verdant-conduit performs slightly worse in single target, but performs much better on aoe.
	- As these are reagent embellishments, you can craft two copies or mix one of each.

The single target DPS difference between https://www.wowhead.com/item=193452/toxic-thorn-footwraps and https://www.wowhead.com/item=204710/shadowflame-tempered-armor-patch / https://www.wowhead.com/item=208189/verdant-conduit is negligible and will just come down to your stats.

The boots have predefined stats while Shadowflame / Verdant can be applied to any leather item where you can choose the stats freely.

What slot and which method you should use will come down to how much gear you have gotten and in what slots, sim it.

Bracers and Belt are often used as they both can be socketed and have a lower stat budget which will be good later on when your other pieces can be upgraded to 489 itemlevel.

<br>Later on you can consider crafting [Elemental Lariat](https://www.wowhead.com/item=193001/elemental-lariat) as it can be better depending on your sim, but it does require you to have a lot of gems.


<br><div id="trinkets">

## [Trinkets](#trinkets)

</div>

Please use Top Gear or Droptimizer on [Raidbots](https://raidbots.com) in order to decide what trinkets to use/farm, but the following list should give you a good idea of some of the trinkets you will want to look out for. The list is in roughly power-level order assuming the highest item level versions of the trinkets.

### ST

- [Balefire Branch](https://www.wowhead.com/ptr-2/item=159630/balefire-branch?bonus=4795&ilvl=489&spec=102)
- [Mirror of Fractured Tomorrows](https://www.wowhead.com/ptr-2/item=207581/mirror-of-fractured-tomorrows?bonus=4795&class=11&ilvl=489&spec=102) - Note that while still good, double on-use loses value and becomes harder to optimally play.
- [Pip's Emerald Friendship Badge](https://www.wowhead.com/ptr-2/item=207168/pips-emerald-friendship-badge?bonus=4795&class=11&ilvl=489&spec=102)
- [Coagulated Genesaur Blood](https://www.wowhead.com/ptr-2/item=110004/coagulated-genesaur-blood?bonus=4795&class=11&ilvl=489&spec=102)
- [Nymue's Unraveling Spindle](https://www.wowhead.com/ptr-2/item=208615/nymues-unraveling-spindle?bonus=4795&class=11&ilvl=489&spec=102)
- [Sea Star](https://www.wowhead.com/ptr-2/item=133201/sea-star?bonus=4795&ilvl=489&spec=102)
- [Belor'relos, the Suncaller](https://www.wowhead.com/ptr-2/item=207172/belorrelos-the-suncaller?bonus=4795&class=11&ilvl=489&spec=102) - Requires you to be in melee to do damage
- [Vessel of Skittering Shadows](https://www.wowhead.com/ptr-2/item=159610/vessel-of-skittering-shadows?bonus=4795&class=11&ilvl=489&spec=102)
- [Oakheart's Gnarled Root](https://www.wowhead.com/ptr-2/item=137306/oakhearts-gnarled-root?bonus=4795&ilvl=489&spec=102)
- [Lady Waycrest's Music Box](https://www.wowhead.com/ptr-2/item=159631/lady-waycrests-music-box?bonus=4795&class=11&ilvl=489&spec=102)
- [Corrupted Starlight](https://www.wowhead.com/ptr-2/item=137301/corrupted-starlight?bonus=4795&ilvl=489&spec=102)
- [Augury of the Primal Flame](https://www.wowhead.com/ptr-2/item=208614/augury-of-the-primal-flame?bonus=4800:4786:1527&ilvl=496&spec=102)
- [Time-Thief's Gambit](https://www.wowhead.com/ptr-2/item=207579/time-thiefs-gambit?bonus=4795&class=11&ilvl=489&spec=102)
- [Ashes of the Embersoul](https://www.wowhead.com/ptr-2/item=207167/ashes-of-the-embersoul?bonus=4795&ilvl=489&spec=102)
- [Caged Horror](https://www.wowhead.com/ptr-2/item=136716/caged-horror?bonus=4795&ilvl=489&spec=102)

### AoE

- [Balefire Branch](https://www.wowhead.com/ptr-2/item=159630/balefire-branch?bonus=4795&ilvl=489&spec=102)
- [Mirror of Fractured Tomorrows](https://www.wowhead.com/ptr-2/item=207581/mirror-of-fractured-tomorrows?bonus=4795&class=11&ilvl=489&spec=102) - Note that while still good, double on-use loses value and becomes harder to optimally play.
- [Pip's Emerald Friendship Badge](https://www.wowhead.com/ptr-2/item=207168/pips-emerald-friendship-badge?bonus=4795&class=11&ilvl=489&spec=102)
- [Coagulated Genesaur Blood](https://www.wowhead.com/ptr-2/item=110004/coagulated-genesaur-blood?bonus=4795&class=11&ilvl=489&spec=102)
- [Sea Star](https://www.wowhead.com/ptr-2/item=133201/sea-star?bonus=4795&ilvl=489&spec=102)
- [Time-Thief's Gambit](https://www.wowhead.com/ptr-2/item=207579/time-thiefs-gambit?bonus=4795&class=11&ilvl=489&spec=102)
- [Nymue's Unraveling Spindle](https://www.wowhead.com/ptr-2/item=208615/nymues-unraveling-spindle?bonus=4795&class=11&ilvl=489&spec=102)
- [Belor'relos, the Suncaller](https://www.wowhead.com/ptr-2/item=207172/belorrelos-the-suncaller?bonus=4795&class=11&ilvl=489&spec=102) - Requires you to be in melee to do damage
- [Augury of the Primal Flame](https://www.wowhead.com/ptr-2/item=208614/augury-of-the-primal-flame?bonus=4800:4786:1527&ilvl=496&spec=102)
- [Vessel of Skittering Shadows](https://www.wowhead.com/ptr-2/item=159610/vessel-of-skittering-shadows?bonus=4795&class=11&ilvl=489&spec=102)
- [Oakheart's Gnarled Root](https://www.wowhead.com/ptr-2/item=137306/oakhearts-gnarled-root?bonus=4795&ilvl=489&spec=102)
- [Lady Waycrest's Music Box](https://www.wowhead.com/ptr-2/item=159631/lady-waycrests-music-box?bonus=4795&class=11&ilvl=489&spec=102)
- [Corrupted Starlight](https://www.wowhead.com/ptr-2/item=137301/corrupted-starlight?bonus=4795&ilvl=489&spec=102)
- [Ashes of the Embersoul](https://www.wowhead.com/ptr-2/item=207167/ashes-of-the-embersoul?bonus=4795&ilvl=489&spec=102)
- [Caged Horror](https://www.wowhead.com/ptr-2/item=136716/caged-horror?bonus=4795&ilvl=489&spec=102)



<br><div id="misc">

# [6. Miscellaneous:](#misc)

</div>


<div id="snapshot">

## [Do our dots snapshot?](#snapshot)

</div>

No, all of our periodic damage (like {{< spell 8921 "Moonfire" >}}, {{< spell 93402 "Sunfire" >}}, {{< spell 202347 "Stellar Flare" >}}) do NOT snapshot, everything is dynamic. That means any dots gain/lose the damage bonus upon entering/leaving the Eclipse that buffs them and whenever any other stat/damage increases are applied/expire.


<br><div id="astral-damage">
 
## [What is Astral damage?](#astral-damage)

</div>

Astral damage is both Arcane and Nature damage. Effects that buff Nature spells also applies to Astral spells, and effects that buff Arcane spells likewise also applies to Astral spells. For example, Solar Eclipse multiplies the damage of all Nature & Astral spells by 1.15x, and Lunar Eclipse multiplies the damage of all Arcane & Astral spells by 1.15x. If you have both eclipses, Astral spells get 1.15 * 1.15 = 1.3225x multiplier, while Nature & Arcane spells get 1.15x.

Mind that class buffs only affect class spells so if a trinket does nature or arcane damage they are not affected by our buffs to these spell schools.


<br><div id="macros">

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

<br><div id="wa">
 
## [Useful WeakAura(s)](#wa)
 
</div>

### **Balance WeakAura Packs**
The following links lead to various balance druid WeakAura packs. These contain everything that's recommended to track to play at a high level. None of these are particular better or more useful than others, and which one you should use is up to your personal preference.

- [Shrom's Ultimate AP Bar](https://wago.io/GzpP7i8ic)
- [Genesis DF Balance Druid](https://wago.io/1HX3XwarK)
- [Oi Balance pack](https://wago.io/OiBalance)

### **Casts until you can cast Starfire**
[Starfire Alerter](https://wago.io/rrtAyRQjF)
See the description of the WA for more details. This is not a required WA but will make it easier to not get into situations where you are wasting a Starfire cast inside Solar Eclipse.

<br><div id="cancel">
 
## [Cancelaura Macros](#cancel)
 
</div>

### **Cancelling Pulsar**

**As of 10.1.5 and forward this no longer represents a relevant gain with the change to Radiant Moonlight increasing the cooldown of Fury of Elune by 5 seconds.**

### **Cancelling Starlord**

**With baseline changes and new set in 10.2, cancelling your Starlord aura is back to being insignificant [(~0.2%)](#sims).**

If you want to engage in this entirely optional method without incurring a dps loss, you should aim to cancel Starlord at any point in an Eclipse window where the buff is currently at less than two seconds, and you are about to use {{< spell 78674 "Starsurge" >}} to prevent overcapping.

```
#showtooltip
/cancelaura Starlord
```

<br><div id="sims">

# [7. Sims:](#sims)

</div>

[Embells 1T](https://www.dreamgrove.gg/balance/sims/embells_1T_10.2.html)
<br>[Embells 6T](https://www.dreamgrove.gg/balance/sims/embells_6T_10.2.html)

[Phials 1T](https://www.dreamgrove.gg/balance/sims/phials_1T_10.2.html)
<br>[Phials 6T](https://www.dreamgrove.gg/balance/sims/phials_6T_10.2.html)

[Runes 1T](https://www.dreamgrove.gg/balance/sims/runes_1T_10.2.html)
<br>[Runes 6T](https://www.dreamgrove.gg/balance/sims/runes_6T_10.2.html)

[Racials 1T](https://www.dreamgrove.gg/balance/sims/races_1T_10.2.html)
<br>[Racials 6T](https://www.dreamgrove.gg/balance/sims/races_6T_10.2.html)

[Tierset 1T](https://www.dreamgrove.gg/balance/sims/tier_1T_10.2.html)
<br>[Tierset 6T](https://www.dreamgrove.gg/balance/sims/tier_6T_10.2.html)

[Prestacking Pulsar](https://www.dreamgrove.gg/balance/sims/prestack_pulsar_1T_10.2.html)
<br>[Proc Pulsar before Incarn on pull](https://www.dreamgrove.gg/balance/sims/proc_pulsar_1T_10.2.html)

[Cancelling Starlord 1T](https://www.dreamgrove.gg/balance/sims/cancelaura_starlord_1T_10.2.html)
<br>[Cancelling Starlord 6T](https://www.dreamgrove.gg/balance/sims/cancelaura_starlord_6T_10.2.html)

[Item strings for simming](https://www.dreamgrove.gg/balance/sims/items.txt)
<br>[T31 Profile](https://www.dreamgrove.gg/balance/sims/T31_profile.txt)

[Current APL](https://github.com/balance-simc/Balance-SimC/blob/master/balance.txt)

<script>const whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true, iconSize: 'small'};</script>
<script src="https://wow.zamimg.com/js/tooltips.js"></script>


