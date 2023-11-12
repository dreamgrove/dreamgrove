---
date: '2022-05-10'
authors: ["Chicken, Dsune"]
published: true
patch: "10.2"
title: Balance Druid Raidbots Guide
description: "How to Sim your character using Raidbots"
showOnFrontpage: false
sidebarTitle: "Quicklinks"
sidebarContents:  |
  [1. Introduction](#introduction)
 
  [2. Setup](#setup)
 
  [3. Novice](#novice)
 
  [4. Options](#options)
 
  [5. Competent](#competent)
 
  [6. Proficient](#proficient)
---

<div id="introduction">

# [1. Introduction:](#introduction)

</div>

Welcome to the Balance Druid Raidbots Guide. 
<br> This guide assumes you have zero experience with sims or programming in any way shape or form, so stuff that might seem very basic will also be found here.
<br>The information in this documentation is mainly directed towards Balance Druids and not other specs. Please listen to the guide writers that play those specs in what should be followed and what not, as some options that might be accurate for some might not be for others. 
<br>This guide will be split in multiple sections, but it is highly recommended that you read it top to bottom and do not skip directly to a section even if you do have a basic understanding of how this works, as it is relatively hard to properly categorize the skill level necessary to use some of these tools. 
<br>Without further ado, let us dive into this wonderful experience that are simulations.

### The visual version of the guide made by Tettles can be found here: https://youtu.be/a35xysEzS6c

<div id="setup">

# [2. Setup:](#setup)

</div>

Before beginning to properly sim on raidbots we will need the addon "Simulationcraft". This can be downloaded from the following link:
<br>After you downloaded the addon, you can go into the game and type the following into your chat:

```
/simc 
```

This will give you a "simc string" that contains a snapshot of your character that can be used in raidbots. The string can later be modified, but for now we will be using the base one in order to simulate our character on [Raidbots](https://www.raidbots.com/simb  ot)
<br>The raidbots website is a frontend for the original Simulationcraft application. It is way easier to use than the application and thus this guide will only cover raidbots and not the simc application.

Any other addons that have to do with sims such as AskMrRobot or Pawn are NOT recommended. 

<div id="novice">

# [3. Novice:](#novice)

</div>

<div id="quicksim">

## [Quicksim](#quicksim)

</div>
  
Quicksim can be used if you want to take a quick look at how much the dps number on your sim is (pretty useless in most scenarios), looking at the html report (in proficient section), quickly getting a string for advanced, or for looking at the sample sequence. 
<br>The sample sequence, as the name suggests, gives you a sample of what the robot will cast in that specific iteration of the fight. Sims usually have thousands of iterations and procs might affect what the robot will cast so one iteration will not have the same casts as the next one. A general understanding of how balance is played can be found through the sample sequence, although this is a harder version of reading [the Compendium](/balance/compendium).

<div id="topgear">

## [Topgear](#topgear)

</div>
  
Topgear is the main tool you should be using in raidbots. It will show you what the best items in your bags are, what to pick from your weekly vault and how to gem and enchant your gear. You simply click on what items/talents/gems/enchants you want to sim and it will show you what to equip. If you are using a free raidbots account and do not have enough iterations at your disposal, simply open more tabs and do multiple sims at the same time. 
<br>For gem sims select a few that you think would be worthwhile to sim, selecting all or a lot of gems will just increase the time a sim takes to finish and more often than not produce a lot of results that are withing margin of error of each other.


<div id="droptimizer">

## [Droptimzer](#Droptimizer)

</div>
  
Droptimizer should be used whenever you are trying to find what dungeon to farm in order to upgrade your gear or just as a quick list of what items you need from raid. It is important to note that you need an offhand/one hand weapon in order for Droptimizer to sim one hand weapons/offhands respectively.


<div id="options">

# [4. Options](#options)

</div>

<br>Fight style: Patchwerk (always, if you want to sim M+ you can create an MDT sim using this [Weakaura](https://wago.io/Yya4XBbl-))
<br>Number of Bosses: How many you want, usually 1
<br>Fight Length: How much you want, usually 5
<br>SimC Version: Nightly
<br>Raid Buffs: Use the "Optimal raid buffs" setting unless you explicitly don't want/have a buff for what you are trying to sim.

<div id="competent">

# [5. Competent](#competent)

</div>

<div id="string-editing">

## [String editing](#string-editing)

</div>

From this point onward it is highly recommended that you read the simulationcraft wiki documentation that can be found here: https://github.com/simulationcraft/simc/wiki

```
druid=Base
level=70
race=tauren
role=spell
spec=balance
talents=BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikIFolIJSSJRTcgQol0SSERDgCAE

# Bough of the Autumn Blaze (447)
head=,id=202515,gem_id=192958,bonus_id=6652/9229/9382/1504/8767/9413
# Torc of Passed Time  (447)
neck=,id=201759,gem_id=192958/192958/192958,bonus_id=8836/8840/8902/9477/8782/9405/8793/9376/9366,crafted_stats=40/49,crafting_quality=5
# Mantle of the Autumn Blaze (450)
shoulder=,id=202513,bonus_id=6652/9227/9410/9383/1507/8767
# Vibrant Wildercloth Shawl  (447)
back=,id=193511,enchant_id=6592,bonus_id=8836/8840/8902/9405/9376/8793/9366,crafted_stats=32/49,crafting_quality=5
# Chestroots of the Autumn Blaze (447)
chest=,id=202518,enchant_id=6625,bonus_id=41/9231/9382/1498/8767
# Life-Bound Bindings  (447)
wrist=,id=193419,enchant_id=6574,gem_id=192958,bonus_id=8836/8840/8902/9405/9376/8797/8960/8793/9366/9413,crafted_stats=40/49,crafting_quality=5
# Handguards of the Autumn Blaze (450)
hands=,id=202516,bonus_id=6652/9383/9410/8095/9230/1501
# Oblivion's Immortal Coil (450)
waist=,id=204399,enchant_id=6904,gem_id=192958,bonus_id=6652/9224/9219/9410/9383/1498/8767/9413
# Tassets of Blistering Twilight (447)
legs=,id=202596,enchant_id=6541,bonus_id=9410/6652/9224/9221/9382/1504/8767
# Toxic Thorn Footwraps  (447)
feet=,id=193452,bonus_id=8836/8840/8902/8960/9405/9376/9366,crafting_quality=5
# Entropic Convergence Loop (447)
finger1=,id=202572,enchant_id=6556,gem_id=192958,bonus_id=9410/6652/9413/9382/1504/8767
# Signet of Titanic Insight  (447)
finger2=,id=192999,enchant_id=6562,gem_id=192958,bonus_id=8836/8840/8902/8780/9405/8793/9376/8174/9366,crafted_stats=32/40,crafting_quality=5
# Ominous Chromatic Essence (441)
trinket1=,id=203729,bonus_id=9409/6652/9334/1495/8767
# Neltharion's Call to Suffering (457)
trinket2=,id=204211,bonus_id=6652/9410/9385/1498/8767
# Erethos, the Empty Promise (450)
main_hand=,id=202565,enchant_id=6655,bonus_id=6652/9410/9383/1498/8767
```

This is what a simc string looks like. In order to understand it better, we will split it into multiple categories. 

```
druid="Name"
level="70"
race="Tauren"
role="spell"
talents="BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikIFolIJSSJRTcgQol0SSERDgCAE"
spec="balance"
```

In this part of the string we can see some unimportant details like the name of the character, the character's realm, or where the string was created. The others are important though. 
<br>The race function allows us to edit what race the character is simming as. The talents row allows us to quickly edit what the talents are and we are even allowed to change the level or the spec of the character. The only useful options here are the talents and the race. 
<br>The talent string is made out of generated string, easiest is to use [Raidbots Top Gear](https://www.raidbots.com/simbot/topgear) or [Wowheads Talent Calculator](https://www.wowhead.com/talent-calc/druid/balance)
<br>The race string can be edited to any race you want. Any commands that are longer than one word can be combined through an underscore (_). Take Night Elf as an example. The command would be written as "race=night_elf".

Items strings are a bit more complex so lets dissect the strings even further. 

```
# Vibrant Wildercloth Shawl  (447)
back=,id=193511,enchant_id=6592,bonus_id=8836/8840/8902/9405/9376/8793/9366,crafted_stats=32/49,crafting_quality=5
```

Let's take this back as an example. This is a crafted 447 ilvl Vibrant Wildercloth Shawl with a [Graceful Avoidance](https://www.wowhead.com/item=200031/enchant-cloak-graceful-avoidance?crafting-quality=6) enchant. 
<br>The base ilvl (382) along with the name and what stats the item has is being assigned by the id (id=193511). The other stuff like ilvl scaling, quality of the item, and other bonuses are being assigned by the bonus id. enchant and gems can be assigned by enchant_id or gem_id.
<br>The stats of the item can be applied either through "crafted_stats=32/49" or as a bonus ID, "8793" would for example add haste/mastery to the crafted item.
<br>The slot in which the item is being put in is determined by the front word. In our case "back=". If we wanted to work with a ring, we would use "finger1=" or "finger2=" depending on which slot you want the ring to be in.
<br>The easiest way for you to sim an item that you want is to open Droptimizer, put your character in, and scroll down to whatever item you want click on it. This will redirect you to a wowhead page with the item. Through the Links option you can select "simulationcraft import string" and then paste it below your other item strings. If you wanted to sim another back in topgear with this method, you would have to put a "#" before the item string, otherwise your last back string would overwrite your first one instead of making it a selectable option.  

<div id="proficient">

# [6. Proficient](#proficient)

</div>

There are two ways of simming externals / raidevents (basically anything you would want to sim). Either through Expert mode or through Advanced. Expert mode can be found below the main options whenever you want to sim something and advanced is just its separate section. They can achieve the exact same thing, but depending on what exactly you want to do, one option might be more time consuming than the other. 

<div id="advanced">

## [Advanced](advanced)
  
</div>

The advanced option can be used for any sim if you know how to use it. Unlike the other options, advanced does not have the dropdown menus for the expansion options. You have to manually input them, otherwise the default will be automatically chosen. All of the expansion options can be found [here](https://github.com/simulationcraft/simc/wiki/ExpansionOptions).
All of the druid options can be found [here](https://github.com/simulationcraft/simc/wiki/Druids)

Here are some of the options specifically for Balance druid which lets you configure settings like how much pulsar/OB stacks you will have on pull. 
```
druid.initial_moon_stage=0
druid.initial_pulsar_value=300
druid.initial_orbit_breaker_stacks=20
```

The normal options are also customisable. If you want a 4:20 combat timer without variance you can add the following lines to your string:

```
max_time=260
vary_combat_length=0.01
fixed_time="1"
```

One of the unique functions in advanced is copy.  This allows you to sim multiple sets of gear, different APLs or different sim options side by side. Simply do a line of copy=*Name* and whatever was above this copy line will be copied below. To change this, simply add anything you want to replace and it will automatically be replaced. As an example if you have two cloaks inside a sim, only the bottom one will be simmed. This applies to basically anything. 

<div id="expert">

## [Expert](#expert)
  
</div>

Expert mode allows you to easily change something like [Blue Silken Lining](https://www.wowhead.com/item=193946/blue-silken-lining) uptime or add an external to any of your sims, including topgear. To use this, simply navigate to the bottom of your option menu, and tick the box with expert mode, then put whatever you want in the footer. For example "dragonflight.blue_silken_lining_uptime=0.4" in order to sim it with 40% uptime.

<div id="expert">
  
## [Useful Settings](#useful-settings)

</div>

### For all externals use [this link](https://github.com/simulationcraft/simc/wiki/BuffsAndDebuffs#external-buffs) and the string below as template.

```
copy="power_infusion210"
external_buffs.power_infusion="10/210"
```

<br>Replace 10/210 with the timers that you want to sim with for the specific external.
<br>Use the copy line if you want to see the difference between no external and with external in advanced. 
<br>replace power_infusion with the external that you want like in the wiki link.