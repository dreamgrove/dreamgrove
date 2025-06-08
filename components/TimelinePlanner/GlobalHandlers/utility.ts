import { GlobalAction } from '../../../lib/types/global_handler'

function bindGlobalAction(
  key: string,
  action: GlobalAction,
  handlers: Map<string, GlobalAction[]>
) {
  if (!handlers.has(key)) handlers.set(key, [])
  handlers.get(key)!.push(action)
}

export { bindGlobalAction }
