import React, { forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Ticket = forwardRef(({ numeroPedido, tipoVenta, datosVenta, items }, ref) => {
  const fecha = new Date();
  const fechaStr = fecha.toLocaleDateString("es-BO");
  const horaStr = fecha.toLocaleTimeString("es-BO");

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "monospace",
        fontSize: "18px",
        width: "100%", // ancho estándar de 58mm
        padding: "5px",
        minHeight: "100vh", // ocupa toda la página
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // asegura contenido arriba
        alignItems: "stretch",
      }}
    >
      {/* Encabezado */}
      <div style={{ textAlign: "center", marginBottom: "5px", width: "100%" }}>
        <strong>PEDIDO N. {numeroPedido}</strong>
      </div>

      {/* Fecha y hora */}
      <div style={{ fontSize: "11px",marginLeft:"20px", marginBottom: "5px", width: "100%" }}>
        Fecha: {fechaStr}  Hora: {horaStr}
      </div>

      {/* Línea superior */}
      <div style={{ borderTop: "2px solid black", margin: "6px 0", width: "100%" }} />

      {/* Encabezado columnas */}
      <div
        style={{
          display: "flex",
          fontSize: "14px",
          marginBottom: "4px",
          width: "100%",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ width: "50px", textAlign: "right", paddingRight: "10px" }}>
          Cant
        </span>
        <span style={{ flex: 1, textAlign: "left", paddingLeft:"20px" }}>Descripción</span>
      </div>
        
      <div style={{ borderBottom: "1px dashed black", margin: "0 auto", width: "100%" }} />
      {/* Productos */}
      {items.map((item, idx) => {
        const descripcion =
          item.tipo === "entera"
            ? `${item.prod1} ${item.size}`
            : `${item.prod1}/${item.prod2 || "??"} ${item.size}`;

        return (
          <div
            key={idx}
            style={{
              display: "flex",
              fontSize: "22px",
              fontWeight: "bold",
              marginBottom: "2px",
              marginTop: "5px",
              width: "100%",
            }}
          >
            <span style={{ width: "50px", textAlign: "right", paddingRight: "10px" }}>
              {item.cantidad}
            </span>
            <span style={{paddingLeft:"20px"}}>{"#"}</span>
            <span style={{ flex: 1, textAlign: "left"}}>{descripcion}</span>
          </div>
        );
      })}


      {/* Línea inferior */}
      <div style={{ borderTop: "2px solid black", margin: "6px 0", width: "100%" }} />

      {/* Parte inferior según modalidad */}
      {tipoVenta === "mesa" && (
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "18px",
            width: "100%",
          }}
        >
          MESA {datosVenta.numeroMesa} - {datosVenta.descripcion || "-"}
        </div>
      )}

      {tipoVenta === "llevar" && (
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "18px",
            width: "100%",
          }}
        >
          PARA LLEVAR <br />
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "11px",
              width: "100%",
            }}
          >
            Cliente: {datosVenta.nombreCliente || "-"}
          </div>
        </div>
      )}

      {tipoVenta === "delivery" && (
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "18px",
            width: "100%",
          }}
        >
          DELIVERY
          <div
            style={{
              textAlign: "left",
              marginTop: "6px",
              fontSize: "12px",
              width: "100%",
            }}
          >
            Cliente: {datosVenta.nombreCliente || "-"} <br />
            Tel: {datosVenta.telefono || "-"} <br />
            Dirección: {datosVenta.direccion || "-"}
          </div>
        </div>
      )}
    </div>
  );
});

export default function TicketConImpresion(props) {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page { size: 58mm auto; margin: 0; }
      body { margin: 0; padding: 0; }
      #root { margin: 0; padding: 0; }
    `,
  });

  return (
    <>
      <Ticket ref={componentRef} {...props} />
      <button onClick={handlePrint}>Imprimir Ticket</button>
    </>
  );
}
