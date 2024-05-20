import { ChangeEvent, useEffect, useState } from "react";
import Head from "../Components/Head";
import { maskInputToCurrency, totalTime, transformToBRL } from "../Utils/Functions";

export default function Home() {
    const [inputValues, setInputValues] = useState({
        montanteInicial: 0,
        aporteMensal: 0,
        mediaRendimentoAnual: 0,
        totalMeses: 0,
        mediaInflacaoAnual: 0,
        rendimentoMensalDesejado: 0,
        impostoDeRenda: 0,
    });

    const [resultados, setResultados] = useState({
        valorFinal: 0,
        totalAportesMensais: 0,
        montanteInicialMaisAportesMensais: 0,
        lucroJurosCompostos: 0,
        valorNecessarioParaRendimentoMensal: 0,
        aporteMensalNecessario: 0,
        rendimentoRealAnual: 0,
    });

    const {
        montanteInicial,
        aporteMensal,
        mediaRendimentoAnual,
        totalMeses,
        mediaInflacaoAnual,
        rendimentoMensalDesejado,
        impostoDeRenda,
    } = inputValues;

    const { montanteInicialMaisAportesMensais, valorNecessarioParaRendimentoMensal, rendimentoRealAnual } = resultados;

    useEffect(() => {
        if (mediaRendimentoAnual && mediaInflacaoAnual) {
            const rendimentoRealAnual = mediaRendimentoAnual - mediaInflacaoAnual;
            setResultados((prev) => ({ ...prev, rendimentoRealAnual }));
        }
    }, [mediaRendimentoAnual, mediaInflacaoAnual]);

    useEffect(() => {
        if (aporteMensal && totalMeses) {
            setResultados((prev) => ({
                ...prev,
                totalAportesMensais: aporteMensal * totalMeses,
                montanteInicialMaisAportesMensais: montanteInicial + aporteMensal * totalMeses,
            }));
        }
    }, [montanteInicial, aporteMensal, totalMeses]);

    useEffect(() => {
        if (montanteInicial && aporteMensal && rendimentoRealAnual && totalMeses) {
            const taxaMensal = rendimentoRealAnual / 100 / 12;
            let valorFinal = montanteInicial;

            for (let i = 1; i <= totalMeses; i++) {
                valorFinal = (valorFinal + aporteMensal) * (1 + taxaMensal);
            }

            setResultados((prev) => ({
                ...prev,
                valorFinal: Number(valorFinal.toFixed(2)),
                lucroJurosCompostos: Number((valorFinal - montanteInicialMaisAportesMensais).toFixed(2)),
            }));
        }
    }, [montanteInicial, aporteMensal, rendimentoRealAnual, totalMeses, montanteInicialMaisAportesMensais]);

    useEffect(() => {
        if (rendimentoMensalDesejado && impostoDeRenda && rendimentoRealAnual) {
            const rendimentoMensalBrutoDesejado = rendimentoMensalDesejado / (1 - impostoDeRenda / 100);
            const valorNecessarioParaRendimentoMensal =
                (rendimentoMensalBrutoDesejado * 12) / (rendimentoRealAnual / 100);
            setResultados((prev) => ({ ...prev, valorNecessarioParaRendimentoMensal }));
        }
    }, [rendimentoMensalDesejado, impostoDeRenda, rendimentoRealAnual]);

    useEffect(() => {
        if (montanteInicial && rendimentoRealAnual && totalMeses && valorNecessarioParaRendimentoMensal) {
            const taxaMensal = rendimentoRealAnual / 100 / 12;
            const FV = valorNecessarioParaRendimentoMensal - montanteInicial * Math.pow(1 + taxaMensal, totalMeses);
            const PMT = (taxaMensal * FV) / (Math.pow(1 + taxaMensal, totalMeses) - 1);

            setResultados((prev) => ({ ...prev, aporteMensalNecessario: PMT }));
        }
    }, [montanteInicial, rendimentoRealAnual, totalMeses, valorNecessarioParaRendimentoMensal]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let numericValue = value;

        if (value.includes("R$")) {
            numericValue = value.replace("R$ ", "").replace(".", "").replace(",", "");
        }

        setInputValues((prev) => ({
            ...prev,
            [name]: Number(numericValue),
        }));
    };

    return (
        <>
            <Head
                title="money.alexgalhardo.com"
                description="A personal project I created for my goals and financial studies."
            />

            <div className="container col-lg-10" style={{ marginTop: "20px" }}>
                <div className="row">
                    <h1 className="fs-1 fw-bold text-white text-center mb-3 mb-5" id="modalLabel">
                        <a
                            href="https://github.com/alexgalhardo/money.alexgalhardo.com"
                            target="_blank"
                            className="text-decoration-none"
                        >
                            {" "}
                            Calculadora Indepêndencia Financeira
                        </a>{" "}
                        <a href="/english" className="text-decoration-none">
                            🇺🇸
                        </a>
                    </h1>
                    <div className="col-lg-6">
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    Quanto você quer ganhar por mês sem trabalhar:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    placeholder="Exemplo: R$ 3.000,00"
                                    onKeyUp={(e) => maskInputToCurrency(e, "pt-br")}
                                    name="rendimentoMensalDesejado"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    Quanto você tem pra investir agora:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    placeholder="Exemplo: R$ 10.000,00"
                                    onKeyUp={(e) => maskInputToCurrency(e, "pt-br")}
                                    name="montanteInicial"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    Quanto você pretende investir por mês:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    placeholder="Exemplo: R$ 500,00"
                                    onKeyUp={(e) => maskInputToCurrency(e, "pt-br")}
                                    name="aporteMensal"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    Em quanto tempo pretende parar de trabalhar (meses):
                                </label>
                                <input
                                    className="form-control fs-4"
                                    min={1}
                                    max={600}
                                    type="number"
                                    placeholder="Exemplo: 60 meses"
                                    name="totalMeses"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    Rendimento anual médio das suas aplicações em %:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    min={0.1}
                                    step={0.1}
                                    max={5}
                                    type="number"
                                    placeholder="Exemplo: 10% ao ano"
                                    name="mediaRendimentoAnual"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    Expectativa de Inflação anual média em %:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    min={0.1}
                                    step={0.1}
                                    max={20}
                                    type="number"
                                    placeholder="Exemplo: 3% ao ano"
                                    name="mediaInflacaoAnual"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    Imposto de Renda Sobre o Investimento em %:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    min={0.1}
                                    step={0.1}
                                    max={20}
                                    type="number"
                                    placeholder="Exemplo: 15%"
                                    name="impostoDeRenda"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 text-end">
                        <h3 className="text-white text-end">Resultados</h3>
                        <hr />
                        <p>
                            Montante Inicial:{" "}
                            <span className="text-success fw-bold">
                                R$ {transformToBRL(inputValues.montanteInicial)}
                            </span>
                        </p>
                        <p>
                            Vou investir por mês:{" "}
                            <span className="text-success fw-bold">R$ {transformToBRL(inputValues.aporteMensal)}</span>
                        </p>
                        <p>
                            Aportes Mensais Investidos:{" "}
                            <span className="text-success fw-bold">
                                R$ {transformToBRL(resultados.totalAportesMensais)}
                            </span>
                        </p>
                        <p>
                            Montante Inicial + Aportes Mensais Investidos:{" "}
                            <span className="text-success fw-bold">
                                R$ {transformToBRL(resultados.montanteInicialMaisAportesMensais)}
                            </span>
                        </p>
                        <p>
                            Rendimento anual real (rendimento anual - inflação anual):{" "}
                            <span className="text-warning fw-bold">{resultados.rendimentoRealAnual.toFixed(2)}% </span>
                        </p>
                        <p>
                            {resultados.lucroJurosCompostos > 0 ? (
                                <>
                                    Vocêu Lucrou com Juros Compostos:{" "}
                                    <span className="text-success fw-bold">
                                        R$ {transformToBRL(resultados.lucroJurosCompostos)}
                                    </span>
                                </>
                            ) : (
                                <>
                                    Você perdeu em poder de compra:{" "}
                                    <span className="text-danger fw-bold">
                                        R$ {transformToBRL(resultados.lucroJurosCompostos)}
                                    </span>
                                </>
                            )}
                        </p>
                        <hr />
                        <p>
                            O montante final acumulado com o juros compostos
                            <br />
                            após{" "}
                            <span className="text-primary fw-bold">{totalTime(inputValues.totalMeses, "pt-br")}</span>
                            <br />
                            ajustado pelo rendimento anual real{" "}
                            <span className="text-warning fw-bold">{resultados.rendimentoRealAnual.toFixed(2)}%</span>
                            <br />é de:{" "}
                            <span className="text-success fw-bold">R$ {transformToBRL(resultados.valorFinal)}</span>
                        </p>
                        <hr />
                        {resultados.rendimentoRealAnual > 0 ? (
                            <>
                                <p>
                                    Para receber{" "}
                                    <span className="text-success fw-bold">
                                        R$ {transformToBRL(inputValues.rendimentoMensalDesejado)}
                                    </span>{" "}
                                    de renda mensal já descontando o{" "}
                                    <span className="text-danger fw-bold">
                                        imposto de renda de {inputValues.impostoDeRenda}%
                                    </span>{" "}
                                    e poder parar de trabalhar:
                                </p>
                                <p>
                                    Você precisará ter acumulado:{" "}
                                    <span className="text-success fw-bold">
                                        R$ {transformToBRL(resultados.valorNecessarioParaRendimentoMensal)}
                                    </span>{" "}
                                </p>
                                <p>
                                    E vai precisar investir{" "}
                                    <span className="text-success fw-bold">
                                        R$ {transformToBRL(resultados.aporteMensalNecessario)}
                                    </span>{" "}
                                    todos os meses até{" "}
                                    <span className="text-primary fw-bold">
                                        {(() => {
                                            const today = new Date();
                                            const endDate = new Date(today);
                                            endDate.setMonth(today.getMonth() + inputValues.totalMeses);
                                            return endDate.toLocaleDateString("pt-BR");
                                        })()}{" "}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <p>
                                <span className="text-info fw-bold">
                                    O rendimento anual real precisa ser positivo para que esse cálculo seja feito
                                    corretamente.
                                </span>{" "}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <br className="mt-5" />
        </>
    );
}
