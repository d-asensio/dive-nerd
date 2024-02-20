import {useFormContext} from "react-hook-form";

export function useWatchHasErrors(fieldNames: string[]) {
  const {formState} = useFormContext()

  return fieldNames.some(key => key in formState.errors)
}
