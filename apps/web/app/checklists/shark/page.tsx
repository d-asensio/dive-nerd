"use client"

import * as React from "react"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form} from "@/components/ui/form"
import {toast} from "@/components/ui/use-toast";

import {DateField} from "./components/date-field";
import {NameField} from "./components/name-field";
import {ChecklistSection} from "./components/checklist-section";
import {ChecklistStep} from "./components/checklist-step";
import {RebreatherChecklistDisclaimerAlert} from "./components/rebreather-checklist-disclaimer-alert";
import {BatteryVoltsField} from "./components/battery-volts-field";
import {OxygenCellMillivoltsField} from "./components/oxygen-cell-millivolts-field";
import {GasOxygenPercentageField} from "./components/gas-oxygen-percentage-field";
import {TankPressureField} from "./components/tank-pressure-field";
import {MinutesField} from "./components/minutes-field";
import {OxygenCellInstallationDateField} from "./components/oxygen-cell-installation-date-field";
import {Button} from "@/components/ui/button";

const FormSchema = z.object({
  check_controller_battery: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_oxygen_cells_voltage: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
  check_oxygen_cells_installation_date: z.literal(true, {
    errorMap: () => ({
      message: "Este paso es obligatorio"
    })
  }),
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
})

export default function SharkChecklist() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div className="container p-6">
      <div className="max-w-3xl space-y-6 m-auto">
        <RebreatherChecklistDisclaimerAlert/>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full gap-4 sm:grid-cols-2">
              <NameField/>
              <DateField/>
            </div>
            <div className='mb-4'>
              <ChecklistSection
                title="Petrel DiveCan"
                subtitle="The DiveCan is cool"
              >
                <ChecklistStep
                  description="Conectar controlador (Shearwater) y comprobar las baterías"
                  name="check_controller_battery"
                  control={form.control}
                >
                  <BatteryVoltsField
                    name="internal_battery_volts_field"
                    label="Batería interna"
                  />
                  <BatteryVoltsField
                    name="external_battery_volts_field"
                    label="Batería externa"
                  />
                </ChecklistStep>
                <ChecklistStep
                  description="Voltaje de las célula de oxígeno en aire >9mv"
                  name="check_oxygen_cells_voltage"
                  control={form.control}
                >
                  <OxygenCellMillivoltsField
                    name="cell_one_millivolts_field"
                    label="Célula 1"
                  />
                  <OxygenCellMillivoltsField
                    name="cell_two_millivolts_field"
                    label="Célula 2"
                  />
                  <OxygenCellMillivoltsField
                    name="cell_three_millivolts_field"
                    label="Célula 3"
                  />
                </ChecklistStep>
                <ChecklistStep
                  description="Comprobar fecha de instalación las células, máximo 6 meses y cambiar"
                  name="check_oxygen_cells_installation_date"
                  control={form.control}
                >
                  <OxygenCellInstallationDateField
                    label="Célula 1"
                    name="cell_one_installation_date_field"
                    control={form.control}
                  />
                  <OxygenCellInstallationDateField
                    label="Célula 2"
                    name="cell_two_installation_date_field"
                    control={form.control}
                  />
                  <OxygenCellInstallationDateField
                    label="Célula 3"
                    name="cell_three_installation_date_field"
                    control={form.control}
                  />
                </ChecklistStep>
                <ChecklistStep
                  description="Verificar los parametros de buceo"
                  name="check_dive_parameters"
                  control={form.control}
                />
              </ChecklistSection>
              <ChecklistSection
                title="Gas"
                subtitle="Always know what you breath"
              >
                <ChecklistStep
                  name="check_oxygen_percentage_and_pressure"
                  description="Análisis y presión de la botella de oxígeno"
                  control={form.control}
                >
                  <GasOxygenPercentageField
                    name='oxygen-percentage-reading-field'
                    label="Análisis"
                  />
                  <TankPressureField
                    name='oxygen-pressure-field'
                    label="Presión"
                  />
                </ChecklistStep>
                <ChecklistStep
                  description="Analisis y presión de la botella de diluyente"
                  name="check_diluent_percentage_and_pressure"
                  control={form.control}
                >
                  <GasOxygenPercentageField
                    name='diluent-percentage-reading-field'
                    label="Análisis"
                  />
                  <TankPressureField
                    name='diluent-pressure-field'
                    label="Presión"
                  />
                </ChecklistStep>
              </ChecklistSection>
              <ChecklistSection
                title="Montaje rebreather"
                subtitle="Putting it altoghether"
              >
                <ChecklistStep
                  description="Tiempo restante de la vida de la cal reemplazar si es necesario"
                  name="check_carbon_dioxide_absorbent_remaining_time"
                  control={form.control}
                >
                  <MinutesField
                    name="carbon_dioxide_absorbent_remaining_time_field"
                    label="Tiempo restante"
                  />
                </ChecklistStep>
                <ChecklistStep
                  description="Instalar las botellas en la unidad y colocar los pasadores"
                  name="install_diluent_and_oxygen_tanks"
                  control={form.control}
                />
                <ChecklistStep
                  description="Instalar el soporte (trampa de agua) e introducir el canister dentro del tubo"
                  name="install_water_trap_and_cannister"
                  control={form.control}
                />
                <ChecklistStep
                  description="Revisar las toricas y piezas del cabezal, engrasar con grasa compatible O2 y montar el cabezal"
                  name="check_canister_head_grommets"
                  control={form.control}
                />
                <ChecklistStep
                  description="Instalar contrapulmones y asegurarnos que quedan fijados (clack)"
                  name="install_counterlungs"
                  control={form.control}
                />
                <ChecklistStep
                  description="Instalar soporte de la tapa de los contrapulmones"
                  name="install_counterlungs_cover"
                  control={form.control}
                />
                <ChecklistStep
                  description="Instalar conectores electricos de los controladores y conectar latiguillos de ADV, MAV O2 y MAV DIL"
                  name="install_head_connectors_and_hoses"
                  control={form.control}
                />
                <ChecklistStep
                  description="Revisar traqueas y hacer prueba estereo (mirar las dos direcciones del gas)"
                  name="check_breathing_hoses_stereo"
                  control={form.control}
                />
                <ChecklistStep
                  description="Revisar tóricas de las tráqueas"
                  name="check_breathing_hoses_grommets"
                  control={form.control}
                />
                <ChecklistStep
                  description="Colocar cable HUD a la tráquea"
                  name="install_heads_up_display_cable"
                  control={form.control}
                />
                <ChecklistStep
                  description="Realizar test negativo"
                  name="check_negative_test"
                  control={form.control}
                />
              </ChecklistSection>
              <ChecklistSection
                title="Pruebas de estanqueidad"
                subtitle="Not a single leak"
              >
                <ChecklistStep
                  description="Test negativo: Poner el equipo en presion negativa mirar si es estanco o no tiene fugas"
                  name="check_negative_seal_test"
                  control={form.control}
                />
                <ChecklistStep
                  description="Test positivo: Dar presión al equipo, comprobar que la válvula de sobrepresión funciona y no tiene fugas"
                  name="check_positive_seal_test"
                  control={form.control}
                />
                <ChecklistStep
                  description="Revisar la boquilla de la tráquea y que no tenga fugas"
                  name="check_mouthpiece_seal_test"
                  control={form.control}
                />
              </ChecklistSection>
              <ChecklistSection
                title="Comprobar y calibrar oxigeno"
                subtitle="Know what you breath"
              >
                <ChecklistStep
                  description="Encender el controlador Shearwater configurar setpoint a 0,7 ppO2 y encender el backup. Comprobar que ambos funcionan. Comprobar bateria interna y externa"
                  name="check_main_and_backup_computers"
                  control={form.control}
                />
                <ChecklistStep
                  description="Abrir O2, comprobar presión manómetro y la adición manual"
                  name="check_oxygen_pressure_and_manual_addition"
                  control={form.control}
                />
                <ChecklistStep
                  description="Llenar el circuito con O2 realizando 3 test negativos"
                  name="check_oxygen_flush"
                  control={form.control}
                />
                <ChecklistStep
                  description="Calibrar controlador principal y secundario"
                  name="check_main_and_backup_calibration"
                  control={form.control}
                />
                <ChecklistStep
                  description="Configurar setpoint a 0,19 ppO2"
                  name="check_setpoint"
                  control={form.control}
                />
                <ChecklistStep
                  description="Cerrar O2, verificar manómetro y válvula flujo constante, mirar el tiempo que tarda en perder 10bar (control de la válvula de flujo constante)"
                  name="check_constant_mass_valve"
                  control={form.control}
                />
              </ChecklistSection>
              <ChecklistSection
                title="Comprobar y calibrar diluyente"
                subtitle="Know what you breath"
              >
                <ChecklistStep
                  description="Abrir diluyente, comprobar manómetro y adición manual"
                  name="check_diluent_pressure_and_manual_addition"
                  control={form.control}
                />
                <ChecklistStep
                  description="Comprobar ADV si funciona e inflar ala al máximo"
                  name="check_automatic_diluent_valve"
                  control={form.control}
                />
                <ChecklistStep
                  description="Limpiar circuito con diluyente, comprobar la ppO2 esta entre 0,20/0,22"
                  name="check_diluent_flush"
                  control={form.control}
                />
                <ChecklistStep
                  description="Cerrar el diluyente y comprobar con el manómetro que no hay fugas"
                  name="check_diluent_leakage"
                  control={form.control}
                />
                <ChecklistStep
                  description="Purgar el diluyente"
                  name="check_diluent_purge"
                  control={form.control}
                />
              </ChecklistSection>
              <ChecklistSection
                title="Bailout"
                subtitle="Checking your safety net"
              >
                <ChecklistStep
                  description="Abrir el bailout, comprobar funcionamiento y presión"
                  name="check_bailout_pressure"
                  control={form.control}
                />
                <ChecklistStep
                  description="Controlar las conexiones y cerrar bailout"
                  name="check_bailout_connections"
                  control={form.control}
                />
              </ChecklistSection>
              <ChecklistSection
                title="Comprobaciones generales"
                subtitle="Let's get ready to dive"
              >
                <ChecklistStep
                  description="Lista de gases para el buceo, tiempo restante de cal"
                  name="check_dive_gases_and_sorbent_time"
                  control={form.control}
                />
                <ChecklistStep
                  description="Conectar ordenador"
                  name="check_dive_computer_connection"
                  control={form.control}
                />
                <ChecklistStep
                  description="Control de material para el buceo"
                  name="check_dive_gear"
                  control={form.control}
                />
              </ChecklistSection>
            </div>
            <div className="flex justify-end w-full">
              <Button type="submit">
                Confirmar compobaciones
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
)
}
