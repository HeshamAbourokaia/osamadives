/**
 * Facebook Content Configuration
 *
 * Since Facebook API requires app approval, this file manages
 * curated content from facebook.com/osamasharks that links back to Facebook.
 *
 * CONTENT STRATEGY:
 * - Store optimized thumbnails locally (keep under 100KB each)
 * - Videos: Only store thumbnail, link to Facebook for full video
 * - Photos: Store compressed version, link to Facebook for original
 * - Include captions/stories from original Facebook posts
 *
 * STORAGE CONSIDERATIONS (Vercel/GitHub limits):
 * - Thumbnails stored in /public/images/facebook/
 * - No full videos stored - use Facebook embeds or links
 * - Target: <5MB total for Facebook thumbnails
 */

export interface FacebookPost {
  id: string;
  type: 'photo' | 'video' | 'album';
  thumbnail: string; // Local path to optimized thumbnail
  facebookUrl: string; // Direct link to Facebook post
  title: string;
  caption: string; // Story/caption from Facebook post
  date: string; // ISO date string
  location?: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    googleMapsUrl?: string;
  };
  tags?: string[];
  featured?: boolean;
  // For videos
  videoDuration?: string;
  // For albums
  photoCount?: number;
}

// Dahab dive site locations with coordinates
export const DIVE_SITE_LOCATIONS = {
  'blue-hole': {
    name: 'Blue Hole, Dahab',
    coordinates: { lat: 28.5721, lng: 34.5377 },
    googleMapsUrl: 'https://maps.google.com/?q=28.5721,34.5377',
  },
  'the-canyon': {
    name: 'The Canyon, Dahab',
    coordinates: { lat: 28.5150, lng: 34.5200 },
    googleMapsUrl: 'https://maps.google.com/?q=28.5150,34.5200',
  },
  'ras-abu-galum': {
    name: 'Ras Abu Galum, Sinai',
    coordinates: { lat: 28.6167, lng: 34.5833 },
    googleMapsUrl: 'https://maps.google.com/?q=28.6167,34.5833',
  },
  'lighthouse': {
    name: 'Lighthouse, Dahab',
    coordinates: { lat: 28.4833, lng: 34.5000 },
    googleMapsUrl: 'https://maps.google.com/?q=28.4833,34.5000',
  },
  'eel-garden': {
    name: 'Eel Garden, Dahab',
    coordinates: { lat: 28.5000, lng: 34.5100 },
    googleMapsUrl: 'https://maps.google.com/?q=28.5000,34.5100',
  },
  'dahab-lagoon': {
    name: 'Dahab Lagoon',
    coordinates: { lat: 28.4917, lng: 34.5083 },
    googleMapsUrl: 'https://maps.google.com/?q=28.4917,34.5083',
  },
  'dahab-general': {
    name: 'Dahab, Egypt',
    coordinates: { lat: 28.5000, lng: 34.5167 },
    googleMapsUrl: 'https://maps.google.com/?q=Dahab,Egypt',
  },
};

/**
 * Curated Facebook posts with stories
 * These posts have meaningful captions that tell diving stories
 *
 * To add new content:
 * 1. Download thumbnail from Facebook (or screenshot)
 * 2. Compress to <100KB and save to /public/images/facebook/
 * 3. Copy the Facebook post URL
 * 4. Copy the caption/story text
 * 5. Add location metadata if mentioned
 */
export const facebookPosts: FacebookPost[] = [
  {
    id: 'fb-story-1',
    type: 'photo',
    thumbnail: '/images/OsamaDives_The_Blue_Hole.jpeg',
    facebookUrl: 'https://www.facebook.com/osamasharks',
    title: 'Morning Magic at the Blue Hole',
    caption: `There is something special about the Blue Hole at sunrise. When the first rays of light pierce through the water, the whole world transforms into shades of blue that no camera can truly capture.

After more than a thousand dives here, I still feel that rush of excitement every single time. Today I had the privilege of introducing two German divers to this magical place for the first time. Watching their faces when they saw the Arch from above - that moment of pure wonder - it reminds me why I do this.

The Blue Hole is not just a dive site. It is a pilgrimage for divers from around the world. And Dahab is blessed to have it in our backyard.`,
    date: '2024-12-15',
    location: DIVE_SITE_LOCATIONS['blue-hole'],
    tags: ['blue-hole', 'sunrise', 'diving', 'dahab'],
    featured: true,
  },
  {
    id: 'fb-story-2',
    type: 'photo',
    thumbnail: '/images/OsamDives_The_Canyon.jpg',
    facebookUrl: 'https://www.facebook.com/osamasharks',
    title: 'The Cathedral of Light',
    caption: `The Canyon never fails to amaze me. Today the light was perfect - those golden beams cutting through the water, illuminating the soft corals on the walls.

My student asked me why I call it "nature\'s cathedral" and I could not find words. So I just pointed up at the light streaming down through the narrow opening above us, and she understood immediately.

Some things you cannot explain. You have to experience them.

#TheCanyonDahab #DivingIsLife #RedSea`,
    date: '2024-11-20',
    location: DIVE_SITE_LOCATIONS['the-canyon'],
    tags: ['canyon', 'underwater', 'light', 'diving'],
    featured: true,
  },
  {
    id: 'fb-story-3',
    type: 'video',
    thumbnail: '/images/FB_IMG_1625154383404.jpg',
    facebookUrl: 'https://www.facebook.com/osamasharks',
    title: 'A Dance with a Turtle',
    caption: `Some encounters you can not plan. Today a beautiful hawksbill turtle decided to swim with us for almost 15 minutes. She was so relaxed, just gliding over the reef, occasionally looking back as if to make sure we were still following.

Moments like these remind me that we are guests in their world. We are lucky they let us visit.

Video: My friend captured this magical moment. Turn on the sound to hear my excited bubbles!`,
    date: '2024-10-05',
    location: DIVE_SITE_LOCATIONS['eel-garden'],
    tags: ['turtle', 'marine-life', 'underwater', 'encounter'],
    videoDuration: '2:34',
    featured: true,
  },
  {
    id: 'fb-story-4',
    type: 'photo',
    thumbnail: '/images/Camels.jpeg',
    facebookUrl: 'https://www.facebook.com/osamasharks',
    title: 'The Road Less Traveled',
    caption: `The best dive sites are often the hardest to reach. Today we took the camel safari to Ras Abu Galum - 2 hours through the desert to reach reefs that most tourists never see.

The journey is part of the experience. The Bedouin tea at the halfway point. The silence of the desert. And then, finally, the reward - pristine coral gardens untouched by crowds.

This is the real Dahab. This is what my family has been sharing with visitors since 1983.

Who wants to join the next adventure?`,
    date: '2024-09-18',
    location: DIVE_SITE_LOCATIONS['ras-abu-galum'],
    tags: ['camel-safari', 'adventure', 'bedouin', 'ras-abu-galum'],
    featured: true,
  },
  {
    id: 'fb-story-5',
    type: 'photo',
    thumbnail: '/images/OsamaDives_PADI_Open_Water.jpeg',
    facebookUrl: 'https://www.facebook.com/osamasharks',
    title: 'First Breath Underwater',
    caption: `Today I certified my 500th Open Water diver since I started teaching in 2011. Maria from Spain was nervous at first - she admitted she had been scared of the ocean her whole life.

But by the end of her confined water session, she was smiling so much her regulator almost fell out!

There is nothing in this world like watching someone overcome their fears and discover a whole new universe. This is why I became an instructor.

Congratulations Maria! The ocean is now your playground.`,
    date: '2024-08-22',
    location: DIVE_SITE_LOCATIONS['dahab-lagoon'],
    tags: ['padi', 'open-water', 'certification', 'students', 'milestone'],
  },
  {
    id: 'fb-story-6',
    type: 'video',
    thumbnail: '/images/FB_IMG_1638331910256.jpg',
    facebookUrl: 'https://www.facebook.com/osamasharks',
    title: 'Coral Gardens in Full Color',
    caption: `People always ask me: "Is the Red Sea really that colorful?"

Yes. Even more than the photos show. Our cameras can not capture what our eyes see at depth. The reds, the oranges, the purples - they are even more vibrant in person.

This reef has been growing for thousands of years. It is our responsibility to protect it for the next thousand.

Always remember: Take only photos, leave only bubbles.`,
    date: '2024-07-10',
    location: DIVE_SITE_LOCATIONS['dahab-general'],
    tags: ['coral', 'reef', 'colors', 'conservation'],
    videoDuration: '1:15',
  },
  {
    id: 'fb-story-7',
    type: 'album',
    thumbnail: '/images/FB_IMG_1632329112940.jpg',
    facebookUrl: 'https://www.facebook.com/osamasharks',
    title: 'Night Diving Adventures',
    caption: `The reef completely transforms after dark. Creatures that hide during the day come out to hunt. The flashlight becomes your window into another world.

Tonight we spotted:
- Spanish dancer nudibranch
- Hunting lionfish
- Sleeping parrotfish in their mucus cocoons
- Octopus on the prowl

Night diving is not for everyone, but for those who dare - it is absolutely magical.

Photos from last night\'s adventure at Lighthouse.`,
    date: '2024-06-25',
    location: DIVE_SITE_LOCATIONS['lighthouse'],
    tags: ['night-diving', 'marine-life', 'lighthouse'],
    photoCount: 12,
  },
  {
    id: 'fb-story-8',
    type: 'photo',
    thumbnail: '/images/Osama7Tanks.jpeg',
    facebookUrl: 'https://www.facebook.com/osamasharks',
    title: 'Behind the Scenes',
    caption: `Every great dive starts hours before you enter the water.

Checking equipment. Testing regulators. Making sure every detail is perfect. Safety is not negotiable - it is the foundation of everything I do.

My students sometimes laugh when they see how much time I spend on preparation. But they understand when I explain: in diving, attention to detail can save your life.

This is the unglamorous side of diving that nobody posts about. But it is the most important part.`,
    date: '2024-05-30',
    location: DIVE_SITE_LOCATIONS['dahab-general'],
    tags: ['safety', 'equipment', 'preparation', 'behind-scenes'],
  },
  {
    id: 'fb-story-9',
    type: 'photo',
    thumbnail: '/images/OsamaDives_Him_Self.jpeg',
    facebookUrl: 'https://www.facebook.com/osamasharks',
    title: 'Why I Do This',
    caption: `People ask me all the time: "Don\'t you ever get bored diving the same sites?"

Never. Not once in 13 years.

Every dive is different. The light changes. The marine life changes. The people I dive with bring their own energy and excitement.

And honestly? After thousands of dives, the Red Sea still takes my breath away. Sometimes literally when I forget I am underwater and gasp at something beautiful!

Diving is not my job. It is my calling. And Dahab is not where I work - it is my home.`,
    date: '2024-04-15',
    location: DIVE_SITE_LOCATIONS['blue-hole'],
    tags: ['personal', 'passion', 'diving-life', 'dahab'],
    featured: true,
  },
  {
    id: 'fb-story-10',
    type: 'photo',
    thumbnail: '/images/OsamaDives_The_Blue_Hole.jpeg',
    facebookUrl: 'https://www.facebook.com/osamasharks',
    title: 'Where Two Worlds Meet',
    caption: `This is what makes Dahab unique. Above the water: golden desert mountains. Below: an explosion of life and color.

I live at the intersection of two worlds. And every day, I get to share this magic with people from all over the planet.

My family came to Dahab in 1983 when it was just a tiny Bedouin village. Now divers come from every corner of the world. But the magic? That has not changed one bit.

Welcome to my home. Welcome to Dahab.`,
    date: '2024-03-20',
    location: DIVE_SITE_LOCATIONS['dahab-general'],
    tags: ['dahab', 'split-view', 'desert-sea', 'home'],
    featured: true,
  },
];

// Get featured stories for homepage
export const getFeaturedStories = (): FacebookPost[] => {
  return facebookPosts.filter((post) => post.featured);
};

// Get all stories sorted by date (newest first)
export const getAllStoriesSorted = (): FacebookPost[] => {
  return [...facebookPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Get stories by type
export const getStoriesByType = (
  type: FacebookPost['type']
): FacebookPost[] => {
  return facebookPosts.filter((post) => post.type === type);
};

// Get video posts only
export const getVideoStories = (): FacebookPost[] => {
  return facebookPosts.filter((post) => post.type === 'video');
};

// Facebook page URL for external links
export const FACEBOOK_PAGE_URL = 'https://www.facebook.com/osamasharks';
export const FACEBOOK_VIDEOS_URL = 'https://www.facebook.com/osamasharks/videos';
export const FACEBOOK_PHOTOS_URL = 'https://www.facebook.com/osamasharks/photos';
