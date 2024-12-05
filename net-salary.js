const readline = require('readline');

// Constants for calculations
const PAYE_BRACKETS = [
    { upperLimit: 24000, rate: 0.1 },
    { upperLimit: 32333, rate: 0.25 },
    { upperLimit: 500000, rate: 0.30 },
    { upperLimit: 800000, rate: 0.325 },
    { upperLimit: Infinity, rate: 0.35 }
];

const PERSONAL_RELIEF = 2400;
const SHIF_RATE = 0.0275; // 2.75% of gross salary
const HOUSING_LEVY_RATE = 0.015; // 1.5% of gross salary
const NSSF_TIER_1 = 7000; // Upper limit for Tier I
const NSSF_TIER_2 = 36000; // Upper limit for Tier II
const NSSF_RATE = 0.06; // 6% for both tiers

const NHIF_RATES = [
    { upperLimit: 5999, deduction: 150 },
    { upperLimit: 7999, deduction: 300 },
    { upperLimit: 11999, deduction: 400 },
    { upperLimit: 14999, deduction: 500 },
    { upperLimit: 19999, deduction: 600 },
    { upperLimit: 24999, deduction: 750 },
    { upperLimit: 29999, deduction: 850 },
    { upperLimit: 34999, deduction: 900 },
    { upperLimit: 39999, deduction: 950 },
    { upperLimit: 44999, deduction: 1000 },
    { upperLimit: 49999, deduction: 1100 },
    { upperLimit: 59999, deduction: 1200 },
    { upperLimit: 69999, deduction: 1300 },
    { upperLimit: 79999, deduction: 1400 },
    { upperLimit: 89999, deduction: 1500 },
    { upperLimit: 99999, deduction: 1600 },
    { upperLimit: Infinity, deduction: 1700 }
];

// Function to calculate PAYE
function calculatePAYE(grossSalary) {
    let tax = 0;
    for (const bracket of PAYE_BRACKETS) {
        if (grossSalary <= bracket.upperLimit) {
            tax += grossSalary * bracket.rate;
            break;
        } else {
            tax += bracket.upperLimit * bracket.rate;
            grossSalary -= bracket.upperLimit;
        }
    }
    return Math.max(tax - PERSONAL_RELIEF, 0); // Subtract personal relief
}

// Function to calculate NHIF
function calculateNHIF(grossSalary) {
    for (const rate of NHIF_RATES) {
        if (grossSalary <= rate.upperLimit) {
            return rate.deduction;
        }
    }
    return 0;
}

// Function to calculate SHIF
function calculateSHIF(grossSalary) {
    return grossSalary * SHIF_RATE;
}

// Function to calculate NSSF
function calculateNSSF(basicSalary) {
    const tier1 = Math.min(basicSalary, NSSF_TIER_1) * NSSF_RATE;
    const tier2 = Math.min(Math.max(basicSalary - NSSF_TIER_1, 0), NSSF_TIER_2 - NSSF_TIER_1) * NSSF_RATE;
    return tier1 + tier2;
}

// Function to calculate Housing Levy
function calculateHousingLevy(grossSalary) {
    return grossSalary * HOUSING_LEVY_RATE;
}

// Main function to calculate net salary
function calculateNetSalary(basicSalary, benefits) {
    const grossSalary = basicSalary + benefits;
    const tax = calculatePAYE(grossSalary);
    const nhif = calculateNHIF(grossSalary);
    const shif = calculateSHIF(grossSalary);
    const nssf = calculateNSSF(basicSalary);
    const housingLevy = calculateHousingLevy(grossSalary);
    const totalDeductions = tax + nhif + shif + nssf + housingLevy;
    const netSalary = grossSalary - totalDeductions;

    return { grossSalary, tax, nhif, shif, nssf, housingLevy, netSalary };
}

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt user for inputs
rl.question("Enter your basic salary: ", (basicSalaryInput) => {
    const basicSalary = parseFloat(basicSalaryInput);

    rl.question("Enter your benefits: ", (benefitsInput) => {
        const benefits = parseFloat(benefitsInput);

        if (isNaN(basicSalary) || isNaN(benefits) || basicSalary < 0 || benefits < 0) {
            console.log("Invalid input! Please enter positive numbers for salary and benefits.");
        } else {
            const { grossSalary, tax, nhif, shif, nssf, housingLevy, netSalary } = calculateNetSalary(basicSalary, benefits);

            console.log(`
            Salary Breakdown:
            -----------------
            Gross Salary: KES ${grossSalary.toFixed(2)}
            PAYE (Tax): KES ${tax.toFixed(2)}
            NHIF Deduction: KES ${nhif.toFixed(2)}
            SHIF Deduction: KES ${shif.toFixed(2)}
            NSSF Deduction: KES ${nssf.toFixed(2)}
            Housing Levy: KES ${housingLevy.toFixed(2)}
            Net Salary: KES ${netSalary.toFixed(2)}
            `);
        }

        rl.close();
    });
});
