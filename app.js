// app.js
import { renderMainView, renderLoginView, renderAddDateView, renderAllDatesView } from './views.js';
import { restoreSession } from './auth.js';

(async function init() {
    const { user, error } = await restoreSession();
    if (user) {
        renderMainView();

    } else {
        console.warn(error);
        renderLoginView();
    }
})();
