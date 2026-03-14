"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MapPin, Star, ArrowRight, 
  ShieldCheck, Gem, SlidersHorizontal, 
  Check, X, BedDouble, Bath, Maximize,
  Search, Calendar, Users, Globe, ChevronRight, ArrowUp
} from 'lucide-react';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

interface City {
  id: string;
  name: string;
  country: string;
  img: string;
  count: number;
}

interface Room {
  id: string;
  name: string;
  location: string;
  country: string;
  type: 'Palace' | 'Villa' | 'Suite' | 'Chalet' | 'Penthouse' | 'Riad';
  price: number;
  rating: number;
  size: number;
  guests: number;
  img: string;
  amenities: string[];
  desc: string;
}

// ==========================================
// 2. THE GRAND DATA VAULT (روابط 4K حية ومضمونة 100%)
// ==========================================

const CITIES_DATA: City[] = [
  { 
    id: 'c1', name: 'Giza', country: 'Egypt', count: 12, 
    img: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=2071' 
  }, // نهر النيل ومعابد الفراعنة
  { 
    id: 'c2', name: 'Istanbul', country: 'Turkey', count: 28, 
    img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2070' 
  }, // البوسفور والمعمار العثماني
  { 
    id: 'c3', name: 'Gstaad', country: 'Switzerland', count: 15, 
    img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2070' 
  }, 
  { 
    id: 'c4', name: 'Kyoto', country: 'Japan', count: 9, 
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070' 
  }, 
  { 
    id: 'c5', name: 'Baa Atoll', country: 'Maldives', count: 14, 
    img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2073' 
  }, 
  { 
    id: 'c6', name: 'Positano', country: 'Italy', count: 22, 
    img: 'https://images.unsplash.com/photo-1533604130097-270830490b41?q=80&w=2070' 
  }, 
  { 
    id: 'c7', name: 'Paris', country: 'France', count: 34, 
    img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020' 
  }, 
  { 
    id: 'c8', name: 'Marrakech', country: 'Morocco', count: 18, 
    img: 'https://images.unsplash.com/photo-1553606622-6b9ea07fc714?q=80&w=2070' 
  }, 
];

const ROOMS_DATA: Room[] = [
  {
    id: 'r1', name: 'The Royal Winston Suite', location: 'Aswan', country: 'Egypt', type: 'Suite',
    price: 1200, rating: 5.0, size: 138, guests: 2,
    img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074', 
    amenities: ['Nile View', 'Butler Service', 'Historic Terrace'],
    desc: 'The exact suite where Winston Churchill stayed. Unmatched views of the eternal Nile with absolute Victorian luxury.'
  },
  {
    id: 'r2', name: 'Sultan Imperial Palace', location: 'Istanbul', country: 'Turkey', type: 'Palace',
    price: 3500, rating: 5.0, size: 400, guests: 4,
    img: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?q=80&w=2070', 
    amenities: ['Sea View', 'Private Hammam', 'Helicopter Pad'],
    desc: 'Live like an Ottoman Emperor. A private palace directly on the Bosphorus with 24K gold accents.'
  },
  {
    id: 'r3', name: 'Alpine Panorama Chalet', location: 'Gstaad', country: 'Switzerland', type: 'Chalet',
    price: 2800, rating: 4.9, size: 250, guests: 6,
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070', 
    amenities: ['Mountain View', 'Private Spa', 'Ski-In/Out'],
    desc: 'A masterpiece of Swiss wood and stone. Your private sanctuary amidst the snow-capped Alps.'
  },
  {
    id: 'r4', name: 'Ocean Infinity Villa', location: 'Baa Atoll', country: 'Maldives', type: 'Villa',
    price: 4200, rating: 5.0, size: 320, guests: 2,
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070', 
    amenities: ['Sea View', 'Private Pool', 'Butler Service'],
    desc: 'Suspended above the Indian Ocean. Slide from your living room directly into the crystalline reef.'
  },
  {
    id: 'r5', name: 'Renaissance Fresco Suite', location: 'Florence', country: 'Italy', type: 'Suite',
    price: 1800, rating: 4.8, size: 110, guests: 2,
    img: 'https://images.unsplash.com/photo-1608198399988-341f712c3711?q=80&w=2070', 
    amenities: ['City View', 'Michelin Dining', 'Historic Art'],
    desc: 'Sleep beneath original 16th-century frescoes in the heart of the Tuscan capital.'
  },
  {
    id: 'r6', name: 'Zen Garden Pavilion', location: 'Kyoto', country: 'Japan', type: 'Villa',
    price: 2100, rating: 4.9, size: 180, guests: 4,
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070', 
    amenities: ['Garden View', 'Private Onsen', 'Tea Ceremony'],
    desc: 'Ultimate serenity. A minimalist Japanese pavilion surrounded by centuries-old moss gardens.'
  },
  {
    id: 'r7', name: 'Pharaoh\'s Grand Penthouse', location: 'Cairo', country: 'Egypt', type: 'Penthouse',
    price: 1500, rating: 4.8, size: 220, guests: 4,
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070', 
    amenities: ['Pyramid View', 'Private Pool', 'Butler Service'],
    desc: 'Look down upon the Great Pyramids from your private infinity pool in the sky.'
  },
  {
    id: 'r8', name: 'Aegean Cliffside Villa', location: 'Bodrum', country: 'Turkey', type: 'Villa',
    price: 2600, rating: 5.0, size: 280, guests: 6,
    img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070', 
    amenities: ['Sea View', 'Private Pool', 'Helicopter Pad'],
    desc: 'Carved into the white rocks of the Aegean, offering absolute privacy and endless blue horizons.'
  },
  {
    id: 'r9', name: 'Parisian Haute Suite', location: 'Paris', country: 'France', type: 'Suite',
    price: 2300, rating: 4.9, size: 140, guests: 2,
    img: 'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?q=80&w=2070', 
    amenities: ['City View', 'Michelin Dining', 'Butler Service'],
    desc: 'Overlooking Place Vendôme. Draped in silk, crystal chandeliers, and French elegance.'
  },
  {
    id: 'r10', name: 'Amalfi Coastal Retreat', location: 'Positano', country: 'Italy', type: 'Villa',
    price: 3100, rating: 5.0, size: 200, guests: 4,
    img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070', 
    amenities: ['Sea View', 'Private Pool', 'Historic Terrace'],
    desc: 'Suspended between the lemon groves and the sea. The purest expression of Italian romance.'
  },
  {
    id: 'r11', name: 'Sahara Mirage Riad', location: 'Marrakech', country: 'Morocco', type: 'Riad',
    price: 1600, rating: 4.9, size: 350, guests: 6,
    img: 'https://images.unsplash.com/photo-1558971212-70b9241eb0d5?q=80&w=2070', // اللينك الجديد المباشر
    amenities: ['Courtyard Pool', 'Private Chef', 'Spa'],
    desc: 'A private palace hidden within the Medina walls. Featuring traditional Zellige tilework and a rooftop lounge.'
  },
  {
    id: 'r12', name: 'Glacier Peak Penthouse', location: 'Zermatt', country: 'Switzerland', type: 'Penthouse',
    price: 3800, rating: 5.0, size: 300, guests: 8,
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075', 
    amenities: ['Mountain View', 'Fireplace', 'Ski-In/Out'],
    desc: 'Wake up to the Matterhorn. A multi-level penthouse with an outdoor heated jacuzzi.'
  },
  {
    id: 'r13', name: 'Riviera Grand Villa', location: 'Cannes', country: 'France', type: 'Villa',
    price: 4500, rating: 5.0, size: 500, guests: 10,
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070', 
    amenities: ['Sea View', 'Private Pool', 'Cinema Room'],
    desc: 'The epitome of French Riviera glamour. Host your own private gatherings in this sprawling estate.'
  },
  {
    id: 'r14', name: 'Dubai Cloud Penthouse', location: 'Dubai', country: 'UAE', type: 'Penthouse',
    price: 5500, rating: 4.9, size: 450, guests: 6,
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070', 
    amenities: ['City View', 'Private Elevator', 'Butler Service'],
    desc: 'Floating above the clouds. Floor-to-ceiling windows offering a 360-degree view of the futuristic skyline.'
  },
  {
    id: 'r15', name: 'London Heritage Suite', location: 'London', country: 'UK', type: 'Suite',
    price: 1900, rating: 4.8, size: 120, guests: 2,
    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070', 
    amenities: ['City View', 'Afternoon Tea', 'Historic Art'],
    desc: 'Overlooking Hyde Park. Classic British tailoring meets modern technological invisible comforts.'
  },
  {
    id: 'r16', name: 'Andalusian Royal Villa', location: 'Seville', country: 'Spain', type: 'Villa',
    price: 2200, rating: 4.9, size: 280, guests: 8,
    img: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070', 
    amenities: ['Garden View', 'Private Pool', 'Wine Cellar'],
    desc: 'Moorish architecture surrounded by fragrant orange trees. A sensual escape into Spanish history.'
  }
];

const ALL_AMENITIES = ['Sea View', 'Nile View', 'Mountain View', 'Private Pool', 'Butler Service', 'Private Spa', 'Michelin Dining', 'Helicopter Pad', 'Ski-In/Out'];
const ALL_COUNTRIES = ['All', 'Egypt', 'Turkey', 'Switzerland', 'Maldives', 'Italy', 'Japan', 'France', 'Morocco', 'UAE', 'UK', 'Spain'];
const ALL_TYPES = ['All', 'Suite', 'Villa', 'Palace', 'Chalet', 'Penthouse', 'Riad'];
// ==========================================
// 3. THE BOOKING ENGINE (الواجهة الرئيسية)
// ==========================================

export default function Home() {
  const [priceRange, setPriceRange] = useState<number>(6000);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const collectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredRooms = useMemo(() => {
    return ROOMS_DATA.filter((room) => {
      const matchPrice = room.price <= priceRange;
      const matchCountry = selectedCountry === 'All' || room.country === selectedCountry;
      const matchType = selectedType === 'All' || room.type === selectedType;
      const matchAmenities = selectedAmenities.length === 0 || selectedAmenities.every(a => room.amenities.includes(a));
      
      return matchPrice && matchCountry && matchType && matchAmenities;
    });
  }, [priceRange, selectedCountry, selectedType, selectedAmenities]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSelectedCountry('All');
    setSelectedType('All');
    setPriceRange(6000);
    setSelectedAmenities([]);
  };

  const handleCityClick = (countryName: string) => {
    setSelectedCountry(countryName);
    if (collectionRef.current) {
      collectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-stone-300 font-sans selection:bg-[#B5935E] selection:text-white">
      
      {/* --- CINEMATIC HERO --- */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/80 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070" 
            alt="The Grand Reserve"
            className="w-full h-full object-cover opacity-70"
            style={{ animation: 'slowPan 40s infinite alternate linear' }}
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-6xl mt-10">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="h-[1px] w-12 bg-[#B5935E]" />
            <span className="text-[10px] tracking-[16px] text-[#B5935E] uppercase font-black drop-shadow-md">
              The Grand Reserve
            </span>
            <div className="h-[1px] w-12 bg-[#B5935E]" />
          </div>
          <h1 className="text-6xl md:text-[8.5rem] font-serif leading-[0.9] mb-8 text-white drop-shadow-2xl tracking-tighter">
            Curated <span className="italic font-light text-[#B5935E]">Sanctuaries.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-stone-400 font-light text-base md:text-lg leading-relaxed italic border-l-2 border-[#B5935E] pl-6 bg-black/20 p-4 backdrop-blur-sm rounded-r-lg">
            "Your access to the world's most exclusive suites, private villas, and historic palaces. Curated for the global elite."
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 animate-bounce">
            <div className="w-[2px] h-16 bg-gradient-to-b from-[#B5935E] to-transparent" />
        </div>
      </section>

      {/* --- THE DESTINATIONS GALLERY --- */}
      <section className="max-w-[1600px] mx-auto px-6 py-32 border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
                <span className="text-[10px] tracking-[6px] text-[#B5935E] uppercase font-bold block mb-4 flex items-center gap-3"><Globe size={14}/> Global Coordinates</span>
                <h2 className="text-4xl md:text-6xl font-serif text-white">The <span className="italic text-stone-500">Destinations</span></h2>
            </div>
            <p className="text-xs text-stone-400 uppercase tracking-widest font-bold max-w-xs text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-[#B5935E] pl-4 md:pr-4">
                Select a coordinate to reveal its hidden sanctuaries.
            </p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-10 snap-x hide-scrollbar">
            {CITIES_DATA.map((city) => (
                <div 
                    key={city.id} 
                    onClick={() => handleCityClick(city.country)}
                    className="min-w-[280px] md:min-w-[350px] h-[480px] relative group cursor-pointer snap-center overflow-hidden bg-black flex-shrink-0 border border-white/10 rounded-sm shadow-xl"
                >
                    <img 
                        src={city.img} 
                        alt={city.name} 
                        className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s] ease-out opacity-80" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                    
                    <div className="absolute bottom-8 left-8 text-white z-20">
                        <span className="text-[9px] uppercase tracking-[4px] text-[#B5935E] font-black mb-2 block drop-shadow-md">{city.country}</span>
                        <h3 className="text-4xl font-serif mb-4 group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-lg">{city.name}</h3>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <span className="text-[10px] uppercase tracking-[2px] font-bold text-stone-200">Explore {city.count} Properties</span>
                            <ArrowRight size={14} className="text-[#B5935E]" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* --- THE FILTER & RESULTS SYSTEM --- */}
      <section ref={collectionRef} className="max-w-[1600px] mx-auto px-6 py-24 scroll-mt-10">
        
        <div className="lg:hidden flex justify-between items-center mb-8 border border-white/10 p-5 bg-[#111] backdrop-blur-md sticky top-4 z-50 shadow-2xl">
            <span className="text-xs uppercase tracking-[4px] font-bold text-white">Refine Collection</span>
            <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="text-[#B5935E] flex items-center gap-2">
                <SlidersHorizontal size={20} />
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* FILTER SIDEBAR */}
          <aside className={`w-full lg:w-[320px] shrink-0 lg:sticky lg:top-10 space-y-12 bg-[#111111] p-8 border border-white/5 shadow-2xl rounded-sm ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                <div className="flex items-center gap-4">
                    <SlidersHorizontal className="text-[#B5935E]" size={18} />
                    <h3 className="text-xs uppercase tracking-[4px] text-white font-black">Search Filters</h3>
                </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[4px] text-stone-400 font-bold border-l-2 border-[#B5935E] pl-3">Destination</h4>
              <div className="flex flex-wrap gap-2">
                {ALL_COUNTRIES.map(country => (
                  <button 
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`px-4 py-2.5 text-[9px] uppercase tracking-[3px] font-bold border transition-all ${selectedCountry === country ? 'bg-[#B5935E] border-[#B5935E] text-white shadow-lg' : 'bg-black/40 border-white/10 text-stone-500 hover:border-white/30 hover:text-white'}`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[4px] text-stone-400 font-bold border-l-2 border-[#B5935E] pl-3">Property Type</h4>
              <div className="flex flex-col gap-4">
                {ALL_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-4 cursor-pointer group">
                    <div className={`w-4 h-4 border flex items-center justify-center transition-all ${selectedType === type ? 'bg-[#B5935E] border-[#B5935E]' : 'border-stone-700 bg-black group-hover:border-[#B5935E]'}`}>
                        {selectedType === type && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`text-[11px] tracking-[3px] uppercase ${selectedType === type ? 'text-white font-black' : 'text-stone-500 group-hover:text-stone-300'}`}>{type}</span>
                    <input type="radio" name="type" className="hidden" onChange={() => setSelectedType(type)} />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-l-2 border-[#B5935E] pl-3">
                  <h4 className="text-[10px] uppercase tracking-[4px] text-stone-400 font-bold">Max Nightly Rate</h4>
                  <span className="text-sm font-serif text-[#B5935E] italic font-bold">${priceRange}</span>
              </div>
              <input 
                type="range" 
                min="500" max="6000" step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#B5935E] bg-stone-800 h-1 outline-none appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-stone-600 tracking-[3px] font-bold uppercase">
                  <span>$500</span>
                  <span>$6,000+</span>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[4px] text-stone-400 font-bold border-l-2 border-[#B5935E] pl-3">Signature Inclusions</h4>
              <div className="flex flex-col gap-4">
                {ALL_AMENITIES.map(amenity => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <label key={amenity} className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-4 h-4 border flex items-center justify-center transition-all ${isSelected ? 'bg-white border-white' : 'border-stone-700 bg-black group-hover:border-white/50'}`}>
                            {isSelected && <Check size={12} className="text-black" />}
                        </div>
                        <span className={`text-[10px] tracking-[2px] uppercase ${isSelected ? 'text-white font-bold' : 'text-stone-500 group-hover:text-stone-300'}`}>{amenity}</span>
                        <input type="checkbox" className="hidden" onChange={() => toggleAmenity(amenity)} />
                    </label>
                  );
                })}
              </div>
            </div>

            <button 
                onClick={resetFilters}
                className="w-full py-5 border border-stone-800 bg-black text-stone-500 text-[10px] uppercase tracking-[5px] font-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-lg"
            >
                <X size={14} /> Reset Protocol
            </button>
          </aside>

          {/* ROOMS GRID RESULTS */}
          <div className="w-full lg:flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/5 pb-8 gap-6">
                <div>
                    <h2 className="text-5xl font-serif text-white mb-3 tracking-tight">The Collection</h2>
                    <p className="text-[11px] uppercase tracking-[5px] text-stone-500 font-bold">
                        Displaying <span className="text-[#B5935E] text-sm">{filteredRooms.length}</span> Sanctuaries
                    </p>
                </div>
            </div>

            {filteredRooms.length === 0 ? (
                <div className="text-center py-40 bg-[#111] border border-white/5 shadow-2xl rounded-sm">
                    <Gem size={56} className="mx-auto text-stone-700 mb-8" strokeWidth={1} />
                    <h3 className="text-4xl font-serif text-white mb-6">No Sanctuaries Found</h3>
                    <p className="text-base text-stone-400 font-light max-w-lg mx-auto italic leading-relaxed">
                        "Your highly refined criteria yielded no immediate results. Please adjust your filters to explore our global inventory."
                    </p>
                    <button onClick={resetFilters} className="mt-10 border-b border-[#B5935E] text-[#B5935E] text-[10px] uppercase tracking-[4px] font-bold pb-1 hover:text-white hover:border-white transition-colors">
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {filteredRooms.map(room => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. FOOTER: THE SOVEREIGN BRAND */}
      <footer className="py-24 bg-black border-t border-white/10 relative overflow-hidden mt-20">
        <div className="max-w-[1600px] mx-auto px-10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-serif tracking-[12px] font-bold text-white mb-4">NAZEEL</h1>
                <p className="text-[9px] leading-relaxed text-stone-500 uppercase tracking-[4px] font-bold">
                    The Pinnacle of Global Hospitality.
                </p>
            </div>
            
            <div className="text-center md:text-right">
                <p className="text-[9px] uppercase tracking-[4px] text-stone-400 font-bold mb-2">
                    Engineered by <span className="text-white">Abdeltawap Tarek El-Tawil</span>
                </p>
                <p className="text-[8px] uppercase tracking-[3px] text-[#B5935E]">
                    Software Engineer & Web Development | Mastery Group
                </p>
            </div>
            
            <button onClick={scrollToTop} className="w-14 h-14 border border-stone-800 flex items-center justify-center hover:bg-[#B5935E] hover:border-[#B5935E] hover:text-white transition-all text-stone-500 group rounded-sm shadow-xl">
                <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
            </button>
        </div>
      </footer>

      {/* GLOBAL CSS ANIMATIONS */}
      <style jsx global>{`
        @keyframes slowPan {
          0% { transform: scale(1.05) translateX(0); }
          50% { transform: scale(1.1) translateX(-2%); }
          100% { transform: scale(1.05) translateX(0); }
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}

// ==========================================
// 4. ROOM CARD COMPONENT
// ==========================================

function RoomCard({ room }: { room: Room }) {
  return (
    <div className="bg-[#111111] border border-white/5 group hover:border-[#B5935E]/50 transition-all duration-700 flex flex-col h-full shadow-2xl rounded-sm">
        <div className="h-[420px] overflow-hidden relative">
            <img 
                src={room.img} 
                alt={room.name} 
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-[3s] ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/20 to-transparent opacity-90" />
            
            <div className="absolute top-6 left-6 flex flex-col gap-3">
                <span className="bg-white/95 backdrop-blur-md px-4 py-2 text-[9px] tracking-[4px] uppercase font-black text-black inline-block w-max shadow-lg">
                    {room.type}
                </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="flex items-center gap-3 text-[#B5935E]">
                    <MapPin size={16} />
                    <span className="text-[11px] uppercase tracking-[4px] font-black text-white drop-shadow-md">{room.location}, {room.country}</span>
                </div>
                <div className="flex gap-1 text-[#B5935E] drop-shadow-md bg-black/50 px-3 py-1.5 backdrop-blur-sm border border-white/10 rounded-sm">
                    <Star size={12} className="fill-current" />
                    <span className="text-[10px] font-black text-white">{room.rating}</span>
                </div>
            </div>
        </div>

        <div className="p-8 md:p-10 flex flex-col flex-grow relative">
            <h3 className="text-4xl font-serif text-white mb-5 tracking-tight group-hover:text-[#B5935E] transition-colors">{room.name}</h3>
            <p className="text-sm text-stone-400 font-light leading-relaxed mb-10 italic flex-grow border-l-2 border-[#B5935E] pl-4">"{room.desc}"</p>
            
            <div className="grid grid-cols-2 gap-6 border-y border-white/5 py-8 mb-10">
                <div className="flex items-center gap-4 text-stone-300">
                    <Maximize size={18} className="text-[#B5935E]" />
                    <span className="text-[10px] uppercase tracking-[3px] font-bold">{room.size} SQM</span>
                </div>
                <div className="flex items-center gap-4 text-stone-300">
                    <Users size={18} className="text-[#B5935E]" />
                    <span className="text-[10px] uppercase tracking-[3px] font-bold">Up to {room.guests} Guests</span>
                </div>
                <div className="flex items-center gap-4 text-stone-300">
                    <BedDouble size={18} className="text-[#B5935E]" />
                    <span className="text-[10px] uppercase tracking-[3px] font-bold">King Master</span>
                </div>
                <div className="flex items-center gap-4 text-stone-300">
                    <Bath size={18} className="text-[#B5935E]" />
                    <span className="text-[10px] uppercase tracking-[3px] font-bold">Marble Bath</span>
                </div>
            </div>

            <div className="mb-12">
                <p className="text-[10px] uppercase tracking-[5px] text-stone-500 font-black mb-5">Select Inclusions</p>
                <div className="flex flex-wrap gap-3">
                    {room.amenities.slice(0, 3).map(a => (
                        <span key={a} className="px-4 py-2 bg-black border border-white/10 text-[9px] uppercase tracking-[3px] text-stone-300 font-bold rounded-sm shadow-sm">{a}</span>
                    ))}
                    {room.amenities.length > 3 && (
                        <span className="px-4 py-2 bg-transparent border border-white/5 text-[9px] uppercase tracking-[3px] text-stone-500 font-bold rounded-sm">+{room.amenities.length - 3} More</span>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mt-auto pt-8 border-t border-white/10">
                <div>
                    <p className="text-[10px] uppercase tracking-[4px] text-stone-500 font-bold mb-2">Nightly Reserve</p>
                    <p className="text-5xl font-serif text-white">${room.price}</p>
                </div>
                <button className="bg-white text-black px-10 py-5 text-[11px] uppercase tracking-[5px] font-black hover:bg-[#B5935E] hover:text-white transition-all flex items-center gap-4 w-full sm:w-auto justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_10px_20px_rgba(181,147,94,0.2)] rounded-sm">
                    Reserve <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    </div>
  );
}