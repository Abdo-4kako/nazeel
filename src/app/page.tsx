"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MapPin, Star, ArrowRight, ArrowLeft, ArrowUpRight,
  SlidersHorizontal, Check, X, BedDouble, Bath, Maximize,
  Users, Globe, ChevronRight, ChevronLeft, ArrowUp, Gem,
  Calendar, Plane, Utensils, Sparkles, Wine, Coffee,
  Shield, Compass, Clock, PlayCircle
} from 'lucide-react';

// ==========================================
// 1. TYPES & INTERFACES (THE ARCHITECTURE)
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
  type: 'Palace' | 'Villa' | 'Suite' | 'Chalet' | 'Penthouse' | 'Riad' | 'Estate';
  price: number;
  rating: number;
  size: number;
  guests: number;
  img: string;
  amenities: string[];
  desc: string;
  featured?: boolean;
}

interface Service {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  img: string;
}

// ==========================================
// 2. THE GRAND DATA VAULT (MASSIVE EXPANSION)
// ==========================================

const CITIES_DATA: City[] = [
  { id: 'c1', name: 'Giza', country: 'Egypt', count: 12, img: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=2071' },
  { id: 'c2', name: 'Istanbul', country: 'Turkey', count: 28, img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2070' },
  { id: 'c3', name: 'Gstaad', country: 'Switzerland', count: 15, img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2070' }, 
  { id: 'c4', name: 'Kyoto', country: 'Japan', count: 9, img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070' }, 
  { id: 'c5', name: 'Baa Atoll', country: 'Maldives', count: 14, img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2073' }, 
  { id: 'c6', name: 'Positano', country: 'Italy', count: 22, img: 'https://images.unsplash.com/photo-1533604130097-270830490b41?q=80&w=2070' }, 
  { id: 'c7', name: 'Paris', country: 'France', count: 34, img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020' }, 
  { id: 'c8', name: 'Marrakech', country: 'Morocco', count: 18, img: 'https://images.unsplash.com/photo-1553606622-6b9ea07fc714?q=80&w=2070' }, 
  { id: 'c9', name: 'Dubai', country: 'UAE', count: 45, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070' }, 
  { id: 'c10', name: 'Bali', country: 'Indonesia', count: 26, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038' }, 
];

const ROOMS_DATA: Room[] = [
  { id: 'r1', name: 'The Royal Winston Suite', location: 'Aswan', country: 'Egypt', type: 'Suite', price: 1200, rating: 5.0, size: 138, guests: 2, img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074', amenities: ['Nile View', 'Butler Service', 'Historic Terrace'], desc: 'The exact suite where Winston Churchill stayed. Unmatched views of the eternal Nile with absolute Victorian luxury.', featured: true },
  { id: 'r2', name: 'Sultan Imperial Palace', location: 'Istanbul', country: 'Turkey', type: 'Palace', price: 3500, rating: 5.0, size: 400, guests: 4, img: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?q=80&w=2070', amenities: ['Sea View', 'Private Hammam', 'Helicopter Pad'], desc: 'Live like an Ottoman Emperor. A private palace directly on the Bosphorus with 24K gold accents.', featured: true },
  { id: 'r3', name: 'Alpine Panorama Chalet', location: 'Gstaad', country: 'Switzerland', type: 'Chalet', price: 2800, rating: 4.9, size: 250, guests: 6, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070', amenities: ['Mountain View', 'Private Spa', 'Ski-In/Out'], desc: 'A masterpiece of Swiss wood and stone. Your private sanctuary amidst the snow-capped Alps.' },
  { id: 'r4', name: 'Ocean Infinity Villa', location: 'Baa Atoll', country: 'Maldives', type: 'Villa', price: 4200, rating: 5.0, size: 320, guests: 2, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070', amenities: ['Sea View', 'Private Pool', 'Butler Service'], desc: 'Suspended above the Indian Ocean. Slide from your living room directly into the crystalline reef.', featured: true },
  { id: 'r5', name: 'Renaissance Fresco Suite', location: 'Florence', country: 'Italy', type: 'Suite', price: 1800, rating: 4.8, size: 110, guests: 2, img: 'https://images.unsplash.com/photo-1608198399988-341f712c3711?q=80&w=2070', amenities: ['City View', 'Michelin Dining', 'Historic Art'], desc: 'Sleep beneath original 16th-century frescoes in the heart of the Tuscan capital.' },
  { id: 'r6', name: 'Zen Garden Pavilion', location: 'Kyoto', country: 'Japan', type: 'Villa', price: 2100, rating: 4.9, size: 180, guests: 4, img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070', amenities: ['Garden View', 'Private Onsen', 'Tea Ceremony'], desc: 'Ultimate serenity. A minimalist Japanese pavilion surrounded by centuries-old moss gardens.' },
  { id: 'r7', name: 'Pharaoh\'s Grand Penthouse', location: 'Cairo', country: 'Egypt', type: 'Penthouse', price: 1500, rating: 4.8, size: 220, guests: 4, img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070', amenities: ['Pyramid View', 'Private Pool', 'Butler Service'], desc: 'Look down upon the Great Pyramids from your private infinity pool in the sky.' },
  { id: 'r8', name: 'Aegean Cliffside Villa', location: 'Bodrum', country: 'Turkey', type: 'Villa', price: 2600, rating: 5.0, size: 280, guests: 6, img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070', amenities: ['Sea View', 'Private Pool', 'Helicopter Pad'], desc: 'Carved into the white rocks of the Aegean, offering absolute privacy and endless blue horizons.' },
  { id: 'r9', name: 'Parisian Haute Suite', location: 'Paris', country: 'France', type: 'Suite', price: 2300, rating: 4.9, size: 140, guests: 2, img: 'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?q=80&w=2070', amenities: ['City View', 'Michelin Dining', 'Butler Service'], desc: 'Overlooking Place Vendôme. Draped in silk, crystal chandeliers, and French elegance.' },
  { id: 'r10', name: 'Amalfi Coastal Retreat', location: 'Positano', country: 'Italy', type: 'Villa', price: 3100, rating: 5.0, size: 200, guests: 4, img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070', amenities: ['Sea View', 'Private Pool', 'Historic Terrace'], desc: 'Suspended between the lemon groves and the sea. The purest expression of Italian romance.' },
  { id: 'r11', name: 'Sahara Mirage Riad', location: 'Marrakech', country: 'Morocco', type: 'Riad', price: 1600, rating: 4.9, size: 350, guests: 6, img: 'https://images.unsplash.com/photo-1558971212-70b9241eb0d5?q=80&w=2070', amenities: ['Courtyard Pool', 'Private Chef', 'Spa'], desc: 'A private palace hidden within the Medina walls. Featuring traditional Zellige tilework and a rooftop lounge.' },
  { id: 'r12', name: 'Glacier Peak Penthouse', location: 'Zermatt', country: 'Switzerland', type: 'Penthouse', price: 3800, rating: 5.0, size: 300, guests: 8, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075', amenities: ['Mountain View', 'Fireplace', 'Ski-In/Out'], desc: 'Wake up to the Matterhorn. A multi-level penthouse with an outdoor heated jacuzzi.' },
  { id: 'r13', name: 'Burj Signature Estate', location: 'Dubai', country: 'UAE', type: 'Estate', price: 5500, rating: 5.0, size: 600, guests: 10, img: 'https://images.unsplash.com/photo-1582647509711-c8aa8a8b671e?q=80&w=2070', amenities: ['City View', 'Private Cinema', 'Chauffeur'], desc: 'An ultra-modern estate in the sky. Featuring a private cinema, wine tasting room, and 24/7 dedicated staff.' },
  { id: 'r14', name: 'Ubud Jungle Sanctuary', location: 'Bali', country: 'Indonesia', type: 'Villa', price: 1400, rating: 4.8, size: 210, guests: 4, img: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?q=80&w=2070', amenities: ['Jungle View', 'Infinity Pool', 'Yoga Deck'], desc: 'Immerse yourself in nature. A bamboo and teakwood masterpiece overlooking the Ayung River valley.' },
  { id: 'r15', name: 'The Venetian Palazzo', location: 'Venice', country: 'Italy', type: 'Palace', price: 4100, rating: 5.0, size: 380, guests: 6, img: 'https://images.unsplash.com/photo-1516483638261-f40889eba30e?q=80&w=2070', amenities: ['Canal View', 'Private Boat', 'Grand Piano'], desc: 'Arrive by private gondola to your 17th-century palazzo. Features original Murano glass chandeliers.' },
  { id: 'r16', name: 'Himalayan Cloud Lodge', location: 'Paro', country: 'Bhutan', type: 'Chalet', price: 2900, rating: 4.9, size: 160, guests: 2, img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071', amenities: ['Mountain View', 'Holistic Spa', 'Guided Treks'], desc: 'Perched on a cliff edge overlooking the Paro valley. A spiritual and physical retreat like no other.' }
];

const SERVICES_DATA: Service[] = [
  { id: 's1', title: 'Private Aviation', desc: 'Seamless global transfers via our fleet of private jets and helicopters, directly to your sanctuary.', icon: Plane },
  { id: 's2', title: 'Michelin Gastronomy', desc: 'World-renowned chefs preparing bespoke tasting menus in the privacy of your own dining room.', icon: Utensils },
  { id: 's3', title: 'Holistic Wellness', desc: 'In-suite spa treatments, ancient healing rituals, and personalized wellness programs.', icon: Sparkles },
  { id: 's4', title: 'Elite Concierge', desc: '24/7 dedicated lifestyle managers to fulfill every request, from rare wines to exclusive event access.', icon: Compass }
];

const ARTICLES_DATA: Article[] = [
  { id: 'a1', title: 'The Revival of Train Travel in Europe', category: 'Lifestyle', date: 'Oct 12, 2025', img: 'https://images.unsplash.com/photo-1515022353457-3f338dcb9280?q=80&w=2070' },
  { id: 'a2', title: 'A Curated Guide to Kyoto\'s Hidden Temples', category: 'Destinations', date: 'Oct 08, 2025', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070' },
  { id: 'a3', title: 'Inside the World of Private Island Buyouts', category: 'Exclusivity', date: 'Sep 29, 2025', img: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?q=80&w=2070' }
];

const ALL_AMENITIES = ['Sea View', 'Nile View', 'Mountain View', 'Private Pool', 'Butler Service', 'Private Spa', 'Michelin Dining', 'Helicopter Pad', 'Ski-In/Out', 'Private Cinema', 'Chauffeur'];
const ALL_COUNTRIES = ['All', 'Egypt', 'Turkey', 'Switzerland', 'Maldives', 'Italy', 'Japan', 'France', 'Morocco', 'UAE', 'Indonesia'];
const ALL_TYPES = ['All', 'Suite', 'Villa', 'Palace', 'Chalet', 'Penthouse', 'Riad', 'Estate'];

// ==========================================
// 3. THE BOOKING ENGINE (MAIN APP)
// ==========================================

export default function Home() {
  // State Management
  const [priceRange, setPriceRange] = useState<number>(6000);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Booking Widget State (Mock)
  const [guests, setGuests] = useState(2);

  // Refs for Smooth Scrolling
  const collectionRef = useRef<HTMLElement>(null);
  const destinationsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filtering Logic
  const filteredRooms = useMemo(() => {
    return ROOMS_DATA.filter((room) => {
      const matchPrice = room.price <= priceRange;
      const matchCountry = selectedCountry === 'All' || room.country === selectedCountry;
      const matchType = selectedType === 'All' || room.type === selectedType;
      const matchAmenities = selectedAmenities.length === 0 || selectedAmenities.every(a => room.amenities.includes(a));
      return matchPrice && matchCountry && matchType && matchAmenities;
    });
  }, [priceRange, selectedCountry, selectedType, selectedAmenities]);

  // Handlers
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

  // Horizontal Scroll Function for Destinations
  const scrollDestinations = (direction: 'left' | 'right') => {
    if (destinationsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      destinationsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-stone-300 font-sans selection:bg-[#B5935E] selection:text-white">
      
      {/* ========================================== */}
      {/* HEADER / NAVIGATION (Absolute & Transparent) */}
      {/* ========================================== */}
      <header className="absolute top-0 w-full z-50 px-8 py-6 flex justify-between items-center border-b border-white/10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2 cursor-pointer">
            <Gem size={24} className="text-[#B5935E]" />
            <span className="text-xl font-serif tracking-[6px] text-white">NAZEEL</span>
        </div>
        <nav className="hidden md:flex gap-8">
            {['Destinations', 'The Collection', 'Experiences', 'Journal'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-[9px] uppercase tracking-[3px] text-stone-300 hover:text-[#B5935E] transition-colors font-bold">
                    {item}
                </a>
            ))}
        </nav>
        <button className="border border-[#B5935E] text-[#B5935E] px-6 py-2.5 text-[9px] uppercase tracking-[3px] font-black hover:bg-[#B5935E] hover:text-white transition-all rounded-sm">
            Member Login
        </button>
      </header>

      {/* ========================================== */}
      {/* 1. CINEMATIC HERO & BOOKING WIDGET */}
      {/* ========================================== */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/80 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070" 
            alt="The Grand Reserve"
            className="w-full h-full object-cover opacity-70"
            style={{ animation: 'slowPan 40s infinite alternate linear' }}
          />
        </div>

        {/* Text Content */}
        <div className="relative z-20 text-center px-6 max-w-6xl -mt-20">
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
          <p className="max-w-2xl mx-auto text-stone-400 font-light text-base md:text-lg leading-relaxed italic border-l-2 border-[#B5935E] pl-6 bg-black/20 p-4 backdrop-blur-sm rounded-r-sm shadow-2xl">
            "Your access to the world's most exclusive suites, private villas, and historic palaces. Curated strictly for the global elite."
          </p>
        </div>

        {/* Floating Booking Widget */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-5xl bg-[#111]/90 backdrop-blur-xl border border-white/10 p-2 rounded-sm shadow-2xl hidden md:flex items-center">
            <div className="flex-1 flex items-center gap-4 px-6 py-4 border-r border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                <Globe size={18} className="text-[#B5935E]" />
                <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[2px] text-stone-500 font-bold">Location</span>
                    <span className="text-xs text-white font-medium">Where to next?</span>
                </div>
            </div>
            <div className="flex-1 flex items-center gap-4 px-6 py-4 border-r border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                <Calendar size={18} className="text-[#B5935E]" />
                <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[2px] text-stone-500 font-bold">Check-in</span>
                    <span className="text-xs text-white font-medium">Add dates</span>
                </div>
            </div>
            <div className="flex-1 flex items-center gap-4 px-6 py-4 border-r border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                <Calendar size={18} className="text-[#B5935E]" />
                <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[2px] text-stone-500 font-bold">Check-out</span>
                    <span className="text-xs text-white font-medium">Add dates</span>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <Users size={18} className="text-[#B5935E]" />
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-[2px] text-stone-500 font-bold">Guests</span>
                        <span className="text-xs text-white font-medium">{guests} Adults</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#B5935E] text-white px-10 py-5 text-[10px] uppercase tracking-[4px] font-black hover:bg-white hover:text-black transition-all h-full flex items-center rounded-sm"
            >
                Search
            </button>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. THE DESTINATIONS GALLERY (WITH SCROLL ARROWS) */}
      {/* ========================================== */}
      <section id="destinations" className="max-w-[1600px] mx-auto px-6 py-32 border-b border-white/5 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
                <span className="text-[10px] tracking-[6px] text-[#B5935E] uppercase font-bold block mb-4 flex items-center gap-3"><Globe size={14}/> Global Coordinates</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white">The <span className="italic text-stone-500">Destinations</span></h2>
            </div>
            
            {/* Scroll Navigation Controls */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => scrollDestinations('left')}
                    className="w-12 h-12 border border-white/10 flex items-center justify-center rounded-full hover:bg-[#B5935E] hover:border-[#B5935E] transition-all text-white group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={() => scrollDestinations('right')}
                    className="w-12 h-12 border border-white/10 flex items-center justify-center rounded-full hover:bg-[#B5935E] hover:border-[#B5935E] transition-all text-white group"
                >
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
            ref={destinationsScrollRef}
            className="flex overflow-x-auto gap-6 pb-10 snap-x hide-scrollbar scroll-smooth relative"
        >
            {CITIES_DATA.map((city) => (
                <div 
                    key={city.id} 
                    onClick={() => handleCityClick(city.country)}
                    className="min-w-[260px] md:min-w-[320px] h-[400px] relative group cursor-pointer snap-center overflow-hidden bg-black flex-shrink-0 border border-white/10 rounded-sm shadow-xl"
                >
                    <img 
                        src={city.img} 
                        alt={city.name} 
                        className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s] ease-out opacity-80" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                    
                    <div className="absolute bottom-8 left-8 text-white z-20">
                        <span className="text-[9px] uppercase tracking-[4px] text-[#B5935E] font-black mb-2 block drop-shadow-md">{city.country}</span>
                        <h3 className="text-3xl font-serif mb-4 group-hover:-translate-y-1 transition-transform duration-500 drop-shadow-lg">{city.name}</h3>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <span className="text-[9px] uppercase tracking-[2px] font-bold text-stone-200">Explore {city.count} Properties</span>
                            <ArrowRight size={12} className="text-[#B5935E]" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. THE EXPERIENCE (SERVICES OVERVIEW) */}
      {/* ========================================== */}
      <section id="experiences" className="max-w-[1600px] mx-auto px-6 py-32 border-b border-white/5 bg-[#0a0a0a]">
        <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[10px] tracking-[6px] text-[#B5935E] uppercase font-bold mb-4 flex items-center justify-center gap-3"><Sparkles size={14}/> Beyond Accommodation</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">The Nazeel <span className="italic text-stone-500">Experience</span></h2>
            <p className="text-stone-400 font-light text-sm leading-relaxed">
                We believe true luxury lies in anticipation. Our curated services ensure that every moment of your journey is flawlessly executed, long before you arrive.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES_DATA.map((service) => (
                <div key={service.id} className="p-8 border border-white/5 bg-[#111] hover:bg-white/5 transition-colors group rounded-sm text-center md:text-left">
                    <div className="w-14 h-14 bg-black border border-white/10 flex items-center justify-center rounded-full mb-6 mx-auto md:mx-0 group-hover:border-[#B5935E] transition-colors">
                        <service.icon size={24} className="text-[#B5935E]" />
                    </div>
                    <h3 className="text-lg font-serif text-white mb-3 tracking-wide">{service.title}</h3>
                    <p className="text-xs text-stone-400 font-light leading-relaxed">{service.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. THE FILTER & RESULTS SYSTEM (COLLECTION) */}
      {/* ========================================== */}
      <section id="collection" ref={collectionRef} className="max-w-[1600px] mx-auto px-6 py-32 scroll-mt-10">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center mb-8 border border-white/10 p-4 bg-[#111] backdrop-blur-md sticky top-4 z-50 shadow-2xl rounded-sm">
            <span className="text-xs uppercase tracking-[4px] font-bold text-white">Refine Collection</span>
            <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="text-[#B5935E] flex items-center gap-2 border border-[#B5935E] p-2 rounded-sm">
                <SlidersHorizontal size={18} />
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* FILTER SIDEBAR */}
          <aside className={`w-full lg:w-[280px] shrink-0 lg:sticky lg:top-24 space-y-10 bg-[#111] p-8 border border-white/5 shadow-2xl rounded-sm ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-5 mb-6">
                <SlidersHorizontal className="text-[#B5935E]" size={16} />
                <h3 className="text-[10px] uppercase tracking-[4px] text-white font-black">Filters</h3>
            </div>

            {/* Destination Filter */}
            <div className="space-y-4">
              <h4 className="text-[9px] uppercase tracking-[4px] text-stone-400 font-bold border-l-2 border-[#B5935E] pl-2">Destination</h4>
              <div className="flex flex-wrap gap-2">
                {ALL_COUNTRIES.map(country => (
                  <button 
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`px-3 py-2 text-[8px] uppercase tracking-[2px] font-bold border transition-all rounded-sm ${selectedCountry === country ? 'bg-[#B5935E] border-[#B5935E] text-white shadow-lg' : 'bg-black/40 border-white/10 text-stone-500 hover:border-white/30 hover:text-white'}`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-4">
              <h4 className="text-[9px] uppercase tracking-[4px] text-stone-400 font-bold border-l-2 border-[#B5935E] pl-2">Property Type</h4>
              <div className="flex flex-col gap-3">
                {ALL_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 border flex items-center justify-center transition-all rounded-sm ${selectedType === type ? 'bg-[#B5935E] border-[#B5935E]' : 'border-stone-700 bg-black group-hover:border-[#B5935E]'}`}>
                        {selectedType === type && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`text-[10px] tracking-[2px] uppercase ${selectedType === type ? 'text-white font-black' : 'text-stone-500 group-hover:text-stone-300'}`}>{type}</span>
                    <input type="radio" name="type" className="hidden" onChange={() => setSelectedType(type)} />
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-5">
              <div className="flex justify-between items-end border-l-2 border-[#B5935E] pl-2">
                  <h4 className="text-[9px] uppercase tracking-[4px] text-stone-400 font-bold">Max Rate / Night</h4>
                  <span className="text-sm font-serif text-[#B5935E] italic font-bold">${priceRange}</span>
              </div>
              <input 
                type="range" 
                min="500" max="6000" step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#B5935E] bg-stone-800 h-1 outline-none appearance-none cursor-pointer rounded-full"
              />
            </div>

            {/* Amenities Filter */}
            <div className="space-y-4">
              <h4 className="text-[9px] uppercase tracking-[4px] text-stone-400 font-bold border-l-2 border-[#B5935E] pl-2">Inclusions</h4>
              <div className="flex flex-col gap-3">
                {ALL_AMENITIES.map(amenity => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border flex items-center justify-center transition-all rounded-sm ${isSelected ? 'bg-white border-white' : 'border-stone-700 bg-black group-hover:border-white/50'}`}>
                            {isSelected && <Check size={12} className="text-black" />}
                        </div>
                        <span className={`text-[9px] tracking-[2px] uppercase ${isSelected ? 'text-white font-bold' : 'text-stone-500 group-hover:text-stone-300'}`}>{amenity}</span>
                        <input type="checkbox" className="hidden" onChange={() => toggleAmenity(amenity)} />
                    </label>
                  );
                })}
              </div>
            </div>

            <button 
                onClick={resetFilters}
                className="w-full py-4 border border-stone-800 bg-black text-stone-500 text-[9px] uppercase tracking-[4px] font-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg rounded-sm"
            >
                <X size={12} /> Reset Protocol
            </button>
          </aside>

          {/* ROOMS GRID RESULTS */}
          <div className="w-full lg:flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/5 pb-6 gap-4">
                <div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-2 tracking-tight">The Collection</h2>
                    <p className="text-[10px] uppercase tracking-[4px] text-stone-500 font-bold">
                        Displaying <span className="text-[#B5935E] text-sm">{filteredRooms.length}</span> Sanctuaries
                    </p>
                </div>
            </div>

            {filteredRooms.length === 0 ? (
                <div className="text-center py-32 bg-[#111] border border-white/5 shadow-2xl rounded-sm">
                    <Gem size={48} className="mx-auto text-stone-700 mb-6" strokeWidth={1} />
                    <h3 className="text-3xl font-serif text-white mb-4">No Sanctuaries Found</h3>
                    <p className="text-sm text-stone-400 font-light max-w-md mx-auto italic leading-relaxed">
                        "Your highly refined criteria yielded no immediate results. Please adjust your filters to explore our global inventory."
                    </p>
                    <button onClick={resetFilters} className="mt-8 border-b border-[#B5935E] text-[#B5935E] text-[9px] uppercase tracking-[3px] font-bold pb-1 hover:text-white hover:border-white transition-colors">
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredRooms.map(room => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 5. THE JOURNAL (ARTICLES SECTION) */}
      {/* ========================================== */}
      <section id="journal" className="max-w-[1600px] mx-auto px-6 py-32 border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
                <span className="text-[10px] tracking-[6px] text-[#B5935E] uppercase font-bold block mb-4 flex items-center gap-3"><Clock size={14}/> Editorial</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white">The <span className="italic text-stone-500">Journal</span></h2>
            </div>
            <a href="#" className="text-[10px] uppercase tracking-[3px] text-white hover:text-[#B5935E] transition-colors font-bold flex items-center gap-2 border-b border-[#B5935E] pb-1">
                View All Articles <ArrowUpRight size={14} />
            </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES_DATA.map(article => (
                <article key={article.id} className="group cursor-pointer">
                    <div className="h-[300px] overflow-hidden mb-6 relative rounded-sm">
                        <img 
                            src={article.img} 
                            alt={article.title}
                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="flex items-center gap-4 mb-3 text-[9px] uppercase tracking-[2px] font-bold text-stone-500">
                        <span className="text-[#B5935E]">{article.category}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                    </div>
                    <h3 className="text-2xl font-serif text-white group-hover:text-[#B5935E] transition-colors leading-snug">{article.title}</h3>
                </article>
            ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 6. MEGA FOOTER & NEWSLETTER */}
      {/* ========================================== */}
      <footer className="bg-black pt-32 pb-10 border-t border-white/10 relative overflow-hidden mt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-[#B5935E] to-transparent opacity-50" />
        
        <div className="max-w-[1600px] mx-auto px-8 relative z-10">
            {/* Top Footer: Newsletter & Brand */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Gem size={32} className="text-[#B5935E]" />
                        <h1 className="text-4xl font-serif tracking-[8px] font-bold text-white">NAZEEL</h1>
                    </div>
                    <p className="text-sm leading-relaxed text-stone-400 font-light max-w-md italic border-l-2 border-[#B5935E] pl-4">
                        "The pinnacle of global hospitality. Redefining the art of luxury travel for those who demand the absolute best."
                    </p>
                </div>
                
                <div className="bg-[#111] p-8 border border-white/5 rounded-sm">
                    <h4 className="text-[10px] uppercase tracking-[4px] text-white font-bold mb-4">Join The Inner Circle</h4>
                    <p className="text-xs text-stone-400 mb-6">Receive exclusive access to private listings and editorial content.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="bg-black border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-[#B5935E] transition-colors flex-1 rounded-sm"
                        />
                        <button className="bg-[#B5935E] text-white px-8 py-3 text-[10px] uppercase tracking-[3px] font-black hover:bg-white hover:text-black transition-all rounded-sm shrink-0">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Middle Footer: Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-t border-white/5 pt-16">
                <div>
                    <h5 className="text-[10px] uppercase tracking-[3px] text-white font-bold mb-6">Collection</h5>
                    <ul className="space-y-4">
                        {['Villas', 'Palaces', 'Penthouses', 'Private Islands'].map(link => (
                            <li key={link}><a href="#" className="text-xs text-stone-400 hover:text-[#B5935E] transition-colors">{link}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 className="text-[10px] uppercase tracking-[3px] text-white font-bold mb-6">Company</h5>
                    <ul className="space-y-4">
                        {['About Nazeel', 'The Experience', 'Careers', 'Press Room'].map(link => (
                            <li key={link}><a href="#" className="text-xs text-stone-400 hover:text-[#B5935E] transition-colors">{link}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 className="text-[10px] uppercase tracking-[3px] text-white font-bold mb-6">Support</h5>
                    <ul className="space-y-4">
                        {['Contact Concierge', 'FAQ', 'Privacy Policy', 'Terms of Service'].map(link => (
                            <li key={link}><a href="#" className="text-xs text-stone-400 hover:text-[#B5935E] transition-colors">{link}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 className="text-[10px] uppercase tracking-[3px] text-white font-bold mb-6">Connect</h5>
                    <ul className="space-y-4">
                        {['Instagram', 'Twitter (X)', 'LinkedIn', 'YouTube'].map(link => (
                            <li key={link}><a href="#" className="text-xs text-stone-400 hover:text-[#B5935E] transition-colors">{link}</a></li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Footer: Copyrights & Developer */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-8">
                <p className="text-[9px] uppercase tracking-[3px] text-stone-500 font-bold">
                    © {new Date().getFullYear()} Nazeel Limited. All Rights Reserved.
                </p>
                
                <div className="text-center md:text-right">
                    <p className="text-[9px] uppercase tracking-[3px] text-stone-400 font-bold mb-1">
                        Engineered with <Sparkles size={10} className="inline text-[#B5935E] mx-1" /> by <span className="text-white">Abdeltawap Mohamed</span>
                    </p>
                    <p className="text-[8px] uppercase tracking-[2px] text-[#B5935E]">
                        Software Engineer & Web Development | Mastery Group
                    </p>
                </div>
                
                <button onClick={scrollToTop} className="w-12 h-12 border border-stone-800 flex items-center justify-center hover:bg-[#B5935E] hover:border-[#B5935E] hover:text-white transition-all text-stone-500 group rounded-sm shadow-xl">
                    <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </div>
      </footer>

      {/* ========================================== */}
      {/* GLOBAL STYLES & ANIMATIONS */}
      {/* ========================================== */}
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
// 7. SUB-COMPONENTS
// ==========================================

function RoomCard({ room }: { room: Room }) {
  return (
    <div className="bg-[#111] border border-white/5 group hover:border-[#B5935E]/40 transition-all duration-500 flex flex-col h-full shadow-lg hover:shadow-2xl rounded-sm">
        
        {/* Image Header */}
        <div className="h-[260px] overflow-hidden relative">
            <img 
                src={room.img} 
                alt={room.name} 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-[2s] ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/10 to-transparent opacity-90" />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                {room.featured && (
                    <span className="bg-[#B5935E] px-3 py-1.5 text-[8px] tracking-[3px] uppercase font-black text-white inline-block shadow-lg rounded-sm">
                        Featured
                    </span>
                )}
                <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 text-[8px] tracking-[3px] uppercase font-black text-black inline-block shadow-lg rounded-sm">
                    {room.type}
                </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="flex items-center gap-2 text-[#B5935E]">
                    <MapPin size={12} />
                    <span className="text-[9px] uppercase tracking-[3px] font-black text-white drop-shadow-md">{room.location}</span>
                </div>
                <div className="flex gap-1 text-[#B5935E] drop-shadow-md bg-black/60 px-2 py-1 backdrop-blur-md border border-white/10 rounded-sm">
                    <Star size={10} className="fill-current" />
                    <span className="text-[9px] font-black text-white">{room.rating}</span>
                </div>
            </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-grow relative">
            <h3 className="text-2xl font-serif text-white mb-4 tracking-tight group-hover:text-[#B5935E] transition-colors line-clamp-1">{room.name}</h3>
            
            {/* Quick Iconic Specs */}
            <div className="flex items-center gap-5 mb-5 text-[#B5935E] border-b border-white/5 pb-5">
                <div className="flex items-center gap-2" title="Size">
                    <Maximize size={14} /> <span className="text-[9px] font-bold text-stone-400">{room.size}m²</span>
                </div>
                <div className="flex items-center gap-2" title="Guests">
                    <Users size={14} /> <span className="text-[9px] font-bold text-stone-400">{room.guests}</span>
                </div>
                <div className="flex items-center gap-2" title="Beds">
                    <BedDouble size={14} /> <span className="text-[9px] font-bold text-stone-400">1</span>
                </div>
            </div>

            <p className="text-xs text-stone-400 font-light leading-relaxed mb-6 italic flex-grow line-clamp-2">"{room.desc}"</p>
            
            {/* Inclusions Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
                {room.amenities.slice(0, 2).map(a => (
                    <span key={a} className="px-2 py-1 bg-black border border-white/5 text-[8px] uppercase tracking-[2px] text-stone-400 rounded-sm">{a}</span>
                ))}
                {room.amenities.length > 2 && (
                    <span className="px-2 py-1 bg-transparent border border-white/5 text-[8px] uppercase tracking-[2px] text-stone-500 rounded-sm">+{room.amenities.length - 2}</span>
                )}
            </div>

            {/* Footer Row */}
            <div className="flex justify-between items-center mt-auto pt-5 border-t border-white/5">
                <div>
                    <p className="text-[8px] uppercase tracking-[3px] text-stone-500 font-bold mb-1">Per Night</p>
                    <p className="text-2xl font-serif text-white">${room.price}</p>
                </div>
                <button className="bg-transparent border border-[#B5935E] text-[#B5935E] px-4 py-2.5 text-[9px] uppercase tracking-[3px] font-black hover:bg-[#B5935E] hover:text-white transition-all flex items-center gap-2 rounded-sm group/btn">
                    Reserve <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    </div>
  );
}