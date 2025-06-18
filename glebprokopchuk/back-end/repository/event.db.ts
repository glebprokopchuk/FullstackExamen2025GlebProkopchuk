import { Event } from '../model/event';
import database from './database';

// Get all events - Gleb
const getAllEvents = async (): Promise<Event[]> => {
    try {
        const eventsPrisma = await database.event.findMany({
            include: {organiser: true, attendees: true},
        });
    return eventsPrisma.map((eventPrisma) => Event.from(eventPrisma))
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

// Get event by id - Gleb
const getEventById = async ({id}: {id: number}) => {
    try {
        const eventPrisma = await database.event.findUnique({
            where: {id},
            include: {organiser: true, attendees: true},
        });
    return eventPrisma ? Event.from(eventPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

// Get events by organiser id - Gleb
const getEventsByOrganiserId = async ({organiserId,}: { organiserId: number;}): Promise<Event[]> => {
    try {
        const eventsPrisma = await database.event.findMany({
            where: { organiserId },
            include: {
                organiser: true,
                attendees: true,
            },
        });
        return eventsPrisma.map((eventPrisma) => Event.from(eventPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

// Create event - Gleb
const createEvent = async (event: Event): Promise<Event> => {
    try {
        const eventPrisma = await database.event.create({
            data: {
                name: event.getName(),
                description: event.getDescription(),
                date: event.getDate(),
                location: event.getLocation(),
                organiserId: event.getOrganiser().getId()!,
            },
            include: {organiser: true, attendees: true},
        });
        return Event.from(eventPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllEvents,
    getEventById,
    getEventsByOrganiserId,
    createEvent,
};
