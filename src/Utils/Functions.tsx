export function transformToBRL(amount: number) {
    return (amount / 100).toLocaleString("pt-br", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function maskInputToCurrency(e: any, lang: string = "en-us") {
    let currency = lang === "en-us" ? "$" : "R$";

    let inputValue = e.target.value.replace(/\D/g, "");
    inputValue = (inputValue / 100).toFixed(2) + "";
    inputValue = inputValue.replace(".", ",");
    inputValue = inputValue.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    inputValue = inputValue.replace(/(\d)(\d{3}),/g, "$1.$2,");
    e.target.value = `${currency} ${inputValue}`;
}

export function totalTime(totalMonths: number, lang: string = "en-us"): string {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    let oneMonth = "month",
        moreThanOneMonth = "months",
        oneYear = "year",
        moreThanOneYear = "years",
        and = "and";

    if (lang === "pt-br") {
        oneMonth = "mês";
        moreThanOneMonth = "meses";
        oneYear = "ano";
        moreThanOneYear = "anos";
        and = "e";
    }

    if (years === 0) {
        return months === 1 ? `${months} ${oneMonth}` : `${months} ${moreThanOneMonth}`;
    }

    if (years === 1 && months === 0) {
        return `${years} ${oneYear}`;
    }

    if (years === 1 && months === 1) {
        return `${years} ${oneYear} ${and} ${months} ${oneMonth}`;
    }

    if (years === 1 && months !== 0) {
        return `${years} ${oneYear} ${and} ${months} ${moreThanOneMonth}`;
    }

    return months === 0
        ? `${years} ${moreThanOneYear}`
        : `${years} ${moreThanOneYear} ${and} ${months} ${moreThanOneMonth}`;
}
