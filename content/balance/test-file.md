---
date: '2023-10-31'
authors: ["Oi"]
published: true
patch: "10.1.7"
title: testtest
showOnFrontpage: true
showInRecent: false
---


<div id="news">

# [1. News:](#news)

</div>

## 10.2 News
### Tier Set
> 2p: When Eclipse ends or when you enter combat, enter a Dreamstate, reducing the cast time of your next 2 Starfires or Wraths by 40% and increasing their damage by 100%.

Looks to be a ~5.1% increase from having no tier
If the buff is up when entering combat your first wrath/starfire will be affected by the buff and your 2p stacks will then reset back to 2 when you finish your cast


- Use {{< spell 202425 "Warrior of Elune" >}} if your eclipse is about to end and you will enter Solar Eclipse next.
- Use {{< spell 194153 "Starfire" >}} to enter Solar Eclipse.


{{< checkbox id="AC" spell=202425 >}}Warrior of Elune{{< /checkbox >}}
<br>{{< checkbox id="CD" >}}Starfire{{< /checkbox >}}
- text here
{{< cbtext id="AC" type="list" >}}
- random text here
{{< /cbtext >}}
- test2
- and some more text1
- and some more text
{{< cbtext id="CD" >}}
- random text here
{{< /cbtext >}}
- and some more text

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const liItems = document.querySelectorAll('.cbtext-list-item');
        liItems.forEach(item => {
            let parent = item.parentElement;
            if (parent && parent.tagName.toLowerCase() === 'ul') {
                parent.parentNode.insertBefore(item, parent);
                if (!parent.hasChildNodes()) {
                    parent.remove();
                }
            }
        });
    });
</script>