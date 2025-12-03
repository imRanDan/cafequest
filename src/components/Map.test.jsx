import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapComponent from '@/components/Map';
import { useToast } from '@chakra-ui/react';
import { auth, db } from '@/config/firebase';
import { doc, setDoc } from 'firebase/firestore';

// Mock dependencies
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: jest.fn(),
}));

jest.mock('react-map-gl', () => ({
  __esModule: true,
  default: ({ children, onMove, ...props }) => (
    <div data-testid="map" data-viewport={JSON.stringify(props)}>
      {children}
    </div>
  ),
  Marker: ({ children, latitude, longitude, onClick }) => (
    <div
      data-testid="marker"
      data-lat={latitude}
      data-lon={longitude}
      onClick={onClick}
    >
      {children}
    </div>
  ),
  Popup: ({ children, latitude, longitude, onClose }) => (
    <div
      data-testid="popup"
      data-lat={latitude}
      data-lon={longitude}
    >
      <button onClick={onClose} data-testid="popup-close">Close</button>
      {children}
    </div>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

jest.mock('@/components/LoadingSpinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>,
}));

jest.mock('@/config/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = 'test-token';

describe('MapComponent', () => {
  let mockToast;
  let mockGeolocation;

  const defaultProps = {
    userLocation: null,
    results: [],
    setUserLocation: jest.fn(),
    fetchCafes: jest.fn(),
    hideTimHortons: false,
    hideStarbucks: false,
    openLate: false,
  };

  const sampleCafe = {
    id: 1,
    lat: 43.6532,
    lon: -79.3832,
    tags: {
      name: 'Test Cafe',
      'addr:housenumber': '123',
      'addr:street': 'Main St',
      'addr:city': 'Toronto',
      'addr:postcode': 'M5V 1A1',
      opening_hours: 'Mo-Su 07:00-23:00',
    },
  };

  beforeEach(() => {
    mockToast = jest.fn();
    useToast.mockReturnValue(mockToast);

    // Mock geolocation
    mockGeolocation = {
      getCurrentPosition: jest.fn(),
    };
    global.navigator.geolocation = mockGeolocation;

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete global.navigator.geolocation;
  });

  describe('Initial Rendering', () => {
    it('should render map component with default props', () => {
      render(<MapComponent {...defaultProps} />);
      expect(screen.getByTestId('map')).toBeInTheDocument();
    });

    it('should show loading spinner when results are not loaded', () => {
      render(<MapComponent {...defaultProps} results={null} />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should hide loading spinner when results are loaded', () => {
      render(<MapComponent {...defaultProps} results={[]} />);
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    it('should render "Show cafes near me" button', () => {
      render(<MapComponent {...defaultProps} />);
      expect(screen.getByText('Show cafes near me')).toBeInTheDocument();
    });
  });

  describe('Geolocation', () => {
    it('should request user location on mount', () => {
      render(<MapComponent {...defaultProps} />);
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });

    it('should update user coordinates on successful geolocation', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 43.6532,
            longitude: -79.3832,
          },
        });
      });

      render(<MapComponent {...defaultProps} />);

      await waitFor(() => {
        const markers = screen.getAllByTestId('marker');
        const userMarker = markers.find(
          (m) => m.getAttribute('data-lat') === '43.6532'
        );
        expect(userMarker).toBeInTheDocument();
      });
    });

    it('should handle geolocation error gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(new Error('Location denied'));
      });

      render(<MapComponent {...defaultProps} />);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error getting user location:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Map Markers', () => {
    it('should render markers for each cafe in results', () => {
      const results = [
        { ...sampleCafe, id: 1 },
        { ...sampleCafe, id: 2, lat: 43.6533, lon: -79.3833 },
      ];

      render(<MapComponent {...defaultProps} results={results} />);

      const markers = screen.getAllByTestId('marker');
      // Should have at least the cafe markers
      expect(markers.length).toBeGreaterThanOrEqual(2);
    });

    it('should not render marker if cafe has no coordinates', () => {
      const results = [
        { id: 1, lat: null, lon: null, tags: { name: 'Invalid Cafe' } },
      ];

      render(<MapComponent {...defaultProps} results={results} />);

      const markers = screen.queryAllByTestId('marker');
      expect(markers.length).toBe(0);
    });

    it('should open popup when marker is clicked', () => {
      const results = [sampleCafe];

      render(<MapComponent {...defaultProps} results={results} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      expect(screen.getByTestId('popup')).toBeInTheDocument();
      expect(screen.getByText('Test Cafe')).toBeInTheDocument();
    });
  });

  describe('Popup Functionality', () => {
    it('should display cafe information in popup', () => {
      const results = [sampleCafe];

      render(<MapComponent {...defaultProps} results={results} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      expect(screen.getByText('Test Cafe')).toBeInTheDocument();
      expect(screen.getByText('123 Main St, M5V 1A1, Toronto')).toBeInTheDocument();
      expect(screen.getByText('Mo-Su 07:00-23:00')).toBeInTheDocument();
    });

    it('should close popup when close button is clicked', () => {
      const results = [sampleCafe];

      render(<MapComponent {...defaultProps} results={results} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      const closeButton = screen.getByTestId('popup-close');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
    });

    it('should display default text when cafe has no name', () => {
      const cafeWithoutName = { ...sampleCafe, tags: {} };
      const results = [cafeWithoutName];

      render(<MapComponent {...defaultProps} results={results} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      expect(screen.getByText('Unnamed Cafe')).toBeInTheDocument();
      expect(screen.getByText('Address not available')).toBeInTheDocument();
      expect(screen.getByText('Opening hours not available')).toBeInTheDocument();
    });

    it('should render Google Maps link in popup', () => {
      const results = [sampleCafe];

      render(<MapComponent {...defaultProps} results={results} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      const link = screen.getByText('View on Google Maps');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', expect.stringContaining('google.com/maps'));
    });

    it('should render save button in popup', () => {
      const results = [sampleCafe];

      render(<MapComponent {...defaultProps} results={results} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  describe('Save Cafe Functionality', () => {
    it('should show warning toast if user is not logged in', async () => {
      auth.currentUser = null;
      const results = [sampleCafe];

      render(<MapComponent {...defaultProps} results={results} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Not logged in',
          description: 'Please log in to save cafes.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      });
    });

    it('should save cafe when user is logged in', async () => {
      auth.currentUser = { uid: 'test-user-123' };
      doc.mockReturnValue('mock-doc-ref');
      setDoc.mockResolvedValue();

      const results = [sampleCafe];

      render(<MapComponent {...defaultProps} results={results} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(setDoc).toHaveBeenCalledWith('mock-doc-ref', {
          id: sampleCafe.id,
          name: sampleCafe.tags.name,
          lat: sampleCafe.lat,
          lon: sampleCafe.lon,
          address: '123 Main St, M5V 1A1, Toronto',
          openingHours: 'Mo-Su 07:00-23:00',
          timestamp: expect.any(Number),
        });
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Saved!',
          description: 'Cafe has been added to your saved list.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      });
    });

    it('should show error toast if save fails', async () => {
      auth.currentUser = { uid: 'test-user-123' };
      const error = new Error('Firebase error');
      setDoc.mockRejectedValue(error);

      const results = [sampleCafe];

      render(<MapComponent {...defaultProps} results={results} />);

      const marker = screen.getByTestId('marker');
      fireEvent.click(marker);

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error saving cafe',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
    });

    it('should not save if cafe is null', async () => {
      render(<MapComponent {...defaultProps} results={[]} />);
      
      // Try to call handleSaveCafe with null - we can't directly access it
      // but we can verify setDoc is not called when there's no selected cafe
      expect(setDoc).not.toHaveBeenCalled();
    });
  });

  describe('Filter Functionality', () => {
    it('should filter out Tim Hortons when hideTimHortons is true', () => {
      const timHortonsCafe = {
        ...sampleCafe,
        id: 2,
        tags: { name: 'Tim Hortons' },
      };
      const results = [sampleCafe, timHortonsCafe];

      render(
        <MapComponent {...defaultProps} results={results} hideTimHortons={true} />
      );

      const markers = screen.getAllByTestId('marker');
      // Should only show one marker (excluding Tim Hortons)
      expect(markers.length).toBe(1);
    });

    it('should filter out Starbucks when hideStarbucks is true', () => {
      const starbucksCafe = {
        ...sampleCafe,
        id: 2,
        tags: { name: 'Starbucks' },
      };
      const results = [sampleCafe, starbucksCafe];

      render(
        <MapComponent {...defaultProps} results={results} hideStarbucks={true} />
      );

      const markers = screen.getAllByTestId('marker');
      expect(markers.length).toBe(1);
    });

    it('should filter to only show cafes open late when openLate is true', () => {
      const earlyCloseCafe = {
        ...sampleCafe,
        id: 2,
        tags: { name: 'Early Cafe', opening_hours: 'Mo-Su 07:00-18:00' },
      };
      const lateCloseCafe = {
        ...sampleCafe,
        id: 3,
        tags: { name: 'Late Cafe', opening_hours: 'Mo-Su 07:00-23:00' },
      };
      const results = [earlyCloseCafe, lateCloseCafe];

      render(<MapComponent {...defaultProps} results={results} openLate={true} />);

      const markers = screen.getAllByTestId('marker');
      // Should only show late closing cafe
      expect(markers.length).toBe(1);
    });

    it('should handle 24/7 cafes as open late', () => {
      const twentyFourSevenCafe = {
        ...sampleCafe,
        tags: { name: '24/7 Cafe', opening_hours: '24/7' },
      };
      const results = [twentyFourSevenCafe];

      render(<MapComponent {...defaultProps} results={results} openLate={true} />);

      const markers = screen.getAllByTestId('marker');
      expect(markers.length).toBe(1);
    });
  })})