import React, { useMemo, useState } from "react";
import './App.css';

// ===== CONFIGURAÇÃO RÁPIDA =====
// Se quiser fixar um número de WhatsApp, preencha abaixo no formato BR sem + e sem espaços, ex: 65999999999
const DEFAULT_WHATSAPP = "65999114215"; // deixe vazio para o cliente digitar o número na tela

// Catálogo de itens
const combos = [
  {
    key: "comp1",
    label: "Marmita",
    price: 25,
    desc: "Arroz com galinha, farofa de banana, feijão e salada",
  },
  {
    key: "comp2",
    label: "Self-Service",
    price: 35,
    desc: "Pode se servir a vontade, sem limites de quantidade",
  },
];

const bebidas = [
  { key: "cocaNormal", label: "Coca-Cola", price: 6 },
  { key: "fantaLar", label: "Fanta laranja", price: 6 },
  { key: "gua", label: "Guaraná", price: 6 },
  { key: "agua", label: "Água com gás", price: 6 },
];

const sobremesa = [
  { key: "mousse", label: "Mousse de Limão", desc: "Mousse de limão com Ganache de Chocolate meio amargo", price: 10 },
  { key: "briga", label: "Brigadeiro", price: 2 }
]

export default function EspetinhoApp() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [pagamento, setPagamento] = useState<string>("Pix");
  const [nome, setNome] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");
  const [whats, setWhats] = useState<string>(DEFAULT_WHATSAPP);

  const allItems = [...combos, ...bebidas, ...sobremesa];

  const total = useMemo(() => {
    return allItems.reduce((acc, item) => acc + (qty[item.key] || 0) * item.price, 0);
  }, [qty]);

  const handleInc = (key: string) => setQty((q) => ({ ...q, [key]: (q[key] || 0) + 1 }));
  const handleDec = (key: string) =>
    setQty((q) => ({ ...q, [key]: Math.max(0, (q[key] || 0) - 1) }));

  const pedidoLines = useMemo(() => {
    const lines: string[] = [];
    combos.forEach((c) => {
      const n = qty[c.key] || 0;
      if (n > 0) lines.push(`${n}x ${c.label} — R$ ${(c.price * n).toFixed(2)}`);
    });
    bebidas.forEach((b) => {
      const n = qty[b.key] || 0;
      if (n > 0) lines.push(`${n}x ${b.label} — R$ ${(b.price * n).toFixed(2)}`);
    });
    sobremesa.forEach((b) => {
      const n = qty[b.key] || 0;
      if (n > 0) lines.push(`${n}x ${b.label} — R$ ${(b.price * n).toFixed(2)}`);
    });
    return lines;
  }, [qty]);

  const textoWhatsApp = useMemo(() => {
    const header = `*Pedido — Espetinho Solidário*`;
    const nomeLinha = nome ? `\nNome: ${nome}` : "";
    const itens = pedidoLines.length > 0 ? `\n\nItens:\n- ${pedidoLines.join("\n- ")}` : "\n\nItens: (vazio)";
    const obs = observacoes ? `\n\nObservações: ${observacoes}` : "";
    const pag = `\n\nPagamento: ${pagamento}`;
    const tot = `\nTotal: R$ ${total.toFixed(2)}`;
    return `${header}${nomeLinha}${itens}${obs}${pag}${tot}`;
  }, [pedidoLines, pagamento, observacoes, total, nome]);

  const waLink = useMemo(() => {
    const numero = (whats || "").replace(/\D/g, "");
    const base = numero ? `https://wa.me/${numero}` : "https://wa.me";
    const url = `${base}?text=${encodeURIComponent(textoWhatsApp)}`;
    return url;
  }, [textoWhatsApp, whats]);

  const canSend = pedidoLines.length > 0 && (whats || "").replace(/\D/g, "").length >= 10;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-zinc-900">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-red-600">Galinhada na Casa</h1>
          <div className="text-xs sm:text-sm font-medium">
            Total: <span className="text-emerald-700">R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Combos */}
        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Combos</h2>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {combos.map((item) => (
              <CardItem
                key={item.key}
                title={item.label}
                desc={item.desc}
                price={item.price}
                value={qty[item.key] || 0}
                onInc={() => handleInc(item.key)}
                onDec={() => handleDec(item.key)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Sobremesas</h2>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {sobremesa.map((item) => (
              <CardItem
                key={item.key}
                title={item.label}
                desc={item.desc}
                price={item.price}
                value={qty[item.key] || 0}
                onInc={() => handleInc(item.key)}
                onDec={() => handleDec(item.key)}
              />
            ))}
          </div>
        </section>

        {/* Bebidas */}
        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Bebidas (apenas lata)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {bebidas.map((item) => (
              <CardItem
                key={item.key}
                title={item.label}
                price={item.price}
                value={qty[item.key] || 0}
                onInc={() => handleInc(item.key)}
                onDec={() => handleDec(item.key)}
              />
            ))}
          </div>
        </section>

        {/* Pagamento e dados do cliente */}
        <section className="grid gap-4 sm:gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border bg-white shadow-sm">
              <p className="px-1 text-sm sm:text-base font-medium">Forma de pagamento</p>
              <div className="mt-2 sm:mt-3 grid grid-cols-3 gap-2 sm:gap-3 mb-20">
                {["Pix", "Crédito", "Débito"].map((opt) => (
                  <label key={opt} className={`flex items-center justify-center rounded-lg sm:rounded-xl border px-2 sm:px-3 py-2 sm:py-3 cursor-pointer text-xs sm:text-sm transition-all hover:bg-gray-50 ${pagamento === opt ? "ring-2 ring-emerald-500 bg-emerald-50" : ""}`}>
                    <input
                      type="radio"
                      name="pagamento"
                      className="sr-only"
                      checked={pagamento === opt}
                      onChange={() => setPagamento(opt)}
                    />
                    <span className="text-xs sm:text-sm font-medium">{opt}</span>
                  </label>
                ))}
              </div>
              <div className="flex flex-col gap-y-2">
                <p className="text-sm text-black font-normal italic">O pagamento pode ser efetuado de maneira antecipada ou no dia da galinhada.</p>
                <ul>
                  <li className="text-sm text-black font-normal italic"> Crianças de 0 até 6 anos <label className="text-red-500 font-bold">não pagam.</label></li>
                 <li className="text-sm text-black font-normal italic"> Crianças de 7 até 11 anos <label className="text-red-500 font-bold">pagam apenas: R$ 17,50 reais.</label></li>
                 <li className="text-sm text-black font-normal italic"> Crianças acima de 12 anos <label className="text-red-500 font-bold">pagam o valor inteiro.</label></li>
                </ul>
              </div>
              
            </div>

            <div className="p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border bg-white shadow-sm grid gap-3 sm:gap-4">
              <label className="grid gap-1 sm:gap-2">
                <span className="text-sm sm:text-base font-medium">Seu nome (obrigatório)</span>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Marco"
                  className="rounded-lg sm:rounded-xl border px-3 py-2 sm:py-3 outline-none focus:ring-2 focus:ring-emerald-500 w-full text-sm sm:text-base"
                />
              </label>
              <label className="grid gap-1 sm:gap-2">
                <span className="text-sm sm:text-base font-medium">WhatsApp que receberá o seu pedido</span>
                <input
                  value={whats}
                  disabled
                  placeholder="Ex.: 65999999999"
                  className="rounded-lg sm:rounded-xl border px-3 py-2 sm:py-3 outline-none w-full text-sm sm:text-base 
             disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </label>
            </div>
          </div>

          <label className="p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border bg-white shadow-sm grid gap-2 sm:gap-3">
            <span className="text-sm sm:text-base font-medium">Observações do pedido (opcional)</span>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              placeholder="Tirar farofa, sem salada, retirar talher, etc."
              className="rounded-lg sm:rounded-xl border px-3 py-2 sm:py-3 outline-none focus:ring-2 focus:ring-emerald-500 w-full text-sm sm:text-base resize-none"
            />
          </label>
        </section>

        {/* Resumo */}
        <section className="p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border bg-white shadow-sm">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">Resumo do pedido</h3>
          {pedidoLines.length === 0 ? (
            <p className="text-sm sm:text-base text-zinc-600">Nenhum item selecionado.</p>
          ) : (
            <ul className="text-sm sm:text-base space-y-1 sm:space-y-2">
              {pedidoLines.map((l, i) => (
                <li key={i} className="break-words">• {l}</li>
              ))}
            </ul>
          )}
          <div className="mt-3 sm:mt-4 flex items-center justify-between pt-3 sm:pt-4 border-t">
            <span className="text-sm sm:text-base lg:text-lg font-medium">Total</span>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-700">R$ {total.toFixed(2)}</span>
          </div>
        </section>

        {/* Botão WhatsApp */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className={`flex-1 text-center rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 font-semibold shadow-sm border text-sm sm:text-base lg:text-lg transition-all ${canSend ? "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800" : "bg-zinc-200 text-zinc-500 cursor-not-allowed"}`}
            aria-disabled={!canSend}
            onClick={(e) => { if (!canSend) e.preventDefault(); }}
          >
            📱 Enviar pedido por WhatsApp
          </a>
          <button
            className="rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 font-medium border shadow-sm hover:bg-zinc-50 active:bg-zinc-100 text-sm sm:text-base lg:text-lg transition-all"
            onClick={() => navigator.clipboard.writeText(textoWhatsApp)}
          >
            📋 Copiar resumo
          </button>
        </div>

        <footer className="pt-6 sm:pt-8 pb-8 sm:pb-12 text-center text-xs sm:text-sm text-zinc-500 leading-relaxed">
          Evento em prol da salinha das crianças e escritório pastoral. Obrigado pelo apoio!
        </footer>
      </main>
    </div>
  );
}

function CardItem({ title, desc, price, value, onInc, onDec }: {
  title: string;
  desc?: string;
  price: number;
  value: number;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div className="rounded-xl sm:rounded-2xl border bg-white shadow-sm p-3 sm:p-4 lg:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 hover:shadow-md transition-shadow">
      <div className="min-w-0 flex-1">
        <div className="text-sm sm:text-base lg:text-lg font-semibold leading-tight break-words">{title}</div>
        {desc ? <div className="text-xs sm:text-sm lg:text-base text-zinc-600 mt-1 break-words">{desc}</div> : null}
        <div className="text-xs sm:text-sm lg:text-base mt-1 sm:mt-2 font-medium text-emerald-600">R$ {price.toFixed(2)}</div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 self-end md:self-center">
        <button
          onClick={onDec}
          className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full border grid place-items-center hover:bg-zinc-50 active:bg-zinc-100 transition-colors text-lg sm:text-xl font-medium"
          disabled={value === 0}
        >
          −
        </button>
        <input
          readOnly
          value={value}
          className="w-10 sm:w-12 lg:w-14 text-center border rounded-lg sm:rounded-xl py-1 sm:py-2 text-sm sm:text-base font-medium"
        />
        <button
          onClick={onInc}
          className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full border grid place-items-center hover:bg-zinc-50 active:bg-zinc-100 transition-colors text-lg sm:text-xl font-medium"
        >
          +
        </button>
      </div>
    </div>
  );
}