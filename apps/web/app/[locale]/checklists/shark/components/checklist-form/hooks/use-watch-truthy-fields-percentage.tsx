import * as React from "react";
import {useWatch} from "react-hook-form";

function truthyElementsPercentage(arr: boolean[]): number {
  let trueCount = arr.reduce((count, item) => {
    return count + (item ? 1 : 0);
  }, 0);

  return trueCount / arr.length;
}

export function useWatchTruthyFieldsPercentage(fieldNames: string[]) {
  const fields = useWatch({
    name: fieldNames
  })

  return React.useMemo(
    () => truthyElementsPercentage(fields),
    [fields]
  )
}

