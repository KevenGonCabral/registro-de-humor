const emojiButtons = document.querySelectorAll('.emoji-selection button');
const reasonInput = document.getElementById('reasonInput');
const saveMoodBtn = document.getElementById('saveMoodBtn');
const historyDiv = document.getElementById('history');
const summaryDiv = document.getElementById('summary');

let selectedEmoji = '';
const moods = JSON.parse(localStorage.getItem('dailyMoods')) || []; // Load from local storage

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];


const nome = prompt("Qual é o seu nome?");

if (nome !== null && nome.trim() !== "") {
  const container = document.getElementById("mensagem-container");
  const titulo = document.createElement("h1");
  titulo.textContent = `Bem-vindo(a), ${nome}!`;
  container.appendChild(titulo);
}


emojiButtons.forEach(button => {
    button.addEventListener('click', () => {
        emojiButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedEmoji = button.dataset.emoji;
    });
});


saveMoodBtn.addEventListener('click', () => {
    if (selectedEmoji && reasonInput.value.trim() !== '') {
        const today = new Date();
        const todayFormatted = today.toLocaleDateString('pt-BR');
        const dayOfWeek = dayNames[today.getDay()];

     
        const existingIndex = moods.findIndex(mood => mood.date === todayFormatted);

        const newMood = {
            date: todayFormatted,
            day: dayOfWeek,
            emoji: selectedEmoji,
            reason: reasonInput.value.trim()
        };

        if (existingIndex > -1) {
          
            moods[existingIndex] = newMood;
        } else {
           
            moods.push(newMood);
        }

        localStorage.setItem('dailyMoods', JSON.stringify(moods)); 
        displayHistory();
        displaySummary();
        reasonInput.value = ''; 
        emojiButtons.forEach(btn => btn.classList.remove('selected')); 
        selectedEmoji = '';
    } else {
        alert('Por favor, selecione um humor e digite o motivo.');
    }
});


function displayHistory() {
    historyDiv.innerHTML = '';
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7); 

    const recentMoods = moods.filter(mood => {
        const [day, month, year] = mood.date.split('/').map(Number);
        const moodDate = new Date(year, month - 1, day); 
        return moodDate >= oneWeekAgo && moodDate <= today;
    }).sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA - dateB;
    });

    if (recentMoods.length === 0) {
        historyDiv.innerHTML = '<p>Nenhum humor registrado nesta semana.</p>';
        return;
    }

    recentMoods.forEach(mood => {
        const moodEntry = document.createElement('div');
        moodEntry.innerHTML = `
            <span class="day">${mood.day}:</span>
            <span class="emoji">${mood.emoji}</span>
            <span>"${mood.reason}"</span>
        `;
        historyDiv.appendChild(moodEntry);
    });
}


function displaySummary() {
    summaryDiv.innerHTML = ''; 
    const moodCounts = {};

    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const recentMoods = moods.filter(mood => {
        const [day, month, year] = mood.date.split('/').map(Number);
        const moodDate = new Date(year, month - 1, day);
        return moodDate >= oneWeekAgo && moodDate <= today;
    });

    if (recentMoods.length === 0) {
        summaryDiv.innerHTML = '<p>Nenhum resumo de humor disponível.</p>';
        return;
    }

    recentMoods.forEach(mood => {
        moodCounts[mood.emoji] = (moodCounts[mood.emoji] || 0) + 1;
    });

    for (const emoji in moodCounts) {
        const span = document.createElement('span');
        span.textContent = `${emoji} x${moodCounts[emoji]}`;
        summaryDiv.appendChild(span);
    }
}


displayHistory();
displaySummary();