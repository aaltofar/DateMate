// repository.js
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
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const sbClient = supabase.createClient(supabaseUrl, supabaseKey);

export async function loadDates(demo = false) {
    if (demo)
        return dateIdeasPlaceholders;
    else{
        const { data, error } = await sbClient.from('date_ideas').select('*');
        if (error) {
            console.error("Error loading dates:", error);
            return [];
        }
        return data;
    }
}

export async function addDateIdea(title, description) {
    const { data, error } = await sbClient.from('date_ideas').insert({
        done: false,
        ideaTitle: title,
        votedBy: '',
        description: description
    });
    if (error) console.error("Error adding date idea:", error);
    return data;
}

export async function signIn(email, password) {
    return await sbClient.auth.signInWithPassword({ email, password });
}

export async function setSession(session) {
    return await sbClient.auth.setSession(session);
}

export async function signOut() {
    return await sbClient.auth.signOut();
}
