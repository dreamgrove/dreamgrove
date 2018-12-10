---
title: Battle for Azeroth Guardian Druid Preview
date: '2018-07-14'
authors: ['Faide']
description: "Everything you need to know about Guardian Druids in Battle for Azeroth. What's changed, how does it affect us, and how are we looking going into the new expansion?"
patch: "8.0"
---

Hi everyone!

With the Battle for Azeroth beta winding down and pre-patch dropping in a few days, it's time to talk about what's in store for Guardian Druids in 8.0. Keep in mind that while we don't expect any more major changes coming for the spec, tuning is still underway and as always, conclusions drawn in this piece are subject to change.

As a quick aside, I have been working hard on the Guardian pre-patch guide, including taking over the [Wowhead](https://ptr.wowhead.com/guides/guardian-druid-tank-bfa-battle-for-azeroth-pre-patch) and [Icy Veins](https://www.icy-veins.com/wow/guardian-druid-pve-tank-guide) guides (both are now live and you can find them at the links provided). Of course, there will be a version of the guide hosted on Dreamgrove.gg as well, if those sites aren't to your taste. The Dreamgrove version will go live soon&trade;.

## What's Changed

First, what we lost:

- {{< spell 200851 "Rage of the Sleeper" >}} has been removed, and with it, all of the traits associated with the artifact.
- All legendaries are disabled at level 116 and will no longer provide their bonuses at 120.
- {{< spell 204012 "Guttural Roars" >}} has been replaced with {{< spell 252216 "Tiger Dash" "beta" >}}.

What we gained:

- {{< spell 2637 "Hibernate" "beta" >}} returns after being removed in 7.0. A long-duration CC that works on Beasts and Dragonkin. Cannot be cast in Bear form.
- {{< spell 2908 "Soothe" "beta" >}} returns after being removed in 7.0. An offensive dispel that removes enrage effects, including the Raging affix in Mythic+. This is usable in all shapeshift forms.
- {{< spell 252216 "Tiger Dash" "beta" >}} as mentioned above. It replaces {{< spell 1850 "Dash" >}} and is effectively a faster, shorter sprint on a shorter cooldown. It, like Dash, is now on the GCD.

What's been changed for Guardian:

- The ability damage formula has changed such that all abilities scale with both weapon damage and attack power. This is to address the fact that in Legion, weapon ilevel meant almost nothing outside of the minor stat gain.
- Damage has been redistributed away from {{< spell 77758 "Thrash" "beta" >}} and into other abilities and auto-attacks.
- {{< spell 192081 "Ironfur" "beta" >}} now scales with agility rather than armor, and things like agility procs from trinkets count towards the added armor (unlike bonus armor did in Legion). Additionally, Ironfur lasts for 7 seconds now instead of 6.
- {{< spell 22842 "Frenzied Regeneration" "beta" >}} no longer scales with damage taken. Instead, it heals for 24% of your max HP over 3 seconds (4 ticks at 6%HP per tick, at a rate of 1 tick per second with 1 occurring immediately). Additionally it is now on the GCD.
- {{< spell 5487 "Bear Form" "beta" >}} armor bonus has increased to 220% (from 200%) and stamina bonus has decreased to 45% (from 55%).
- {{< spell 197488 "Balance Affinity" "beta" >}}'s range has been reduced to 3 yards (from 5).
- {{< spell 203964 "Galactic Guardian" "beta" >}}'s proc chance has been reduced to 5% (from 7%).
- {{< spell 155835 "Bristling Fur" "beta" >}}, {{< spell 1850 "Dash" "beta" >}}, {{< spell 22842 "Frenzied Regeneration" "beta" >}}, {{< spell 204066 "Lunar Beam" "beta" >}}, {{< spell 102401 "Wild Charge" "beta" >}}, and {{< spell 102558 "Incarnation: Guardian of Ursoc" "beta" >}} are all now subject to the GCD. Wild Charge in particular is on a 0.5s GCD.
- Rage generation has been rebalanced. Specifically:
  - New: being hit by a melee attack generates 3 rage (can only occur once per second).
  - Melee attacks generate 4 rage per hit (down from 6).
  - {{< spell 33917 "Mangle" "beta" >}} generates 8 rage (up from 5).
  - {{< spell 77758 "Thrash" "beta" >}} generates 5 rage (up from 4).

And finally, some other non-Guardian (but still relevant) changes:

- Bleeds now scale with haste! This affects Guardian in that it not only makes {{< spell 77758 "Thrash" "beta" >}} stronger, but it also improves {{< spell 203962 "Blood Frenzy" "beta" >}} and {{< spell 203964 "Galactic Guardian" "beta" >}}. Additionally, it improves the bleeds {{< spell 1822 "Rake" "beta" >}} and {{< spell 1079 "Rip" >}} that you get from talenting into {{< spell 202155 "Feral Affinity" "beta" >}}.
- The tank threat modifier has been reduced to 4.5x, meaning the threat you generate is your damage multiplied by 4.5. In Legion, the base threat modifier was 10x, but with the additional bonus threat added by the Artifact "damage per point" system (and some special abilities like {{< spell 77758 "Thrash" "beta" >}} bleed that had additional threat modifiers on top of that), it was more like 12-14x.

## How this Affects Guardian

As you might have guessed, Guardian has received very few core gameplay changes. What *has* changed are underlying systems that don't have a real moment-to-moment impact on your rotation or decision-making (except for maybe the {{< spell 22842 "Frenzied Regeneration" "beta" >}} change). At it's core, Guardian plays more or less identically to its Legion version, if you take away Legendaries and the Artifact.

On the surface, it may seem like we only lost the good parts of Guardian ({{< spell 200851 "Rage of the Sleeper" >}}, the {{< item 144295 "Lady and the Child" "beta" >}} + {{< item 151802 "Fury of Nature" "beta" >}} combo, artifact traits like {{< spell 238121 "Pawsitive Outlook" >}} and {{< spell 200409 "Jagged Claws" >}}, {{< spell 22842 "Frenzied Regeneration" "beta" >}} healing, and so on) and what's left is a shell of its former self. To some extent that's true, we did lose a lot of really fun and awesome builds that made Guardian a lot of fun to play, and this is an area of concern for me. While the pared down BfA version of Guardian is functional and will be completely adequate for most purposes, the barebones rotation and lack of interesting gameplay interactions leaves a lot to be desired.

In dungeon content specifically we are looking particularly underdesigned. The rotation on any significant number of targets consists of only {{< spell 77758 "Thrash" "beta" >}} and {{< spell 213771 "Swipe" "beta" >}}, and without {{< item 144295 "Lady and the Child" "beta" >}} to provide the massive quality of life boost from Moonfire maintenance (not to mention the Rage generation increase due to the LatC bug), I worry that the fun factor was lost in the transition.

There is a silver lining to be found in raids though! The removal of legendaries (and some spell tuning) has opened up some talent rows to allow more freedom of choice. Specifically on the L100 row, you're no longer locked into {{< spell 204053 "Rend and Tear" "beta" >}} in all situations. {{< spell 80313 "Pulverize" "beta" >}} is looking very strong for single target tanking, which will go a long way towards putting some variety back into the rotation. Additionally, catweaving is making a triumphant return at the start of BfA thanks to bleeds being hasted. Pulverize and catweaving put Guardian in a very interesting spot for single target raid tanking, and I'm excited to see where this takes us.

## How is Guardian looking in BfA?

Which leads us to the all-important question. How will we fare against the other tank choices? Well, there's good news and bad news. 

The good news is that for raiding, Guardian is once again looking very healthy. {{< spell 192081 "Ironfur" "beta" >}} continues to be an incredibly strong active mitigation, and combined with the increased Rage generation from the base kit and what continues to be one of the most quietly overpowered talents in the game {{< spell 155835 "Bristling Fur" "beta" >}}, you'll be able to maintain AM uptime well above an average of 1 stack. Add on top of that the flat DRs of {{< spell 16931 "Thick Hide" "beta" >}} and {{< spell 80313 "Pulverize" "beta" >}} and the strength of our cooldowns {{< spell 22812 "Barkskin" "beta" >}} and {{< spell 61336 "Survival Instincts" "beta" >}} and Guardian is no slouch as a raid tank. {{< spell 106898 "Stampeding Roar" "beta" >}} is still an incredibly strong utility spell even after the removal of {{< spell 204012 "Guttural Roars" >}}, and is almost guaranteed to be invaluable on at least one encounter. What remains to be seen is how tuning will affect the relative strength of each tank's AM and cooldowns, but things are looking good so far for Guardian on this front and I would not be surprised to see us being brought in for progression encounters, particularly against heavy physical damage encounters.

The bad news is that once again, we drew the short straw for dungeon utility. Mythic+ tank balance has historically been completely awful, and while BfA has made some strides in the right direction here (removal of group Leech for DKs, nerfs to most aoe crowd controls and stuns), there continues to be a huge disparity between the "good M+ tanks", and the rest of us. Not only is our crowd control ability seriously underwhelming compared to demon hunter Sigils or death knight grip/slow, but our self-healing (which was already considered poor by mythic+ standards) has been reduced even further. This poses serious drawbacks in dungeons where your healer, instead of keeping everyone topped or putting out more damage, instead needs to focus on healing you, since you can't heal yourself or kite effectively.

Finally, a word about our damage. Guardian has always struggled with damage output, and we've found creative ways in the past (see: catweaving) of bringing our numbers up to be in line with what most tanks can put out baseline. BfA is looking like more of the same in that regard; from my preliminary numbers, we're seriously behind in damage output, especially in single target. We'll have to wait and see how this shakes out in heroic week to see if it will be a problem, but it's definitely something to keep an eye on.

## Conclusion

Battle for Azeroth leaves a lot to be desired for Guardian. Our feedback thread on the BfA class forums is one of the longest without a blue post, and there are legitimate concerns about the competitiveness of the spec, especially in dungeons. I do feel like the extreme negative doomsaying I've seen from the community is a little overblown, as there are still some redeeming features to look forward to. But from my perspective, there's more bad than good. I seriously hope Blizzard is planning to take a long, hard, look at the spec in 8.1, because these problems really cannot go unaddressed for the entire expansion.

With that said, I would still recommend Guardian to:

1. people who are new to tanking and looking for an easy to pick up and play spec to learn the ins and outs of the role without being too burdened with the rotation,
2. progression raiders who need a sturdy, reliable tank for hard-hitting mythic bosses, or
3. veteran tanks on farm who are looking to challenge themselves with a fun and dynamic rotation like catweaving.

That's all for now, thanks for reading!
