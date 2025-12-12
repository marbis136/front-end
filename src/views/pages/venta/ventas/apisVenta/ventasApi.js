import api from "../../../../../api/axios";

export const ventasApi = {
  async getVentas(params = {}) {
    const { data } = await api.get("/venta/", { params });
    return data.results || data;
  },

  // ✅ Ahora usa el endpoint correcto para anular
  async anularVenta(id) {
    const { data } = await api.patch(`/venta/${id}/anular/`);
    return data;
  },

  async reimprimir(id) {
    const { data } = await api.get(`/venta/${id}/reimprimir/`, {
      responseType: "blob",
    });
    return data;
  },  
};


