'use client'
import { Tour } from 'nextstepjs'

export const steps: Tour[] = [
  {
    tour: 'firsttour',
    steps: [
      {
        icon: 'X',
        title: 'Welcome',
        content:
          'This is a quick tutorial that will guide you through the timeline planner. You can exit it at any time by pressing Skip',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'Spec Selection',
        content:
          'With this dropdown you can select the spec you want to use. This will determine the spells and extra talents that are available to you.',
        side: 'bottom-left',
        selector: '#spec-selector',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'Effects View',
        content:
          'This view contains all of the effects that can be applied to the timeline. In most instances these will be all the talents that change the duration of the casts ',
        side: 'bottom',
        selector: '#tour-effects-selector',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'Spell Buttons',
        content:
          'With these buttons you can add a spell to your timeline. Pressing a button multiple times will add multiple instances of that spell.',
        side: 'top',
        selector: '#tour-buttons-selector',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'Custom Element',
        content:
          'You can also create custom elements with this button. This will allow you to define what is essentially a spell with custom values. It can be very useful for potions or trinkets!',
        side: 'top-left',
        selector: '#tour-custom-button-selector',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'Zoom Controls',
        content:
          'Here you can control the zoom level of the timeline. You can also use Ctrl + Scroll Wheel to zoom!',
        side: 'top-right',
        selector: '#tour-zoom-selector',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'Timeline',
        content:
          "This is the main view of the timeline. I've added a few example casts to show you how they look.",
        side: 'top',
        selector: '#tour-timeline-selector',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'Timeline Cast',
        content:
          'Here is a single cast. The green area represents the duration of the effect or buff. The gray area represents how long you have to wait before the cooldown is over.',
        side: 'top',
        selector: '#cast-197721-0-0',
        pointerRadius: 3,
        pointerPadding: 4,
      },
      {
        icon: 'X',
        title: 'Channeled Cast',
        content:
          'If a spell is channeled, the duration of the channel will be represented by the dashed green area. Remember that if a spell is channeled, it can be interupted by other casts!',
        side: 'top',
        selector: '#cast-391528-0-0',
        pointerRadius: 3,
        pointerPadding: 4,
      },
      {
        icon: 'X',
        title: 'Spells with charges',
        content:
          'If a spell has more than 1 charge, the timeline will contain a separate row for each charge.',
        side: 'top-left',
        selector:
          '#tour-timeline-selector > div.shrink-0 > div > div > div.mb-2.w-full > div.flex.w-full.flex-col.items-end.gap-2.border-r-2.pr-2',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'Charges',
        content: 'The number of charges available at any given time is displayed above the spell',
        side: 'top-left',
        selector: '#timeline-row-102693 > div.charges > div:nth-child(7)',
        pointerRadius: 3,
        pointerPadding: 17,
      },
      {
        icon: 'X',
        title: 'Cooldown Delay',
        content:
          'If a spell has more than 1 charge, the cooldown of each charge has to wait for the previous one before starting. This duration is represented by the transparent area preceding the actual cooldown.',
        side: 'top-left',
        selector: '#cast-102693-2-1',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'Editing the Timeline',
        content:
          'You can drag and drop any cast on the timeline to change its position. Casts can also be deleted by clicking the X icon.',
        side: 'top',
        selector: '#cast-391528-0-0',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'Additional information',
        content:
          'You can click this button to access the settings, debug information and additional details regarding the website.',
        side: 'top-right',
        selector: '#tour-debug-selector',
        pointerRadius: 3,
        pointerPadding: 7,
      },
      {
        icon: 'X',
        title: 'The end',
        content:
          'This concludes the tutorial! Feel free to reach on Discord for any questions or bugs.',
        pointerRadius: 3,
        pointerPadding: 7,
      },
    ],
  },
]
