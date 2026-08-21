export interface SampleCrop {
  id: string;
  name: string;
  icon: string;
  crop: string;
  disease: string;
  imageUrl: string;
}

export const SAMPLE_CROPS: SampleCrop[] = [
  {
    id: "tomato_blight",
    name: "Tomato Blight",
    icon: "🍅",
    crop: "Tomato",
    disease: "Early Blight",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "corn_healthy",
    name: "Healthy Corn",
    icon: "🌽",
    crop: "Maize",
    disease: "Healthy Foliage",
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "apple_scab",
    name: "Apple Scab",
    icon: "🍎",
    crop: "Apple",
    disease: "Apple Scab (Venturia)",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "grape_blackrot",
    name: "Grape Rot",
    icon: "🍇",
    crop: "Grape",
    disease: "Black Rot",
    imageUrl: "https://images.unsplash.com/photo-1596368708356-6e1e1025ee73?q=80&w=800&auto=format&fit=crop"
  }
];
