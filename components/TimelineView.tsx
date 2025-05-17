// Function to modify a cast
const handleModifyAction = (castId: string, newTime: number) => {
  console.log('old inputActions', inputActions)
  const actionIndex = inputActions.findIndex((a) => a.id === castId)

  if (actionIndex >= 0) {
    const newActions = inputActions.map((action, index) =>
      index === actionIndex ? { ...action, instant: newTime } : action
    )
    console.log('newActions', newActions)
    setInputActions(newActions)
  }
}
