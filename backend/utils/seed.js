const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('../models/Place');

dotenv.config();

const places = [
    {
        name: "Kashmir Valley",
        description: "Heaven on Earth with snow-capped mountains, beautiful lakes, and lush green valleys.",
        location: { city: "Srinagar", state: "Jammu & Kashmir", country: "India", coordinates: { lat: 34.0837, lng: 74.7973 } },
        images: ["https://images.unsplash.com/photo-1566836610593-62a64888a216?w=800"],
        category: "mountain",
        rating: 4.8,
        priceRange: "standard",
        bestTimeToVisit: "March to October",
        activities: ["Shikara Ride", "Gulmarg Skiing", "Pahalgam Trekking", "Mughal Gardens"],
        tags: ["snow", "valley", "lake", "romantic"],
        isPopular: true
    },
    {
        name: "Goa Beaches",
        description: "India's beach paradise with golden sands, vibrant nightlife, and Portuguese heritage.",
        location: { city: "Panaji", state: "Goa", country: "India", coordinates: { lat: 15.2993, lng: 74.1240 } },
        images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800"],
        category: "beach",
        rating: 4.6,
        priceRange: "budget",
        bestTimeToVisit: "November to February",
        activities: ["Water Sports", "Beach Parties", "Fort Aguada", "Dudhsagar Falls"],
        tags: ["beach", "party", "water-sports", "nightlife"],
        isPopular: true
    },
    {
        name: "Kerala Backwaters",
        description: "Serene network of lagoons, lakes, and canals lined with palm trees and traditional houseboats.",
        location: { city: "Alleppey", state: "Kerala", country: "India", coordinates: { lat: 9.4981, lng: 76.3388 } },
        images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"],
        category: "city",
        rating: 4.7,
        priceRange: "standard",
        bestTimeToVisit: "September to March",
        activities: ["Houseboat Stay", "Ayurvedic Spa", "Kathakali Show", "Tea Plantation Visit"],
        tags: ["backwaters", "houseboat", "ayurveda", "nature"],
        isPopular: true
    },
    {
        name: "Manali",
        description: "Himachal Pradesh's adventure hub with snow-capped peaks, apple orchards, and thrilling activities.",
        location: { city: "Manali", state: "Himachal Pradesh", country: "India", coordinates: { lat: 32.2396, lng: 77.1887 } },
        images: ["https://images.unsplash.com/photo-1626010448982-4d629b1a015f?w=800"],
        category: "adventure",
        rating: 4.5,
        priceRange: "budget",
        bestTimeToVisit: "October to June",
        activities: ["Paragliding", "River Rafting", "Solang Valley", "Rohtang Pass"],
        tags: ["adventure", "snow", "mountains", "trekking"],
        isPopular: true
    },
    {
        name: "Jaipur",
        description: "The Pink City - a royal destination with magnificent forts, palaces, and rich Rajasthani culture.",
        location: { city: "Jaipur", state: "Rajasthan", country: "India", coordinates: { lat: 26.9124, lng: 75.7873 } },
        images: ["https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800"],
        category: "historical",
        rating: 4.6,
        priceRange: "standard",
        bestTimeToVisit: "October to March",
        activities: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar"],
        tags: ["heritage", "palace", "culture", "shopping"],
        isPopular: true
    },
    {
        name: "Andaman Islands",
        description: "Pristine beaches, crystal clear waters, and vibrant coral reefs in the Bay of Bengal.",
        location: { city: "Port Blair", state: "Andaman & Nicobar", country: "India", coordinates: { lat: 11.7401, lng: 92.6586 } },
        images: ["https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800"],
        category: "beach",
        rating: 4.7,
        priceRange: "luxury",
        bestTimeToVisit: "October to May",
        activities: ["Scuba Diving", "Cellular Jail", "Radhanagar Beach", "Island Hopping"],
        tags: ["island", "diving", "beach", "nature"],
        isPopular: true
    },
    {
        name: "Rishikesh",
        description: "The Yoga Capital of the World, nestled in the foothills of the Himalayas along the Ganges.",
        location: { city: "Rishikesh", state: "Uttarakhand", country: "India", coordinates: { lat: 30.0869, lng: 78.2676 } },
        images: ["https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800"],
        category: "adventure",
        rating: 4.5,
        priceRange: "budget",
        bestTimeToVisit: "September to April",
        activities: ["River Rafting", "Bungee Jumping", "Yoga Retreat", "Ganga Aarti"],
        tags: ["yoga", "adventure", "spiritual", "river"],
        isPopular: true
    },
    {
        name: "Udaipur",
        description: "The City of Lakes - romantic destination with stunning palaces and serene lakes.",
        location: { city: "Udaipur", state: "Rajasthan", country: "India", coordinates: { lat: 24.5854, lng: 73.7125 } },
        images: ["https://images.unsplash.com/photo-1561361058-4c1d22bf2432?w=800"],
        category: "historical",
        rating: 4.7,
        priceRange: "luxury",
        bestTimeToVisit: "October to March",
        activities: ["Lake Pichola Boat Ride", "City Palace", "Jag Mandir", "Sunset View"],
        tags: ["lake", "palace", "romantic", "luxury"],
        isPopular: true
    }
];

async function seed() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/stt-holidays';
        console.log('🔗 Connecting to:', mongoUri.split('@')[1] || 'Local MongoDB');
        await mongoose.connect(mongoUri);
        await Place.deleteMany({});
        await Place.insertMany(places);
        console.log('✅ Seed data inserted successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
