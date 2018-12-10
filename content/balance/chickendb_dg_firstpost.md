---
date: '2018-07-23'
authors: ["Slippykins", "Iskalla"]
published: true
hasMath: true
title: BFA Boomkin Theorycrafting -- introduction to chickendb.com
patch: "8.0"
---

# Preamble #

## Introduction to chickendb.com ##
Hey all!

It has been a while since I’ve been able to write up an in-depth piece of theorycrafting, and I couldn’t be more excited to share this innovative update with you all.

Iskalla and I have teamed up to create a new way to display, disseminate and document theorycrafting for Boomkin with BFA, and have put in a tremendous amount of effort to bring this in time for the expansion. Essentially, we were unhappy with the traditional methods of theorycrafting, which typically followed the pattern of:
- sim all builds,
- compare top choices,
- make justifications based on the ordering.

This style of theorycrafting, while correct in most instances, lacked further data analysis and explorative insights. In general this approach works, and the inconsistencies with top builds in WarcraftLogs can be hand-waved as “simulation error” or “sims are junk.” We strongly refute this point, and argue that sims are only as good as the model and assumptions behind it. As such, a large part of this project has been to target these deficiencies, and relax some of the constricting assumptions we have historically clung to.

Chickendb ([chickendb.com](http://www.chickendb.com)) is the first major step into data analytics and data aggregation, combined with a shiny front-end with Power BI visuals and interactivity. We’re putting a whole new spin on theorycrafting, and letting the user become the one in charge of what they see. You can explore the results of over 50 separate sims with 95+ profiles per sim, and go straight to the information you need. We’ve cleaned, cut-up and reported the actual insightful items hiding in each sim report, giving you the ability to really see what makes up your DPS and how impactful your decisions really are.

We hope you all enjoy this first introduction to chickendb. We are looking for feedback on the analytics, look-and-feel and general usability of the site, so please contact us if you have any suggestions, comments or queries.

Cheers!


## About the authors ##
Chickendb is run by two long-time Boomkin players -- Slippykins and Iskalla.

Slippykins has played Boomkin since BC, and has been theorycrafting since the end of Wrath. This was back when we used WrathCalcs to do our analysis, written and maintained by Hamlet on the EJ forums. Times have changed a lot since then, notwithstanding the spec itself. Slip has played casual, hardcore and semi-hardcore for most of his raiding experience, with his top achievements during his time with Arathian Knights on US-Cenarius. Since then, he has lived in two countries and finished a Bachelor's degree in Economics and Finance along the way. Slip has a passion for data analytics and econometrics, with proficiency in R, Matlab, Power BI and SQL. Slip currently moderates the Druid forum on MMO-Champion and Dreamgrove, the Druid discord.

Iskalla has also played Moonkin (she doesn’t like the term Boomkin) since BC, and has raided almost every tier onwards. She started being engaged with the Druid community on Dreamgrove in early 2017, and has contributed to wowanalyzer and Emerald Dreamcatcher theorycrafting. Iskalla is a coder at heart, and loves nothing more than to settle in with a nice Excel spreadsheet at night. She recently moved to Australia, Land of the Spooders, and had to make a new US battle.net account.

Slippykins and Iskalla met on the Druid discord, and now live together in Melbourne (best city in Australia). You can contact them via Discord: Slippykins#0001 and Iskalla#0001.


## What is chickendb? ##
Chickendb is our solution to assuaging the hold feelcrafting has on contemporary spec analysis. With our roots deep in data analysis and telling stories with visuals, we have found the levels of hand-waving and weak opinions to be too high. Additionally, the gap between simulations and WarcraftLogs rankings has tended to make sims look inconsistent, inaccurate and inapplicable. The argument usually devoles to ‘ideal world vs. real world,’ implying that sims are too basic to give meaningful results.

However, we argue that sims are powerful, and can provide much more than what has been shown. Sims are our most powerful theorycrafting tool, and to simply dismiss them is not only wasteful but criminal. If the sims are wrong, it’s because it hasn’t been written properly, or we have made the wrong assumptions. You put in crap, you get crap. It’s that simple.

Chickendb is a way to report and analyse raw sim data, delivering clean, intuitive and interactive visuals for everyone to consume. We provide the data so guide writers can be confident in their analysis and know the data they’re using is the best available. Chickendb aims to be a one-stop-shop for all analytics pertaining to Boomkins, providing the basis for all guides and information needed.


## Phases and goals ##
Chickendb is currently in beta -- we have only just created the skeleton, and will be quickly adding new features and tools to the site as we wrap up phase 1. By the end of phase 1, we plan to have the following available at a minimum:

- Sim breakdowns by talent, azerite and trinket
- Analysis by fight length, fight type and target scaling
- Easy, intuitive navigation
- Clean and simple UI

We’re currently 85% of the way through phase 1, and will be pushing to have it complete before BFA launches.

Phase 2 is still in development, but we will be focusing on chickendb as a data aggregator, and expanding on our Boomkin analysis.

Phase 3 of the project will be the transition from Boomkin analytics to general Sim analytics. We plan to integrate all other DPS specs into our analysis, using the same metrics as we’ve proven with Boomkin, in order to provide inter-spec comparisons and data aggregation.

We’re excited to share all of this with you, and hope that you will be able to grow and learn with us along the way!


# How to use Chickendb #

## General information ##
Chickendb is designed to be updated with every change to the spec, so that you can see exactly what those change notes really mean. In the future we hope to have an automatic refresh cycle, but for the moment we will be only updating when changes come for Boomkins. Expect frequent updates while we push out the phase 1 modules!


## Site navigation ##
When you first visit chickendb, you will be greeted with the landing page.

All of our theorycrafting and data analytics will be available through the “Analytics” menu item.

![analyticstab](https://puu.sh/B0YRL/95c2ad660a.png)

Once you’ve selected the report you wish to view, you can navigate around the report pages by clicking on the tabs along the bottom of the report.

![tabs](https://puu.sh/AZS1b/b2e1b97e0d.png)

We also have a handy Simcraft code generator, available through the “Simc tools” menu item! In this tool, you can generate talent, azerite and raid_event scripts to add to your own sims.

![simctoolstab](https://puu.sh/AZS1M/41fed30c0a.png)

Now that we’ve covered navigating the site, we’ll delve into manipulating the report through the embedded and interactive tools of Power BI.


## Power BI basics ##

Chickendb uses Power BI to provide the interactive visuals for the site. Since Power BI is a very powerful tool, it can be a little daunting when first using it. As such, here are some handy tips and tricks to help you get started!


### Filters ###
Filters are the lifeblood of Power BI, and are important for using our reports. The main report filters are typically on the left-hand side and will have a few different metrics to choose from.

Simply select the filters to generate the report you’re interested in. For example, selecting “cleave” in Sim Type and “4” in Targets will show the 4 target cleave sim. This will filter the two graphs on the right-hand side to show you only the results relevant to your selection.

Filters are prevalent on each page of the report, and allow you to see the results of multiple simulation sets at the click of a button!


### Highlighting ###
Power BI also allows you to select items within a visual, and show you related information in the other visuals on the same page! The default behaviour is highlighting. To see this in action, watch what happens when we select “Shooting Stars” in the Talent DPS graph.

![highlighting](https://cdn.discordapp.com/attachments/303500704394379266/470543884947030047/highlights.png)

As you can see, the DPS Breakdown chart now highlights the Shooting Stars portion of each build where it appears. This allows you to easily see the impact of each talent -- as you can see above, Shooting Stars is in all the top builds, indicating that it’s most likely overpowered in this scenario.



### Focus mode ###
In the case where you want to see a particular visual in more detail, or you would like to take a screenshot of something for your guide, focus mode is your friend. Hovering over the top-right corner of any visual will allow you to expand it to the full size of the report. This is especially handy when you want to take a high-resolution image of the visual for publishing later (just make sure to credit us as your source!).

![filtering](https://puu.sh/AZS42/4b59276a1b.png)


# BFA changes #
As with every expansion, Boomkin has been changed again, but not too much this time. Lunar and Solar empowerments have been changed and now give meaning to both spells in ST and AoE, while also giving the spec a base amount of RNG above crit.

Besides that, there are three main areas of change: the removal of Legion systems, the addition of Azerite and the reconfigured talent tree. We’ll go through them one-by-one before we step into our sim analysis.

## Removal of Legion systems ##
With the end of Legion imminent, all the unique Legion-esque systems are being retired and rejigged for BFA. Gone is the Scythe of Elune, meaning we will actually have to answer that “1h + offhand vs. 2h” question again, as well as the loss of all those cool traits we’ve grown to love.

Long live the blue doggo and his courageous howl as he runs into our main target.

Importantly, we’re losing traits like Scythe of the Stars (Starsurge crit) and Moon and Stars (Inc haste buff), but some traits are being baked into our spec, like Sunblind (Sunfire radius). New Moon has become a talent, but more on that in the talent section.


## Azerite ##
Azerite is essentially the artifact trait system of Legion, combined with the Tier system being removed with BFA as well. More to follow on the effect of Azerite once we have more data and sims to play with.


## Talents ##
Boomkin talents have been moved around, removed and new ones added with BFA, mainly in order to address the homogeneity of builds we saw in Legion. Some talents like Fury of Elune and Stellar Flare were completely ignored all expansion, and have been redesigned to (hopefully) ignite their use in BFA. For reference, here’s the current Boomkin talents as of 16th July.

![talentswowhead](https://puu.sh/B1z7m/53f8287e61.png)

Going tier-by-tier, we have:

### Tier 15 ###
- Starlord has been baked into the spec.
- Starlord’s spot has been replaced with a new version of Nature’s Balance.
- Nature’s Balance now passively generates AP, and allows you to start fights with 50 AP instead of 0.
- Warrior of Elune now makes your next three Lunar Strikes generate 40% more AP.
- FoN generates 20 AP on use, and scales with your secondary stats.

Overall, Tier 15 is about AP generation. Of note is that FoN does *not* scale with targets well (only through it’s meagre AP generation), while NB and WoE do. It will be interesting to see how WoE goes this expansion, as burst AP generation tied to an AoE spell can be extremely powerful in burst AoE cleave.


### Tier 75 ###
- Soul of the Forest now reduced Starfall’s AP cost by 10 (down from 20).
- Stellar Flare has been moved to Tier 90, and has been replaced with a new version of Starlord. Starlord (new version) is now a copy of the T20 4pc -- a stacking haste buff.
- Incarnation now grants 15% haste instead of increasing AP generation by 25%.

This tier has changed a little -- Incarnation is less bursty, Soul of the Forest has less synergy with Starfall + Stellar Drift, and Starlord is a good talent that is target agnostic. All three talents have the ability to function well in single-target and AoE scenarios, with clear synergies between SotF and SD, and Incarnation and FoE. Definitely a competitive tier, and it will be interesting to see where Starlord fits in the puzzle.


### Tier 90 ###
- Big changes for this tier. Astral Communion and Blessing of the Ancients have been removed.
- Shooting Stars has been moved to Tier 100, and has been replaced with Stellar Drift.
- Twin Moons, the effect from the legendary shoulders in Legion, has now joined this tier, along with Stellar Flare.
- Stellar Flare now generates 8 AP instead of costing AP, and does not benefit from Stellar Empowerment anymore.

This is a great tier too. We all know how powerful the legendary shoulders are in cleave scenarios, and now we have it directly competing with Stellar Drift as the go-to AoE talent for Tier 90. On top of this, Stellar Flare is here to fill in those DoT-cleave instances where the targets are too far apart for Stellar Drift. Importantly, Twin Moons is still strong in DoT-cleave as the 20% Moonfire damage is a significant increase. Overall, a strong tier focused on different AoE scenarios.


### Tier 100 ###
- The crowd favourite, Fury of Elune, has been changed and buffed. FoE now follows the target and generates 40 AP over its duration. It’s also slightly wider.
- Shooting Stars has replaced Stellar Drift, and does basically the same thing.
- New Moon has taken the place of Nature’s Balance, and functions identical to the artifact trait.

You can’t get more excited for FoE than right now. FoE is B I G D E E P S, much easier to use and actually generates AP instead of being a hassle to keep going with its old AP drain mechanic. This is the clear winner for AoE burst right here: think Wild Mushroom, but a fiery column instead. New Moon is a good choice for people who want to increase the demand of their rotation while being rewarded for it. Shooting Stars is again the talent that scales superbly with targets and will see a lot of use in BFA. Also note that with the most recent changes (Tues 17th July) that Shooting Stars has been buffed (and then we doubled it!), and is now dominating this tier.

Overall, the talent changes are some of the most exciting things coming with BFA, and I don’t think we could be more excited to create that awesome burst AoE spec centred on FoE and WoE.


# Sim analysis #
Finally, we get to our main contribution -- analysis of the first round of BFA sims. We will be walking through the visuals available on chickendb, and will provide screenshots to illustrate our points. However, we encourage you to go to the site and explore for yourself, to see how everything works together and maybe discover something interesting on your own!

First up, we will cover our main assumptions and inputs to our models.

## Parameters and assumptions ##
As with any model, we must make some assumptions in order to limit the problem space to something feasible. We routinely do this with all problems in life, and running simulations is no different.
The main parameters used for the sims on chickendb are as follows:

- Max_time: 300s
- Vary_combat_length: 10%
- Default_skill: 1
- Optimal_raid: True
- Fight_style: Patchwerk
- Level: 120
- Gear ilevel: 370

We then need to make assumptions to model the different fight styles. Single-target is clearly just a Patchwerk fight and therefore requires no additional assumptions, however we model three additional fight styles: cleave, DoT-cleave and add waves.

Cleave:

- An additional X targets are spawned on top of the main target for the duration of the fight, starting at time = 1.

We allow targets to change to see the effect of target scaling for each of the talents. This is a very simple fight style, and I doubt it requires more explanation than that.

DoT-cleave:

- An additional Y targets are spawned up to 40 yards from the main target. If the main target is centred at {{< tex "(x,y) = (0,0)">}}, then for additional targets {{< tex "t = {1,2,3,4}">}} we have:
	- {{< tex "T_1 (x,y) = (21,0)">}}
	- {{< tex "T_2 (x,y) = (-21,0)">}}
	- {{< tex "T_3 (x,y) = (40,0)">}}
	- {{< tex "T_4 (x,y) = (-40,0)">}}
- The default APL has been modified to ensure Starfall is not cast in a DoT-cleave scenario.

This setup allows us to model how our talents scale when our targets aren’t clumped. {{< tex "T_1">}} and {{< tex "T_2">}} are spawned at 21 yards from the main target as the radius for Starfall with Stellar Drift is 20 yards. All targets are within the casting range of the player, and avoid small AoE effects like Solar Empowerment and Lunar Strike cleave. One known issue with the current implementation of SimC is that Twin Moons still triggers the additional Moonfire, even though its range is only 15 yards.

Add waves:

- Each add wave consists of 5 adds.
- Add waves start at 10 seconds into the fight.
- Each add wave lasts 20 seconds on average, with a minimum of 10 seconds and maximum of 30 seconds.
- Each add wave has an average cooldown between add wave spawns of Z seconds, with a minimum of Z/2 seconds and a maximum of Z\*1.5 seconds.
- Add uptime is calculated as duration/cooldown.

Add waves are tricky to model, as there are a lot of parameters at play here. We want to avoid exponential scaling of the amount of sims we need to run, so we have decided to only model the effect of *add uptime* on DPS, and hold all else constant. This means that add wave duration of 20 seconds and the starting wave at 10 seconds in are constant across all of our sims. We believe this isn’t too restrictive of assumptions to make -- the time of the first add spawn is largely irrelevant to DPS, and we argue that add wave duration only matters if the duration is extremely low (0-5 seconds). With a wave lasting 20 seconds on average, we allow for Twin Moons to be relevant, for Starfall and ramp effects to properly ramp up, and for burst AoE to still be strong.

For add waves, it’s our strong opinion that add wave uptime is the only parameter that particularly matters in these scenarios. As such, we have provided analytics for add waves with uptimes of 10% increments, up to 100% uptime for completeness.

The important thing to note here is that with predictable timing of add waves, the optimal behaviour for the player is to hold cooldowns when it’s optimal for them to do so. As such, we have made further edits to the Boomkin APL to calculate the optimal decision of whether to hold cooldowns for the upcoming add wave. The value of delaying your cooldowns for an add wave is therefore:

{{< tex "valueToDelay = \frac{durationOfAddWave}{durationOfBuff} * (numberOfAdds - 1) - \frac{timeUntilAddsSpawn}{cooldownOfSpell}">}}

This additional line has been configured for Incarnation, CA and FoE. WoE has not been configured to delay, but will be done in the future.

Now that we have covered the main modelling parameters and assumptions, we will step into our first analysis of BFA using chickendb: Talents.


## Talents ##
In this section, we will be covering the results for single-target, target scaling, fight lengths and build synergies. We will conclude the section with the headline results -- the best builds for each scenario. We would like to start with the basics and explore our earlier predictions before stepping into our aggregated build analysis, as we believe this provides a better base for why each build functions the way it does. Additionally, we have the ability to split builds into their constituent talent DPS and aggregate synergies -- this allows us to really show what talents work well together, and when these synergies are particularly pertinent.

First off: single-target.


### Single-target analysis ###
You can always rely on single-target sims. The world you’re trying to model is pretty simple, the rotation is formulaic and requires little to no reactions or decision-making, and there’s no fire to avoid. At its core, a single-target sim is almost identical to a single-target fight, give or take a few DPS percent.

To start, let’s select the relevant single-target filters. I highly encourage you to play with the site while I guide you through this theorycrafting section -- I promise it’s much better than just looking at images.

As of 20th of July, this is what the main report page for Balance Druids appears like:

![mainpage](https://puu.sh/B0Zax/1a323f6df9.png)

What we can see here is that the Shooting Stars change this week has really pushed it to be the top talent by far, even for single-target. This is a passive talent giving us a little over 5% of our total DPS -- if we were to predict anything, it’s that this talent will likely be nerfed, or the others in its row (FoE and NM) buffed to compensate.

Besides ShS, we can see Starlord, StFL and FoN are all top-tier ST choices, which naturally results in the top build being FoN/SL/StFl/ShS. However, a number of builds are fairly close to the top build, including WoE, Inc and NM variants.

The biggest underperformers for ST are clearly NB, TM and SotF. NB is only features in 3 of the top 22 builds, with TM at 8 and SotF not appearing at all. This is to be expected for TM and SotF as they’re centred around AoE, but NB is surprisingly low. We could see some love in the NB direction maybe in 8.1.

**Single-target build suggestions:**
- FoN/SL/StFl/ShS
- WoE/SL/StFl/ShS
- FoN/Inc/StFl/ShS
- FoN/SL/StFl/NM
- FoN/SL/StFl/FoE

All of these combinations do relatively the same DPS for ST.


### Cleave analysis ###
Next, we step into the other favourite for sims -- cleave fights. The idea here is that we want to map the strength of each talent to a generic AoE scenario, and then extrapolate to boss fights with high amounts of cleave uptime.

Note that when we talk about cleave in this section, we’re *specifically* referring to clumped AoE, where all AoE effects hit all targets.

On the main chickendb report page for Balance Druid, we can see the cleave reports by selecting “cleave” in the Sim Type filter, and setting targets to whatever is relevant. For this section, we will focus on the 5 target simulation.

Here’s the 5 target cleave report as of 20th July:

![cleave](https://puu.sh/B0Zbb/33833cc970.png)

It’s no surprise that Shooting Stars is dominating at over 13% DPS in this scenario, given how strong it was just in ST. Since a 5 target cleave sim is sustained AoE, we’re not surprised that the ordering of talents follows ShS > TM > FoE > SD > Inc > SotF > others. It seems the T15 choice favours WoE over NB, but it’s clear FoN is not good for AoE, as expected.

We can also see that the synergy between talents is quite strong between ShS and SD, at nearly 5% DPS for the */*/SD/ShS builds. While the synergy between these two talents is quite strong, TM is still competitive purely because it’s better than SD in a vacuum.

**Cleave build suggestions:**
- (WoE or NB)/(SotF or SL)/(SD or TM)/ShS

All 6 builds do relatively the same DPS for 5 target cleave.


### DoT-cleave analysis ###
One of the new types of sims we’re presenting with this set of theorycrafting is DoT-cleave! Once one of the niche strengths of Boomkins, DoT-cleave is a place where Boomkins can be relatively competitive in raid.

Again, we have sims ranging from 2 to 5 DoT-cleave targets, and for this analysis we will focus on the 2 target DoT-cleave scenario.

Here’s the 2 target DoT-cleave report as of 20th July:

![dotcleave](https://puu.sh/B0ZbH/d519014b10.png)

It’s almost getting a little boring with all this talk about ShS, but here it is again: Shooting Stars continues to outshine all other talents. Importantly though, Stellar Flare has been bumped up a few places, as we would expect for a DoT-cleave fight. The only issue: StFl shares a row with TM, which is arguably another DoT-cleave talent with its Moonfire damage component.

As such, we see a lot of builds in the top section centred around */*/(StFl or TM)/ShS. At only two targets, FoN is still holding onto the top spot for T15, followed closely by WoE. SL and Inc are both competitive for this scenario, offering some generic benefits that scale fairly well with targets.

**DoT-cleave build suggestions:**
- (FoN or WoE)/(SL or Inc)/(StFl or TM)/ShS

All 6 of these builds are, again, relatively close for 2 target DoT-cleave.


### Add wave analysis ###
One of the most exciting contributions we have to showcase with chickendb is our add wave module! We can now explore fights that are a mixture of ST and cleave, enabling us to suggest builds that do well in hybrid fights, arguably the majority of fights in the game.

We have add uptimes ranging from 10% to 100%, at 10% intervals, so there is a wide array of options for you to explore in your own time. For this analysis, we will look at 30% uptime.

Snapshot of the add waves 30% uptime report for 20th July:

![addwaves](https://puu.sh/B0Zee/621625efe2.png)

Finally, a different Talent DPS graph: ShS has almost been toppled by Fury of Elune. This is likely because the 30% add uptime for our model is lining up nicely with the cooldown of FoE. The top three talents in this scenario are a cut above the rest: ShS > FoE > TM, all of which are significantly above 8% DPS each.

In terms of builds, all are very close in the top 20. TM is featured in nearly all of them, with SD significantly below and StFl reporting as negative DPS. Note that this is due to a deficiency in the APL for StFl, as a talent should *always* provide positive DPS to a rotation if it can be ignored in the case that it does negative DPS. SD could also be improved with AP pooling, but it’s unlikely it will topple TM even with that included.

**Hybrid fight build suggestions:**
- (WoE or NB or FoN)/(SL or SotF or Inc)/TM/(ShS or FoE)

We’ve suggested 18 builds here, pick what you like. They all function slightly different, the only definite talent to take is TM. Taking FoE will depend on how well FoE’s cooldown syncs up with the add waves -- if you have to hold FoE for 30 seconds or more each cooldown, you’re probably better off taking ShS.


### Target scaling analysis ###
Now that we’ve explored the Main report page to death, it’s time to look at a different set of analytics: target scaling. We now have the capability to explore the effect of each talent individually, as well as how it changes with the amount of targets you’re fighting.

We will go tier-by-tier, and see if we can support the choices we made above with just this simple target scaling metric.

#### Tier 15 ####
For reference, here is the Tier 15 DPS by targets report for 20th July:

![targetstier15](https://puu.sh/B1zaE/16d9419199.png)

Yikes. No wonder we didn’t really care that much between FoN, NB and WoE when looking at the cleave and DoT-cleave fights. All of these talents scale quite poorly with targets, though NB and WoE do scale relatively better than FoN, since FoN doesn’t scale at all.

For DoT-cleave, all three talents pretty much don’t scale at all.

This is quite consistent with our build ranking from before, as we were quite indifferent on Tier 15 choice throughout.

#### Tier 75 ####
![targetstier75](https://puu.sh/B0Zkt/a9ec25897c.png)

Inc, SotF and SL all seem to scale quite similarly for cleave fights, and they are all quite close together. In this case, the only separation would be each talent’s synergy with the overall build, which we showed does matter in the case of taking ShS with SD for instance.

SotF does relatively poor for DoT-cleave, which makes sense as we will not use Starfall in a DoT-cleave fight.

Again, our predictions are consistent with the results for the Tier 75 row.

#### Tier 90 ####
![targetstier90](https://puu.sh/B0ZkY/97f496cfed.png)

Now we start to see some real deviation. You can see just how much TM really scales with targets, and SD just can’t keep up. StFl seems to increase up to 3 targets but then decrease for 4 and 5 targets. This is likely due to a deficiency in the APL -- we will seek to rectify this in the near future.

StFL and TM scaling for DoT-cleave is again very apparent, with both talents neck-and-neck for the most part. However, it looks like TM is overtaking StFl by 3 targets, implying that TM is likely to be the better talent for 3+ targets. Note that the damage of TM may be slightly inflated in the DoT-cleave sims, as the extra Moonfire doesn’t have a max range in SimC (yet).

#### Tier 100 ####
![targetstier100](https://puu.sh/B0Zlf/141df24855.png)

Let’s start with the unsurprising results of DoT-cleave: considering we know that Full Moon and FoE can only hit one target, it’s obvious that ShS will be the clear winner even without the recent buff. With the buff, it’s just monstrous.

Cleave: things are a little more tame. ShS scales faster than FoE, with both talents leaving NM in the dust. Maybe this talent line will be rebalanced in the future -- for the moment, it’s Shooting Stars everywhere.

A quick summary for the above synopsis on target scaling is available in the bottom two visuals of the Targets page:

![talentscaling](https://puu.sh/B0ZlR/e0fab79516.png)


Here we’ve shown the percentage of ST DPS each talent increases by per target. This certainly suggests our best scaling talents are TM, ShS, SotF and FoE for cleave, and TM, ShS, StFl for DoT-cleave.


### Add wave scaling ###
If you hop on over to the Add Cleave tab, we can see how our talents scale with add uptime. For the most part, these results are pretty much identical to the Cleave report, however I will draw your attention to the Tier 100 sims.

![addwavescaling](https://puu.sh/B0ZmV/387f00e093.png)

What’s interesting to see here is just how much FoE relies on add waves syncing up with its cooldown. There’s a clear sinusoidal curve to the DPS of FoE, indicating that for add uptimes for 40 to 70%, the cooldown of FoE was out-of-sync with the wave cooldown, and therefore the actual DPS of FoE falls. This indicates that add wave cooldowns are integral in assessing whether you should take FoE to a fight or not.


### Fight length analysis ###
We know that not all fights are 300 seconds long. We also know that as the fight length increases, all builds converge to their steady-state DPS.

But what about those fights that are really short? When you have the tier on farm, and you’re blasting through bosses in 100-150 seconds? Do we still take our progression build?

This is what the Fight Length tab answers. Our answers here really rely on the situation you’re facing, but let’s step through a couple of examples to show the power of this kind of analysis you can do on your own!

**Example #1**: On progression for a particular boss that had add waves with around 40% uptime, Megachicken has been taking WoE/SotF/TM/ShS. However, it’s nearing the end of the tier and Megachicken is wondering if taking more cooldown-oriented talents will boost his DPS, since the fight has dropped from a 5 minute fight to only 100 seconds.

What Megachicken does is he goes to the Fight Length tab of chickendb and ticks WoE, SotF, TM and ShS, as well as Incarnation, SD and FoE for comparison.

This is what Megachicken sees:

![fightlength1](https://puu.sh/B0Xly/9587d97e2a.png)

He was right in taking WoE/SotF/TM/ShS for the 5 minute progression fights -- this build is the clear winner when he mouses over the graph at 300 seconds.

However, mousing over 100 seconds, he sees this:

![fightlength2](https://puu.sh/B0Xm1/76b2bd27db.png)

Megachicken notes he can increase his DPS by swapping to WoE/Inc/TM/FoE! He swaps his talents in raid next week, and gets rank 1 with his cool new build.

Great job, Megachicken.

**Example #2**: Megachicken is progressing on a tough single-target fight, and the raid is having difficulty when a second priority target spawns that needs to be killed ASAP otherwise the raid wipes. After two hours of wipes at the same point, the guild is asking for raiders to swap to burstier builds to take down this priority target faster.

Megachicken goes to his handy Fight Length tab again, and inputs his FoN/SL/StFl/ShS single-target build, along with Incarnation and FoE to see if swapping to this build is going to be viable. This is what Megachicken sees, and he notices a couple of interesting points:

![fightlength3](https://puu.sh/B0Xz7/010e556797.png)

He first notices that all of the four builds are ridiculously close at the 300 second mark, so he doesn’t feel like his choice will affect his overall DPS much.

Secondly, he notices that the FoN/Inc/StFl/FoE build has the biggest DPS spike at 11 seconds in, which is just in time to kill the priority target before it explodes. Megachicken decides to swap builds, and will save his cooldowns for just the right moment.

What a team player.


### Build synergies ###
Our last tab (for the moment) shows the build DPS synergies. This is the remaining DPS of a build, when you control for base DPS (no talents) and for the DPS contributions of each talent within a build.

Build synergy can be either positive or negative. When the talents within a build all complement each other, the total build synergy will be positive. When the talents work against each other, build synergy will be zero, or even negative.

We’ll focus on the top 5 and bottom 5 synergies for 5 target cleave, but note that this analysis is applicable to any scenario.

![syn1](https://puu.sh/B0XKp/bb4fbf831a.png)

What’s readily apparent about the top 5 synergies is that they are all \*/\*/SD/ShS builds, implying that it’s actually just SD/ShS synergy driving this massive gain. These build synergies are almost 6% DPS, which is huge given that you get this DPS entirely as a bonus. Also note that that the Tier 15 talent rarely matters, as all of them are represented in the top 5, but Incarnation for Tier 75 is missing.

![syn2](https://puu.sh/B0XNC/94b3dd1e06.png)

Our synergistic losers are all Inc/StFl builds. Interesting, as the only issue that could come about between Inc and StFl are spell cast time conflicts with Inc being on the GCD with BFA. Regardless the negative synergy isn’t particularly high, so we don’t need to delve into this analysis much.

We will conclude this section with a summary of the above results, and quick-reference for suggested builds.


# Summary of results #
To summarise as a quick reference, here are our top 4 builds based on our analysis so far.

**Build 1**: (FoN or WoE)/SL/StFl/ShS

This build is our top ST build, while also being extremely competitive for DoT-cleave, and fairly strong for regular cleave up to 3 targets. You can pick FoN or WoE, whichever you prefer. WoE will scale better with targets if that’s important in your situation.

- Fight types: ST, 2- or 3-target Cleave, 2- or 3-target DoT-cleave

**Build 2**: WoE/(SL or SotF)/TM/ShS

This is the TM variant of Build 1. Notice that to swap from a ST-focussed build to a king of AoE you simply need to swap StFl for TM. You can also choose to swap SL for SotF if you want to maximise your Starfall DPS. Note that this build also does reasonably well on ST.

- Fight types: ST, any target Cleave, any target DoT-cleave.

**Build 3**: WoE/SotF/SD/ShS

This is the “I just want my Starfall to do all the damage” build. Stack those Starfalls, blow up those adds, feelsgoodman.

- Fight types: AoE, AoE, AoE.

**Build 4**: WoE/Inc/TM/FoE

This build is all about cooldown synergy. Popping Inc, WoE and FoE altogether feels good, and it does a lot of damage. This build is especially good for hybrid fights where the add waves/additional targets sync up with the cooldown of FoE. You will need to manage your cooldowns well with this build, but it stands to be a particularly strong one in the right hands.

- Fight types: Cleave, Hybrid.

**Single-target build suggestions**:
- FoN/SL/StFl/ShS
- WoE/SL/StFl/ShS
- FoN/Inc/StFl/ShS
- FoN/SL/StFl/NM
- FoN/SL/StFl/FoE

**Cleave build suggestions**:
- (WoE or NB)/(SotF or SL)/(SD or TM)/ShS

**DoT-cleave build suggestions**:
- (FoN or WoE)/(SL or Inc)/(StFl or TM)/ShS

**Hybrid fight build suggestions**:
- (WoE or NB or FoN)/(SL or SotF or Inc)/TM/(ShS or FoE)


# Upcoming #
There are four major additions to chickendb coming in the near future: stat scaling, azerite, trinkets and movement sims. We’re really excited to share these analytics with you, but we have a few creases to smooth out before we can make these details public. As soon as we’re ready, we will make another post showcasing these new items and exploring them with you. Stay tuned!

Following these sim-related changes, we will also be looking to integrate WarcraftLogs and Mythic+ data to compare and contrast results, as well as provide additional analytics. Once complete, we will be in a great position to start incorporating other specs into chickendb, allowing inter-spec comparisons.


# Conclusion #
We hope you’ve enjoyed your first taste of chickendb. We will be producing sims for every major change to Boomkins, and will be working diligently over the expansion to get the other specs in as well.

If you have any questions, queries, comments or feedback, we’re more than happy to hear it! Please let us know either here or on Discord (Slippykins#0001 & Iskalla#0001).

See you in the next post!
