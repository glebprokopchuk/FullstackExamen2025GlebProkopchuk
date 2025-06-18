import { Trip } from '../../model/trip';
import { User } from '../../model/user';

const organiser = new User({
    id: 1,
    firstName: 'Test',
    lastName: 'Organiser',
    email: 'test@example.com',
    password: 'hashedpassword345',
    isOrganiser: true
});

const attendee = new User({
    id: 2,
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: 'hashedpassword567',
    isOrganiser: false
});

const startDate = new Date();
const endDate = new Date();
endDate.setDate(endDate.getDate() + 2);

test('given: valid values for trip, when: trip is created, then: trip is created with those values', () => {
    // Given
    const tripData = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        destination: 'Test City',
        startDate: startDate,
        endDate: endDate,
        description: 'Test trip description',
        organiser: organiser,
        attendees: [attendee]
    };

    // When
    const trip = new Trip(tripData);

    // Then
    expect(trip.getId()).toEqual(1);
    expect(trip.getDestination()).toEqual('Test City');
    expect(trip.getStartDate()).toEqual(startDate);
    expect(trip.getEndDate()).toEqual(endDate);
    expect(trip.getDescription()).toEqual('Test trip description');
    expect(trip.getOrganiser()).toEqual(organiser);
    expect(trip.getAttendees()).toEqual([attendee]);
});

test('given: empty destination, when: trip is created, then: an error is thrown', () => {
    // Given
    const tripData = {
        createdAt: new Date(),
        updatedAt: new Date(),
        destination: '',
        startDate: startDate,
        endDate: endDate,
        description: 'Test trip description',
        organiser: organiser,
        attendees: []
    };

    // When
    const createTrip = () => new Trip(tripData);

    // Then
    expect(createTrip).toThrow('Destination is required');
});