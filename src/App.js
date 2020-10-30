import React, { useEffect, useState } from 'react';
import './App.css';
import { HorizontalBar, Bar, Line } from 'react-chartjs-2';

const moedasOption = [
  { value: 'USD-BRL', name: 'Dólar Comercial' },
  { value: 'USDT-BRL', name: 'Dólar Turismo' },
  { value: 'CAD-BRL', name: 'Dólar Canadense' },
  { value: 'AUD-BRL', name: 'Dólar Australiano' },
  { value: 'EUR-BRL', name: 'Euro' },
  { value: 'GBP-BRL', name: 'Libra Esterlina' },
  { value: 'ARS-BRL', name: 'Peso Argentino' },
  { value: 'JPY-BRL', name: 'Iene Japonês' },
  { value: 'CHF-BRL', name: 'Franco Suíço' },
  { value: 'CNY-BRL', name: 'Yuan Chinês' },
  { value: 'YLS-BRL', name: 'Novo Shekel Israelense' },
  { value: 'BTC-BRL', name: 'Bitcoin' },
  { value: 'LTC-BRL', name: 'Litecoin' },
  { value: 'ETH-BRL', name: 'Ethereum' },
  { value: 'XRP-BRL', name: 'Ripple' }
];

const tipoGraficoOptions = [
  { value: '1', name: 'Linha' },
  { value: '2', name: 'Barra Vertical' },
  { value: '3', name: 'Barra Horizontal' },
];

const labelTipoDado = {
  bid: 'Valor de Compra',
  ask: 'Valor de Venda',
  high: 'Valor Máximo',
  low: 'Valor Mínimo',
  varBid: 'Variação'
}

export default function App() {
  const [moeda, setMoeda] = useState('USD-BRL');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [quantidade, setQuantidade] = useState(20);
  const [tipoDado, setTipoDado] = useState('bid');
  const [chartData, setChartData] = useState();
  const [tipoGrafico, setTipoGrafico] = useState(1);


  async function consultarCotacao() {
    let url = `https://economia.awesomeapi.com.br/${moeda}/${quantidade}?start_date=${dataInicial.replace(/[^0-9]/g, '')}&end_date=${dataFinal.replace(/[^0-9]/g, '')}`;

    await fetch(url).then(resp => resp.json()).then(res => {
      let dados = [];
      let label = [];

      res.map((element, index) => {
        dados = [element[tipoDado], ...dados];
        label = [quantidade - index, ...label];
      });

      console.log(label)
      setChartData({
        labels: label,
        datasets: [
          {
            label: `${labelTipoDado[tipoDado]} do ${res[0].name}`,
            data: dados,
            fill: false,
            backgroundColor: 'rgba(0, 255, 208)',
            borderColor: 'rgba(0, 175, 255, .5)',
          },
        ],
      })

    }).catch(error => {
      console.error(`Ocorreu um erro: ${error.message}`);
    })
  }

  useEffect(() => {
    console.log('chartData', chartData)
  }, [chartData]);

  return (
    <>
      <div className="row">
        <div className="col-12 d-flex justify-content-center">
          <h1 className="header">Cotações de Moedas</h1>
        </div>
      </div>

      <div className="row container-fluid justify-content-center">
        <form className="col-4">
          <div className="row">
            <div className="col-12">
              <label htmlFor="">Tipo de Gráfico</label>
              <select className="form-control" onChange={event => setTipoGrafico(event.target.value)}>
                {
                  tipoGraficoOptions.map(grafico => {
                    return (
                      <option key={grafico.value} value={grafico.value}>{grafico.name}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="">Tipo de Dado</label>
              <select className="form-control" onChange={event => setTipoDado(event.target.value)}>
                <option value="bid">Valor de Compra</option>
                <option value="ask">Valor de Venda</option>
                <option value="high">Valor Máximo</option>
                <option value="low">Valor Mínimo</option>
                <option value="varBid">Variação</option>
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="">Seleciona a moeda</label>
              <select name="" id="" className="form-control" onChange={event => setMoeda(event.target.value)}>
                {
                  moedasOption.map(moeda => {
                    return (
                      <option key={moeda.value} value={moeda.value}>{moeda.name}</option>
                    )
                  })
                }
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="">Data inicial</label>
              <input className="form-control" type="date" value={dataInicial} onChange={e => setDataInicial(e.target.value)} />
            </div>
          </div>

          <div className="row">
            <div className="col-12 form-group">
              <label htmlFor="">Data final</label>
              <input className="form-control" type="date" value={dataFinal} onChange={e => setDataFinal(e.target.value)} />
            </div>
          </div>

          <div className="row">
            <div className="col-12 form-group">
              <label htmlFor="">Quantidade de dados da consulta</label>
              <input class="form-control" type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} />
            </div>
          </div>

          <div class="row justify-content-center">
            <button onClick={consultarCotacao} type="button" class="btn btn-outline-primary">
              Consultar
          </button>
          </div>

        </form>
        <div className="col-8 border">
          <div className="row justify-content-center">
            <h1>Resultado</h1>
            <div className="col-12">
              <div>
                {
                  tipoGrafico == 1 ?
                    <Line data={chartData} />
                    : tipoGrafico == 2 ?
                    <Bar data={chartData} />
                    :
                    <HorizontalBar data={chartData} />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}