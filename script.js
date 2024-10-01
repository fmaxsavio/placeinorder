const draggableItems = document.querySelectorAll('.draggable');
const dropzone = document.getElementById('timeline-dropzone');
const progressBar = document.getElementById('progress');
const quizResult = document.getElementById('quiz-result');

let droppedItems = [];
let correctTimelineOrder = ['event1', 'event2', 'event3', 'event5', 'event4', 'event6'];

// Initialize Drag and Drop
draggableItems.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
});

dropzone.addEventListener('dragover', handleDragOver);
dropzone.addEventListener('drop', handleDrop);

function handleDragStart(e) {
    e.dataTransfer.setData('text', e.target.id);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const item = document.getElementById(id);

    if (!droppedItems.includes(id)) {
        dropzone.appendChild(item);
        droppedItems.push(id);
        updateProgress();
    }
}

function updateProgress() {
    let progress = (droppedItems.length / correctTimelineOrder.length) * 100;
    progressBar.style.width = progress + '%';

    if (progress === 100) {
        checkTimelineOrder();
    }
}

function checkTimelineOrder() {
    let isCorrectOrder = droppedItems.every((item, index) => item === correctTimelineOrder[index]);

    if (isCorrectOrder) {
        alert('Congratulations! You have arranged the events correctly!');
    } else {
        alert('The order is incorrect. Try again.');
    }
}

// Quiz Functionality
function checkAnswer() {
    const selectedOption = document.querySelector('input[name="quiz"]:checked');

    if (selectedOption) {
        if (selectedOption.value === 'A') {
            quizResult.textContent = 'Correct! Dinosaurs Extinction marked the end of the Cretaceous period.';
        } else {
            quizResult.textContent = 'Incorrect. Try again.';
        }
    } else {
        quizResult.textContent = 'Please select an answer.';
    }
}
