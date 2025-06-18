import tripService from '../../service/trip.service';
import tripDB from '../../repository/trip.db';
import { Trip } from '../../model/trip';
import { User } from '../../model/user';

jest.mock('../../repository/trip.db');

const mockTripDB = tripDB as jest.Mocked<typeof tripDB>;

const organiser = new User({
    id: 1,
    firstName: 'Test',
    lastName: 'Organiser',
    email: 'test@example.com',
    password: 'hashedpassword345',
    isOrganiser: true
});

const startDate = new Date();
const endDate = new Date();
endDate.setDate(endDate.getDate() + 2);

const trip1 = new Trip({
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    destination: 'Test City',
    startDate: startDate,
    endDate: endDate,
    description: 'Test trip description',
    organiser: organiser,
    attendees: []
});

const trip2 = new Trip({
    id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    destination: 'Another Test City',
    startDate: startDate,
    endDate: endDate,
    description: 'Another test trip description',
    organiser: organiser,
    attendees: []
});

let mockGetAllTrips: jest.Mock;
let mockGetTripById: jest.Mock;

beforeEach(() => {
    mockGetAllTrips = jest.fn();
    mockGetTripById = jest.fn();

    mockTripDB.getAllTrips = mockGetAllTrips;
    mockTripDB.getTripById = mockGetTripById;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: trips exist in database, when: getting all trips, then: all trips are returned', async () => {
    // Given
    mockGetAllTrips.mockResolvedValue([trip1, trip2]);

    // When
    const result = await tripService.getAllTrips();

    // Then
    expect(mockGetAllTrips).toHaveBeenCalledTimes(1);
    expect(result).toEqual([trip1, trip2]);
    expect(result).toHaveLength(2);
});

test('given: non-existing trip ID, when: getting trip by ID, then: an error is thrown', async () => {
    // Given
    const tripId = 999;
    mockGetTripById.mockResolvedValue(null);

    // When
    const getTripById = async () => await tripService.getTripById({ id: tripId });

    // Then
    expect(getTripById).rejects.toThrow(`Trip with id: ${tripId} does not exist.`);
});