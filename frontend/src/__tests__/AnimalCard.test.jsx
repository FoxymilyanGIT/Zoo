import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AnimalCard } from "../components/AnimalCard";

describe("AnimalCard", () => {
  it("renders animal info", () => {
    const animal = {
      id: 1,
      name: "Лев",
      species: "Panthera leo",
      zone: "Саванна",
      imageUrls: ["/lion.jpg"]
    };
    render(
      <MemoryRouter>
        <AnimalCard animal={animal} />
      </MemoryRouter>
    );
    expect(screen.getByText("Лев")).toBeInTheDocument();
    expect(screen.getByText("Panthera leo")).toBeInTheDocument();
    expect(screen.getByText("Саванна")).toBeInTheDocument();
  });
});



