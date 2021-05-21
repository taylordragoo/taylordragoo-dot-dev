import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsmobile from 'aws-exports';

Amplify.configure(awsmobile);

import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";

/*
Find all the unique counter id on the page.
Send a single hit request for each unique ID.
Subscribe to all updates for each one as well.
*/

const init = function createUpdateCounters() {
    console.log("this has been called")
    const countersToUpdate = document.querySelectorAll(`[data-counter-id]`);
    const counterHitIdSet = new Set();

    countersToUpdate.forEach((counter) => {
        counterHitIdSet.add(counter.dataset.counterId);
    })

    counterHitIdSet.forEach((id) => {
        hitCounter(id);
    });
}

/*
Send a mutation to your GraphQL to let it know we hit it.
This also means we get back the current count, including our own hit.
*/
async function hitCounter(id) {
    const counter = await API.graphql(graphqlOperation(mutations.hit, { input: { id } }));
    updateText(counter.data.hit)
    subscribeCounter(id)
}

function updateText(counter) {
    const countersToUpdate = document.querySelectorAll(`[data-counter-id=${counter.id}]`);
    countersToUpdate.forEach(function (elem) {
        // elem.innerHTML = counter.hits;
        console.log(counter.hits.ToString())
    })
}

/*
Subscribe via WebSockets to all future updates for the counters
we have on this page.
*/
function subscribeCounter(id) {
    const subscription = API.graphql(
        graphqlOperation(subscriptions.hits, { id })
    ).subscribe({
        next: (counter) => updateText(counter.value.data.hits)
    });
}

// On dom loaded, kick things off
document.addEventListener("DOMContentLoaded", function () {
    console.log("this has also been called")
    init();
});