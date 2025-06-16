import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function App() {
  // Carregar as matérias do localStorage ao iniciar o componente
  const [materias, setMaterias] = useState(() => {
    const storedMaterias = localStorage.getItem("materias");
    return storedMaterias ? JSON.parse(storedMaterias) : [];
  });
  const [nomeMateria, setNomeMateria] = useState("");

  // Função para salvar as matérias no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem("materias", JSON.stringify(materias));
  }, [materias]);

  const addMateria = () => {
    if (!nomeMateria.trim()) return;
    setMaterias([...materias, { nome: nomeMateria, atividades: [] }]);
    setNomeMateria("");
  };

  const addAtividade = (index, atividade) => {
    const novasMaterias = [...materias];
    novasMaterias[index].atividades.push(atividade);
    setMaterias(novasMaterias);
  };

  const getStatusColor = (materia) => {
    const totalDistribuido = materia.atividades.reduce((acc, a) => acc + a.max, 0);
    const totalFeito = materia.atividades.reduce((acc, a) => acc + a.pontos, 0);
    if (totalFeito >= 60) return "bg-green-100 border-green-500";
    if (totalDistribuido > 0 && totalFeito < 0.6 * totalDistribuido) return "bg-red-100 border-red-500";
    return "bg-white border-gray-300";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Controle de Notas</h1>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Nome da matéria"
          value={nomeMateria}
          onChange={(e) => setNomeMateria(e.target.value)}
        />
        <Button onClick={addMateria}>Adicionar Matéria</Button>
      </div>

      <div className="grid gap-6">
        {materias.map((materia, index) => {
          const totalDistribuido = materia.atividades.reduce((acc, a) => acc + a.max, 0);
          const totalFeito = materia.atividades.reduce((acc, a) => acc + a.pontos, 0);
          const falta = Math.max(0, 60 - totalFeito);

          return (
            <Card key={index} className={`border-2 ${getStatusColor(materia)}`}>
              <CardContent className="p-4">
                <h2 className="text-xl text-black font-semibold mb-2">{materia.nome}</h2>
                <ul className="mb-2 list-disc list-inside text-black">
                  {materia.atividades.map((a, i) => (
                    <li key={i}>{a.nome} - {a.pontos}/{a.max} pts</li>
                  ))}
                </ul>
                <p className="text-sm text-black">Total Feito: {totalFeito} pts</p>
                <p className="text-sm text-black">Total Distribuído: {totalDistribuido} pts</p>
                <p className="text-sm text-black">Falta para 60 pts: {falta} pts</p>
                <AtividadeForm onAdd={(atividade) => addAtividade(index, atividade)} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AtividadeForm({ onAdd }) {
  const [nome, setNome] = useState("");
  const [pontos, setPontos] = useState(0);
  const [max, setMax] = useState(0);

  const handleAdd = () => {
    if (!nome || pontos < 0 || max <= 0 || pontos > max) return;
    onAdd({ nome, pontos: Number(pontos), max: Number(max) });
    setNome("");
    setPontos(0);
    setMax(0);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 mt-4">
      <Input placeholder="Atividade" value={nome} onChange={(e) => setNome(e.target.value)} />
      <Input type="number" placeholder="Pontos" value={pontos} onChange={(e) => setPontos(e.target.value)} />
      <Input type="number" placeholder="Máximo" value={max} onChange={(e) => setMax(e.target.value)} />
      <Button onClick={handleAdd}>Adicionar</Button>
    </div>
  );
}
