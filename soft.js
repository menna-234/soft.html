const studentRecords = {
    "12345678901234": 398,
    "30412110200634": 392,
    "30306230201699": 378,
    "30402041800998": 401,
    "30308230301438": 365,
    "30412120202783": 400
};

// Pre-registered students for login
const students = [
    {
        nationalId: '12345678901234',
        password: '123456',
        name: 'Ahmed Mohamed',
        email: 'ahmed@email.com',
        phone: '01234567890'
    },
    {
        nationalId: '30412110200634',
        password: '123456',
        name: 'Shady salah',
        email: 'shady@email.com',
        phone: '01112223333'
    },
    {
        nationalId: '30306230201699',
        password: '123456',
        name: 'abdelrahman khaled',
        email: 'abdelrahman@email.com',
        phone: '01223334444'
    },
    {
        nationalId: '30402041800998',
        password: '123456',
        name: 'abdelrahman ayman',
        email: 'abdelrahman@email.com',
        phone: '01034445555'
    },
    {
        nationalId: '30308230301438',
        password: '123456',
        name: 'khaled Saber',
        email: 'khaled@email.com',
        phone: '01567778888'
    },
     {
        nationalId: '30412120202783',
        password: '123456',
        name: 'Menna mohamed',
        email: 'mennamazen0@email.com',
        phone: '01033400685'
    }
];
const colleges = [
    { id: 1, name: 'Faculty of Medicine', minScore: 405 },
    { id: 2, name: 'Faculty of Dentistry', minScore: 400 },
    { id: 3, name: 'Faculty of Pharmacy', minScore: 395 },
    { id: 4, name: 'Faculty of Engineering', minScore: 390 },
    { id: 5, name: 'Faculty of Computer Science', minScore: 385 },
    { id: 6, name: 'Faculty of Computing', minScore: 375 },
    { id: 7, name: 'Faculty of Science', minScore: 365 },
    { id: 8, name: 'Faculty of Media', minScore: 360 },
    { id: 9, name: 'Faculty of Economics', minScore: 355 },
    { id: 10, name: 'Faculty of Commerce', minScore: 350 }
];

let currentStudent = null;
let selectedColleges = [];
let admittedCollege = null;

function showAlert(msg, type) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    document.getElementById('alertContainer').innerHTML = `
                <div class="alert alert-${type}">
                    <span style="font-size: 24px;">${icons[type]}</span>
                    <span>${msg}</span>
                </div>
            `;
    setTimeout(() => document.getElementById('alertContainer').innerHTML = '', 4000);
}

function showScreen(id) {
    document.querySelectorAll('.card').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function showLogin() {
    showScreen('loginScreen');
    document.querySelector('.btn-logout').classList.add('hidden');
}

function showRegister() {
    showScreen('registerScreen');
}

function handleLogin() {
    const id = document.getElementById('nationalId').value;
    const pass = document.getElementById('password').value;

    if (id.length !== 14) {
        showAlert('National ID must be 14 digits', 'error');
        return;
    }

    showScreen('loadingScreen');

    setTimeout(() => {
        const student = students.find(s => s.nationalId === id && s.password === pass);

        if (student) {
            // Auto-assign score from studentRecords
            const score = studentRecords[id];
            if (score === undefined) {
                showLogin();
                showAlert('Score not found for this ID', 'error');
                return;
            }
            currentStudent = { ...student, score };
            showResults();
            showAlert('Login successful!', 'success');
        } else {
            showLogin();
            showAlert('Invalid credentials', 'error');
        }
    }, 1000);
}

function handleRegister() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const id = document.getElementById('regNationalId').value;
    const pass = document.getElementById('regPassword').value;

    if (!name || !email || !phone || id.length !== 14 || pass.length < 6) {
        showAlert('Please fill all fields correctly', 'error');
        return;
    }

    // Check if score exists for this National ID
    const score = studentRecords[id];
    if (score === undefined) {
        showAlert('No score found for this National ID. Please contact administration.', 'error');
        return;
    }

    showScreen('loadingScreen');

    setTimeout(() => {
        currentStudent = { nationalId: id, password: pass, name, email, phone, score };
        students.push(currentStudent); // Optional: save locally
        showResults();
        showAlert('Account created successfully!', 'success');
    }, 1000);
}

function showResults() {
    showScreen('resultsScreen');
    document.querySelector('.btn-logout').classList.remove('hidden');

    document.getElementById('studentName').textContent = currentStudent.name;
    document.getElementById('displayName').textContent = currentStudent.name;
    document.getElementById('displayEmail').textContent = currentStudent.email;
    document.getElementById('displayPhone').textContent = currentStudent.phone;
    document.getElementById('displayNationalId').textContent = currentStudent.nationalId;
    document.getElementById('displayScore').textContent = currentStudent.score;

    document.getElementById('scoreProgress').style.width = (currentStudent.score / 410 * 100) + '%';

    const available = colleges.filter(c => currentStudent.score >= c.minScore).length;
    document.getElementById('availableCount').textContent = available;
}

function showCoordination() {
    showScreen('loadingScreen');

    setTimeout(() => {
        showScreen('coordinationScreen');

        const list = document.getElementById('collegeList');
        list.innerHTML = '';

        colleges.forEach(college => {
            const isAvailable = currentStudent.score >= college.minScore;
            const isSelected = selectedColleges.includes(college.id);

            const item = document.createElement('div');
            item.className = `college-item ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`;

            if (isAvailable) {
                item.onclick = () => toggleCollege(college.id);
            }

            item.innerHTML = `
                        <div>
                            <h3>${college.name}</h3>
                            <p style="color: #666; font-size: 14px;">Minimum: ${college.minScore}</p>
                        </div>
                        <div>
                            ${isAvailable ? '<span class="badge badge-success">Available</span>' : '<span class=" badge badge-danger">Not Available</span>'}
                            ${isSelected ? '<span style="font-size: 24px; margin-right: 10px;">✓</span>' : ''}
                        </div>
                    `;

            list.appendChild(item);
        });
    }, 500);
}

function toggleCollege(id) {
    const idx = selectedColleges.indexOf(id);
    if (idx > -1) {
        selectedColleges.splice(idx, 1);
    } else {
        if (selectedColleges.length >= 5) {
            showAlert('You can select up to 5 colleges only', 'error');
            return;
        }
        selectedColleges.push(id);
    }
    showCoordination();
}

function submitApplication() {
    if (selectedColleges.length === 0) {
        showAlert('Please select at least one college', 'error');
        return;
    }

    showScreen('loadingScreen');

    setTimeout(() => {
        const available = colleges
            .filter(c => selectedColleges.includes(c.id) && currentStudent.score >= c.minScore)
            .sort((a, b) => b.minScore - a.minScore);

        if (available.length > 0) {
            admittedCollege = available[0];
            showScreen('admissionScreen');
            document.getElementById('admittedCollegeName').textContent = admittedCollege.name;
            showAlert('Congratulations! You are accepted', 'success');
        } else {
            showCoordination();
            showAlert('Your score does not qualify for any selected colleges', 'error');
        }
    }, 1000);
}

function showDocuments() {
    showScreen('documentsScreen');
}

function submitDocuments(complete) {
    showScreen('loadingScreen');

    setTimeout(() => {
        if (complete) {
            showScreen('verifiedScreen');
            document.getElementById('verifiedCollegeName').textContent = admittedCollege.name;
            showAlert('Registration completed successfully!', 'success');
        } else {
            showScreen('incompleteScreen');
            showAlert('Documents are incomplete', 'error');
        }
    }, 800);
}
function logout() {
    currentStudent = null;
    selectedColleges = [];
    admittedCollege = null;
    document.getElementById('nationalId').value = '';
    document.getElementById('password').value = '';
    showLogin();
    showAlert('Logged out successfully', 'success');
}
