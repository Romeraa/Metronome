import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [bpm, setBpm] = useState(120);
  const [ativo, setAtivo] = useState(false);
  const [lado, setLado] = useState(false);

  useEffect(() => {
    if (!ativo) return;

    const intervalo = setInterval(() => {
      setLado((anterior) => !anterior);
    }, 60000 / bpm / 2);

    return () => clearInterval(intervalo);
  }, [ativo, bpm]);

  return (
    <div className="app">
      <h1>Meu Metrônomo</h1>

      <div className="metronomo">
        <div className="escala">
          <div className="ponta" />
          <div
            className={`pendulo ${ativo ? "ativo" : ""} ${
              lado ? "direita" : "esquerda"
            }`}
            style={{ animationDuration: `${60000 / bpm}ms` }}
          >
            <div className="peso" />
          </div>
        </div>
      </div>

      <div className="controles">
        <button
          onClick={() => setBpm((v) => Math.max(40, v - 5))}
        >
          −
        </button>

        <div className="bpm">{bpm} BPM</div>

        <button
          onClick={() => setBpm((v) => Math.min(240, v + 5))}
        >
          +
        </button>
      </div>

      <input
        type="range"
        min="40"
        max="240"
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
      />

      <button
        className="botao-play"
        onClick={() => setAtivo((v) => !v)}
      >
        {ativo ? "Parar" : "Iniciar"}
      </button>
    </div>
  );
}

export default App;
