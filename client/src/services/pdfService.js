import { PDFDocument, StandardFonts } from "pdf-lib";
/* import logoImageUrl from "../assets/images/almacen_logo4.png"; */

const currentDate = new Date().toLocaleString(); // Obtener la fecha y hora actuales en un formato legible

// Función auxiliar para cargar imágenes
/* const loadImage = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load image at ${url}`);
  }
  const imageBytes = await response.arrayBuffer();
  return imageBytes;
}; */

export const generatePDF = async (formData, userName) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([
      612, 792,
    ]);

    /* const logoImageBytes = await loadImage(logoImageUrl);
    const logoImage = await pdfDoc.embedPng(logoImageBytes); */
    const { width, height } = page.getSize();

    // Dibujar la imagen en el PDF como marca de agua
   /*  page.drawImage(logoImage, {
      x: 0,
      y: 300,
      width: 600,
      height: 196,
      opacity: 0.1, // Ajustar la opacidad para la marca de agua
    }); */

    // Dibujar el logo en la parte superior
   /*  const scaledLogo = logoImage.scale(0.4); // Ajustar el tamaño del logo para la parte superior
    page.drawImage(logoImage, {
      x: 50,
      y: height - scaledLogo.height - 50, // Ajustar la posición del logo en la parte superior
      width: scaledLogo.width,
      height: scaledLogo.height,
    }); */

    // Ajustar el punto de partida para el texto
    const textYPosition = height - scaledLogo.height - 140;

    const {
      orderNumber,
      creationDateTime,
      idNumber,
      customerName,
      BLNumber,
      ticaSequence,
      customsNumber,
      commodity,
      quantity,
      packageType,
      storageLocations,
      truckCo,
      truckDriver,
      truckId,
      createdBy,
    } = formData;

    const creationDate = new Date(creationDateTime);

    // Función para agregar un cero delante de los números menores que 10
    const addLeadingZero = (number) => (number < 10 ? "0" + number : number);

    // Obtener los componentes de fecha y hora
    const day = addLeadingZero(creationDate.getDate());
    const month = addLeadingZero(creationDate.getMonth() + 1); // Se suma 1 porque los meses en JavaScript van de 0 a 11
    const year = creationDate.getFullYear();
    const hours = addLeadingZero(creationDate.getHours());
    const minutes = addLeadingZero(creationDate.getMinutes());

    // Construir la cadena de fecha en el formato deseado
    const formattedCreationDate = `${day}-${month}-${year} ${hours}:${minutes} HRS`;

    // Obtener la fecha y hora actual
    const currentDate = new Date();

    // Obtener los componentes de fecha y hora actual
    const currentDay = addLeadingZero(currentDate.getDate());
    const currentMonth = addLeadingZero(currentDate.getMonth() + 1); // Se suma 1 porque los meses en JavaScript van de 0 a 11
    const currentYear = currentDate.getFullYear();
    const currentHours = addLeadingZero(currentDate.getHours());
    const currentMinutes = addLeadingZero(currentDate.getMinutes());

    // Construir la cadena de fecha actual en el formato deseado
    const formattedCurrentDate = `${currentDay}-${currentMonth}-${currentYear} ${currentHours}:${currentMinutes} HRS`;

    // Cargar una fuente estándar
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Definir tamaños de fuente
    const headerFontSize = 20;
    const subHeaderFontSize = 16;
    const textFontSize = 14;

    // Formatear las ubicaciones de almacenamiento
    const formattedStorageLocations = storageLocations.join(", ");

    // Dibujar el texto con diferentes tamaños de fuente
    page.setFont(font);
    page.setFontSize(headerFontSize);
    page.drawText(`Orden de salida: ${orderNumber}`, {
      x: 50,
      y: textYPosition,
    });
    page.setFontSize(subHeaderFontSize);
    page.drawText(`Creada por: ${createdBy}`, {
      x: 50,
      y: textYPosition - 20,
    });
    page.drawText(`Fecha de creación: ${formattedCreationDate}`, {
      x: 50,
      y: textYPosition - 40,
    });

    page.setFontSize(textFontSize);
    page.drawText(`Identificación: ${idNumber}`, { x: 50, y: textYPosition - 100 });
    page.drawText(`Cliente: ${customerName}`, { x: 50, y: textYPosition - 120 });
    page.drawText(`BL Number: ${BLNumber}`, { x: 50, y: textYPosition - 140 });
    page.drawText(`Secuencia TICA: ${ticaSequence}`, { x: 50, y: textYPosition - 160 });
    page.drawText(`Número de Aduana: ${customsNumber}`, {
      x: 50,
      y: textYPosition - 180,
    });
    page.drawText(`Mercancía: ${commodity}`, { x: 50, y: textYPosition - 200 });
    page.drawText(`Cantidad: ${quantity}`, {
      x: 50,
      y: textYPosition - 220,
    });
    page.drawText(`Tipo de Bultos: ${packageType}`, {
      x: 50,
      y: textYPosition - 240,
    });
    page.drawText(`Ubicación en almacén: ${formattedStorageLocations}`, {
      x: 50,
      y: textYPosition - 260,
    });
    page.drawText(`Transportista: ${truckCo}`, {
      x: 50,
      y: textYPosition - 280,
    });
    page.drawText(`Placa: ${truckId}`, { x: 50, y: textYPosition - 300 });
    page.drawText(`Conductor: ${truckDriver}`, {
      x: 50,
      y: textYPosition - 320,
    });
    page.drawText(`Boleta generada por: ${userName}`, {
      x: 50,
      y: textYPosition - 380,
    });
    page.drawText(`${formattedCurrentDate}`, {
      x: 300,
      y: textYPosition - 380,
    });

    // Guardar el PDF en memoria como un blob
    const pdfBytes = await pdfDoc.save();
    const pdfURL = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );

    return pdfURL;
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw new Error("Error al generar el PDF");
  }
};
