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
            <div className="grid w-full gap-4 grid-cols-2">
              <NameField/>
              <DateField/>
            </div>
            <div className='mb-4'>
              <ChecklistSection
                title="Petrel DiveCan"
                subtitle="The DiveCan is cool"
              >
                <ChecklistStep
                  name="check_controller_battery"
                  description="Conectar controlador (Shearwater) y comprobar la batería"
                >
                  <BatteryVoltsField
                    name="internal_battery_volts_"
                    label="Batería interna"
                  />
                  <BatteryVoltsField
                    name="external_battery_volts_field"
                    label="Batería externa"
                  />
                </ChecklistStep>
                <ChecklistStep
                  name="check_oxygen_cells_voltage"
                  description="Voltaje de las célula de oxígeno en aire >9mv"
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
                  name="check_oxygen_cells_installation_date"
                  description="Comprobar fecha de instalación las células, máximo 6 meses y cambiar"
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
                  name="check_dive_parameters"
                  description="Verificar los parametros de buceo"
                />
              </ChecklistSection>
              <ChecklistSection
                title="Gas"
                subtitle="Always know what you breath"
              >
                <ChecklistStep
                  name="check_oxygen_percentage_and_pressure"
                  description="Análisis y presión de la botella de oxígeno"
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
                  name="check_diluent_percentage_and_pressure"
                  description="Analisis y presión de la botella de diluyente"
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
                  name="check_carbon_dioxide_absorbent_remaining_time"
                  description="Tiempo restante de la vida de la cal reemplazar si es necesario"
                >
                  <MinutesField
                    name="carbon_dioxide_absorbent_remaining_time_field"
                    label="Tiempo restante"
                  />
                </ChecklistStep>
                <ChecklistStep
                  name="install_diluent_and_oxygen_tanks"
                  description="Instalar las botellas en la unidad y colocar los pasadores"
                />
                <ChecklistStep
                  name="install_water_trap_and_cannister"
                  description="Instalar el soporte (trampa de agua) e introducir el canister dentro del tubo"
                />
                <ChecklistStep
                  name="check_cannister_head_grommets"
                  description="Revisar las toricas y piezas del cabezal, engrasar con grasa compatible O2 y montar el cabezal"
                />
                <ChecklistStep
                  name="install-counterlungs"
                  description="Instalar contrapulmones y asegurarnos que quedan fijados (clack)"
                />
                <ChecklistStep
                  name="install_counterlungs_cover"
                  description="Instalar soporte de la tapa de los contrapulmones"
                />
                <ChecklistStep
                  name="install_head_connectors_and_hoses"
                  description="Instalar conectores electricos de los controladores y conectar latiguillos de ADV, MAV O2 y MAV DIL"
                />
                <ChecklistStep
                  name="check_breathing_hoses_stereo"
                  description="Revisar traqueas y hacer prueba estereo (mirar las dos direcciones del gas)"
                />
                <ChecklistStep
                  name="check_breathing_hoses_grommets"
                  description="Revisar tóricas de las tráqueas"
                />
                <ChecklistStep
                  name="install_heads_up_display_cable"
                  description="Colocar cable HUD a la tráquea"
                />
                <ChecklistStep
                  name="check_negative_test"
                  description="Realizar test negativo"
                />
              </ChecklistSection>
              <ChecklistSection
                title="Pruebas de estanqueidad"
                subtitle="Not a single leak"
              >
                <ChecklistStep
                  name="check_negative_seal_test"
                  description="Test negativo: Poner el equipo en presion negativa mirar si es estanco o no tiene fugas"
                />
                <ChecklistStep
                  name="check_positive_seal_test"
                  description="Test positivo: Dar presión al equipo, comprobar que la válvula de sobrepresión funciona y no tiene fugas"
                />
                <ChecklistStep
                  name="check_mouthpiece_seal_test"
                  description="Revisar la boquilla de la tráquea y que no tenga fugas"
                />
              </ChecklistSection>
              <ChecklistSection
                title="Comprobar y calibrar oxigeno"
                subtitle="Know what you breath"
              >
                <ChecklistStep
                  name="check_main_and_backup_computers"
                  description="Encender el controlador Shearwater configurar setpoint a 0,7 ppO2 y encender el backup. Comprobar que ambos funcionan. Comprobar bateria interna y externa"
                />
                <ChecklistStep
                  name="check_oxygen_pressure_and_manual_addition"
                  description="Abrir O2, comprobar presión manómetro y la adición manual"
                />
                <ChecklistStep
                  name="check_oxygen_flush"
                  description="Llenar el circuito con O2 realizando 3 test negativos"
                />
                <ChecklistStep
                  name="check_main_and_backup_calibration"
                  description="Calibrar controlador principal y secundario"
                />
                <ChecklistStep
                  name="check_setpoint"
                  description="Configurar setpoint a 0,19 ppO2"
                />
                <ChecklistStep
                  name="check_constant_mass_valve"
                  description="Cerrar O2, verificar manómetro y válvula flujo constante, mirar el tiempo que tarda en perder 10bar (control de la válvula de flujo constante)"
                />
              </ChecklistSection>
              <ChecklistSection
                title="Comprobar y calibrar diluyente"
                subtitle="Know what you breath"
              >
                <ChecklistStep
                  name="check_diluent_pressure_and_manual_addition"
                  description="Abrir diluyente, comprobar manómetro y adición manual"
                />
                <ChecklistStep
                  name="check_automatic_diluent_valve"
                  description="Comprobar ADV si funciona e inflar ala al máximo"
                />
                <ChecklistStep
                  name="check_diluent_flush"
                  description="Limpiar circuito con diluyente, comprobar la ppO2 esta entre 0,20/0,22"
                />
                <ChecklistStep
                  name="check_diluent_leakage"
                  description="Cerrar el diluyente y comprobar con el manómetro que no hay fugas"
                />
                <ChecklistStep
                  name="check_diluent_purge"
                  description="Purgar el diluyente"
                />
              </ChecklistSection>
              <ChecklistSection
                title="Bailout"
                subtitle="Checking your safety net"
              >
                <ChecklistStep
                  name="check_bailout_pressure"
                  description="Abrir el bailout, comprobar funcionamiento y presión"
                />
                <ChecklistStep
                  name="check_bailout_connections"
                  description="Controlar las conexiones y cerrar bailout"
                />
              </ChecklistSection>
              <ChecklistSection
                title="Comprobaciones generales"
                subtitle="Let's get ready to dive"
              >
                <ChecklistStep
                  name="check_dive_gases_and_sorbent_time"
                  description="Lista de gases para el buceo, tiempo restante de cal"
                />
                <ChecklistStep
                  name="check_dive_computer_connection"
                  description="Conectar ordenador"
                />
                <ChecklistStep
                  name="check_dive_gear"
                  description="Control de material para el buceo"
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
