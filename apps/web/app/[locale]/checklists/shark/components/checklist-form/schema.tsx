import {z} from "zod";

export const formSchema = z.object({
  // ---
  check_controller_battery: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  internal_battery_volts_field: z.coerce.number()
    .gt(0, {
      message: "Este valor debe ser superior a 0"
    }),
  external_battery_volts_field: z.coerce.number()
    .gt(0, {
      message: "Este valor debe ser superior a 0"
    }),
  // ---
  check_oxygen_cells_voltage: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  cell_one_millivolts_field: z.coerce.number()
    .gt(9, {
      message: "Este valor debe ser superior a 9mv"
    }),
  cell_two_millivolts_field: z.coerce.number()
    .gt(9, {
      message: "Este valor debe ser superior a 9mv"
    }),
  cell_three_millivolts_field: z.coerce.number()
    .gt(9, {
      message: "Este valor debe ser superior a 9mv"
    }),
  // ---
  check_oxygen_cells_installation_date: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  cell_one_installation_date_field: z.date({
    required_error: "Este campo es obligatorio",
  }),
  cell_two_installation_date_field: z.date({
    required_error: "Este campo es obligatorio",
  }),
  cell_three_installation_date_field: z.date({
    required_error: "Este campo es obligatorio",
  }),
  // ---
  check_dive_parameters: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_oxygen_percentage_and_pressure: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_diluent_percentage_and_pressure: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_carbon_dioxide_absorbent_remaining_time: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  install_diluent_and_oxygen_tanks: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  install_water_trap_and_cannister: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_canister_head_grommets: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  install_counterlungs: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  install_counterlungs_cover: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  install_head_connectors_and_hoses: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_breathing_hoses_stereo: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_breathing_hoses_grommets: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  install_heads_up_display_cable: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_negative_test: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_negative_seal_test: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_positive_seal_test: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_mouthpiece_seal_test: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_main_and_backup_computers: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_oxygen_pressure_and_manual_addition: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_oxygen_flush: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_main_and_backup_calibration: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_setpoint: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_constant_mass_valve: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_diluent_pressure_and_manual_addition: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_automatic_diluent_valve: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_diluent_flush: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_diluent_leakage: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_diluent_purge: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_bailout_pressure: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_bailout_connections: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_dive_gases_and_sorbent_time: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_dive_computer_connection: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_dive_gear: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  })
})

export type FormValues = z.infer<typeof formSchema>
