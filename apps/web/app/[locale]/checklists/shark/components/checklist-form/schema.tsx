import {z} from "zod";

import {controllersSectionSchema} from "./sections/controllers-checklist-section";
import {montageSectionSchema} from "./sections/montage-checklist-section";
import {gasSectionSchema} from "./sections/gas-checklist-section";

export const formSchema = z.object({
  ...controllersSectionSchema.shape,
  ...montageSectionSchema.shape,
  ...gasSectionSchema.shape,
  check_controller_battery: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_oxygen_cells_voltage: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_oxygen_cells_installation_date: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_dive_parameters: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_negative_seal_test: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_positive_seal_test: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_mouthpiece_seal_test: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_main_and_backup_computers: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_oxygen_pressure_and_manual_addition: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_oxygen_flush: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_main_and_backup_calibration: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_setpoint: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_constant_mass_valve: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_diluent_pressure_and_manual_addition: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_automatic_diluent_valve: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_diluent_flush: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_diluent_leakage: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_diluent_purge: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_bailout_pressure: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_bailout_connections: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_dive_gases_and_sorbent_time: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_dive_computer_connection: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_dive_gear: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  })
})

export type FormValues = z.infer<typeof formSchema>
