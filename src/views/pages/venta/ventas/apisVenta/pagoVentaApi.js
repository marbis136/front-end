import api from "../../../../../api/axios";

export const pagoVentaApi = {
  getPagos: async (params) => {
    const response = await api.get("/pagos/", { params });
    return response.data;
  },

  cambiarMetodo: async (id, forma_pago) => {
    const response = await api.patch(`/pagos/${id}/`, { forma_pago });
    return response.data;
  },
};
