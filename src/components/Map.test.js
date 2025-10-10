// MapComponent.test.js

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MapComponent from './Map';
import { useToast } from '@chakra-ui/react';

// Mock dependencies
jest.mock('react-map-gl', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="map">{children}</div>,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children, onClose }) => (
    <div data-testid="popup">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: jest.fn(),
}));

jest.mock('../config/firebase', () => ({
  auth: { currentUser: null },
  db: {},
}));

describe('MapComponent', () => {
  const mockProps = {
    userLocation: { lat: 43.6532, lon: -79.3832 },
    results: [
      {
        id: 1,
        lat: 43.6532,
        lon: -79.3832,
        tags: { 
          name: 'Test Cafe',
          'addr:housenumber': '123',
          'addr:street': 'Main St',
          opening_hours: 'Mo-Su 08:00-22:00'
        }
      }
    ],
    setUserLocation: jest.fn(),
    fetchCafes: jest.fn(),
    hideTimHortons: false,
    hideStarbucks: false,
    openLate: false,
  };

  // TEST 1: Basic rendering
  test('renders map component with markers', () => {
    render(<MapComponent {...mockProps} />);
    
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getAllByTestId('marker')).toHaveLength(1);
  });

  // TEST 2: Filter logic - Tim Hortons
  test('filters out Tim Hortons when hideTimHortons is true', () => {
    const propsWithTimHortons = {
      ...mockProps,
      results: [
        { ...mockProps.results[0], tags: { name: 'Tim Hortons' } },
        { ...mockProps.results[0], id: 2, tags: { name: 'Regular Cafe' } }
      ],
      hideTimHortons: true,
    };

    render(<MapComponent {...propsWithTimHortons} />);
    
    // Should only show 1 marker (Regular Cafe), not Tim Hortons
    expect(screen.getAllByTestId('marker')).toHaveLength(1);
  });

  // TEST 3: Filter logic - Starbucks
  test('filters out Starbucks when hideStarbucks is true', () => {
    const propsWithStarbucks = {
      ...mockProps,
      results: [
        { ...mockProps.results[0], tags: { name: 'Starbucks' } },
        { ...mockProps.results[0], id: 2, tags: { name: 'Local Cafe' } }
      ],
      hideStarbucks: true,
    };

    render(<MapComponent {...propsWithStarbucks} />);
    
    expect(screen.getAllByTestId('marker')).toHaveLength(1);
  });

  // TEST 4: Open late filter logic
  test('filters cafes by opening hours when openLate is true', () => {
    const propsWithMixedHours = {
      ...mockProps,
      results: [
        { ...mockProps.results[0], id: 1, tags: { name: 'Early Cafe', opening_hours: '08:00-18:00' } },
        { ...mockProps.results[0], id: 2, tags: { name: 'Late Cafe', opening_hours: '08:00-23:00' } }
      ],
      openLate: true,
    };

    render(<MapComponent {...propsWithMixedHours} />);
    
    // Should only show the cafe open until 23:00
    expect(screen.getAllByTestId('marker')).toHaveLength(1);
  });

  // TEST 5: Save cafe requires authentication
  test('renders map with no cafes when results are empty', () => {
    const propsWithNoResults = {
        ...mockProps,
        results: [],
    };

    render(<MapComponent {...propsWithNoResults} />);

    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByText('Show cafes near me')).toBeInTheDocument();

    //No markers should be rendered here
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  })
});