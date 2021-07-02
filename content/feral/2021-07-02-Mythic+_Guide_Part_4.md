---
date: '2021-07-02'
authors: ["Foresight"]
published: true
title: "Feral Mythic+ Deep Dive Part 4"
series: ["M+ Deep Dive"]
series_title: "Part 4"
patch: "9.1"
  
---

![Image](https://cdn.discordapp.com/attachments/740562855316946985/799315733611413524/unknown.png)
# Part 4 - 9.1 and all the new stuff
In this section we will cover the following ...

  [What has changed for Feral with 9.1](#changes)
  <br>[- Covenant legendaries](#legendaries)
  <br>[- New Conduits](#Conduits)
  <br>[- Sanctum of Domination Shards](#Shards)
  
  [Recommended cookie-cutter build](#build)
  
  [The new seasonal affix Tormented](#affix)
  <br>[- Soggodon the Breaker](#Soggodon)
  <br>[- Incinerator Arkolath](#Arkolath)
  <br>[- Oros Coldheart](#Oros)
  <br>[- Executioner Varruth](#Varruth)

-----

<div id="changes">
  
## [What has changed for Feral with 9.1](#changes)
  
</div>

### What has changed ...
Basically nothing, no joke Feral is in almost the exact same place as it was in 9.0 from a M+ point of view. 

One thing that may go in our favour is with the meta shift away from fixed percentage breakpoints, you might see more chain pulling, which is what Feral loves, long sustained AoE pulls instead of burst AoE pulls.

**Apex fix**
Also Apex has been "fixed" to now correctly return 25 energy regardless of combo points you use the free bite at, whereas before it returned energy based on the combo points used (5 energy at 1cp, 15 at 3, etc). This makes Apex much smoother and act as an energy refund funnel in AoE - Apex now feels much nicer to use in M+.

**Frenzyband "fix"**
Unfortunately Frenzyband has now been changed to no longer double-dip damage on damage boost effects, such as the first boss of Mists. 

What happened before was say a boss had a +100% damage taken effect, the Shreds would hit for +100% damage which would ignite into the Frenzyband bleed. This bleed would then also do +100% more damage - this has now been changed so that it no longer double dips and only one of the +100% effects would be taken into account.

Frenzyband is likely still good in the +damage taken scenarios for the burst, but nowhere near as broken as before where we were seeing 50k+ burst on the first boss of Mists.

### What is new ...

<div id="legendaries">
  
### [Covenant legendaries](#legendaries)
  
</div>

Although on the PTR swapping covenants was allowed easily, unlocking all three soulbinds was not, so a lot of the below is subjective and based on sims and theorycraft not actual gameplay testing, so outside of the Night Fae legendary, take the rest with a pinch of salt.

**Night Fae** - {{< spell 354118 "Celestial Spirits" >}}
Unfortunately (depending on how you look at it) this new legendary is a bit underwhelming, it turns Convoke, an arguably fun and big button to press, into a bit of a noodley button. From testing it seems like the chance to get {{< spell 274837 "Feral Frenzy" >}} (which is Ferals special ability spell) to about 30-40% per convoke, there is some debate as to the actual inner workings of how minivoke works with the special ability of each spec so I won't go into it here, but safe to say this legendary is pretty weak currently.

The *one* potential saving grace of this legendary is the insane uptime of 16 stacks of {{< spell 322721 "Grove Invigoration" >}}, which is about 50%, but that gain is not enough to knock the other M+ legendaries off of their top spots for the Night Faes out there.

![Image](https://cdn.discordapp.com/attachments/337894455589994517/860502953932095488/unknown.png)

**Necrolol** - {{< spell 354123 "Locust Swarm" >}}
The Necrolol legendary is not in a good place unfortunately, this legendary is pretty laughable in any sort of AoE and has left the Necros in a not-so-great spot AoE wise ... still.

The Swarm lego provides a percent boost to the damage taken by the mob that it is on, and with the legendary this is a 60% chance to split, so the DoT could be on 2 or 3 targets if you're lucky. Compared to Circle which is 25% DoT damage gain to *all* targets, and doesn't have any RNG bouncing involved. 

![Image](https://cdn.discordapp.com/attachments/337894455589994517/860503002039975956/unknown.png)

**Kyrian** - {{< spell 354115 "Kindred Affinity" >}}
Kindred Affinity has some potential, as Kyrian is looking equal to if not better than Night Fae for M+ in 9.1, with the Mika power {{< spell 352188 "Effusive Anima Accelerator" >}} being very strong, this legendary might be able to compete with the existing choices of Apex and Circle as it empowers yourself and a party member for potential big burst combos on a very high uptime due to Mika's power of lowering the Kyr CD.

![Image](https://cdn.discordapp.com/attachments/337894455589994517/860503049322889296/unknown.png)

**Venthyr** - {{< spell 354109 "Sinful hysteria" >}}
This legendary does provide a large damage boost on a 3-minute Cooldown, but unlike the Boomies, we can't quite make as much use out of it with our 3 min CD not being as powerful - it is likely that for the incredibly rare Venthyr Ferals out there, Apex and Circle are still stronger choices.

![Image](https://cdn.discordapp.com/attachments/337894455589994517/860503101361487912/unknown.png)

-----

<div id="Conduits">
  
### [New Conduits](#Conduits)
  
</div>

Conduits now have an "empowered" system, which will unlock passively as you rank up your renown. All this does is make one of the Conduit input slots gold, which will add two ranks to the conduit - so bumping 252 (the 9.1 max) up to 278 ilevel. This means that you want your most impactful Conduits to be at the bottom (top on screen?) of the tree so they're empowered first.

Other than this, there are now two new conduits, which are both looking extremely underwhelming.

**Adaptive Armor Fragment**

![image](https://cdn.discordapp.com/attachments/337894455589994517/860501050486161438/unknown.png)

At ilvl 226, this averages to ~25 more agility, which as our other Conduits are pretty strong, this won't really see a place.


**Condensed Anima Sphere**

![image](https://cdn.discordapp.com/attachments/337894455589994517/860501111760093184/unknown.png)

Apparently the tooltip for this is bugged and at max rank it's supposed to be ~3.5% or so, still not worth it though vs Ferals other very strong defensive Conduit choices.

-----

<div id="Shards">
  
### [Sanctum of Domination Shards](#Shards)
  
</div>

The new raid comes with a new Shard system, which is a pseudo set-bonus system. How this works is that there are three shard families, which have three effects in each, a defensive, offensive and utility shard. If you equip all three from a family (so the defensive, utility and offensive of Unholy for example) you will get an additional effect.

The set bonuses do not work in M+, so you don't need to worry about having 3 of one shard family, which means you can be a bit more creative with your build. For example the below is likely looking strongest ...

- Shard of Dyz (Unholy DPS)
- Shard of Bek (Blood DPS)
- Shard of Jas (Blood Defensive)
- Shard of Cor (Frost DPS)
- Shard of Kyr (Frost Defensive)

Simply lock in the DPS gain Shards, then compare the Defensive vs Utility Shards to see how you want to finish out your build.

#### Unholy shards

- {{< spell 355766 "Shard of Zed" >}} - (Defensive) *When you heal yourself with an ability, you have a chance to gain an aura that drain Hp from enemies.*
- {{< spell 355757 "Shard of Oth" >}} - (Utility) *Increase your speed by 26.*
- {{< spell 355755 "Shard of Dyz" >}} - (DPS) *Increase your damage by 0.33%. Stacks up 4 times.* 	

#### Blood Shards

- {{< spell 355731 "Shard of Jas" >}} - (Defensive) *Increase healing received by 1% and max hp by 400.*
- {{< spell 355739 "Shard of Rev" >}} - (Utility) *Increase leech by 26.*
- {{< spell 355721 "Shard of Bek" >}} - (DPS) *When you have 50% more hp than your target, deal 2% more damage.* 	

#### Frost Shards

- {{< spell 355748 "Shard of Tel" >}} - (Defensive) *Your crits cause a nearby ally to gain a very small absorb.*
- {{< spell 355743 "Shard of Kyr" >}} - (Utility) *Gain 880 absorb every sec up to 4400.*
- {{< spell 355741 "Shard of Cor" >}} - (DPS) *Whenever you damage an enemy you haven't attacked yet, gain 3% damage for 20 sec.* 	

<div id="build">
  
## [Recommended cookie-cutter build](#build)
  
</div>

Niya seems to get stronger and stronger as this expansion goes on, and Korayn seems to get weaker unfortunately. 

The below tree will be your end goal if you're min/maxing for M+ and raid somewhat equally, putting the conduits in in this order means that ...

- {{< spell 341446 "Conflux of Elements" >}} (Convoke) will be empowered first, as it's a reasonable gain in ST and does boost AoE damage slightly as well during the cast
- {{< spell 340682 "Taste for Blood" >}} (TfB) will be in the final slot, as it's a good conduit for ST, but doesn't do much in AoE, so doesn't necessarily need to be empowered ASAP.
- {{< spell 340705 "Carnivorous Instinct" >}} (CI) in the slot before {{< spell 320660 "Poison" >}}, as if you switch to {{< spell 320659 "Burrs" >}}, it will be for ST, where you would still want TfB and Convoke, as CI is the AoE conduit of choice

Note that if you raid Mythic at a decent level, it is likely that prioritising TfB in the first slot over Convoke is better due to the ST gain.

![Image](https://cdn.discordapp.com/attachments/337894455589994517/860527075761061898/unknown.png)

-----

<div id="affix">
  
## [The new seasonal affix and recommended anima powers](#affix)
  
</div>

**Tormented**

I'm going to copy/paste a lot of this from Catha's well written Bear guide, feel free to check that out fully below, though I will be trying to correct some of his rambling grammar

https://docs.google.com/spreadsheets/d/1lqot6so0xiohnUjR5Qcs2zFYl9c0x7Ce8z9Lhg1rKSY/edit?usp=sharing

Also, it is likely that the powers dropped by the Lieutenants will see buffs and nerfs throughout the tier, and it is also likely I won't update this regularly, so please check in with the Ferals in Dreamgrove for any questions or an up to date recommendations. 

At different points during the dungeon you can find one of four new Lieutenants. Killing one of these Lieutenant awards you with a choice of three anima powers. You can only choose ONE amongst those three. These powers are fixed per Lieutenants. Which means that you always get the same powers from the same Lieutenant as long as your role (read DPS/Tanks/Healers) remains the same. 

Each of these Lieutenants has True Sight, does not give count and does not reset hp when you fail to kill them. The Lieutenants also have no social aggro so you can safely pull them through packs of mobs, without any danger of aggroing something with them.

As of writing, the Lieutenants powers are locked in as follows and all the latest hotfix information can be found here:
https://www.wowhead.com/news/patch-9-1-hotfixes-for-the-tormented-mythic-affix-reworked-and-retuned-anima-323174

![Image](https://cdn.discordapp.com/attachments/327879699810353152/860536050907349042/unknown.png)

<div id="Soggodon">
  
### [Soggodon the Breaker](#Soggodon)
  
</div>

#### What the Lieutenant does
Inflicts an aura increasing the physical damage you take by 50%. 

Will do heavy physical damage the entire time to the tank either via Crush, an ability with a short cast time dealing big damage, or via Seismic Wave, an AoE ability inflicting physical damage to everyone within 60 yards. Do note that you CANNOT kite Soggodon, and if you try, he'll just grip you back in and cast Crush on you. 

Roughly every 30 seconds he'll grip everyone in melee and start casting Massive Smash for 8 seconds. Everyone will be rooted, and must get out before the end of the cast or they will die. You have two choices here, either everyone in your group has an ability to get out of root (so you can Shift Forms, Shaman can Ghost Wolf, DH can Vengeful Retreat, Pally can Freedom, etc) so they get out on their own, or they cannot in which case you MUST kill the add that roots them in place, in order for them to get out.

As a note, I also want to apologise to my guildy Pasta who I left for dead every single time this was cast, it sucks to be a Priest this tier.
	
#### What power to take
The only power here really worth considering is 

- {{< spell 357524 "The Stone Ward" >}}
- {{< spell 356828 "Dripping Fang" >}}
- {{< spell 356827 "Tiny Dancing Shoes" >}}

Stone Ward is the only real sensible choice, increasing your HP is a no-brainer, Leech is good, but healing yourself when you've taken damage is worse than not taking the damage in the first place, and Dancing Shoes is a weird one.

![Image](https://cdn.discordapp.com/attachments/337894455589994517/858678316966084648/unknown.png)

<div id="Arkolath">
  
### [Incinerator Arkolath](#Arkolath)
  
</div>
	
#### What the Lieutenant does
His aura inflicts fire damage to everyone in combat with him. He also casts a debuff named Melt Soul on a random player that increases fire damage taken by 100%. So he basically is Pride 2.0. His other abilities are Scorching Blast, where he casts a circle of fire at the position of a player, there can only be 3 of those active at any given time, so don't worry too much about running out of space. And Inferno, a cast that you can (and should) interrupt that does fire damage to everyone in the party.	

#### What power to take

- {{< spell 357575 "Champion's Brand" >}} 
- {{< spell 357848 "Signet of Bolstering" >}} 
- {{< spell 357864 "Raging Battle-Axe" >}} 

This is another interesting Lieutenant for me, Champion's Brand is the "safe" choice, but Bolstering can be good in keys that have a lot of adds that will die at varying times (like DoS arden wing), and raging Battle-Axe has good uses in places with mobs that have a lot of HP for you to execute on, like in ToP military wing. 

I like this one as it's the only real selection that makes you stop and think about how you can use it in the key, more of them should've been like this.

![Image](https://cdn.discordapp.com/attachments/337894455589994517/858678365137272842/unknown.png)

<div id="Oros">
  
### [Oros Coldheart](#Oros)
  
</div>

#### What the Lieutenant does
His aura slows you down by 50%. Due to this and his power selection it's a very likely candidate to be skipped in any dungeon where the final boss does not require heavy movement. He'll cast a debuff named Biting Cold on a player, do not stand near them as that does damage in an AoE around them. Periodically casts Forst Lance in front of him, dodge it or take massive damage and get knocked away. He'll cast Cold Snap, an ability that spawns ice orbs around him, just move away from them to avoid taking damage	

#### What power to take

- {{< spell 357834 "Handbook of Uncivil Etiquette" >}}
- {{< spell 357815 "Satchel of the Hunt" >}}
- {{< spell 357825 "Vial of Desperation" >}}

Satchel of the Hunt could be fun in a key where there isn't a huge amount of interrupts to do, or the 10% increased damage from interrupting can't be utilised that much, but the Handbook is the only DPS increase so likely the go to choice. Don't take Vial.

Note: Sorry for the picture, this was taken on beta and "Imperfect Panacea" has been changed to "Satchel if the Hunt".

![Image](https://cdn.discordapp.com/attachments/337894455589994517/858678406257836042/unknown.png)

<div id="Varruth">
  
### [Executioner Varruth](#Varruth)
  
</div>

#### What the Lieutenant does
His Aura is a -50% to healing done.

Pulling it with other mobs is not recommended because of the aura, though if your group feels up to it, you can drag a few mobs in. Periodically he'll cast Wave of Terror, which to avoid you must be near another player, otherwise you'll be feared for 5 seconds. 

He'll also inflicts a heavy bleed on the tank via Sever

Finally he'll also periodically charge a random player and inflict a bleed on them and anyone standing near them via Carnage. As such avoid standing near other players unless Varruth is casting Wave of Terror, then it's just a bad situation and be prepared for it with Barkskin or Survival instincts.

#### What power to take

- {{< spell 357706 "Volcanic Plumage" >}}
- {{< spell 357575 "Champion's Brand" >}}
- {{< spell 357609 "Dagger of Necrotic Wounding" >}}

For Varruth, Volcanic Plumage is likely a locked in choice, the AoE knockup it does when it procs is very good for just shutting down packs from casting, especially if everyone in the group has it.

Necrotic Wounding is good if a key has a lot of healing that you'd like to stop, though I can't think of a huge amount of keys that do currently, and Champion's Brand is just a flat 8% crit, which is solid damage wise if the AoE knockup/silence isn't needed in the key.

![Image](https://cdn.discordapp.com/attachments/337894455589994517/858678274727870504/unknown.png)

-----
