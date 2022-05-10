---
date: '2022-05-10'
authors: ["Chicken"]
published: true
patch: "9.2"
title: Balance Druid Raidbots Guide
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

This will give you a "simc string" that contains a snapshot of your character that can be used in raidbots. The string can later be modified, but for now we will be using the base one in order to simulate our character on the following site: https://www.raidbots.com/simbot
<br>The raidbots website is a frontend for the original Simulationcraft application. It is way easier to use than the application and thus this guide will only cover raidbots and not the simc application.

Any other addons that have to do with sims such as AskMrRobot or Pawn are NOT recommended. 

<div id="novice">

# [3. Novice:](#novice)

</div>

<div id="quicksim">

## [Quicksim](#quicksim)

</div>
  
Quicksim can be used if you want to take a quick look at how much the dps number on your sim is (pretty useless in most scenarios), looking at the html report (in proficient section), quickly getting a string for advanced, or for looking at the sample sequence. 
<br>The sample sequence, as the name suggests, gives you a sample of what the robot will cast in that specific iteration of the fight. Sims usually have thousands of iterations and procs might affect what the robot will cast so one iteration will not have the same casts as the next one. A general understanding of how balance is played can be found through the sample sequence, although this is a harder version of reading [the FAQ](/balance/FAQ).

<div id="topgear">

## [Topgear](#topgear)

</div>
  
Topgear is the main tool you should be using in raidbots. It will show you what the best items in your bags are, what to pick from your weekly vault and how to gem and enchant your gear. You simply click on what items/talents/soulbinds/gems/enchants you want to sim and it will show you what to equip. If you are using a free raidbots account and do not have enough iterations at your disposal, simply open more tabs and do multiple sims at the same time. 
<br>For venthyr especially if you are doing gem sims and you ran out of space, removing crit and/or versatility gems might not impact the sim at all depending on your stats, as you usually do not need almost at all of those stats from gems. Night Fae might be different though especially if you have a low crit and vers sim from Venthyr and are trying to gear for Night Fae. 


<div id="droptimizer">

## [Droptimzer](#Droptimizer)

</div>
  
Droptimizer should be used whenever you are trying to find what dungeon to farm in order to upgrade your gear or just as a quick list of what items you need from raid. It is important to note that you need an offhand/one hand weapon in order for Droptimizer to sim one hand weapons/offhands respectively. It is very important to note here that some items might show as downgrades/upgrades that would usually not be seen as such due to IQD. See the [IQD](#IQD) section.


<div id="options">

# [4. Options](#options)

</div>

<br>Fight style: Patchwerk (always, Dungeon Slice is not optimized for Balance)
<br>Number of Bosses: How many you want, usually 1
<br>Fight Length: How much you want, usually 5
<br>SimC Version: Nightly
<br>Weapon Oil: Default
<br>So'leah's Secret Technique Stat: Mastery
<br>Unbound Changeling Proc: Mastery
<br>IQD Stat Proc Chance: 100% usually, change to however you want (0% on a 5min sim uses it once, 100% uses it twice, bloodlust cube is always used)
<br>Disable IQD Execute: Disabled (box ticked)

<div id="competent">

# [5. Competent](#competent)

</div>

<div id="iqd">

## [IQD](#iqd)
  
</div>

Probably one of the biggest traps in simming this expansion has been this fun trinket. Due to its very fun tooltip it has been very fun to point out every time that IQD was the sussy impostor all along whenever someone asked me why this 50ilvl increase in an item was a downgrade. Simming with this trinket can be a bit tricky, as some upgrades might show as downgrades and some downgrades might show as upgrades. You have to pay attention to how an item changes your stats. 
<br>As Balance you will want your IQD to always proc mastery inside a bloodlust window and haste/mastery outside of it. What this means is that if an item puts your haste rating above mastery, it will 95% of the times be a downgrade. This is not the end of the story though. If we could fix our stats even more after equipping that item through tools like gems enchants or jewelry (rings, necks) or even other pieces of gear that would otherwise be a downgrade without the aforementioned item. 
<br>Keep in mind that your stat RATING matters and not the percent. In order to see your stat rating on your character sheet on the default UI you have to hover over the percent. 

<div id="string-editing">

## [String editing](#string-editing)

</div>

From this point onward it is highly recommended that you read the simulationcraft wiki documentation that can be found here: https://github.com/simulationcraft/simc/wiki

```
druid="Name"
level="60"
race="Troll"
role="caster"
talents="1323322"
spec="balance"

covenant="venthyr"
renown="80"
# soulbind=general_draven:3,340159/256:11:1/319982/280:11:1/332756/272:11:1/269:11:1/332754/284:11:1/352415/254:11:1/352417
# soulbind=nadjia_the_mistblade:8,331586/269:11:1/331576/260:11:1/331579/271:11:1/270:11:1/331582/280:11:1/352366/254:11:1/352373
soulbind="theotar_the_mad_duke:9,336239/258:11:1/336147/280:11:1/336247/271:11:1/262:11:1/336245/263:11:1/351748/256:11:1/351750"

back=",id=189815,bonus_id=7187/8132/8138/6652/1524/6646,enchant_id=6203,context=6"
chest=",id=188849,bonus_id=7188/6652/8153/1492/6646,enchant_id=6230,context=5"
feet=",id=189848,bonus_id=7188/8118/8137/6652/1511/6646,context=5"
finger1=",id=178926,bonus_id=7088/6649/6648/6935/8156/7882/1588,gem_id=173130,enchant_id=6166,context=68"
finger2=",id=178824,bonus_id=7359/6652/7579/7798/1586/6646,enchant_id=6168,context=16"
hands=",id=188853,bonus_id=7188/6652/8154/1485/6646,context=5"
head=",id=188847,bonus_id=7188/6652/7580/8151/1485/6646,gem_id=173130,context=5"
legs=",id=172318,bonus_id=8121/7882/8156/6648/6649/1588,context=69"
main_hand=",id=189568,bonus_id=7910/1537/6646,enchant_id=6228,context=14"
neck=",id=173145,bonus_id=7881/7960,gem_id=173130,drop_level=60,context=13,crafted_stats=36"
off_hand=",id=178852,bonus_id=7842/7359/6652/1592/6646,context=35"
shoulder=",id=188851,bonus_id=7188/6652/8152/1492/6646,context=5"
trinket1=",id=188271,bonus_id=6652/7187/1524/6646,context=6"
trinket2=",id=179350,bonus_id=7359/6652/7784/1586/6646,context=33"
waist=",id=189773,bonus_id=7187/6652/8132/8137/1524/6646/7580,gem_id=173130,context=6"
wrist=",id=189812,bonus_id=7187/6652/7579/8132/8138/1524/6646,enchant_id=6220,context=6"
```

This is what a simc string looks like. In order to understand it better, we will split it into multiple categories. 

```
druid="Name"
level="60"
race="Troll"
role="caster"
talents="1323322"
spec="balance"
```

In this part of the string we can see some unimportant details like the name of the character, the character's realm, or where the string was created. The others are important though. 
<br>The race function allows us to edit what race the character is simming as. The talents row allows us to quickly edit what the talents are and we are even allowed to change the level or the spec of the character. The only useful options here are the talents and the race. 
<br>The talent string is made out of 7 numbers from 1 to 3. The location of the number corresponds to the row (t15, t30, t45, etc) and the number itself corresponds to the column (NB, WoE, FoN)  in the talent tree. Some examples can be found here:  [1112233](https://www.wowhead.com/talent-calc/druid/balance/mI6c) [3331122](https://www.wowhead.com/talent-calc/druid/balance/m-BM) [2223311](https://www.wowhead.com/talent-calc/druid/balance/mJtz)
<br>The race string can be edited to any race you want. Any commands that are longer than one word can be combined through an underscore (_). Take Night Elf as an example. The command would be written as "race=night_elf".

```
covenant="venthyr"
renown="80"
# soulbind=general_draven:3,340159/256:11:1/319982/280:11:1/332756/272:11:1/269:11:1/332754/284:11:1/352415/254:11:1/352417
# soulbind=nadjia_the_mistblade:8,331586/269:11:1/331576/260:11:1/331579/271:11:1/270:11:1/331582/280:11:1/352366/254:11:1/352373
soulbind="theotar_the_mad_duke:9,336239/258:11:1/336147/280:11:1/336247/271:11:1/262:11:1/336245/263:11:1/351748/256:11:1/351750"
```

This clump dictates your covenant, your soulbinds and your conduits. The covenant part is very similar to races, simply swap "venthyr" with another covenant f.e. covenant=night_fae. 

<br>The soulbind part is a bit more interesting. First it notes the name of the soulbind, then it notes the first trait of the soulbind, which in our case is Soothing Shade (theotar_the_mad_duke:9,336239). In this case the "theotar_the_mad_duke" part is irrelevant, but some letter has to replace it, as the ":9" part is dictating the soulbind (theotar). The number after theotar (336239) is for Soothing Shade. You can also replace the spellids with the actual names. For example "soulbind=theotar_the_mad_duke:9,soothing_shade".
<br>258:11:1 refers to a conduit, more specifically Born Anew. The "258" number refers to the conduit id which gives it its effect. The ":11:1" part gives it its ilvl, more specifically it gives the conduit rank 11 and empowers it by 2 ranks. Each conduit rank is 13 ilvls and thus a rank13 conduit is 278ilvl.


```
back=",id=189815,bonus_id=7187/8132/8138/6652/1524/6646,enchant_id=6203,context=6"
chest=",id=188849,bonus_id=7188/6652/8153/1492/6646,enchant_id=6230,context=5"
feet=",id=189848,bonus_id=7188/8118/8137/6652/1511/6646,context=5"
finger1=",id=178926,bonus_id=7088/6649/6648/6935/8156/7882/1588,gem_id=173130,enchant_id=6166,context=68"
finger2=",id=178824,bonus_id=7359/6652/7579/7798/1586/6646,enchant_id=6168,context=16"
hands=",id=188853,bonus_id=7188/6652/8154/1485/6646,context=5"
head=",id=188847,bonus_id=7188/6652/7580/8151/1485/6646,gem_id=173130,context=5"
legs=",id=172318,bonus_id=8121/7882/8156/6648/6649/1588,context=69"
main_hand=",id=189568,bonus_id=7910/1537/6646,enchant_id=6228,context=14"
neck=",id=173145,bonus_id=7881/7960,gem_id=173130,drop_level=60,context=13,crafted_stats=36"
off_hand=",id=178852,bonus_id=7842/7359/6652/1592/6646,context=35"
shoulder=",id=188851,bonus_id=7188/6652/8152/1492/6646,context=5"
trinket1=",id=188271,bonus_id=6652/7187/1524/6646,context=6"
trinket2=",id=179350,bonus_id=7359/6652/7784/1586/6646,context=33"
waist=",id=189773,bonus_id=7187/6652/8132/8137/1524/6646/7580,gem_id=173130,context=6"
wrist=",id=189812,bonus_id=7187/6652/7579/8132/8138/1524/6646,enchant_id=6220,context=6"
```

Items strings are a bit more complex so lets dissect the strings even further. 

```
back=",id=189815,bonus_id=7187/8132/8138/6652/1524/6646,enchant_id=6203,context=6"
```

Let's take this back as an example. This is a 278 ilvl Lurking Predator's Camouflage with a 20stam 30avoidance enchant. 
<br>The base ilvl (226) along with the name and what stats the item has is being assigned by the id (id=189815). The other stuff like ilvl scaling, quality of the item, and other bonuses are being assigned by the bonus id. enchant and gems can be assigned by enchant_id or gem_id. 
<br>The slot in which the item is being put in is determined by the front word. In our case "back=". If we wanted to work with a ring, we would use "finger1=" or "finger2=" depending on which slot you want the ring to be in.
<br>The easiest way for you to sim an item that you want is to open Droptimizer, put your character in, and scroll down to whatever item you want click on it. This will redirect you to a wowhead page with the item. Through the Links option you can select "simulationcraft import string" and then paste it below your other item strings. If you wanted to sim another back in topgear with this method, you would have to put a "#" before the item string, otherwise your last back string would overwrite your first one instead of making it a selectable option.  

<div id="proficient">

# [6. Proficient](#proficient)

</div>

There are two ways of simming externals / Theotar Tea values / raidevents (basically anything you would want to sim). Either through Expert mode or through Advanced. Expert mode can be found below the main options whenever you want to sim something and advanced is just its separate section. They can achieve the exact same thing, but depending on what exactly you want to do, one option might be more time consuming than the other. 

<div id="advanced">

## [Advanced](advanced)
  
</div>

The advanced option can be used for any sim if you know how to use it. Unlike the other options, advanced does not have the dropdown menus for the expansion options. You have to manually input them, otherwise the default will be automatically chosen. All of the expansion options can be found [here](https://github.com/simulationcraft/simc/wiki/ExpansionOptions). The ones that you will need as a balance druid are the following: 

```
shadowlands.enable_domination_gems="0"
shadowlands.soleahs_secret_technique_type="mastery"
shadowlands.titanic_ocular_gland_worthy_chance="1"
shadowlands.disable_iqd_execute="1"
shadowlands.iqd_stat_fail_chance="0"
shadowlands.unbound_changeling_stat_type="mastery"
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

Expert mode allows you to easily change something like Theotar Tea or add an external to any of your sims, including topgear. To use this, simply navigate to the bottom of your option menu, and tick the box with expert mode, then put whatever you want in the footer. For example "shadowlands.party_favor_type=primary" in order to sim with intellect theotar tea.

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


### For simming all Theotar Teas in advanced. The default is a combination of all four.

```
profileset."primary"+="shadowlands.party_favor_type=primary

profileset."haste"+="shadowlands.party_favor_type=haste

profileset."crit"+="shadowlands.party_favor_type=crit

profileset."versatility"+="shadowlands.party_favor_type=versatility
```

### For simming all Soleah stats in advanced. 

```
profileset."mastery"+="shadowlands.soleahs_secret_technique_type=mastery"

profileset."versatility"+="shadowlands.soleahs_secret_technique_type=versatility"

profileset."crit"+="shadowlands.soleahs_secret_technique_type=crit"

profileset."haste"+="shadowlands.soleahs_secret_technique_type=haste"
```

### For simming all Unbound Changeling stats in advanced. 

```
profileset."all"+="shadowlands.unbound_changeling_stat_type=all"

profileset."haste"+="shadowlands.unbound_changeling_stat_type=haste"

profileset."crit"+="shadowlands.unbound_changeling_stat_type=crit"

profileset."mastery"+="shadowlands.unbound_changeling_stat_type=mastery"
```


