import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CafeCard from "./CafeCard";

// 👇 Mock Chakra's Image so it behaves like a normal <img> in Jest
jest.mock("@chakra-ui/react", () => {
  const original = jest.requireActual("@chakra-ui/react");
  return {
    ...original,
    Image: (props) => <img {...props} />,
  };
});

const sampleCafe = {
  name: "Pilot Coffee",
  address: "123 Queen St",
  description: "Great spot for cold brew",
  openingHours: "8am - 6pm",
  image: "https://placekitten.com/200/300",
};

describe("CafeCard", () => {
  test("renders cafe details", () => {
    render(<CafeCard cafe={sampleCafe} />);

    expect(screen.getByText("Pilot Coffee")).toBeInTheDocument();
    expect(screen.getByText("123 Queen St")).toBeInTheDocument();
    expect(screen.getByText("Great spot for cold brew")).toBeInTheDocument();
    expect(screen.getByText("8am - 6pm")).toBeInTheDocument();

    // ✅ Should now pass, because Image is mocked as <img>
    expect(screen.getByRole("img")).toHaveAttribute("src", sampleCafe.image);
  });

  test("renders fallback text when data missing", () => {
    render(<CafeCard cafe={{}} />);

    expect(screen.getByText("Unnamed Cafe")).toBeInTheDocument();
    expect(screen.getByText("Address not available")).toBeInTheDocument();
    expect(screen.getByText("No description available")).toBeInTheDocument();
  });

  test("calls onDelete when delete button is clicked", () => {
    const handleDelete = jest.fn();
    render(<CafeCard cafe={sampleCafe} onDelete={handleDelete} />);

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});