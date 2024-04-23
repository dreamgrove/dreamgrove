---
date: '2023-11-07'
authors: ["Crazymeow, Cheesey"]
published: true
patch: "10.2.6"
description: Everything you need to know about Feral Druid
title: Feral Druid Season 4 Compendium
showOnFrontpage: false
sidebarTitle: "Quicklinks"
sidebarContents:  |
  **[1. News](#news)**
 
  **[2. Rotation](#rotation)**
  <br>[Pre-Combat](#precombat)
  <br>[Single Target priority](#st)
  <br>[AoE priority](#aoe)
 
  **[3. Talents](#talents)**
  <br>[Raid Talents](#raidtalents)
  <br>[Raid Talent Customisation](#raidcustomisation)
  <br>[Raid Class Tree](#raidclasstree)
  <br>[Dungeon Talents](#dungeontalents)
  <br>[M+ Talent Customisation](#m+)
  <br>[M+ Class Tree](#m+classtree)
 
  **[4.Consumables](#consumables)**
  <br>[Potions](#potions)
  <br>[Food](#food)
  <br>[Phials](#phials)
  <br>[Runes](#runes)
 
  **[5. Gearing](#gearing)**
  <br>[Stats](#stats)
  <br>[Enchants](#enchants)
  <br>[Dinar/Bullion](#dinar)
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

## Season 4 News

Nothing is changing for Feral Druids in terms of gameplay or talents, but the Dinar system is returning in season 4 with the new currency [Antique Bronze Bullion](https://www.wowhead.com/ptr-2/item=213089/antique-bronze-bullion). For more information on how to spend these, go [here](#dinar)



<br>
<div id="rotation">
 
# [2.Rotation:](#rotation)

</div>

**What is a priority list?**

When reading the priority lists below, you should not think about these as steps to follow in a specific order. At any given point in combat, you should cast the first thing in the list that you are able to cast.

The way this section is written is very formulaic and has the same structure as the Action Priority List (APL) used in sims. If you need a more digestable format, try [WoWHead's guide](https://www.wowhead.com/guide/classes/druid/feral/rotation-cooldowns-pve-dps#single-target) written by Guilty
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

**Select which talents you have talented to filter the priority list:**

{{< checkbox id="Feral Frenzy" spell=274838 checked=true >}}Feral Frenzy{{< /checkbox >}}
{{< checkbox id="Convoke the Spirits" spell=391528 checked=true >}}Convoke the Spirits{{< /checkbox >}}
{{< checkbox id="Adaptive Swarm" spell=391889 checked=true radio="Adaptive Swarm" >}}Adaptive Swarm{{< /checkbox >}}
{{< checkbox id="Unbridled Swarm" spell=391951 radio="Adaptive Swarm" >}}Unbridled Swarm{{< /checkbox >}}<br>
{{< checkbox id="Incarnation" spell=102543 >}}Incarnation{{< /checkbox >}}
{{< checkbox id="Lunar Inspiration" spell=155580 >}}Lunar Inspiration{{< /checkbox >}}
{{< checkbox id="Apex Predator's Craving" spell=391881 checked=true >}}Apex Predator's Craving{{< /checkbox >}}<br>
{{< checkbox id="Bloodtalons" spell=319439 checked=true >}}Bloodtalons{{< /checkbox >}}
{{< checkbox id="Relentless Predator" spell=393771 >}}Relentless Predator{{< /checkbox >}}
{{< checkbox id="Thrashing Claws" spell=405300 >}}Thrashing Claws{{< /checkbox >}}
{{< checkbox id="Sudden Ambush" spell=384667 checked=true >}}Sudden Ambush{{< /checkbox >}}<br>
{{< checkbox id="Brutal Slash" spell=202028 checked=true radio="Brutal Slash" >}}Brutal Slash{{< /checkbox >}}
{{< checkbox id="Wild Slashes" spell=390864 radio="Brutal Slash" >}}Wild Slashes{{< /checkbox >}}
{{< checkbox id="Shadowmeld" spell=58984 >}}Shadowmeld{{< /checkbox >}}
{{< checkbox id="Dire Fixation" spell=417710 checked=true >}}Dire Fixation{{< /checkbox >}}
{{< checkbox id="T31 2P" checked=true >}}T31 2P{{< /checkbox >}}
{{< checkbox id="T31 4P" checked=true >}}T31 4P{{< /checkbox >}}


**Single Target priority list:**

- Use {{< spell 5217 "Tiger's Fury" >}} if any of the following conditions are met
    - {{< spell 5217 "Tiger's Fury" >}} is not up.
    - You are more than 65 energy from the cap.
    - {{< cbtext id="T31 2P" >}}{{< spell 274838 "Feral Frenzy" >}} is ready to be used.{{< /cbtext >}}
    - {{< cbtext id="T31 4P" negate="true" >}}You've talented {{< spell 391528  "Convoke the Spirits" >}} (This keeps {{< spell 5217 "Tiger's Fury" >}} and {{< spell 391528  "Convoke" >}} aligned.){{< /cbtext >}}
- {{< cbtext id="Adaptive Swarm" >}} Use {{< spell 391889 "Adaptive Swarm" >}} when all of these conditions are met:{{< /cbtext >}}
    - There isn't an {{< spell 391889 "Adaptive Swarm" >}} heading to an enemy target.
    - {{< spell 391889 "Adaptive Swarm" >}} is either not up or it is about to expire with 1 or 2 stacks.
- {{< cbtext id="Unbridled Swarm" >}}{{< spell 391889 "Adaptive Swarm" >}} conditions change based on the amount of {{< spell 391889 "Adaptive Swarms" >}} you have out:{{< /cbtext >}}
    - If you have 3 {{< spell 391889 "Adaptive Swarms" >}} with at least 2 stacks out then you will target allies with priority 1 stack > 0 stack > 2 stacks.
    - If you have 2 or fewer {{< spell 391889 "Adaptive Swarms" >}} of at least 2 stacks, cast on your enemy target when swarm is not on them, and is not traveling towards them.
- {{< cbtext id="Incarnation" >}}Use {{< spell 102543 "Incarnation" >}} if it's ready.{{< /cbtext >}}
- {{< cbtext id="Incarnation" negate="true" >}}Use {{< spell 106951 "Berserk" >}} if it's ready.{{< /cbtext >}}
    - {{< cbtext id="Convoke the Spirits" >}} You can instead hold {{< spell 106951 "Berserk" >}} for {{< spell 391528  "Convoke" >}} where fight timers are good to do so, or always if you have [Ashes of the Embersoul](https://www.wowhead.com/item=207167/ashes-of-the-embersoul?bonus=4800:4786:1517:9575&ilvl=486&spec=102), [Witherbark's Branch](https://www.wowhead.com/item=109999/witherbarks-branch?bonus=4786:9879:9573&class=11&ilvl=480&spec=103), or will be buffed by an Augmentation Evoker every 2 minutes. Additionally, its always a gain regardless of talents and equipment to line up your last {{< spell 106951 "Berserk" >}} with a convoke cast if possible.{{< /cbtext >}}
- {{< cbtext id="Convoke the Spirits" >}}Use {{< spell 391528  "Convoke" >}} if all of the following conditions are met:{{< /cbtext >}}
    - {{< spell 1079 "Rip" >}} will not fall off during Convoke's channel.
    - {{< spell 5217 "Tiger's Fury" >}} is up.
    - {{< cbtext id="T31 4P" >}}{{< spell 422751 "Smoldering Frenzy" >}} is up{{< /cbtext >}}
    - {{< cbtext id="T31 2P" >}}You have 0 or 1 combo points OR {{< spell 422751 "Smoldering Frenzy" >}} would fall off before Convoke ends.{{< /cbtext >}}
    - {{< cbtext id="T31 2P" negate="true" >}}You have 0 or 1 combo points{{< /cbtext >}}
- {{< cbtext id="Feral Frenzy" >}}Use {{< spell 274838 "Feral Frenzy" >}} if all of the following conditions are met:{{< /cbtext >}}
    - {{< cbtext id="Dire Fixation" >}}{{< spell 417710 "Dire Fixation" >}} is applied to the target.{{< /cbtext >}}
    - You have less than 2 combo points and are not in {{< spell 102543 "Incarn" >}}/{{< spell 106951 "Berserk" >}}, or under 3 combo points during {{< spell 102543 "Incarn" >}}/{{< spell 106951 "Berserk" >}}.
- {{< cbtext id="Apex Predator's Craving" >}}Use {{< spell 22568 "Ferocious Bite" >}} if you have a {{< spell 391881 "Apex Predator's Craving" >}} proc.{{< /cbtext >}}

**If you are in {{< spell 106951 "Berserk" >}} check this {{< checkbox id="Berserk" spell=106951 >}}Berserk{{< /checkbox >}} as your priorities from here on out change a bit.**

- {{< cbtext id="Berserk" negate="true" >}}**Standard Priority**{{< /cbtext >}}
    - Use {{< spell 1079 "Rip" >}} when all of these conditions are met:
        - You have at least 4 combo points
        - {{< cbtext id="T31 2P" >}}{{< spell 1079 "Rip" >}} is in pandemic OR all of these conditions are met:{{< /cbtext >}}
            - {{< spell 1079 "Rip" >}} has less than 10 seconds remaining
            - Your next gcd will be {{< spell 274838 "Feral Frenzy" >}}
        - {{< cbtext id="T31 2P" negate="true" >}}{{< spell 1079 "Rip" >}} is in pandemic{{< /cbtext >}}
        - {{< cbtext id="T31 2P" >}}{{< spell 1079 "Rip" >}} has less than 2 seconds remaining, or you don't have {{< spell 422751 "Smoldering Frenzy" >}} up. Yes this means {{< spell 1079 "Rip" >}} will sometimes fall off with proper play.{{< /cbtext >}}
        - {{< spell 5217 "Tiger's Fury" >}} is up, or won't be up before {{< spell 1079 "Rip" >}} expires.
        - {{< cbtext id="Bloodtalons">}}{{< spell 319439 "Bloodtalons" >}} is up, or won't be up before {{< spell 1079 "Rip" >}} expires.{{< /cbtext >}}
    - Use {{< spell 22568 "Ferocious Bite" >}} when all of these conditions are met:
        - You have at least 4 combo points
        - {{< cbtext id="Relentless Predator" negate="true" >}}You have at least 50 energy. If you have the combo points, you should wait until you reach these energy thresholds.{{< /cbtext >}}
        - {{< cbtext id="Relentless Predator" >}}You have at least 45 energy. If you have the combo points, you should wait until you reach these energy thresholds.{{< /cbtext >}}
    - {{< cbtext id="Bloodtalons" >}}**Below this point, skip any spells you've already casted towards {{< spell 319439 "Bloodtalons" >}}, if you have 0 or 1 stacks of {{< spell 319439 "Bloodtalons" >}} remaining.**{{< /cbtext >}}
    - {{< cbtext id="Thrashing Claws" negate="true" >}}Use {{< spell 16864 "Clearcasting" >}} procs on {{< spell 106830 "Thrash" >}} if all of these conditions are met:{{< /cbtext >}}
        - {{< spell 106830 "Thrash" >}} is in Pandemic.
        - {{< cbtext id="Dire Fixation" >}}{{< spell 417710 "Dire Fixation" >}} is already applied to your target.{{< /cbtext >}}
    - {{< cbtext id="Dire Fixation" >}}Use {{< spell 5221 "Shred" >}} if {{< spell 417710 "Dire Fixation" >}} is not on your target or you have a {{< spell 16864 "Clearcasting" >}} proc.{{< /cbtext >}}
    - {{< cbtext id="Dire Fixation" negate="true" >}}Use {{< spell 5221 "Shred" >}} if you have a {{< spell 16864 "Clearcasting" >}} proc.{{< /cbtext >}}
    - {{< cbtext id="Brutal Slash" >}}Use {{< spell 202028 "Brutal Slash" >}} if it will cap on charges within the next 4 seconds.{{< /cbtext >}}
    - {{< cbtext id="Shadowmeld" >}}Use {{< spell 58984 "Shadowmeld" >}} followed by {{< spell 1822 "Rake" >}} if all of these conditions are met:{{< /cbtext >}}
        - {{< cbtext id="Sudden Ambush" >}}You do not have a {{< spell 384667 "Sudden Ambush" >}} proc{{< /cbtext >}}
        - {{< spell 1822 "Rake" >}} is in pandemic OR you would be upgrading {{< spell 1822 "Rake's" >}} snapshot value.
    - Use {{< spell 1822 "Rake" >}} if any of these conditions are met:
        - {{< spell 1822 "Rake" >}} is in pandemic and {{< spell 5217 "Tiger's Fury" >}} is either up, or won't be before {{< spell 1822 "Rake" >}} falls off.
        - You are in stealth
        - {{< cbtext id="Sudden Ambush" >}}You have a {{< spell 384667 "Sudden Ambush" >}} proc and you would be upgrading {{< spell 1822 "Rake's" >}} snapshot value.{{< /cbtext >}}
    - {{< cbtext id="Lunar Inspiration" >}}Use Lunar Inspiration {{< spell 155625 "Moonfire" >}} if it is in pandemic.{{< /cbtext >}}
    - {{< cbtext id="Thrashing Claws" negate="true" >}}Use {{< spell 106830 "Thrash" >}} if it is in pandemic{{< /cbtext >}}
    - {{< cbtext id="Brutal Slash" >}}Use {{< spell 202028 "Brutal Slash" >}}.{{< /cbtext >}}
    - {{< cbtext id="Wild Slashes" >}}Use {{< spell 106785 "Swipe" >}}{{< /cbtext >}}
    - Use {{< spell 5221 "Shred" >}}.
    - {{< cbtext id="Bloodtalons" >}}If you still need {{< spell 319439 "Bloodtalons" >}} proc it with this priority:{{< /cbtext >}}
        - {{< cbtext id="Lunar Inspiration" >}}Clip Lunar Inspiration {{< spell 155625 "Moonfire" >}}{{< /cbtext >}}
        - {{< cbtext id="Brutal Slash" negate="true" >}}Use {{< spell 106785 "Swipe" >}}{{< /cbtext >}}
        - Use {{< spell 1822 "Rake" >}} if it will not downgrade {{< spell 1822 "Rake's" >}} snapshot value.
        - Clip {{< spell 106830 "Thrash" >}}

- {{< cbtext id="Berserk" >}}**Berserk Priority**{{< /cbtext >}}
    - Use {{< spell 1079 "Rip" >}} when all of these conditions are met:
        - You have 5 combo points
        - {{< cbtext id="T31 2P" >}}{{< spell 1079 "Rip" >}} is in pandemic OR all of these conditions are met:{{< /cbtext >}}
            - {{< spell 1079 "Rip" >}} has less than 10 seconds remaining
            - Your next gcd will be {{< spell 274838 "Feral Frenzy" >}}
        - {{< cbtext id="T31 2P" negate="true" >}}{{< spell 1079 "Rip" >}} is in pandemic{{< /cbtext >}}
        - {{< cbtext id="T31 2P" >}}{{< spell 1079 "Rip" >}} has less than 2 seconds remaining, or you don't have {{< spell 422751 "Smoldering Frenzy" >}} up. Yes this means {{< spell 1079 "Rip" >}} will sometimes fall off with proper play.{{< /cbtext >}}
        - {{< spell 5217 "Tiger's Fury" >}} is up, or won't be up before {{< spell 1079 "Rip" >}} expires.
        - {{< cbtext id="Bloodtalons">}}{{< spell 319439 "Bloodtalons" >}} is up, or won't be up before {{< spell 1079 "Rip" >}} expires.{{< /cbtext >}}
    - Use {{< spell 22568 "Ferocious Bite" >}} with 5 combo points
    - {{< cbtext id="Incarnation" >}} Use {{< spell 102547 "Prowl" >}} followed by {{< spell 1822 "Rake" >}} if it won't disrupt {{< spell 319439 "Bloodtalons" >}} and any of these conditions are true:{{< /cbtext >}}
        - {{< spell 1822 "Rake" >}} is not applied or is in pandemic range
        - {{< cbtext id="Sudden Ambush" >}}You don't have {{< spell 384667 "Sudden Ambush" >}} AND a stealth {{< spell 1822 "Rake" >}} would be upgrading its snapshot{{< /cbtext >}}
    - {{< cbtext id="Shadowmeld">}} Use {{< spell 58984 "Shadowmeld" >}} followed by {{< spell 1822 "Rake" >}} if it won't disrupt {{< spell 319439 "Bloodtalons" >}} and any of these conditions are true:{{< /cbtext >}}
        - {{< spell 1822 "Rake" >}} is not applied or is in pandemic range
        - {{< cbtext id="Sudden Ambush" >}}You don't have {{< spell 384667 "Sudden Ambush" >}} AND a stealth {{< spell 1822 "Rake" >}} would be upgrading its snapshot{{< /cbtext >}}
    - {{< cbtext id="Bloodtalons" >}}Use {{< spell 1822 "Rake" >}} if it won't disrupt {{< spell 319439 "Bloodtalons" >}} and any of these conditions are true:{{< /cbtext >}}
        - {{< spell 1822 "Rake" >}} is not applied or is in pandemic range
        - {{< cbtext id="Sudden Ambush" >}}You have a {{< spell 384667 "Sudden Ambush" >}} proc AND a stealth {{< spell 1822 "Rake" >}} would be upgrading its snapshot{{< /cbtext >}}
    - {{< cbtext id="Bloodtalons" negate="true" >}}Use {{< spell 1822 "Rake" >}} if any of these conditions are true:{{< /cbtext >}}
        - {{< spell 1822 "Rake" >}} is not applied or is in pandemic range
        - {{< cbtext id="Sudden Ambush" >}}You have a {{< spell 384667 "Sudden Ambush" >}} proc AND a stealth {{< spell 1822 "Rake" >}} would be upgrading its snapshot{{< /cbtext >}}
    - {{< cbtext id="Bloodtalons" >}}If you are one spell away from proccing {{< spell 319439 "Bloodtalons" >}} then proc it with this priority:{{< /cbtext >}}
        - {{< spell 5221 "Shred" >}}
        - {{< cbtext id="Brutal Slash" >}}{{< spell 202028 "Brutal Slash" >}}.{{< /cbtext >}}
        - {{< cbtext id="Lunar Inspiration" >}}Lunar Inspiration {{< spell 155625 "Moonfire" >}} This is true even if it means clipping moonfire early.{{< /cbtext >}}
        - {{< spell 106830 "Thrash" >}} This is true even if it means clipping thrash early.
    - {{< cbtext id="Lunar Inspiration" >}}Use Lunar Inspiration {{< spell 155625 "Moonfire" >}} if it is not applied or is in pandemic range.{{< /cbtext >}}
    - {{< cbtext id="Brutal Slash" >}}Use {{< spell 202028 "Brutal Slash" >}} if you have 2 or 3 charges{{< /cbtext >}}
    - Use {{< spell 5221 "Shred" >}}

<div id="aoe">

## [AoE priority](#aoe)

**Select which talents you have talented to filter the priority list:**

{{< checkbox id="Feral Frenzy-AOE" spell=274838 checked=true >}}Feral Frenzy{{< /checkbox >}}
{{< checkbox id="Convoke the Spirits-AOE" spell=391528 checked=true >}}Convoke the Spirits{{< /checkbox >}}
{{< checkbox id="Adaptive Swarm-AOE" spell=391889 radio="Adaptive Swarm">}}Adaptive Swarm{{< /checkbox >}}
{{< checkbox id="Unbridled Swarm-AOE" spell=391951 radio="Adaptive Swarm">}}Unbridled Swarm{{< /checkbox >}}<br>
{{< checkbox id="Incarnation-AOE" spell=102543 >}}Incarnation{{< /checkbox >}}
{{< checkbox id="Lunar Inspiration-AOE" spell=155580 >}}Lunar Inspiration{{< /checkbox >}}
{{< checkbox id="Apex Predator's Craving-AOE" spell=391881 checked=true >}}Apex Predator's Craving{{< /checkbox >}}<br>
{{< checkbox id="Bloodtalons-AOE" spell=319439 checked=true >}}Bloodtalons{{< /checkbox >}}
{{< checkbox id="Tear Open Wounds-AOE" spell=391786 checked=true >}}Tear Open Wounds{{< /checkbox >}}
{{< checkbox id="Rampant Ferocity-AOE" spell=391710 >}}Rampant Ferocity{{< /checkbox >}}<br>
{{< checkbox id="Thrashing Claws-AOE" spell=405300 >}}Thrashing Claws{{< /checkbox >}}
{{< checkbox id="Sudden Ambush-AOE" spell=384667 checked=true >}}Sudden Ambush{{< /checkbox >}}
{{< checkbox id="Brutal Slash-AOE" spell=202028 checked=true >}}Brutal Slash{{< /checkbox >}}
{{< checkbox id="Shadowmeld-AOE" spell=58984 >}}Shadowmeld{{< /checkbox >}}
{{< checkbox id="Dire Fixation-AOE" spell=417710 checked=true >}}Dire Fixation{{< /checkbox >}}
{{< checkbox id="Primal Wrath-AOE" spell=285381 checked=true >}}Primal Wrath{{< /checkbox >}}
{{< checkbox id="T31 2P-AOE" checked=true >}}T31 2P{{< /checkbox >}}
{{< checkbox id="T31 4P-AOE" checked=true >}}T31 4P{{< /checkbox >}}

</div>

**AoE priority list(2+ targets):**
**Special Note: Try to use single-target spells on higher priority/higher healthed mobs, or mobs that have {{< spell 417710 "Dire Fixation" >}} on them.**
- Use {{< spell 5217 "Tiger's Fury" >}} if any of the following conditions are met
    - {{< spell 5217 "Tiger's Fury" >}} is not up.
    - You are more than 65 energy from the cap.
    - {{< cbtext id="T31 2P-AOE" >}}{{< spell 274838 "Feral Frenzy" >}} is ready to be used.{{< /cbtext >}}
    - {{< cbtext id="T31 4P-AOE" negate="true" >}}You've talented {{< spell 391528  "Convoke the Spirits" >}} (This keeps {{< spell 5217 "Tiger's Fury" >}} and {{< spell 391528  "Convoke" >}} aligned.){{< /cbtext >}}
- {{< cbtext id="Adaptive Swarm-AOE" >}}Use {{< spell 391889 "Adaptive Swarm" >}} when all of these conditions are met:{{< /cbtext >}}
    - There isn't an {{< spell 391889 "Adaptive Swarm" >}} heading to an enemy target.
    - {{< spell 391889 "Adaptive Swarm" >}} is not up on a target.
- {{< cbtext id="Unbridled Swarm-AOE" >}}With {{< spell 391951 "Unbridled Swarm" >}} talented, use {{< spell 391889 "Adaptive Swarm" >}} as often as you can with this priority:{{< /cbtext >}}
    - An enemy target has 2 stacks of {{< spell 391889 "Adaptive Swarm" >}}.
    - An enemy target has 1 stack of {{< spell 391889 "Adaptive Swarm" >}}.
    - An enemy target does not have {{< spell 391889 "Adaptive Swarm" >}}.
- {{< cbtext id="Incarnation-AOE" >}}Use {{< spell 102543 "Incarnation" >}}{{< /cbtext >}}
- {{< cbtext id="Incarnation-AOE" negate="true" >}}Use {{< spell 106951 "Berserk" >}}{{< /cbtext >}}
- {{< cbtext id="Convoke the Spirits-AOE" >}}Use {{< spell 391528  "Convoke" >}} if all of the following conditions are met:{{< /cbtext >}}
    - Your {{< spell 1079 "Rips" >}} will not fall off during {{< spell 391528  "Convoke's" >}} channel.
    - {{< spell 5217 "Tiger's Fury" >}} is up.
    - {{< cbtext id="T31 4P-AOE" >}}{{< spell 422751 "Smoldering Frenzy" >}} is up.{{< /cbtext >}}
    - {{< cbtext id="T31 2P-AOE" >}}You have 0 or 1 combo points OR {{< spell 422751 "Smoldering Frenzy" >}} would fall off before {{< spell 391528  "Convoke" >}} ends.{{< /cbtext >}}
    - {{< cbtext id="T31 2P-AOE" negate="true" >}}You have 0 or 1 combo points{{< /cbtext >}}
- {{< cbtext id="Feral Frenzy-AOE" >}}Use {{< spell 274838 "Feral Frenzy" >}} if you have less than 2 combo points and are not in {{< spell 102543 "Incarn" >}}/{{< spell 106951 "Berserk" >}}, or under 3 combo points during {{< spell 102543 "Incarn" >}}/{{< spell 106951 "Berserk" >}}.{{< /cbtext >}}
- {{< cbtext id="Apex Predator's Craving-AOE" >}}Use {{< spell 22568 "Ferocious Bite" >}} if you have a {{< spell 391881 "Apex Predator's Craving" >}} proc and:{{< /cbtext >}}
    - {{< cbtext id="Primal Wrath-AOE" negate="true" >}}Don't have {{< spell 285381 "Primal Wrath" >}} talented or{{< /cbtext >}}
    - Don't have {{< spell 202031 "Sabertooth" >}} up.
- {{< cbtext id="Primal Wrath-AOE" >}}Use {{< spell 285381 "Primal Wrath" >}} if you have 5 combo points, or at least 4 combo points outside of {{< spell 106951 "Berserk" >}}/{{< spell 102543 "Incarnation" >}} and any of these conditions are met:{{< /cbtext >}}
    - {{< cbtext id="Tear Open Wounds-AOE" negate="true" >}}{{< spell 1079 "Rips" >}} from {{< spell 285381 "Primal Wrath" >}} are in pandemic{{< /cbtext >}}
    - {{< cbtext id="Tear Open Wounds-AOE" >}}You have Tear Open Wounds talented{{< /cbtext >}}
    - {{< cbtext id="Rampant Ferocity-AOE" negate="true" >}}There are at least 5 targets in range{{< /cbtext >}}
- {{< cbtext id="Primal Wrath-AOE" negate="true" >}}Use {{< spell 1079 "Rip" >}} on targets without {{<spell 1079 "Rip" >}} that will live for a decent amount of time.{{< /cbtext >}}
    - Please, I beg you, if you are using {{< spell 1079 "Rip" >}} on multiple targets you should seriously be talenting {{< spell 285381 "Primal Wrath" >}}. It's as close to mandatory as it gets.
- Use {{< spell 22568 "Ferocious Bite" >}} if you have 5 combo points, or at least 4 combo points outside of {{< spell 106951 "Berserk" >}}/{{< spell 102543 "Incarnation" >}}.
- {{< cbtext id="Bloodtalons-AOE" >}}**Below this point, skip any spells you've already casted towards {{< spell 319439 "Bloodtalons" >}} if inside {{< spell 106951 "Berserk" >}}/{{< spell 102543 "Incarnation" >}} or if you have 0 or 1 stacks of {{< spell 319439 "Bloodtalons" >}}.**{{< /cbtext >}}
- {{< cbtext id="Brutal Slash-AOE" >}}Use {{< spell 202028 "Brutal Slash" >}} if it will cap on charges within the next 4 seconds.{{< /cbtext >}}
- {{< cbtext id="Thrashing Claws-AOE" negate="true" >}}Use {{< spell 106830 "Thrash" >}} if in pandemic range and any of these conditions:{{< /cbtext >}}
    - You have a {{< spell 16864 "Clearcasting" >}} proc
    - {{< cbtext id="Sudden Ambush-AOE" >}}You either do not have {{< spell 391700 "Double-Clawed Rake" >}} talented or {{< spell 384667 "Sudden Ambush" >}} isn't up{{< /cbtext >}}
    - {{< cbtext id="Sudden Ambush-AOE" negate="true" >}}You do not have {{< spell 391700 "Double-Clawed Rake" >}} talented{{< /cbtext >}}
- {{< cbtext id="Incarnation-AOE" >}}Use {{< spell 102547 "Prowl" >}} followed by {{< spell 1822 "Rake" >}} on a target where {{< spell 1822 "Rake" >}} is either not applied or in pandemic range{{< /cbtext >}}
- {{< cbtext id="Shadowmeld-AOE" >}}Use {{< spell 58984 "Shadowmeld" >}} followed by {{< spell 1822 "Rake" >}} on a target where {{< spell 1822 "Rake" >}} is either not applied or in pandemic range{{< /cbtext >}}
- {{< cbtext id="Incarnation-AOE" >}}Use {{< spell 102547 "Prowl" >}} followed by {{< spell 1822 "Rake" >}} on a target where {{< spell 1822 "Rake" >}} does not have a {{< spell 390772 "Pouncing Strikes" >}} snapshot{{< /cbtext >}}
- {{< cbtext id="Shadowmeld-AOE" >}}Use {{< spell 58984 "Shadowmeld" >}} followed by {{< spell 1822 "Rake" >}} on a target where {{< spell 1822 "Rake" >}} does not have a {{< spell 390772 "Pouncing Strikes" >}} snapshot{{< /cbtext >}}
- Use {{< spell 1822 "Rake" >}} on a target with either of these conditions met:
    - {{< spell 1822 "Rake" >}} is not applied or is in pandemic range
    - {{< cbtext id="Sudden Ambush-AOE" >}}You have {{< spell 384667 "Sudden Ambush" >}} up and can upgrade the snapshot value of a {{< spell 1822 "Rake" >}}{{< /cbtext >}}
- {{< cbtext id="Thrashing Claws-AOE" negate="true" >}}Use {{< spell 106830 "Thrash" >}} if in pandemic range{{< /cbtext >}}
- {{< cbtext id="Brutal Slash-AOE" >}}Use {{< spell 202028 "Brutal Slash" >}}{{< /cbtext >}}
- {{< cbtext id="Brutal Slash-AOE" negate="true" >}}Use {{< spell 106785 "Swipe" >}} if there are 5 or more targets{{< /cbtext >}}
- {{< cbtext id="Lunar Inspiration-AOE" >}}Use Lunar Inspiration {{< spell 155625 "Moonfire" >}} on a target without {{< spell 155625 "Moonfire" >}} or if {{< spell 155625 "Moonfire" >}} is in pandemic range and there are less than 5 targets.{{< /cbtext >}}
- {{< cbtext id="Brutal Slash-AOE" negate="true" >}}Use {{< spell 106785 "Swipe" >}}.{{< /cbtext >}}
- {{< cbtext id="Sudden Ambush-AOE" >}}Use {{< spell 5221 "Shred" >}} if {{< spell 384667 "Sudden Ambush" >}} is not up and:{{< /cbtext >}}
    - {{< cbtext id="Dire Fixation-AOE" >}} {{<spell 417710 "Dire Fixation" >}} is talented{{< /cbtext >}}
    - {{< cbtext id="Dire Fixation-AOE" negate="true" >}}There are 3 or fewer targets.{{< /cbtext >}}
- {{< cbtext id="Sudden Ambush-AOE" negate="true" >}}Use {{< spell 5221 "Shred" >}} if:{{< /cbtext >}}
    - {{< cbtext id="Dire Fixation-AOE" >}} {{<spell 417710 "Dire Fixation" >}} is talented{{< /cbtext >}}
    - {{< cbtext id="Dire Fixation-AOE" negate="true" >}}There are 3 or fewer targets.{{< /cbtext >}}
- {{< cbtext id="Thrashing Claws-AOE" negate="true" >}}Use {{< spell 106830 "Thrash" >}}.{{< /cbtext >}}
- {{< cbtext id="Bloodtalons-AOE" >}}If you still need {{< spell 319439 "Bloodtalons" >}} proc it with this priority:{{< /cbtext >}}
    - {{< cbtext id="Lunar Inspiration-AOE" >}}Lunar Inspiration {{< spell 155625 "Moonfire" >}} if there is a target without {{< spell 155625 "Moonfire" >}}.{{< /cbtext >}}
    - {{< spell 5221 "Shred" >}}
    - {{< cbtext id="Lunar Inspiration-AOE" >}}Lunar Inspiration {{< spell 155625 "Moonfire" >}} on the target with the lowest duration.{{< /cbtext >}}
    - {{< spell 1822 "Rake" >}} ideally on a target where the new snapshot would be at least the same strength as the currently applied {{< spell 1822 "Rake" >}}.
    - {{< cbtext id="Thrashing Claws-AOE" >}}{{< spell 106830 "Thrash" >}}{{< /cbtext >}}

<br><div id="talents">

# [3.Talents:](#talents)

</div>

<div id="raidtalents">
 
## [Raid Talents](#raidtalents)
</div>

### T31 4pc Talent Builds (Amirdrassil tier-set, still applies in season 4)

[T31 Standard Convoke Single-Target](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFVKVRAQCBU)
<br>[One-minute Burst](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYpCFREExRQQBRNVFAVRUVFVoVRECBU)
<br>[Raid ST-AoE hybrid](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVRAVRUVFVYRVBQCFU)
<br>[Raid Cleave](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYpCFREExRQQBBOVRURRQVFVIUVRQCFQ)
<br>[Alternative L/R LI Single Target](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYpCFREExRQQBROVBAZRVVFUiURBQBE)
<br>[Alternative L/R BrS Single Target](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFViURBQCBQ) (slightly worse).
- Note: generally best to play 'Standard Convoke' for single-target, assuming you have an on-use trinket like Ashes or Witherbark's. They sim equally, however Convoke offers more burst, and pulls ahead with Augmentation buffing you. Kill timers can also play a factor; if you are unsure, stick to Convoke. If you do play L/R, Infected Wounds can optionally be swapped for Lunar Inspiration with T31 as well.


### Vault of the Incarnates Raid Boss Talents
[Eranog](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYZCFRUExRQQBROVRQRRUVFVIVVBQCFU)
- You can alternatively play a more single-target oriented build, or if your guild one-phases the boss can drop {{< spell 391174 "Berserk: Heart of the Lion" >}} for another talent point, and most likely 1 minute convoke with that.

[The Primal Council](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYZCFRUExRQQBROURURVQVFVYRVBQCFE)
- Full sustain AoE. Can consider going Unbridled Swarm as well.

[Terros](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFVKVRAQCBU)
- Very straightforward, full single target. Can sim your expected fight timer to see if any of the other single target builds are better for your guild.

[Sennarth](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFVKVRAQCBU)
- Adds die too fast to get any meaningful cleave so just go full single target.

[Kurog Grimtotem](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYZCFRUExRQQBROURURVQVFVIVVBQCFU)
- Mostly 2t cleave

[Dathea - Boss Duty](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFVKVRAQCBU)
- This assumes you stay on boss the entire time. If you are on adds instead, then play the Add Duty build below.

[Dathea - Add Duty](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQZCFVUUxRQQCQQOURURVQVFVYRVBQCFU)

[Broodkeeper Diurna](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYZCFRUExRQQBROURURVQVFVYRVBQCFU)
- If adds end up dying too fast on Fated then you can drop double-clawed rake and/or rampant ferocity for more p3 boss burn.

[Raszageth](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQZCFVUUxRQQCQQOUVQRRUVFVIRVFQCBV)

### Aberrus Raid Boss Talents
[Kazzara](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFVKVRAQCBU)
- Can sim your expected kill timer to see if 1 minute convoke would do more damage for you, but this is just a single target fight.

[Amalgamation Chamber](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFVKVRAQCBU)

[Forgotten Experiments](https://www.wowhead.com/talent-calc/druid/feral/DAQAUEEBCYpCFBUEwhFBAOVRQRRUVFVIUVRQCFQ)
- Can make a case for alternate builds, feel free to 'experiment' around with things.

[Assault of the Zaqali](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFVKVRAQCBU)
- This assumes zerg strat, if you dont do zerk strat then you probably should be doing zerg strat but play full aoe.

[Rashok](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFVKVRAQCBU)

[Zskarn](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFVKVRAQCBU)
- Primal wrath is bait. Golems should be handled by other specs. If you absolutely need some aoe, dont do anything more than talenting primal wrath.

[Magmorax](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVFAVRUVFVKVRAQCBU)

[Echo of Neltharion](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYZCFRUExRQQBROVVARRUVFVIVVBQCBV)
- Can consider dropping primal wrath altogether, and can go 2 points into saber jaws, removing points from circle and rip and tear.

[Sarkareth](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYZCFRUExRQQBROVVARRUVFVIVVBQCBV)
- Can also go 2 points into saber jaws, removing points from circle and rip and tear.

### Amirdrassil Raid Boss Talents
[Gnarlroot](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCQpCFREExhUQBROVVARRUVFVoRVAQCBV)
- If you need more AOE, swap {{< spell 390902 "Carnivorous Instincts" >}} to {{< spell 400320 "Circle" >}}. You can also play full single-target if adds don't feel like an issue.

[Igira](https://www.wowhead.com/talent-calc/druid/feral/DAREUEEBCQZCFREExhUQBROVFAVRUVFVKVRAQCBU)
- Play full single-target, the spears will die too fast for Primal Wrath to be worth it in most cases. Frenzied Regen can be useful for clearing the healing absorb.

[Volcoross](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYpCBREExhQQBRNVFAVRUVFVoVRECBU)
- If your kill time is above 4.20~ or so, swap to the 2 minute 'standard convoke single-target' build listed above.

[Council of Dreams](https://www.wowhead.com/talent-calc/druid/feral/DARBUUEFCYpCBREAxBQQBEOVRURRQVFVIUVRQCFQ)
- You can play Lunar Inspiration, which is technically better, albeit more difficult to play. With Dire Fixation you use Shred as a last priority filler.
- You can also play Incarn instead which is more simple to play.
- Dispel allows you to quickly and safely dispel yourself on Mythic. 

[Nymue](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCYpCBREExhQQBRNVFAVRUVFVoVRECBU)
- 1 minute Convoke lines up with all of the intermissions. 

[Larodar](https://www.wowhead.com/talent-calc/druid/feral/DARAUEEBCUpCBREExhUQBRNVFAVRUVFVoVRECBU)
- L/R single target also works here, but given you probably have gear optimised for Convoke, just play 1 min Convoke, as it has great timings for this fight too. 

[Smolderon](https://www.wowhead.com/talent-calc/druid/feral/DAQEVEFBCQpCFREEwhEBQOVFAZREVFVKRREQCBU)
- Extra Tireless Energy + Apex to try and get Berserk up for each intermission. 1 min Convoke for intermission damage amps.

[Tindral](https://www.wowhead.com/talent-calc/druid/feral/DAREVEFBCQJCFREExhQQBROVFAVRUVFVaRRAQCBU)
- With roots being nerfed, Feral should play full single-target on Tindral now with 2 minute Convoke. Let other specs carry the roots. Convoke will line up with the shields.

[Fyrakk](https://www.wowhead.com/talent-calc/druid/feral/DAREUEEBCQJCFVEExhUQBROVFAVRUVFVKVRAQCBU)
- Damage to adds are irrelevant, this is another 2 minute single-target Convoke fight as Feral where you can carry the boss damage. Take Typhoon to knock the adds however.

<div id="raidcustomisation">
 
### [T31 Raid Talent Customisation](#raidcustomisation)

</div>

In the first two gates, you can freely swap between {{< spell 231063 "Merciless Claws" >}}, {{< spell 383352 "Tireless Energy" >}}, {{< spell 48484 "Infected Wounds" >}}, and {{< spell 285381 "Primal Wrath" >}}, based on what you need.
- {{< spell 231063 "Merciless Claws" >}} is the strongest burst option of these nodes, and only slightly behind in sustained single-target and cleave.
- {{< spell 48484 "Infected Wounds" >}} for stronger sustained single-target, or if multi-dotting with Rake.
- {{< spell 383352 "Tireless Energy" >}} for strong single-target and solid in cleave and AoE, but weaker for burst. You should also adjust points if you are overcapping energy via {{< spell 391881 "Apex" >}} procs or downtime due to mechanics. 
- {{< spell 285381 "Primal Wrath" >}} if there are regular adds that need to die, or adds that can provide funnel opportunities with {{< spell 391881 "Apex" >}}.
- Note: {{< spell 391785 "Tear Open Wounds" >}} and {{< spell 391700 "Double-Clawed Rake" >}} are additional options particularly for sustained AoE/cleave (Council), or if your raid is struggling with certain adds. 

Final gate options: swap between {{< spell 390902 "Carnivorous Instincts" >}}, {{< spell 400320 "Circle of Life and Death" >}}, {{< spell 421432 "Saber Jaws" >}}, {{< spell 391347 "Rip & Tear" >}}, 1 minute {{< spell 391548  "Convoke the Spirits" >}}, and {{< spell 391889 "Swarm" >}}, as needed.
- {{< spell 400320 "Circle" >}}: generally worth grabbing if taking {{< spell 285381 "Primal Wrath" >}} with {{< spell 391881 "Apex" >}}, or if there's a lot of multi-dot potential.
- {{< spell 390902 "Carnivorous Instincts" >}}: strong burst, with good single-target and AoE. Predator resets and high {{< spell 5217 "Tiger's Fury" >}} uptime add value here.
- {{< spell 421432 "Saber Jaws" >}}: strong single-target pathing option to {{< spell 391881 "Apex" >}}. 
- {{< spell 391347 "Rip & Tear" >}}: cleave and AoE pathing option to {{< spell 391881 "Apex" >}}, not too far behind on single-target vs Saber Jaws with Convoke as it lets you spend another point elsewhere.
- 1m {{< spell 391548  "Convoke the Spirits" >}}: if you need more frequent burst, or are just a gambling addict. Your Kill times will also play a significant factor. For instance, if your raids kill time aligns better with the cooldown of 1 minute Convoke (odd e.g. 5:31) compared to 2 minute Convoke (even e.g. 4:31).
- {{< spell 391889 "Swarm" >}}: incredibly strong single-target synergy with tier-set, can drop at times for heavy AoE.

<div id="raidclasstree">
 
### [Class Tree Talents for Raid](#raidclasstree)

</div>

- *Coming soon with specific boss builds. 
- For now: remember to take {{< spell 29166 "Innervate" >}}!! You can cast in Cat Form now, and your healers will need it as the Rashok healer trinket has been nerfed.

<div id="dungeontalents">
 
## [Dungeon Talents](#dungeontalents) 

</div>

The builds listed here are only a sample, and can be customised significantly. Various options and the logic on when you might swap certain talents are outlined in the section below.

[Standard M+](https://www.wowhead.com/ptr-2/talent-calc/druid/feral/DARAUEEBCQJCFVUExhUQBBOVRURRQVFVYRVBQCFU)
<br>[More Single-Target](https://www.wowhead.com/ptr-2/talent-calc/druid/feral/DARAUEEBCQJCFVUExhUQBBOVRURRQVFVIVVBQCFU)
<br>[More Priority Damage](https://www.wowhead.com/ptr-2/talent-calc/druid/feral/DARAUEEBCQJCFVUExhUQBBOURURRUVFVIVVBQCFU)
<br>[Max Dungeon Single-Target](https://www.wowhead.com/ptr-2/talent-calc/druid/feral/DARAUEEBCQJCFVUExhUQBBOVRQRRUVFVIVVBQCFU)
<br>[MDI Pad](https://www.wowhead.com/ptr-2/talent-calc/druid/feral/DARAUEEBCQJCFVUExhUQBBOVRQRVEVFVYRVBQCFU)
<br>[Incarn](https://www.wowhead.com/ptr-2/talent-calc/druid/feral/DARAUEEBCQJCFVUExhUQBBOVRURRQVFVYRVBQCFE)
<br>[Beekeeping](https://www.wowhead.com/ptr-2/talent-calc/druid/feral/DARAUEEBCYJCFVUExRQQBBOVRURRQVFVIUVRQCFQ)
<br>[Funnel Option](https://www.wowhead.com/ptr-2/talent-calc/druid/feral/DARAUEEBCQJCFVUExhUQBBOVRERVQVFVYRVBQCFU)

<div id="m+">
 
### [M+ Talent Customisation](#m+)

</div>

{{< figure src="/feral/classtreem+.png" >}}

Note: for Feral, the talents in the first two gates have similar power-levels, and you can freely distribute extra points how you please here, up until you have spent 20 points. The final gate has stronger nodes and you should always spend the maximum points possible here (10).

Options for the first two gates:
- {{< spell 391700 "Double-Clawed Rake" >}} -> {{< spell 391709 "Rampant Ferocity" >}}: this comes down to pull size; DCR particularly excels in low and medium (pug) size pulls and is generally the better choice, however RF can pull ahead with large pulls e.g. in a dungeon with dense trash or with an organised group doing consistent triple~ pulls.
- {{< spell 391700 "Double-Clawed Rake" >}} -> {{< spell 384665 "Taste for Blood" >}}: if you want more single target, TFB is a great option e.g. for Tyrannical weeks, while also providing some funnel value on trash.
- {{< spell 391785 "Tear Open Wounds" >}} -> {{< spell 391709 "Rampant Ferocity" >}}: if your goal is purely to funnel, you can change to RF and spend your finishers on Bite while only using {{< spell 285381 "Primal Wrath" >}} to maintain {{< spell 1079 "Rip" >}} in AoE. This is somewhat more advanced with more consideration for energy and combo points, and requires you to break 'primal wrath spam' muscle memory.
- {{< spell 48484 "Infected Wounds" >}} -> {{< spell 384665 "Taste for Blood" >}}: if you are not running Double-clawed Rake, Taste for Blood is a great option that offers a prominent single target gain over Infected Wounds this patch as a result of the {{< spell 391881 "Apex" >}} changes. Even moreso if running {{< spell 391528  "Convoke the Spirits" >}}.
- {{< spell 384665 "Taste for Blood" >}} -> {{< spell 417710 "Dire Fixation" >}}: both are great single-target options, you can run Taste for Blood for more funnel (via Apex) and burst with Convoke.
- {{< spell 417710 "Dire Fixation" >}} -> {{< spell 391709 "Rampant Ferocity" >}}: you can run both Tear Open Wounds and Rampant Ferocity together if it is an AOE heavy dungeon, but single-target will be lower without Dire Fixation or Taste for Blood.

Options for the final gate:
- {{< spell 319439 "Bloodtalons" >}} vs {{< spell 391972 "Lion's Strength" >}}: in 10.2, BT gains a lot of quality of life when changing to the new tier-set, in addition to the {{< spell 391881 "Apex" >}} change with procs slowing down slightly in AoE. This combined with the 10.1 change of 3 charges makes BT feel smooth to play in season 3 M+. However, Lion's Strength is still a competitive option and only a small DPS loss while allowing you to focus on other things. If you are fairly new to Feral, you should start with Lion's Strength and swap to Bloodtalons when you have learnt everything else.
- {{< spell 391528  "Convoke the Spirits" >}} vs {{< spell 102543 "Incarnation" >}}: both talents are equally viable and will depend on your talents, gear, dungeon, and own preference. Convoke is very strong with Witherbark's Branch or similar on-use trinkets, and similarly should be played if dropping Rake talents such as Infected Wounds (as Incarn wants Rake talents), while Incarn can pull ahead with larger pulls. These two options are interchangeable though and there is no all-round 'best.' 
- 1 min {{< spell 391548  "Convoke" >}}: generally worse than 2m, however is a competitive option if running {{< spell 391709 "Rampant Ferocity" >}}. Drop Carnivorous Instincts/Swarm for it.
- {{< spell 390902 "Carnivorous Instincts" >}} vs {{< spell 391889 "Swarm" >}}: CI is your 'safe' all-round good pick, however Swarm is a very strong single-target option and should be considered for Tyrannical.
- {{< spell 391951 "Unbridled Swarm" >}}: for a talent that undersims, this is simming competitively with the more standard builds. In other words: this is looking to be very, very good this patch. Take in medium pull size dungeons.
- Honourable mention: {{< spell 391978 "Veinripper" >}} can be a good funnel option if playing a {{< spell 391709 "Rampant Ferocity" >}}-focused build and focusing on ethical prio-damage.

<div id="m+classtree">
 
### [M+ Class Tree](#m+classtree)

</div>

{{< figure src="/feral/druidtreem+.png" >}}

The druid tree offers a fair degree of customisation as Feral in M+, with a range of utility and defensive options. What is selected (yellow) is mandatory, with blue nodes being your options based on affixes or personal preference. 

- {{< spell 2782  "Remove Corruption" >}} for Afflicted weeks. Additionally, the following dungeons have poison and curse dispels: Atal'Dazar, Darkheart Thicket, Throne of the Tides, and Waycrest Manor.
- {{< spell 2637  "Hibernate" >}} for Incorporeal weeks.
- {{< spell 391528  "Nature's Vigil" >}} is still very strong in AoE, and will often keep you alive or minimise the need to Regrowth on big pulls, increasing your DPS. Over the dungeon it usually does more personal healing to you than any other talent, while also healing your group mates. Macro to Berserk/Incarn. 
- {{< spell 378986  "Protector of the Pack" >}} is a strong self-healing node for Feral, and gains even more value if you can occasionally utilise it to heal your group as well.
- {{< spell 33873  "Nurturing Instinct" >}} should only be considered if Beekeeping for small DPS and HPS gains.
- {{< spell 131768  "Feline Swiftness" >}} is commonly dropped in high-end for more defensives and utility, as Catform gives 30% speed baseline which is more than enough for dungeon mechanics. If uncomfortable, try only dropping 1 point at first to retain 8%.
- {{< spell 377842  "Ursine Vigor" >}} is more of a high-key talent to survive one-shots.



<br><div id="consumables">

# [4.Consumables:](#consumables)

</div>


<div id="potions">

## [Potions](#Potions)

</div>


[Elemental Potion of Ultimate Power](https://www.wowhead.com/item=191383/elemental-potion-of-ultimate-power) for every situation


<br><div id="food">

## [Food](#food)

</div>


[Grand Banquet of the Kalu'ak](https://www.wowhead.com/item=197794/grand-banquet-of-the-kaluak), or [Deviously Deviled Eggs](https://www.wowhead.com/item=204072/deviously-deviled-eggs) giving the same buff with a cheaper individual price.
<br>You can also use secondary food such as [Feisty Fish Sticks](https://www.wowhead.com/item=197782/feisty-fish-sticks) or [Sizzling Seafood Medley](https://www.wowhead.com/item=197784/sizzling-seafood-medley) or [Thousandbone Tongueslicer](https://www.wowhead.com/item=197786/thousandbone-tongueslicer) for a small dps gain. Sim your character to see what is best for you.


<br><div id="phials">

## [Phials](#Phials)

</div>

Phials:

- [Iced Phial of Corrupting Rage](https://www.wowhead.com/item=191329/iced-phial-of-corrupting-rage): Default phial unless the fight has too high damage intake or you are at risk of dying.
- [Phial of Tepid Versatility](https://www.wowhead.com/item=191341/phial-of-tepid-versatility): Recommended phial if the fight has high damage intake or you are at risk of dying.

<br><div id="runes">

## [Runes](#Runes)

</div>

I apologize for being annoying but, sim your character for the most accurate answer. Generally {{< spell 391528  "Convoke" >}} builds do not want to play [Howling Rune](https://www.wowhead.com/item=194819/howling-rune) in single target if that is any consolation-but even that's not a guarantee. Make sure you select Rune (stat) (Main Hand) else it may not sim properly. ie: Buzzing (Crit) (Main Hand). Crit is the default setting.

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

Weapon - [Wafting Devotion](https://www.wowhead.com/item=200058/enchant-weapon-wafting-devotion)
<br>Chest - [Waking Stats](https://www.wowhead.com/item=200030/enchant-chest-waking-stats?crafting-quality=6)
<br>Cloak - [Graceful Avoidance](https://www.wowhead.com/item=200031/enchant-cloak-graceful-avoidance) or [Homebound Speed](https://www.wowhead.com/item=199948/enchant-cloak-homebound-speed) 
<br>Belt - [Shadowed Belt Clasp](https://www.wowhead.com/item=205039/shadowed-belt-clasp)
<br>Legs - [Fierce Armor Kit](https://www.wowhead.com/item=193565/fierce-armor-kit) or [Lambent Armor Kit](https://www.wowhead.com/item=204702/lambent-armor-kit)
<br>Wrist - [Devotion of Avoidance](https://www.wowhead.com/item=200021/enchant-bracer-devotion-of-avoidance?crafting-quality=6) or [Devotion of Speed](https://www.wowhead.com/item=199939/enchant-bracer-devotion-of-speed)
<br>Boots - [Watchers Loam](https://www.wowhead.com/item=199936/enchant-boots-watchers-loam) or [Plainsrunner's Breeze](https://www.wowhead.com/ptr-2/item=199934/enchant-boots-plainsrunners-breeze)
<br>Ring -  You should always sim your own character to determine what enchant to use in this slot. Depending on your gear, any of the four secondaries can be best for you.

<div id="dinar">

## [S4 Dinar/Bullion:](#dinar)

</div>

In Season 4 you can exchange [Antique Bronze Bullion](https://www.wowhead.com/ptr-2/item=213089/antique-bronze-bullion) for any piece of raid loot. Below includes a rough priority list for both Raid and M+, however make sure to customise to your own needs, for example if you loot any of these items, or if you want to go for a more hybrid-mix between Raid and M+. Video on Dinar and trinkets [here](https://www.youtube.com/watch?v=lcnwAexuJG8)

**Raid Priority**

- [Manic Grieftorch](https://www.wowhead.com/item=194308/manic-grieftorch?bonus=4795&class=11&ilvl=528&spec=103) This should be the highest value trinket in raid, especially early on when clearing due to deaths in your raid resetting the trinket. Send on CD but don't use while Smoldering Frenzy is up. Use Ashes first on pull when running both.
- [Djaarun](https://www.wowhead.com/item=202569/djaruun-pillar-of-the-elder-flame?bonus=4795&class=11&ilvl=528&spec=103) BIS Weapon. Macro to Berserk, and use on CD (it's off the GCD so just press Berserk again).
- [Ashes of the Embersoul](https://www.wowhead.com/item=207167/ashes-of-the-embersoul?bonus=6652:7981:9576:1520:8767&ilvl=528&spec=103) BIS trinket for Convoke.
- [Seal of Filial Duty](https://www.wowhead.com/item=195526/seal-of-filial-duty?bonus=4795:1808&ilvl=535&spec=103) Higher item level than other rings and provides a very powerful absorb for you that procs from Fire damage like our tier set.
- [Seal of Diurna's Chosen](https://www.wowhead.com/item=195480/seal-of-diurnas-chosen?bonus=4795:1808&ilvl=528&spec=103) Another free proc from our tierset.
- [Neltharion's Call to Sufffering](https://www.wowhead.com/item=204211/neltharions-call-to-suffering?bonus=4795&ilvl=535&spec=103) The most reliable stat stick, big RNG swings though but can always be favourable. 
- [Voice of the Silent Star](https://www.wowhead.com/item=204465/voice-of-the-silent-star?bonus=4795&class=11&ilvl=535&spec=103) Sark Cloak should be low priority for when you have the raids on farm, as it reduces your health (do not use in M+ either!).


**M+**
- [Djaarun](https://www.wowhead.com/item=202569/djaruun-pillar-of-the-elder-flame?bonus=4795&class=11&ilvl=528&spec=103) BIS Weapon. Macro to Berserk, and use on CD (it's off the GCD so just press Berserk again).
- [Neltharion's Call to Sufffering](https://www.wowhead.com/item=204211/neltharions-call-to-suffering?bonus=4795&ilvl=535&spec=103) The most reliable stat stick, big RNG swings though but can always be favourable. Great for AOE or if you don't want to run Grieftorch.
- [Seal of Filial Duty](https://www.wowhead.com/item=195526/seal-of-filial-duty?bonus=4795:1808&ilvl=535&spec=103) Higher item level than other rings and provides a very powerful absorb for you that procs from Fire damage like our tier set.
- [Seal of Diurna's Chosen](https://www.wowhead.com/item=195480/seal-of-diurnas-chosen?bonus=4795:1808&ilvl=528&spec=103) Another free proc from our tierset.
- [Ashes of the Embersoul](https://www.wowhead.com/item=207167/ashes-of-the-embersoul?bonus=6652:7981:9576:1520:8767&ilvl=528&spec=103) (assuming you are running Convoke).
- [Whispering Incarnate Icon](https://www.wowhead.com/item=194301/whispering-incarnate-icon?bonus=4795&class=11&ilvl=528&spec=103) Equal to Neltharion's, but requires a tank and healer in your raid to also equip.
- [Manic Grieftorch](https://www.wowhead.com/item=194308/manic-grieftorch?bonus=4795&class=11&ilvl=528&spec=103) Great priority/single-target damage, S-tier if group has lots of deaths. Don't use while Smoldering Frenzy is up. Use Ashes first with CDs when running both.
- [Fyrakk's Tainted Rageheart](https://www.wowhead.com/item=207174/fyrakks-tainted-rageheart?bonus=4795&class=11&ilvl=535&spec=103) Defensive option for high-keys, small sim lose but less in reality as it lets your healer do more DPS and minimises your time sitting in Bear etc.

<br><div id="embellishments">

## [Embellishments](#embellishments)

</div>

**Updated for Season 4**

For M+: you should always use 2x [Blue Silken Lining](https://www.wowhead.com/ptr-2/item=193946/blue-silken-lining) (BSL) on either Wrist, Neck, or Back.

For Raid: you should also craft 2x [Blue Silken Lining](https://www.wowhead.com/ptr-2/item=193946/blue-silken-lining), but prioritise Wrist or Neck so you still have the option for [Sark Cloak](https://www.wowhead.com/item=204465/voice-of-the-silent-star?bonus=4795&class=11&ilvl=535&spec=103) later on.

If your uptime is poor on certain fights (e.g. Council of Dreams or Fyrakk), [Shadowflame-Tempered Armor Patch](https://www.wowhead.com/ptr-2/item=204710/shadowflame-tempered-armor-patch) is the alternative raid embellishment that you can craft on Wrist or Back.

Never use any embellishment besides these two in Season 4 and do NOT craft on rings, as we have access to [Seal of Filial Duty](https://www.wowhead.com/item=195526/seal-of-filial-duty?bonus=4795:1808&ilvl=535&spec=103) and [Seal of Diurna's Chosen](https://www.wowhead.com/item=195480/seal-of-diurnas-chosen?bonus=4795:1808&ilvl=528&spec=103)

See: BSL analysis for Feral: https://youtu.be/JLnEaOndrsw?t=135

**Simming BSL**

This can be tricky, as sims simply offer a flat uptime, where in reality it's uptime during CDs that matters more than overall uptime. There is no perfect solution to this conundrum.

For M+ you might want to do anywhere from 65-75% (a lot of trash pulls it can hover around 60-80%, while for some bosses it can sit as high as 90%~). Even 65-75% may still be underselling BSL if you can ensure higher uptime during CDs etc, but ultimately you should check details or your logs to find an uptime that is most useful to you and the keys you are doing.

For raid, 40-60%, depending on boss. You might have 40% overall uptime on a fight, but that doesn't show the full picture if you had 80% uptime during CDs - therefore I would recommend adding to whatever overall uptime you are getting for simming purposes. A 45% uptime fight I might choose to sim at 55% for example.


**Crafting order**

The most optimal 'long-term' slots to craft [Blue Silken Lining](https://www.wowhead.com/ptr-2/item=193946/blue-silken-lining) on are: Neck, Bracers, or Back. This is because crafted gear is 3 item levels below that of a fully upgraded Mythic track piece, and these slots have fewer stats compared to other options.  

1. Craft Neck or Bracers with [Blue Silken Lining](https://www.wowhead.com/ptr-2/item=193946/blue-silken-lining).
2. Craft whatever slot you didn't craft on next, or alternatively can craft on Back if your focus is M+.

<div id="trinkets">

## [Trinkets](#trinkets)

</div>

There are a LOT of trinkets in season 4, below includes only the very best. Please use Top Gear or Droptimizer on [Raidbots](https://raidbots.com) in order to decide what trinkets to use/farm, but the following list should give you a good idea of some of the trinkets you will want to look out for. The list is in roughly power-level order assuming the highest item level versions of the trinkets. 
### To use in Raid

- [Manic Grieftorch](https://www.wowhead.com/item=194308/manic-grieftorch?bonus=4795&class=11&ilvl=528&spec=103) This should be the highest value trinket in raid, especially early on when clearing due to deaths in your raid resetting the trinket.
- [Ashes of the Embersoul](https://www.wowhead.com/item=207167/ashes-of-the-embersoul?bonus=6652:7981:9576:1520:8767&ilvl=528&spec=103) BIS (assuming you are running Convoke) but Grieftorch is a better first-pick.
- [Cataclysmic Signet Brand](https://www.wowhead.com/item=207166/cataclysmic-signet-brand?bonus=4795&class=11&ilvl=528&spec=103) Very good on longer fights (5m+), but weak on short fights and punishing if you die.
- [Neltharion's Call to Sufffering](https://www.wowhead.com/item=204211/neltharions-call-to-suffering?bonus=4795&ilvl=535&spec=103) Stat-stick that just works, though a bit RNG. Great for AOE or if you don't want to run Grieftorch.
- [Whispering Incarnate Icon](https://www.wowhead.com/item=194301/whispering-incarnate-icon?bonus=4795&class=11&ilvl=528&spec=103) Equal to Neltharion's, but requires a tank and healer in your raid to also equip.

  
### To use in Dungeons

- [Neltharion's Call to Sufffering](https://www.wowhead.com/item=204211/neltharions-call-to-suffering?bonus=4795&ilvl=535&spec=103) Stat-stick that just works, though a bit RNG. 
- [Whispering Incarnate Icon](https://www.wowhead.com/item=194301/whispering-incarnate-icon?bonus=4795&class=11&ilvl=528&spec=103) Equal to Neltharion's, but requires a tank and healer in your group to also equip. Can run double stat stick for M+.
- [Ashes of the Embersoul](https://www.wowhead.com/item=207167/ashes-of-the-embersoul?bonus=6652:7981:9576:1520:8767&ilvl=528&spec=103) Extremely good with Convoke builds and highest value in terms of burst.
- [Fyrakk's Tainted Rageheart](https://www.wowhead.com/item=207174/fyrakks-tainted-rageheart?bonus=4795&class=11&ilvl=535&spec=103) Defensive option for high-keys, lose thereotical damage but lets your healer do more DPS and minimises your time sitting in Bear etc.
- [Storm-Eater's Boon](https://www.wowhead.com/item=194302/storm-eaters-boon?bonus=4795&class=11&ilvl=528&spec=103) This is very niche and may only be playable in a few keys, if at all, but does big damage if you can pull it off (keeps you stationary for its duration, meaning you can't avoid any swirlies or mobs being moved away). You can always Bearform and/or Survival Instincts with this if needed too.
- [Manic Grieftorch](https://www.wowhead.com/item=194308/manic-grieftorch?bonus=4795&class=11&ilvl=528&spec=103) Good for priority burst damage which will be valuable for many bosses and trash packs. If your group has lots of deaths, has the potential be giga-bis.


<br>
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

<br><div id="pandemic">

## [What does pandemic refer to?](#pandemic)

</div>

Pandemic is a mechanic that most damage-over-time spells have. When you cast a damage-over-time spell such as Rake while it's already applied to the target, the dots duration gets extended by the amount of time remaining on the dot. This extension is capped to 30% of the dots duration. For example, lets say you have a dot that has a 10 second duration. If you recast this dot while it has 2 seconds left, its new duration is 12 seconds. If you recast it again while it has 8 seconds left, its new duration is 13 seconds, because 30% of 10 seconds is 3 seconds. Pandemic got its name from an old warlock passive with the same effect, before it became a baseline feature of damage-over-time spells.

<br><div id="macros">

## [Macros](#macros)

</div>
None of these macros are required by any means, just a few that can be useful for some people.

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

**Entangling Roots macro:**

Casts Entangling Roots on a target you mouseover, otherwise casts on current target if no mouseover.
```
#showtooltip
/cast [@mouseover, harm, nodead] [] Entangling Roots
```

**Focus Skull Bash:**

Casts Skull Bash at your focus target, or current target if there is no eligible enemy focus target. Remember to bind focus target in WoW keybind settings.
```
#showtooltip
/cast [@focus, harm, nodead] [] skull bash
```

**Adaptive Swarm macro:**

Casts Swarm on your current target, or a friendly if you mouseover them. This can be applied to numerous abilities you cast on allies (Dispel, Rejuv/Regrowth, Innervate etc to save on keybinds), as seen in the Rebirth macro further below. 
```
#showtooltip
/cast [@mouseover, help, nodead] [] Adaptive Swarm 
```

**Rebirth/Other Macro:**

Casts Rebirth when you mouseover a friendly, or otherwise Mark of the Wild. Customise these macros how you please. 
```
#showtooltip
/cast [@mouseover, help, dead] Rebirth; Mark of the Wild
```

<br><div id="wa">
 
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
- [by Oi/Dsune](https://wago.io/OiFeral)
- [by enthh](https://wago.io/bfgPasy27) requires his [addon](https://www.curseforge.com/wow/addons/feralsnapshots)

### **Commonly used WeakAuras and Addons**
[Feral Bleed Power by Oi](https://wago.io/qYnbZzlmP)
See the description of the WA for more details. This is not a required WA but will make it easier to track the power of your next bleed compared to the currently active one.

[Feral Snapshots by Enth](https://www.curseforge.com/wow/addons/feralsnapshots)
An addon alternative. See the description for more details. This can also show snapshot details on your enemy nameplates (default and plater) or personal resource display.

[Rake Plater mods by Sretnuh](https://wago.io/p/Sretnuh)
Search through these to see what you like, these Plater mods help identify which targets have your rake on them at a glance.

[Apex Predator's Craving by Marvel](https://wago.io/KzSX7dDMM)
Alerts you when you have an {{< spell 391881 "Apex Predator's Craving" >}} (free bite) proc with a glowing icon and a sound.

[Adaptive Swarm Helper by KnewOne](https://wago.io/0P93t1-nG)
See the description of the WA for more details. This will assist you with using Adaptive Swarm, including Unbridled Swarm support for ally targeting.

[Bloodtalons Tracker from Fore's pack](https://wago.io/cQkL9nrAw)
This tracks your progress towards procing {{< spell 319439 "Bloodtalons" >}}, showing the 4 second timer for each spell you cast towards it.

[Bloodtalons Tracker from Cheesey's pack](https://wago.io/zinn-QaFI)
Additional BT tracker.

[Focus Skull Bash](https://wago.io/mOvsNkzJ7)
Helps emphasise focus kicks when your Skull Bash is off CD.

</div>

 
<script>const whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true, iconSize: 'small'};</script>
<script src="https://wow.zamimg.com/js/tooltips.js"></script>
