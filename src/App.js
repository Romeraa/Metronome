
import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [bpm, setBpm] = useState(100);
  const [ativo, setAtivo] = useState(false);
  const [lado, setLado] = useState(false);

  const audioContextRef = useRef(null);
  const tempoRef = useRef(0);

  // Cria o som de uma batida
  const tocarBatida = () => {
    const audio = audioContextRef.current;

    if (!audio || audio.state !== "running") return;

    // Primeiro tempo com som mais agudo
    const primeiroTempo = tempoRef.current % 4 === 0;

    const oscilador = audio.createOscillator();
    const volume = audio.createGain();

    oscilador.type = "sine";
    oscilador.frequency.value = primeiroTempo ? 1200 : 800;

    const agora = audio.currentTime;

    volume.gain.setValueAtTime(0.0001, agora);
    volume.gain.exponentialRampToValueAtTime(0.7, agora + 0.005);
    volume.gain.exponentialRampToValueAtTime(0.0001, agora + 0.07);

    oscilador.connect(volume);
    volume.connect(audio.destination);

    oscilador.start(agora);
    oscilador.stop(agora + 0.08);

    tempoRef.current += 1;
  };

  // Controla o ritmo e o som
  useEffect(() => {
    if (!ativo || !audioContextRef.current) return;

    const audio = audioContextRef.current;

    if (audio.state !== "running") return;

    tempoRef.current = 0;
    tocarBatida();

    const intervalo = setInterval(() => {
      tocarBatida();
      setLado((anterior) => !anterior);
    }, 60000 / bpm);

    return () => clearInterval(intervalo);
  }, [ativo, bpm]);

  // Inicia ou para o metrônomo
  const alternarMetronomo = async () => {
    if (ativo) {
      setAtivo(false);
      return;
    }

    try {
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;

        audioContextRef.current = new AudioContextClass();
      }

      await audioContextRef.current.resume();
      setAtivo(true);
    } catch (erro) {
      console.error("Não foi possível iniciar o áudio:", erro);
    }
  };

  // Libera o recurso de áudio ao desmontar o componente
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

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
          disabled={ativo}
          title="Pare o metrônomo para alterar o BPM"
        >
          −
        </button>

        <div className="bpm">{bpm} BPM</div>

        <button
          onClick={() => setBpm((v) => Math.min(240, v + 5))}
          disabled={ativo}
          title="Pare o metrônomo para alterar o BPM"
        >
          +
        </button>
      </div>

      <input
        type="range"
        min="40"
        max="240"
        step="1"
        value={bpm}
        disabled={ativo}
        onChange={(e) => setBpm(Number(e.target.value))}
      />

      <button className="botao-play" onClick={alternarMetronomo}>
        {ativo ? "Parar" : "Iniciar"}
      </button>
    </div>
  );
}

export default App;
