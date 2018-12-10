---
title: Guardian Tier 21 Analysis
date: '2017-10-20'
authors: ['Faide']
published: true
hasMath: true
showModified: true
patch: "7.3.5"
---

Let’s talk about the Guardian Tier 21 set bonuses.

First, what are they?

{{< spell 251791 "2pc" >}}: When Gore is consumed, the cooldown of Barkskin is reduced by 1 second.

{{< spell 251792 "4pc" >}}: When Barkskin fades, all healing done to you is increased by 10% for 20 seconds.

I want to talk about what each bonus does, how they may impact gameplay and talent choices, and then I’ll give my overall impressions of them.


**The TL;DR of this document is that Tier 21 is terrible in the best case, and detrimental to survivability in the worst case.** I write this with the goal of providing feedback on the current bonuses, with the hopes that they will be changed for the better.

## 2pc

The definition of “consuming Gore” is as follows: you have a {{< spell 93622 "Gore" >}} proc, you cast Mangle, and Gore is consumed.  This means it’s not enough to have Gore activate, you have to spend the proc to get the benefit. As it turns out this is not terribly important, since Gore has the same chance to proc regardless of target count (unlike {{< spell 203964 "Galactic Guardian" >}}, Gore’s chance is defined per cast, not per target hit), but it does slightly reduce the effectiveness since you have a small chance to overwrite existing procs when prioritizing Thrash over Mangle.

The most obvious benefit of this set bonus is that it gives you more flexibility with your {{< spell 22812 "Barkskin" >}} usage, which may save you an external or trinket on certain encounters. If you synchronize Barkskin with {{< spell 200851 "Rage of the Sleeper" >}}, which is common if you’re talented into {{< spell 203953 "Brambles" >}} and focusing on DPS, this bonus gives you no benefit.

To discuss the value of the set bonus, let’s express it in terms of damage reduction gains.  I’ll make the following assumptions:

1. The damage intake is regular and there are no mechanics you need to save Barkskin for.  In other words, the maximum potential DR gain will come from using Barkskin on CD. Note that this is absolutely not a recommended playstyle; you will always want to use Barkskin to mitigate damage spikes.  This assumption is purely for the sake of simplifying the math.
2. You are running Galactic Guardian, have 20% haste, and follow the recommended DPS rotation (Thrash > Mangle > GG-empowered Moonfire > Swipe) with no dead GCD time (time in which you are able to cast one of the above, but don’t).
3. You have 4/4 {{< spell 200402 "Perpetual Spring" >}} traits and 4/4 {{< spell 200399 "Ursoc's Endurance" >}} traits, and you are not using any tier set bonuses other than the T21 2pc.
4. 25% of your GCDs are Mangles (a generous average obtained from simulations run on the rotation), and you use 90% of the Gore procs you gain, accounting for overwritten procs.

First let’s calculate how many Gore procs we can consume per minute.

With 20% haste, the GCD is {{< tex "1.5 / (1 + 0.2) = 1.25\text{s}" >}}, which gives us 48 GCDs per minute. If 25% of GCDs are mangles, we have 36 chances per minute to proc Gore.  With a Gore chance of 20%, we have {{< tex "36 * 0.2 = 7.2" >}} procs per minute, and consuming 90% of those gives us {{< tex "7.2 * 0.9 = 6.48" >}} Gores consumed per minute.

Now we can compute the effective cooldown of Barkskin with the set bonus.  We can express this relation in the following way:

{{< tex display="procsPerBarkskin = \frac{reducedCooldown}{secondsPerProc} = \frac{cooldown}{reductionPerProc}" >}}

Most of the terms are self-explanatory, except for “reductionPerProc” which is the amount of time removed from the remaining cooldown after consuming one Gore proc, including the time elapsed since the last proc.

Consuming 6.48 Gores per minute is an average time between procs of 9.26 seconds.  Since each proc reduces the cooldown by 1 second, we can say that the effective time for consuming 1 proc is 10.26 seconds.

Given that the original cooldown of Barkskin is 79.2 seconds, we have a reduced cooldown of {{< tex "(79.2 * 10.26) / 9.26 = 71.48" >}} seconds. This is a reduction of 9.75%.

Now that we have a reduced cooldown, we can compute the average damage reduction gained.

With the original cooldown of 79.2 seconds, using Barkskin on cooldown will give you an uptime of 17.7%, for an average DR of 3.54%.  With T21, the Barkskin cooldown becomes 71.48 seconds for an uptime of 19.6% and an average DR of 3.91%.

We can now say that the value of the T21 set bonus is a potential DR gain of {{< tex "1 - ((1 - 0.0354) / (1 - 0.0391)) = 0.4\%" >}}.  This value will increase marginally with haste, but not in any significant way.

Additionally, if you run {{< spell 203965 "Survival of the Fittest" >}}, the cooldown on Barkskin can be reduced to 47.9s, for an average DR of 5.84%.  Thus, the value of the set bonus with SotF is a DR gain of 0.6%.

There is also a very small DPS benefit to the set bonus if you use Barkskin on cooldown (Baseline is syncing Barkskin with RotS).

## 4pc

This bonus works similarly to the increased healing portion of our mastery, with the added bonus that it also works on {{< spell 22842 "Frenzied Regeneration" >}} and {{< item 137025 "Skysec's Hold" >}} healing.  It increases the healing done by our {{< spell 155783 "Mastery" >}}, but it does not double dip by directly increasing the heals generated by Mastery. That is to say, if you have 20% Mastery and you receive a heal of 100, the set bonus will increase the direct heal you receive to 110, and then Mastery will produce another heal for {{< tex "110 * 0.2 = 22" >}}, but the Mastery heal will not be further increased by the set bonus.

Unlike the 2pc, the 4pc always has value regardless of your talents or rotation.  You will gain more value out of the set bonus the more frequently you use Barkskin, due to the increased uptime on the buff.

We can equate this increased healing to damage reduction if we express them both in the form of healing required. In order to demonstrate this, imagine the following scenario:

You have 100 HP, and you take a melee swing that deals 50 damage pre-mitigation.  You also have the 4pc set bonus, increasing your healing taken by 10%.  Your health deficit after you are hit (the amount of healing before the set bonus buff required to return you to full HP) is {{< tex "50 / (1 + 0.1) = 45.45" >}}.

Now how much DR would be needed to reach the same health deficit without the set bonus? Since you don’t have any increased healing (ignoring Mastery for the moment), the damage you take from the swing post-mitigation has to be equal to the healing deficit.  Therefore, the increased healing taken from the 4pc is equivalent to {{< tex "1 - (45.45 / 50) = 9.10\%" >}} DR.

Continuing from the math we did for the 2pc set bonus, using Barkskin on cooldown with a duration of 71.48 seconds the uptime on the set bonus will be {{< tex "20 / 71.48 = 28.0\%" >}} for an average increased healing of 2.80%.  This equates to an average DR of 2.72%.

If you use Barkskin every 90s, the uptime on the healing bonus will be 22.2%, qeuivalent to an average DR of 2.17%.

It’s worth noting that increased healing taken is not interchangeable with damage reduction. Increased healing taken cannot save you if you take damage equal to or greater than your HP in a single swing, whereas damage reduction can.  In general, straight up damage reduction is always preferred.


## Legendaries

Currently the only legendary that has a direct interaction with T21 is {{< item 144432 "Oakheart's Puny Quods" >}}.  Without the 2pc set bonus, OPQ will generate 56.8 Rage per minute when using Barkskin on cooldown. With the set bonus, that becomes 62.9 Rage per minute, for a gain of 6.1 Rage per minute, or 0.1 Rage per second. Not terribly significant.

{{< item 137025 "Skysec's Hold" >}} has an indirect interaction in that its heal is increased by the 4pc set bonus.

## Talents

The talents that gain value from the set bonuses are {{< spell 203953 "Brambles" >}} (increased Barkskin frequency -> increased Brambles DPS), and {{< spell 203965 "Survival of the Fittest" >}} (reduced Barkskin cooldown -> increased uptime on 4pc).

With the 4pc, Survival of the Fittest may overtake {{< spell 155578 "Guardian of Elune" >}} for survivability on fights with significant magic damage, but GoE (and occasionally {{< spell 203974 "Earthwarden" >}}) will still win out on physical damage fights. Offensively Survival of the Fittest has a minor advantage over the alternatives, however that was already true without T21.  Defensive gains will heavily outweigh offensive ones on this row, without question.

## Impressions

Overall I think these set bonuses are highly underwhelming, especially as a final tier set for Legion.  Not only do they actively encourage a harmful playstyle, they have next to no synergy with existing playstyles/legendaries/talents and don’t introduce any additional depth into what is already a simple class mechanically.

The main benefit of the 2pc is, as mentioned above, affording you more flexibility with your Barkskin usage.  But Survival of the Fittest already does this job far better and also works on Survival Instincts to boot.

With respect to the 4pc, having the healing bonus granted after Barkskin ends (i.e. after the harmful part of most tank mechanics) makes the “optimal” way to play around the set bonus counterproductive.  The most common use of Barkskin is as a defensive cooldown for big, infrequent damage spikes on bosses, and as such the duration of the buff is far less important than how much damage it actually mitigates.

In essence, the bonus extends the Barkskin “buff” well beyond its original duration, which incentivizes using it more like active mitigation than like a defensive cooldown (that is, casting it with high frequency and maintaining as high an uptime as possible). But this negates the entire purpose of the defensive cooldown portion in the first place!

If Barkskin is used on cooldown to maintain the set bonus and with little regard for the damage curve of an encounter, the 20% DR component of Barkskin itself will almost certainly be wasted on periods of low/consistent/predictable damage when it’s not needed. Not only this, it can potentially be dangerous to play this way if you discover later that you need Barkskin for an emergency and don’t have it. The vast majority of self-inflicted tank deaths are due to being unprepared for spike damage, so I can’t see any realistic situation in which a survivability-oriented player would forego a 20% DR on a large hit for a minor pseudo-mastery buff.

Numbers wise, the set bonuses seem well below the benchmarks set by T19 and T20.

The {{< spell 242236 "T20 2pc" >}} significantly improves your self-healing capability by increasing the number of FRs you have access to in an encounter, and gains value on harder content where you take more damage and spend more time at low HP. The T21 2pc grants you on average a 10% cooldown reduction on your Barkskin, which will either give you no value at all or a small increase in flexibility with your defensive timings that is worse than an existing talent.

The {{< spell 211150 "T19 4pc" >}} currently grants approximately 5% additional physical DR, in addition to creating opportunities to FR for 0 rage. (I say currently because the 4pc was actually far more valuable during Nighthold, due to {{< spell 192081 "Ironfur" >}} being a higher % armor per stack and it affecting {{< spell 192083 "Mark of Ursol" >}} as well.)  Meanwhile the T21 4pc, in the best possible circumstances (7/7 Perpetual Spring, 7/7 Ursoc's Endurance, Survival of the Fittest) is equivalent to 4.4% DR, and in more practical terms is closer to 2% DR.

In conclusion, I’m very disappointed with this set, and I can’t recommend that anyone aim to use them in their current state.  If these bonuses are what we end up with until the next expansion, I can’t say I’m looking forward to it. We’re still quite a few weeks out from Antorus release, so here’s hoping that we see some positive change between now and then.
