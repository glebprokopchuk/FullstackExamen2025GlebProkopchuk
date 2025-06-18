import eventService from '../../service/event.service';
import eventDB from '../../repository/event.db';
import { Event } from '../../model/event';
import { User } from '../../model/user';

jest.mock('../../repository/event.db');

const mockEventDB = eventDB as jest.Mocked<typeof eventDB>;

const organiser = new User({
    id: 1,
    firstName: 'Test',
    lastName: 'Organiser',
    email: 'test@example.com',
    password: 'hashedpassword345',
    isOrganiser: true
});

const eventStartDate = new Date();
eventStartDate.setDate(eventStartDate.getDate() + 1);

const event1 = new Event({
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Test Event',
    description: 'Test event description',
    date: eventStartDate,
    location: 'Test Location',
    organiser: organiser,
    attendees: []
});

const event2 = new Event({
    id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Another Test Event',
    description: 'Another test event description',
    date: eventStartDate,
    location: 'Another Test Location',
    organiser: organiser,
    attendees: []
});

let mockGetAllEvents: jest.Mock;
let mockGetEventById: jest.Mock;

beforeEach(() => {
    mockGetAllEvents = jest.fn();
    mockGetEventById = jest.fn();

    mockEventDB.getAllEvents = mockGetAllEvents;
    mockEventDB.getEventById = mockGetEventById;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: events exist in database, when: getting all events, then: all events are returned', async () => {
    // Given
    mockGetAllEvents.mockResolvedValue([event1, event2]);

    // When
    const result = await eventService.getAllEvents();

    // Then
    expect(mockGetAllEvents).toHaveBeenCalledTimes(1);
    expect(result).toEqual([event1, event2]);
    expect(result).toHaveLength(2);
});

test('given: non-existing event ID, when: getting event by ID, then: an error is thrown', async () => {
    // Given
    const eventId = 999;
    mockGetEventById.mockResolvedValue(null);

    // Then
    const getEventById = async () => await eventService.getEventById({ id: eventId });

    // Then
    expect(getEventById).rejects.toThrow(`Event with id: ${eventId} does not exist.`);
});