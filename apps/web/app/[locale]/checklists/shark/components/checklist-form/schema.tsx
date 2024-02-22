import {z} from "zod";
import {
  cellInstallationDateFields,
  cellVoltageFieldsSchema, controllerBatteryFieldsSchema, sectionStepsSchema
} from "./sections/controllers-checklist-section";

export const formSchema = z.object({
  ...sectionStepsSchema.shape,
  ...controllerBatteryFieldsSchema.shape,
  ...cellVoltageFieldsSchema.shape,
  ...cellInstallationDateFields.shape,
  
  check_controller_battery: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.controllers_section.check_controller_battery_step.error.is_required"
    })
  }),
  check_oxygen_cells_voltage: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.controllers_section.check_oxygen_cells_voltage_step.error.is_required"
    })
  }),
  check_oxygen_cells_installation_date: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.controllers_section.check_oxygen_cells_installation_date_step.error.is_required"
    })
  }),
  check_dive_parameters: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.controllers_section.check_dive_parameters_step.error.is_required"
    })
  }),
  check_oxygen_percentage_and_pressure: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.gas_section.check_oxygen_percentage_and_pressure_step.error.is_required"
    })
  }),
  check_diluent_percentage_and_pressure: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.gas_section.check_diluent_percentage_and_pressure_step.error.is_required"
    })
  }),
  check_carbon_dioxide_absorbent_remaining_time: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.check_carbon_dioxide_absorbent_remaining_time_step.error.is_required"
    })
  }),
  install_diluent_and_oxygen_tanks: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.install_diluent_and_oxygen_tanks_step.error.is_required"
    })
  }),
  install_water_trap_and_cannister: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.install_water_trap_and_cannister_step.error.is_required"
    })
  }),
  check_canister_head_grommets: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.check_canister_head_grommets_step.error.is_required"
    })
  }),
  install_counterlungs: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.install_counterlungs_step.error.is_required"
    })
  }),
  install_counterlungs_cover: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.install_counterlungs_cover_step.error.is_required"
    })
  }),
  install_head_connectors_and_hoses: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.install_head_connectors_and_hoses_step.error.is_required"
    })
  }),
  check_breathing_hoses_stereo: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.check_breathing_hoses_stereo_step.error.is_required"
    })
  }),
  check_breathing_hoses_grommets: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.check_breathing_hoses_grommets_step.error.is_required"
    })
  }),
  install_heads_up_display_cable: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.install_heads_up_display_cable_step.error.is_required"
    })
  }),
  check_negative_test: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.montage_section.check_negative_test_step.error.is_required"
    })
  }),
  check_negative_seal_test: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.tightness_section.check_negative_seal_test_step.error.is_required"
    })
  }),
  check_positive_seal_test: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.tightness_section.check_positive_seal_test_step.error.is_required"
    })
  }),
  check_mouthpiece_seal_test: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.tightness_section.check_mouthpiece_seal_test_step.error.is_required"
    })
  }),
  check_main_and_backup_computers: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.oxygen_calibration_section.check_main_and_backup_computers_step.error.is_required"
    })
  }),
  check_oxygen_pressure_and_manual_addition: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.oxygen_calibration_section.check_oxygen_pressure_and_manual_addition_step.error.is_required"
    })
  }),
  check_oxygen_flush: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.oxygen_calibration_section.check_oxygen_flush_step.error.is_required"
    })
  }),
  check_main_and_backup_calibration: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.oxygen_calibration_section.check_main_and_backup_calibration_step.error.is_required"
    })
  }),
  check_setpoint: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.oxygen_calibration_section.check_setpoint_step.error.is_required"
    })
  }),
  check_constant_mass_valve: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.oxygen_calibration_section.check_constant_mass_valve_step.error.is_required"
    })
  }),
  check_diluent_pressure_and_manual_addition: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.diluent_calibration_section.check_diluent_pressure_and_manual_addition_step.error.is_required"
    })
  }),
  check_automatic_diluent_valve: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.diluent_calibration_section.check_automatic_diluent_valve_step.error.is_required"
    })
  }),
  check_diluent_flush: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.diluent_calibration_section.check_diluent_flush_step.error.is_required"
    })
  }),
  check_diluent_leakage: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.diluent_calibration_section.check_diluent_leakage_step.error.is_required"
    })
  }),
  check_diluent_purge: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.diluent_calibration_section.check_diluent_purge_step.error.is_required"
    })
  }),
  check_bailout_pressure: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.bailout_section.check_bailout_pressure_step.error.is_required"
    })
  }),
  check_bailout_connections: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.bailout_section.check_bailout_connections_step.error.is_required"
    })
  }),
  check_dive_gases_and_sorbent_time: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.general_checks_section.check_dive_gases_and_sorbent_time_step.error.is_required"
    })
  }),
  check_dive_computer_connection: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.general_checks_section.check_dive_computer_connection_step.error.is_required"
    })
  }),
  check_dive_gear: z.literal(true, {
    errorMap: () => ({
      message: "rebreather_checklists.shark.general_checks_section.check_dive_gear_step.error.is_required"
    })
  })
})

export type FormValues = z.infer<typeof formSchema>
