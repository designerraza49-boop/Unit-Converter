import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ConverterCategory, Unit, Tool, Calculator, AiFeature } from './types';
import { CONVERTER_CATEGORIES } from './constants';
import * as Icons from './components/icons';
import { getNaturalLanguageConversion, generateImage, ConversionResult } from './services/geminiService';

type Theme = 'light' | 'dark';
type ActiveTab = 'converters' | 'calculators' | 'tools' | 'ai';

// Custom hook for theme management
const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (storedTheme) return storedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
};


// Main App Component
const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('converters');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConverter, setActiveConverter] = useState<ConverterCategory | null>(null);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [activeCalculator, setActiveCalculator] = useState<Calculator | null>(null);

  const closeModal = () => {
    setActiveConverter(null);
    setActiveTool(null);
    setActiveCalculator(null);
  }

  const filteredConverters = useMemo(() =>
    CONVERTER_CATEGORIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  
  const tools: Tool[] = useMemo(() => [
    { name: 'RGB <> HEX', icon: <Icons.RgbIcon />, component: <RgbHexConverter /> },
    { name: 'Qibla Finder', icon: <Icons.QiblaIcon />, component: <QiblaFinder /> },
    { name: 'Speed Meter', icon: <Icons.SpeedIcon />, component: <SpeedMeter /> },
    { name: 'Stopwatch', icon: <Icons.TimeIcon />, component: <Stopwatch /> },
  ], []);

  const calculators: Calculator[] = useMemo(() => [
     { name: 'Date Difference', icon: <Icons.TimeIcon />, component: <DateDifferenceCalculator /> },
     { name: 'Decimal to Fraction', icon: <Icons.CalculatorIcon />, component: <DecimalToFractionCalculator />},
     { name: 'Area Calculator', icon: <Icons.AreaIcon />, component: <AreaShapeCalculator /> },
  ], []);

  const aiFeatures: AiFeature[] = useMemo(() => [
    { name: 'Natural Language Converter', description: 'Type your conversion query in plain English.', icon: <Icons.WandIcon/>, component: <NaturalLanguageConverter /> },
    { name: 'AI Image Generator', description: 'Create an image from a text prompt.', icon: <Icons.ImageIcon/>, component: <ImageGenerator /> },
  ], []);

  const filteredTools = useMemo(() =>
    tools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [tools, searchQuery]
  );

  const filteredCalculators = useMemo(() =>
    calculators.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [calculators, searchQuery]
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'converters':
        return <Grid items={filteredConverters} onCardClick={item => setActiveConverter(item as ConverterCategory)} />;
      case 'tools':
        return <Grid items={filteredTools} onCardClick={item => setActiveTool(item as Tool)} />;
      case 'calculators':
        return <Grid items={filteredCalculators} onCardClick={item => setActiveCalculator(item as Calculator)} />;
      case 'ai':
        return <AiGrid items={aiFeatures} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6">
          {renderContent()}
        </div>
      </main>
      
      {activeConverter && <ConverterModal category={activeConverter} onClose={closeModal} />}
      {activeTool && <ToolModal tool={activeTool} onClose={closeModal} />}
      {activeCalculator && <ToolModal tool={activeCalculator} onClose={closeModal} />}
    </div>
  );
};


// Sub-components defined within App.tsx to avoid extra files

const Header: React.FC<{ theme: Theme; toggleTheme: () => void; searchQuery: string; setSearchQuery: (q: string) => void }> = ({ theme, toggleTheme, searchQuery, setSearchQuery }) => (
  <header className="bg-white dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-md dark:shadow-black/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
            <Icons.CubeTransparentIcon />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Uniconv</h1>
        </div>
        <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
          <div className="max-w-lg w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.SearchIcon />
              </div>
              <input
                id="search"
                className="block w-full bg-white dark:bg-gray-700 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-white focus:ring-2 focus:ring-primary transition"
                placeholder="Search"
                type="search"
                name="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-primary">
          {theme === 'light' ? <Icons.MoonIcon /> : <Icons.SunIcon />}
        </button>
      </div>
    </div>
  </header>
);

const Navigation: React.FC<{ activeTab: ActiveTab; setActiveTab: (tab: ActiveTab) => void }> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: ActiveTab; name: string, icon: React.ReactNode }[] = [
    { id: 'converters', name: 'Converters', icon: <Icons.BeakerIcon /> },
    { id: 'calculators', name: 'Calculators', icon: <Icons.CalculatorIcon /> },
    { id: 'tools', name: 'Tools', icon: <Icons.CompassIcon /> },
    { id: 'ai', name: 'AI Suite', icon: <Icons.SparkleIcon /> },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.id)}
            className={`
              ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
              whitespace-nowrap flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-all
            `}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};


const Grid: React.FC<{ items: (ConverterCategory | Tool | Calculator)[]; onCardClick: (item: ConverterCategory | Tool | Calculator) => void }> = ({ items, onCardClick }) => {
    if (items.length === 0) {
        return <div className="text-center py-10 text-gray-500">No items match your search.</div>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
            <button
            key={item.name}
            onClick={() => onCardClick(item)}
            className="group p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:hover:bg-gray-700/80 transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center aspect-square"
            >
            <div className="text-primary transition-transform duration-300 group-hover:scale-110">
                {item.icon}
            </div>
            <h3 className="mt-4 font-semibold text-sm text-gray-800 dark:text-gray-200">{item.name}</h3>
            </button>
        ))}
        </div>
    );
};

const AiGrid: React.FC<{ items: AiFeature[] }> = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {items.map(item => (
      <div key={item.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <div className="text-primary">{item.icon}</div>
          <h3 className="ml-3 text-lg font-semibold">{item.name}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
        <div>
            {item.component}
        </div>
      </div>
    ))}
  </div>
);


const Modal: React.FC<{ children: React.ReactNode; title: string; onClose: () => void; icon: React.ReactNode }> = ({ children, title, onClose, icon }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="text-primary">{icon}</div>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
          <Icons.CloseIcon />
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  </div>
);

const ConverterModal: React.FC<{ category: ConverterCategory; onClose: () => void; }> = ({ category, onClose }) => {
  const [valueA, setValueA] = useState('1');
  const [unitA, setUnitA] = useState<Unit>(category.units[0]);
  const [valueB, setValueB] = useState('');
  const [unitB, setUnitB] = useState<Unit>(category.units[1]);

  const convert = useCallback((value: number, fromUnit: Unit, toUnit: Unit, isTemperature: boolean) => {
      if(isTemperature) {
          if(fromUnit.symbol === '°C' && toUnit.symbol === '°F') return (value * 9/5) + 32;
          if(fromUnit.symbol === '°F' && toUnit.symbol === '°C') return (value - 32) * 5/9;
          if(fromUnit.symbol === '°C' && toUnit.symbol === 'K') return value + 273.15;
          if(fromUnit.symbol === 'K' && toUnit.symbol === '°C') return value - 273.15;
          if(fromUnit.symbol === '°F' && toUnit.symbol === 'K') return (value - 32) * 5/9 + 273.15;
          if(fromUnit.symbol === 'K' && toUnit.symbol === '°F') return (value - 273.15) * 9/5 + 32;
          return value;
      }
      const valueInBase = value * fromUnit.factor;
      return valueInBase / toUnit.factor;
  }, []);
  
  useEffect(() => {
    const val = parseFloat(valueA);
    if (!isNaN(val)) {
        const result = convert(val, unitA, unitB, category.name === 'Temperature');
        setValueB(result.toLocaleString(undefined, { maximumFractionDigits: 10 }));
    } else {
        setValueB('');
    }
  }, [valueA, unitA, unitB, category.name, convert]);

  const handleValueAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueA(e.target.value);
  };

  const handleUnitAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = category.units.find(u => u.symbol === e.target.value);
    if (newUnit) setUnitA(newUnit);
  };
  
  const handleUnitBChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = category.units.find(u => u.symbol === e.target.value);
    if (newUnit) setUnitB(newUnit);
  };

  return (
    <Modal title={category.name} onClose={onClose} icon={category.icon}>
      <div className="space-y-4">
        <div>
          <input
            type="number"
            value={valueA}
            onChange={handleValueAChange}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg text-lg"
          />
          <select value={unitA.symbol} onChange={handleUnitAChange} className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary rounded-lg">
            {category.units.map(unit => (
              <option key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</option>
            ))}
          </select>
        </div>
        <div className="text-center font-bold text-xl">=</div>
        <div>
          <input
            type="text"
            readOnly
            value={valueB}
            className="w-full p-3 bg-gray-200 dark:bg-gray-600 border-2 border-transparent rounded-lg text-lg"
          />
          <select value={unitB.symbol} onChange={handleUnitBChange} className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary rounded-lg">
            {category.units.map(unit => (
              <option key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};


const ToolModal: React.FC<{ tool: Tool | Calculator; onClose: () => void; }> = ({ tool, onClose }) => {
    return (
        <Modal title={tool.name} onClose={onClose} icon={tool.icon}>
            {tool.component}
        </Modal>
    );
};

// --- TOOL & CALCULATOR COMPONENTS ---
const RgbHexConverter: React.FC = () => {
  const [rgb, setRgb] = useState('139, 92, 246');
  const [hex, setHex] = useState('#8b5cf6');

  const handleRgbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRgb = e.target.value;
    setRgb(newRgb);
    const parts = newRgb.split(',').map(p => parseInt(p.trim(), 10));
    if (parts.length === 3 && parts.every(p => p >= 0 && p <= 255)) {
      const newHex = '#' + parts.map(p => ('0' + p.toString(16)).slice(-2)).join('');
      setHex(newHex);
    }
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHex = e.target.value;
    if (newHex.startsWith('#')) newHex = newHex.substring(1);
    setHex(`#${newHex}`);
    if (newHex.length === 6 || newHex.length === 3) {
      const bigint = parseInt(newHex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      setRgb(`${r}, ${g}, ${b}`);
    }
  };

  return (
      <div className="space-y-4">
          <div>
              <label className="font-medium">RGB</label>
              <input type="text" value={rgb} onChange={handleRgbChange} className="w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-primary focus:border-primary"/>
          </div>
          <div>
              <label className="font-medium">HEX</label>
              <input type="text" value={hex} onChange={handleHexChange} className="w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-primary focus:border-primary"/>
          </div>
          <div className="h-20 w-full rounded-md" style={{ backgroundColor: hex }}></div>
      </div>
  )
};

const QiblaFinder: React.FC = () => {
    const [direction, setDirection] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Kaaba location
                const kaabaLat = 21.4225 * Math.PI / 180;
                const kaabaLon = 39.8262 * Math.PI / 180;
                const userLat = latitude * Math.PI / 180;
                const userLon = longitude * Math.PI / 180;

                const y = Math.sin(kaabaLon - userLon);
                const x = Math.cos(userLat) * Math.tan(kaabaLat) - Math.sin(userLat) * Math.cos(kaabaLon - userLon);
                const qibla = Math.atan2(y, x) * 180 / Math.PI;
                setDirection((qibla + 360) % 360);
            },
            () => {
                setError('Unable to retrieve your location. Please enable location services.');
            }
        );
    }, []);

    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (direction === null) return <div className="text-center">Getting your location...</div>;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 border-4 border-primary rounded-full flex items-center justify-center">
                <div className="absolute w-2 h-20 bg-primary rounded-full top-0 left-1/2 -ml-1 transform-origin-bottom" style={{ transform: `rotate(${direction}deg)` }}>
                    <div className="absolute -top-4 left-1/2 -ml-2 text-2xl">▲</div>
                </div>
                <div className="font-bold">N</div>
                <div className="absolute right-3 font-bold">E</div>
                <div className="absolute bottom-1 font-bold">S</div>
                <div className="absolute left-3 font-bold">W</div>
            </div>
            <p className="mt-4 text-lg font-semibold">{direction.toFixed(2)}°</p>
            <p className="text-sm text-gray-500">Direction to Qibla</p>
        </div>
    );
};

const SpeedMeter: React.FC = () => {
    const [speed, setSpeed] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                // position.coords.speed is in meters/second
                const speedMph = (position.coords.speed || 0) * 2.23694;
                setSpeed(speedMph);
            },
            () => {
                setError('Unable to track your location. Please enable location services.');
            },
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="text-center">
            <div className="text-6xl font-bold text-primary">
                {(speed ?? 0).toFixed(1)}
            </div>
            <div className="text-lg text-gray-500 dark:text-gray-400">MPH</div>
        </div>
    );
};

const Stopwatch: React.FC = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = window.setInterval(() => {
                setTime(prevTime => prevTime + 10);
            }, 10);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);

    const formatTime = (time: number) => {
        const milliseconds = `0${(time % 1000) / 10}`.slice(-2);
        const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
        const minutes = `0${Math.floor((time / 60000) % 60)}`.slice(-2);
        return `${minutes}:${seconds}.${milliseconds}`;
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="text-5xl font-mono text-primary">{formatTime(time)}</div>
            <div className="flex space-x-4">
                <button onClick={() => setIsRunning(!isRunning)} className={`px-4 py-2 rounded-md font-semibold text-white ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                    {isRunning ? 'Stop' : 'Start'}
                </button>
                <button onClick={() => { setIsRunning(false); setTime(0); }} className="px-4 py-2 rounded-md font-semibold bg-gray-500 hover:bg-gray-600 text-white">
                    Reset
                </button>
            </div>
        </div>
    );
};

const DateDifferenceCalculator: React.FC = () => {
    const today = new Date().toISOString().split('T')[0];
    const [date1, setDate1] = useState(today);
    const [date2, setDate2] = useState(today);
    const [diff, setDiff] = useState('0 days');

    useEffect(() => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const timeDiff = Math.abs(d2.getTime() - d1.getTime());
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setDiff(`${dayDiff} day(s)`);
    }, [date1, date2]);
    
    return (
        <div className="space-y-4">
            <div>
                <label className="font-medium">Start Date</label>
                <input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md"/>
            </div>
            <div>
                <label className="font-medium">End Date</label>
                <input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md"/>
            </div>
            <div className="text-center pt-2">
                <div className="text-lg font-semibold">Difference</div>
                <div className="text-3xl font-bold text-primary">{diff}</div>
            </div>
        </div>
    );
};

const DecimalToFractionCalculator: React.FC = () => {
    const [decimal, setDecimal] = useState('0.75');
    const [fraction, setFraction] = useState('3/4');

    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;

    useEffect(() => {
        const num = parseFloat(decimal);
        if (isNaN(num)) {
            setFraction('Invalid Input');
            return;
        }

        const len = decimal.toString().split('.')[1]?.length || 0;
        let denominator = Math.pow(10, len);
        let numerator = num * denominator;
        const divisor = gcd(numerator, denominator);
        numerator /= divisor;
        denominator /= divisor;

        setFraction(`${numerator} / ${denominator}`);

    }, [decimal]);

    return (
        <div className="space-y-4">
            <div>
                <label className="font-medium">Decimal</label>
                <input type="number" value={decimal} onChange={e => setDecimal(e.target.value)} className="w-full mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md"/>
            </div>
            <div className="text-center pt-2">
                <div className="text-lg font-semibold">Fraction</div>
                <div className="text-3xl font-bold text-primary">{fraction}</div>
            </div>
        </div>
    );
};

const AreaShapeCalculator: React.FC = () => {
    const [shape, setShape] = useState<'rectangle' | 'circle'>('rectangle');
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(5);
    const [radius, setRadius] = useState(5);
    const [area, setArea] = useState(50);

    useEffect(() => {
        if (shape === 'rectangle') {
            setArea(length * width);
        } else {
            setArea(Math.PI * radius * radius);
        }
    }, [shape, length, width, radius]);

    return (
        <div className="space-y-4">
            <select value={shape} onChange={e => setShape(e.target.value as any)} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
            </select>
            {shape === 'rectangle' ? (
                <>
                    <input type="number" value={length} onChange={e => setLength(parseFloat(e.target.value))} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md" placeholder="Length"/>
                    <input type="number" value={width} onChange={e => setWidth(parseFloat(e.target.value))} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md" placeholder="Width"/>
                </>
            ) : (
                <input type="number" value={radius} onChange={e => setRadius(parseFloat(e.target.value))} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md" placeholder="Radius"/>
            )}
             <div className="text-center pt-2">
                <div className="text-lg font-semibold">Area</div>
                <div className="text-3xl font-bold text-primary">{area.toFixed(2)}</div>
            </div>
        </div>
    )
}

// --- AI FEATURE COMPONENTS ---
const NaturalLanguageConverter: React.FC = () => {
    const [query, setQuery] = useState('100 kg to lbs');
    const [result, setResult] = useState<ConversionResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResult(null);
        const res = await getNaturalLanguageConversion(query);
        if (res) {
            setResult(res);
        } else {
            setError('Could not understand the query. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                    placeholder="e.g., 5 miles to km"
                />
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary hover:bg-primary-focus text-white font-semibold rounded-md disabled:bg-gray-400">
                    {isLoading ? '...' : 'Convert'}
                </button>
            </form>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            {result && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <p>{result.fromValue} {result.fromUnit} is equal to</p>
                    <p className="text-2xl font-bold text-primary">{result.result.toLocaleString()} {result.toUnit}</p>
                </div>
            )}
        </div>
    );
};

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('A futuristic cityscape at sunset, synthwave style');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setImageUrl(null);
        const url = await generateImage(prompt, aspectRatio);
        if (url) {
            setImageUrl(url);
        } else {
            setError('Failed to generate image. Please try a different prompt.');
        }
        setIsLoading(false);
    };
    
    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        const filename = prompt.trim().toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // remove special characters
          .replace(/\s+/g, '-') // replace spaces with hyphens
          .slice(0, 50) || 'ai-generated-image';
        link.download = `${filename}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const aspectRatioClasses = {
        '1:1': 'aspect-square',
        '16:9': 'aspect-video',
        '9:16': 'aspect-[9/16]',
        '4:3': 'aspect-[4/3]',
        '3:4': 'aspect-[3/4]',
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex space-x-2">
                    <input 
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-grow p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                        placeholder="Enter image prompt"
                    />
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary hover:bg-primary-focus text-white font-semibold rounded-md disabled:bg-gray-400">
                        {isLoading ? '...' : 'Generate'}
                    </button>
                     {imageUrl && !isLoading && (
                        <button
                            type="button"
                            onClick={handleDownload}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-opacity"
                            aria-label="Save image to gallery"
                            title="Save image to gallery"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                    )}
                </div>
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Aspect Ratio</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map(ratio => (
                            <button
                                key={ratio}
                                type="button"
                                onClick={() => setAspectRatio(ratio)}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                                    aspectRatio === ratio 
                                    ? 'bg-primary text-white' 
                                    : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                                }`}
                            >
                                {ratio}
                            </button>
                        ))}
                    </div>
                </div>
            </form>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <div className={`mt-4 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden ${aspectRatioClasses[aspectRatio]}`}>
                {isLoading && <div className="text-gray-500 animate-pulse">Generating...</div>}
                {imageUrl && <img src={imageUrl} alt={prompt} className="w-full h-full object-cover" />}
            </div>
        </div>
    );
};

export default App;