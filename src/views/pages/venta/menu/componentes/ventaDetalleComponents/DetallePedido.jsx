import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function DetallePedido({ items }) {
  const total = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.cantidad || 1),
    0
  );

  return (
    <>
      <Typography fontWeight="bold" gutterBottom>
        Pedido
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Cant</TableCell>
              <TableCell align="center">Tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Precio</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay productos
                </TableCell>
              </TableRow>
            ) : (
              <>
                {items.map((item, idx) => (
                  <TableRow key={idx} hover>
                    {/* Cantidad */}
                    <TableCell align="center">{item.cantidad}</TableCell>

                    {/* Tipo */}
                    <TableCell align="center">{item.tipo}</TableCell>

                    {/* Descripción */}
                    <TableCell>{item.descripcion || item.prod1}</TableCell>

                    {/* Precio */}
                    <TableCell align="right">
                      Bs.{(item.price * item.cantidad).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Total */}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography fontWeight="bold">Total</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">
                      Bs.{total.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
