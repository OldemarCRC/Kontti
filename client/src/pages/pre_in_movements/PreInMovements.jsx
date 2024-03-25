import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import * as XLSX from "xlsx";
import "./pre_in_movements.css";
import uploadDataToMongoDB from "../../services/uploadService.js";
import calculateCheckDigit from "../../services/calculateCheckDigit.js";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";

function PreInMovements() {
  const { user } = useContext(AuthContext);
  const [jsonData, setJsonData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Verifica si el usuario ha iniciado sesión al montar el componente y cada vez que el valor de 'user' cambie
  useEffect(() => {
    if (!user) {
      // Si 'user' es null o undefined, redirige al inicio de sesión o a cualquier otra página
      navigate("/"); // Ajusta esta ruta según sea necesario
    }
  }, [user, navigate]); // Incluye 'navigate' en la lista de dependencias para evitar advertencias

  const handleNavigate = (path) => {
    navigate(path);
  };
  {
    /*Aqui se ajusta de acuerdo a los encabezados  del archivo excel*/
  }
  {
  }
  const columnMapping = {
    Tam: "containerSize",
    Tipo: "containerType",
    contenido: "fullOrEmpty",
    March: "sealNumber_1",
    Peso: "weight",
    Oper: "customer",
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, {
        type: "binary",
        cellDates: true,
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Extracción de valores de celdas específicas
      const originOrDestination = worksheet["C5"] ? worksheet["C5"].v : "";
      const manifestNr = worksheet["C6"] ? worksheet["C6"].v : "";
      const containerNr =
        worksheet["B11"] + worksheet["C11"]
          ? worksheet["B11"] + worksheet["C11"].v
          : "";
      /* const json = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
      }); */
      const json = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: "A12",
        raw: false,
      }); // Ajusta el rango y el slice según sea necesario

      const mappedJson = json.map((row) => {
        const mappedRow = {
          gateInOrGateOut: "In", // Valor fijo para todos los registros
          originOrDestination: originOrDestination,
          manifestNr: manifestNr,
          pref: row[1],
          containerNumber: containerNr,
          /* containerNumber: `${row[1]}${row[2]}`, */
          sealNumber_1: row[3],
          weight: row[6],
          customer: row[9],
        };
        Object.keys(row).forEach((key) => {
          const mappedKey = columnMapping[key];
          if (mappedKey) {
            mappedRow[mappedKey] = row[key];
          }
        });

        // Concatenación específica para 'pref' y 'number' se realiza aquí
        // Verifica si las propiedades originales 'pref' y 'number' existen
        /*     if (row.hasOwnProperty("Pref") && row.hasOwnProperty("No. Cont")) {
          // Aquí concatenas 'pref' y 'number' y asignas a 'containerNumber'
          mappedRow["containerNumber"] = `${row.Pref}${row.No.Cont}`;

          const numberString = String(row.No.Cont);
          const actualDigit = parseInt(numberString.slice(-1), 10);
          mappedRow["digitVerification"] = {
            actualDigit,
            expectedDigit: null, // Esto se definirá según tu lógica de negocio
            matches: false, // Esto se puede actualizar más tarde cuando verifiques los dígitos
          };
        } */

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
      <div className="table-buttons">
        <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
        <button onClick={verifyCheckDigits}>Check Digit validation</button>
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
              <th>In/Out</th>
              <th>Size</th>
              <th>Type</th>
              <th>full/Empty</th>
              <th>origin/destination</th>
              <th>seal</th>
              <th>manifest number</th>
              <th>actualDigit</th>
              <th>expectedDigit</th>
              <th>matches</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {jsonData.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.customer}</td>
                <td>{row.containerNumber}</td>
                <td>{row.gateInOrGateOut}</td>
                <td>{row.containerSize}</td>
                <td>{row.containerType}</td>
                <td>{row.fullOrEmpty}</td>
                <td>{row.originOrDestination}</td>
                <td>{row.sealNumber_1}</td>
                <td>{row.manifestNr}</td>
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
        {/* </div> */}
      </div>
      <Footer />
    </>
  );
}
export default PreInMovements;
