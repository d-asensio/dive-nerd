import * as React from "react"

import {DateField} from "./components/date-field";
import {NameField} from "./components/name-field";
import {ChecklistSection} from "./components/checklist-section";
import {ChecklistStep} from "./components/checklist-step";
import {RebreatherChecklistDisclaimerAlert} from "./components/rebreather-checklist-disclaimer-alert";

export default function SharkChecklist() {
  return (
    <div className="container p-6">
      <div className="max-w-4xl space-y-6 m-auto">
        <RebreatherChecklistDisclaimerAlert />
        <div className="grid w-full gap-4">
          <NameField/>
          <DateField/>
        </div>
        <ChecklistSection
          title="Petrel DiveCan"
          subtitle="The DiveCan is cool"
        >
          <ChecklistStep
            id="check-controller-battery"
            description="Conectar controlador (Shearwater) y comprobar la batería"
          />
          <ChecklistStep
            id="check-oxygen-cells-voltage"
            description="Voltaje de la célula en aire >9mv"
          />
          <ChecklistStep
            id="check-oxygen-cells-installation-date"
            description="Comprobar fecha de instalación las células, máximo 6 meses y cambiar"
          />
          <ChecklistStep
            id="check-dive-parameters"
            description="Verificar los parametros de buceo"
          />
        </ChecklistSection>
        <ChecklistSection
          title="Gas"
          subtitle="Know what you breath"
        >
          <ChecklistStep
            id="check-oxygen-percentage-and-pressure"
            description="Analizar y presión de O2"
          />
          <ChecklistStep
            id="check-diluent-percentage-and-pressure"
            description="Analizar y presión del diluyente"
          />
        </ChecklistSection>
        <ChecklistSection
          title="Instalación rebreather"
          subtitle="Putting it altoghether"
        >
          <ChecklistStep
            id="check-carbon-dioxide-absorbent-remaining-time"
            description="Tiempo restante de la vida de la cal reemplazar si es necesario"
          />
          <ChecklistStep
            id="install-diluent-and-oxygen-tanks"
            description="Instalar las botellas en la unidad y colocar pasadores"
          />
          <ChecklistStep
            id="install-water-trap-and-cannister"
            description="Instalar el soporte (trampa de agua) y el canister dentro del tubo"
          />
          <ChecklistStep
            id="check-cannister-head-grommets"
            description="Revisar toricas y piezas cabezal, engrasar con grasa compatible O2 y montar el cabezal"
          />
          <ChecklistStep
            id="install-counterlungs"
            description="Instalar contrapulmones y asegurarnos que quedan fijados (clack)"
          />
          <ChecklistStep
            id="install-counterlungs-cover"
            description="Instalar soporte tapa contrapulmones"
          />
          <ChecklistStep
            id="install-head-connectors-and-hoses"
            description="Instalar conectores electricos de los controladores y conectar latiguillos de ADV, MAV O2 y MAV DIL"
          />
          <ChecklistStep
            id="check-breathing-hoses-stereo"
            description="Revisar traqueas y hacer prueba estereo (mirar las dos direcciones del gas)"
          />
          <ChecklistStep
            id="check-breathing-hoses-grommets"
            description="Revisar tóricas de las tráqueas"
          />
          <ChecklistStep
            id="install-heads-up-display-cable"
            description="Colocar cable HUD a la tráquea"
          />
          <ChecklistStep
            id="check-negative-test"
            description="Realizar test negativo"
          />
        </ChecklistSection>
        <ChecklistSection
          title="Pruebas de estanqueidad"
          subtitle="Not a single leak"
        >
          <ChecklistStep
            id="check-negative-seal-test"
            description="Test negativo: Poner el equipo en presion negativa mirar si es estanco o no tiene fugas"
          />
          <ChecklistStep
            id="check-positive-seal-test"
            description="Test positivo: Dar presión al equipo, comprobar que la válvula de sobrepresión funciona y no tiene fugas"
          />
          <ChecklistStep
            id="check-mouthpiece-seal-test"
            description="Revisar la boquilla de la tráquea y que no tenga fugas"
          />
        </ChecklistSection>
        <ChecklistSection
          title="Comprobar y calibrar oxigeno"
          subtitle="Know what you breath"
        >
          <ChecklistStep
            id="check-main-and-backup-computers"
            description="Encender el controlador Shearwater configurar setpoint a 0,7 ppO2 y encender el backup. Comprobar que ambos funcionan. Comprobar bateria interna y externa"
          />
          <ChecklistStep
            id="check-oxygen-pressure-and-manual-addition"
            description="Abrir O2, comprobar presión manómetro y la adición manual"
          />
          <ChecklistStep
            id="check-oxygen-flush"
            description="Llenar el circuito con O2 realizando 3 test negativos"
          />
          <ChecklistStep
            id="check-main-and-backup-calibration"
            description="Calibrar controlador principal y secundario"
          />
          <ChecklistStep
            id="check-setpoint"
            description="Configurar setpoint a 0,19 ppO2"
          />
          <ChecklistStep
            id="check-constant-mass-valve"
            description="Cerrar O2, verificar manómetro y válvula flujo constante, mirar el tiempo que tarda en perder 10bar (control de la válvula de flujo constante)"
          />
        </ChecklistSection>
        <ChecklistSection
          title="Comprobar y calibrar diluyente"
          subtitle="Know what you breath"
        >
          <ChecklistStep
            id="check-diluent-pressure-and-manual-addition"
            description="Abrir diluyente, comprobar manómetro y adición manual"
          />
          <ChecklistStep
            id="check-automatic-diluent-valve"
            description="Comprobar ADV si funciona e inflar ala al máximo"
          />
          <ChecklistStep
            id="check-diluent-flush"
            description="Limpiar circuito con diluyente, comprobar la ppO2 esta entre 0,20/0,22"
          />
          <ChecklistStep
            id="check-diluent-leakage"
            description="Cerrar el diluyente y comprobar con el manómetro que no hay fugas"
          />
          <ChecklistStep
            id="check-diluent-purge"
            description="Purgar el diluyente"
          />
        </ChecklistSection>
        <ChecklistSection
          title="Bailout"
          subtitle="Checking your safety net"
        >
          <ChecklistStep
            id="check-bailout-pressure"
            description="Abrir el bailout, comprobar funcionamiento y presión"
          />
          <ChecklistStep
            id="check-bailout-connections"
            description="Controlar las conexiones y cerrar bailout"
          />
        </ChecklistSection>
        <ChecklistSection
          title="Comprobaciones generales"
          subtitle="Let's get ready to dive"
        >
          <ChecklistStep
            id="check-dive-gases-and-sorbent-time"
            description="Lista de gases para el buceo, tiempo restante de cal"
          />
          <ChecklistStep
            id="check-dive-computer-connection"
            description="Conectar ordenador"
          />
          <ChecklistStep
            id="check-dive-gear"
            description="Control de material para el buceo"
          />
        </ChecklistSection>
      </div>
    </div>
  )
}
