import eventDB from '../repository/event.db';
import userDB from '../repository/user.db';
import { Event } from '../model/event';
import { User } from '../model/user';
import { EventInput, UserInput } from '../types';

// Get all events - Gleb
const getAllEvents = async (): Promise<Event[]> => eventDB.getAllEvents();

// Get event by ID - Gleb
const getEventById = async ({ id }: { id: number }): Promise<Event> => {
    const event = await eventDB.getEventById({ id });
    if (!event) {
        throw new Error(`Event with id: ${id} does not exist.`);
    }
    return event;
};

// Get events by organiser id - Gleb
const getEventsByOrganiserId = async ({organiserId}: { organiserId: number;}): Promise<Event[]> => {
    const organiser = await userDB.getUserById({ id: organiserId });
    if (!organiser || !organiser.getIsOrganiser()) {
        throw new Error(`User with id: ${organiserId} is not an organiser.`);
    }
    return eventDB.getEventsByOrganiserId({ organiserId });
};

// Get future events - Gleb
const getUpcomingEvents = async (): Promise<Event[]> => {
    const allEvents = await eventDB.getAllEvents();
    const now = new Date();
    return allEvents.filter((event) => event.getDate() > now);
};

// Create an event - Gleb
const createEvent = async ({name, description, date, location}: EventInput, organiser: User): Promise<Event> => {
    if (!organiser.getId()) {
        throw new Error('Organiser ID is required to create an event.');
    }
    const organiserId = await userDB.getUserById({ id: organiser.getId()! });

    if (!organiserId) {
        throw new Error('Organiser not found.');
    }
    if (!organiserId.getIsOrganiser()) {
        throw new Error('User is not an organiser.');
    }

    const existingEvent = await eventDB.getEventsByOrganiserId({ organiserId: organiserId.getId()! });
    const eventDate = new Date(date);
    const hasEventOnSameDate = existingEvent.some(event => {
        const existingDate = event.getDate();
        return existingDate.toDateString() === eventDate.toDateString();
    })

    if (hasEventOnSameDate) {
        throw new Error('You already have an experience scheduled on this date.');
    }

    const event = new Event ({
        createdAt: new Date(),
        updatedAt: new Date(),
        name,
        description,
        date: new Date(date),
        location,
        organiser: organiserId,
        attendees: [],
    });
    return await eventDB.createEvent(event);
};


export default {
    getAllEvents,
    getEventById,
    getEventsByOrganiserId,
    getUpcomingEvents,
    createEvent,
};
