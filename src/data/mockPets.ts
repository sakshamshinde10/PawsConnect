export interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat" | "bird" | "rabbit" | "other";
  breed: string;
  age: string;
  gender: "male" | "female";
  vaccinated: boolean;
  price: number;
  location: string;
  description: string;
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  isLive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export const mockPets: Pet[] = [
  {
    id: "1",
    name: "Buddy",
    type: "dog",
    breed: "Golden Retriever",
    age: "2 years",
    gender: "male",
    vaccinated: true,
    price: 0,
    location: "San Francisco, CA",
    description: "Buddy is a friendly and energetic Golden Retriever who loves playing fetch and going on long walks. He's great with kids and other pets. He's been fully vaccinated and neutered. Looking for a loving forever home!",
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600",
    ],
    ownerId: "u1",
    ownerName: "Sarah Johnson",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    isLive: true,
    isFeatured: true,
    createdAt: "2024-03-01",
  },
  {
    id: "2",
    name: "Whiskers",
    type: "cat",
    breed: "Persian",
    age: "1 year",
    gender: "female",
    vaccinated: true,
    price: 12500,
    location: "Los Angeles, CA",
    description: "Whiskers is a gorgeous Persian cat with beautiful blue eyes. She's very calm, loves to cuddle, and is perfect for apartment living. She's litter trained and great with children.",
    images: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600",
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600",
    ],
    ownerId: "u2",
    ownerName: "Mike Chen",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    isLive: false,
    isFeatured: true,
    createdAt: "2024-03-05",
  },
  {
    id: "3",
    name: "Rocky",
    type: "dog",
    breed: "German Shepherd",
    age: "3 years",
    gender: "male",
    vaccinated: true,
    price: 16500,
    location: "New York, NY",
    description: "Rocky is a well-trained German Shepherd who is loyal, protective, and incredibly smart. He knows basic commands and is house-trained. He needs an active family with a yard.",
    images: [
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600",
    ],
    ownerId: "u3",
    ownerName: "Emily Davis",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    isLive: false,
    isFeatured: false,
    createdAt: "2024-03-08",
  },
  {
    id: "4",
    name: "Tweety",
    type: "bird",
    breed: "Cockatiel",
    age: "6 months",
    gender: "male",
    vaccinated: false,
    price: 6250,
    location: "Chicago, IL",
    description: "Tweety is a playful Cockatiel who loves to whistle and sing. He's hand-tamed and very social. Comes with cage and accessories.",
    images: [
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600",
    ],
    ownerId: "u4",
    ownerName: "James Wilson",
    ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    isLive: true,
    isFeatured: false,
    createdAt: "2024-03-10",
  },
  {
    id: "5",
    name: "Cleo",
    type: "cat",
    breed: "Siamese",
    age: "4 years",
    gender: "female",
    vaccinated: true,
    price: 0,
    location: "Austin, TX",
    description: "Cleo is a sweet and talkative Siamese cat. She's very affectionate and loves being the center of attention. Perfect companion for a quiet home.",
    images: [
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600",
    ],
    ownerId: "u5",
    ownerName: "Lisa Park",
    ownerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    isLive: false,
    isFeatured: true,
    createdAt: "2024-03-12",
  },
  {
    id: "6",
    name: "Bun Bun",
    type: "rabbit",
    breed: "Holland Lop",
    age: "8 months",
    gender: "female",
    vaccinated: true,
    price: 50,
    location: "Portland, OR",
    description: "Bun Bun is an adorable Holland Lop rabbit with floppy ears. She's gentle and loves being petted. Great starter pet for families.",
    images: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600",
    ],
    ownerId: "u1",
    ownerName: "Sarah Johnson",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    isLive: false,
    isFeatured: false,
    createdAt: "2024-03-14",
  },
  {
    id: "7",
    name: "Max",
    type: "dog",
    breed: "Labrador",
    age: "1 year",
    gender: "male",
    vaccinated: true,
    price: 0,
    location: "Seattle, WA",
    description: "Max is an energetic Labrador who loves water and playing outdoors. He's great with families and other dogs. Fully vaccinated and ready for his forever home.",
    images: [
      "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=600",
    ],
    ownerId: "u2",
    ownerName: "Mike Chen",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    isLive: true,
    isFeatured: false,
    createdAt: "2024-03-15",
  },
  {
    id: "8",
    name: "Luna",
    type: "cat",
    breed: "Maine Coon",
    age: "2 years",
    gender: "female",
    vaccinated: true,
    price: 300,
    location: "Denver, CO",
    description: "Luna is a majestic Maine Coon with a stunning coat. She's independent but loves evening cuddles. Great with other cats.",
    images: [
      "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=600",
    ],
    ownerId: "u3",
    ownerName: "Emily Davis",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    isLive: false,
    isFeatured: true,
    createdAt: "2024-03-16",
  },
];

export const petTypes = ["dog", "cat", "bird", "rabbit", "other"] as const;
export const locations = ["San Francisco, CA", "Los Angeles, CA", "New York, NY", "Chicago, IL", "Austin, TX", "Portland, OR", "Seattle, WA", "Denver, CO"];
