import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SidebarCategorias from "./componentes/menuComponents/SidebarCategorias";
import ProductosSection from "./componentes/menuComponents/ProductosSection";
import CarritoSection from "./componentes/menuComponents/CarritoSection";
import ModalVenta from "./componentes/ventaDetalleComponents/ModalVenta";
import api from "../../../../api/axios";
import { useAuth } from "../../../../auth/AuthContext";

const obtenerPrecio = (item) => parseFloat(item.price) || 0;

export default function PuntoDeVenta() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ---------------- Estados ----------------
  const [ready, setReady] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [subcategoriasPorCategoria, setSubcategoriasPorCategoria] = useState({});
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSub, setActiveSub] = useState("");
  const [items, setItems] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVenta, setModalVenta] = useState(false);
  const searchInputRef = useRef(null);

  const [cajaVerificada, setCajaVerificada] = useState(false);
  const [cajaAbierta, setCajaAbierta] = useState(false);

  // ---------------- Verificar caja ----------------
  useEffect(() => {
    const verificarCaja = async () => {
      try {
        const res = await api.get("cierres/abiertas/");
        if (res.data && res.data.estado === "ABIERTO") {
          setCajaAbierta(true);
        } else {
          alert("⚠️ No tienes ninguna caja abierta. Debes aperturar una antes de usar el punto de venta.");
          navigate("/caja");
        }
      } catch (err) {
        const status = err.response?.status;
        if (status === 404) {
          alert("⚠️ No tienes ninguna caja abierta actualmente. Dirígete a Caja para aperturar una.");
        } else {
          alert("⚠️ No se pudo verificar el estado de la caja. Revisa tu conexión o inicia sesión nuevamente.");
        }
        navigate("/caja");
      } finally {
        setCajaVerificada(true);
      }
    };
    verificarCaja();
  }, [navigate]);

  // ---------------- Cargar productos iniciales ----------------
  useEffect(() => {
    if (!cajaAbierta) return;
    async function loadData() {
      try {
        const res = await api.get("/menu-precio/");
        const prods = res.data;
        setProducts(prods);

        // Agrupar subcategorías por categoría
        const agrupadas = {};
        prods.forEach((p) => {
          if (!p.category || !p.subcategory) return;
          if (!agrupadas[p.category]) agrupadas[p.category] = [];
          if (!agrupadas[p.category].includes(p.subcategory)) {
            agrupadas[p.category].push(p.subcategory);
          }
        });

        setCategorias(Object.keys(agrupadas));
        setSubcategoriasPorCategoria(agrupadas);

        const firstCat = Object.keys(agrupadas)[0] || "";
        const firstSub = agrupadas[firstCat]?.[0] || "";
        setActiveCategory(firstCat);
        setActiveSub(firstSub);
        setReady(true);
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    }
    loadData();
  }, [cajaAbierta]);

  // ---------------- Reset categoría ----------------
  useEffect(() => {
    if (ready) {
      setActiveSub(subcategoriasPorCategoria[activeCategory]?.[0] || "");
      setSearchTerm("");
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [activeCategory, ready]);

  // ---------------- Funciones del carrito ----------------

  // 🟡 Verificar si el producto tiene ingredientes inactivos antes de agregar
  const handleAddToCart = async (product) => {
    if (product.menu) {
      try {
        const res = await api.get(`/menu-producto/faltantes/${product.menu}/`);
        const faltantes = res.data?.faltantes || [];
        if (faltantes.length > 0) {
          alert(`⚠️ Faltan ingredientes: ${faltantes.join(", ")}.\nPuedes sustituirlos en la parte de ingredientes.`);
        }
      } catch (err) {
        console.warn("Error verificando ingredientes:", err);
      }
    }

    // Agregar producto al carrito
    const nuevoItem = {
      cantidad: 1,
      tipo: "entera",
      prod1: product.code,
      prod2: null,
      category: product.category,
      subcategory: product.subcategory,
      size: product.size,
      price: parseFloat(product.price) || 0,
      name: product.name,
    };
    setItems((prev) => [...prev, nuevoItem]);
  };

  // 🟢 Controlar cantidades según stock disponible
  const updateItem = (index, key, value) => {
    const nuevos = [...items];
    if (key === "cantidad") {
      const item = nuevos[index];
      const producto = products.find((p) => p.code === item.prod1);

      if (producto && producto.controla_stock) {
        const nuevaCantidad = Number(value) || 1;
        if (nuevaCantidad > producto.stock_actual) {
          alert(`⚠️ Solo hay ${producto.stock_actual} unidades de ${producto.name} disponibles.`);
          item.cantidad = producto.stock_actual;
        } else {
          item.cantidad = nuevaCantidad;
        }
      } else {
        item.cantidad = Number(value) || 1;
      }
      nuevos[index] = item;
    } else {
      nuevos[index][key] = value;
    }
    setItems(nuevos);
  };

  const eliminarItem = (index) => setItems(items.filter((_, i) => i !== index));
  const limpiarCarrito = () => {
    setItems([]);
    setDescuento(0);
  };

  // 🔄 Escucha evento global para refrescar productos (tras venta o cambio en menú)
  useEffect(() => {
    const listener = (e) => {
      console.log("🟢 Productos actualizados en tiempo real desde MenuView");
      const nuevosProductos = e.detail || [];
      setProducts(nuevosProductos);

      // 🧠 Actualiza categorías y subcategorías automáticamente
      const agrupadas = {};
      nuevosProductos.forEach((p) => {
        if (!p.category || !p.subcategory) return;
        if (!agrupadas[p.category]) agrupadas[p.category] = [];
        if (!agrupadas[p.category].includes(p.subcategory)) {
          agrupadas[p.category].push(p.subcategory);
        }
      });

      setCategorias(Object.keys(agrupadas));
      setSubcategoriasPorCategoria(agrupadas);
    };

    window.addEventListener("refrescarProductos", listener);
    return () => window.removeEventListener("refrescarProductos", listener);
  }, []);

  // ---------------- Totales ----------------
  const subtotal = items.reduce((acc, i) => acc + obtenerPrecio(i) * i.cantidad, 0);
  const totalPagar = subtotal - subtotal * (descuento / 100);

  // ---------------- Filtro de productos ----------------
  const productosFiltrados = products.filter(
    (p) =>
      p.category === activeCategory &&
      (!activeSub || p.subcategory === activeSub) &&
      (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code?.toLowerCase().includes(searchTerm))
  );

  // ---------------- Render ----------------
  if (!cajaVerificada) {
    return <p>Verificando estado de caja...</p>;
  }

  return (
    <>
      {cajaAbierta ? (
        <div style={{ display: "flex" }}>
          <SidebarCategorias
            categorias={categorias}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          <ProductosSection
            activeCategory={activeCategory}
            activeSub={activeSub}
            setActiveSub={setActiveSub}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            subcategoriasPorCategoria={subcategoriasPorCategoria}
            productosFiltrados={productosFiltrados}
            handleAddToCart={handleAddToCart}
            searchInputRef={searchInputRef}
          />

          <CarritoSection
            items={items}
            products={products}
            updateItem={updateItem}
            eliminarItem={eliminarItem}
            limpiarCarrito={limpiarCarrito}
            subtotal={subtotal}
            descuento={descuento}
            setDescuento={setDescuento}
            totalPagar={totalPagar}
            setModalVenta={setModalVenta}
            obtenerPrecio={obtenerPrecio}
          />
        </div>
      ) : (
        <p>Redirigiendo a caja...</p>
      )}

      {/* Modal de venta */}
      <ModalVenta
        open={modalVenta}
        onClose={() => setModalVenta(false)}
        total={totalPagar}
        items={items}
        onConfirm={() => {
          // Cuando se confirme la venta, recargar los productos
          api.get("/menu-precio/").then((res) => {
            window.dispatchEvent(
              new CustomEvent("refrescarProductos", { detail: res.data })
            );
          });
        }}
      />
    </>
  );
}
