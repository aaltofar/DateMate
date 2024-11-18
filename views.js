import { loadDates, addDateIdea } from './repository.js';
import { login, clearSession, restoreSession } from './auth.js';
const dateIdeasPlaceholders = [
    {
        ideaTitle: "Dumpster Fire Picnic for Two",
        description: "Romantic dinner over a flaming trash can—BYO weird snacks and weird vibes."
    },
    {
        ideaTitle: "Pothole Plunge",
        description: "Hold hands while tripping over potholes. Bonus points for not breaking any bones."
    },
    {
        ideaTitle: "Rat Romance Rendezvous",
        description: "For when a rat infestation is just the ambiance you crave."
    },
    {
        ideaTitle: "Forbidden Swamp Fondue",
        description: "A cauldron of melted cheese… and whatever else we can find lying around."
    },
    {
        ideaTitle: "Lost in the Sewer",
        description: "Get completely, hopelessly lost in the sewer. Bring snacks and zero common sense."
    },
    {
        ideaTitle: "Mystery Slime Wrestling",
        description: "Get ready for a slippery, slimy showdown where no one wins, and dignity is optional."
    },
    {
        ideaTitle: "Dumpster Goblin Disco",
        description: "Dance under the dim glow of broken streetlights while digging for treasures of dubious origin."
    },
    {
        ideaTitle: "Stolen Wheelbarrow Rides",
        description: "Hold on for dear life as we barrel down hills in a stolen wheelbarrow. Crash landing guaranteed."
    },
    {
        ideaTitle: "Graveyard Grab Bag",
        description: "Close your eyes, reach into the grave dirt, and hope you don’t grab anything… squirmy."
    },
    {
        ideaTitle: "Back Alley Opera",
        description: "Sing like no one’s watching (they are) in an alley where everything echoes and smells strange."
    }
];
const app = document.getElementById('app');
let dates = [];
let demo = false;

export async function renderMainView(demoMode = false) {
    demo = demoMode
    dates = await loadDates(demoMode);
    const dateCards = dates.map((date, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="card shadow-lg mx-auto" style="width: 300px;">
                <div class="card-body">
                    <h5 class="card-title">${date.ideaTitle}</h5>
                    <p class="card-text">${date.description}</p>
                </div>
            </div>
        </div>
    `).join("");

    app.innerHTML = `
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
            <button id="addDateBtn" class="btn btn-lg btn-success">Plan mischief</button>
            <button id="viewAllDatesBtn" class="btn btn-lg btn-warning">Browse the vault</button>
        </div>
    </div>
    `;

    document.getElementById('addDateBtn').addEventListener('click', renderAddDateView);
    document.getElementById('viewAllDatesBtn').addEventListener('click', renderAllDatesView);

}

export function renderAddDateView() {
    const randomElement = dateIdeasPlaceholders[Math.floor(Math.random() * dateIdeasPlaceholders.length)];

    const app = document.getElementById('app');
    app.innerHTML = `
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
    <button type="submit" class="btn btn-outline-success btn-lg">Add to Vault</button>
    </div>
    </form>
    </div>
    </div>
    </div>
    `;
if (demo)
    return;
    document.getElementById('addDateForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('dateTitle').value;
        const description = document.getElementById('dateDescription').value;
        await addDateIdea(title, description);
        await renderMainView();
    });
}


export function renderLoginView() {
    app.innerHTML = `
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
    <button id="demoBtn" class="btn btn-primary" style="position: absolute; bottom: 0; right: 0; opacity: 0.4">Demo mode</button>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const { user, error } = await login(email, password);
        if (user) renderMainView();
        else console.error("Login failed:", error);
    });

    document.getElementById('demoBtn').addEventListener('click', () => {
        renderMainView(true)
    })
}

export function renderAllDatesView() {
    const dateCards = dates.map((date) => `
    <div class="card shadow-lg my-3">
    <div class="card-body">
    <h5 class="card-title">${date.ideaTitle}</h5>
    <p class="card-text">${date.description}</p>
    </div>
    </div>
    `).join("");

    app.innerHTML = `
    <div class="container mt-5">
    <h2 class="text-center mb-4">All Date Ideas</h2>
    <div class="list-group">${dateCards}</div>
    <div class="d-flex justify-content-center mt-4">
    <button class="btn btn-lg btn-primary" id="backToMainBtn">Back to Main</button>
    </div>
    </div>
    `;
    document.getElementById('backToMainBtn').addEventListener('click', () => {
        renderMainView(false)
    }
);
}
