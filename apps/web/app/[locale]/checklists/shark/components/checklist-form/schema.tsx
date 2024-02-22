import {z} from "zod";
import {controllersSectionSchema} from "./sections/controllers-checklist-section";

export const formSchema = z.object({
  ...controllersSectionSchema.shape,

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
  check_oxygen_percentage_and_pressure: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_diluent_percentage_and_pressure: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_carbon_dioxide_absorbent_remaining_time: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_diluent_and_oxygen_tanks: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_water_trap_and_cannister: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_canister_head_grommets: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_counterlungs: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_counterlungs_cover: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_head_connectors_and_hoses: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_breathing_hoses_stereo: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_breathing_hoses_grommets: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  install_heads_up_display_cable: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.steps.error.is_required"
    })
  }),
  check_negative_test: z.literal(true, {
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
