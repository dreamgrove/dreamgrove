---
date: '2020-09-10'
authors: ["Jundarer, Goosy"]
published: true
patch: "8.0"
title: Moonkin Feedback - Shadowlands Beta
---

This is an article made to give feedback on Moonkins current state in the Shadowlands Beta. It also serves to educate people on many of the common problems Moonkin suffers from currently in Shadowlands. If you disagree with anything said in this article that is completely ok and you should voice your feedback on the forums or anywhere else regardless. 

All numbers mentioned are backed up using sims found at https://www.dreamgrove.gg/beta/. Please check out this site for detailed info on all combinations. Sims assume all bugs are fixed.

## Comments on recent changes

We have now reached a point where all covenants are fairly close on single target with the only exception being Kyrian. The main reason for this though is that the Kyrian soulbind tree for Pelagos allows you to pick 2 dps binds and 2 dps conduits while every other tree for any covenant only allows you to pick 3 dps binds/conduits total.

For AoE most being equal on single target means that starting on 3-4 targets Night Fae and Necrolord start falling off, making Venthyr and Kyrian the easy winners if they are very close enough in lower target situations.

Convoke the Spirits has recently gotten a change (https://us.forums.blizzard.com/en/wow/t/feedback-druid-class-changes/490706/987) which said that it was made to be more consistent. Recent raid testing has shown this to not be the case and even made it more inconsistent. You can now have Convokes with 0 Starsurge total, it sometimes doesn't cast Starfall and still completely breaks down if you cast it in melee.
Example cases:
7 heals:

![Image](https://cdn.discordapp.com/attachments/370236266530471937/774434920343928882/unknown.png)

0 Starsurges:

![Image](https://cdn.discordapp.com/attachments/370236266530471937/774423723289477120/unknown.png)

8 Off-spec casts in melee:

![Image](https://cdn.discordapp.com/attachments/370236266530471937/774407423695650816/unknown.png)

Hopefully this will fixed so Convoke at least has a chance.

Adaptive Swarm is also in an interesting spot where the best play is to have your entire raid/party bind /cancelaura Adaptive Swarm into their rotation so that you can get more uptime of the debuff for single target encounters. For example while gaming how the buff resets its duration without cancelaura gets you about 70% uptime, everyone using cancelaura will allow nearly 100% uptime meaning about 40% value will be gained if done correctly. 

Kyrian still feels horrible to use as it is off gcd and is entirely passive for both parties but is tuned well enough if Pelagos is fixed. Its value is highly volatile as any high damage taken during the buff can nearly nullify the damage gained and it's highly dependant on syncronizing damage windows.

Venthyr is the only Covenant that you don't have to work against to use properly and with the conduit nerf it is now on the bottom for single target by a very small margin but quickly catches back up with a few targets added.

Pulsar has joined the fray with the buff to 12s duration meaning we now have 3 viable legis with BoAT (significantly ahead for single target), Circle of Life and Death and Primordial Pulsar. Both Circle and Pulsar are better in AoE.

## General


### Scaling

Wrath Haste caps at 70% Haste which is reached with just base 18.9% Haste during Bloodlust+Celestial Alignment/Incarnation or 9.1% with Starlord added on top, making high haste feel very bad. Previously we could make slight use of this Haste by switching to Starfire on single target but now due to Starsurge Empowerment you are often stuck casting Wraths far below the gcd cap.

Our damage is very focused in our Celestial Alignment/Incarnation windows due to mastery double dipping and since it is our best stat we will have a lot of it. The more secondaries and thus mastery we have the more our damage will be focused into the cooldown window making all other timeframes feel worse and worse. Even the recent changes will inevtiably push us more towards our CD window as long as mastery double dipping exists.

The plentiful amount of crit buffs makes crit undesirable or even useless especially when combined with the legendary Balance of All Things (more about that later). Any crit increase means that this part of our damage now has zero scaling with crit making us scale worse than any spec that doesn't have crit increases in addition to the haste problems.

Since mastery has now been heavily nerfed for the second time we now have no stats left that scale well so even if we are tuned well at the start of a tier we will fall off the more gear people get. Due to that we will require new buffs every tier to keep up with others similar to how other specs like Windwalker have fallen off in the past.

### AoE and Starfall

A lot of our AoE damage comes from Starfall of which you can’t have more than one up at any time. This means that once enough Astral Power is generated during AoE any further Astral Power has to be used on Starsurge which is not a relevant dps increase or even a dps loss with enough targets (this includes the Empowerment bonus).
For high Haste or higher Astral Power generation to feel good we need to be able to effectively spend our Astral Power in some form. A solution would be any way to effectively spend Astral Power in AoE, be it a stackable Starfall, a (duration) hasted Starfall, an option to condense the Starfall damage, a way to empower Starfall with more Astral Power or anything of similar effect. 

Putting more power into Starsurge would start us down a road similar to BfA where we only used Starfall on 7 or more targets with the standard gear setup. Additionally casting a big single target nuke in AoE will always feel bad. As an example completely ignoring Starsurge during Lunar Eclipse even when capping Astral Power ist just a 0.5% loss and on 6 targets it is a gain to overcap Astral Power.

### Starsurge Empowerment

This recent change made Starsurge buff all following fillers in that Eclipse hidden in the tooltip of each Eclipse. Wrath is buffed by an additive 6% during Solar Eclipse per starsurge cast, and the crit chance of Starfire is buffed by an additive 6% with each cast during Lunar Eclipse.

While more damage is better than no compensation for the removal of the Eclipse extension (which was arguably a good decision), this brings with it a number of problems.
Later Starsurges become worth less than earlier Starsurges in each Eclipse. What this results in is that pooling Astral Power is now always a dps loss which is our only way of reliable handling movement during st encounters, effectively nerfing our already lacking movement.

As mentioned earlier, making Starsurge increase AoE damage is a dangerous path as seen in BfA. As a whole the Starsurge Empowerment feels like an afterthought and only has a negative impact on gameplay.

### Tuning

Currently Balance Druid is tuned low to okish with now being good in their niches.
~~Dots deal a low amount of damage to the point of Moonfire sometimes barely being worth casting on multiple targets. This is due to giving up significant amount of Astral Power generation and thus when having to dot more often not being able to keep up Starfall.~~
This is partly fixed due to Shooting Stars having been buffed a significant amount. Moonfire is still not worth casting during Lunar Eclipse in AoE with Soul of the Forest.

~~Shooting Stars baseline had an extremely minor impact as it’s tuned very low. The extra Astral Power is of little use in AoE scenarios and on single target it generates as little as 4% of our total Astral Power, only going up a small amount with more targets. The increase in power mentioned in a blue post is not implemented as of now.~~
Shooting Stars is now a relevant increase in Astral Power generation.

~~As a whole our Astral Power generation is very low which leads to rather stale gameplay of pressing your filler about 5 times on single target and 6-7 times in AoE between each spender with dots slowing things down even more due to Shooting Stars generating so little Astral Power. On single target a higher Astral Power generation would help gameplay flow a significant amount but on AoE this would require changes to Starfall to have an impact as described in the AoE and Starfall section.~~
With the Shooting Stars/Solstice and Soul of the Forest buffs we are now in a much better shape in terms of Astral Power generation but the problem with Astral Power in AoE with Starfall still exists. How the increased generation feels in single target is to be seen.

## DPS Talents 

### Tier 15:

Nature’s Balance is the strongest single target choice and solves the problem of having to generate up to 50 Astral Power to start using a filler. Starting from 0 Astral Power means that during AoE it takes about 12 seconds before you can use your first Starfall otherwise.

Trees have their niche in tanking in M+ but deal basically no damage.

Warrior of Elune is now a competitive pick due to the Starfire buff on single target but requires SotF to be good on AoE. Low cd, off gcd abilities can feel bad to use as we are a spec that is hardcasting most of the time.

### Tier 40:

Soul of the Forest is now by far the best AoE talent as Starfire no longer deals AoE damage without it. On single target it is very bad as half of its value has no effect there.

Starlord is now the best pick for anything single target and still doesn't work Starfall as you are unable to stack it up when you can only use your spender every 8-10 seconds.

Incarnation has taken multiple hard hits with nerfs to our cooldowns and mastery. It is now a bad pick in all situations.

### Tier 45:

Stellar Flare is similar to Starlord in that it is only good on single target and starts being and feeling very bad with any further added targets.

Twin Moons and Stellar Drift both fit the exact same “niche” meaning one will always be picked over the other. ~~Currently Starfall is strong enough and or dots are weak enough for Stellar Drift to always be the superior pick when deciding between the two.~~ It is no longer always the strongest but even when slightly behind the mobility is too much of a factor to give up.

One reason why Legion AoE felt so good is because we had access to both options.

### Tier 50:

Fury of Elune has its only niche in burst damage but outside tuning feels good to press.

Solstice is a fun addition that fits as a passive talent and with the Shooting Stars buff outperforms both other talents.

Moons do not scale as well with AoE since only Full Moon splashes meaning it will always fall off on multiple targets which is fine but even on single target it’s outclassed. Outside tuning Moons freshen up the rotation which is always positive.

## Covenants

Generally Night Fae is the only Covenant ability that feels good to use (outside of major problems mentioned later). The others are either passive or just used on cd and have barely any impact if any at all on the rotation as they do not interact with the spec itself to a relevant degree.
 
### Kyrian
This covenant is dependent on your partner which can make or break it’s usability. Generally you will simply bind yourself to the highest dps player in the group/raid and hope for the best.

This feels very bland to press as it’s basically a global that increases the damage of 2 people by roughly 20%, more/less one way or the other, for 10 seconds while having zero gameplay interaction. The pooled damage is used up by 20% of damage done, healing done and damage taken over 20 seconds.
Many players feel that essentially giving another player a part of your dps is unfun in addition to the ability already being bland. Assuming both players deal the same amount of dps it’s the best single target option, getting better when the other person deals more damage.
The pool being used up by taking damage or passive healing adds another layer of obsucrity of how much value you are actually getting.

### Necrolord
The effect buffs dots which interestingly enough includes Fury of Elune and Starfall.

You can have a maximum of two debuffs on any targets at any time with just one being more common meaning that it has no scaling above two targets allowing for anything that does scale with more targets to quickly outscale it.

~~As the hot or dot increase is the same for all Druid specs and Balance Druid currently has the weakest dots, this ability can't be good for Moonkin without being potentially broken for other Druid specs.~~
This was fixed with the change to having a Balance specific effect.

### Night Fae
Very volatile ability that as a whole has found the most positive reception in terms of gameplay.

The non spec specific casts heavily depend on your surroundings. At range, and without any injured allies, and under the assumption it casts 13 spells as it currently does due to a bug, you end up with ~11.5 damage casts. Going into melee replaces 3-4 Balance Druid spells with Feral spells which deal close to no damage effectively reducing its value by ~30%. Having more injured allies which is usually the case in dungeons and raids replaces another ~2 Balance Druid spells with healing casts. In the worst case that means an unfavorable situation halves the potential damage of a Convoke cast compared to an optimal situation.

The value of this ability lies in its high amount of single target burst but at the same time it has very little AoE value. The extra Starfall or Starsurges are not very useful as discussed in the earlier Starfall section. 

It currently has no smart targeting meaning you cannot focus anything if there are any additional targets present and can hit immune targets which heavily diminishes its value when those are present.

### Venthyr
A basically passive macro and forget ability that buffs your Celestial Alignment or Incarnation.

While boring this ability has the upside of always being useful as it simply buffs your damage. Heavily plays into the problem of Wrath quickly hitting the gcd cap. Even with 0% Haste you hit the gcd cap in only 6 casts during Bloodlust. 

Further forces a significant amount of your damage into our cooldown window every 3 minutes which makes the other 2:40 min feel even worse than they already do.
Due to the conduit this further reduces the value of crit for us.

The potential downside of taking damage and being stunned seems out of place considering no other covenant ability has a negative effect but ultimately will only be problematic when frenzy was used in a suboptimal situation in the first place.

## Legendaries

### Balance of All Things

Unique legendary that has a relevant impact on your rotation but heavily simplifies it. The resulting playstyle consists of casting fillers for about 15 seconds and then casting 3 Starsurges ad infinitum for single target but has no impact on the rotation in AoE.

Creates haste breakpoints in single target due to being able to fit in more starsurges in the one second buff windows and caps how much astral power generation is worth between the crit windows as getting any more than going to 90+ astral power again have heavily reduced value.

Very, very heavily reduces the value of crit making it by far our worst stat with this legendary.

Due to various changes this is now the best legi in most situations.

Has anti-synergy with our cooldowns which always feels bad.

### Oneth’s Clear Vision

If tuned well enough it will have a positive impact on the rotation as it had in Legion.

Outclassed in all aspects by nearly all other Legendaries in all scenarios.

It allows you to play Stellar Drift on single target for only a very minor loss which heavily increased movement.

~~As long as the vast cost difference between Starfall and Starsurge exists this will only be good on single target.~~
This is partly fixed with the chance difference for each spell but since Starsurge is still useless in AoE this only fixes one part of the problem if it can be called a problem. However it is tuned it will end up being a single target legi.

### Primordial Arcanic Pulsar 

Has the upside of always having some value since it now works off Astral Power spent.

If it extends Celestial Alignment or Incarnation it has very good value due to Starsurge Empowerments, but otherwise has anti-synergy with it since it resets all stacks upon entering and only last 9 seconds compared to the standard 15 seconds.

Due to various nerfs to our cooldowns and mastery it is now in a fairly bad state.

### Timeworn Dreambinder

Significantly changes your playstyle on single target as you try to keep up the buff. It is possible to keep up the buff at all times with low haste already so there is no high skill floor like it used to have in Legion.

Nearly useless in AoE as it is impossible to keep up the buff when you can only cast Starfall every 10 seconds.

### Final thoughts on Balance legendaries

Dreambinder and Oneth's will only ever be good on single target and if Balance of All Things isn't tuned heavily above the other options it will also be a single target legendary as it synergizes more with Starsurge dumping than our consistent AoE damage pattern with Starfall and dots. This means the only spec-specific legendary that really works and feels good any time you Starfall (which is any time you fight more than 1 target) is Pulsar.
The generic druid legendary Circle of Life and Death is dangerously close to overtaking all other legendaries in all scenarios.

## Conduits

Sims can be found at https://www.dreamgrove.gg/beta/.
  
### Deep Allegiance (Kyrian)

At earlier ranks can be a dps loss due to desyncing with common one and two minute cds.

### Endless Thirst (Venthyr)

~~Tuned a lot higher than all other conduits and further reduces the value of crit.~~ Fixed

### Evolved Swarm (Necrolord)

Very simple increase that is rather weak as it isn't affected by the Balance specific increase but still ok.

### Conflux of Elements (Night Fae)

Simple damage increase with the only caveat being that dots and Starfall cast by Convoke are not affected by it as most their damage comes after the channel.

## Bugs/Inconsistencies

Solar Eclipse does not reduce the GCD of Wrath further than 0.75s even though its effect is meant to do so as shown by other specs. For example Elemental Shamans Storm Elemental Lightning Bolt cast time reduction.

Convoke the Spirits will only cast healing spells if you are further than 40yd from the target, even if the target is in range of the rest of your spells.

Adaptive Swarm jump range appears to only be ~20m instead of the 35m it should be.

Rebirth revives with 60% of max hp instead of the 100% it should with rank 2 Rebirth.

Starfall will pull any mobs that are in fight with each other which causes you to not be able to do damage any time those type of packs are nearby.

Starfall and Fury of Elune are not affected by Circle of Life and Death legendary, despite it counting as a periodic effect for Adaptive Swarm. Functionally this could be intended but is inconsistent.

~~Convoke the Spirits casts 13 instead of 12 spells since its tick rate is 0.333.~~ Fixed

~~Endless Thirst (venthyr potency) grants 20% Crit per stack, not 2% at base level making it hard to get an accurate picture of how Venthyr actually performs during testing.~~ Fixed

~~Arcanic Pulsar procs with Incarnation give you 100% crit instead of 10%.~~ Fixed

~~Balance of All Things buff application is delayed and only applied after a queued instant spell such as Starsurge.~~ Fixed

~~Door of Shadows cannot be cast while moving with Stellar Drift.~~ Fixed
