"use client"

import * as React from "react"

import {useSelector} from "@/state/useSelector"
import {gasByIdSelector} from "@/state/dive-gases/selectors"
import {useStore} from "@/state/store"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {GasBadge} from "@/components/app/gas-badge"

function GasSelectorItem({ id }: { id: string }) {
  const gas = useSelector(gasByIdSelector, id)
  return (
    <SelectItem value={id}>
      <GasBadge gas={gas}/>
    </SelectItem>
  )
}

/**
 * Selects any gas currently defined in the planner — bottom or deco — by id.
 * Used by Tanks (a tank can hold any gas), unlike the level picker which is
 * restricted to bottom gases.
 */
export const GasSelector: typeof Select = props => {
  const gasesIdList = useStore.use.gasesIdList()
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="-- no gas --"/>
      </SelectTrigger>
      <SelectContent>
        {gasesIdList.map(gasId => (
          <GasSelectorItem key={gasId} id={gasId}/>
        ))}
      </SelectContent>
    </Select>
  )
}
