export interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat" | "other";
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
  videoUrl?: string | null;
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
    location: "Mumbai, Maharashtra",
    description: "Buddy is a friendly and energetic Golden Retriever who loves playing fetch and going on long walks. He's great with kids and other pets. He's been fully vaccinated and neutered. Looking for a loving forever home!",
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600",
    ],
    ownerId: "u1",
    ownerName: "Priya Sharma",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    isLive: true,
    isFeatured: true,
    createdAt: "2024-03-01",
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
    location: "Delhi, Delhi",
    description: "Rocky is a well-trained German Shepherd who is loyal, protective, and incredibly smart. He knows basic commands and is house-trained. He needs an active family with a yard.",
    images: [
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600",
    ],
    ownerId: "u3",
    ownerName: "Anjali Mehta",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    isLive: false,
    isFeatured: false,
    createdAt: "2024-03-08",
  },
  {
    id: "4",
    name: "Tweety",
    type: "other",
    breed: "Parrot",
    age: "6 months",
    gender: "male",
    vaccinated: false,
    price: 6250,
    location: "Bangalore, Karnataka",
    description: "Tweety is a playful Cockatiel who loves to whistle and sing. He's hand-tamed and very social. Comes with cage and accessories.",
    images: [
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600",
    ],
    ownerId: "u4",
    ownerName: "Rahul Verma",
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
    location: "Chennai, Tamil Nadu",
    description: "Cleo is a sweet and talkative Siamese cat. She's very affectionate and loves being the center of attention. Perfect companion for a quiet home.",
    images: [
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600",
    ],
    ownerId: "u5",
    ownerName: "Neha Gupta",
    ownerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    isLive: false,
    isFeatured: false,
    createdAt: "2024-03-12",
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
    location: "Hyderabad, Telangana",
    description: "Max is an energetic Labrador who loves water and playing outdoors. He's great with families and other dogs. Fully vaccinated and ready for his forever home.",
    images: [
      "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=600",
    ],
    ownerId: "u2",
    ownerName: "Arjun Patel",
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
    price: 25000,
    location: "Pune, Maharashtra",
    description: "Luna is a majestic Maine Coon with a stunning coat. She's independent but loves evening cuddles. Great with other cats.",
    images: [
      "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=600",
    ],
    ownerId: "u3",
    ownerName: "Anjali Mehta",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    isLive: false,
    isFeatured: false,
    createdAt: "2024-03-16",
  },
];

export const petTypes = ["dog", "cat", "other"] as const;
export const locations = ["Mumbai, Maharashtra", "Delhi, Delhi", "Bangalore, Karnataka", "Chennai, Tamil Nadu", "Hyderabad, Telangana", "Pune, Maharashtra", "Kolkata, West Bengal", "Ahmedabad, Gujarat", "Jaipur, Rajasthan", "Lucknow, Uttar Pradesh"];
