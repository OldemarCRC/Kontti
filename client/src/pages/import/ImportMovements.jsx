import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./import_movements.css";
import uploadDataToMongoDB from "../../services/uploadService.js";
import calculateCheckDigit from "../../services/calculateCheckDigit.js";
import Footer from  '../../components/footer/Footer';
import Header from "../../components/header/Header";

function ImportMovements() {
  const [jsonData, setJsonData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);


  {/*Aqui se ajusta de acuerdo a los encabezados  del archivo excel*/}
  const columnMapping = {
    nav: "customer",
    plate: "truckID",
    transport: "truckCo",
    "in/out": "gateInOrGateOut",
    size: "containerSize",
    type: "containerType",
    "empty/full": "fullOrEmpty",
    date: "date",
    time:"time",
    "origin/destination": "originOrDestination",
    TIR:"TIRNumber",
    "seal 1": "sealNumber",
    temp:"temperature",
    vent:"ventilation",
    location:"locationInTerminal",
    notes:"notes"
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary", cellDates: true }); // Activar cellDates para manejar fechas
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: "yyyy-mm-dd" }); // Configurar el formato de fecha
      const mappedJson = json.map((row) => {
        const mappedRow = {};
        Object.keys(row).forEach((key) => {
          const mappedKey = columnMapping[key];
          if (mappedKey) {
            mappedRow[mappedKey] = row[key];
          }
        });
//En la hoja de excel los datos en la columna seal 1 estan en formato General, pero 
//si hay solo numeros en algunas casillas y combinacion de letras y numeros en otras
//JavaScript manejara esos datos de forma dif, unos serán texto y otros numeros,
//pero nuestro modelo para base de datos establece este campo como String, y dara error
//si el valor es un numero. 
      
        // Asume que 'date' y 'time' ya están en un formato adecuado gracias a { cellDates: true, dateNF: "yyyy-mm-dd" }
        // Ahora necesitas combinarlos en 'dateAndTime'
        if (mappedRow.date && mappedRow.time) {
          // Convertir 'time' a horas y minutos si es necesario
          const timeParts = mappedRow.time.split(":").map(part => parseInt(part, 10));
          const date = new Date(mappedRow.date);
          date.setHours(timeParts[0], timeParts[1] || 0, 0, 0); // Ajustar la fecha con la hora y minutos
          mappedRow.dateAndTime = date.toISOString(); // Almacenar como ISOString o en el formato que prefieras
        }
        
        // Eliminar las propiedades 'date' y 'time' si ya no se necesitan
        delete mappedRow.date;
        delete mappedRow.time;

        // Concatenación específica para 'pref' y 'number' se realiza aquí
        // Verifica si las propiedades originales 'pref' y 'number' existen
        if (row.hasOwnProperty("pref") && row.hasOwnProperty("number")) {
          // Aquí concatenas 'pref' y 'number' y asignas a 'containerNumber'
          mappedRow["containerNumber"] = `${row.pref}${row.number}`;

          const numberString = String(row.number);
          const actualDigit = parseInt(numberString.slice(-1), 10);
          mappedRow["digitVerification"] = {
            actualDigit,
            expectedDigit: null, // Esto se definirá según tu lógica de negocio
            matches: false, // Esto se puede actualizar más tarde cuando verifiques los dígitos
          };
        }

        // Procesamiento para 'locationInTerminal'
        if (row.location) {
          const location = row.location;
          mappedRow["locationInTerminal"] = {
            zone: location.substring(0, 1),
            stack: parseInt(location.substring(1, 2), 10),
            column: location.substring(2, 3),
            height: parseInt(location.substring(3, 4), 10),
          };
        }

        return mappedRow;
      });
      setJsonData(mappedJson);
    };
    reader.readAsBinaryString(file);
  };

  // Nueva función para manejar la carga de datos
  const handleUpload = async () => {
    setIsUploading(true); // Inicia el estado de carga
    try {
      const result = await uploadDataToMongoDB(jsonData); // Llama a la función de carga con los datos JSON
      alert("¡Datos cargados con éxito!"); // Alerta genérica de éxito
    } catch (error) {
      // Maneja cualquier error que ocurra durante la carga de manera genérica
      alert("Hubo un error al cargar los datos."); // Mensaje de error genérico para el usuario
    } finally {
      setIsUploading(false); // Restablece el estado de carga independientemente del resultado
    }
  };
  

  const verifyCheckDigits = () => {
    try {
      const updatedData = jsonData.map((row) => {
        if (row.containerNumber) {
          const expectedDigit = calculateCheckDigit(row.containerNumber);
          // Asegúrate de ajustar esta parte según cómo estás almacenando el dígito esperado en tus objetos
          if (row.digitVerification) {
            row.digitVerification.expectedDigit = expectedDigit;
            // Aquí también podrías calcular si el dígito actual y el esperado coinciden y actualizar `matches` en consecuencia
            row.digitVerification.matches =
              parseInt(row.digitVerification.actualDigit, 10) ===
              parseInt(expectedDigit, 10);
          }
        }
        return row;
      });
      setJsonData(updatedData);
    } catch (error) {
      console.error("Error checking digits: ", error);
    }
  };

  return (
    <>
    <Header />
    <div className="container-excel-to-json">
      <div className="table-buttons">
        <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
        <button onClick={verifyCheckDigits}>
          Check Digit validation
        </button>
        <button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Cargando..." : "Cargar Datos en MongoDB"}
        </button>
        
      </div>

      <div className="container-table">
        <table>
          <thead>
            <tr>
              {/* Ajustar encabezados segun los datos */}
              <th></th>
              <th>Customer</th>
              <th>Container Nr</th>
              <th>Truck ID</th>
              <th>Truck Co</th>
              <th>In/Out</th>
              <th>Size</th>
              <th>Type</th>
              <th>full/Empty</th>
              <th>dateAndTime</th>
              <th>origin/destination</th>
              <th>seal</th>
              <th>location</th>
              <th>customs number</th>
              <th>actualDigit</th>
              <th>expectedDigit</th>
              <th>matches</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {jsonData.map((row, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{row.customer}</td>
                <td>{row.containerNumber}</td>
                <td>{row.truckID}</td>
                <td>{row.truckCo}</td>
                <td>{row.gateInOrGateOut}</td>
                <td>{row.containerSize}</td>
                <td>{row.containerType}</td>
                <td>{row.fullOrEmpty}</td>
                <td>{row.dateAndTime}</td>
                <td>{row.originOrDestination}</td>
                <td>{row.sealNumber}</td>
                <td>{`${row.locationInTerminal?.zone}${row.locationInTerminal?.stack}${row.locationInTerminal?.column}${row.locationInTerminal?.height}`}</td>
                <td>{row.digitVerification?.actualDigit}</td>
                <td>{row.digitVerification?.expectedDigit}</td>
                <td
                  style={{
                    color: row.digitVerification?.matches ? "inherit" : "red",
                  }}
                >
                  {row.digitVerification?.matches ? "True" : "False"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* {console.log(typeof (jsonData[0].digitVerification?.matches))} */}
        {/* {console.log(typeof (jsonData[0].truckID))} Para revisar los tipos de datos y que coincidan con los que tenemos en los modelos */}
      </div>
    </div>
    <Footer />
    </>
    
  );
}
export default ImportMovements;
