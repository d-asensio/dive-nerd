import {useSelector} from "@/state/useSelector";
import {
  bottomGasesIdListSelector,
  gasByIdSelector
} from "@/state/dive-gases/selectors";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {GasBadge} from "@/components/app/gas-badge";
import * as React from "react";
import {useStore} from "@/state/store";

function GasSelectorItem({id}: { id: string }) {
  const gas = useSelector(gasByIdSelector, id)

  return (
    <SelectItem value={id}>
      <GasBadge gas={gas}/>
    </SelectItem>
  )
}

export const BottomGasSelector: typeof Select = props => {
  const bottomGasesIdList = useStore(bottomGasesIdListSelector)

  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="-- no gas --"/>
      </SelectTrigger>
      <SelectContent>
        {bottomGasesIdList.map(
          gasId => (
            <GasSelectorItem
              key={gasId}
              id={gasId}
            />
          )
        )}
      </SelectContent>
    </Select>
  )
}
