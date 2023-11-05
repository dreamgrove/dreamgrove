---
date: '2023-11-03'
authors: ["Crazymeow"]
published: false
patch: "10.2"
title: Feral Druid 10.2 Compendium
showOnFrontpage: false
sidebarTitle: "Quicklinks"
sidebarContents:  |
  **[1. News](#news)**
 
  **[2. Rotation](#rotation)**
  <br>[Pre-Combat](#precombat)
  <br>[Single Target priority](#st)
  <br>[Berserk/Incarnation rotation](#berserk)
  <br>[AoE priority](#aoe)
 
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
  <br>[What does pandemic refer to?](#pandemic)
  <br>[Macros](#macros)
  <br>[Useful WeakAura(s)](#wa)
   
---

[Changelog](https://github.com/dreamgrove/dreamgrove/commits/master/content/feral/compendium.md)

<div id="news">

# [1. News:](#news)

</div>

## 10.2 News
### Tier Set
> 2p: {{< spell 274838 "Feral Frenzy" >}} grants {{< spell 422751 "Smoldering Frenzy" >}}, increasing all damage you deal by 20% for 8 seconds.

> 4p: {{< spell 274838 "Feral Frenzy's" >}} cooldown is reduced by 15 seconds. During {{< spell 422751 "Smoldering Frenzy" >}}, enemies burn for 10% of damage you deal as Fire over 10 seconds.

This ends up being roughly a ~13% dps gain over no tier. Due to the item level increase going into next tier, its very possible that you'll want to ditch 10.1 4 piece and go with 2+2. You should sim this when you get to that point though. You'll want to get to 10.2 4 piece asap of course. 

Also, its not the cast of {{< spell 274838 "Feral Frenzy" >}} that grants {{< spell 422751 "Smoldering Frenzy" >}}, it is the direct damage hits. This means when you use {{< spell 274838 "Feral Frenzy" >}}, it refreshes back to 8 seconds 5 times, this results in the buff lasting just under 9s in total. {{< spell 274838 "Feral Frenzy's" >}} casted by {{< spell 391528  "Convoke" >}} also proc this effect.

### List of changes

**{{< spell 391881 "Apex Predator's Craving" >}}:**
{{< spell 1079 "Rip" >}} ticks have a 7.2% (was 4%) chance in single target to make next bite free. This chance now gets reduced as {{< spell 1079 "Ripped" >}} targets increases. This comes out to be a gain below 4 targets, and a loss at 4+ targets.

**{{< spell 421442 "Ashamane's Guidance (Incarnation)" >}} is reworked:**
During {{< spell 102543 "Incarnation" >}} and for 30 seconds afterwards, {{< spell 1079 "Rip" >}} and {{< spell 1822 "Rake" >}} cause affected enemies to take 3% increased damage from your abilities. This stacks, coming out to a little over 6% damage taken debuff. This is just strictly worse than {{< spell 390902 "Carnivorous Instincts" >}} and will never be played at its current tuning.

**{{< spell 421432 "Saber Jaws" >}} has been added to replace Cat's Curiosity:** 
- Rank 1: When you spend extra Energy on {{< spell 22568 "Ferocious Bite" >}}, the extra damage is increased by 40%.<br>
- Rank 2: When you spend extra Energy on {{< spell 22568 "Ferocious Bite" >}}, the extra damage is increased by 80%.

Since this only buffs the extra damage portion of bite, at max energy the total damage of {{< spell 22568 "Ferocious Bite" >}} is increased by 20/40%. This does NOT work on free bites from {{< spell 391528  "Convoke" >}} or {{< spell 391881 "Apex Predator's Craving" >}}.

**{{< spell 393771 "Relentless Predator" >}}:**
Instead of reducing the cost of {{< spell 22568 "Ferocious Bite" >}} by 20%, this now reduces its cost by 10%. This effectively kills the talent in all situations. I am expecting this node to be replaced in a future patch.

**{{< spell 391709 "Rampant Ferocity" >}}:**
This got buffed by 10%. Nothing changes about when you select this talent, as the aformentioned {{< spell 391881 "Apex Predator's Craving" >}} nerf at larger target counts hurt the effectiveness of Rampant Ferocity.

**{{< spell 29166 "Innervate" >}}:** is now castable in Cat Form. Rejoice.

<div id="rotation">
 
# [2.Rotation:](#rotation)

</div>

**What is a priority list?**

When reading the priority lists below, you should not think about these as steps to follow in a specific order. At any given point in combat, you should cast the first thing in the list that you are able to cast. As such, you will note that there are some abilities included in the priority lists below that are not chosen as talents in the recommended build. This is not a mistake, but simply indicates the priority of that ability IF you happened to take it for whatever reason. The presence of an ability in a priority list does not mean that you should be talenting into or using that ability, these lines are simply there for completeness. If the length of these lists feels daunting, one might recommend copying them to a separate document and removing lines that do not apply to you, thus making the list a bit more compact.

<div id="precombat">

## [Pre-combat](#precombat)

</div>

**Pre-Combat:**
- Use {{< spell 319454 "Heart of the Wild" >}}
- Use {{< spell 102547 "Prowl" >}}
- Use {{< spell 5217 "Tiger's Fury" >}}
- Use {{< spell 1822 "Rake" >}} from stealth.

<div id="st">

## [Single Target priority](#st)

</div>

**Single Target priority list:**

- Use {{< spell 5217 "Tiger's Fury" >}} if any of the following conditions are met
    - {{< spell 5217 "Tiger's Fury" >}} is not up.
    - You are more than 65 energy from the cap.
    - You have 10.2 2 piece set bonus equipped, and {{< spell 274838 "Feral Frenzy" >}} is ready to be used.
    - You've talented {{< spell 391528  "Convoke the Spirits" >}} and do not have 10.2 tier set equipped. <br> (Using it on CD keeps {{< spell 5217 "Tiger's Fury" >}} and {{< spell 391528  "Convoke" >}} aligned.)
- Without {{< spell 391951 "Unbridled Swarm" >}} talented, use {{< spell 391889 "Adaptive Swarm" >}} when all of these conditions are met:
    - There isn't an {{< spell 391889 "Adaptive Swarm" >}} heading to an enemy target.
    - {{< spell 391889 "Adaptive Swarm" >}} is either not up or it is about to expire with 1 or 2 stacks.
- With {{< spell 391951 "Unbridled Swarm" >}} talented, the conditions change based on the amount of {{< spell 391889 "Adaptive Swarms" >}} you have out:
    - If you have 3 {{< spell 391889 "Adaptive Swarms" >}} with at least 2 stacks out then you will target allies with priority 1 stack > 0 stack > 2 stacks.
    - If you have 2 or fewer {{< spell 391889 "Adaptive Swarms" >}} of at least 2 stacks, cast on your enemy target when swarm is not on them, and is not traveling towards them.
- Use {{< spell 102543 "Incarnation" >}} if it's ready.
- Use {{< spell 106951 "Berserk" >}} if it's ready. 
    - If you're playing 2 minute {{< spell 391528  "Convoke" >}}, you can instead hold {{< spell 106951 "Berserk" >}} for {{< spell 391528  "Convoke" >}} where fight timers are good to do so, especially if you have [Ashes of the Embersoul](https://www.wowhead.com/ptr-2/item=207167/ashes-of-the-embersoul), [Witherbark's Branch](https://www.wowhead.com/ptr-2/item=109999/witherbarks-branch), or will be buffed by an Augmentation Evoker every 2 minutes. Additionally, its always a gain regardless of talents and equipment to line up your last Berserk with a convoke cast if possible.
- Use {{< spell 391528  "Convoke" >}} if all of the following conditions are met:
    - Rip will not fall off during Convoke's channel.
    - Tiger's Fury is up.
    - Smoldering Frenzy is up or you do not have 10.2 4 piece set bonus equipped.
    - You have 0 or 1 combo points OR Smoldering Frenzy would fall off before Convoke ends.
- Use {{< spell 274838 "Feral Frenzy" >}} if all of the following conditions are met:
    - {{< spell 417710 "Dire Fixation" >}} (if talented) is applied to the target.
    - You have less than 2 combo points and are not in {{< spell 102543 "Incarn" >}}/{{< spell 106951 "Berserk" >}}, or under 3 combo points during {{< spell 102543 "Incarn" >}}/{{< spell 106951 "Berserk" >}}.
- Use {{< spell 22568 "Ferocious Bite" >}} if you have a {{< spell 391881 "Apex Predator's Craving" >}} proc.

**If you are in Berserk see [here](#Berserk) as your priorities from this point on change a bit.**

- If you have {{< spell 411344 "Predator Revealed" >}} active from 10.1 4 piece set bonus, 4 combo points and are at least 40 energy away from cap, wait until you passively gain your 5th combo point.
- Use {{< spell 1079 "Rip" >}} when all of these conditions are met:
    - You have at least 4 combo points
    - {{< spell 1079 "Rip" >}} is in pandemic OR all of these conditions are met:
        - You have 10.2 2 or 4 piece set bonus equipped
        - {{< spell 1079 "Rip" >}} has less than 10 seconds remaining
        - Your next gcd will be {{< spell 274838 "Feral Frenzy" >}}
    - {{< spell 1079 "Rip" >}} has less than 2 seconds remaining, or you don't have {{< spell 422751 "Smoldering Frenzy" >}} up. Yes this means {{< spell 1079 "Rip" >}} will sometimes fall off with proper play.
    - {{< spell 5217 "Tiger's Fury" >}} is up, or won't be up before {{< spell 1079 "Rip" >}} expires.
    - {{< spell 319439 "Bloodtalons" >}} (if talented) is up, or won't be up before {{< spell 1079 "Rip" >}} expires.
- Use {{< spell 22568 "Ferocious Bite" >}} when all of these conditions are met:
    - You have at least 4 combo points
    - You have at least 50 energy OR you have {{< spell 393771 "Relentless Predator" >}} talented and at least 45 energy. If you have the combo points, you should wait until you reach these energy thresholds.

**Below this point, skip any spells you've already casted towards {{< spell 319439 "Bloodtalons" >}}, if you have 0 or 1 stacks of {{< spell 319439 "Bloodtalons" >}} remaining.**

- Use {{< spell 16864 "Clearcasting" >}} procs on {{< spell 106830 "Thrash" >}} if all of these conditions are met:
    - {{< spell 106830 "Thrash" >}} is in Pandemic.
    - {{< spell 405300 "Thrashing Claws" >}} is not talented.
    - Dire Fixation (if talented) is already applied to your target.
- Use {{< spell 5221 "Shred" >}} if Dire Fixation (if talented) is not on your target or you have a {{< spell 16864 "Clearcasting" >}} proc.
- Use {{< spell 202028 "Brutal Slash" >}} if it will cap on charges within the next 4 seconds.
- Use {{< spell 58984 "Shadowmeld" >}} followed by {{< spell 1822 "Rake" >}} if all of these conditions are met:
    - You do not have a {{< spell 384667 "Sudden Ambush" >}} proc
    - {{< spell 1822 "Rake" >}} is in pandemic OR you would be upgrading {{< spell 1822 "Rake's" >}} snapshot value.
- Use {{< spell 1822 "Rake" >}} if any of these conditions are met:
    - {{< spell 1822 "Rake" >}} is in pandemic and {{< spell 5217 "Tiger's Fury" >}} is either up, or won't be before {{< spell 1822 "Rake" >}} falls off.
    - You are in stealth
    - You have a {{< spell 384667 "Sudden Ambush" >}} proc and you would be upgrading {{< spell 1822 "Rake's" >}} snapshot value.
- Use Lunar Inspiration {{< spell 155625 "Moonfire" >}} if it is in pandemic.
- Use {{< spell 106830 "Thrash" >}} if it is in pandemic and you do not have {{< spell 405300 "Thrashing Claws" >}} talented.
- Use {{< spell 202028 "Brutal Slash" >}}.
- Use {{< spell 106785 "Swipe" >}} if you have Wild Slashes talented, and Dire Fixation (if talented) is on your target.
- Use {{< spell 5221 "Shred" >}}.
- Clip Lunar Inspiration {{< spell 155625 "Moonfire" >}} if you still need {{< spell 319439 "Bloodtalons" >}}.
- Use {{< spell 106785 "Swipe" >}} if you still need {{< spell 319439 "Bloodtalons" >}}.
- Use {{< spell 1822 "Rake" >}} if you still need {{< spell 319439 "Bloodtalons" >}} and it will not downgrade {{< spell 1822 "Rake's" >}} snapshot value.
- Clip {{< spell 106830 "Thrash" >}} if you still need {{< spell 319439 "Bloodtalons" >}}.

<br>
<div id="berserk">

## [Berserk/Incarnation rotation](#berserk)

</div>

**Berserk ST priority**
- Use {{< spell 1079 "Rip" >}} when all of these conditions are met:
    - You have 5 combo points
    - {{< spell 1079 "Rip" >}} is in pandemic OR all of these conditions are met:
        - You have 10.2 2 or 4 piece set bonus equipped
        - {{< spell 1079 "Rip" >}} has less than 10 seconds remaining
        - Your next gcd will be {{< spell 274838 "Feral Frenzy" >}}
    - {{< spell 1079 "Rip" >}} has less than 2 seconds remaining, or you don't have {{< spell 422751 "Smoldering Frenzy" >}} up. Yes this means {{< spell 1079 "Rip" >}} will sometimes fall off with proper play.
- Use {{< spell 22568 "Ferocious Bite" >}} with 5 combo points
- Use {{< spell 102547 "Prowl" >}} or {{< spell 58984 "Shadowmeld" >}} followed by {{< spell 1822 "Rake" >}} if it won't disrupt {{< spell 319439 "Bloodtalons" >}} and any of these conditions are true:
    - {{< spell 1822 "Rake" >}} is not applied or is in pandemic range
    - You don't have {{< spell 384667 "Sudden Ambush" >}} AND a stealth {{< spell 1822 "Rake" >}} would be upgrading its snapshot
- Use {{< spell 1822 "Rake" >}} if it won't disrupt {{< spell 319439 "Bloodtalons" >}} and any of these conditions are true:
    - {{< spell 1822 "Rake" >}} is not applied or is in pandemic range
    - You have a {{< spell 384667 "Sudden Ambush" >}} proc AND a stealth {{< spell 1822 "Rake" >}} would be upgrading its snapshot
- Use {{< spell 5221 "Shred" >}} if it would proc {{< spell 319439 "Bloodtalons" >}}.
- Use {{< spell 202028 "Brutal Slash" >}} if it would proc {{< spell 319439 "Bloodtalons" >}}.
- Use Lunar Inspiration {{< spell 155625 "Moonfire" >}} if it would proc {{< spell 319439 "Bloodtalons" >}}. This is true even if it means clipping moonfire early.
- Use {{< spell 106830 "Thrash" >}} if it would proc {{< spell 319439 "Bloodtalons" >}}, unless you have {{< spell 405300 "Thrashing Claws" >}} talented.
- Use Lunar Inspiration {{< spell 155625 "Moonfire" >}} if it is not applied or is in pandemic range.
- Use {{< spell 202028 "Brutal Slash" >}} if you have 2 or 3 charges
- Use {{< spell 5221 "Shred" >}}

<div id="aoe">

## [AoE priority](#aoe)

</div>

**AoE priority list(2+ targets):**
**Special Note: Try to use single-target spells on higher priority/higher healthed mobs, or mobs that have Dire Fixation on them.**
- Use {{< spell 5217 "Tiger's Fury" >}} if any of the following conditions are met:
    - You've talented {{< spell 391528  "Convoke the Spirits" >}} and do not have 10.2 tier set equipped. (Using it on CD keeps {{< spell 5217 "Tiger's Fury" >}} and {{< spell 391528  "Convoke" >}} aligned.)
    - {{< spell 5217 "Tiger's Fury" >}} is not up.
    - You are more than 65 energy from the cap.
    - You have 10.2 2 piece set bonus equipped, and {{< spell 274838 "Feral Frenzy" >}} is ready to be used.
- Without {{< spell 391951 "Unbridled Swarm" >}} talented, use {{< spell 391889 "Adaptive Swarm" >}} when all of these conditions are met:
    - There isn't an {{< spell 391889 "Adaptive Swarm" >}} heading to an enemy target.
    - {{< spell 391889 "Adaptive Swarm" >}} is not up on a target.
- With {{< spell 391951 "Unbridled Swarm" >}} talented, use {{< spell 391889 "Adaptive Swarm" >}} as often as you can with this priority:
    - An enemy target has 2 stacks of {{< spell 391889 "Adaptive Swarm" >}}.
    - An enemy target has 1 stack of {{< spell 391889 "Adaptive Swarm" >}}.
    - An enemy target does not have {{< spell 391889 "Adaptive Swarm" >}}.
- Use {{< spell 102543 "Incarnation" >}}
- Use {{< spell 106951 "Berserk" >}}
- Use {{< spell 391528  "Convoke" >}} if all of the following conditions are met:
    - Your {{< spell 1079 "Rips" >}} will not fall off during {{< spell 391528  "Convoke's" >}} channel.
    - {{< spell 5217 "Tiger's Fury" >}} is up.
    - {{< spell 422751 "Smoldering Frenzy" >}} is up or you do not have 10.2 4 piece set bonus equipped.
    - You have 0 or 1 combo points OR {{< spell 422751 "Smoldering Frenzy" >}} would fall off before {{< spell 391528  "Convoke" >}} ends.
- Use {{< spell 22568 "Ferocious Bite" >}} if you have a {{< spell 391881 "Apex Predator's Craving" >}} proc and you either don't have {{< spell 285381 "Primal Wrath" >}} talented or {{< spell 202031 "Sabertooth" >}} up.
- Use {{< spell 285381 "Primal Wrath" >}} if you have 5 combo points, or at least 4 combo points and not in {{< spell 106951 "Berserk" >}}/{{< spell 102543 "Incarnation" >}} and any of these conditions are met:
    - {{< spell 1079 "Rips" >}} from {{< spell 285381 "Primal Wrath" >}} are in pandemic
    - You have Tear Open Wounds talented
    - You do not have Rampant Ferocity talented, and there are at least 5 targets in range
- Use {{< spell 22568 "Ferocious Bite" >}} if you have 5 combo points, or at least 4 combo points and not in {{< spell 106951 "Berserk" >}}/{{< spell 102543 "Incarnation" >}}.

**Below this point, skip any spells you've already casted towards {{< spell 319439 "Bloodtalons" >}} if inside {{< spell 106951 "Berserk" >}}/{{< spell 102543 "Incarnation" >}} or if you have 0 or 1 stacks of {{< spell 319439 "Bloodtalons" >}}.**

- Use {{< spell 202028 "Brutal Slash" >}} if it will cap on charges within the next 4 seconds.
- Use {{< spell 106830 "Thrash" >}} if in pandemic range, {{< spell 405300 "Thrashing Claws" >}} is not talented and any of these conditions:
    - You have a {{< spell 16864 "Clearcasting" >}} proc
    - You either do not have Double-Clawed Rake talented or {{< spell 384667 "Sudden Ambush" >}} isn't up
- Use {{< spell 102547 "Prowl" >}} or {{< spell 58984 "Shadowmeld" >}} followed by {{< spell 1822 "Rake" >}} on a target where {{< spell 1822 "Rake" >}} is either not applied or in pandemic range
- Use {{< spell 102547 "Prowl" >}} or {{< spell 58984 "Shadowmeld" >}} followed by {{< spell 1822 "Rake" >}} on a target where {{< spell 1822 "Rake" >}} does not have a {{< spell 390772 "Pouncing Strikes" >}} snapshot
- Use {{< spell 1822 "Rake" >}} on a target with either of these conditions met:
    - {{< spell 1822 "Rake" >}} is not applied or is in pandemic range
    - You have {{< spell 384667 "Sudden Ambush" >}} up and can upgrade the snapshot value of a {{< spell 1822 "Rake" >}}
- Use {{< spell 106830 "Thrash" >}} if in pandemic range and {{< spell 405300 "Thrashing Claws" >}} is not talented.
- Use {{< spell 202028 "Brutal Slash" >}}
- Use {{< spell 106785 "Swipe" >}} if there are 5 or more targets
- Use Lunar Inspiration {{< spell 155625 "Moonfire" >}} on a target without {{< spell 155625 "Moonfire" >}} or if {{< spell 155625 "Moonfire" >}} is in pandemic range and there are less than 5 targets.
- Use {{< spell 106785 "Swipe" >}}.
- Use {{< spell 5221 "Shred" >}} if {{< spell 384667 "Sudden Ambush" >}} is not up and either Dire Fixation is talented or there are fewer than 4 targets.
- Use {{< spell 106830 "Thrash" >}}.
- Use Lunar Inspiration {{< spell 155625 "Moonfire" >}} if there is a target without {{< spell 155625 "Moonfire" >}} if you still need {{< spell 319439 "Bloodtalons" >}}.
- Use {{< spell 5221 "Shred" >}} if you still need {{< spell 319439 "Bloodtalons" >}}
- Use Lunar Inspiration {{< spell 155625 "Moonfire" >}} on the target with the lowest duration if you still need {{< spell 319439 "Bloodtalons" >}}.
- Use {{< spell 1822 "Rake" >}} ideally on a target where the new snapshot is at least the same strength as the applied {{< spell 1822 "Rake" >}} if you still need {{< spell 319439 "Bloodtalons" >}}.


<div id="talents">

# [3.Talents:](#talents)

</div>

## Talents for different target counts
[Single target](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>[M+ Talents Cookie Cutter](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>[Sustained AoE](https://raidbots.com/simbot/render/talents/?bgcolor=000000)


## Raid Talents
[Pure single target(Kazzara, Amalgation no cleave, Rashok, Magmorax)](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>[Two target cleave(Experiments Mythic)](https://www.raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>[Amalgamation](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>[Sustained AoE with ST(Assault of the Zaqali, Zskarn)](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>[Single target with burst AoE(Echo of Neltharion, Sarkareth)](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>[Echo of Neltharion Mythic](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>[Mythic Sarkareth](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>From a progression perspective it is better to single target down the big add, if your guild is having trouble killing the adds you could swap <input here>

## Dungeon Talents
The following are dungeon talent builds that will always serve you well but mind that there can be some variations based on your group comp or affixes. Mind that while all these builds use Moons, FoE will result in about the same dps. FoE will often not align with Pulsar which can make it annoying to play with.
  
[Cookie cutter every dungeon build](https://raidbots.com/simbot/render/talents/?bgcolor=000000)

<br>[Cookie cutter with Hibernate for Incorporeal](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>[If you really need both Hibernate and Remove Corruption](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
<br>[More AoE](https://raidbots.com/simbot/render/talents/?bgcolor=000000)
### Dungeon Druid Tree Considerations

- Ursine Vigor, Well-Honed Instincts and Improved Stampeding Roar are the major competing talents. Ursine Vigor should be taken if you need it to survive certain abilities. Well-Honed Instincts is always on 1 point but a 2nd can be taken if you rarely/never use Bear Form. Improved Stampeding Roar is extremely useful in indoor dungeons and in spiteful weeks.
- Remove Corruption should be taken in Afflicted weeks and can be taken in every dungeon except Vortex Pinnacle if your group is lacking decurse/poison dispel.
- Cyclone has basically no use other than stopping Bursting and can be replaced with anything else(which also won't have any use).
- Hibernate can be used for the Incorporeal affix.
- All other talents in the druid tree are more or less set.


<div id="consumables">

# [4.Consumables:](#consumables)

</div>


<div id="potions">

## [Potions](#Potions)

</div>


[Elemental Potion of Ultimate Power](https://www.wowhead.com/item=191383/elemental-potion-of-ultimate-power) for every situation


<div id="food">

## [Food](#food)

</div>


[Grand Banquet of the Kalu'ak](https://www.wowhead.com/item=197794/grand-banquet-of-the-kaluak), or [Deviously Deviled Eggs](https://www.wowhead.com/item=204072/deviously-deviled-eggs) giving the same buff with a cheaper individual price.
<br>You can also use secondary food such as [Feisty Fish Sticks](https://www.wowhead.com/item=197782/feisty-fish-sticks) or [Sizzling Seafood Medley](https://www.wowhead.com/item=197784/sizzling-seafood-medley) or [Thousandbone Tongueslicer](https://www.wowhead.com/item=197786/thousandbone-tongueslicer) for a small dps gain. Sim your character to see what is best for you.


<div id="phials">

## [Phials](#Phials)

</div>

Phials:

- [Iced Phial of Corrupting Rage](https://www.wowhead.com/item=191329/iced-phial-of-corrupting-rage): Default phial unless the fight has too high damage intake or you are at risk of dying.
- [Phial of Tepid Versatility](https://www.wowhead.com/item=191341/phial-of-tepid-versatility): Recommended phial if the fight has high damage intake or you are at risk of dying.
- [Phial of Elemental Chaos](https://www.wowhead.com/item=191359/phial-of-elemental-chaos): Generally similar dps throughput as Tepid Versatility, but less defensive benefits. 

<div id="runes">

## [Runes](#Runes)

</div>

I apologize for being annoying but, sim your character for the most accurate answer. Generally {{< spell 391528  "Convoke" >}} builds do not want to play [Howling Rune](https://www.wowhead.com/item=194819/howling-rune) if that is any consolation-but even that's not a guarantee. Make sure you select Rune (stat) (Main Hand) else it may not sim properly. ie: Buzzing (Crit) (Main Hand). Crit is the default setting.

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

Weapon - [Wafting Devotion](https://www.wowhead.com/item=200058/enchant-weapon-wafting-devotion) or [Sophic Devotion](https://www.wowhead.com/item=200054/enchant-weapon-sophic-devotion?crafting-quality=6) Sim these two options to see which is best for your character.
<br>Chest - [Waking Stats](https://www.wowhead.com/item=200030/enchant-chest-waking-stats?crafting-quality=6)
<br>Cloak - [Graceful Avoidance](https://www.wowhead.com/item=200031/enchant-cloak-graceful-avoidance) or [Homebound Speed](https://www.wowhead.com/item=199948/enchant-cloak-homebound-speed) 
<br>Legs - [Fierce Armor Kit](https://www.wowhead.com/item=193565/fierce-armor-kit) or [Lambent Armor Kit](https://www.wowhead.com/item=204702/lambent-armor-kit)
<br>Wrist - [Devotion of Avoidance](https://www.wowhead.com/item=200021/enchant-bracer-devotion-of-avoidance?crafting-quality=6) or [Devotion of Speed](https://www.wowhead.com/item=199939/enchant-bracer-devotion-of-speed)
<br>Boots - [Watchers Loam](https://www.wowhead.com/item=199936/enchant-boots-watchers-loam) or [Plainsrunner's Breeze](https://www.wowhead.com/ptr-2/item=199934/enchant-boots-plainsrunners-breeze)
<br>Ring -  You should always sim your own character to determine what enchant to use in this slot. Depending on your gear, any of the four secondaries can be best for you.


<div id="embellishments">

## [Embellishments](#embellishments)

</div>

For Embellishments we craft [Undulating Sporecloak](https://www.wowhead.com/ptr-2/item=205025/undulating-sporecloak) paired with [Shadowflame-Tempered Armor Patch](https://www.wowhead.com/ptr-2/item=204710/shadowflame-tempered-armor-patch). Once you have all of your gems, [Elemental Lariat](https://www.wowhead.com/item=193001/elemental-lariat) supersedes [Shadowflame-Tempered Armor Patch](https://www.wowhead.com/ptr-2/item=204710/shadowflame-tempered-armor-patch).

**Crafting order**

- [Undulating Sporecloak](https://www.wowhead.com/ptr-2/item=205025/undulating-sporecloak). This is our highest damage throughput option, and also comes with a fantastic defensive component on a low-budget item slot. Don't think too hard and just craft this first, its truly a no-brainer.
- Sim yourself to see which leather armor slot best pairs with [Shadowflame-Tempered Armor Patch](https://www.wowhead.com/ptr-2/item=204710/shadowflame-tempered-armor-patch). If you refuse to sim, put it on bracers.
- Sim yourself for all non-embellished crafts on [Raidbots](https://www.raidbots.com/simbot/droptimizer). Rings are particularly notable early on due to them coming with a socket already applied.


<div id="trinkets">

## [Trinkets](#trinkets)

</div>

Please use Top Gear or Droptimizer on [Raidbots](https://raidbots.com) in order to decide what trinkets to use/farm, but the following list should give you a good idea of some of the trinkets you will want to look out for. The list is in roughly power-level order assuming the highest item level versions of the trinkets. Acquire [Witherbark's Branch](https://www.wowhead.com/ptr-2/item=109999/witherbarks-branch) asap.
### To use in Raid

- [Witherbark's Branch](https://www.wowhead.com/ptr-2/item=109999/witherbarks-branch)
- [Cataclysmic Signet Brand](https://www.wowhead.com/ptr-2/item=207166/cataclysmic-signet-brand)
- [Coiled Serpent Idol](https://www.wowhead.com/ptr-2/item=207175/coiled-serpent-idol)
- [Accelerating Sandglass](https://www.wowhead.com/item=207566/accelerating-sandglass)
- [Pip's Emerald Friendship Badge](https://www.wowhead.com/ptr-2/item=207168/pips-emerald-friendship-badge)
- [Porcelain Crab](https://www.wowhead.com/ptr-2/item=133192/porcelain-crab)
  
### To use in Dungeons

- [Witherbark's Branch](https://www.wowhead.com/ptr-2/item=109999/witherbarks-branch)
- [Pip's Emerald Friendship Badge](https://www.wowhead.com/ptr-2/item=207168/pips-emerald-friendship-badge)
- [Porcelain Crab](https://www.wowhead.com/ptr-2/item=133192/porcelain-crab)
- [Bandolier of Twisted Blades](https://www.wowhead.com/ptr-2/item=207165/bandolier-of-twisted-blades)
- [Accelerating Sandglass](https://www.wowhead.com/item=207566/accelerating-sandglass)
<br><br>

<div id="misc">

# [6. Miscellaneous:](#misc)

</div>

<div id="snapshot">

## [What is snapshotting?](#snapshot)

</div>

Snapshotting is when a buff that is present when a bleed is applied is maintained over the duration of the bleed, as opposed to buffing dots while the buff is up. For instance, if you {{< spell 1822 "Rake" >}} a target, and then press {{< spell 5217 "Tiger's Fury" >}}, the {{< spell 1822 "Rake" >}} will not be buffed by {{< spell 5217 "Tiger's Fury" >}}. However, if you {{< spell 5217 "Tiger's Fury" >}} and then {{< spell 1822 "Rake" >}}, that {{< spell 1822 "Rake" >}} will be amplified by {{< spell 5217 "Tiger's Fury" >}} even after {{< spell 5217 "Tiger's Fury" >}} falls off.

Rake snapshots {{< spell 5217 "Tiger's Fury" >}} and Stealth (including {{< spell 384667 "Sudden Ambush" >}}, see: {{< spell 390772 "Pouncing Strikes" >}})
<br>Rip snapshots {{< spell 5217 "Tiger's Fury" >}} and {{< spell 319439 "Bloodtalons" >}}
<br>Thrash snapshots {{< spell 5217 "Tiger's Fury" >}} and {{< spell 236068 "Moment of Clarity">}}
<br>Moonfire (Lunar Inspiration) snapshots {{< spell 5217 "Tiger's Fury" >}}

If you have a Weakaura that tracks snapshot strength, it works as follows:
<br>Green/higher than 100: Reapplying the bleed now would make it stronger
<br>Grey/100: Reapplying the bleed now would keep it the same strength
<br>Red/lower than 100: Reapplying the bleed now would make it weaker

Generally you try to maintain the strongest bleeds you can as much as possible, and the rotation above reflects this.

<div id="pandemic">

## [What does pandemic refer to?](#pandemic)

</div>

Pandemic is a mechanic that most damage-over-time spells have. When you cast a damage-over-time spell such as Rake while it's already applied to the target, the dots duration gets extended by the amount of time remaining on the dot. This extension is capped to 30% of the dots duration. For example, lets say you have a dot that has a 10 second duration. If you recast this dot while it has 2 seconds left, its new duration is 12 seconds. If you recast it again while it has 8 seconds left, its new duration is 13 seconds, because 30% of 10 seconds is 3 seconds. Pandemic got its name from an old warlock passive with the same effect, before it became a baseline feature of damage-over-time spells.

<div id="macros">

## [Macros](#macros)

</div>
None of these macros are required by any means, just a few that can be useful for some people.

**Regrowth in Cat Form macro:**

```
#showtooltip Regrowth
/run if InCombatLockdown() then SetCVar("autounshift",0) end
/cast [@mouseover, help] [help] [@player] Regrowth
/console autounshift 1
```

**Macro combining Lunar Inspiration {{< spell 155625 "Moonfire" >}} and {{< spell 391528  "Convoke" >}} to one bind:**

```
#showtooltip
/cast [known: Lunar Inspiration] Moonfire; [known: Convoke the Spirits] Convoke the Spirits
```
The idea behind this macro is that there are no talent builds that play both of these things.

**Ursol's Vortex @cursor macro:**

```
#showtooltip
/cast [@cursor] Ursol's Vortex
```

**Trinket macro:**

If you are using an on-use trinket/weapon that should go along with your cooldowns, use the following macro: (/13 for top trinket slot, /14 for bottom trinket slot and /16 for weapon.)
```
#showtooltip
/use 13
/use 14
/use 16
/cast Berserk
```
<br>
<div id="wa">

## [Useful WeakAura(s)](#wa)
 
</div>

### **Feral Weakaura Packs**
The following links lead to various feral druid weakaura packs. These contain everything that's recommended to track to play at a high level. None of these are particular better or more useful than others, and which one you should use is up to your personal preference.
 
- [by Drufearr](https://wago.io/us2RURgE6) 
- [by Chips](https://wago.io/WkTBZuH3y) 
- [by Fore](https://wago.io/H1tFNCh-t) 
- [by Cheesey](https://wago.io/18VspFroU)  
- [variant by Cheesey](https://wago.io/H3yjY1gs1)  
- [by Guiltyas](https://wago.io/OaJQX6khW)

### **Commonly used WeakAuras**
[Feral Bleed Power by Oi](https://wago.io/qYnbZzlmP)
See the description of the WA for more details. This is not a required WA but will make it easier to track the power of your next bleed compared to the currently active one.

[Feral Snapshots by Enth](https://www.curseforge.com/wow/addons/feralsnapshots)
An addon alternative. See the description for more details. This can also show snapshot details on your enemy nameplates (default and plater) or personal resource display.

[Apex Predator's Craving by Marvel](https://wago.io/KzSX7dDMM)
Alerts you when you have an {{< spell 391881 "Apex Predator's Craving" >}} (free bite) proc with a glowing icon and a sound.

[Adaptive Swarm Helper by KnewOne](https://wago.io/0P93t1-nG)
See the description of the WA for more details. This will assist you with using Adaptive Swarm, including Unbridled Swarm support for ally targeting.

[Bloodtalons Tracker from Fore's pack](https://wago.io/cQkL9nrAw)
This tracks your progress towards procing {{< spell 319439 "Bloodtalons" >}}, showing the 4 second timer for each spell you cast towards it.

</div>

 
<script>const whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true, iconSize: 'small'};</script>
<script src="https://wow.zamimg.com/js/tooltips.js"></script>
