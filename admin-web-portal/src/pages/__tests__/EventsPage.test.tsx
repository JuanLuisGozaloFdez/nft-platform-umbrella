import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventsPage from '../EventsPage';
import * as i18n from '../../i18n';
import { LocaleProvider } from '../../context/LocaleContext';

// Mock translation hook
vi.spyOn(i18n, 'useT').mockReturnValue((key: string) => key);

vi.mock('../../components/EventsList', () => ({
  default: ({ onEdit }: any) => <div data-testid="events-list" onClick={() => onEdit('test-id')}>EventsList</div>,
}));
vi.mock('../../components/EventForm', () => ({
  default: ({ editingId, onDone }: any) => (
    <div data-testid="event-form">
      EventForm {editingId}
      <button onClick={onDone}>Done</button>
    </div>
  ),
}));

describe('EventsPage', () => {
  it('renders title and new event button', () => {
    const { getByText } = render(
      <LocaleProvider>
        <EventsPage />
      </LocaleProvider>
    );
    expect(getByText('events_title')).toBeInTheDocument();
    expect(getByText('events_new')).toBeInTheDocument();
  });

  it('shows form when new event button is clicked', () => {
    const { getByText, getByTestId } = render(
      <LocaleProvider>
        <EventsPage />
      </LocaleProvider>
    );
    fireEvent.click(getByText('events_new'));
    expect(getByTestId('event-form')).toBeInTheDocument();
  });

  it('shows form when editing from EventsList', () => {
    const { getByTestId } = render(
      <LocaleProvider>
        <EventsPage />
      </LocaleProvider>
    );
    fireEvent.click(getByTestId('events-list'));
    expect(getByTestId('event-form')).toBeInTheDocument();
  });

  it('hides form after done', () => {
    const { getByText, queryByTestId } = render(
      <LocaleProvider>
        <EventsPage />
      </LocaleProvider>
    );
    fireEvent.click(getByText('events_new'));
    fireEvent.click(getByText('Done'));
    expect(queryByTestId('event-form')).not.toBeInTheDocument();
  });
});
