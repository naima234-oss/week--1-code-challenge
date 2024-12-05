const readline = require('readline');

// Function to calculate demerit points and output result
function checkSpeed(speed) {
    const speedLimit = 70;
    const kmPerDemerit = 5;

    if (speed < speedLimit) {
        console.log("Ok");
    } else {
        const excessSpeed = speed - speedLimit;
        const demeritPoints = Math.floor(excessSpeed / kmPerDemerit);

        if (demeritPoints > 12) {
            console.log("License suspended");
        } else {
            console.log(`Points: ${demeritPoints}`);
        }
    }
}

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt user for car speed
rl.question("Enter the speed of the car: ", (input) => {
    const speed = parseFloat(input);

    // Validate input
    if (isNaN(speed) || speed < 0) {
        console.log("Invalid input! Please enter a valid speed.");
    } else {
        checkSpeed(speed);
    }

    // Close readline interface
    rl.close();
});
