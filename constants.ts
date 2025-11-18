import React from 'react';
import type { ConverterCategory } from './types';
// Fix: Replaced JSX syntax with React.createElement to avoid parsing errors in .ts file.
import { LengthIcon, AreaIcon, VolumeIcon, WeightIcon, TemperatureIcon, TimeIcon, SpeedIcon, DataIcon, PowerIcon, EnergyIcon } from './components/icons';

export const CONVERTER_CATEGORIES: ConverterCategory[] = [
  {
    name: 'Length',
    icon: React.createElement(LengthIcon),
    units: [
      { name: 'Meter', symbol: 'm', factor: 1 },
      { name: 'Kilometer', symbol: 'km', factor: 1000 },
      { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { name: 'Mile', symbol: 'mi', factor: 1609.34 },
      { name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { name: 'Inch', symbol: 'in', factor: 0.0254 },
    ],
  },
  {
    name: 'Area',
    icon: React.createElement(AreaIcon),
    units: [
      { name: 'Square Meter', symbol: 'm²', factor: 1 },
      { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
      { name: 'Hectare', symbol: 'ha', factor: 10000 },
      { name: 'Acre', symbol: 'acre', factor: 4046.86 },
      { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
    ],
  },
  {
    name: 'Volume',
    icon: React.createElement(VolumeIcon),
    units: [
        { name: 'Liter', symbol: 'L', factor: 1 },
        { name: 'Milliliter', symbol: 'mL', factor: 0.001 },
        { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
        { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
        { name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
        { name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
        { name: 'Cup (US)', symbol: 'cup', factor: 0.24 },
        { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
    ],
  },
  {
    name: 'Mass/Weight',
    icon: React.createElement(WeightIcon),
    units: [
        { name: 'Kilogram', symbol: 'kg', factor: 1 },
        { name: 'Gram', symbol: 'g', factor: 0.001 },
        { name: 'Milligram', symbol: 'mg', factor: 0.000001 },
        { name: 'Tonne', symbol: 't', factor: 1000 },
        { name: 'Pound', symbol: 'lb', factor: 0.453592 },
        { name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
    ],
  },
   {
    name: 'Temperature',
    icon: React.createElement(TemperatureIcon),
    units: [
        { name: 'Celsius', symbol: '°C', factor: 1 }, // Base, but requires special logic
        { name: 'Fahrenheit', symbol: '°F', factor: 1 },
        { name: 'Kelvin', symbol: 'K', factor: 1 },
    ],
  },
  {
    name: 'Time',
    icon: React.createElement(TimeIcon),
    units: [
        { name: 'Second', symbol: 's', factor: 1 },
        { name: 'Millisecond', symbol: 'ms', factor: 0.001 },
        { name: 'Minute', symbol: 'min', factor: 60 },
        { name: 'Hour', symbol: 'hr', factor: 3600 },
        { name: 'Day', symbol: 'd', factor: 86400 },
        { name: 'Week', symbol: 'wk', factor: 604800 },
        { name: 'Month', symbol: 'mo', factor: 2628000 },
        { name: 'Year', symbol: 'yr', factor: 31536000 },
    ],
  },
  {
    name: 'Speed',
    icon: React.createElement(SpeedIcon),
    units: [
        { name: 'Meters per second', symbol: 'm/s', factor: 1 },
        { name: 'Kilometers per hour', symbol: 'km/h', factor: 0.277778 },
        { name: 'Miles per hour', symbol: 'mph', factor: 0.44704 },
        { name: 'Knot', symbol: 'kn', factor: 0.514444 },
    ],
  },
  {
    name: 'Data Storage',
    icon: React.createElement(DataIcon),
    units: [
        { name: 'Byte', symbol: 'B', factor: 1 },
        { name: 'Kilobyte', symbol: 'KB', factor: 1024 },
        { name: 'Megabyte', symbol: 'MB', factor: 1048576 },
        { name: 'Gigabyte', symbol: 'GB', factor: 1073741824 },
        { name: 'Terabyte', symbol: 'TB', factor: 1099511627776 },
        { name: 'Bit', symbol: 'b', factor: 0.125 },
    ],
  },
  {
    name: 'Energy',
    icon: React.createElement(EnergyIcon),
    units: [
        { name: 'Joule', symbol: 'J', factor: 1 },
        { name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
        { name: 'Calorie', symbol: 'cal', factor: 4.184 },
        { name: 'Kilocalorie', symbol: 'kcal', factor: 4184 },
        { name: 'Watt-hour', symbol: 'Wh', factor: 3600 },
    ],
  },
  {
    name: 'Power',
    icon: React.createElement(PowerIcon),
    units: [
        { name: 'Watt', symbol: 'W', factor: 1 },
        { name: 'Kilowatt', symbol: 'kW', factor: 1000 },
        { name: 'Megawatt', symbol: 'MW', factor: 1000000 },
        { name: 'Horsepower', symbol: 'hp', factor: 745.7 },
    ],
  }
];