---
date: '2021-02-15'
authors: ["Foresight","Maystine"]
published: true
title: "Feral Mythic+ Deep Dive Part 3"
series: ["M+ Deep Dive"]
series_title: "Part 3"
patch: "9.0"
---

# Feral Druid Mythic Plus - Deep Dive 

![Image](https://cdn.discordapp.com/attachments/740562855316946985/799315733611413524/unknown.png)

## Part 3 - Whats new in 9.1 and Min-maxing 
In this section we will cover the following ...
- [What has changed for Feral with 9.1](#changes)
  <br> - [Covenant legendaries](#legendaries)
  <br> - [New Conduits](#Conduits)
  <br> - [Sanctum of Domination Shards](#Shards)
- [Simming with “Dungeon Slice” for Mythic Plus](#Sims)
- [Build changes per key and why](#Builds)
- [Dungeon specific tips](#Dungeon_specific_tips)
  <br> - [General Dungeon advice](#General)
  <br> - [De Other Side](#DoS)
  <br> - [Mists of Tirna Scithe](#Mists)
  <br> - [Halls of Atonement](#HoA)
  <br> - [Sanguine Depths](#SD)
  <br> - [Plaguefall](#PF)
  <br> - [Theater of Pain](#ToP)
  <br> - [Spires of Ascension](#SoA)
  <br> - [The Necrotic Wake](#NW)

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

Frenzyband is likely still good in the +damage taken scenarios for the burst, but nowhere near as broken as before where we were seeing 50k+ burst on the first boss of Mists, with Apex and Celestial existing, I don't feel Frenzyband has a home anymore.

### What is new ...

<div id="legendaries">
  
### [Covenant legendaries](#legendaries)
  
</div>

Although on the PTR swapping covenants was allowed easily, unlocking all three soulbinds was not, so a lot of the below is subjective and based on sims and theorycraft not actual gameplay testing, so outside of the Night Fae legendary, take the rest with a pinch of salt.

**Night Fae** - {{< spell 354118 "Celestial Spirits" >}}
With the recent buff to make Celestial Spirits a 3s cast of 12 spells, this is likely to be a better all rounder than Circle or Apex, and arguably replacing Apex's niche in M+ content.

From testing Celestial, the results look as follows ...

![Image](https://cdn.discordapp.com/attachments/337894455589994517/864972153509773312/unknown.png)

It seems like the chance to get {{< spell 274837 "Feral Frenzy" >}} (which is Ferals special ability spell) to about 50% per convoke, there is some debate as to the actual inner workings of how minivoke works with the special ability of each spec so I won't go into it here, but safe to say this legendary is pretty solid and even a fine first craft as an "all rounder".

To add to the spells you get out of your 1 min CD convoke, you also get insane uptime of 16 stacks of {{< spell 322721 "Grove Invigoration" >}}, and with the Niya unlock at 55 renown, this gets even stronger {{< spell 352503 "Bonded Hearts" >}}.

A 1 minute CD is incredibly strong. A lot of Ferals (including myself) have been hard-locking this legendary in all content, the only real competitor now is Circle in larger AoE keys.

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
- Shard of Zed (Unholy Defensive)
- Shard of Bek (Blood DPS)
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

-----

<div id="Sims">
  
## [Simming with “Dungeon Slice” for Mythic Plus](#Sims)
  
</div>

Dungeon Slice is a good metric to use for M+ for Feral, please stop putting together weird 6 boss patchwork fights for 45s to justify your gear/talent choices. Using this type of quick sim to explore certain situations or pulls can be fine to plan around specific things, but for 95% of scenarios Dungeon Slice is the go-to.

Dungeon Slice is to M+ what Patchwork sims are to Raiding, at the end of the day when was the last time you sat there and a boss was 5 minutes of pure ST? It’s the same with DS.

What makes Dungeon Slice work for Feral specifically vs some other specs that do use weird patch setups, is that during Dungeon Slice sims, mobs die, which means we get Predator resets included in the sim, there are also moments of no combat, where the sim will re-stealth for stealth-Rake openers. The exact inner workings of a Dungeon Slice sim are as follows ...

    ST Boss for just over 2 minutes (lust will be used for this boss)
    4 - 6 mobs for 11 - 19 seconds
    1 - 3 mobs for 26 - 34 seconds
    4 - 6 mobs for 11 - 19seconds
    1 - 3 mobs for 26 - 34 seconds
    Continue alternating between large and small packs until the end of the sim
    There will be variable gaps of time between trash packs

So as you can see, it does somewhat mimic a “normal” M+ key, enough to be a good starting point for pre-key decisions such as talents, gear, etc. 

![Image](https://lh5.googleusercontent.com/PZnkwAB4r0yRGrRTPXcAtiIkYhf0bGWHq2LO2U7CdpF4AZe3HUU8cvkxa3d8Rvs-ysaHY9FOGptnq1K9OUYoRF0R1VBXfydJ8dlo6yiZ2j8x6LIn9WphiAMfwTwSvzein6hartGW)

The sim profile was changed recently and does now include 7 mob packs, the changes were as follows, which simple means that the Dungeon Slice sim spends …

    54% of its time on 1 target
    16% of its time on 2 targets
    9% of its time on 3 targets
    3% of it’s time on 4 targets
    6% of it’s time on 5 targets
    6% of it’s time on 6 targets
    6% of it’s time on 7 targets

Which as you can see is a little bit more Single Target leaning than a typical key (though it reasonably matchs SoA and ToP), so keep this in the back of your mind when preparing for the key you're about to do.

So in summary, don't be afraid to use Dungeon Slice - it is as valuable for M+ as Patch sims are to raiding.

-----

<div id="Builds">
  
## [Build changes per key and why](#Builds)

</div>

Feral talent changes are pretty restricted, it comes down to Pred vs SbT most of the time, as the rest of our talents are pretty hard-locked. 

So when I wrote this part originally there wasn't much choice or variation recommended, this has since changed and now there are a few different builds that are recommended in different keys, or playstyles. I went into the detail of what these builds offer in Part.1 so check that out for the reasoning. so ...

#### The Apex & Celest Builds 
More Single Target and Priority focused, consider this build in ...

- Theater of Pain
- Spires of Ascension
- Mists of Tirna Scithe

![image](https://cdn.discordapp.com/attachments/879667478916120596/879738407985754232/unknown.png)

**Circle Build**  
More general AoE focused, consider this build in ...

- De Other Side
- Halls of Atonement
- Plaguefall 
- Sanguine Depths
- Necrotic Wake

SotF focused
![Image](https://cdn.discordapp.com/attachments/879667478916120596/879741959432994816/unknown.png)

For a changeup and bit of fun ...
![Image](https://cdn.discordapp.com/attachments/879667478916120596/880425661540470826/unknown.png)

**Frenzy Build** - 
Meme fun in Mists and *potentially* SoA

- Spires of Ascension
- Mists of Tirna Scithe

So in Mists you basically only want this for the 1st boss. Because there is an Inn outside the key, you can actually do some extra fun stuff here where you run the below build up until the first boss, then during the death RP you hearth out (making sure to have set your hearth outside before the key), change your gear/build at the Inn, then walk back in. Hopefully another Night Fae in your group has activated the checkpoint or you have a long walk to get back.

![image](https://cdn.discordapp.com/attachments/879667478916120596/879738407985754232/unknown.png)

-----

<div id="Dungeon_specific_tips">

## [Dungeon specific tips](#Dungeon_specific_tips)

</div>

Fair warning, all of the “Meld BS” is potentially fixable by Blizz, so don’t blame us if you do it and get 1-shot :)

We’ve also collected the below tips from a few sources, please let us know if they get fixed or do not work.

![Image](https://lh6.googleusercontent.com/iJxxJonGZIPtoRpT5AF_q-gQkC7-9IzgUAe-oRcfwmz38Z8OLrLF6dpGDhCDkOY8H0LRw6fYHLW9bnRTd_n9XXclzqNTedZBtxkFV5Kq3hX4jHConQiVNswK39euHmu97P2A7e4h 
)

<div id="General">
  
### [General Dungeon advice](#General)
  
</div>

**Knowing your count**

Although this is often left to tanks, knowing a solid route and the count that some mobs give, to be able to help edit your groups route on the fly with extra pulls or to deal with ninja pulls can be a huge gain. I'd recommend downloading something like Mythic Dungeon Tools and playing around with routes.

**Some count % that might be useful:**

- **De Other Side**: 23.6% before entering Hakkar wing if you want 100% before killing Hakkar, this drops to ~16% if you skip the first pack by hugging the left wall (easily done). Manastorms wing (all mobs) is exactly 20%.
- **Halls of Atonement**: 79.5% before entering the 3rd boss room
- **Plaguefall**: 84.5% or 81.5% before jumping down (depends if you wanna kills some slimes at the right door).
- **Sanguine Depths**: 68.96% before jumping down after the second boss.
- **Spires of Ascension**: 87.37% before going up for Devos.
- **The Necrotic Wake**: 68.2% before going up into the Stichworks area

-----

<div id="DoS">
  
### [De Other Side](#DoS)
  
</div>

![Image](https://wow.zamimg.com/uploads/screenshots/normal/949066.png)

**General advice**

You can stun the seasonal mobs, such as Prides and Tormented mini-bosses with the Night Fae urns. I also recommend a good Rage mob stun WA like ...
https://wago.io/uuBcwkkL9/1

In the mecha area …

- An engineer can stop the three rivers of blobs by using the button that's to the left-hand side after you enter the room.
- You can pull all Lubricator and LoS their Lubricate cast (ranged can out range 30y+) and only kick the Self-Cleaning Cycle (first cast usually around 50-60% hp).
- This is a mechanic of the fight and not really a “trick”, but it’s surprising how few people know it - You can stun Manastorms with Echo Finger Laser X-treme (Z ability) and Shadowfury (purple circle around 1 person) to stop them from casting.
- Manastorms (Millificent's): If you position close to the boss and Spam click right near the boss and you can disarm the bombs instantly.

In the Hakkar area …

- Hakkar shield can be reduced by defensives such as Survival Instincts and Barkskin, since its shield is damage taken by players or mobs.

Wowhead recently did a very good write-up on Hakkar, who is arguably one of the worst designed bosses in this expansion, well worth a read:
https://www.wowhead.com/news/mythic-dungeon-boss-breakdown-the-difficulty-of-hakkar-in-de-other-side-321605

In the Arden area …

- Dealer Xy'exa Arcane Lighting jumps to the nearest person, so if you have high stacks get away from someone with it so it jumps to someone else.
- ~~You can skip the channeling RP if you kill the boss on the green orb to fly back and spam click the orb when it spawns, you can trigger the flight before the RP, saving a few seconds on the timer.~~ Fixed, don't do this, you now get stunned and drop down where you were if you do it.

**Feral specific advice**
- On the Hakkar wing, if a Hex is cast on you it does not need to be interrupted, as you cannot be polymorphed in cat - save those interrupts! 

**Meld and other BS**

- None found so far ...

---

<div id="Mists">
  
### [Mists of Tirna Scithe](#Mists)
  
</div>

![Image](https://wow.zamimg.com/uploads/screenshots/normal/949065.png?maxWidth=2400)

**General advice**

- ~~You can pull the pack to the right through the window after the 1st boss. This makes two pulls into one if you need to go right or want the count.~~ So this has *kind of* been fixed, you can now WC in Boomie from the top of the hill and Flap, then as you're getting close to the first puzzle you can moonfire the mobs over the wall, tricky to pull off though. This can also be done with pets by sending them through the wall of fog to pull mobs.
- In the maze, the "Stalker" mobs have a 1.5s cast that will target someone and put a nasty DoT on them - be ready to Bash it as the cast is going off.
- 2nd boss, you can mark the boss that passes and see the next doors she takes as well, they will always be the correct way, this lets you see two doors for free. - you can also set the boss to focus to see it on your map without having to target.
- The toad miniboss's Tongue Lashing (tank-targeted) can be outranged (12 yards). The tank just needs to run away a short distance when he starts casting it.
- On the last boss, if your healer is comfortable healing the damage while dodging the large swirls, it is best to NOT interrupt Consumption even when you can, because while doing that mechanic, the boss can't do any of her other mechanics (spawning the acid, spawning the adds, linking players), making the fight much simpler.

For the maze, get a good WA or Addon that shares the data with the party, to make this much faster - I recommend:
https://www.curseforge.com/wow/addons/maze-helper-mists-of-tirna-scithe

Also on the last boss, the Acid Expulsion tracks how you avoid them and will move in that way the next time they spawn. For example, if I move to the right 20 yards to dodge the circle, the next time the circles spawn, one will remain stationary, and one will move 20 yards to the right. If I dodge the 2nd spawn by moving 5 yards forward, then the next time they spawn, one will remain stationary, one will move 20 yards to the right, and one will move 5 yards forward. In order to prevent these acid puddles from being all over the boss arena, players should minimize their movement when dodging (e.g. you should dodge just enough to not be standing in the circles that just spawned and no further). This tracking is also affected by movement speed increases, so if you use sprint to dodge the mechanic, for example, the circle will move faster the next time it spawns.

**Feral specific advice**

- 2nd boss, on Mistcaller you can use your instant Entangling Roots on the Illusionary Vulpin to help your team.

**Meld and other BS**

- Once you kill the main pack in the room, and if for example you have Spites or have pulled other packs through the wall, you can meld and walk through the fog-door to force it to open. As long as the main pack that was in the room is dead, you can trigger the fog to vanish.

---

<div id="HoA">
  
### [Halls of Atonement](#HoA)
  
</div>

![Image](https://wow.zamimg.com/uploads/screenshots/normal/957519.png)

**General advice**

- You can stop the first 2 mobs from running up before the dungeon starts by having everyone in the group standing completely still after the key is put in. The mobs' movement is triggered when the first member of the group moves their character. This can help the tank group mobs faster if you plan for a big pull right out the gate.
- You can CC Deprayed Houndmasters (patrols) and dogs will also stop, making skipping these packs easier.
- 2nd boss, Echelon, the Stone Shattering Leap (his jump) can be dodged if you wait for its animation to start then run away from it (Gotta be fast) - this trick is almost mandatory to learn as on high keys Tyr it can 1-shot you. Dash or Nightfae blink is more than enough to do this properly.
- On the mini-boss before the last boss, you want to focus the ghosts on the pews, as these heal the mini-boss when he casts on them and they turn into the other mobs, save time and focus them.
- On the final boss, Lord Chamberlain, you can double soak the beams after doors of shadows by moving slightly into the boss's hitbox. Fair warning, this hurts and needs SI+Bark
- Also the statues will be thrown in the way they’re facing, so keep an eye on it as he channels up to throw them.

**Feral specific advice**

- Boomie convoke on the mini-boss before last boss to get a Starfall proc is huge, even without HotW.
- On 2nd boss, make sure that the adds have a long bleed on them before they turn to stone so when they get shattered by the Stone Shattering Leap you get a predator reset.

**Meld and other BS**

- NEVER meld during trash before the last boss, the Tormented Soul will bug and can’t be targeted and damaged anymore, so the only way for them to die will be to the Dark Communion cast from Inquisitor Sigar. Big time waste.

---

<div id="SD">
  
### [Sanguine Depths](#SD)
  
</div>

![Image](https://wow.zamimg.com/uploads/guide/seo/10335.jpg?1606286315)

**General advice**

- You can skip Insatiable Brute before the first boss room without needing to invisible pot or shroud, all you need is to wait for him to be far from passage then go.
- The smash can actually be out-ranged, It's something like 80 yards and stops balls from spawning. Quite easily done with Dash but not 100% sure how useful it is to be that far away for so long.
- The first boss Juggernaut rush can be parried (good luck).
- You can Line of Sight (LoS) the Dread Bindings from Grand Overseer (2nd boss) by running into the small rooms around the corridor.
- On the bridge before the gauntlet, for the last pack of the three hard trash...you can pull the two on the left without the third on the right if tank damage is an issue.
- During gauntlet, if you use Shining Radiance (Shield) at start of the pull you will have it ready for Gloom Squall cast.
- On the last boss, the 2nd person dashed to by wicked rush can dodge the bleed if they are moving.

**Feral specific advice**

- You can Shapeshift the Dread Bindings from Grand Overseer so that you don’t need to leave melee range.
- Barkskin plus Survival Instincts is a 60% DR, which more often than not (coupled with Bear) will allow you to solo soak a charge on 1st boss.

**Meld and other BS**

- On 1st boss, if you meld the charge it’ll go on someone else, which is useful if you want to try and get it on an immunity class.
- On 2nd boss, you can meld during Castigate (targeted red circle on you) once the channelling has started NOT while he casts it, and it’ll cancel and not re-cast, you can also LoS the ability in the cells.
- On the last boss, you can meld just right before he charges you so you avoid the bleed (same mechanic as the leap from Mechagon K.U.-J.0. boss).

---

<div id="PF">
  
### [Plaguefall](#PF)
  
</div>

![Image](https://wow.zamimg.com/uploads/guide/header/10330.jpg?1606286413&maxWidth=1630)

**General advice**

- Slime Tentacle: Crushing Embrace can be stopped with CC. This is especially important to note on the way to the 2nd boss because the constant plagueborer explosions can hit the person who is being held. You can also shift out of Cat which will cause the CC to break as well (it counts as a root).
- If you kill the mini-boss at the top of the stairs at the right time, you can get the the mobs with the barrels to follow you down the stairs to use them on a pack before the 3rd boss, on Fort high keys they basically 1-shot the entire pack.
- On the 2nd boss, you can easily Typhoon + Entangling roots the purple slime. This makes the boss fight way faster as you can ignore the damage reduction aura it has and leave it CC’ed.
- On the spiders before the 3rd boss, it's actually beneficiel to let the webbing go through, as it does no damage only a root, *but* stops the spiders casting the stealth spiders - meaning an easier time for everyone.
- On the 3rd boss, the Assassins can be broken out of their stealth with some skills you may not think to use. Tar Trap, Piercing Howl, Door of Shadows disorient, Incapacitating Roar, Starfall, Ursol’s Vortex, Warrior Shout, Flare, Blizzard and so on - for example Dash + Typhoon or Swipe is really good for quickly finding them all.
- On the trash before the last boss, you can walk past the first pack and kill the 2nd and 3rd "wave" of adds without having to deal with the caster mobs ability making this room easier to deal with (potentially not worth though, just pull it all).
- On the last boss, only tanks need to soak mob ability, no need to get yourself damaged in a healing heavy fight.
- Have different DPS pop CDs in different phases to push her into the transition phase, therefore limiting the number of Rains in every phase. E.g. CD’s P1, Hero P2, CD’s P3.

**Feral specific advice**

- Unstable Canister and Rigged Plagueborer explosion deal damage to both players and mobs so typhoon mobs into the barrels and typhoon the mobs carrying them into ideal places, then root them.
- On first boss you can use your instant Entangling roots on the big slime.
- If you stand on the small island to the right of where the boss is, and fight there, you can Mass Root every pack of the small slimes and effectively turn this boss into a target dummy

**Meld and other BS**

- none found so far ...

---

<div id="ToP">
  
## [Theater of Pain](#ToP)
  
</div>

![Image](https://wow.zamimg.com/uploads/blog/images/22104-datamined-shadowlands-mythic-dungeon-hotfixes-12-21-theater-of-pain-plaguefall-n.jpg)

**General advice**

- On the Shackled Soul trash (Kul'tharok area), pulling the first half into the starting room and the second half into the end room can save on a lot of group damage by avoiding the possibility of getting hit by swirls.
- Using the portals on the platforms fully heals you, so don't waste time waiting to be topped if you have a Nasty dot or have half hp.
- The Nefarious Darkspeakers (the ones who cast the black tornado knockback) target a random player for their tornado. You can help decrease the chances it goes on your ranged DPS/Healer (e.g. less mobile) by having the tank and melee DPS on one side while the ranged stand on the other.
- After Kul’Tharok jumping to the main platform is faster than taking the portal and doable without move speed.
- On the hook boss, Tenderizing Smash only pulls you if you are outside of its range. Stay relatively close to the boss until the circle appears and then move to make it less disruptive.

**Feral specific advice**

- The trash before first boss, the Raging Tantrum can be stopped by Soothing.
- On the first boss, the Raging (and Fixate) can also be stopped by Soothing.
- On Gorechop, make sure to have bleeds on both adds to allow some Tiger’s Fury reset if playing Predator talent.

**Meld and other BS**

- During Kul'tharok, you can meld the Draw Soul ability to spawn your soul instantly. Be careful with this though, as it despawns the hands when they "grab" you, so if someone else is in the same hands as you, it'd mean their soul won't be grabbed.


---

<div id="SoA">
  
### [Spires of Ascension](#SoA)
  
</div>

![Image](https://wow.zamimg.com/uploads/blog/images/19394-shadowlands-alpha-build-34821-loading-screens-and-icons.png)

**General advice**

- Forsworn Mender will buffs themselves with a weapon that can be dispelled and picked up by a member of your party to increase damage.
- If you can break the shield on Recharge Anima (Forsworn Goliath) before the mob reaches 50 anima, Rebellious Fist won't be cast until after the next Recharge Anima.
- You can skip the first 3 packs in the 3rd boss platform by…
  + walking near the edge
  + going behind pillars and jumping down
  + jumping up the stairs border and if someone can't do it use a two-seat mount to help them.
- Forsworn Usurper: use the pillar to LoS them so they group and don't pull extra stuff.
- On the 3rd boss, save big CDs for during the damage buff, e.g. convoke+berserk.
- On the last boss, if your party is stacked and your backs are against a wall, the boss charge won't go miles away from you and it will increase your melee dps by a bit.
- ~~If two DPS jump off during each orb collection phase, and be whirlwinded back up, in the sky above the boss is two circle spears, which can be thrown at the boss once the main spear has struck her. This does 100k+ damage that scales with Tyrn~~ Removed.

**Feral specific advice**

- You can use your instant Entangling Roots at the end of the Swift Slice cast from the Kyrian Dark-Praetor so that they don’t go out of melee (very tight timing on this).

**Meld and other BS**

- The 3 mobs before the last boss, the debuff drops at end of combat. So you can actually use Meld to drop the debuff at high stacks if you need to mid-combat. I tend to meld on the 3rd add when it's at ~50% hp to reset the damage I'm taking.

---

<div id="NW">
  
### [The Necrotic Wake](#NW)
  
</div>

![Image](https://wow.zamimg.com/uploads/blog/images/19331-shadowlands-alpha-build-34714-necrotic-wake-loading-screen-icons-maps.png)

**General advice**
- Throw Cleaver damages the first target it finds so you can hit mobs with it doing some nice damage.
- Make sure to use all weapons you can as they do a lot of damage (except the shield, it's pretty meh) ...

  - **Discharged Anima** - Unleash the stored anima, inflicting Arcane damage to nearby enemies and interrupting their spellcasting every 1 sec for 8 sec.
  - **Bloody Javelin** - Throws a Kyrian javelin at the target, inflicting Physical damage to all enemies it passes through and additional Physical damage every 2 sec for 16 sec. Enemies hit take 20% increased damage for 16 sec.
  - **Forgotten Forgehammer** - Hurls a mighty Kyrian hammer at the target, inflicting Physical damage and stunning the target for 8 sec.
  - **Discarded Shield** - Activate to reduce damage taken by 50% for all allies within 8 yds for 6 sec.

**Feral specific advice**

- If the skeletons on 2nd boss live to long, you can Cyclone them or stun them just as the explosion is going off, then they will not explode and wipe the group.
- On the last boss, if everyone is out of range you can shift form to break the root.

**Meld and other BS**

- You can meld any Morbid Fixation during trash before 3rd boss and also during the boss if the hook failed to cancel it.
- ~~You can Immune the death exile cast of the last boss in NW with basic immunities like Divine Shield or Ice Block but also with a warlock gateway (and Priest Leap of Faith). Make sure that the projectile of the cast is about to hit you before you take the gateway. Bear in mind that you will die when the debuff runs out but maybe it helps you to squeeze out that extra dps. This can also be Melded (needs verifying, Fore: verified, but incredibly tight timing)~~ Mostly fixed and the crit buff it gives is now 100%.

-----

**To be Continued in Part 4...**

- What would you like to see changed to M+ Feral
- Feral QnA

---
