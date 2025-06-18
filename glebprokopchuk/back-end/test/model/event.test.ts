import { Event } from '../../model/event';
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
    password: 'hashedpassword678',
    isOrganiser: false
});

const eventDate = new Date();
eventDate.setDate(eventDate.getDate() + 1);

test('given: valid values for event, when: event is created, then: event is created with those values', () => {
    // Given
    const eventData = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Test Event',
        description: 'Test event description',
        date: eventDate,
        location: 'Test Location',
        organiser: organiser,
        attendees: [attendee]
    };

    // When
    const event = new Event(eventData);

    // Then
    expect(event.getId()).toEqual(1);
    expect(event.getName()).toEqual('Test Event');
    expect(event.getDescription()).toEqual('Test event description');
    expect(event.getDate()).toEqual(eventDate);
    expect(event.getLocation()).toEqual('Test Location');
    expect(event.getOrganiser()).toEqual(organiser);
    expect(event.getAttendees()).toEqual([attendee]);
});

test('given: empty name, when: event is created, then: an error is thrown', () => {
    // Given
    const eventData = {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: '',
        description: 'Test event description',
        date: eventDate,
        location: 'Test Location',
        organiser: organiser,
        attendees: []
    };

    // When
    const createEvent = () => new Event(eventData);

    // Then
    expect(createEvent).toThrow('Event name is required');
});