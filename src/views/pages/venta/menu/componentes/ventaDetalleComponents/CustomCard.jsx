import { Card, CardContent, Box } from "@mui/material";

export default function CustomCard({ children, ...props }) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: "560px",
        height: "260px",
        overflow: "hidden",
        boxSizing: "border-box",
        ...props.sx,
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          p: 1.5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
