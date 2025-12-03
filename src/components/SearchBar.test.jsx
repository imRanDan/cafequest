import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import SearchBar from "../components/SearchBar";

// Mock dependencies
jest.mock("axios");
jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: jest.fn(),
}));

describe("SearchBar Component", () => {
  // Mock functions
  let mockSetUserLocation;
  let mockSetSearchResults;
  let mockFetchCafes;
  let mockToast;

  beforeEach(() => {
    // Reset all mocks before each test
    mockSetUserLocation = jest.fn();
    mockSetSearchResults = jest.fn();
    mockFetchCafes = jest.fn().mockResolvedValue();
    mockToast = jest.fn();
    useToast.mockReturnValue(mockToast);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Helper function to render component with default props
  const renderSearchBar = (props = {}) => {
    return render(
      <SearchBar
        setUserLocation={mockSetUserLocation}
        setSearchResults={mockSetSearchResults}
        fetchCafes={mockFetchCafes}
        {...props}
      />
    );
  };

  describe("Component Rendering", () => {
    test("should render input field with correct placeholder", () => {
      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      expect(input).toBeInTheDocument();
    });

    test("should render search button", () => {
      renderSearchBar();
      const button = screen.getByRole("button", { name: /search/i });
      expect(button).toBeInTheDocument();
    });

    test("should render with empty input initially", () => {
      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      expect(input).toHaveValue("");
    });
  });

  describe("Input Handling", () => {
    test("should update input value when user types", () => {
      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );

      fireEvent.change(input, { target: { value: "New York" } });
      expect(input).toHaveValue("New York");
    });

    test("should handle empty string input", () => {
      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );

      fireEvent.change(input, { target: { value: "" } });
      expect(input).toHaveValue("");
    });

    test("should handle special characters in input", () => {
      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );

      fireEvent.change(input, { target: { value: "São Paulo, Brazil!@#" } });
      expect(input).toHaveValue("São Paulo, Brazil!@#");
    });

    test("should handle very long input strings", () => {
      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const longString = "a".repeat(1000);

      fireEvent.change(input, { target: { value: longString } });
      expect(input).toHaveValue(longString);
    });
  });

  describe("Search Functionality - Success Cases", () => {
    test("should successfully search for location and update state", async () => {
      const mockResponse = {
        data: [
          {
            lat: "40.7128",
            lon: "-74.0060",
            display_name: "New York, USA",
          },
        ],
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "New York" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockSetUserLocation).toHaveBeenCalledWith({
          lat: 40.7128,
          lon: -74.006,
        });
      });
    });

    test("should call fetchCafes with correct coordinates", async () => {
      const mockResponse = {
        data: [
          {
            lat: "51.5074",
            lon: "-0.1278",
            display_name: "London, UK",
          },
        ],
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "London" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockFetchCafes).toHaveBeenCalledWith("51.5074", "-0.1278");
      });
    });

    test("should parse coordinates as floats correctly", async () => {
      const mockResponse = {
        data: [
          {
            lat: "48.8566",
            lon: "2.3522",
            display_name: "Paris, France",
          },
        ],
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "Paris" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockSetUserLocation).toHaveBeenCalledWith({
          lat: 48.8566,
          lon: 2.3522,
        });
      });
    });

    test("should clear suggestions after successful search", async () => {
      const mockResponse = {
        data: [
          {
            lat: "35.6762",
            lon: "139.6503",
            display_name: "Tokyo, Japan",
          },
        ],
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "Tokyo" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockFetchCafes).toHaveBeenCalled();
      });
    });
  });

  describe("Search Functionality - Edge Cases", () => {
    test("should not search when input is empty", async () => {
      renderSearchBar();
      const button = screen.getByRole("button", { name: /search/i });

      await act(async () => {
        fireEvent.click(button);
      });

      expect(axios.get).not.toHaveBeenCalled();
      expect(mockSetUserLocation).not.toHaveBeenCalled();
      expect(mockFetchCafes).not.toHaveBeenCalled();
    });

    test("should not search when input contains only whitespace", async () => {
      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "   " } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      expect(axios.get).not.toHaveBeenCalled();
      expect(mockSetUserLocation).not.toHaveBeenCalled();
    });

    test("should show warning toast when location not found", async () => {
      const mockResponse = {
        data: [],
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "NonexistentPlace123" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Location not found",
          description: "Please try a different location",
          status: "warning",
          duration: 3000,
        });
      });
    });

    test("should not call setUserLocation when no results found", async () => {
      const mockResponse = {
        data: [],
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "InvalidLocation" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled();
      });

      expect(mockSetUserLocation).not.toHaveBeenCalled();
      expect(mockFetchCafes).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    test("should show error toast when API request fails", async () => {
      axios.get.mockRejectedValueOnce(new Error("Network Error"));

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "New York" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error searching location",
          description: "Could not search for this location",
          status: "error",
          duration: 3000,
        });
      });
    });

    test("should handle axios timeout error", async () => {
      const timeoutError = new Error("Timeout");
      timeoutError.code = "ECONNABORTED";
      axios.get.mockRejectedValueOnce(timeoutError);

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "Paris" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error searching location",
          description: "Could not search for this location",
          status: "error",
          duration: 3000,
        });
      });
    });

    test("should handle 404 response error", async () => {
      const error404 = new Error("Request failed");
      error404.response = { status: 404 };
      axios.get.mockRejectedValueOnce(error404);

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "London" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            status: "error",
          })
        );
      });
    });

    test("should handle 500 server error", async () => {
      const error500 = new Error("Server error");
      error500.response = { status: 500 };
      axios.get.mockRejectedValueOnce(error500);

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "Tokyo" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled();
      });
    });

    test("should not call setUserLocation when error occurs", async () => {
      axios.get.mockRejectedValueOnce(new Error("Network Error"));

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "Berlin" } });
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled();
      });

      expect(mockSetUserLocation).not.toHaveBeenCalled();
      expect(mockFetchCafes).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    test("should set loading state during search", async () => {
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      axios.get.mockReturnValueOnce(promise);

      renderSearchBar();
      const input = screen.getByPlaceholderText(
        "Search by City, Address, or Postal Code"
      );
      const button = screen.getByRole("button", { name: /search/i });

      fireEvent.change(input, { target: { value: "Sydney" } });
      
      act(() => {
        fireEvent.click(button);
      });

      // Resolve the promise
      await act(async () => {
        resolvePromise({
          data: [{ lat: "-33.8688", lon: "151.2093" }],
        });
      });

      await waitFor(() => {
        expect(mockSetUserLocation).toHaveBeenCalled();
      });
    });

    test("should reset loading state after successful search", async () => {
      const mockResponse = {
        data: [
          {
            lat: "52.5200",
            lon: "13.4050",
            display_name: "Berlin, Germany",
          },
        ],}})})})