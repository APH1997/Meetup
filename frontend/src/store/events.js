import {csrfFetch} from './csrf';

const LOAD_EVENTS = "events/loadGroups";
const LOAD_ONE_EVENT = "events/loadGroup";
const CREATE_EVENT = "events/createGroup";
const CREATE_EVENT_IMAGE = "events/createImage";
const EDIT_EVENT = "events/editGroup";
const DELETE_EVENT = "events/deleteGroup";



export const getEventsAction = (events) => {
    return {
        type: LOAD_EVENTS,
        payload: events
    }
}
export const getEventsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/events');
    const data = await response.json();

    if (response.ok){
        dispatch(getEventsAction(data));
        return response;
    } else {
        return response;
    }
}

export const getOneEventAction = (event) => {
    return {
        type: LOAD_ONE_EVENT,
        payload: event
    }
}

export const getOneEventThunk = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`);
    const data = await response.json();
    if (response.ok){
        dispatch(getOneEventAction(data));
        return response;
    } else {
        return response;
    }
}

export const createEventAction = (newEvent) => {
    return {
        type: CREATE_EVENT,
        payload: newEvent
    }
}
export const createEventThunk = (event, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(event)
    })
    const data = await response.json();
    if (response.ok){
        await dispatch(createEventAction(data));
        return data;
    } else return data;
}

export const updateEventAction = (event) => {
    return {
        type: EDIT_EVENT,
        payload: event
    }
}
export const updateEventThunk = (event, eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}` , {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(event)
    });
    const data = await response.json();
    if (response.ok){
        await dispatch(updateEventAction(data));
        return data
    }  else return response;

}

export const deleteEventAction = (eventId) => {
    return {
        type: DELETE_EVENT,
        payload: eventId,
    }
}
export const deleteEventThunk = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: "DELETE",
    });
    const data = await response.json();
    if (response.ok){
        await dispatch(deleteEventAction(eventId));
        return data;
    } else return response;
}

export const createEventImageAction = (image) => {
    return {
        type: CREATE_EVENT_IMAGE,
        payload: image
    }
}
export const createEventImageThunk = (eventId, image) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(image)
    });
    const data = await response.json();
    if (response.ok){
        await dispatch(createEventImageAction(image));
        return data;
    } else return response;
}


const initialState = {allEvents: {}, singleEvent: {}};
const eventsReducer = (state = initialState, action) => {
    switch (action.type){
        case LOAD_EVENTS: {
            const newState = {...state, allEvents:{...state.allEvents}, singleEvent:{...state.singleEvent}}
            newState.allEvents = {};
            action.payload.Events.forEach((event => {
                newState.allEvents[event.id] = event;
            }))
            newState.singleEvent = {};
            return newState;
        }
        case LOAD_ONE_EVENT:{
            const newState = {...state, allEvents:{...state.allEvents}, singleEvent:{...state.singleEvent}}
            newState.singleEvent = action.payload;
            return newState;
        }
        case CREATE_EVENT:{
            const newState = {...state, allEvents:{...state.allEvents}, singleEvent:{...state.singleEvent}}
            newState.allEvents[action.payload.id] = action.payload
            return newState;
        }
        case EDIT_EVENT:{
            return state;
        }
        case DELETE_EVENT:{
            const newState = {...state, allEvents:{...state.allEvents}, singleEvent:{...state.singleEvent}};
            delete newState.allEvents[action.payload];
            return newState;
        }
        default:
            return state;
    }
}

export default eventsReducer;
