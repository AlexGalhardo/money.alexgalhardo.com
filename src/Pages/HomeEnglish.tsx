import { ChangeEvent, useEffect, useState } from "react";
import Head from "../Components/Head";
import { container, maskInputToBrazilReal, transformToBRL } from "../Utils/Functions";

export function totalTime(totalMonths: number): string {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) {
        return months === 1 ? `${months} month` : `${months} months`;
    }

    if (years === 1 && months === 0) {
        return `${years} year`;
    }

    if (years === 1 && months === 1) {
        return `${years} year and ${months} month`;
    }

    if (years === 1 && months !== 0) {
        return `${years} year and ${months} months`;
    }

    return months === 0 ? `${years} years` : `${years} years and ${months} months`;
}

export default function HomeEnglish() {
    const [inputValues, setInputValues] = useState({
        initialAmount: 0,
        monthlyContribution: 0,
        averageAnnualReturn: 0,
        totalMonths: 0,
        averageAnnualInflation: 0,
        desiredMonthlyIncome: 0,
        incomeTax: 0,
    });

    const [results, setResults] = useState({
        finalValue: 0,
        totalMonthlyContributions: 0,
        initialAmountPlusMonthlyContributions: 0,
        compoundInterestProfit: 0,
        necessaryAmountForMonthlyIncome: 0,
        necessaryMonthlyContribution: 0,
        realAnnualReturn: 0,
    });

    const {
        initialAmount,
        monthlyContribution,
        averageAnnualReturn,
        totalMonths,
        averageAnnualInflation,
        desiredMonthlyIncome,
        incomeTax,
    } = inputValues;

    const {
        finalValue,
        totalMonthlyContributions,
        initialAmountPlusMonthlyContributions,
        compoundInterestProfit,
        necessaryAmountForMonthlyIncome,
        necessaryMonthlyContribution,
        realAnnualReturn,
    } = results;

    useEffect(() => {
        if (averageAnnualReturn && averageAnnualInflation) {
            const realAnnualReturn = averageAnnualReturn - averageAnnualInflation;
            setResults((prev) => ({ ...prev, realAnnualReturn }));
        }
    }, [averageAnnualReturn, averageAnnualInflation]);

    useEffect(() => {
        if (monthlyContribution && totalMonths) {
            setResults((prev) => ({
                ...prev,
                totalMonthlyContributions: monthlyContribution * totalMonths,
                initialAmountPlusMonthlyContributions: initialAmount + monthlyContribution * totalMonths,
            }));
        }
    }, [initialAmount, monthlyContribution, totalMonths]);

    useEffect(() => {
        if (initialAmount && monthlyContribution && realAnnualReturn && totalMonths) {
            const monthlyRate = realAnnualReturn / 100 / 12;
            let finalValue = initialAmount;

            for (let i = 1; i <= totalMonths; i++) {
                finalValue = (finalValue + monthlyContribution) * (1 + monthlyRate);
            }

            setResults((prev) => ({
                ...prev,
                finalValue: Number(finalValue.toFixed(2)),
                compoundInterestProfit: Number((finalValue - initialAmountPlusMonthlyContributions).toFixed(2)),
            }));
        }
    }, [initialAmount, monthlyContribution, realAnnualReturn, totalMonths, initialAmountPlusMonthlyContributions]);

    useEffect(() => {
        if (desiredMonthlyIncome && incomeTax && realAnnualReturn) {
            const grossDesiredMonthlyIncome = desiredMonthlyIncome / (1 - incomeTax / 100);
            const necessaryAmountForMonthlyIncome = (grossDesiredMonthlyIncome * 12) / (realAnnualReturn / 100);
            setResults((prev) => ({ ...prev, necessaryAmountForMonthlyIncome }));
        }
    }, [desiredMonthlyIncome, incomeTax, realAnnualReturn]);

    useEffect(() => {
        if (initialAmount && realAnnualReturn && totalMonths && necessaryAmountForMonthlyIncome) {
            const monthlyRate = realAnnualReturn / 100 / 12;
            const FV = necessaryAmountForMonthlyIncome - initialAmount * Math.pow(1 + monthlyRate, totalMonths);
            const PMT = (monthlyRate * FV) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

            setResults((prev) => ({ ...prev, necessaryMonthlyContribution: PMT }));
        }
    }, [initialAmount, realAnnualReturn, totalMonths, necessaryAmountForMonthlyIncome]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let numericValue = value;

        if (value.includes("R$")) {
            numericValue = value.replace("R$", "").replace(".", "").replace(",", "");
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

            <div className="container col-lg-10" style={container}>
                <div className="row">
                    <h1 className="fs-1 fw-bold text-white text-center mb-3 mb-5" id="modalLabel">
                        <a
                            href="https://github.com/alexgalhardo/money.alexgalhardo.com"
                            target="_blank"
                            className="text-decoration-none"
                        >
                            {" "}
                            Galhardo Financial Independence Calculator
                        </a>{" "}
                        <a href="/" className="text-decoration-none">
                            🇧🇷
                        </a>
                    </h1>
                    <div className="col-lg-6">
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    How much do you want to earn per month without working:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    placeholder="Example: R$ 10.00"
                                    onKeyUp={maskInputToBrazilReal}
                                    name="desiredMonthlyIncome"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    How much do you have to invest now:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    placeholder="Example: R$ 10.00"
                                    onKeyUp={maskInputToBrazilReal}
                                    name="initialAmount"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    How much do you intend to invest per month:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    placeholder="Example: R$ 10.00"
                                    onKeyUp={maskInputToBrazilReal}
                                    name="monthlyContribution"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    How long do you plan to stop working (months):
                                </label>
                                <input
                                    className="form-control fs-4"
                                    min={1}
                                    max={600}
                                    type="number"
                                    placeholder="Example: 60 months"
                                    name="totalMonths"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    Average annual return on your investments in %:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    min={0.1}
                                    step={0.1}
                                    max={5}
                                    type="number"
                                    placeholder="Example: 10% per year"
                                    name="averageAnnualReturn"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    Expected average annual inflation in %:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    min={0.1}
                                    step={0.1}
                                    max={20}
                                    type="number"
                                    placeholder="Example: 3% per year"
                                    name="averageAnnualInflation"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">
                                    Income Tax on Investment in %:
                                </label>
                                <input
                                    className="form-control fs-4"
                                    min={0.1}
                                    step={0.1}
                                    max={20}
                                    type="number"
                                    placeholder="Example: 15%"
                                    name="incomeTax"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 text-end">
                        <h3 className="text-white text-end">Results</h3>
                        <hr />
                        <p>
                            Initial Amount:{" "}
                            <span className="text-success fw-bold">$ {transformToBRL(inputValues.initialAmount)}</span>
                        </p>
                        <p>
                            Monthly Contribution:{" "}
                            <span className="text-success fw-bold">
                                $ {transformToBRL(inputValues.monthlyContribution)}
                            </span>
                        </p>
                        <p>
                            Total Monthly Contributions:{" "}
                            <span className="text-success fw-bold">
                                $ {transformToBRL(results.totalMonthlyContributions)}
                            </span>
                        </p>
                        <p>
                            Initial Amount + Total Monthly Contributions:{" "}
                            <span className="text-success fw-bold">
                                $ {transformToBRL(results.initialAmountPlusMonthlyContributions)}
                            </span>
                        </p>
                        <p>
                            Real Annual Return (annual return - annual inflation):{" "}
                            <span className="text-warning fw-bold">{results.realAnnualReturn.toFixed(2)}% </span>
                        </p>
                        <p>
                            Compound Interest Profit:{" "}
                            <span className="text-success fw-bold">
                                $ {transformToBRL(results.compoundInterestProfit)}
                            </span>
                        </p>
                        <p>
                            The final amount accumulated with compound interest profit after{" "}
                            <span className="text-primary fw-bold">{totalTime(inputValues.totalMonths)}</span>, adjusted
                            by the real annual return{" "}
                            <span className="text-warning fw-bold">{results.realAnnualReturn.toFixed(2)}%</span>, is:{" "}
                            <span className="text-success fw-bold">$ {transformToBRL(results.finalValue)}</span>
                        </p>
                        <hr />
                        <p>
                            To receive{" "}
                            <span className="text-success fw-bold">
                                $ {transformToBRL(inputValues.desiredMonthlyIncome)}
                            </span>{" "}
                            as monthly income already deducting{" "}
                            <span className="text-danger fw-bold">income tax of {inputValues.incomeTax}%</span> and be
                            able to stop working:
                        </p>
                        <p>
                            You need to have accumulated:{" "}
                            <span className="text-success fw-bold">
                                $ {transformToBRL(results.necessaryAmountForMonthlyIncome)}
                            </span>{" "}
                        </p>
                        <p>
                            And you need to invest{" "}
                            <span className="text-success fw-bold">
                                $ {transformToBRL(results.necessaryMonthlyContribution)}
                            </span>{" "}
                            every month until{" "}
                            <span className="text-primary fw-bold">
                                {(() => {
                                    const today = new Date();
                                    const endDate = new Date(today);
                                    endDate.setMonth(today.getMonth() + inputValues.totalMonths);
                                    return endDate.toLocaleDateString("en-US");
                                })()}{" "}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <br className="mt-5" />
        </>
    );
}
