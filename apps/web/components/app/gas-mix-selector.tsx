import {useSelector} from "@/state/useSelector";
import {mixByIdSelector} from "@/state/dive-gases/selectors";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {GasBadge} from "@/components/app/gas-badge";
import * as React from "react";
import {useStore} from "@/state/store";

function GasMixSelectorItem({id}: { id: string }) {
  const gasMix = useSelector(mixByIdSelector, id)

  return (
    <SelectItem value={id}>
      <GasBadge gasMix={gasMix}/>
    </SelectItem>
  )
}

export const GasMixSelector: typeof Select = props => {
  const mixesIdList = useStore.use.mixesIdList()

  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="-- no gas --"/>
      </SelectTrigger>
      <SelectContent>
        {mixesIdList.map(
          mixId => (
            <GasMixSelectorItem
              key={mixId}
              id={mixId}
            />
          )
        )}
      </SelectContent>
    </Select>
  )
}
