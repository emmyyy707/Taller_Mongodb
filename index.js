import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // importante

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error(" Error al conectar a MongoDB:", err));

mongoose.connection.on("error", (err) => {
  console.error(" Error en la conexión:", err);
});

// Esquema y Modelo
const ofertaSchema = new mongoose.Schema({
  nombre_producto: { type: String, required: true },
  precio: { type: Number, required: true },
  nombreContacto: { type: String, required: true },
  celular: { type: String, required: true },
  municipio: { type: String, required: true },
});

const Oferta = mongoose.model("Oferta", ofertaSchema);

// Rutas
app.get("/", (req, res) => {
  res.send("API de Ofertas funcionando");
});

// GET todas las ofertas
app.get("/api/ofertas", async (req, res) => {
  try {
    const ofertas = await Oferta.find();
    res.json(ofertas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET oferta por ID
app.get("/api/ofertas/:id", async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id);
    if (!oferta) return res.status(404).json({ mensaje: "Oferta no encontrada" });
    res.json(oferta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear oferta
app.post("/api/ofertas", async (req, res) => {
  try {
    const nuevaOferta = new Oferta(req.body);
    await nuevaOferta.save();
    res.status(201).json(nuevaOferta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT actualizar oferta
app.put("/api/ofertas/:id", async (req, res) => {
  try {
    const ofertaActualizada = await Oferta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!ofertaActualizada)
      return res.status(404).json({ mensaje: "Oferta no encontrada" });
    res.json(ofertaActualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE eliminar oferta
app.delete("/api/ofertas/:id", async (req, res) => {
  try {
    const eliminada = await Oferta.findByIdAndDelete(req.params.id);
    if (!eliminada)
      return res.status(404).json({ mensaje: "Oferta no encontrada" });
    res.json({ mensaje: "Oferta eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
