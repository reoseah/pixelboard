import { onCleanup } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'

const useSearchParams = <T extends Record<string, string>>() => {
  const [searchParams, setSearchParamsInternal] = createStore<Partial<T>>({})

  const update = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const params: Record<string, string> = {}
    for (const [key, value] of searchParams) {
      params[key] = value || ''
    }
    setSearchParamsInternal(reconcile(params as T))
  }

  update()

  window.addEventListener('popstate', update)
  onCleanup(() => {
    window.removeEventListener('popstate', update)
  })

  const setSearchParams = (params: Partial<T>) => {
    const searchParams = new URLSearchParams()
    for (const key in params) {
      searchParams.set(key, params[key] || '')
    }
    window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`)
    update()
  }

  return [searchParams, setSearchParams] as const
}

export default useSearchParams
