// Generate input fields dynamically for 20 questions
const formFields = document.getElementById('question-fields');

for (let i = 1; i <= 20; i++) {
    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.placeholder = 'Enter question ' + i;
    questionInput.id = 'question' + i;
    questionInput.required = true;

    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.placeholder = 'Enter answer ' + i;
    answerInput.id = 'answer' + i;
    answerInput.required = true;

    formFields.appendChild(questionInput);
    formFields.appendChild(answerInput);
}

// Function to create a 10x10 grid
function createGrid() {
    const gridContainer = document.getElementById('crosswordGrid');
    gridContainer.innerHTML = ''; // Clear previous grid
    const table = document.createElement('table');
    const grid = [];

    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('td');
            cell.innerHTML = '&nbsp;'; // Placeholder for empty cell
            row.appendChild(cell);
            grid[i][j] = { cell, letter: '', number: '' };
        }
        table.appendChild(row);
    }
    gridContainer.appendChild(table);
    return grid;
}

function generateCrossword() {
    const grid = createGrid(); // Create grid

    const horizontalWords = [];
    const verticalWords = [];
    let horizontalCount = 1;
    let verticalCount = 1;

    for (let i = 1; i <= 20; i++) {
        const question = document.getElementById('question' + i).value.trim();
        const answer = document.getElementById('answer' + i).value.trim().toUpperCase();

        if (answer) {
            if (i % 2 === 0) { // Horizontal word
                placeWordInGrid(answer, 'horizontal', horizontalCount, grid);
                horizontalWords.push(`${horizontalCount}. ${question}`);
                horizontalCount++;
            } else { // Vertical word
                placeWordInGrid(answer, 'vertical', verticalCount, grid);
                verticalWords.push(`${verticalCount}. ${question}`);
                verticalCount++;
            }
        }
    }

    document.getElementById('success-message').style.display = 'block';

    // Display questions for horizontal and vertical words separately
    const questionsSection = document.createElement('div');
    questionsSection.innerHTML = `
        <h2>Horizontal Questions</h2>
        <ul>${horizontalWords.map(q => `<li>${q}</li>`).join('')}</ul>
        <h2>Vertical Questions</h2>
        <ul>${verticalWords.map(q => `<li>${q}</li>`).join('')}</ul>
    `;
    document.getElementById('crosswordGrid').appendChild(questionsSection);
}

function placeWordInGrid(word, orientation, count, grid) {
    const maxLength = 10; // Grid size is 10x10
    let startX, startY;

    // Randomly select a start position
    do {
        startX = Math.floor(Math.random() * maxLength);
        startY = Math.floor(Math.random() * maxLength);
    } while (!canPlaceWord(word, startX, startY, orientation, grid));

    for (let i = 0; i < word.length; i++) {
        const x = orientation === 'horizontal' ? startX + i : startX;
        const y = orientation === 'horizontal' ? startY : startY + i;

        grid[y][x].letter = word[i];
        grid[y][x].cell.textContent = word[i];
        if (i === 0) {
            grid[y][x].number = count;
            const numberElement = document.createElement('span');
            numberElement.textContent = count;
            numberElement.classList.add('question-number');
            grid[y][x].cell.appendChild(numberElement);
        }
    }
}

function canPlaceWord(word, startX, startY, orientation, grid) {
    if (orientation === 'horizontal') {
        if (startX + word.length > 10) return false; // Overflow check
        for (let i = 0; i < word.length; i++) {
            if (grid[startY][startX + i].letter && grid[startY][startX + i].letter !== word[i]) return false;
        }
    } else { // Vertical
        if (startY + word.length > 10) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[startY + i][startX].letter && grid[startY + i][startX].letter !== word[i]) return false;
        }
    }
    return true;
}

function downloadPDF() {
    html2canvas(document.getElementById('crosswordGrid')).then(function (canvas) {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190
