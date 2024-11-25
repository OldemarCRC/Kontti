import { PDFDocument, StandardFonts } from "pdf-lib";
import logoImageUrl from "../assets/images/kontti_logo.png";

const loadImage = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load image at ${url}`);
  }
  const imageBytes = await response.arrayBuffer();
  return imageBytes;
};

export const generatePDF = async (formData, userName) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);

    const logoImageBytes = await loadImage(logoImageUrl);
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const { height } = page.getSize();

    // Dibujar la imagen en el PDF como marca de agua
    page.drawImage(logoImage, {
      x: 0,
      y: 300,
      width: 600,
      height: 196,
      opacity: 0.1, // Ajustar la opacidad para la marca de agua
    });

    // Dibujar el logo en la parte superior
    const scaledLogo = logoImage.scale(0.4); // Ajustar el tamaño del logo para la parte superior
    page.drawImage(logoImage, {
      x: 50,
      y: height - scaledLogo.height - 50, // Ajustar la posición del logo en la parte superior
      width: scaledLogo.width,
      height: scaledLogo.height,
    });

    // Ajustar el punto de partida para el texto
    const textYPosition = height - scaledLogo.height - 140;

    const {
      orderNumber,
      customerName,
      manifestNumber,
      containerNumber,
      containerSize,
      containerType,
      commodity,
      weight,
      sealNumber_1,
      sealNumber_2,
      temperature,
      ventilation,
      locationInTerminal,
      truckId,
      truckCo,
      truckDriver,
      consigneeName,
      destination,
      createdBy,
      creationDateTime,
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

    // Dibujar el texto con diferentes tamaños de fuente
    page.setFont(font);
    page.setFontSize(headerFontSize);
    page.drawText(`Dispatch Order: ${orderNumber}`, {
      x: 50,
      y: textYPosition,
    });
    page.setFontSize(subHeaderFontSize);
    page.drawText(`Created by: ${createdBy}`, {
      x: 50,
      y: textYPosition - 20,
    });
    page.drawText(`Creation Date: ${formattedCreationDate}`, {
      x: 50,
      y: textYPosition - 40,
    });

    page.setFontSize(textFontSize);
    page.drawText(`Container Number: ${containerNumber}`, {
      x: 50,
      y: textYPosition - 100,
    });
    page.drawText(`${containerSize}`, {
      x: 300,
      y: textYPosition - 100,
    });
    page.drawText(`${containerType}`, {
      x: 320,
      y: textYPosition - 100,
    });
    page.drawText(`Seal 1: ${sealNumber_1}`, {
      x: 360,
      y: textYPosition - 100,
    });
    page.drawText(`Seal 2: ${sealNumber_2}`, {
      x: 500,
      y: textYPosition - 100,
    });
    page.drawText(`Customer: ${customerName}`, {
      x: 50,
      y: textYPosition - 120,
    });
    page.drawText(`Consignee: ${consigneeName}`, {
      x: 50,
      y: textYPosition - 140,
    });
    page.drawText(`Destination: ${destination}`, {
      x: 50,
      y: textYPosition - 160,
    });
    page.drawText(`Manifest Number: ${manifestNumber}`, {
      x: 50,
      y: textYPosition - 180,
    });
    page.drawText(`Commodity: ${commodity}`, { x: 50, y: textYPosition - 200 });
    page.drawText(`Weight: ${weight}`, {
      x: 50,
      y: textYPosition - 220,
    });
    page.drawText(`Temperature: ${temperature}`, {
      x: 50,
      y: textYPosition - 240,
    });
    page.drawText(`Ventilation: ${ventilation}`, {
      x: 200,
      y: textYPosition - 240,
    });
    page.drawText(`Location in Terminal: ${locationInTerminal}`, {
      x: 50,
      y: textYPosition - 260,
    });
    page.drawText(`Carrier: ${truckCo}`, {
      x: 50,
      y: textYPosition - 280,
    });
    page.drawText(`License Plate: ${truckId}`, { x: 50, y: textYPosition - 300 });
    page.drawText(`Driver: ${truckDriver}`, {
      x: 50,
      y: textYPosition - 320,
    });
    page.drawText(`Slip Generated by: ${userName}`, {
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
    console.error("Error generating PDF:", error);
    throw new Error("Error generating PDF");
  }
};