import { refreshSession } from './refreshSession'
import { useSessionStore } from './store'

export async function restoreSession() {
  try {
    useSessionStore.getState().startSession(await refreshSession())
  } catch {
    useSessionStore.getState().finishRestoring()
  }
}
