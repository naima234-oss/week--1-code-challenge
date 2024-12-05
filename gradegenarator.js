const readline = require('readline');

// Function to calculate grade based on marks
function calculateGrade(marks) {
    if (marks > 79) {
        return "A";
    } else if (marks >= 60) {
        return "B";
    } else if (marks >= 50) {
        return "C";
    } else if (marks >= 40) {
        return "D";
    } else {
        return "E";
    }
}

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt user for marks
rl.question("Enter student marks (between 0 and 100): ", (input) => {
    const marks = parseFloat(input);

    // Validate input
    if (isNaN(marks) || marks < 0 || marks > 100) {
        console.log("Invalid input! Please enter a number between 0 and 100.");
    } else {
        const grade = calculateGrade(marks);
        console.log(`The grade for marks ${marks} is: ${grade}`);
    }

    // Close readline interface
    rl.close();
});
