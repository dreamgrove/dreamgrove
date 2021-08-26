---
date: '2021-01-29'
authors: ["Foresight","Maystine"]
published: true
title: "Feral Mythic+ Deep Dive Part 2"
series: ["M+ Deep Dive"]
series_title: "Part 2"
patch: "9.0"
---

![Image](https://cdn.discordapp.com/attachments/740562855316946985/799315733611413524/unknown.png)

## Part 2 - Getting the most inside the key

In this section we will cover the following ...
- [Rotational Plays](#Plays)
- [Cooldown usage](#Cooldowns)
- [Affixes](#Affixes)
- [9.0 seasonal affix - Prideful](#Prideful)
- [9.1 seasonal affix - Tormented](#Tormented)
  <br> - [Soggodon the Breaker](#Soggodon)
  <br> - [Incinerator Arkolath](#Arkolath)
  <br> - [Oros Coldheart](#Oros)
  <br> - [Executioner Varruth](#Varruth)
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

---

<div id="Plays">
  
## [Rotational Plays](#Plays)
  
</div>

This section has been provided with BuffMe’s input (although he blames Shmoo) on the #Feral discord, so any errors please blame him - it is also somewhat volatile so any questions always check in with the Discord.

### General play
Generally speaking, depending on your talents, you can follow the below priority per target count.

![Image](https://cdn.discordapp.com/attachments/337894455589994517/806825667374219274/unknown.png)

In terms of maximising what you do pack to pack, when you first open on a pack the main things to keep in mind are as follows …

- have combo points ready from the last pack (where possible)
- have one/two {{< spell 319439 "Bloodtalons" >}} stack(s) ready from last pack (where possible)
- have {{< spell 5217 "Tiger's Fury" >}} up from the last pack *and* off CD (where possible)
- get {{< spell 285381 "Primal Wrath" >}} (PW) rolling as quick as possible
- stop applying DoTs when the mobs are about to die (this goes for PW spam and Rake)

This means that if you come from the last pack with no CPs, it is optimal to Stealth, Rake opener, Thrash and then Primal Wrath instantly with the 2 or 3 combo points you get, then carry on with the rest of your rotation.

So, what about Rake - Well Rake in M+ is good, but only if the mob will live for enough of the Rake's duration to make it worthwhile to spend the energy, so Rake in M+ comes down to two things…

- will the mob live long enough?
- are there 3 or less targets?
- can you really be bothered for the gain over Swipe spam?

### Knowing what to cast
I hear a lot of talk about *"My Bite does ~15k damage, why is a ~3k PW hit better?"*, and the answer is DPE vs DPR.

- DPE = Damage Per Execute ... aka how much damage you do per button press
- DPR = Damage Per Resource ... aka how much damage you get out of the energy you spend

If you go by DPE, then Bite is better up until 9 targets:
![Image](https://cdn.discordapp.com/attachments/337894455589994517/835479307039277056/unknown.png)

But, if you go by DPR, then PW spam takes over at the ~4 target range. 
![Image](https://cdn.discordapp.com/attachments/337894455589994517/835479386740097064/unknown.png)

Note that this is dependant on **YOUR** talent, stats and gear, so you should always check for yourself

https://docs.google.com/spreadsheets/d/1W1sjoMJJCzVFVnk0L5yDBg30UX2Msio2vF69uLMxlsg/edit?usp=sharing

### Boomkin in M+?
Yup, this is a thing that exists, it’s feelycrafty more than factually mathed and simmed, but my (Fore’s) go-to is the below. The idea is to fish for {{< spell 191034 "Starfall" >}}, so make sure the pack will last long enough to get the full use of the Starfall AoE. It's worth knowing that it has a 90% chance to roll on 4+ targets, and is basically worthless when it doesn't proc Starfall

- 1-12 targets = Feral convoke
- 13+ targets = Consider Boomie convoke (even without HotW)

That said, I do think people undervalue Feral Convoke in AoE, i've gone up to 25k+ with a Feralvoke so feel free to mess around with it and see what works for you.

**{{< spell 93402 "Sunfire" >}}** - So Sunfire is potentially strong in M+, and you can weave it in when low on energy, the biggest problem though is that you are not in cat form and so are locked out of some of your utility and mob control that is arguably more important in a key. Optimal play in M+ does make use of Sunfire, but don't feel you have to.

-----

<div id="Cooldowns">
  
## [Cooldown usage](#Cooldowns)
  
</div>

### Cooldown usage
Generally, more CD usage in M+ is better than optimal CD usage, so you should be looking and planning ahead to squeeze in CD uses, talk to your team, particularly your tank, ask questions like "how long between now and boss X", to get an idea of when and how you can tweak routes to get more CD uses in play.

With {{< spell 354118 "Celestial Spirits" >}} this is even more true, as 1 minute CDs are incredibly useful in that they are up every 1 minute (top tier advice here) - use it on CD.

Currently we have two very strong CDs in M+ that can be used for both ST and AoE as well as working well together.

- **{{< spell 50334 "Berserk" >}}** - Berserk has undergone some changes since SL that make it pretty big on sustained AoE, it's no huge AoE burst like some specs have out there but it's still very solid all rounder.
- **{{< spell 323764 "Convoke the Spirits" >}}** - Convoke is huge, it's a 4s channelled nuke that switches up based on what form you are in. Feral convoke also casts the Lunar Inspiration version of Moonfire, which means it's AoE potential in Feral form is bigger than some would give it credit for.

*That said* there are times and routes where CD usage matters, for example if your group is planning around a Pride burst window to burn down a group or a boss, or a particularly nasty pull that needs to be burned down to be efficient (e.g. SoA double pack mid-way through between 1st and 2nd boss with spear), then you need to hold CDs. Talk to your group and coordinate these types of pulls to make sure you have yours ready.

For more info on Convoke, check out the [Beta Convoke Test Data](https://docs.google.com/spreadsheets/d/e/2PACX-1vTwxWnGzNZw7CxBzN4XaoeW43Y0y2xjRnqEtpP76tTQ9GdB815wnhCA4Zm2ekofWZtkpWcuKqNcU3nv/pubhtml#)

### In Berserk
The Feral rotation changes a little in Berserk, as Combo Points gain value due to the refund and the Stealth-modified spells also gain value, it's worth being aware of how  to use Berserk in different situations:

![Image](https://cdn.discordapp.com/attachments/337894455589994517/806122266801995777/unknown.png)

-----

<div id="Affixes">
  
## [Affixes](#Affixes)
  
</div>

### Seasonal and affixes on all keys

**Tyrannical** - *Bosses have ~~40~~ 30% more health (recently nerfed). Bosses and their minions inflict up to 15% increased damage.*

Tyrannical weeks are Blizz’s way of telling you to take a week off, a cancerous affix that makes keys unfun to play at a high level, turning boss fights into 3-4 min slogs. That said, as of 9.1 Blizz has been giving very easy affix combinations with Tyr as a way to encourage people to run it.

![Image](https://wow.zamimg.com/images/wow/icons/large/ability_toughness.jpg)

**Fortified** - *Non-boss enemies have 20% more health and inflict up to 30% increased damage.*

Fort is your push week, as bosses die insanely fast and trash being more dangerous is something you can more easily play around. Look for ideal push weeks and get that io.

-----

### Weekly affixes

![Image](https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofshadowprotection.jpg)

**Spiteful** - *Fiends rise from the corpses of non-boss enemies and pursue random players.*

Spiteful isn’t quite as bad for Ferals as it is for other melees, as we can abuse Balance Affinity to stay away from the ghosts and they also trigger resets from Pred. That said, make sure you get yourself a good WA or Plater import that highlights when one is on you so you can deal with it. They take something like 8% of their health every second, so ~12s to die off without any damage.

You can knock them back with Typhoon and Root them with a PS proc to get it away from you.

![Image](https://wow.zamimg.com/images/wow/icons/large/spell_fire_felflamering_red.jpg)

**Explosive** - *While in combat, enemies periodically summon Explosive Orbs that will detonate if not destroyed.*

Explosive orbs are in a weird place where they have <200 hp, one auto from anyone in the group will kill them, so simply get a WA/nameplate that tracks them and do your part, it doesn’t act as a DPS loss as you can still spam away with AoE.

![Image](https://wow.zamimg.com/images/wow/icons/large/ability_warrior_focusedrage.jpg)

**Raging** - *Non-boss enemies enrage at 30% health remaining, dealing 100% increased damage until defeated.*

So obviously Druid is good for this, and Feral is no different, Soothe the most dangerous mob in the pack and keep soothing things, keep it on CD - your tanks will love you.

![Image](https://wow.zamimg.com/images/wow/icons/large/ability_warrior_battleshout.jpg)

**Bolstering** - *When any non-boss enemy dies, its death cry empowers nearby allies, increasing their maximum health and damage by 20%.*

Not a huge amount  you can do about this, if you want big plays you can Cyclone mobs that you don’t want to get bolstered just before mobs around them die, so they don’t get the bolstering stacks.

Other than that, just make sure mobs die evenly and focus high hp mobs with prio bites or FF.

![Image](https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofspirit.jpg)

**Inspiring** - *Some non-boss enemies have an inspiring presence that strengthens their allies.*

Typhoon/Bash is insanely good on this week as the inspiring mobs themselves can still be CC’ed interrupted, and as they only have a ~15yd range where their aura applies, you can control the mob out of the group to allow for normal mob control on the rest.

Also, Inspiring is potentially a FF week, to nuke down those targets.

![Image](https://wow.zamimg.com/images/wow/icons/large/spell_nature_earthquake.jpg)

**Quaking** - *Periodically, all players emit a shockwave, inflicting damage and interrupting nearby allies.*

Not much you can do here other than get a WA to track when Quaking is “off cd” and be ready to spread - DO NOT cast Convoke when Quaking is off CD, it is a sure-fire way to trigger Quaking and make yourself upset.

![Image](https://wow.zamimg.com/images/wow/icons/large/ability_ironmaidens_whirlofblood.jpg)

**Bursting** - *When slain, non-boss enemies explode, causing all players to suffer damage over 4 sec. This effect stacks.*

Bursting isn’t a big deal to Feral, as with Survival Instincts and Barkskin we can mitigate a huge number of stacks, but you should probably watch out for your party as well. This is another one where you want to get a WA to track when stacks are dropping off and how high they are and be ready to stop DPS (or as much as you can as a DoT spec).

![Image](https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_necroticplague.jpg)

**Necrotic** - *All enemies' melee attacks apply a stacking blight that inflicts damage over time and reduces healing received.*

Necrotic is all about helping your tank. You should always watch out for your tank and use Roar/Typhoon when they are in danger even if they don’t call for it. It’s good to have chats with your tank before hand if you are in comms to discuss how you want Necro to play out, when they want you to Typhoon etc. Worst case, you can also taunt mobs/bosses to allow for a reset.

![Image](https://wow.zamimg.com/images/wow/icons/large/spell_shaman_lavasurge.jpg)

**Volcanic** - *While in combat, enemies periodically cause gouts of flame to erupt beneath the feet of distant players.*

As a melee, volcanoes shouldn’t really be something you have to deal with, stay in melee range of mobs and watch your feet when there are mobs at range.

![Image](https://wow.zamimg.com/images/wow/icons/large/ability_backstab.jpg)

**Grievous** - *Injured players suffer increasing damage over time until healed.*

Regrowth allows the removal of a Grievous stack, so you can use your Predatory Swiftness procs to instantly heal off a stack from yoruself, or a party member. This is a huge gain to survivability and should be done during times when the healer is struggling or you have spare GCDs from pooling.

![Image](https://wow.zamimg.com/images/wow/icons/large/spell_shadow_bloodboil.jpg)

**Sanguine** - *When slain, non-boss enemies leave behind a lingering pool of ichor that heals their allies and damages players.*

Typhoon is king on Sanguine weeks, the pools stick around for ~20s so it isn't the end of the world if a mob dies in a bad spot, but you should be looking to Typhoon mobs on CD to push them into a better position.

![Image](https://wow.zamimg.com/images/wow/icons/large/spell_nature_earthquake.jpg)

**Storming** - *While in combat, enemies periodically summon damaging whirlwinds.*

Storming is a pain, but again something that Feral can deal with a bit better than other melee due to our high base speed and long claws from Balance Affinity, it's just one of those affixes you play through and deal with.

<div id="Tormented">

## [9.0 seasonal affix - Tormented](#Tormented)

</div>

I'm going to copy/paste a lot of this from Catha's well written Bear guide, feel free to check that out fully below, though I will be trying to correct some of his rambling grammar.

https://docs.google.com/spreadsheets/d/1lqot6so0xiohnUjR5Qcs2zFYl9c0x7Ce8z9Lhg1rKSY/edit?usp=sharing

Also, it is likely that the powers dropped by the Lieutenants will see buffs and nerfs throughout the tier, and it is also likely I won't update this regularly, so please check in with the Ferals in Dreamgrove for any questions or an up to date recommendations. 

At different points during the dungeon you can find one of four new Lieutenants. Killing one of these Lieutenant awards you with a choice of three anima powers. You can only choose ONE amongst those three. These powers are fixed per Lieutenants. Which means that you always get the same powers from the same Lieutenant as long as your role (read DPS/Tanks/Healers) remains the same. 

Each of these Lieutenants has True Sight, does not give count and does not reset hp when you fail to kill them. The Lieutenants also have no social aggro so you can safely pull them through packs of mobs, without any danger of aggroing something with them.

As of writing, the Lieutenants powers are locked in as follows and all the latest hotfix information can be found here:
https://www.wowhead.com/news/patch-9-1-hotfixes-for-the-tormented-mythic-affix-reworked-and-retuned-anima-323174

![Image](https://cdn.discordapp.com/attachments/879667478916120596/880396248950112306/unknown.png)

<div id="Soggodon">
  
### [Soggodon the Breaker](#Soggodon)
  
</div>

![Image](https://cdn.discordapp.com/attachments/879667478916120596/880395459364024340/unknown.png)

#### What the Lieutenant does
Inflicts an aura increasing the physical damage you take by 50%. 

Will do heavy physical damage the entire time to the tank either via Crush, an ability with a short cast time dealing big damage, or via Seismic Wave, an AoE ability inflicting physical damage to everyone within 60 yards. Do note that you CANNOT kite Soggodon, and if you try, he'll just grip you back in and cast Crush on you. 

Roughly every 30 seconds he'll grip everyone in melee and start casting Massive Smash for 8 seconds. Everyone will be rooted, and must get out before the end of the cast or they will die. You have two choices here, either everyone in your group has an ability to get out of root (so you can Shift Forms, Shaman can Ghost Wolf, DH can Vengeful Retreat, Pally can Freedom, etc) so they get out on their own, or they cannot in which case you MUST kill the add that roots them in place, in order for them to get out.

As a note, I also want to apologise to my guildy Pasta who I left for dead every single time this was cast on Beta, it sucks to be a Priest this tier.
	
#### What power to take

- {{< spell 357524 "The Stone Ward" >}}
- {{< spell 356828 "Dripping Fang" >}}
- {{< spell 356827 "Tiny Dancing Shoes" >}}

Stone Ward is the go-to choice, increasing your HP is a no-brainer, Leech is good, but healing yourself when you've taken damage is worse than not taking the damage in the first place, and Dancing Shoes is a weird one that is only relevant for handling Spites (I do recommend it on Spite week).

![Image](https://cdn.discordapp.com/attachments/337894455589994517/858678316966084648/unknown.png)

<div id="Arkolath">
  
### [Incinerator Arkolath](#Arkolath)
  
</div>

![Image](https://cdn.discordapp.com/attachments/879667478916120596/880395234343796796/unknown.png)

#### What the Lieutenant does
His aura inflicts fire damage to everyone in combat with him. He also casts a debuff named Melt Soul on a random player that increases fire damage taken by 100%. So he basically is Pride 2.0. His other abilities are Scorching Blast, where he casts a circle of fire at the position of a player, there can only be 3 of those active at any given time, so don't worry too much about running out of space. And Inferno, a cast that you can (and should) interrupt that does fire damage to everyone in the party.	

#### What power to take

- {{< spell 357575 "Champion's Brand" >}} 
- {{< spell 357848 "Signet of Bolstering" >}} 
- {{< spell 357864 "Raging Battle-Axe" >}} 

This is another interesting Lieutenant for me, Champion's Brand is the "safe" choice, but Bolstering can be good in keys that have a lot of adds that will die at varying times (like DoS arden wing or SD gauntlet), and raging Battle-Axe has good uses in places with mobs that have a lot of HP for you to execute on, like in ToP military wing. I've seen this average out to ~4.5% damage on a Tyr boss for example.

I like this one as it's the only real selection that makes you stop and think about how you can use it in the key, more of them should've been like this.

![Image](https://cdn.discordapp.com/attachments/337894455589994517/858678365137272842/unknown.png)

<div id="Oros">
  
### [Oros Coldheart](#Oros)
  
</div>

![Image](https://cdn.discordapp.com/attachments/879667478916120596/880395324412289094/unknown.png)

#### What the Lieutenant does
His aura slows you down by 50%. Due to this and his power selection it's a very likely candidate to be skipped in any dungeon where the final boss does not require heavy movement. He'll cast a debuff named Biting Cold on a player, do not stand near them as that does damage in an AoE around them. Periodically casts Forst Lance in front of him, dodge it or take massive damage and get knocked away. He'll cast Cold Snap, an ability that spawns ice orbs around him, just move away from them to avoid taking damage	

#### What power to take

- {{< spell 357834 "Handbook of Uncivil Etiquette" >}}
- {{< spell 357814 "Regenerative Fungus" >}}
- {{< spell 357825 "Vial of Desperation" >}}

All of these picks have value.

- Handbook of Uncivil Etiquette has value if the key has decent interrupts  for you to take advantage of, think keys like Mists last boss, or HoA/SD where the trash has a ton of casts. Remember that this effect isn't 10% damage globally, it's just 10% damage on the target you interrupted. 
- Regenerative Fungus is a good default pick, as the HPS from it is reasonable substantial
- Vial of Desperation is good for keys where you want an extra passive "oh shit" effect, though with the insane defensive kit Feral has, I've never really made much use of it


![Image](https://cdn.discordapp.com/attachments/337894455589994517/858678406257836042/unknown.png)

<div id="Varruth">
  
### [Executioner Varruth](#Varruth)
  
</div>

![Image](https://cdn.discordapp.com/attachments/879667478916120596/880395389092638760/unknown.png)

#### What the Lieutenant does
His Aura is a -50% to healing done.

Pulling it with other mobs is not recommended because of the aura, though if your group feels up to it, you can drag a few mobs in. Periodically he'll cast Wave of Terror, which to avoid you must be near another player, otherwise you'll be feared for 5 seconds. 

He'll also inflicts a heavy bleed on the tank via Sever

Finally he'll also periodically charge a random player and inflict a bleed on them and anyone standing near them via Carnage. As such avoid standing near other players unless Varruth is casting Wave of Terror, then it's just a bad situation and be prepared for it with Barkskin or Survival instincts.

#### What power to take

- {{< spell 357706 "Volcanic Plumage" >}}
- {{< spell 357575 "Champion's Brand" >}}
- {{< spell 357609 "Dagger of Necrotic Wounding" >}}

All three picks have value here as well ...

- Volcanic Plumage is a very strong choice, the AoE knockup it does when it procs is very good for just shutting down packs from casting, especially if everyone in the group has it.
- Champion's Brand is a flat 210 stats, which equates to about ~4% single target gain and larger AoE gain - stats are good
- Dagger of Necrotic Wounding is very strong ST pick, it gives roughly 7-9% ST DPS gain which can be very good on high Tyr keys where you need the extra boss damage

![Image](https://cdn.discordapp.com/attachments/337894455589994517/858678274727870504/unknown.png)

-----

<div id="Prideful">

## [9.0 seasonal affix - Prideful](#Prideful)

</div>
  
![Image](https://wow.zamimg.com/images/wow/icons/large/spell_animarevendreth_buff.jpg)
  
*Players overflow with pride as they defeat non-boss enemies, eventually forming a Manifestation of Pride. Defeating this Manifestation greatly empowers players.*

With 9.0 over, this is no longer an affix that appears in the game, but leaving this here for historic reasons.

Prideful is this season's permanent affix on all 10+ keys. It boosts your damage by 30% for 1 minute when killed, and while alive does a pulsing AoE that ticks up in damage the longer the mob lives for.

You’ve got two choices when it comes to prides …

- use CDs *on* the Pride to speed up the kill and ease the healers throughput
- use CDs *after* the pride to get the most out of the 100% damage boost

This basically comes down to…

- does your healer have the CDs/mana to manage the pride
- do you have a boss or pack you want to nuke that you need the pride to handle
- will killing the pride take more time without CDs than you would save by using them during the buff window

In my M+ groups, we let the healer make the call, in pugs I'd probably make the call based on if the pride is at too many stacks at 50% hp left or if I want to pad ...

It's also worth adding, that you can outright skip the Pride if you move far enough away from it when it's spawning and use an invis pot, which might be needed for the bleeding edge keys. This is mostly an MDI strat though so it's not too useful in a normal setting.

![Image](https://wow.zamimg.com/images/wow/icons/large/achievement_boss_archaedas.jpg)

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

---
    
**To be Continued in Part 3...**

- Talent changes per key and why
- Soulbind/Conduit changes per key and why
- Feral QnA

(Submit your M+ questions for Part 3's FAQ:
https://forms.gle/Wpumpp2DMFdyvAwA7

---
