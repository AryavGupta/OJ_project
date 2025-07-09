import * as React from "react"
import { toast as sonnerToast } from "sonner"

export function useToast() {
  const toast = React.useCallback((options) => {
    sonnerToast(options)
  }, [])

  return {
    toast,
  }
}
