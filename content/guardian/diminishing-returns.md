---
title: On Diminishing Returns
date: '2018-08-26'
authors: ['Faide']
published: false
hasMath: true
patch: 8.0.1
---

I've seen a lot of questions surface recently about diminishing returns --- what it is, how it works, and what stats are and aren't affected. Let's break it down.

## What is diminishing returns?

Diminishing returns refers to a property of some stats where the more of a stat you add, the smaller the benefit you gain from each added point will be. Diminishing returns is sometimes unhelpfully abbreviated DR (not to be confused with damage reduction, a concept which is also abbreviated DR and is often discussed simultaneously with diminishing returns which can be extremely confusing), something I will try and avoid doing in this article.

When talking about diminishing returns in World of Warcraft, we are typically referring to one of several different but related concepts by which the effects of our stats are diminished.

### Diminishing Returns as Marginal Utility

The first is the property of **diminishing marginal utility**, which is the idea that every point of a stat added is less valuable than the previous. For example: adding 72 Crit rating (the equivalent of 1% Crit) when you have 0 rating is a larger marginal gain (going from 0% Crit to 1% Crit) than adding 72 Crit rating when you have 7056 rating (going from 98% Crit to 99% Crit). 

{{< texblock >}}
\begin{aligned}
\frac{1.01}{1.00} &> \frac{1.99}{1.98} \\ \\
1.01 &> 1.005
\end{aligned}
{{< /texblock >}}

Many people understand this intuitively as "stat X gets worse the more you have of it". When we talk about stats having diminishing returns in this manner, we are typically referring to diminishing marginal utility.

### Diminishing Returns as Penalties

A second use of the term diminishing returns refers to ex post facto conversions applied to some mechanics to reduce their effectiveness from what is advertised on the tooltip. Things such as CC durations, taunt effectiveness, and dodge/parry rating to percent conversions are all examples of game mechanics which incur a diminishing returns penalty. This is the classic definition of "diminishing returns" that players use most often in WoW.

Particularly relevant to tanks is the dodge/parry conversion. For simplicity's sake I will use terms relevant to Guardian, but know that anywhere that "Dodge" is mentioned, it can be replaced with "Parry" (and "Agility" with "Strength") as the formula is the same for both.

Dodge chance gained from gear is subject to a diminishing returns penalty. The full dodge formula is longer (and not all dodge is penalized), but only this part of the formula is relevant to the current discussion.

{{< texblock >}}
effectiveDodge = \frac{dodgeFromGear}{dodgeFromGear * verticalStretch + horizontalShift}
{{< /texblock >}}

- verticalStretch is 0.01 (for Demon Hunters it's 0.02).
- horizontalShift is 1 / 0.97 for Druids (for other tanks, it's 1 / 0.94)

What this results in is a function that limits the effectiveness of stacking stats that grant Dodge (namely, Crit rating), by diminishing the amount of effective Dodge you gain from the Dodge on your gear.

![Effects of Diminishing Returns on Dodge](/guardian/images/dodge-diminishing-returns.png)

## What isn't diminishing returns?

One of the most common misconceptions I see is that armor has 


---

- how diminishing returns interacts with damage reduction
 - percent damage reduction has inverse scaling (better the more you have of it)
 - some stats when converted to %dr have diminishing returns applied to prevent them
   from being stronger per point 
 - these two effects cancel out and we are left with linear scaling (represented as ehp), but still subject to diminishing marginal utility
 - notably, versatility does not have diminishing returns applied, so it does get stronger the more you have of it
