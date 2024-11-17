let api = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd2Z0aG9ld211dWFlaW1hd2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjUyMjAsImV4cCI6MjA0Njc0MTIyMH0.mJKZ7yaaWRgd8AuT0mLZyiAhoIa9-bv0DdftW1oAQ2c"
const app = document.getElementById('app');
const dateIdeasPlaceholders = [
    {
        title: "Dumpster Fire Picnic for Two",
        description: "Romantic dinner over a flaming trash can—BYO weird snacks and weird vibes."
    },
    {
        title: "Pothole Plunge",
        description: "Hold hands while tripping over potholes. Bonus points for not breaking any bones."
    },
    {
        title: "Rat Romance Rendezvous",
        description: "For when a rat infestation is just the ambiance you crave."
    },
    {
        title: "Forbidden Swamp Fondue",
        description: "A cauldron of melted cheese… and whatever else we can find lying around."
    },
    {
        title: "Lost in the Sewer",
        description: "Get completely, hopelessly lost in the sewer. Bring snacks and zero common sense."
    },
    {
        title: "Mystery Slime Wrestling",
        description: "Get ready for a slippery, slimy showdown where no one wins, and dignity is optional."
    },
    {
        title: "Dumpster Goblin Disco",
        description: "Dance under the dim glow of broken streetlights while digging for treasures of dubious origin."
    },
    {
        title: "Stolen Wheelbarrow Rides",
        description: "Hold on for dear life as we barrel down hills in a stolen wheelbarrow. Crash landing guaranteed."
    },
    {
        title: "Graveyard Grab Bag",
        description: "Close your eyes, reach into the grave dirt, and hope you don’t grab anything… squirmy."
    },
    {
        title: "Back Alley Opera",
        description: "Sing like no one’s watching (they are) in an alley where everything echoes and smells strange."
    }
];


const sbClient = supabase.createClient("https://mdwfthoewmuuaeimawbz.supabase.co", api);

// Initialize app with session check
(async function init() {
    const session = getSessionFromStorage();
    if (session) {
        console.log(session)
        const { data, error } = await sbClient.auth.setSession(session);
        if (!error && data.user) {
            await initApp();  // User session is valid, load the main view
        } else {
            clearSession();
            loginView();  // Invalid session, show login view
        }
    } else {
        loginView();  // No session, show login view
    }
})();

async function initApp() {
    await loadDates();
    renderMainView();
}

async function loadDates() {
    const { data, error } = await sbClient.from('date_ideas').select('*');
    dates = data;
    console.log(data)
}

function renderMainView() {
    let dateCards = dates.map((date, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="card shadow-lg mx-auto" style="width: 300px;">
                <div class="card-body">
                    <h5 class="card-title">${date.ideaTitle}</h5>
                    <p class="card-text">${date.description}</p>

                </div>
            </div>
        </div>
    `).join("");

    let html = `
    <div class="container mt-5">
        <div id="dateCarousel" class="carousel slide">
            <div class="carousel-inner">${dateCards}</div>
            <button class="carousel-control-prev" type="button" data-bs-target="#dateCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#dateCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <div class="d-flex justify-content-center gap-3 mt-4 ">
            <button class="btn btn-lg btn-success" onclick="addNewView()">Hatch scheme</button>
            <button class="btn btn-lg btn-warning" onclick="ShowAllDates()">View treasury!</button>
        </div>
    </div>
    `;
    app.innerHTML = html;
}

function addNewView() {
    const randomElement = dateIdeasPlaceholders[Math.floor(Math.random() * dateIdeasPlaceholders.length)];

    let html = `
    <div class="container mt-5">
        <div class="card shadow-lg mx-auto" style="width: 400px;">
            <div class="card-body">
                <h5 class="card-title text-center">Add a New Date Idea</h5>
                <form id="addDateForm">
                    <div class="mb-3">
                        <label for="dateTitle" class="card-text">Date title</label>
                        <input type="text" class="form-control" id="dateTitle" placeholder="${randomElement.title}" required>
                    </div>
                    <div class="mb-3">
                        <label for="dateDescription" class="card-text">Description</label>
                        <textarea class="form-control" id="dateDescription" rows="3" placeholder="${randomElement.description}" required></textarea>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn btn-outline-success btn-lg">Add to vault</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
    app.innerHTML = html;

    document.getElementById('addDateForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('dateTitle').value;
        const description = document.getElementById('dateDescription').value;
        await NewDate(title, description);
        await loadDates();  // Reload dates after adding a new one
        renderMainView();
    });
}

async function NewDate(title, desc) {
    const { data, error } = await sbClient.from('date_ideas').insert({
        done: false,
        ideaTitle: title,
        votedBy: '',
        description: desc
    });
    if (error) console.error("Error adding new date:", error);
}

function loginView() {
    let html = `
    <div class="container mt-5" style="max-width: 400px;">
        <div class="card shadow-lg">
            <div class="card-body">
                <h5 class="card-title text-center">Login</h5>
                <form id="loginForm">
                    <div class="mb-3">
                        <label for="email" class="card-text">Email</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="card-text">Password</label>
                        <input type="password" class="form-control" id="password" required>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-success">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
    app.innerHTML = html;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        await login(email, password);
    });
}

async function login(email, password) {
    const { data, error } = await sbClient.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (data.user) {
        saveSessionToStorage(data.session);  // Save the session to localStorage
        await initApp();  // Initialize the app after a successful login
    } else {
        console.error("Login failed:", error);
        loginView();
    }
}

// Session Management
function saveSessionToStorage(session) {
    localStorage.setItem('sbSession', JSON.stringify(session));
}

function getSessionFromStorage() {
    const session = localStorage.getItem('sbSession');
    return session ? JSON.parse(session) : null;
}

function clearSession() {
    localStorage.removeItem('sbSession');
}

// Logout (add this function to trigger a logout if needed)
async function logout() {
    await sbClient.auth.signOut();
    clearSession();
    loginView();
}

function ShowAllDates() {
    let dateCards = dates.map((date) => `
        <div class="card shadow-lg my-3">
            <div class="card-body">
                <h5 class="card-title">${date.ideaTitle}</h5>
                <p class="card-text">${date.description}</p>
                <div class="d-flex justify-content-end gap-2">

                </div>
            </div>
        </div>
    `).join("");

    let html = `
    <div class="container mt-5">
        <h2 class="text-center mb-4">All Date Ideas</h2>
        <div class="list-group">${dateCards}</div>
        <div class="d-flex justify-content-center mt-4">
            <button class="btn btn-lg btn-primary" onclick="renderMainView()">Back to Main</button>
        </div>
    </div>
    `;

    app.innerHTML = html;
}
