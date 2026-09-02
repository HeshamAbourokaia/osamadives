/**
 * Gallery Configuration
 *
 * This file stores photo metadata for Osama's diving adventures gallery.
 * Photos are stored in /public/images/ and /public/images/gallery/
 *
 * HOW TO ADD NEW PHOTOS:
 * 1. Upload the photo to /public/images/gallery/ (recommended) or /public/images/
 * 2. Add a new entry to the galleryPhotos array below
 * 3. Fill in the metadata (title, description, location, etc.)
 * 4. The photo will appear automatically on the gallery page
 *
 * FUTURE FACEBOOK AUTO-SYNC:
 * The API route at /api/gallery is designed to support future Facebook Graph API
 * integration. When Facebook approves access, the fetchFromFacebook() function
 * can be implemented to auto-sync photos from facebook.com/osamasharks
 */

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  date?: string;
  featured?: boolean;
  category: 'diving' | 'underwater' | 'marine-life' | 'dive-sites' | 'training' | 'adventures' | 'stories' | 'heritage' | 'team' | 'dahab' | 'equipment';
  tags?: string[];
  /** Extended narrative for photos with stories - shown in lightbox */
  story?: string;
}

// Dive site coordinates for Google Maps integration
export const DIVE_SITE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Blue Hole, Dahab': { lat: 28.5722, lng: 34.5381 },
  'The Canyon, Dahab': { lat: 28.4847, lng: 34.5189 },
  'Ras Abu Galum, Sinai': { lat: 28.6167, lng: 34.5500 },
  'Dahab Lagoon': { lat: 28.4936, lng: 34.5136 },
  'Lighthouse Reef, Dahab': { lat: 28.4794, lng: 34.5147 },
  'The Islands, Dahab': { lat: 28.5150, lng: 34.5286 },
  'Eel Garden, Dahab': { lat: 28.5011, lng: 34.5164 },
  'Dahab, Red Sea': { lat: 28.5000, lng: 34.5167 },
  'Dahab, Egypt': { lat: 28.5000, lng: 34.5167 },
};

// Helper function to generate Google Maps URL from coordinates
export const getGoogleMapsUrl = (coordinates: { lat: number; lng: number }): string => {
  return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
};

// Helper function to get coordinates for a location
export const getCoordinatesForLocation = (location: string): { lat: number; lng: number } | undefined => {
  return DIVE_SITE_COORDINATES[location];
};

export const galleryPhotos: GalleryPhoto[] = [
  // === PIONEER HERITAGE - Historical proof of early settlement ===
  {
    id: 'pioneer-1987',
    src: '/images/dahab-1987-pioneer-family.jpeg',
    alt: 'Young Osama with early visitors in Dahab, 1987 - proof of pioneer family settlement',
    title: 'The Beginning: Dahab, 1987',
    description: 'A rare photograph from August 1987, just four years after my family became one of the first to settle in Dahab.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '1987-08-17',
    featured: true,
    category: 'heritage',
    tags: ['heritage', 'pioneer', '1987', 'history', 'family', 'story'],
    story: 'This photograph is one of my most treasured possessions. Dated August 17, 1987 - just four years after my family arrived in Dahab from Cairo. We were the fourth family to settle here, in a village with no electricity, no phones, and only dirt roads leading to the sea. That truck you see? It was one of the few vehicles that could make the journey from the mainland. Behind us, early Dahab - just a handful of buildings, some Bedouin camps, and endless possibilities. My father had a vision: that this tiny fishing village where the desert meets the Red Sea would become something special. He opened Shark Restaurant, and we began welcoming travelers from around the world to our table. Forty years later, that same hospitality continues - first on land at our restaurant, now underwater as I guide visitors through the reefs I have known since childhood. When people ask me why I love Dahab so much, I show them this photo. This is not just where I work - this is my home, my heritage, my entire life.'
  },

  // === STORIES - Photos with meaningful narratives ===
  {
    id: 'story-coral-explorer',
    src: '/images/FB_IMG_1625154383404.jpg',
    alt: 'People relaxing in a Bedouin beach cafe in Dahab with cushions and drinks, a Keesiedive.nl shirt visible, June 2012',
    title: 'Tea Before the Dive',
    description: 'This is how every dive day starts in Dahab - tea, paperwork, and good company at the beach cafe.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'stories',
    tags: ['cafe', 'social', 'dahab', 'story'],
    story: 'This photo is from June 2012, and it captures the real rhythm of diving in Dahab. Before any dive, you sit down in a Bedouin-style cafe right on the beach, drink tea or fresh juice, fill out the paperwork, and talk about what you are going to see below. You see that Keesiedive shirt? That is a Dutch dive outfit - we had divers from all over coming through. The girl waving in the back, the boy doing his logbook - everyone relaxed, no rush. That is Dahab diving. It is not factory-style tourism. You take your time, you settle in, and then you go explore. The blue truck behind us would take us to the dive site. Some of my best memories are from these moments before the dive even starts.'
  },
  {
    id: 'story-first-breath',
    src: '/images/OsamaDives_PADI_Open_Water.jpeg',
    alt: 'Osama gearing up his son Abdullah with a scuba tank on the Dahab promenade, other children in wetsuits waiting nearby',
    title: 'Training the Next Generation',
    description: 'Getting my son Abdullah geared up right here on the Dahab promenade. Starting them young - that is how you build a diver for life.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'stories',
    tags: ['abdullah', 'son', 'family', 'kids', 'teaching', 'dahab', 'story', 'next-generation'],
    story: 'This is my son Abdullah, and I am getting him geared up right here on the Dahab promenade. Look at him - so serious, so focused. The tank is almost as big as he is! I started him young because that is how my father taught me. You do not wait until they are old enough - you put them in the water early and they grow up with the sea in their blood. You can see more kids in wetsuits waiting for their turn behind us. This is what I love most about what I do - passing it on to the next generation, starting with my own son. Abdullah is growing up surrounded by diving every single day. He sees the dive teams come and go, he knows the gear, he knows the sea. One day he will carry this forward. That is the dream of every father - to see your child love what you love, and to know that everything you built will live on.'
  },
  {
    id: 'story-camel-safari',
    src: '/images/Camels.jpeg',
    alt: 'Camel safari to remote dive sites in Sinai',
    title: 'Journey to the Untouched Reef',
    description: 'The Ras Abu Galum safari - where desert tradition meets diving adventure.',
    location: 'Ras Abu Galum, Sinai',
    coordinates: { lat: 28.6167, lng: 34.5500 },
    featured: true,
    category: 'stories',
    tags: ['camel', 'safari', 'adventure', 'sinai', 'story'],
    story: 'The Ras Abu Galum safari is one of my favorite ways to share the magic of Sinai. We travel by camel through the ancient desert, the same way Bedouins have for centuries, and then suddenly - the sea appears. The reef here is pristine because few people make the journey. The contrast is extraordinary: burning desert above, cool blue paradise below. I have been leading these safaris for years, and each time I am reminded that Dahab is not just about diving - it is about the intersection of two worlds, the desert and the sea, tradition and adventure. When you surface after the dive and see camels waiting on the shore, you understand that you are experiencing something truly unique.'
  },
  {
    id: 'story-post-dive',
    src: '/images/Osama at the back of the truck after the dive.jpg',
    alt: 'Osama sitting on the back of a pickup truck in his black wetsuit, zipping up, with desert landscape and dive tanks visible behind him',
    title: 'Back of the Truck',
    description: 'Zipping up the wetsuit on the back of the truck, desert sun on my face, gear stacked behind me. This is real Dahab diving.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'stories',
    tags: ['post-dive', 'truck', 'desert', 'story'],
    story: 'This is the real diving life, my friend. Sitting on the back of the truck in my wetsuit, the desert stretching out behind me, the dive site right there by the road. You see the tanks and gear piled up? Another diver getting ready on the other truck? This is how we do it in Dahab - no luxury yacht, no fancy marina. Just a truck, a tank, and the sea. I love this moment. The sun warms you up after the dive, you can still taste the salt, and your mind is full of everything you just saw below. Someone always says the same thing: "That was the best dive of my life." And you know what? In Dahab, it usually is.'
  },
  {
    id: 'story-shared-experience',
    src: '/images/FB_IMG_1638331910256.jpg',
    alt: 'Diver silhouetted behind a massive gorgonian fan coral in the Red Sea, deep blue water',
    title: 'The Old Fan Coral',
    description: 'A diver dwarfed by a gorgonian sea fan that has been growing here longer than any of us have been alive.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'stories',
    tags: ['coral', 'gorgonian', 'underwater', 'story'],
    story: 'This gorgonian fan coral is one of my favorite things to show divers. Look at the size of it compared to the diver behind it - the person almost disappears. A fan coral this large could be a hundred years old or more, growing slowly in the current, filtering food from the water day after day. I always bring my divers to this spot and tell them to just hover and look. You can see the intricate pattern of every branch, like lace made by the sea itself. When the current is right, the coral opens up fully and it is like a living curtain between you and the blue. This is the kind of thing you cannot see in any aquarium. You have to come here, to this reef, and see it in person.'
  },
  {
    id: 'story-in-my-element',
    src: '/images/OsamaDives_Him_Self.jpeg',
    alt: 'Osama in full Cressi dive gear at Dahab shoreline preparing for a dive, Sinai mountains and Red Sea behind him',
    title: 'In My Element',
    description: 'Geared up at the shore, the Red Sea calling. After all these years, I still feel the excitement before every single dive.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'stories',
    tags: ['osama', 'portrait', 'diving', 'story'],
    story: 'People ask me how I can still be excited after thousands of dives. The truth is, every dive is different. The light changes, the fish move differently, the reef reveals new secrets. I have been diving the same sites for over 15 years, and I still discover something new almost every time. The Red Sea is my home, my office, my playground, and my teacher. When I am underwater, I am the most complete version of myself. The silence, the weightlessness, the colors - it is meditation in motion. I am not just a dive instructor; I am a student of the sea, and my education never ends.'
  },

  // === DIVE SITES ===
  {
    id: 'blue-hole-1',
    src: '/images/OsamaDives_The_Blue_Hole.jpeg',
    alt: 'The famous Blue Hole dive site in Dahab, Egypt with crystal clear waters',
    title: 'The Blue Hole',
    description: 'People ask me why I never get tired of the Blue Hole after thousands of dives. How could I? This sinkhole holds more moods than the sea has colors. Some mornings it mirrors the sky like glass. Other days, currents stir stories from the deep. I know every corner, every mood - and it still surprises me.',
    location: 'Blue Hole, Dahab',
    coordinates: { lat: 28.5722, lng: 34.5381 },
    featured: true,
    category: 'dive-sites',
    tags: ['blue-hole', 'dahab', 'famous-dive-site']
  },
  {
    id: 'blue-hole-2',
    src: '/images/OsamaDives_The_Blue_Hole.jpg',
    alt: 'Aerial view of the Blue Hole dive site showing the circular formation',
    title: 'The Eye of the Sea',
    description: 'From above, you understand why ancient Bedouins thought this place was sacred. A perfect circle carved into the reef, 100 meters deep, holding water so clear it seems to glow. My grandfather told me stories about this spot before diving even came to Dahab. Some places just hold power.',
    location: 'Blue Hole, Dahab',
    coordinates: { lat: 28.5722, lng: 34.5381 },
    category: 'dive-sites',
    tags: ['blue-hole', 'aerial', 'dahab']
  },
  {
    id: 'canyon-1',
    src: '/images/OsamDives_The_Canyon.jpg',
    alt: 'The Canyon dive site in Dahab with dramatic underwater rock formations',
    title: 'The Canyon',
    description: 'When light pierces through The Canyon at midday, divers stop breathing - not from their regulators failing, but from wonder. I discovered my favorite crevice here fifteen years ago. A secret garden of glassfish that most divers swim right past. Knowing where to pause makes all the difference.',
    location: 'The Canyon, Dahab',
    coordinates: { lat: 28.4847, lng: 34.5189 },
    featured: true,
    category: 'dive-sites',
    tags: ['canyon', 'dahab', 'rock-formations']
  },
  {
    id: 'canyon-2',
    src: '/images/OsamDives_The_Canyon(1).jpg',
    alt: 'Inside The Canyon dive site showing the narrow passage',
    title: 'Through the Narrows',
    description: 'Underwater, words become useless. You communicate through eyes, through hand signals, through presence. When I guide someone through this narrow passage, I watch their body relax as they trust me to lead them safely. That trust is sacred - the same trust my family built serving guests at our restaurant for forty years.',
    location: 'The Canyon, Dahab',
    coordinates: { lat: 28.4847, lng: 34.5189 },
    category: 'dive-sites',
    tags: ['canyon', 'passage', 'dahab']
  },
  {
    id: 'coral-reef-1',
    src: '/images/FB_IMG_1638331910256.jpg',
    alt: 'A diver beside a giant gorgonian sea fan on a Dahab reef',
    title: 'A Living Reef',
    description: 'These corals were here before my family arrived in 1983. They will be here long after. When I was young, my father showed me how to read the reef - which corals meant healthy water, which fish meant good fishing. Now I pass that knowledge to visitors. Hospitality goes deeper than tables and chairs.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'marine-life',
    tags: ['coral', 'reef', 'sea-fan', 'red-sea']
  },
  {
    id: 'osama-himself',
    src: '/images/OsamaDives_Him_Self.jpeg',
    alt: 'Osama in full Cressi dive gear and DiveYork mask strap at the Dahab shoreline with Sinai mountains behind him, another diver walking in the background',
    title: 'Ready to Go',
    description: 'Cressi wetsuit on, gear checked, Sinai mountains behind me. This is my morning routine - getting ready for another day in my office, the Red Sea.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'diving',
    tags: ['osama', 'portrait', 'cressi']
  },
  {
    id: 'osama-tanks',
    src: '/images/Osama7Tanks.jpeg',
    alt: 'Osama diving underwater carrying seven tanks in a technical diving configuration, depth reading 11.5 meters at 22 degrees',
    title: 'Seven Tanks Deep',
    description: 'Technical diving at its finest - that is me carrying seven tanks on one dive. Trimix, stages, deco bottles. At 11.5 meters and 22 degrees, heading down.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'diving',
    tags: ['technical', 'trimix', 'tanks']
  },
  {
    id: 'open-water',
    src: '/images/OsamaDives_PADI_Open_Water.jpeg',
    alt: 'PADI Open Water diving course student in Dahab',
    title: 'The Moment Everything Changes',
    description: 'I have seen hundreds of first breaths underwater. The initial panic, the confusion, then - that moment. The face softens. The eyes widen. Something shifts forever. Dahab\'s calm lagoon cradles beginners like a gentle hand.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'training',
    tags: ['padi', 'open-water', 'certification', 'students']
  },
  {
    id: 'advanced-water',
    src: '/images/Advanced Open Water.jpeg',
    alt: 'Group of seven divers underwater posing with fist pumps and peace signs, bubbles rising in deep blue water',
    title: 'Underwater Crew',
    description: 'Seven divers, one team, fists in the air underwater. This is what a good dive group looks like - confident, happy, and pumped up.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'training',
    tags: ['group', 'underwater', 'celebration']
  },
  {
    id: 'cpr-training',
    src: '/images/OsamaDives_CPR Training Simulation.png',
    alt: 'Emergency oxygen kit being administered to a patient during a dive emergency response training simulation',
    title: 'When Seconds Matter',
    description: 'Emergency oxygen administration training - because the safety of every diver in my care is something I take more seriously than anything.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'training',
    tags: ['oxygen', 'emergency', 'safety', 'training']
  },
  {
    id: 'camel-safari',
    src: '/images/Camels.jpeg',
    alt: 'Camel safari to remote dive sites in Sinai',
    title: 'The Old Way to the Sea',
    description: 'Before trucks, before cars, Bedouins crossed Sinai by camel. The Ras Abu Galum safari honors that tradition - riding through bronze canyons to reach reefs that speedboats will never find. Guests arrive the way visitors have for centuries.',
    location: 'Ras Abu Galum, Sinai',
    coordinates: { lat: 28.6167, lng: 34.5500 },
    featured: true,
    category: 'adventures',
    tags: ['camel', 'safari', 'adventure', 'sinai']
  },
  {
    id: 'after-dive',
    src: '/images/Osama at the back of the truck after the dive.jpg',
    alt: 'Osama relaxing after a dive at the back of a truck',
    title: 'The Stories We Tell',
    description: 'The truck ride back is when the magic settles in. Salt-dried skin, sun-warmed smiles, and that shared silence of people who just witnessed something beautiful together. This is when strangers become friends. The reef gives you stories; the ride home lets you savor them.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'adventures',
    tags: ['post-dive', 'relaxation', 'community']
  },
  {
    id: 'fb-dive-1',
    src: '/images/FB_IMG_1621238990084.jpg',
    alt: 'Osama in wetsuit giving OK sign with a young boy in wetsuit in front of Planet Divers center in Dahab, tank cart beside them',
    title: 'OK Sign at Planet Divers',
    description: 'This young man came to Planet Divers for his first dive experience, and left giving me the OK sign like a pro.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'training',
    tags: ['kids', 'planet-divers', 'dahab']
  },
  {
    id: 'fb-dive-2',
    src: '/images/FB_IMG_1625154352007.jpg',
    alt: 'Osama in wetsuit with two smiling female divers making heart signs with their hands at a Dahab dive center',
    title: 'Hearts for Diving',
    description: 'Heart signs after a dive with two wonderful divers who came to Dahab all the way from Europe. This is what it is all about.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'team',
    tags: ['friends', 'post-dive', 'dahab']
  },
  {
    id: 'fb-dive-3',
    src: '/images/FB_IMG_1625154383404.jpg',
    alt: 'Diver exploring coral formations',
    title: 'Reading the Garden',
    description: 'Every coral formation tells a story if you know how to listen. This table coral shelters a family of cardinalfish. That brain coral marks where the current shifts. Years of diving taught me to read the reef like my father taught me to read the weather.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'underwater',
    tags: ['coral', 'exploration', 'underwater']
  },
  {
    id: 'fb-dive-4',
    src: '/images/FB_IMG_1632329112940.jpg',
    alt: 'Group selfie of Osama with six friends and divers sitting on a wooden bench in a courtyard with green plants in Dahab',
    title: 'Dahab Friends',
    description: 'These are the faces you see when you become part of the Dahab diving community - friends from everywhere, smiling like family.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'diving',
    tags: ['dahab', 'friends', 'community']
  },
  {
    id: 'fb-dive-5',
    src: '/images/FB_IMG_1638331910256.jpg',
    alt: 'Diver hovering behind a giant gorgonian fan coral in the deep blue Red Sea',
    title: 'Sea Fan Cathedral',
    description: 'One of the biggest gorgonian fans I know on our reefs. Every time I bring a diver here, they just stop and stare.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'underwater',
    tags: ['gorgonian', 'coral', 'underwater']
  },

  // === NEW GALLERY IMAGES - DIVING ===
  {
    id: 'gallery-canyon-silhouette',
    src: '/images/gallery/diving/osamdives_the_canyon.jpeg',
    alt: 'Diver silhouetted with arms spread wide inside The Canyon narrow gap, sunlight pouring through jagged rock walls from above, bubbles rising',
    title: 'Floating in The Canyon',
    description: 'I took this looking up from the bottom of The Canyon. The diver has arms out, floating between the walls, sunlight pouring in. This is my favorite shot of this dive site.',
    location: 'The Canyon, Dahab',
    coordinates: { lat: 28.4847, lng: 34.5189 },
    featured: true,
    category: 'diving',
    tags: ['canyon', 'silhouette', 'underwater']
  },
  {
    id: 'gallery-osama-coral-reef',
    src: '/images/gallery/diving/fb_img_1633902371206.jpeg',
    alt: 'Osama swimming over coral reef in Scuba Sub gear with yellow mask, giving OK sign, professional underwater photo by Bruno Walmora',
    title: 'My Office View',
    description: 'This is me hovering over the reef in my Scuba Sub gear. Bruno Walmora took this photo - he really captured the blue of Dahab that day.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'diving',
    tags: ['osama', 'coral', 'underwater', 'portrait']
  },
  {
    id: 'gallery-canyon-pose',
    src: '/images/gallery/diving/fb_img_1636476791947.jpeg',
    alt: 'Osama kneeling on sandy bottom inside The Canyon wearing Cressi wetsuit, arms spread wide, another diver visible in the blue gap behind him',
    title: 'Welcome to My Canyon',
    description: 'Kneeling at the bottom of The Canyon in my Cressi suit, arms wide open. That blue glow behind me is the light coming through the narrow gap. Another diver hovering up there waiting for me.',
    location: 'The Canyon, Dahab',
    coordinates: { lat: 28.4847, lng: 34.5189 },
    featured: true,
    category: 'diving',
    tags: ['canyon', 'cressi', 'osama']
  },
  {
    id: 'gallery-giant-stride',
    src: '/images/gallery/diving/whatsapp-image-2025-05-01-at-16.20.55.jpeg',
    alt: 'Diver mid-air doing giant stride entry off a wooden pier into turquoise water, desert mountains in background, ladder and shelters visible',
    title: 'The Giant Stride',
    description: 'One big step off the pier and you are in. Look at that turquoise water below, the desert cliffs behind - this is a typical entry point here in Dahab. No boat needed.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'diving',
    tags: ['entry', 'pier', 'action']
  },
  {
    id: 'gallery-wreck-truck',
    src: '/images/gallery/diving/whatsapp-image-2025-05-08-at-15.46.36-1.jpeg',
    alt: 'Close-up of a coral-encrusted military truck cab inside the SS Thistlegorm wreck, windows dark, hull covered in marine growth',
    title: 'Truck in the Thistlegorm',
    description: 'Look at this truck cab still sitting inside the Thistlegorm after more than 80 years underwater. The coral has claimed it, but you can still see the windows, the shape of the cabin. History frozen in the deep.',
    location: 'SS Thistlegorm, Red Sea',
    category: 'diving',
    tags: ['wreck', 'thistlegorm', 'history']
  },
  {
    id: 'gallery-wreck-motorcycle',
    src: '/images/gallery/diving/whatsapp-image-2025-05-08-at-15.46.38.jpeg',
    alt: 'A British WWII motorcycle completely encrusted with coral and marine growth sitting upright inside the SS Thistlegorm cargo hold',
    title: 'The BSA Motorcycle',
    description: 'This BSA motorcycle was being shipped to British troops in North Africa when the Thistlegorm was bombed in 1941. Now it sits there covered in coral, tire still on the rim. I have seen this bike hundreds of times and it still gives me chills.',
    location: 'SS Thistlegorm, Red Sea',
    featured: true,
    category: 'diving',
    tags: ['wreck', 'thistlegorm', 'motorcycle']
  },
  {
    id: 'gallery-wreck-tires',
    src: '/images/gallery/diving/whatsapp-image-2025-05-08-at-15.46.39-1.jpeg',
    alt: 'Two military truck tires resting on the floor of the SS Thistlegorm cargo hold, surrounded by corroded metal walls',
    title: 'Tires in the Hold',
    description: 'Two truck tires sitting on the floor of the Thistlegorm cargo hold, right where they landed when the ship went down. The tread is still visible after 80 years. The sea preserves things in its own way.',
    location: 'SS Thistlegorm, Red Sea',
    category: 'diving',
    tags: ['wreck', 'thistlegorm', 'cargo']
  },
  {
    id: 'gallery-wreck-machinery',
    src: '/images/gallery/diving/whatsapp-image-2025-05-08-at-15.48.20.jpeg',
    alt: 'Close-up of coral-encrusted bottles or containers in a metal crate inside the SS Thistlegorm wreck, turquoise marine growth visible',
    title: 'Supplies from 1941',
    description: 'A crate of supplies still sitting in the Thistlegorm, covered in decades of coral growth. You can still make out the shapes of the bottles inside. Every time I dive this wreck, I think about the men who loaded these crates.',
    location: 'SS Thistlegorm, Red Sea',
    category: 'diving',
    tags: ['wreck', 'thistlegorm', 'artifacts']
  },
  {
    id: 'gallery-eagle-ray',
    src: '/images/gallery/diving/whatsapp-image-2025-05-10-at-12.58.37-1.jpeg',
    alt: 'Diver swimming right alongside a spotted eagle ray in open blue water, the ray\'s white-spotted wings spread wide',
    title: 'Side by Side with an Eagle Ray',
    description: 'You cannot plan these moments. This eagle ray just appeared and decided to swim right next to our diver. The white spots on those wings, the way it glides without a single movement - I have been diving for decades and my heart still beats faster when I see one.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'diving',
    tags: ['eagle-ray', 'marine-life', 'encounter']
  },
  {
    id: 'gallery-coral-pinnacle',
    src: '/images/gallery/diving/whatsapp-image-2025-05-10-at-12.58.37-2.jpeg',
    alt: 'Massive coral pinnacle covered in orange, pink, yellow and blue hard corals rising from the reef, small fish swimming around it',
    title: 'The Coral Tower',
    description: 'This coral tower is packed with every color the reef has to offer - orange fire coral, pink branching coral, yellow brain coral, all growing on top of each other. A small fish darting around. This is what the Red Sea looks like when you take care of it.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'diving',
    tags: ['coral', 'reef', 'colorful']
  },
  {
    id: 'gallery-turtle-birthday',
    src: '/images/gallery/diving/whatsapp-image-2025-05-10-at-12.58.42-1.jpeg',
    alt: 'Diver holding a handwritten Happy Birthday Osama slate underwater while a large green sea turtle swims right past in the foreground, sunlight streaming from above',
    title: 'Birthday Turtle',
    description: 'My friends surprised me with a birthday sign underwater, and then this big green turtle decided to swim right into the photo. You cannot make this up. Best birthday present the sea ever gave me.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'diving',
    tags: ['turtle', 'birthday', 'celebration']
  },
  {
    id: 'gallery-canyon-cressi',
    src: '/images/gallery/diving/whatsapp-image-2025-05-10-at-12.58.50-1.jpeg',
    alt: 'Osama in Cressi wetsuit kneeling on the sandy bottom of The Canyon, arms wide, blue light glowing through the narrow passage behind, another diver hovering above',
    title: 'The Canyon Floor',
    description: 'Same spot, different angle - me on the floor of The Canyon in my Cressi suit. See that blue glow? That is the light filtering down through the narrow gap above. A diver floating up there for scale. This place never gets old.',
    location: 'The Canyon, Dahab',
    coordinates: { lat: 28.4847, lng: 34.5189 },
    category: 'diving',
    tags: ['canyon', 'cressi', 'osama']
  },
  {
    id: 'gallery-osama-shaka',
    src: '/images/gallery/diving/whatsapp-image-2025-05-10-at-12.58.51-1.jpeg',
    alt: 'Osama hovering just above the sandy bottom in shallow crystal clear water doing double shaka hand signs, wearing dive gear, professional photo by Pawel Ciecheslki',
    title: 'Shaka from the Shallows',
    description: 'Double shaka in the shallows! My friend Pawel Ciecheslki took this shot. You can see my shadow on the sand below - the water is that clear. This is Dahab on a good day, and most days are good days.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'diving',
    tags: ['osama', 'portrait', 'shaka']
  },
  {
    id: 'gallery-osama-emerging',
    src: '/images/gallery/diving/whatsapp-image-2025-05-10-at-12.58.52-2.jpeg',
    alt: 'Osama standing waist-deep in the Red Sea in full black dive gear adjusting his mask, mountains of Saudi Arabia visible across the water, clouds in the sky',
    title: 'Surface Interval',
    description: 'Coming up from a dive, adjusting my mask, the mountains of Saudi Arabia across the Gulf of Aqaba in the distance. Another diver behind me still in the water. This is that moment between dives when you catch your breath and think about what you just saw.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'diving',
    tags: ['osama', 'portrait', 'surface']
  },
  {
    id: 'gallery-thistlegorm-wreck',
    src: '/images/gallery/diving/ss-thistlegorm-wreck-day.webp',
    alt: 'Two divers exploring the massive hull of the SS Thistlegorm wreck resting on its side on the ocean floor, torch beams cutting through the blue water',
    title: 'The Thistlegorm Hull',
    description: 'The SS Thistlegorm lying on the bottom, divers swimming along the massive hull with their torches. I take groups to this wreck regularly - it is a full day trip from Dahab but worth every minute. A British ship sunk in 1941, now one of the greatest dives in the world.',
    location: 'SS Thistlegorm, Red Sea',
    featured: true,
    category: 'diving',
    tags: ['wreck', 'thistlegorm', 'iconic']
  },

  // === NEW GALLERY IMAGES - TEACHING ===
  {
    id: 'gallery-teaching-shallows',
    src: '/images/gallery/teaching/fb_img_1595137616968jpg.0.jpeg',
    alt: 'Osama in dive gear helping a student in crystal clear shallow water while a girl in turquoise shirt and a boy watch from nearby, Dahab coastline behind',
    title: 'First Steps In',
    description: 'Helping a student get comfortable in the shallows while the kids watch from the edge. This is how it starts in Dahab - warm, clear, shallow water, no pressure. Just breathe.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'training',
    tags: ['teaching', 'beginners', 'shallows']
  },
  {
    id: 'gallery-group-entry',
    src: '/images/gallery/teaching/fb_img_1623632282122.jpeg',
    alt: 'Large group of divers in various gear wading into the sea from a rocky beach, some already waist-deep, one woman wrapping in a towel, smiles on everyone\'s faces',
    title: 'Wading In Together',
    description: 'A busy morning - everyone wading in together for the dive. You can see the mix of experienced divers and first-timers, all helping each other. One woman is still wrapping up in her towel, the others are already waist deep. This is the energy I love.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'training',
    tags: ['group', 'training', 'entry']
  },
  {
    id: 'gallery-padi-certification',
    src: '/images/gallery/teaching/fb_img_1628920514141.jpeg',
    alt: 'Osama standing between two smiling women holding their PADI certification envelopes in front of the Planet Divers entrance, PADI banner visible',
    title: 'Certified at Planet Divers',
    description: 'These two came to Dahab as non-divers and left with their PADI cards in hand. Standing here at the Planet Divers entrance, holding those envelopes - I am as proud as they are every single time.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'training',
    tags: ['padi', 'certification', 'planet-divers']
  },
  {
    id: 'gallery-teaching-child',
    src: '/images/gallery/teaching/whatsapp-image-2025-05-10-at-12.58.41-1.jpeg',
    alt: 'Osama smiling while helping a young boy put on a scuba tank at a courtyard in Dahab, spiral staircase and coral decorations on the wall, May 2012',
    title: 'Tank Bigger Than the Boy',
    description: 'May 2012 - helping this boy get his tank on at the dive center courtyard. The tank is almost as tall as he is, but look at his face - determined. You see those coral decorations on the wall behind us? That is the old dive center.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2012-05-02',
    category: 'training',
    tags: ['kids', 'teaching', 'heritage']
  },
  {
    id: 'gallery-young-student',
    src: '/images/gallery/teaching/whatsapp-image-2025-05-10-at-12.58.44-1.jpeg',
    alt: 'Osama in black wetsuit crouching beside a smiling boy in a wetsuit, both doing OK signs, Planet Divers sign and PADI poster visible behind them, palm trees overhead',
    title: 'OK from the Young Diver',
    description: 'This boy earned his OK sign today. We are standing right outside Planet Divers - you can see the sign and the PADI poster behind us. He was nervous at first, but by the end he did not want to get out of the water.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'training',
    tags: ['kids', 'student', 'planet-divers']
  },
  {
    id: 'gallery-student-ok-sign',
    src: '/images/gallery/teaching/whatsapp-image-2025-05-10-at-12.58.46-1.jpeg',
    alt: 'Osama wearing Cressi gear and Pro Divers mask strap standing in shallow water with a young female student, both smiling and doing OK signs, snorkelers and other divers in the busy background',
    title: 'All OK!',
    description: 'Both of us doing the OK sign after a great dive. She came in nervous, she is leaving with confidence. You can see how busy the dive site is behind us - that is a typical day here. Everyone in the water.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'training',
    tags: ['student', 'ok-sign', 'cressi']
  },
  {
    id: 'gallery-student-gearup',
    src: '/images/gallery/teaching/whatsapp-image-2025-05-10-at-12.58.47-1.jpeg',
    alt: 'Osama in Cressi gear giving thumbs up standing with a young female diver holding blue fins at the Blue Hole parking area, desert cliffs and Bedouin shelters behind, red pickup truck nearby',
    title: 'Blue Hole Ready',
    description: 'Geared up at the Blue Hole parking area - you can see the desert cliffs and Bedouin shelters behind us. She is carrying her fins, I have got the thumbs up. Time to go down.',
    location: 'Blue Hole, Dahab',
    coordinates: { lat: 28.5722, lng: 34.5381 },
    category: 'training',
    tags: ['student', 'blue-hole', 'preparation']
  },
  {
    id: 'gallery-dive-group-rocks',
    src: '/images/gallery/teaching/whatsapp-image-2025-05-10-at-12.58.48-1.jpeg',
    alt: 'Large group of about 20 divers and snorkelers gathered on rocky shore at a Dahab dive site, some in full gear, some in the water, desert mountains rising behind them',
    title: 'Busy Day at the Rocks',
    description: 'This is what a busy dive day looks like - twenty people on the rocks getting ready, some already in the water, gear everywhere. The desert mountains behind us, the sea in front. Some days at the Blue Hole area it feels like the whole world came to dive.',
    location: 'Blue Hole, Dahab',
    coordinates: { lat: 28.5722, lng: 34.5381 },
    category: 'training',
    tags: ['group', 'shore-diving', 'blue-hole']
  },

  // === NEW GALLERY IMAGES - TEAM ===
  {
    id: 'gallery-team-dock',
    src: '/images/gallery/team/fb_img_1611744727736.jpeg',
    alt: 'Three divers in full technical dive gear posing on a wooden boat dock with turquoise water and Sinai mountains behind, AwesomeTeam hashtag overlay',
    title: 'The Awesome Team',
    description: 'Three of us loaded up with technical gear on the dock, ready for a deep dive. You can see the turquoise water behind us, the Sinai coastline stretching out. These are the guys I trust at 60 meters.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'team',
    tags: ['team', 'technical', 'dock']
  },
  {
    id: 'gallery-blue-hole-viewpoint',
    src: '/images/gallery/team/fb_img_1617712455291.jpeg',
    alt: 'Group selfie of Osama with six friends in sunglasses on a hilltop overlooking the Blue Hole reef and turquoise sea below',
    title: 'Above the Blue Hole',
    description: 'Group selfie up on the hill above the Blue Hole. See that turquoise water and the reef behind us? That is where we just came from. I always bring people up here after the dive to show them the view from above.',
    location: 'Blue Hole, Dahab',
    coordinates: { lat: 28.5722, lng: 34.5381 },
    category: 'team',
    tags: ['blue-hole', 'viewpoint', 'friends']
  },
  {
    id: 'gallery-osama-cressi',
    src: '/images/gallery/team/fb_img_1625154408370.jpeg',
    alt: 'Osama in Cressi wetsuit with a young man giving thumbs up and a woman throwing rock horns under a Bedouin beach shelter, colorful cushions behind them',
    title: 'Post-Dive Energy',
    description: 'Under the Bedouin shelter after a dive, my Cressi suit still dripping, and these two could not stop smiling. He is doing thumbs up, she is throwing rock horns. That is the energy you have after a good dive in Dahab.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'team',
    tags: ['osama', 'cressi', 'post-dive']
  },
  {
    id: 'gallery-dahab-dive-team',
    src: '/images/gallery/team/fb_img_1625492173636.jpeg',
    alt: 'Fifteen divers in matching black Dahab Dive Team 2019 t-shirts posing on a dive boat, waving and giving OK signs, blue sky and open sea behind them',
    title: 'Dahab Dive Team 2019',
    description: 'The whole crew in our matching Dahab Dive Team shirts on the boat. Fifteen of us, all waving, all smiling. These are the people who make this place special.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'team',
    tags: ['team', 'boat', 'group']
  },
  {
    id: 'gallery-boat-selfie',
    src: '/images/gallery/team/img-20211019-082453.jpeg',
    alt: 'Osama in a black t-shirt with a diver skull print taking a selfie with a curly-haired young man doing OK sign on a dive boat, turquoise Dahab coast behind them, dive tank visible',
    title: 'Boat Buddies',
    description: 'October 2021, heading out on the boat. This young man is giving the OK sign - he is ready. You can see the Dahab coastline and that turquoise water behind us. Another good day on the sea.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2021-10-19',
    category: 'team',
    tags: ['boat', 'selfie', 'sea']
  },
  {
    id: 'gallery-dive-center-group',
    src: '/images/gallery/team/img-20211109-135119.jpeg',
    alt: 'Osama with a group of ten divers and families of all ages posing under the dive center shelter, wet floor and dive flag visible, everyone smiling after a dive, November 2021',
    title: 'The Dive Center Crew',
    description: 'November 2021, everyone gathered under the shelter after a dive. Families, kids, experienced divers, beginners - all mixed together. The floor is still wet, the dive flag is hanging behind us. This is what our dive center looks like on a good day.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2021-11-09',
    category: 'team',
    tags: ['group', 'dive-center', 'family']
  },
  {
    id: 'gallery-hunts-dive-shop',
    src: '/images/gallery/team/img-20211128-095042.jpeg',
    alt: 'Osama in full black technical dive gear giving thumbs up next to Nuno Gomes wearing a Hunt\'s Dive Shop Andes New York t-shirt and black cap, tanks and wooden beams of the dive center behind them',
    title: 'Two Deep Divers, One Dive Center',
    description: 'November 2021, me and my close friend Nuno Gomes at my dive center. I am in my full technical gear, Nuno is wearing his Hunt\'s Dive Shop shirt from Andes, New York. This is the man who held the Guinness World Record for the deepest seawater dive - and he set that record right here in Dahab.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2021-11-28',
    category: 'team',
    tags: ['nuno-gomes', 'world-record', 'friends', 'gear', 'dive-center', 'legend'],
    story: 'That is my brother Nuno Gomes standing right next to me. I am in my full technical diving gear, and Nuno is relaxed in his Hunt\'s Dive Shop t-shirt from Andes, New York. People see this photo and think it is just two friends at a dive center - but this man dove to 318 meters in the Red Sea, right here in Dahab, and held the Guinness World Record for the deepest scuba dive in seawater. He came to Dahab in 2005 for that record attempt, and our friendship goes back to those days. When the best deep divers in the world come to Dahab, they come through here. Nuno is not just a record holder - he is one of the most humble people you will ever meet. A civil engineer from South Africa, born in Portugal, who just loved going deeper. He always says he never planned to break records, he just kept diving a little deeper each time. That is the spirit of a true diver.'
  },
  {
    id: 'gallery-promenade-selfie',
    src: '/images/gallery/team/whatsapp-image-2025-05-05-at-16.45.48.jpeg',
    alt: 'Osama taking a group selfie with four friends on the Dahab promenade, beach umbrellas and bicycles and the sea visible behind, bright sunny day',
    title: 'Promenade Crew',
    description: 'Quick selfie on the Dahab promenade with the guys. You can see the beach behind us, the bikes, the umbrellas - this is the heart of town. We had just finished a dive and came here for tea.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'team',
    tags: ['promenade', 'friends', 'dahab']
  },
  {
    id: 'gallery-boat-trio',
    src: '/images/gallery/team/whatsapp-image-2025-05-10-at-12.58.36-1.jpeg',
    alt: 'Three men selfie on a boat - one in aviators and a black hat, one in mirrored sunglasses and a striped bucket hat, one in a white cap - Sinai desert coastline and cell tower visible across the blue water',
    title: 'Three on a Boat',
    description: 'Out on the water with these two, Sinai desert stretching along the coast behind us. Hats on, sunglasses on, ready for whatever the sea has for us today. You can see the little town and the mountains across the bay.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'team',
    tags: ['boat', 'crew', 'coast']
  },
  {
    id: 'gallery-planet-divers-selfie',
    src: '/images/gallery/team/whatsapp-image-2025-05-10-at-12.58.44-2.jpeg',
    alt: 'Osama taking a selfie with a friend wearing a Dive Instructor shirt in front of Planet Divers entrance, white Dahab buildings and wooden lattice balcony behind them',
    title: 'Home Base',
    description: 'Standing right in front of Planet Divers with my friend. You can see the sign behind us - this is where I spend most of my days. The white buildings and the stone street, that is the old part of Dahab.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'team',
    tags: ['planet-divers', 'selfie', 'dahab']
  },
  {
    id: 'gallery-dive-club-van',
    src: '/images/gallery/team/whatsapp-image-2025-05-10-at-12.58.45-1.jpeg',
    alt: 'Eight divers in wetsuits posing by a white Dive Club International van at a rocky shore, Cressi and Salvimar gear visible, tanks and fins spread on a green mat, sea and cliffs in background',
    title: 'Dive Club Outing',
    description: 'The whole group suited up at the dive site, gear laid out on the mat, the Dive Club van behind us. You can see the Cressi and Salvimar equipment, the tanks lined up. One girl kneeling in front with her Cressi BCD. The sea is right there behind us, waiting.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'team',
    tags: ['team', 'van', 'gear', 'expedition']
  },
  {
    id: 'gallery-big-team-photo',
    src: '/images/gallery/team/whatsapp-image-2025-05-10-at-13.03.22.jpeg',
    alt: 'Over twenty-five divers in black wetsuits posing in rows under a large metal desert shelter, Scubapro logos visible, everyone throwing hand signs, Sinai mountains and white buildings in the background',
    title: 'Twenty-Five Strong',
    description: 'Look at this group - twenty-five divers under the shelter, everyone in their wetsuits, hands up, ready to go. You can see the Scubapro gear, the Sinai mountains behind us, the desert all around. Days like this remind me why I do what I do.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'team',
    tags: ['team', 'large-group', 'desert']
  },
  {
    id: 'gallery-osama-beach-friends',
    src: '/images/gallery/team/fb_img_1619885729926.jpeg',
    alt: 'Osama in dive gear taking a beach selfie with two young women, one in a striped top and one in an orange wetsuit top, sandy beach and calm sea behind them',
    title: 'After the Dive',
    description: 'Beach selfie with two of my dive students after coming out of the water. You can see the BCD strap on my shoulder - we literally just walked out of the sea. The girl on the right still has her wetsuit on. Good dive, good company.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'team',
    tags: ['beach', 'friends', 'selfie']
  },
  {
    id: 'gallery-team-wetsuits',
    src: '/images/gallery/team/fb_img_1619885733450.jpeg',
    alt: 'Five divers in matching black and orange wetsuits posing on the Dahab promenade, Churchill\'s bar and colorful shops behind them, Osama in the center',
    title: 'Wetsuit Crew',
    description: 'The five of us in our matching black and orange wetsuits on the Dahab promenade. You can see Churchill\'s bar behind us, the colorful shops. We walked through town like this - hair still wet, wetsuits still dripping. That is normal in Dahab.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'team',
    tags: ['team', 'wetsuits', 'town']
  },

  // === NEW GALLERY IMAGES - DAHAB ===
  {
    id: 'gallery-desert-road',
    src: '/images/gallery/dahab/fb_img_1618932010952.jpeg',
    alt: 'Three people standing on a wide desert road in Sinai, flat sandy landscape stretching to low buildings on the horizon, a dark car parked nearby, temperature reading 30 degrees',
    title: 'Sinai Roadside Stop',
    description: 'Stopped on the road in the middle of the Sinai at 30 degrees. You can see the flat desert stretching out in every direction, a few buildings in the distance. This is the drive to the dive sites - nothing but desert until you reach the sea.',
    location: 'Sinai, Egypt',
    category: 'dahab',
    tags: ['desert', 'road', 'sinai']
  },
  {
    id: 'gallery-bedouin-road',
    src: '/images/gallery/dahab/fb_img_1618932017418.jpeg',
    alt: 'Desert road scene with a white pickup truck, a man in traditional Bedouin clothing, and a dark car, flat Sinai landscape and low buildings in background, 33 degrees',
    title: 'The Sinai Road',
    description: 'This is the Sinai road at 33 degrees. A Bedouin man standing by his truck, the road stretching out. We stop here sometimes on the way to dive sites. The desert looks empty but it is full of life if you know where to look.',
    location: 'Sinai, Egypt',
    category: 'dahab',
    tags: ['desert', 'bedouin', 'travel']
  },
  {
    id: 'gallery-dahab-coastline',
    src: '/images/gallery/dahab/fb_img_1625492151580.jpeg',
    alt: 'Four friends posing on a hilltop overlooking the Dahab coastline, turquoise reef visible below, red Sinai mountains stretching along the shore, one woman in a Bottle Dive Team shirt',
    title: 'The View from Up Top',
    description: 'I always bring people up to this viewpoint. Look at that - the turquoise reef right below us, the red mountains of Sinai along the coast, the whole of Dahab stretching out. You can see why my family chose this place.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'dahab',
    tags: ['coastline', 'panorama', 'viewpoint']
  },
  {
    id: 'gallery-planet-divers-front',
    src: '/images/gallery/dahab/fb_img_1632056756922.jpeg',
    alt: 'Osama taking a selfie at the entrance of Planet Divers dive center, a crowd of divers with bags and gear filling the doorway behind him, the curved Planet Divers sign overhead',
    title: 'Busy Morning at Planet Divers',
    description: 'This is what the entrance of Planet Divers looks like on a busy morning. See all those people behind me with their bags? Everyone arriving at the same time, ready to dive. The sign above the door, the crowd - this place has been my second home for years.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'dahab',
    tags: ['planet-divers', 'dive-center', 'dahab']
  },
  {
    id: 'gallery-birthday-plate',
    src: '/images/gallery/dahab/img-20211110-155127.jpeg',
    alt: 'Hand-painted blue ceramic birthday plate reading Wszystkiego najlepszego Michal 10-11-2021 Dahab with painted fish, candles, and a diver, held over colorful Bedouin fabric',
    title: 'Birthday Plate for Michal',
    description: 'A hand-painted birthday plate for Michal, one of our Polish divers - November 10, 2021. The Polish words, the little painted fish, the diver at the bottom, and Dahab written right there. This is the kind of thing people take home and keep forever.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2021-11-10',
    category: 'dahab',
    tags: ['art', 'birthday', 'handmade', 'polish']
  },
  {
    id: 'gallery-seafood-dinner',
    src: '/images/gallery/dahab/img-20211204-195856.jpeg',
    alt: 'Osama and Nuno Gomes sitting together at Shark Restaurant in Dahab, spectacular shrimp display on the table, colorful fish mural painted on the wall behind them, orange cushions and plant decorations',
    title: 'Dinner with a World Record Holder',
    description: 'December 2021, hosting my close friend Nuno Gomes at my restaurant, Shark Restaurant in Dahab. That is the legendary Nuno sitting right next to me - the man who held not one but two Guinness World Records for the deepest scuba dives ever made.',
    location: 'Shark Restaurant, Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2021-12-04',
    category: 'dahab',
    tags: ['food', 'restaurant', 'seafood', 'nuno-gomes', 'world-record', 'legend'],
    story: 'This is my close friend Nuno Gomes, and we are sitting right here in my restaurant - Shark Restaurant in Dahab. Nuno is one of the greatest deep divers who ever lived. In 1996, he set the Guinness World Record for the deepest cave dive at 283 meters in Boesmansgat, South Africa. Then in June 2005, he came right here to Dahab and broke the world record for the deepest seawater scuba dive - 318.25 meters in the Red Sea. It took him only 20 minutes to go down, but 12 hours to come back to the surface. Imagine that - 12 hours of decompression. The man is a civil engineer from South Africa, born in Portugal, and he is as humble as they come. He once said "I never thought about records, I just kept on diving a bit deeper." That is the kind of person he is. When you sit with Nuno, you would never guess he descended deeper than almost any human being on the planet. He did it right here, in our waters, in Dahab. And now here we are sharing a shrimp dinner at my place like two old friends. This is what diving does - it connects people across the world.'
  },
  {
    id: 'gallery-bedouin-shelter',
    src: '/images/gallery/dahab/wahsh-img-1452.jpeg',
    alt: 'Group of about ten divers lounging barefoot in a colorful Bedouin beach shelter with blue wooden poles, woven mats and cushions, flip flops scattered in the sand, desert vegetation visible behind',
    title: 'The Bedouin Shelter',
    description: 'This is how we relax between dives - shoes off, feet in the sand, everyone squeezed together on the Bedouin cushions. You see the blue poles, the woven mats, the flip flops scattered around? This is the real Dahab experience. No rush, no schedule.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'dahab',
    tags: ['bedouin', 'beach', 'relaxation']
  },
  {
    id: 'gallery-blue-hole-cliff',
    src: '/images/gallery/dahab/whatsapp-image-2025-05-10-at-12.58.35-1.jpeg',
    alt: 'Close-up of Osama with a towel on his head looking down at the turquoise Blue Hole water from the cliff edge, barren Sinai mountain rising behind, Bedouin shelters visible on shore',
    title: 'Above the Blue',
    description: 'Standing on the edge, looking down at the Blue Hole. That turquoise water below me, the Sinai mountain behind - you can see the Bedouin shelters on the shore. I have a towel on my head because the sun is brutal up here. But the view is worth it.',
    location: 'Blue Hole, Dahab',
    coordinates: { lat: 28.5722, lng: 34.5381 },
    category: 'dahab',
    tags: ['blue-hole', 'mountains', 'turquoise']
  },
  {
    id: 'gallery-sinai-landscape',
    src: '/images/gallery/dahab/whatsapp-image-2025-05-10-at-12.58.38-1.jpeg',
    alt: 'Osama standing alone in a dusty Sinai desert parking area wearing red shorts and a grey t-shirt, stone wall and trees behind, pickup truck and car parked nearby, mountains in distance',
    title: 'My Desert',
    description: 'Standing in the Sinai desert, my home. Behind me you can see the stone walls, the trees that somehow survive here, the trucks we use to get around. The mountains in the distance - that is the landscape I grew up with. People come for the sea, but the desert is just as beautiful.',
    location: 'Sinai, Egypt',
    category: 'dahab',
    tags: ['sinai', 'desert', 'landscape']
  },
  {
    id: 'gallery-dive-site-shelter',
    src: '/images/gallery/dahab/whatsapp-image-2025-05-10-at-12.58.49-1.jpeg',
    alt: 'Wide-angle view of a large ornate metal dive site shelter in the middle of the Sinai desert, divers and vehicles gathered underneath, photographer\'s shadow stretching across the sand, 27 degrees',
    title: 'The Desert Shelter',
    description: 'This is what a dive site looks like in Dahab - a big shelter in the middle of the desert, divers gathering underneath with their gear, vehicles parked around. My shadow is in the photo, taken at 27 degrees. Behind the shelter, just more desert and mountains. The sea is right there behind me.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'dahab',
    tags: ['dive-site', 'desert', 'shelter']
  },
  {
    id: 'gallery-between-dives-hut',
    src: '/images/gallery/dahab/whatsapp-image-2025-05-10-at-12.58.49-2.jpeg',
    alt: 'Group of seven divers relaxing in a Bedouin-style hut with cushions, a Camel Dive map and diver poster on the wall, lattice partition, water bottles and paperwork on a low table, Osama crouching at the table',
    title: 'Surface Interval',
    description: 'Between dives in the Bedouin hut. You can see the Camel Dive map on the wall, the diver poster, everyone on the cushions. I am at the table doing paperwork and planning the next dive. Water bottles, logbooks, the wooden lattice - this is where the stories are told.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'dahab',
    tags: ['bedouin', 'rest', 'social']
  },
  {
    id: 'gallery-blue-hole-railing',
    src: '/images/gallery/dahab/whatsapp-image-2025-05-10-at-12.58.50-2.jpeg',
    alt: 'Osama shirtless in wetsuit bottoms and a friend in an orange shirt sitting on a metal railing above the Blue Hole, deep blue sea stretching to the horizon, rocky cliff beneath them',
    title: 'Sitting Above the Blue Hole',
    description: 'Me and my friend sitting on the railing above the Blue Hole after a dive. The deep blue sea stretching out to the horizon, the rocky cliff below us. I am still in my wetsuit bottoms. This is one of the best viewpoints in all of Dahab - you can see all the way to Saudi Arabia on a clear day.',
    location: 'Blue Hole, Dahab',
    coordinates: { lat: 28.5722, lng: 34.5381 },
    category: 'dahab',
    tags: ['blue-hole', 'panorama', 'friends']
  },
  {
    id: 'gallery-group-dinner',
    src: '/images/gallery/dahab/whatsapp-image-2025-05-10-at-13.03.17-1.jpeg',
    alt: 'Large group of about twenty divers at a long dinner table at Shark Restaurant in Dahab, decorated with colorful hanging lanterns, tropical plants, and orange cushions, everyone smiling at the camera',
    title: 'Shark Restaurant. The Dive Family Table.',
    description: 'This is my restaurant, Shark Restaurant - rated 4.5 on TripAdvisor with over 1,350 reviews. Twenty of us at one long table after a full day of diving. The colorful lanterns, the plants, the orange cushions - this is the atmosphere we built here. Everyone is tired from diving but nobody wants to go home.',
    location: 'Shark Restaurant, Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'dahab',
    tags: ['dinner', 'restaurant', 'nightlife', 'shark-restaurant', 'tripadvisor', 'dive-family'],
    story: 'Welcome to Shark Restaurant - my restaurant, right here in Dahab, rated 4.5 on TripAdvisor with over 1,350 reviews from guests around the world. This is what happens after a full day of diving with the crew. Twenty of us around one long table, colorful lanterns hanging from every corner, tropical plants everywhere, the orange cushions. Look at all these faces - divers from all over the world who came to Dahab to dive with us, and now they are family. This is what I am most proud of. Yes, we take people to the Blue Hole, the Canyon, Ras Abu Galum - but this right here, this dinner table, this is where the real magic happens. Nobody wants to leave. The food keeps coming, the stories keep flowing, and by the end of the night everyone has made friends for life. Shark Restaurant is not just a place to eat - it is where the diving family comes together.'
  },

  // === NEW GALLERY IMAGES - HERITAGE ===
  {
    id: 'gallery-trimix-cert',
    src: '/images/gallery/heritage/img-20211107-075545.jpeg',
    alt: 'IANTD Normoxic Trimix Diver Max Depth 60 MSW certificate for Osama Rokaia, dated 4 June 2021, instructor Andrzej Kruczkowski, Exstream No.1399 facility, IANTD ID card with photo attached',
    title: 'Sixty Meters Deep',
    description: 'My IANTD Normoxic Trimix Diver certificate - certified to 60 meters. Awarded June 4, 2021, trained by Andrzej Kruczkowski at Exstream facility. That is my photo on the ID card in the corner. This one took serious work - the physics, the physiology, the gas calculations. Worth every hour.',
    location: 'Dahab, Egypt',
    date: '2021-06-04',
    category: 'heritage',
    tags: ['certificate', 'trimix', 'iantd', 'technical']
  },
  {
    id: 'gallery-cert-handover',
    src: '/images/gallery/heritage/img-20211107-075658.jpeg',
    alt: 'Osama smiling as his instructor Andrzej Kruczkowski in a Helly Hansen polo and blue sunglasses presents the IANTD Normoxic Trimix Diver certificate, wooden dive center courtyard in background',
    title: 'The Handover',
    description: 'November 7, 2021 - the moment Andrzej Kruczkowski handed me my Trimix certificate. He is wearing his Helly Hansen gear, I could not stop smiling. The dive center courtyard behind us, wooden beams above. Months of training, gas theory, deep dives - all worth it for this moment.',
    location: 'Dahab, Egypt',
    date: '2021-11-07',
    category: 'heritage',
    tags: ['certificate', 'instructor', 'achievement']
  },
  {
    id: 'gallery-vintage-photo',
    src: '/images/gallery/heritage/img-20211228-074905.jpeg',
    alt: 'Faded vintage photograph of a young man in a white galabiya holding a small child while a woman smiles beside them, blue arched doorway and candlelight visible, another man in a printed t-shirt to the left',
    title: 'The Old Photograph',
    description: 'This is from the early days - a young man holding a child in the doorway, the blue arched walls of old Dahab behind them, candlelight glowing. Look at how simple everything was. These are the roots, the memories that shaped my family and our connection to this place.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    featured: true,
    category: 'heritage',
    tags: ['vintage', 'family', 'history']
  },
  {
    id: 'gallery-thank-you-note',
    src: '/images/gallery/heritage/whatsapp-image-2025-05-10-at-12.58.39.jpeg',
    alt: 'Handwritten note on white paper reading Dear Osama thank you for being the best dive instructor see you next year Matyas with a smiley face, a black bead bracelet placed beside it on lace fabric',
    title: 'Matyas\'s Note',
    description: 'Matyas wrote me this note before he left Dahab. He crossed out a word and wrote "best" instead. And a bracelet as a gift. He said he would see me next year - and he did. This little piece of paper means more to me than any certificate on the wall.',
    location: 'Dahab, Egypt',
    category: 'heritage',
    tags: ['testimonial', 'note', 'student']
  },
  {
    id: 'gallery-advanced-trimix-cert',
    src: '/images/gallery/heritage/whatsapp-image-2025-05-10-at-12.58.48-2.jpeg',
    alt: 'Osama in a red and pink shirt grinning while holding up his IANTD Advanced Rec Trimix Diver Max Depth 51 MSW certificate, PADI and other dive agency stickers on the window behind him',
    title: 'Advanced Trimix Certified',
    description: 'That smile says it all. Holding up my IANTD Advanced Recreational Trimix Diver certificate - 51 meters maximum depth. You can see all the dive agency stickers on the window behind me - PADI, IANTD, and more. This is the dive center where I earned it.',
    location: 'Dahab, Egypt',
    category: 'heritage',
    tags: ['certificate', 'trimix', 'advanced']
  },
  {
    id: 'gallery-photography-calendar',
    src: '/images/gallery/heritage/whatsapp-image-2025-05-10-at-12.58.51-2.jpeg',
    alt: 'Osama\'s hand holding an Irena Stangierska Photography 2020 underwater calendar with Polish text and a white dive marker reading Each Day Better Osama, on a wooden table',
    title: 'Each Day Better',
    description: 'My motto written right there on my dive marker - Each Day Better, Osama. Next to it is the 2020 underwater photography calendar from Irena Stangierska, a Polish photographer who dives with us. The Polish text, the beautiful reef photo on the cover - these are the gifts that remind me why I do this.',
    location: 'Dahab, Egypt',
    category: 'heritage',
    tags: ['photography', 'motto', 'memories', 'polish']
  },
  {
    id: 'gallery-iantd-card',
    src: '/images/gallery/heritage/whatsapp-image-2025-05-10-at-12.58.52-3.jpeg',
    alt: 'Screenshot of IANTD temporary digital certification card for Osama Rokaia, born 5.4.1968, Normoxic Trimix Diver Max Depth 60 MSW, cert 199791, instructor Andrzej Kruczkowski, Exstream No.1399, valid until 07/2021',
    title: 'My IANTD Card',
    description: 'My digital IANTD card - Normoxic Trimix Diver, 60 meters maximum depth. Certificate number 199791, born April 5, 1968. My instructor Andrzej Kruczkowski from Exstream facility signed off on it. This card is my passport to the deep dives.',
    location: 'Dahab, Egypt',
    category: 'heritage',
    tags: ['iantd', 'card', 'certification']
  },

  // === NEW GALLERY IMAGES - EQUIPMENT ===
  {
    id: 'gallery-gear-prep',
    src: '/images/gallery/equipment/fb_img_1619016170986.jpeg',
    alt: 'Divers preparing gear under a palm-thatched wooden shelter at a desert dive site, BCDs and regulators spread on Bedouin cushions, Sinai mountains behind, April 2012',
    title: 'Gearing Up at the Site',
    description: 'April 2012, gearing up under the palm shelter at the dive site. BCDs, regulators, everything spread out on the Bedouin cushions. The Sinai mountains behind us, the sea just ahead. This is the routine - drive to the site, set up under the shelter, check your gear, and go.',
    location: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2012-04-20',
    category: 'equipment',
    tags: ['gear', 'preparation', 'safety']
  },
  {
    id: 'gallery-trimix-tank',
    src: '/images/gallery/equipment/whatsapp-image-2025-05-10-at-12.58.43-1.jpeg',
    alt: 'Close-up of a gray aluminum trimix tank with red marker text reading TMX 24/36 OSAMA MOD 52m, ScubaTec Dahab visual inspection sticker, green valve handle',
    title: 'My Trimix Tank',
    description: 'This is my personal trimix tank - TMX 24/36 written in red marker, OSAMA right there on the side, MOD 52 meters. The ScubaTec Dahab inspection sticker on top. When you see a tank with your name written on it in marker, you know you are doing serious diving.',
    location: 'Dahab, Egypt',
    category: 'equipment',
    tags: ['trimix', 'tank', 'technical']
  },
  {
    id: 'gallery-bcd-check',
    src: '/images/gallery/equipment/whatsapp-image-2025-05-10-at-12.58.50-3.jpeg',
    alt: 'Osama in full ScubaSub BCD and Aqualung regulator checking his gear at a beach dive site, palm-thatched shelters and desert cliffs behind, bright blue sky',
    title: 'Final Check',
    description: 'Checking my ScubaSub BCD and Aqualung regulator at the dive site. You can see the palm shelters behind me, the desert cliffs, the blue sky. This is the last thing I do before I walk into the water - every clip, every hose, every connection. Habits save lives.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    category: 'equipment',
    tags: ['bcd', 'check', 'pre-dive']
  },

  // === NEW GALLERY IMAGES - STORIES (Underwater Proposal) ===
  {
    id: 'gallery-proposal-note',
    src: '/images/gallery/stories/whatsapp-image-2025-05-10-at-13.03.16.jpeg',
    alt: 'Waterproof proposal card with red handwritten Polish text Czy zostaniesz moja zona with a heart and the date 4.11.2021, a brown ring box with gold engagement ring beside it on a floral tablecloth',
    title: 'The Card and the Ring',
    description: 'November 4, 2021 - this is the card and ring that Kuba prepared for his underwater proposal to Kasia. Written in red marker in Polish with a heart and the date.',
    location: 'Dahab, Egypt',
    date: '2021-11-04',
    category: 'stories',
    tags: ['proposal', 'love', 'ring'],
    story: 'Kuba came to me weeks before and said, "Osama, I want to propose to my girlfriend underwater." I looked at him and I could see he was serious. So we planned it together. He wrote the card himself in Polish - "Czy zostaniesz moja zona?" means "Will you be my wife?" See the heart he drew? And the date - 4.11.2021. The ring in the brown box next to it. We had to figure out how to keep everything waterproof, how to get Kasia to the right spot without her knowing, how to make sure someone was there to photograph it. It was one of the most exciting dive plans I have ever made, and there was no gas calculation involved - just love.'
  },
  {
    id: 'gallery-proposal-underwater',
    src: '/images/gallery/stories/whatsapp-image-2025-05-10-at-13.03.19.jpeg',
    alt: 'Two divers kneeling at the coral reef as Kuba places the proposal card and ring on the coral, Kasia watching, bubbles rising, another diver filming from the side, deep blue water above',
    title: 'The Moment',
    description: 'Kuba placing the proposal card on the reef while Kasia watches. You can see another diver filming from the side. This is the moment.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2021-11-04',
    featured: true,
    category: 'stories',
    tags: ['proposal', 'underwater', 'love'],
    story: 'This is the moment it happened. Kuba and Kasia are kneeling at the coral reef, and Kuba is placing the waterproof card with the ring right there on the coral for her to see. You can see the bubbles rising, another diver filming from the side. Kasia had no idea this was coming - she thought it was just another dive. I was watching from nearby, my heart was beating so fast I thought my computer would pick it up as exertion. When she saw the card, everything changed. Even with the mask and the regulator, you could see her whole face light up.'
  },
  {
    id: 'gallery-proposal-card-underwater',
    src: '/images/gallery/stories/whatsapp-image-2025-05-10-at-13.03.21-1.jpeg',
    alt: 'Kuba underwater in full dive gear and Tribord hood holding the Polish proposal card with one hand and giving thumbs up with the other, deep blue water behind him, bubbles rising',
    title: 'She Said Yes',
    description: 'Kuba holding up the card and giving the thumbs up - she said yes! You can see his eyes behind the mask. That is pure happiness at fifteen meters depth.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2021-11-04',
    category: 'stories',
    tags: ['proposal', 'yes', 'celebration']
  },
  {
    id: 'gallery-engagement-ring-underwater',
    src: '/images/gallery/stories/whatsapp-image-2025-05-10-at-13.03.21.jpeg',
    alt: 'Kasia underwater showing her engagement ring on her left hand while making an OK sign with her right, hair floating in the blue water, bubbles rising, sunlight streaming from above, dive gauges visible',
    title: 'The Ring Underwater',
    description: 'Kasia showing off the ring right there underwater - left hand out so you can see it, OK sign with the right. Her hair is floating, bubbles rising, the sun coming through the blue above her. This photo says everything.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2021-11-04',
    featured: true,
    category: 'stories',
    tags: ['ring', 'engagement', 'underwater']
  },
  {
    id: 'gallery-proposal-collage',
    src: '/images/gallery/stories/whatsapp-image-2025-05-10-at-13.03.18.jpeg',
    alt: 'Four-photo collage: top left shows Kuba holding the proposal card underwater, top right shows two divers descending in blue water with bubbles, bottom left shows Kasia\'s hand with engagement ring, bottom right shows the Blue Hole turquoise water from the cliff above',
    title: 'Four Frames of Love',
    description: 'The whole story in four photos - the card, the dive, the ring on her hand, and the Blue Hole from above where it all happened. November 4, 2021. One of the most special dives I have ever guided.',
    location: 'Blue Hole, Dahab',
    coordinates: { lat: 28.5722, lng: 34.5381 },
    date: '2021-11-04',
    category: 'stories',
    tags: ['collage', 'proposal', 'love-story']
  },
  {
    id: 'gallery-proposal-facebook',
    src: '/images/gallery/stories/whatsapp-image-2025-05-10-at-13.03.20-1.jpeg',
    alt: 'Screenshot of Osama Mohamed Hassan Facebook post reading Congratulations underwater proposing kuba and Kasia, photo shows Kasia, Kuba in a surf shirt, and Osama in a Juventus jersey smiling together',
    title: 'Congratulations Kuba and Kasia',
    description: 'My Facebook post after the proposal dive. Kasia, Kuba, and me together - you can see the happiness on their faces. Kuba in his surf shirt, me in my Juventus jersey. Thirty-four people liked it. This is why I love my job.',
    location: 'Dahab, Egypt',
    date: '2021-11-04',
    category: 'stories',
    tags: ['congratulations', 'couple', 'celebration']
  },
  {
    id: 'gallery-proposal-reef',
    src: '/images/gallery/stories/whatsapp-image-2025-05-10-at-13.03.20.jpeg',
    alt: 'Two divers hovering above the coral reef placing the proposal card and ring box on the coral, one reaching down, the other watching, a third diver with a camera visible on the right, deep blue Red Sea background',
    title: 'Placing the Ring on the Reef',
    description: 'Kuba reaching down to place the card and ring on the coral while another diver watches and the photographer captures it from the right. The reef where two lives became one. I will never forget this spot.',
    location: 'Dahab, Red Sea',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    date: '2021-11-04',
    category: 'stories',
    tags: ['reef', 'proposal', 'moment'],
    story: 'This is the shot from the other angle - you can see Kuba reaching down to set the card on the coral, the ring box next to it. The third diver on the right is our photographer, making sure we captured everything. The whole dive was planned down to the minute. I led the group to this exact spot on the reef because the coral here forms a natural shelf. Kuba knew the signal - when I tapped my tank three times, that was his cue. He reached into his BCD pocket, pulled out the card and the ring, and placed them right there. Kasia swam up behind him, not knowing what was about to happen. I have guided thousands of dives in this reef, but this one I will remember until my last breath.'
  }
];

// Get featured photos for homepage
export const getFeaturedPhotos = (): GalleryPhoto[] => {
  return galleryPhotos.filter(photo => photo.featured);
};

// Get photos by category
export const getPhotosByCategory = (category: GalleryPhoto['category']): GalleryPhoto[] => {
  return galleryPhotos.filter(photo => photo.category === category);
};

// Get all unique categories
export const getCategories = (): string[] => {
  const categories = galleryPhotos.map(photo => photo.category);
  return Array.from(new Set(categories));
};

// Category labels for display
export const categoryLabels: Record<GalleryPhoto['category'], string> = {
  'heritage': 'Pioneer Heritage',
  'stories': 'Diving Stories',
  'diving': 'Diving Adventures',
  'underwater': 'Underwater World',
  'marine-life': 'Marine Life',
  'dive-sites': 'Famous Dive Sites',
  'training': 'Diving Experiences',
  'adventures': 'Desert & Sea Adventures',
  'team': 'The Dive Team',
  'dahab': 'Life in Dahab',
  'equipment': 'Gear & Equipment'
};

// Facebook page link for "View More" CTA
export const FACEBOOK_PAGE_URL = 'https://facebook.com/osamasharks';
export const INSTAGRAM_URL = 'https://instagram.com/osama_mohamed_hassan';
