export type RoomType = 'Living Room' | 'Bedroom' | 'Bathroom' | 'Kitchen' | 'Building Exterior';

export interface DesignStyle {
  id: string;
  name: string;
  promptDescription: string;
  icon?: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
}
