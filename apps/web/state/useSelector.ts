import * as React from "react";
import {StoreState, useStore} from "@/state/store";

export const useSelector = <R, A>(selector: (state: StoreState, ...args: A[]) => R, ...args: A[]) =>
  useStore(
    React.useCallback(
      (state: StoreState) => selector(state, ...args),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...args, selector]
    )
  )
