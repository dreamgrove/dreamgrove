'use client'
import { Tour } from 'nextstepjs'

export const onNextStepStepChange = (step: number, tourName: string | null) => {
  console.log(
    'Example onStepChange Callback: NextStep Changed the step: ',
    step,
    'of the tour: ',
    tourName
  )
}

export const steps: Tour[] = [
  {
    tour: 'firsttour',
    steps: [
      {
        icon: 'X',
        title: 'Tour 1, Step 1',
        content: "Let's go",
        selector: '#tour1-step1',
        viewportID: 'timeline-view',
      },
    ],
  },
]
