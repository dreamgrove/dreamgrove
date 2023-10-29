---
date: '2018-04-20T9:00:00'
authors: ["Gebuz"]
published: true
title: "The Best of Legion Boomkin: Part 1, The Emerald Dreamcatcher"
series: ["The Best of Legion Boomkin"]
series_title: "Part 1, The Emerald Dreamcatcher"
series_weight: 1
patch: "7.3.5"
---
With Legion drawing to an end I figured it would be a good time to go over what I think has worked well for Balance Druid during the expansion. While it is unavoidable to not  also touch on some aspects that I disliked, I will try to keep the focus primarily on the positives and how some of them might be incorporated into the Battle for Azeroth Balance Druid.

In this first part I will be covering The Emerald Dreamcatcher, the legendary that at the start of Legion turned Balance Druid’s otherwise extremely simple rotation into one of the most complex rotations in the game.

## The Emerald Dreamcatcher 1.0: Surgeweaving
The version of The Emerald Dreamcatcher that went live with Legion was very different from the version we have today. Back then the buff only lasted for 3 seconds but it reduced the cost of Starsurge by 10. The short duration meant that without Incarnation it was impossible to maintain the buff for long since we could only fit a cast or two between each Starsurge. This created a, in my opinion, very engaging play style with a burn phase and a conservation phase, similar to that of an Arcane Mage. The downside (and the primary reason it was later changed) was that it required the player to hit specific haste breakpoints in order to be able to fit certain spells in between the Starsurges. This was further worsened by the fact that spell queuing became an absolute requirement to get it right, leading to a lot of people playing with a spell queue window of up to 400 ms, which hurt your reaction time in a lot of situations.

Another major downside that should be pointed out is that this awesome rotation was tied to a legendary. At the time, it was near impossible to get more than four legendaries, and during Emerald Nightmare progression most only had one or two. This meant that in order to even play the Surgeweave rotation you had to be fortunate enough to even get The Emerald Dreamcacther.

## The Emerald Dreamcatcher 2.0: Chain Casting
On the 7.1 PTR The Emerald Dreamcatcher was for a time changed to only be a 2 second buff that was further reduced by haste. This effectively killed the rotation, as it became impossible to cast any other spells between the Starsurges. The reason for this change was likely that Surgeweaving was never intended in the first place, and the legendary was originally designed for the intend of casting multiple Starsurges back to back for short single target burst windows. Me and other boomkins gave feedback during the Beta that Surgeweaving would likely be a thing and I personally suggested a change similar to this at the time to avoid it, and enforce the chain casting. However, after playing Surgeweaving through all of Emerald Nightmare and Trial of Valor I came to enjoy it so much that I had completely changed my mind by the time 7.1 hit the PTR.

## The Emerald Dreamcatcher 2.1: Nerfed But Not Broken
Luckily, I was far from the only one that had enjoyed the Surgeweaving play style, and we succeeded in convincing the developers to leave the rotation in the game. Instead it had its cost reduction reduced from 10 to 7, which was primarily due to it being a heavy outlier in terms of DPS value compared to the other legendaries at the time. This change did however reduce the duration we could keep the buff up for, making the burn phases slightly shorter. This might have been for the better, since the uptime might have been on the high side. For reference, this is the uptime in Emerald Nightmare and in The Nighthold:

<center>
        <img src="https://gebuz.files.wordpress.com/2018/04/eduptimeen.png?w=840&h=165" ></img>
        *The Emerald Dreamcatcher uptime in Emerald Nightmare*
</center>

<center>
        <img src="https://gebuz.files.wordpress.com/2018/04/eduptimenh.png?w=840&h=163" ></img>
        *The Emerald Dreamcatcher uptime in The Nighthold*
</center>

As you can see, the duration of the burn phases outside of Incarnation was reduced from roughly of 30 seconds to 15 seconds. The total uptime was not significantly reduced since the time of the conservation phase was not increased, and the uptime during Incarnation was unaffected. It went from ~80% to ~70%. I personally think that the Nighthold version was better, as the 30 second burn phases was definitely on the long side.

## The Emerald Dreamcatcher 3.0: The Death of Surgeweaving
In patch 7.2.5 The Emerald Dreamcatcher was changed to only reduce the cost of Starsurge by 5 but also have a 5 second duration. This effectively meant that you could maintain the buff indefinitely, killing the Surgeweaving playstyle with the burn and conservation phase. This change being a slight nerf to its dps combined with Oneth’s Intution getting buffed through Starfall’s duration no longer being reduced by haste and 4p20 + 2p19 becoming an option in Tomb of Sargeras meant that The Emerald Dreamcatcher fell behind on DPS. Luckily this was primarily a good thing, as many found the changed Emerald Dreamcatcher rotation not very fun. Instead of having the challenge of keeping the burn phase going for as long as possible, it now felt more like a maintenance buff that you were bad if you dropped at all. These things combined has resulted in The Emerald Dreamcacther seeing very little play from the start of Tomb of Sargeras and up to this day.

## Surgeweaving in Battle for Azeroth
I would love to see Surgeweaving being reintroduced as an alternative to the otherwise very open Balance Druid rotation. Ideally it should be as a talent as that would allow players to opt in or out of the rotation at will. In order to address the issue of haste breakpoints,  spell queuing and high latency I have come up with a few ideas for possible implementations.

#### The Tier 20 Approach

>*Casting Starsurge reduces the cost of Starsurge by 5 for 15 seconds. Stacks up to 4 times, but gaining a stack does not refresh the duration.*

This copies the idea of the 4p20 bonus from Tomb of Sargeras where the buff has a set duration that can not be extended but stacks can be added. It would ensure that you have a burn phase and a conservation phase since the buff always has a set duration. This would also avoid any haste breakpoints and spell queuing issues. The downside is that it would not create the same strict rotation that Surgeweaving had; you will be able to cast your spells in any order you want aslong as you dumb all your Astral Power in the window. It also has the downside that in cases where you have to pool Astral Power for a specific time during an encounter you might end up having to /cancelaura so you can spend a bit of Astral Power without starting a burn phase.

#### The X Casts Approach

>*Casting Starsurge reduces the cost of the next Starsurge cast within 3 casts by 5. Stacks up to 3 times.*

This idea would rely on the buff disappearing after casting X spells that is not Starsurge. This way you could ensure that it is dropped eventually, and it would force a weave playstyle where you want to always have X casts between the Starsurges. The downside to this solution is that it might not feel as fluid when the time between the Starsurges changes based on the cast time of the spells used in between. It also has the downside that there might not be a very intuitive way to track it, and it might be a problem to know which spells count and which does not. For instance, Solar Beam probably should not count.

#### The Haste Scaling Approach

>*Casting Starsurge reduces the cost of Starsurge by 7 for 5 seconds. Stacks up to 2 times. The duration of this buff is reduced by haste.*

This would basically be the same as the version that was on the 7.1 PTR for a short time except with a longer base duration to allow other casts between. The duration of the buff would scale with haste so you could always fit the same spells in between your Starsurges no matter your haste. My biggest issue with this solution is that it does not feel very intuitive that more haste does not allow for more casts between Starsurges, and we would likely drop the buff during Incarnation.

Personally I think the first option is the most reasonable. It would create the burn and conservation phases, but it would also keep the rotation open enough to allow for less experienced players to get some benefit from it, as the only real skill cap comes from ensuring you are always close to max Astral Power when you cast the first Starsurge, and always close to zero when you drop the buff.
