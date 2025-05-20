'use client'
import type { CardComponentProps } from 'nextstepjs'

import { Step } from 'nextstepjs'

interface CustomCardProps {
  step: Step
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  arrow: React.ReactNode
}

const TutorialCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) => {
  return (
    <div className="max-w-md min-w-2xl rounded-sm bg-white p-6 shadow-lg dark:bg-neutral-800">
      <div className="mb-4 flex items-center gap-3">
        {false && step.icon && <div className="text-xl">{step.icon}</div>}
        <h3 className="text-xl font-bold">{step.title}</h3>
      </div>

      <div className="mb-6">{step.content}</div>

      <div className="text-neutral-800">{arrow}</div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          Step {currentStep + 1} of {totalSteps}
        </div>

        <div className="flex gap-2">
          {currentStep > 0 && (
            <button onClick={prevStep} className="rounded bg-gray-200 px-4 py-2 dark:bg-gray-700">
              Previous
            </button>
          )}
          {true && (
            <button onClick={skipTour} className="px-4 py-2 text-gray-500 dark:text-gray-400">
              Skip
            </button>
          )}
          <button onClick={nextStep} className="bg-main rounded-xs px-4 py-2 text-white">
            {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TutorialCard
