// repository.js

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const sbClient = supabase.createClient(supabaseUrl, supabaseKey);

export async function loadDates() {
    const { data, error } = await sbClient.from('date_ideas').select('*');
    if (error) {
        console.error("Error loading dates:", error);
        return [];
    }
    return data;
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
