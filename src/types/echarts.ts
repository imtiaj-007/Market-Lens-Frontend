// Type for ECharts formatter params, can be expanded as needed
// Based on common properties, specific charts might have more or fewer.
export interface EChartsFormatterParam {
  componentType?: 'series';
  seriesType?: string;
  seriesIndex?: number;
  seriesName?: string;
  name?: string; // Typically category name or data item name
  dataIndex?: number;
  value?: number | string | number[] | object; // Value of the data item
  data?: unknown; // Raw data item, using unknown for better type safety than any
  color?: string;
  percent?: number; // For pie charts
  $vars?: string[];
  marker?: string; // HTML string for legend marker
  // Add other properties as encountered or needed from ECharts documentation
}

// For tooltips that receive an array of params (e.g., axis trigger)
export type EChartsFormatterParams = EChartsFormatterParam | EChartsFormatterParam[]; 