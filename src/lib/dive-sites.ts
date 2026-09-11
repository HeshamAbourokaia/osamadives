export interface DiveSite {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  longDescription: string[];
  depthMin: number;
  depthMax: number;
  level: "All Levels" | "Open Water+" | "Advanced+" | "Technical";
  distanceFromDahab: string;
  bestFor: string[];
  marineLife: string[];
  featuredImage: string;
  imageAlt: string;
  keywords: string[];
}

export const diveSites: DiveSite[] = [
  {
    slug: "blue-hole-dahab",
    name: "The Blue Hole, Dahab",
    shortName: "Blue Hole",
    tagline: "Dahab's most famous dive site - a submarine sinkhole on the Red Sea coast",
    description:
      "The Blue Hole is the icon of Dahab diving. A vertical submarine sinkhole on the Red Sea coast, 5km north of Dahab town, with depths well beyond 100 metres. Famous for the 55m arch that connects the hole to open sea, the saddle at 7m, and a long history with both recreational and technical divers.",
    longDescription: [
      "The Blue Hole is the dive site most people think of when they think of Dahab. It is a near-perfect circle of deep blue water punched into the coastal reef, with depths that drop past 100 metres into darkness. Above it, the Sinai mountains. Around it, the shallow reef teeming with fusiliers, butterflyfish, and snappers.",
      "For Open Water divers, the Blue Hole is a beautiful shallow dive: you enter through the saddle at 7 metres and explore the rim of the hole at 10-20m, where soft corals and reef fish thrive. For Advanced divers, the 30m dive along the outer wall is one of the most dramatic in the Red Sea. For technical divers, the famous arch at 55m connecting the hole to the open sea is a milestone many work toward over years.",
      "I have dived the Blue Hole more than a thousand times. I know its moods - which days the visibility is glass-clear, which season the jacks school in tightest, which times of day the light shafts cut through the deepest. I take guests in safely, brief them properly, and dive within their training. The Blue Hole has a reputation. I work hard to make sure every guest's experience honours the site without becoming a statistic.",
    ],
    depthMin: 5,
    depthMax: 100,
    level: "All Levels",
    distanceFromDahab: "5 km north",
    bestFor: ["Iconic Dahab dive", "Wall diving", "Technical diving training", "Photography"],
    marineLife: ["Blue and gold fusiliers", "Butterflyfish", "Glassfish schools", "Reef sharks (occasional)", "Whale sharks (rare)", "Eagle rays"],
    featuredImage: "/images/OsamaDives_The_Blue_Hole.jpeg",
    imageAlt: "The Blue Hole at Dahab from the air: the dark shaft cut through the shallow reef, the shore road and the cafes along the edge",
    keywords: [
      "Blue Hole Dahab",
      "Blue Hole diving",
      "Dahab Blue Hole dive site",
      "Red Sea Blue Hole",
      "Blue Hole arch 55m",
      "Blue Hole Egypt",
      "technical diving Dahab",
      "Sinai diving",
    ],
  },
  {
    slug: "the-canyon-dahab",
    name: "The Canyon, Dahab",
    shortName: "The Canyon",
    tagline: "An underwater canyon dive with dramatic light and big-fish encounters",
    description:
      "The Canyon is a dramatic underwater rift in the reef, 5km north of Dahab. Divers descend through a narrow split in the coral wall and emerge in a deep canyon at 30 metres, lit from above by shafts of sunlight. One of the most atmospheric dives on the Sinai coast.",
    longDescription: [
      "The Canyon sits a short drive north of Dahab town and just south of the Blue Hole. From the surface it looks unremarkable - reef shallows, sand, a fringing coral garden. The drama is underwater. The reef splits open into a long vertical canyon that drops to about 30 metres, with the canyon walls climbing back up to a coral-covered ceiling.",
      "Inside the canyon the light changes. Shafts of sun spear down through gaps in the ceiling, picking out clouds of glassfish that fill the space. Large groupers hang motionless in shadow. Lionfish patrol the walls. The sand floor is patterned with the burrows of garden eels at the canyon mouth.",
      "I dive the Canyon with Advanced Open Water divers and above. It is not technically demanding, but the depth, the enclosed feeling, and the disorientation of being inside a coral-rock chamber call for solid buoyancy and a good gas plan. Properly briefed, it is one of the dives guests remember for years.",
    ],
    depthMin: 10,
    depthMax: 30,
    level: "Advanced+",
    distanceFromDahab: "5 km north",
    bestFor: ["Dramatic light", "Underwater photography", "Big-fish spotting", "Advanced training"],
    marineLife: ["Glassfish schools", "Large groupers", "Lionfish", "Garden eels", "Octopus", "Crocodilefish"],
    featuredImage: "/images/sites/the-canyon.webp",
    imageAlt: "Inside the Canyon at Dahab: a diver in the narrow fissure at twenty seven metres, with daylight in the slot above",
    keywords: [
      "The Canyon Dahab",
      "Canyon dive Dahab",
      "Dahab canyon diving",
      "underwater canyon Egypt",
      "Sinai diving",
      "Red Sea Canyon",
      "Dahab diving sites",
    ],
  },
  {
    slug: "lighthouse-reef-dahab",
    name: "Lighthouse Reef, Dahab",
    shortName: "Lighthouse",
    tagline: "The town dive site - perfect for training, night dives, and macro",
    description:
      "Lighthouse Reef is Dahab's home dive. Right in town, easy shore entry, gentle slope to a healthy coral wall. Where most students take their first ocean breaths, and where instructors and locals come back for the macro life and the night dives.",
    longDescription: [
      "Lighthouse sits right on the Dahab promenade, named for the small white lighthouse on the shore. The entry is a short walk from any of the seafront dive centres. The site begins as a sandy slope at 3-6 metres, drops to a coral garden at 10-12m, then continues as a reef wall to about 30 metres for those who go deeper.",
      "It is where most students do their open-water training dives. The calm, shallow entry takes the stress out of first descents, and the visibility is usually excellent. But Lighthouse is not just a training site. The reef is one of the healthiest in Dahab, full of damselfish, butterflyfish, and angelfish, and at night it transforms. Octopuses come out to hunt. Spanish dancers feed on the sponges. Crustaceans I rarely see in daylight appear under torchlight.",
      "I run a lot of night dives here. The walk-in entry makes it the easiest spot to dive after dark, and the marine life rewards the effort. For new divers wanting their first night dive, this is the site I always recommend.",
    ],
    depthMin: 3,
    depthMax: 30,
    level: "All Levels",
    distanceFromDahab: "In town",
    bestFor: ["Training", "Night dives", "Macro photography", "Refresher dives", "Easy shore entry"],
    marineLife: ["Octopus", "Lionfish", "Frogfish (lucky)", "Spanish dancers (night)", "Anemonefish", "Triggerfish", "Damselfish swarms"],
    featuredImage: "/images/sites/lighthouse-reef.webp",
    imageAlt: "Osama on the reef at Dahab in a cloud of anthias, the small orange fish that hang over the coral all day",
    keywords: [
      "Lighthouse Reef Dahab",
      "Lighthouse diving Dahab",
      "Dahab shore diving",
      "Dahab night dive",
      "Dahab training dives",
      "PADI training Dahab",
      "Red Sea night diving",
    ],
  },
  {
    slug: "eel-garden-dahab",
    name: "Eel Garden, Dahab",
    shortName: "Eel Garden",
    tagline: "A sandy slope alive with garden eels, bluespotted rays, and reef life",
    description:
      "Eel Garden sits at the north end of Dahab town - a long sandy slope dotted with hundreds of garden eels rising from their burrows like underwater grass. Easy, beautiful, and the best place in Dahab to see bluespotted ribbontail rays.",
    longDescription: [
      "Eel Garden is the dive I bring guests on when they want to relax. The site is a wide sandy slope from the shore down to about 25 metres, with garden eels rising out of the sand in vast colonies. From a distance the sand looks like it is gently waving - those are the eels, swaying in the current, dropping back into their holes if you swim too close.",
      "Beyond the garden, the reef edge begins at 12-15m and continues as a gentle wall. The marine life here is varied. Bluespotted ribbontail rays rest on the sand patches. Goatfish probe the bottom. Schools of fusiliers sweep overhead in the blue. Lucky divers spot the occasional stingray or stonefish.",
      "It is a perfect site for newer divers building hours after their Open Water cert. Gentle profile, easy navigation, lots to see at every depth.",
    ],
    depthMin: 5,
    depthMax: 25,
    level: "Open Water+",
    distanceFromDahab: "In town, north end",
    bestFor: ["Easy diving", "Spotting rays", "Building dive hours", "Family-friendly"],
    marineLife: ["Garden eels (hundreds)", "Bluespotted ribbontail rays", "Goatfish", "Fusiliers", "Stingrays", "Anemonefish"],
    featuredImage: "/images/sites/eel-garden.webp",
    imageAlt: "A spotted eagle ray gliding over the shallow reef plate at Dahab, a diver following behind it",
    keywords: [
      "Eel Garden Dahab",
      "Eel Garden diving",
      "Dahab garden eels",
      "bluespotted rays Dahab",
      "easy diving Dahab",
      "Dahab dive sites",
      "Red Sea diving Egypt",
    ],
  },
  {
    slug: "three-pools-dahab",
    name: "Three Pools, Dahab",
    shortName: "Three Pools",
    tagline: "Coral-rimmed swim-throughs that connect shallow pools to the open reef",
    description:
      "Three Pools is a series of shallow coral-rimmed pools on the reef plate at Dahab. Swim-throughs in the coral connect each pool to the next and eventually drop you out onto the reef wall. A favourite for training, fun dives, and underwater photography in dramatic light.",
    longDescription: [
      "Three Pools sits just north of Dahab town, on a section of reef plate that the surf has carved into a pattern of shallow pools. From above you can see them clearly - three near-circular pools of clear blue, fringed in coral, connected to each other by short coral tunnels.",
      "The dive enters through one of the pools at about 3 metres. From there, you swim through the tunnels - some only a couple of metres long, some longer - and pop out into the next pool or out onto the reef wall. The wall drops to 20-25m and the reef life is dense: butterflyfish, parrotfish grazing the coral, the occasional turtle in the shallows.",
      "I love bringing students here for fun dives after their training. The swim-throughs build confidence without ever being scary - they are short, wide, and brightly lit. And the light in the pools, with sun shafts breaking through, is some of the most photogenic diving in Dahab.",
    ],
    depthMin: 3,
    depthMax: 25,
    level: "Open Water+",
    distanceFromDahab: "5 km north",
    bestFor: ["Swim-throughs", "Photography", "Fun dives", "Turtles (lucky)"],
    marineLife: ["Parrotfish", "Butterflyfish", "Turtles (occasional)", "Trumpetfish", "Anthias swarms", "Moray eels"],
    featuredImage: "/images/sites/three-pools.webp",
    imageAlt: "Osama standing on the sand inside a coral swim-through at Dahab, giving the OK sign with both hands",
    keywords: [
      "Three Pools Dahab",
      "Three Pools diving",
      "Dahab swim throughs",
      "Dahab coral pools",
      "Dahab reef diving",
      "Red Sea pools",
      "Sinai diving",
    ],
  },
];

export function getDiveSiteBySlug(slug: string): DiveSite | undefined {
  return diveSites.find((s) => s.slug === slug);
}
