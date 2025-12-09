import React from "react"
import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  ChartContainer,
  ChartStyle,
  ChartTooltipContent,
  ChartLegendContent,
} from "./chart"

type ResponsiveChild = (context: { width: number; height: number }) => React.ReactNode

vi.mock("recharts", () => ({
  __esModule: true,
  ResponsiveContainer: ({ children }: { children: React.ReactNode | ResponsiveChild }) => (
    <div data-testid="responsive-container">
      {typeof children === "function" ? children({ width: 400, height: 300 }) : children}
    </div>
  ),
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-wrapper">{children}</div>
  ),
  Legend: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="legend-wrapper">{children}</div>
  ),
}))

const baseConfig = {
  sales: { label: "Ventas", color: "#f00" },
  profit: { label: "Beneficio", theme: { light: "#0f0", dark: "#00f" } },
};

describe("ChartStyle", () => {
  it("renders CSS variables for configured series", () => {
    const { container } = render(<ChartStyle id="chart-1" config={baseConfig} />);
    const style = container.querySelector("style");
    expect(style).toBeInTheDocument();
    const css = style?.innerHTML || "";
    expect(css).toContain("--color-sales: #f00;");
    expect(css).toContain("--color-profit: #0f0;");
    expect(css).toContain("--color-profit: #00f;");
  });
});

describe("ChartTooltipContent", () => {
  it("renders label and value with indicator", () => {
    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent
          active
          payload={[
            {
              name: "sales",
              value: 1200,
              dataKey: "sales",
              color: "#f00",
              payload: { fill: "#f00" },
              type: "dot",
            },
          ]}
        />
      </ChartContainer>
    );

    const ventaNodes = within(container).getAllByText("Ventas")
    expect(ventaNodes.length).toBeGreaterThan(0)
    expect(within(container).getByText(/1,?200/)).toBeInTheDocument();
  });
});

describe("ChartLegendContent", () => {
  it("renders legend items from payload", () => {
    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartLegendContent
          payload={[
            {
              value: "sales",
              dataKey: "sales",
              color: "#f00",
              type: "square",
            },
          ]}
        />
      </ChartContainer>
    );

    const legendItems = within(container).getAllByText("Ventas")
    expect(legendItems.length).toBeGreaterThan(0)
  });
});
