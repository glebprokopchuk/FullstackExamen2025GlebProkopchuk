import { Trip } from '../model/trip';
import database from './database';

// Get all trips - Gleb
const getAllTrips = async (): Promise<Trip[]> => {
    try {
        const tripsPrisma = await database.trip.findMany({
            include: {organiser: true, attendees: true},
        });
    return tripsPrisma.map((tripPrisma) => Trip.from(tripPrisma))
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.')
    }
};

// Get trip by id - Gleb
const getTripById = async ({id}: {id: number}): Promise<Trip | null> => {
    try {
        const tripPrisma = await database.trip.findUnique({
            where: {id},
            include: {organiser: true, attendees: true},
        });
        return tripPrisma ? Trip.from(tripPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};



export default {
    getAllTrips,
    getTripById,
};
