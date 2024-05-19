import { CSSProperties } from "react";

export const container: CSSProperties = {
    marginTop: "20px",
};

export function transformToBRL(amount: number) {
    return (amount / 100).toLocaleString("pt-br", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function transformStringInputValueMaskToNumber(value: string): number {
    value = value.replace("R$ ", "");
    value = value.replace(",", "");
    value = value.replace(".", "");
    return Number(value);
}

export function maskInputToBrazilReal(e: any) {
    let inputValue = e.target.value.replace(/\D/g, "");
    inputValue = (inputValue / 100).toFixed(2) + "";
    inputValue = inputValue.replace(".", ",");
    inputValue = inputValue.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    inputValue = inputValue.replace(/(\d)(\d{3}),/g, "$1.$2,");
    e.target.value = `R$ ${inputValue}`;
}

export function maskInputToUSADolar(e: any) {
    let inputValue = e.target.value.replace(/\D/g, "");
    inputValue = (inputValue / 100).toFixed(2) + "";
    inputValue = inputValue.replace(".", ",");
    inputValue = inputValue.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    inputValue = inputValue.replace(/(\d)(\d{3}),/g, "$1.$2,");
    e.target.value = `$ ${inputValue}`;
}

export function maskInputToPercentage(e: any) {
    let inputValue = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    let numericValue = parseFloat(inputValue) / 100;

    if (isNaN(numericValue)) {
        numericValue = 0; // Set default value to 0 if NaN
    }

    // Clamp the value between 1.00 and 50.00
    numericValue = Math.max(0, Math.min(50, numericValue));

    inputValue = numericValue.toFixed(2) + ""; // Convert to percentage with 2 decimal places
    inputValue = inputValue.replace(/(\d)(\d{3})(\d{3})\./g, "$1,$2,$3."); // Add thousands separators
    inputValue = inputValue.replace(/(\d)(\d{3})\./g, "$1,$2."); // Add thousands separators

    e.target.value = `${inputValue} % ao ano`; // Set the formatted value
}

export function maskInputToImpostoDeRenda(e: any) {
    let inputValue = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    let numericValue = parseFloat(inputValue) / 100;

    if (isNaN(numericValue)) {
        numericValue = 0; // Set default value to 0 if NaN
    }

    // Clamp the value between 1.00 and 50.00
    numericValue = Math.max(0, Math.min(50, numericValue));

    inputValue = numericValue.toFixed(2) + ""; // Convert to percentage with 2 decimal places
    inputValue = inputValue.replace(/(\d)(\d{3})(\d{3})\./g, "$1,$2,$3."); // Add thousands separators
    inputValue = inputValue.replace(/(\d)(\d{3})\./g, "$1,$2."); // Add thousands separators

    e.target.value = `${inputValue} %`; // Set the formatted value
}

export function maskInputToMonths(e: any) {
    let inputValue = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    let numericValue = parseInt(inputValue, 10);

    if (isNaN(numericValue)) {
        numericValue = 0; // Set default value to 0 if NaN
    }

    // Clamp the value between 1 and 600
    numericValue = Math.max(0, Math.min(600, numericValue));

    e.target.value = `${numericValue} ${numericValue > 1 ? "meses" : "mês"}`;
}

export function totalTempo(totalMeses: number): string {
    const anos = Math.floor(totalMeses / 12);
    const meses = totalMeses % 12;

    if (anos === 0) {
        return meses === 1 ? `${meses} mês` : `${meses} meses`;
    }

    if (anos === 1 && meses === 0) {
        return `${anos} ano`;
    }

    if (anos === 1 && meses === 1) {
        return `${anos} ano e ${meses} mês`;
    }

    if (anos === 1 && meses !== 0) {
        return `${anos} ano e ${meses} meses`;
    }

    return meses === 0 ? `${anos} anos` : `${anos} anos e ${meses} meses`;
}

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
