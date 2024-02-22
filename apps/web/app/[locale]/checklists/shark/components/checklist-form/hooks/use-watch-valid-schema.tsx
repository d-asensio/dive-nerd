import type {ZodObject, ZodRawShape} from "zod";
import {useWatch} from "react-hook-form";
import {zipObj} from "ramda";

export function useWatchValidSchema<T extends ZodRawShape>(zodSchema: ZodObject<T>) {
  const schemaFieldKeys = zodSchema.keyof().options
  const schemaFieldValues = useWatch({name: schemaFieldKeys})

  const fieldsToValidate = zipObj(schemaFieldKeys, schemaFieldValues)

  const {success} = zodSchema.safeParse(fieldsToValidate)

  return success
}
